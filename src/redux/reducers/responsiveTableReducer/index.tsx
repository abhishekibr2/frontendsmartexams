import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TableState = {
    currentPage: number,
    pageSize: number,
    total: number
}

const initialState: TableState = {
    currentPage: 1,
    pageSize: 10,
    total: 0
}

export const responsiveTableSlice = createSlice({
    name: "responsiveTable",
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload
        },
        setTotal: (state, action: PayloadAction<number>) => {
            state.total = action.payload;
        },
        reset: () => initialState,  // Reset state to initial state when component unmounts.
    }
})

export const {
    setCurrentPage,
    setPageSize,
    setTotal,
    reset
} = responsiveTableSlice.actions

export default responsiveTableSlice.reducer;
