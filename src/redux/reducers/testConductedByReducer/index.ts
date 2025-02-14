import { TestConductBy } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TestConductByState = {
    testConductBy: TestConductBy[];
    currentTestConductBy: TestConductBy | null;
    found: boolean;
    matchedPackageIds: string[]; // This will hold the matched package IDs or testIds
};

const initialState: TestConductByState = {
    testConductBy: [],
    currentTestConductBy: null,
    found: false,
    matchedPackageIds: [], // Initialize as an empty array
};


export const testConductBySlice = createSlice({
    name: 'testConductBy',
    initialState,
    reducers: {
        setTestConductBy: (state, action: PayloadAction<TestConductBy[]>) => {
            state.testConductBy = action.payload;
        },
        setCurrentTestConductBy: (state, action: PayloadAction<TestConductBy>) => {
            state.currentTestConductBy = action.payload;
        },
        setFound: (state, action: PayloadAction<boolean>) => {
            state.found = action.payload;
        },
        setMatchedPackageIds: (state, action: PayloadAction<string[]>) => {
            state.matchedPackageIds = action.payload;
        },

    },
})


export const { setTestConductBy, setCurrentTestConductBy, setFound, setMatchedPackageIds } = testConductBySlice.actions;
export default testConductBySlice.reducer;
