import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type resetPassword = {
    loading: boolean
}

const initialState: resetPassword = {
    loading: false
}
const resetPasswordSlice = createSlice
    ({
        name: 'resetPassword',
        initialState,
        reducers: {
            setLoading(state, action: PayloadAction<boolean>) {
                state.loading = action.payload
            },

        }
    })

export const { setLoading, } = resetPasswordSlice.actions
export default resetPasswordSlice.reducer;
