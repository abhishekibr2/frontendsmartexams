import { User } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
    users: User[],
    currentUser: User | null,
    showUserForm: boolean,
    loadingId: string | null,
    selectedStatus: string | null,
    selectedUserId: string[],
    filteredUser: User[],
    isDeleteModalOpen: boolean,
    currentPageData: User[],
    selectedUser: User | null,
    isModalOpen: boolean,
    searchQuery: string,
    currentPage: number,
    pageSize: number,
    loading: boolean

}

const initialState: UserState = {
    users: [],
    currentUser: null,
    showUserForm: false,
    loadingId: null,
    selectedStatus: null,
    selectedUserId: [],
    filteredUser: [],
    isDeleteModalOpen: false,
    currentPageData: [],
    selectedUser: null,
    isModalOpen: false,
    searchQuery: '',
    currentPage: 1,
    pageSize: 10,
    loading: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload
        },
        setCurrentUser: (state, action: PayloadAction<User | null>) => {
            state.currentUser = action.payload
        },
        setShowUserForm: (state, action: PayloadAction<boolean>) => {
            state.showUserForm = action.payload
        },
        setLoadingId: (state, action: PayloadAction<string | null>) => {
            state.loadingId = action.payload
        },
        setSelectedStatus: (state, action: PayloadAction<string | null>) => {
            state.selectedStatus = action.payload
        },
        setSelectedUserId: (state, action: PayloadAction<string[]>) => {
            state.selectedUserId = action.payload
        },
        setFilteredUser: (state, action: PayloadAction<User[]>) => {
            state.filteredUser = action.payload
        },
        setIsDeleteModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isDeleteModalOpen = action.payload
        },
        setCurrentPageData: (state, action: PayloadAction<User[]>) => {
            state.currentPageData = action.payload
        },
        setSelectedUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload
        },
        setIsModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    }
})

export const { setUsers, setCurrentUser, setShowUserForm, setLoadingId, setSelectedStatus, setSelectedUserId, setFilteredUser, setIsDeleteModalOpen,
    setCurrentPageData, setSelectedUser, setIsModalOpen, setSearchQuery, setCurrentPage, setPageSize, setLoading
} = userSlice.actions
export default userSlice.reducer
