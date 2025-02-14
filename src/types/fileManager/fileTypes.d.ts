export interface Root {
    status: boolean
    message: string
    data: FileTypes[]
}

export interface FileTypes {
    count: number
    sizeCount: string
    fileType: string
}

export interface RecycledFile {
    _id: string;
    fileName: string;
    description: string;
    createdBy: string;
    fileType: string;
    fileSize: number;
    folderId: string;
    status: string;
    createdAt: string;
    deletedAt: string;
    __v: number;
}
