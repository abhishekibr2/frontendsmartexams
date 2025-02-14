export interface Root {
    status: boolean
    organization: Organization[]
}

export interface Organization {
    _id: string
    userId: string
    name: string
    email: string
    phone: string
    description: string
    country: string
    state: string
    city: string
    mainImage: string
    galleryImages: any[]
    status: string
    createdAt: string
    updatedAt: string
    __v: number
}
