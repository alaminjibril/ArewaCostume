import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { PaymentMethod } from "@prisma/client";
import { NextResponse } from "next/server";

// Helper function to parse cart key
const parseCartKey = (cartKey) => {
    const parts = String(cartKey).split('_');
    if (parts.length === 1) {
        return { productId: parts[0], size: "N/A" };
    }
    return { productId: parts[0], size: parts.slice(1).join('_') };
};

export async function POST(request) {
    try {
        const { userId, has } = getAuth(request)
        if (!userId) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }
        
        const { addressId, items, couponCode, paymentMethod } = await request.json()

        // Check if fields are present
        if (!addressId || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "missing order details" }, { status: 401 });
        }

        let coupon = null;

        if (couponCode) {
            coupon = await prisma.coupon.findUnique({
                where: { code: couponCode }
            })

            if (!coupon) {
                return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
            }
        }
        
        // Check if coupon is applicable for new users
        if (couponCode && coupon.forNewUser) {
            const userorders = await prisma.order.findMany({
                where: { userId }
            })
            if (userorders.length > 0) {
                return NextResponse.json({ error: "Coupon valid for new users" }, { status: 400 })
            }
        }

        const isPlusMember = has({ plan: 'plus' })

        // Check if coupon is applicable for members
        if (couponCode && coupon.forMember) {
            if (!isPlusMember) {
                return NextResponse.json({ error: "Coupon valid for members only" }, { status: 400 })
            }
        }

        // Group orders by storeId using a Map
        const ordersByStore = new Map()

        for (const item of items) {
            // Parse the item ID to get productId and size
            const { productId, size } = parseCartKey(item.id);
            
            const product = await prisma.product.findUnique({
                where: { id: productId }
            })

            if (!product) {
                return NextResponse.json({ error: `Product ${productId} not found` }, { status: 404 })
            }

            // Validate stock for sized products
            if (size !== "N/A" && product.sizes) {
                const sizeInfo = product.sizes.find(s => s.size === size);
                if (!sizeInfo) {
                    return NextResponse.json({ error: `Size ${size} not found for ${product.name}` }, { status: 400 })
                }
                if (sizeInfo.stock < item.quantity) {
                    return NextResponse.json({ 
                        error: `Only ${sizeInfo.stock} items available for ${product.name} in size ${size}` 
                    }, { status: 400 })
                }
            }

            const storeId = product.storeId
            if (!ordersByStore.has(storeId)) {
                ordersByStore.set(storeId, [])
            }
            ordersByStore.get(storeId).push({
                productId,
                size,
                quantity: item.quantity,
                price: product.price
            })
        }

        let orderId = [];
        let fullAmount = 0;
        let isShippingFeeAdded = false

        // Create orders for each seller
        for (const [storeId, sellerItems] of ordersByStore.entries()) {
            let total = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

            if (couponCode) {
                total -= (total * coupon.discount) / 100;
            }

            if (!isPlusMember && !isShippingFeeAdded) {
                total += 2000;
                isShippingFeeAdded = true
            }

            fullAmount += parseFloat(total.toFixed(2))

            const order = await prisma.order.create({
                data: {
                    userId,
                    storeId,
                    addressId,
                    total: parseFloat(total.toFixed(2)),
                    paymentMethod,
                    isCouponUsed: coupon ? true : false,
                    coupon: coupon ? coupon : {},
                    orderItems: {
                        create: sellerItems.map(item => ({
                            productId: item.productId,
                            size: item.size,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            })
            orderId.push(order.id)

            // Update stock for sized products
            for (const item of sellerItems) {
                if (item.size !== "N/A") {
                    const product = await prisma.product.findUnique({
                        where: { id: item.productId }
                    });

                    if (product.sizes && Array.isArray(product.sizes)) {
                        const sizes = [...product.sizes];
                        const sizeIndex = sizes.findIndex(s => s.size === item.size);

                        if (sizeIndex !== -1) {
                            sizes[sizeIndex].stock -= item.quantity;

                            await prisma.product.update({
                                where: { id: item.productId },
                                data: { sizes }
                            });
                        }
                    }
                }
            }
        }

        // Clear the cart
        await prisma.user.update({
            where: { id: userId },
            data: { cart: {} }
        })

        return NextResponse.json({ 
            message: "Orders Placed Successfully",
            orderIds: orderId,
            total: fullAmount
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// Get all orders for a user
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const orders = await prisma.order.findMany({
            where: {
                userId, OR: [
                    { paymentMethod: PaymentMethod.COD },
                    { AND: [{ paymentMethod: PaymentMethod.STRIPE }, { isPaid: true }] }
                ]
            },
            include: {
                orderItems: { include: { product: true } },
                address: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ orders })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}