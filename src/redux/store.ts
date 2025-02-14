import { configureStore } from '@reduxjs/toolkit'
import blogReducer from "./reducers/blogReducer";
import authorReducer from "./reducers/authorReducer";
import fileManagerReducer from "./reducers/fileManagerReducer";
import forumReducer from "./reducers/forumReducer";
import documentationReducer from "./reducers/documentationReducer";
import todoReducer from "./reducers/todoReducer";
import userReducer from "./reducers/userReducer";
import roleReducer from "./reducers/roleReducer";
import knowledgebaseReducer from "./reducers/knowledgebaseReducer";
import responsiveTableReducer from "./reducers/responsiveTableReducer";
import serviceReducer from "./reducers/serviceReducer";
import contactusReducer from "./reducers/contactusReducer"
import testimonialReducer from "./reducers/testimonialReducer";
import notificationReducer from "./reducers/notificationReducer";
import ticketReducer from "./reducers/ticketReducer";
import headerMenuReducer from "./reducers/headerMenuReducer";
import footerMenuReducer from "./reducers/footerMenuReducer";
import profileReducer from "./reducers/profileReducer";
import resetPasswordReducer from "./reducers/resetPassword";
import subjectReducer from "./reducers/subjectReducer"
import examTypeReducer from "./reducers/examReducer"
import gradeReducer from "./reducers/gradeReducer"
import complexityReducer from "./reducers/complexityReducer"
import testConductedByReducer from "./reducers/testConductedByReducer"
import packageEssayReducer from "./reducers/packageEssayReducer"
import eBookReducer from './reducers/eBookReducer';
import testReducer from './reducers/testReducer';
import ebookOrdersReducer from './reducers/ebookOrdersReducer';
import packageOrdersReducer from './reducers/packageOrdersReducer';
import durationReducer from './reducers/durationReducer';
import stateExamIdReducer from './reducers/stateExamIdReducer';
import userCartReducer from './reducers/userCartReducer';


export const makeStore = () => {
    return configureStore({
        reducer: {
            blogReducer,
            authorReducer,
            fileManagerReducer,
            forumReducer,
            documentationReducer,
            todoReducer,
            userReducer,
            roleReducer,
            knowledgebaseReducer,
            responsiveTableReducer,
            serviceReducer,
            contactusReducer,
            testimonialReducer,
            notificationReducer,
            ticketReducer,
            headerMenuReducer,
            footerMenuReducer,
            profileReducer,
            resetPasswordReducer,
            subjectReducer,
            examTypeReducer,
            gradeReducer,
            complexityReducer,
            testConductedByReducer,
            packageEssayReducer,
            eBookReducer,
            testReducer,
            ebookOrdersReducer,
            packageOrdersReducer,
            durationReducer,
            stateExamIdReducer,
            userCartReducer,
        }
    })
}
export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
