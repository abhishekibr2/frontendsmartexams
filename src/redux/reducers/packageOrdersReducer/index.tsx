
import { OrderDetail } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PackageOrderState {
    packageOrders: OrderDetail[];
    packageOrderLoading: boolean;
    error: string | null;
    packageInfoModal: boolean;
    singlePackageOrderInfo: OrderDetail | null;
    packageOrderPage: number;
    packageOrderLimit: number;
    packageOrderTotalCount: number;
    packageOrderSearch: string;
    packageFilterId: string;
}

const initialState: PackageOrderState = {
    packageOrders: [],
    packageOrderLoading: true,
    error: null,
    packageInfoModal: false,
    singlePackageOrderInfo: null,
    packageOrderPage: 1,
    packageOrderLimit: 10,
    packageOrderTotalCount: 0,
    packageOrderSearch: '',
    packageFilterId: '',
};

const packageOrdersSlice = createSlice({
    name: 'packageOrders',
    initialState,
    reducers: {
        setPackageOrders: (state, action: PayloadAction<OrderDetail[]>) => {
            state.packageOrders = action.payload;
        },
        setPackageInfoModal: (state, action: PayloadAction<boolean>) => {
            state.packageInfoModal = action.payload;
        },
        setSinglePackageOrderInfo: (state, action: PayloadAction<OrderDetail | null>) => {
            state.singlePackageOrderInfo = action.payload;
        },
        setPackageOrderPage: (state, action: PayloadAction<number>) => {
            state.packageOrderPage = action.payload;
        },
        setPackageOrderLimit: (state, action: PayloadAction<number>) => {
            state.packageOrderLimit = action.payload;
        },
        setPackageOrderTotalCount: (state, action: PayloadAction<number>) => {
            state.packageOrderTotalCount = action.payload;
        },
        setPackageOrderLoading: (state, action: PayloadAction<boolean>) => {
            state.packageOrderLoading = action.payload;
        },
        setPackageOrderSearch: (state, action: PayloadAction<string>) => {
            state.packageOrderSearch = action.payload;
        },
        setPackageFilterId: (state, action: PayloadAction<string>) => {
            state.packageFilterId = action.payload;
        },
    },
});

export const {
    setPackageOrders,
    setPackageInfoModal,
    setSinglePackageOrderInfo,
    setPackageOrderPage,
    setPackageOrderLimit,
    setPackageOrderTotalCount,
    setPackageOrderLoading,
    setPackageOrderSearch,
    setPackageFilterId,
} = packageOrdersSlice.actions;

export default packageOrdersSlice.reducer;
