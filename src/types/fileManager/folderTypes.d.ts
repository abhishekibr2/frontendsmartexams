export interface User {
    _id: string;
    name: string;
    email: string;
    image: string;
}

// Define the FileManagerFolder type
export interface FileManagerFolder {
    _id: string;
    folderName: string;
    totalSize: string;
    fileCount: string;
    description: string;
    folderPath: string;
    parentFolder: string | null;
    createdBy: {
        _id: string;
        name: string;
    }
    deletedBy?: string; // Optional reference to User ID
    status: 'active' | 'inactive' | 'deleted';
    createdAt: Date;
    deletedAt?: Date; // Optional date
    action: JSX.Element | string;
}
