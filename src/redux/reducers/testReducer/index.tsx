import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type testType = {
    testid: string;
    duplicateTestId: string;
    selectedQuestionId: string;
};

type TestState = {
    tests: testType[];
    duplicateTestId: string[];
    selectedQuestionId: string;
};

const initialState: TestState = {
    tests: [],
    duplicateTestId: [],
    selectedQuestionId: ''
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
        },
        setSelectedQuestionId(state, action: PayloadAction<string>) {
            state.selectedQuestionId = action.payload;
        }
    }
});

export const { setTest, setDuplicateTestId, setSelectedQuestionId } = testSlice.actions;
export default testSlice.reducer;
