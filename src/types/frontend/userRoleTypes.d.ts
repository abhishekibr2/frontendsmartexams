export interface UserRoleTypes {
    status: boolean
    data: Role[]
}

export interface Role {
    createdBy: any
    updatedBy: any
    _id: string
    roleName: string
    status: string
    deletedBy: any
    createdAt: string
    updatedAt: string
    deletedAt: string
    __v: number
    permissions: Permissions
}

export interface Permissions {
    Dashboard: boolean
}
