import { ExamType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type ExamTypeState = {
    examTypes: ExamType[];
    currentExamType: ExamType | null;
};

const initialState: ExamTypeState = {
    examTypes: [],
    currentExamType: null,
};


export const examTypeSlice = createSlice({
    name: 'examType',
    initialState,
    reducers: {
        setExamType: (state, action: PayloadAction<ExamType[]>) => {
            state.examTypes = action.payload;
        },
        setCurrentExamType: (state, action: PayloadAction<ExamType>) => {
            state.currentExamType = action.payload;
        },
    },
})


export const { setExamType, setCurrentExamType } = examTypeSlice.actions;
export default examTypeSlice.reducer;
