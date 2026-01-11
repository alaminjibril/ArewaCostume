import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

let debounceTimer = null

export const uploadCart = createAsyncThunk('cart/uploadCart',
    async ({ getToken}, thunkAPI) => {
        try {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(async () => {
                const { cartItems} = thunkAPI.getState().cart;
                const token = await getToken();
                await axios.post("/api/cart", {cart: cartItems}, {headers: {Authorization: `Bearer ${token}`}})
            },1000)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const fetchCart = createAsyncThunk('cart/fetchCart',
    async ({ getToken}, thunkAPI) => {
        try {
            const token = await getToken()
            const { data } = await axios.get("/api/cart", {headers: {Authorization: `Bearer ${token}`}})
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId, size = "N/A" } = action.payload
            // Create unique cart key: productId_size or just productId if no size
            const cartKey = size === "N/A" ? productId : `${productId}_${size}`
            
            if (state.cartItems[cartKey]) {
                state.cartItems[cartKey]++
            } else {
                state.cartItems[cartKey] = 1
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { productId, size = "N/A" } = action.payload
            const cartKey = size === "N/A" ? productId : `${productId}_${size}`
            
            if (state.cartItems[cartKey]) {
                state.cartItems[cartKey]--
                if (state.cartItems[cartKey] === 0) {
                    delete state.cartItems[cartKey]
                }
                state.total -= 1
            }
        },
        deleteItemFromCart: (state, action) => {
            const { productId, size = "N/A" } = action.payload
            const cartKey = size === "N/A" ? productId : `${productId}_${size}`
            
            state.total -= state.cartItems[cartKey] ? state.cartItems[cartKey] : 0
            delete state.cartItems[cartKey]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.cartItems = action.payload.cart
            state.total = Object.values(action.payload.cart).reduce((acc, item)=> acc + item, 0)
        })
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer