
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type testimonial = {
    _id: string;
    createdAt: string;
    createdBy: string | null;
    deletedAt: string;
    deletedBy: string | null;
    description: string;
    designation: string;
    image: string | null;
    name: string;
    status: 'active' | 'inactive';
    updatedAt: string;
    updatedBy: string | null;
    state: {
        _id: any;
        title: 'string'
    },
    pages: any,
    examType: any
    __v: number;
}

type testimonialState = {
    testimonial: testimonial[];
    modal: boolean
    fetchTestimonials: boolean;
    editData: testimonial | null;



}

const initialState: testimonialState = {
    testimonial: [],
    modal: false,
    fetchTestimonials: false,
    editData: null,
};

export const testimonialSlice = createSlice({
    name: 'testimonial',
    initialState,
    reducers: {
        setTestimonial(state, action: PayloadAction<testimonial[]>) {
            state.testimonial = action.payload;
        },
        setModal: (state, action: PayloadAction<boolean>) => {
            state.modal = action.payload;
        },
        setFetchTestimonials: (state, action: PayloadAction<boolean>) => {
            state.fetchTestimonials = action.payload;
        },
        setEditData: (state, action: PayloadAction<testimonial | null>) => {
            state.editData = action.payload;
        }
    }
});

export const { setTestimonial, setModal, setFetchTestimonials, setEditData } = testimonialSlice.actions;
export default testimonialSlice.reducer;
