import { Complexity } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type ComplexityState = {
    complexity: Complexity[];
    currentComplexity: Complexity | null;
};

const initialState: ComplexityState = {
    complexity: [],
    currentComplexity: null,
};


export const complexitySlice = createSlice({
    name: 'complexity',
    initialState,
    reducers: {
        setComplexity: (state, action: PayloadAction<Complexity[]>) => {
            state.complexity = action.payload;
        },
        setCurrentComplexity: (state, action: PayloadAction<Complexity>) => {
            state.currentComplexity = action.payload;
        },
    },
})


export const { setComplexity, setCurrentComplexity } = complexitySlice.actions;
export default complexitySlice.reducer;
