import { Grade } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type GradeState = {
    grades: Grade[];
    currentGrade: Grade | null;
};

const initialState: GradeState = {
    grades: [],
    currentGrade: null,
};


export const gradeSlice = createSlice({
    name: 'grade',
    initialState,
    reducers: {
        setGrades: (state, action: PayloadAction<Grade[]>) => {
            state.grades = action.payload;
        },
        setCurrentGrade: (state, action: PayloadAction<Grade>) => {
            state.currentGrade = action.payload;
        },
    },
})


export const { setGrades, setCurrentGrade } = gradeSlice.actions;
export default gradeSlice.reducer;
