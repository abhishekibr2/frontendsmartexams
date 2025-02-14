export interface Root {
    status: boolean
    data: FolderFiles[]
}

export interface FolderFiles {
    _id: string;
    fileName: string;
    createdBy: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
        role: string;
        image: string;
    };
    filePath: string;
    fileType: string;
    fileSize: number;
    folderId: string;
    status: string;
    createdAt: Date;
    deletedAt: string;
    __v: number;
    isFavorite: boolean;
    action: string | JSX.Element;
}
