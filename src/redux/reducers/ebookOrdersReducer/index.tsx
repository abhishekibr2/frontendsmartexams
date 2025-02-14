
import { OrderDetail } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EbookOrderState {
    ebookOrders: OrderDetail[];
    ebookOrderLoading: boolean;
    error: string | null;
    ebookInfoModal: boolean;
    singleEbookOrderInfo: OrderDetail | null;
    ebookOrderPage: number;
    ebookOrderLimit: number;
    ebookOrderTotalCount: number;
    ebookOrderSearch: string;
    ebookFilterId: string;
}

const initialState: EbookOrderState = {
    ebookOrders: [],
    ebookOrderLoading: true,
    error: null,
    ebookInfoModal: false,
    singleEbookOrderInfo: null,
    ebookOrderPage: 1,
    ebookOrderLimit: 10,
    ebookOrderTotalCount: 0,
    ebookOrderSearch: '',
    ebookFilterId: '',
};

const ebookOrdersSlice = createSlice({
    name: 'ebookOrders',
    initialState,
    reducers: {
        setEbookOrders: (state, action: PayloadAction<OrderDetail[]>) => {
            state.ebookOrders = action.payload;
        },
        setEbookInfoModal: (state, action: PayloadAction<boolean>) => {
            state.ebookInfoModal = action.payload;
        },
        setSingleEbookOrderInfo: (state, action: PayloadAction<OrderDetail | null>) => {
            state.singleEbookOrderInfo = action.payload;
        },
        setEbookOrderPage: (state, action: PayloadAction<number>) => {
            state.ebookOrderPage = action.payload;
        },
        setEbookOrderLimit: (state, action: PayloadAction<number>) => {
            state.ebookOrderLimit = action.payload;
        },
        setEbookOrderTotalCount: (state, action: PayloadAction<number>) => {
            state.ebookOrderTotalCount = action.payload;
        },
        setEbookOrderLoading: (state, action: PayloadAction<boolean>) => {
            state.ebookOrderLoading = action.payload;
        },
        setEbookOrderSearch: (state, action: PayloadAction<string>) => {
            state.ebookOrderSearch = action.payload;
        },
        setEbookFilterId: (state, action: PayloadAction<string>) => {
            state.ebookFilterId = action.payload;
        },
    },
});

export const {
    setEbookOrders,
    setEbookInfoModal,
    setSingleEbookOrderInfo,
    setEbookOrderPage,
    setEbookOrderLimit,
    setEbookOrderTotalCount,
    setEbookOrderLoading,
    setEbookOrderSearch,
    setEbookFilterId,
} = ebookOrdersSlice.actions;

export default ebookOrdersSlice.reducer;
