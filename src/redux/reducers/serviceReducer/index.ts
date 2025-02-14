import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Service = {
    slug: string;
    // authorId: any;
    _id: string;
    key?: string;
    title: string;
    status: string,
    description: string;
    address?: string;
    // blogViewCount?: number,
    name: string,
    createdAt: string,
    image: string;
    authorId: {
        name: string; _id: string
    };



}


type ServiceState = {
    services: Service[];
    currentService: Service | null;
};

const initialState: ServiceState = {
    services: [],
    currentService: null,
};


export const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        setServices: (state, action: PayloadAction<Service[]>) => {
            state.services = action.payload;
        },
        setCurrentService: (state, action: PayloadAction<Service>) => {
            state.currentService = action.payload;
        },
    },
})


export const { setServices, setCurrentService } = serviceSlice.actions;
export default serviceSlice.reducer;
