import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//toggle stock of the product 
export async function POST(request) {
    try {
        
        const { userId } = getAuth(request)

        //get the product id
        const { productId } = await request.json()

        //check for product id
        if (!productId) {
            return NextResponse.json({error: "missing details: productId"}, {status: 400});
        }
        //get store id
        const storeId = await authSeller(userId)
        //check for store id
        if (!storeId) {
            return NextResponse.json({error: "not authorized"}, { status: 400});
        }

        //check if product exist
        const product = await prisma.product.findFirst({
            where: {id: productId, storeId}
        })

        if (!product) {
            return NextResponse.json({error: "no product found"}, {status: 404})
        }

        await prisma.product.update({
            where: {id: productId},
            data: {inStock: !product.inStock}    
        })

        return NextResponse.json({message: "product stock updated successfully"})

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status: 400})
    }
}