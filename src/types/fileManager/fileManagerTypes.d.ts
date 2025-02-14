export interface Root {
    status: boolean
    data: Folders[]
}

export interface Folders {
    _id: string
    folderName: string
    folderPath: string
    parentFolder: any
    createdBy: CreatedBy
    status: string
    createdAt: string
    deletedAt: string
    __v: number
    fileCount: string
    totalSize: string
}

export interface CreatedBy {
    _id: string
    name: string
    email: string
    image: string
}
