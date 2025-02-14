import { CartData } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItems = {
    eBook: [{
        eBookId: string;
        _id: string;
        quantity: number;
    }],
    packages: [{
        packageId: string;
        _id: string;
        quantity: number;
    }],
    _id: string
}


type CartState = {
    cartItems: CartItems | undefined,
    totalCount: number,
}

const initialState: CartState = {
    cartItems: undefined,
    totalCount: 0,
}

export const userCartSlice = createSlice({
    name: "userCart",
    initialState,
    reducers: {
        setCartItems: (state, action: PayloadAction<CartItems>) => {
            state.cartItems = action.payload;
        },
        setTotalCount: (state, action: PayloadAction<number>) => {
            state.totalCount = action.payload;
        }
    }
})

export const { setTotalCount, setCartItems } = userCartSlice.actions
export default userCartSlice.reducer
