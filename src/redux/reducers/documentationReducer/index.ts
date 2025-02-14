import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Documentation = {
    category: string
    titles: Title[]
}

type Title = {
    _id: string
    title: string
    order: number
}

type DocumentationState = {
    documentation: Documentation[],
    currentDocumentation: Documentation | null,
}

const initialState: DocumentationState = {
    documentation: [],
    currentDocumentation: null,
}

export const documentationSlice = createSlice({
    name: "documentation",
    initialState,
    reducers: {
        setDocumentation: (state, action: PayloadAction<Documentation[]>) => {
            state.documentation = action.payload
        },
        setCurrentDocumentation: (state, action: PayloadAction<Documentation>) => {
            state.currentDocumentation = action.payload
        },
    },
})

export const { setDocumentation, setCurrentDocumentation } = documentationSlice.actions
export default documentationSlice.reducer;
