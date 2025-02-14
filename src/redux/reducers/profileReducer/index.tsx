import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadFile } from 'antd';


type ProfileState = {
    phone: string;
    country: string;
    loading: boolean;
    name: string;
    profile: UploadFile[]
}

const initialState: ProfileState = {
    phone: '',
    country: '',
    loading: false,
    name: '',
    profile: []
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setPhone: (state, action: PayloadAction<string>) => {
            state.phone = action.payload;
        },
        setCountry: (state, action: PayloadAction<string>) => {
            state.country = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },

        setProfile: (state, action: PayloadAction<UploadFile[]>) => {
            state.profile = action.payload;
        },

        resetProfile: () => initialState,
    },
});

export const { setPhone, setCountry, setLoading, resetProfile, setName, setProfile } = profileSlice.actions;

export default profileSlice.reducer;
