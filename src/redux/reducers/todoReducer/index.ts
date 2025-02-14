import { User } from "@/lib/types";
import { RootState } from "@/redux/store";
import { Todo } from "@/types/todo/todoTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type TodoState = {
    todo: Todo[];
    users: User[];
    currentTodo: Todo | null;
    showTodoForm: boolean
};

const initialState: TodoState = {
    todo: [],
    users: [],
    currentTodo: null,
    showTodoForm: false
};


export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        setTodo: (state, action: PayloadAction<Todo[]>) => {
            state.todo = action.payload;
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            state.todo = state.todo.filter(todo => todo._id !== action.payload);
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        setCurrentTodo: (state, action: PayloadAction<Todo>) => {
            state.currentTodo = action.payload;
        },
        setShowTodoForm: (state, action: PayloadAction<boolean>) => {
            state.showTodoForm = action.payload
        },
    },
})


export const { setTodo, removeTodo, setUsers, setCurrentTodo, setShowTodoForm } = todoSlice.actions;

export default todoSlice.reducer;
