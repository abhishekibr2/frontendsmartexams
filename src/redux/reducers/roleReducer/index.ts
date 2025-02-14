import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Roles } from "@/lib/types";

type RoleState = {
    roles: Roles[],
    currentRole: Roles | null,
    showRoleForm: boolean
}

const initialState: RoleState = {
    roles: [],
    currentRole: null,
    showRoleForm: false
}

const RoleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRoles: (state, action: PayloadAction<Roles[]>) => {
            state.roles = action.payload
        },
        setCurrentRole: (state, action: PayloadAction<Roles | null>) => {
            state.currentRole = action.payload
        },
        setShowRoleForm: (state, action: PayloadAction<boolean>) => {
            state.showRoleForm = action.payload
        }
    }
})

export const { setRoles, setCurrentRole, setShowRoleForm } = RoleSlice.actions
export default RoleSlice.reducer
