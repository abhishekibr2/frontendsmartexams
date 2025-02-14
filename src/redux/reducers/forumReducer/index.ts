import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AllCategories, Forum } from "@/lib/types"

type ForumState = {
    forums: Forum[],
    currentForum: Forum | null,
    drawer: boolean,
    forumId: string,
    forumCategory: AllCategories,
    selectedCategoryId: string,
    reload: boolean,
    loading: boolean,
    searchQuery: string,
    editData: Forum,
    modal: boolean,
    commentBox: boolean,
    forumResult: any,
    comment: string,
    reply: string,
    data: any
}

const initialState: ForumState = {
    forums: [],
    currentForum: null,
    drawer: false,
    forumId: '',
    forumCategory: { categories: [], subCategories: [] },
    selectedCategoryId: '',
    reload: false,
    loading: false,
    searchQuery: '',
    editData: {} as Forum,
    modal: false,
    commentBox: false,
    forumResult: '',
    comment: '',
    reply: '',
    data: ''
}

export const forumSlice = createSlice({
    name: "forum",
    initialState,
    reducers: {
        setForums: (state, action: PayloadAction<Forum[]>) => {
            state.forums = action.payload;
        },
        setCurrentForum: (state, action: PayloadAction<Forum>) => {
            state.currentForum = action.payload
        },
        setDrawer: (state, action: PayloadAction<boolean>) => {
            state.drawer = action.payload
        },
        setForumId: (state, action: PayloadAction<string>) => {
            state.forumId = action.payload
        },
        setForumCategory: (state, action: PayloadAction<AllCategories>) => {
            state.forumCategory = action.payload
        },
        setSelectedCategoryId: (state, action: PayloadAction<string>) => {
            state.selectedCategoryId = action.payload
        },
        setReload: (state, action: PayloadAction<boolean>) => {
            state.reload = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        setEditData: (state, action: PayloadAction<Forum>) => {
            state.editData = action.payload;
        },
        setModal: (state, action: PayloadAction<boolean>) => {
            state.modal = action.payload;
        },
        setCommentBox: (state, action: PayloadAction<boolean>) => {
            state.commentBox = action.payload;
        },
        setForumResult: (state, action: PayloadAction<string>) => {
            state.forumResult = action.payload;
        },
        setComment: (state, action: PayloadAction<string>) => {
            state.comment = action.payload;

        },
        setReply: (state, action: PayloadAction<string>) => {
            state.reply = action.payload;
        },
        setData: (state, action: PayloadAction<string>) => {
            state.data = action.payload;
        },


        reset: () => initialState,  // Reset state to initial state when component unmounts.
    }
})

export const {
    setForums,
    setCurrentForum,
    setDrawer,
    setForumId,
    setForumCategory,
    setSelectedCategoryId,
    setReload,
    setLoading,
    setSearchQuery,
    setEditData,
    reset,
    setModal,
    setCommentBox,
    setForumResult,
    setComment,
    setReply,
    setData

} = forumSlice.actions

export default forumSlice.reducer;
