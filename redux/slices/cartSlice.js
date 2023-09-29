import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";


const initialState = {
    loading: true,
    cartItems: [],
}


const addDecimals = (num) => {
    return (Math.round(num*100) / 100).toFixed(2)
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers: {
        addtoCart: (state, action) => {
            const item = action.payload
            const existItem = state.cartItems.find((x) => x.id ===  item.id)
            if(existItem){
                state.cartItems = state.cartItems.map((x) => {
                    x.id === existItem.id ? item : x
                })
            }
            else{
                state.cartItems = [...state.cartItems, item]
            }
            state.itemsPrice = addDecimals(
                state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
              )
              state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 100)
              state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice))
              state.totalPrice = Number(state.itemsPrice)
              Cookies.set('cart', JSON.stringify(state))

        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.id !== action.payload)
            state.itemsPrice = addDecimals(
              state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
            )
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 100)
            state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice))
            state.totalPrice = Number(state.itemsPrice) 
            Cookies.set('cart', JSON.stringify(state))
        },
        hideloading: (state) => {
            state.loading = false
        }
    },
})

export const {addtoCart, removeFromCart, hideloading} = cartSlice.actions

export default cartSlice.reducer