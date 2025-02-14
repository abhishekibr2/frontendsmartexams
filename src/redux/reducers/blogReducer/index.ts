import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Blog = {
    slug: string;
    authorId: any;
    _id: string;
    key?: string;
    title: string;
    status: string,
    description: string;
    address?: string;
    blogViewCount?: number,
    name: string,
    createdAt: string,
    image: string;
}


type BlogState = {
    blogs: Blog[];
    currentBlog: Blog | null;
    model: boolean,
    blogId: string;
};

const initialState: BlogState = {
    blogs: [],
    currentBlog: null,
    model: false,
    blogId: ''
};


export const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setBlogs: (state, action: PayloadAction<Blog[]>) => {
            // console.log(action.payload, 'actionblog')

            state.blogs = action.payload;
        },
        setCurrentBlog: (state, action: PayloadAction<Blog>) => {
            state.currentBlog = action.payload;
        },
        setModel: (state, action: PayloadAction<boolean>) => {
            state.model = action.payload;
        },
        setBlogId(state, action: PayloadAction<string>) {
            state.blogId = action.payload
        },
        reset: () => initialState,
    },
})


export const { setBlogs, setCurrentBlog, setModel, reset, setBlogId } = blogSlice.actions;
export default blogSlice.reducer;
