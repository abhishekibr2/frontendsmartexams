import { Notification } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NotificationState = {
    notification: Notification[];
    selectAll: boolean,
    selectedNotifications: string[];
    loading: boolean;
};

const initialState: NotificationState = {
    notification: [],
    selectAll: false,
    selectedNotifications: [],
    loading: true,
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(state, action: PayloadAction<Notification[]>) {
            state.notification = action.payload;
        },
        selectAllNotification(state, action: PayloadAction<boolean>) {
            state.selectAll = action.payload;
        },
        setSelectedNotifications(state, action: PayloadAction<string[]>) {
            state.selectedNotifications = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },


    }
});

export const { setNotification, selectAllNotification, setSelectedNotifications, setLoading } = notificationSlice.actions;
export default notificationSlice.reducer;
