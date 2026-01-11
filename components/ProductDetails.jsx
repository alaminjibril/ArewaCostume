'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter();

    const [mainImage, setMainImage] = useState(product.images[0]);
    const [selectedSize, setSelectedSize] = useState("");

    // Parse sizes from JSON
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const hasSizes = sizes.length > 0;

    const addToCartHandler = () => {
        // Check if product needs size selection
        if (hasSizes && !selectedSize) {
            toast.error("Please select a size");
            return;
        }

        // Check if selected size is in stock
        if (hasSizes) {
            const sizeInfo = sizes.find(s => s.size === selectedSize);
            if (!sizeInfo || sizeInfo.stock <= 0) {
                toast.error("Selected size is out of stock");
                return;
            }
        }

        dispatch(addToCart({ productId, size: selectedSize || "N/A" }));
    };

    const averageRating = product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length;
    
    // Check if current selection is in cart
    const cartKey = hasSizes ? `${productId}_${selectedSize}` : productId;
    const isInCart = cart[cartKey];

    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                            <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
                    <Image src={mainImage} alt="" width={250} height={250} />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{product.rating.length} Reviews</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product.price} </p>
                    <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
                </div>

                {/* Size Selection */}
                {hasSizes && (
                    <div className="mt-6">
                        <p className="text-lg text-slate-800 font-semibold mb-3">Select Size</p>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((sizeObj) => {
                                const isOutOfStock = sizeObj.stock <= 0;
                                const isSelected = selectedSize === sizeObj.size;
                                
                                return (
                                    <button
                                        key={sizeObj.size}
                                        onClick={() => !isOutOfStock && setSelectedSize(sizeObj.size)}
                                        disabled={isOutOfStock}
                                        className={`px-4 py-2 rounded border transition ${
                                            isSelected
                                                ? 'bg-slate-800 text-white border-slate-800'
                                                : isOutOfStock
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                                        }`}
                                    >
                                        {sizeObj.size}
                                        {isOutOfStock && <span className="text-xs ml-1">(Out)</span>}
                                    </button>
                                );
                            })}
                        </div>
                        {selectedSize && (
                            <p className="text-sm text-slate-500 mt-2">
                                {sizes.find(s => s.size === selectedSize)?.stock} items available
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-end gap-5 mt-10">
                    {
                        isInCart && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                <Counter productId={productId} size={selectedSize || "N/A"} />
                            </div>
                        )
                    }
                    <button 
                        onClick={() => !isInCart ? addToCartHandler() : router.push('/cart')} 
                        className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition"
                    >
                        {!isInCart ? 'Add to Cart' : 'View Cart'}
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Free shipping worldwide </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails