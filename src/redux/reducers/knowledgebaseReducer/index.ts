import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Knowledgebase = {
    _id: string
    userId: string
    title: string
    category: string
    youtubeLink: string
    description: string
    order: number
    createdAt: string
    updatedAt: string
    __v: number,
    key: string

}


type KnowledgebaseState = {
    knowledgebase: Knowledgebase[],
    currentKnowledgebase: Knowledgebase | null,
    loading: boolean,
    authorId: string,
    drawer: boolean,
    reload: boolean,
    baseId: string,
    description: string,
    searchQuery: string,
}

const initialState: KnowledgebaseState = {
    knowledgebase: [],
    currentKnowledgebase: null,
    loading: false,
    authorId: '',
    drawer: false,
    reload: false,
    baseId: '',
    description: '',
    searchQuery: '',
}


export const knowledgebaseSlice = createSlice({
    name: 'knowledgebase',
    initialState,
    reducers: {
        setKnowledgebase(state, action: PayloadAction<Knowledgebase[]>) {
            state.knowledgebase = action.payload;
        },
        setCurrentKnowledgebase: (state, action: PayloadAction<Knowledgebase>) => {
            state.currentKnowledgebase = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setAuthorId(state, action: PayloadAction<string>) {
            state.authorId = action.payload;
        },
        setDrawer(state, action: PayloadAction<boolean>) {
            state.drawer = action.payload;
        },
        setReload(state, action: PayloadAction<boolean>) {
            state.reload = action.payload;
        },
        setBaseId(state, action: PayloadAction<string>) {
            state.baseId = action.payload;
        },
        setDescription(state, action: PayloadAction<string>) {
            state.description = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        }

    },
});


export const { setKnowledgebase, setCurrentKnowledgebase, setLoading, setAuthorId, setDrawer, setReload, setBaseId, setDescription, setSearchQuery } = knowledgebaseSlice.actions;
export default knowledgebaseSlice.reducer;
