export const student = {
    ebook: {
        getEbooksForStudent: '/student/ebooks',
        getSingleEbook: (slug: string) => `/student/ebooks/single/${slug}`,
        getAllStatesForFilter: `/student/ebooks/getAllStatesForFilter`,
        getAllExamTypeForFilter: `/student/ebooks/getAllExamTypeForFilter`,
    },
    cart: {
        getStudentCartDetails: (userId: string) => `/student/cart/${userId}`,
    },
    profile: {
        updateProfileDetails: '/student/profile/update-profile-details',
        updatePassword: (userId: string) => `/student/profile/update-password/${userId}`,

    },
    essay: {
        submitEssayDetails: '/student/essay/submitEssay',
    },
    checkout: {
        getStudentCheckoutDetails: (userId: string) => `/student/checkout/getStudentCheckoutDetails/${userId}`
    },
    dashboard: {
        getUserDashboardData: (userId: string) => `/student/dashboard/getUserDashboardData/${userId}`
    },
    contactUs: {
        submitContactUsMessage: `/student/contact-us/submitContactUsMessage`,
        getContactUsData: (userId: string) => `/student/contact-us/getContactUsData/${userId}`,
    }
}


