'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId, size = "N/A" }) => {

    const { cartItems } = useSelector(state => state.cart);
    
    // Create cart key based on productId and size
    const cartKey = size === "N/A" ? productId : `${productId}_${size}`;

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId, size }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId, size }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none">-</button>
            <p className="p-1">{cartItems[cartKey] || 0}</p>
            <button onClick={addToCartHandler} className="p-1 select-none">+</button>
        </div>
    )
}

export default Counter