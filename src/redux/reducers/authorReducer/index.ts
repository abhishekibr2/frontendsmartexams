import { Author } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type AuthorState = {
    authors: Author[],
    currentAuthor: Author | null,
    showAuthorForm: boolean
}
const initialState: AuthorState = {
    authors: [],
    currentAuthor: null,
    showAuthorForm: false
}

export const authorSlice = createSlice({
    name: 'author',
    initialState,
    reducers: {
        setAuthors: (state, action: PayloadAction<Author[]>) => {
            state.authors = action.payload
        },
        setShowAuthorForm: (state, action: PayloadAction<boolean>) => {
            state.showAuthorForm = action.payload
        },
        setCurrentAuthor: (state, action: PayloadAction<Author | null>) => {
            state.currentAuthor = action.payload
        },
    }
})

export const { setAuthors, setShowAuthorForm, setCurrentAuthor } = authorSlice.actions
export default authorSlice.reducer;
