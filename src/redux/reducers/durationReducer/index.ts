import { Duration } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type DurationState = {
    duration: Duration[];
    currentDuration: Duration | null;
};

const initialState: DurationState = {
    duration: [],
    currentDuration: null,
};


export const durationSlice = createSlice({
    name: 'duration',
    initialState,
    reducers: {
        setDuration: (state, action: PayloadAction<Duration[]>) => {
            state.duration = action.payload;
        },
        setCurrentDuration: (state, action: PayloadAction<Duration>) => {
            state.currentDuration = action.payload;
        },
    },
})


export const { setDuration, setCurrentDuration } = durationSlice.actions;
export default durationSlice.reducer;
