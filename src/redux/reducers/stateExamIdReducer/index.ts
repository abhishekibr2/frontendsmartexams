import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StateData {  // Exported interface
    stateId: string;
    // examTypeId: string;
}

const initialState: StateData = {
    stateId: '',
    // examTypeId: '',
};

export const stateExamIdSlice = createSlice({
    name: 'stateData',
    initialState,
    reducers: {
        setStateData: (state, action: PayloadAction<StateData>) => {
            state.stateId = action.payload.stateId;
            // state.examTypeId = action.payload.examTypeId;
        },
    },
});

export const { setStateData } = stateExamIdSlice.actions;
export default stateExamIdSlice.reducer;
