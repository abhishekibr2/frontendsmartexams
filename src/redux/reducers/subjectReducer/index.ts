import { Subject } from "@/lib/types";
import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type SubjectState = {
    subjects: Subject[];
    currentSubjects: Subject | null;
};

const initialState: SubjectState = {
    subjects: [],
    currentSubjects: null,
};


export const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        setSubjects: (state, action: PayloadAction<Subject[]>) => {
            state.subjects = action.payload;
        },
        setCurrentSubjects: (state, action: PayloadAction<Subject>) => {
            state.currentSubjects = action.payload;
        },
    },
})


export const { setSubjects, setCurrentSubjects } = subjectSlice.actions;
export default subjectSlice.reducer;

export const subjestState = (state: RootState) => state.subjectReducer;
