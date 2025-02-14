import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EBook } from '@/lib/types';

type BookState = {
    books: EBook[];
    currentBook: EBook | null;
    showBookForm: boolean;
}

const initialState: BookState = {
    books: [],
    currentBook: null,
    showBookForm: false,
}

export const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setBooks: (state, action: PayloadAction<EBook[]>) => {
            state.books = action.payload;
        },
        setShowBookForm: (state, action: PayloadAction<boolean>) => {
            state.showBookForm = action.payload;
        },
        setCurrentBook: (state, action: PayloadAction<EBook | null>) => {
            state.currentBook = action.payload;
        },
    }
});

export const { setBooks, setShowBookForm, setCurrentBook } = bookSlice.actions;
export default bookSlice.reducer;
