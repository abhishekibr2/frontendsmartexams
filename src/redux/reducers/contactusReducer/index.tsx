
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from "@/lib/types";

type ContactUsState = {
    contactUsData: Contact[];
};

const initialState: ContactUsState = {
    contactUsData: [],
};

const contactUsSlice = createSlice({
    name: 'contactUs',
    initialState,
    reducers: {
        setContactUsData: (state, action: PayloadAction<Contact[]>) => {
            state.contactUsData = action.payload;
        },
    },
});

export const { setContactUsData } = contactUsSlice.actions;
export default contactUsSlice.reducer;
