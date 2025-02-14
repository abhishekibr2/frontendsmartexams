export interface Root {
    status: boolean
    data: Data
}

export interface Data {
    contributors: Contributor[]
}

export interface Contributor {
    _id: string
    createdAt: string | Date
    name: string
    image: string
}
