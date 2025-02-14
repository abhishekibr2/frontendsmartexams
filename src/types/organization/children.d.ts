export interface RootObject {
    status: boolean;
    children: ChildrenType[];
}
export interface ChildrenType {
    guardianName: any;
    relationship: any;
    contactNumber: any;
    address: any;
    educationName: any;
    course: any;
    year: any;
    isAvailable: any;
    adoptedBy: any;
    adoptionDate: any;
    guardianInfo: GuardianInfo;
    educationDetails: EducationDetails;
    adoptionStatus: AdoptionStatus;
    expenses?: number;
    explanation?: string;
    _id: string;
    organizationId?: OrganizationId;
    profileImage: string;
    name: string;
    dateOfBirth: string;
    gender: string;
    placeOfBirth: string;
    healthStatus: string;
    allergies: string;
    medications: string;
    disabilities: string;
    hobbiesAndInterests?: any;
    languageSpoken: [];
    addedBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
export interface OrganizationId {
    _id: string;
    name: string;
}
export interface AdoptionStatus {
    isAvailable: boolean;
    adoptedBy?: any;
    adoptionDate?: string;
}
export interface EducationDetails {
    educationName?: string;
    course?: string;
    yearOfGraduation?: string;
}
export interface GuardianInfo {
    guardianName?: any;
    relationship?: string;
    contactNumber?: string;
    address?: string;
    name?: string;
}
