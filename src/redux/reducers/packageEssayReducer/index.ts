import { PackageEssay } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type packageEssayState = {
    packageEssay: PackageEssay[];
    currentService: PackageEssay | null;
};

const initialState: packageEssayState = {
    packageEssay: [],
    currentService: null,
};


export const packageEssayReducerSlice = createSlice({
    name: 'packageEssay',
    initialState,
    reducers: {
        setPackageEssay: (state, action: PayloadAction<PackageEssay[]>) => {
            state.packageEssay = action.payload;
        },
        setCurrentPackageEssay: (state, action: PayloadAction<PackageEssay>) => {
            state.currentService = action.payload;
        },
    },
})


export const { setPackageEssay, setCurrentPackageEssay } = packageEssayReducerSlice.actions;
export default packageEssayReducerSlice.reducer;
