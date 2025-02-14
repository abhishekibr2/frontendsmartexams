import { Folders } from "@/types/fileManager/fileManagerTypes";
import { FileTypes } from "@/types/fileManager/fileTypes";
import { FolderFiles } from "@/types/fileManager/folderFilesTypes";
import { FileManagerFolder } from "@/types/fileManager/folderTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FileManagerStateType {
    allFolderData: FileManagerFolder[];
    myFiles: FileTypes[];
    folderRename: FileManagerFolder | null;
    action: string;
    folder: FileManagerFolder | null;
    newFolderName: FileManagerFolder | null;
    folderId: string;
    isModalOpen: boolean;
    isModalOpenFile: boolean;
    fileWithFolderId: FolderFiles[];
    fileId: string;
    parentFolderId: string[];
}

const initialState: FileManagerStateType = {
    allFolderData: [],
    myFiles: [],
    folderRename: null,
    action: '',
    folder: null,
    newFolderName: null,
    folderId: '',
    isModalOpen: false,
    isModalOpenFile: false,
    fileWithFolderId: [],
    fileId: '',
    parentFolderId: []
};

export const fileManagerSlice = createSlice({
    name: 'fileManager',
    initialState,
    reducers: {
        setFolderData: (state, action: PayloadAction<FileManagerFolder[]>) => {
            state.allFolderData = action.payload;
        },
        setMyFiles: (state, action: PayloadAction<FileTypes[]>) => {
            state.myFiles = action.payload;
        },
        setFolderRename: (state, action: PayloadAction<FileManagerFolder | null>) => {
            state.folderRename = action.payload;
        },
        setAction: (state, action: PayloadAction<string>) => {
            state.action = action.payload;
        },
        setFolder: (state, action: PayloadAction<FileManagerFolder | null>) => {
            state.folder = action.payload;
        },
        setNewFolderName: (state, action: PayloadAction<FileManagerFolder | null>) => {
            state.newFolderName = action.payload;
        },
        setFolderId: (state, action: PayloadAction<string>) => {
            state.folderId = action.payload;
        },
        setIsModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload;
        },
        setIsModalOpenFile: (state, action: PayloadAction<boolean>) => {
            state.isModalOpenFile = action.payload;
        },
        setFileWithFolderId: (state, action: PayloadAction<FolderFiles[]>) => {
            state.fileWithFolderId = action.payload;
        },
        setFileId: (state, action: PayloadAction<string>) => {
            state.fileId = action.payload;
        },
        setParentFolderId: (state, action: PayloadAction<string>) => {
            if (action.payload && !state.parentFolderId.includes(action.payload)) {
                state.parentFolderId.push(action.payload);
            }
        },
        removeLastParentFolderId: (state) => {
            state.parentFolderId.pop(); // Removes last folder ID
        },
    },
});

export const {
    setFolderData,
    setMyFiles,
    setFolderRename,
    setAction,
    setFolder,
    setNewFolderName,
    setFolderId,
    setIsModalOpen,
    setIsModalOpenFile,
    setFileWithFolderId,
    setFileId,
    setParentFolderId,
    removeLastParentFolderId
} = fileManagerSlice.actions;

export default fileManagerSlice.reducer;
