import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type testType = {
    testid: string;
    duplicateTestId: string;
};

type TestState = {
    tests: testType[];
    duplicateTestId: string[];
};

const initialState: TestState = {
    tests: [],
    duplicateTestId: []
};

export const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        setTest(state, action: PayloadAction<testType[]>) {
            state.tests = action.payload;
        },
        setDuplicateTestId(state, action: PayloadAction<string[]>) {
            state.duplicateTestId = action.payload;
        }
    }
});

export const { setTest, setDuplicateTestId } = testSlice.actions;
export default testSlice.reducer;
