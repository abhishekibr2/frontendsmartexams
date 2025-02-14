export interface TodoTypes {
    status: boolean
    data: Todo[]
}

export interface Todo {
    _id: string
    title: string
    description: string
    status: string
    category: string
    priority: string
    assignedDate: string
    targetDate: string
    createdBy: CreatedBy
    assignedTo: AssignedTo[]
    chatId: any
    recurrenceType: string
    __v: number
    googleEventId: string
    recurrenceRule?: string
}

export interface CreatedBy {
    address: Address
    billingAddress: BillingAddress
    socialLinks: SocialLinks
    fileManagerDirectory: any
    updatedBy: any
    _id: string
    name: string
    email: string
    role: string
    slug: any
    password: string
    isShowEmail: boolean
    isEmailVerified: boolean
    phoneNumber: string
    isShowPhoneNumber: boolean
    isPhoneVerified: boolean
    designation: any
    passwordUpdatedAt: any
    gender: string
    image: string
    dob: any
    bio: any
    otp: any
    resetToken: any
    profileViewCount: number
    metaTitle: any
    metaDescription: any
    subscriptionExpiryDate: any
    lastSeen: string
    isOnline: string
    twoFactorAuth: string
    loginType: any
    isReported: boolean
    status: string
    createdBy: any
    deletedBy: any
    deletedAt: any
    createdAt: string
    updatedAt: string
    __v: number
    stripeCustomerId: string
    stickyNote: string
    isBlocked: boolean
    timeZone: string
    wrongPasswordCount: number
    roleId: string
    block: string[]
    chatStatus: string
}

export interface Address {
    street: any
    building: any
    city: any
    zip: any
    lat: any
    long: any
    country: string
    state: string
}

export interface BillingAddress {
    addressOne: any
    addressTwo: any
    city: any
    zip: any
    state: any
    country: any
    companyName: any
    taxNumber: any
}

export interface SocialLinks {
    twitter: any
    facebook: any
    linkedin: any
    instagram: any
    website: any
}

export interface AssignedTo {
    address: Address2
    billingAddress: BillingAddress2
    socialLinks: SocialLinks2
    fileManagerDirectory?: string
    updatedBy: any
    _id: string
    name: string
    email: string
    role: string
    slug?: string
    password?: string
    isShowEmail: boolean
    isEmailVerified: boolean
    phoneNumber?: string
    isShowPhoneNumber: boolean
    isPhoneVerified: boolean
    designation: any
    passwordUpdatedAt: any
    gender: string
    image?: string
    dob: any
    bio: any
    otp: any
    resetToken?: string
    profileViewCount: number
    metaTitle: any
    metaDescription: any
    subscriptionExpiryDate: any
    lastSeen?: string
    isOnline: string
    twoFactorAuth: string
    loginType?: string
    isReported: boolean
    status: string
    createdBy: any
    deletedBy: any
    deletedAt: any
    createdAt: string
    updatedAt: string
    __v: number
    stripeCustomerId?: string
    stickyNote?: string
    isBlocked: boolean
    timeZone: string
    wrongPasswordCount: number
    roleId?: string
    block: string[]
    chatStatus: string
}

export interface Address2 {
    street: any
    building: any
    city: any
    zip: any
    lat: any
    long: any
    country?: string
    state?: string
}

export interface BillingAddress2 {
    addressOne: any
    addressTwo: any
    city: any
    zip: any
    state: any
    country: any
    companyName: any
    taxNumber: any
}

export interface SocialLinks2 {
    twitter: any
    facebook: any
    linkedin: any
    instagram: any
    website: any
}
