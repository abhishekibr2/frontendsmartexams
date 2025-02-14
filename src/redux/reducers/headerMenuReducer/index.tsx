import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type HeaderMenuState = {
    drawer: boolean
    loading: boolean,
    menuId: string,
    reload: boolean,
    dataSource: {
        key: string;
        title: string;
        link: string;
        action: any
    }[]
};

const initialState: HeaderMenuState = {
    drawer: false,
    loading: false,
    menuId: '',
    reload: false,
    dataSource: []
};


export const headerMenuSlice = createSlice({
    name: 'headerMenu',
    initialState,
    reducers: {
        setDrawer: (state, action: PayloadAction<boolean>) => {
            state.drawer = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setMenuId: (state, action: PayloadAction<string>) => {
            state.menuId = action.payload;
        },
        setReload: (state, action: PayloadAction<boolean>) => {
            state.reload = action.payload;
        },
        setDataSource: (state, action: PayloadAction<{
            key: string;
            title: string;
            link: string;
            action: any
        }[]>) => {
            state.dataSource = action.payload;
        },
    }
})

export const { setDrawer, setLoading, setMenuId, setReload, setDataSource } = headerMenuSlice.actions;
export default headerMenuSlice.reducer;
