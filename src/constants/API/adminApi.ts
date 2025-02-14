import { AddPackageType, AddSectionOne, DeletePackageType } from "@/lib/adminApi";

export const ADMIN = {
    blog: {
        getAllBlogs: `/admin/blogs`,
        addUpdateBlogDetails: `/admin/blogs/addUpdateBlogDetails`,
        deleteBlog: `/admin/blogs/deleteBlog`,
    },
    author: {
        getAllAuthors: `/admin/authors`,
        deleteAuthor: `/admin/authors/deleteAuthor`,
        updateAuthor: `/admin/authors/addUpdateAuthorDetails`,
    },
    setting: {
        updateBrandDetails: `/admin/settings/update-brand-details`,
        getSingleBrandDetails: `/admin/settings/single-brand-details`,
        deleteBrandLogo: `/admin/settings/delete-brand-logo`,
        updatePaymentDetails: `/admin/settings/update-payment-details`,
        updateSEODetails: `/admin/settings/update-seo-details`,
        updateSocialLinks: `/admin/settings/update-social-links`,
        updateSignature: `/admin/settings/update-email-signature`,
        addUpdateHeaderData: `/admin/settings/update-header-menu`,
        getHeaderMenus: '/admin/settings/get-header-menu',
        updateOrderOfMenu: '/admin/settings/update-menu-order',
        updateFooterOrderOfMenu: '/admin/settings/update-footer-menu-order',
        addUpdateFooterData: `/admin/settings/update-footer-menu`,
        getFooterMenus: `/admin/settings/get-footer-menu`,
        deleteHeaderMenu: `/admin/settings/delete-header-menu`,
        updateEmailTemplate: `/admin/settings/update-email-template`,
        getAllEmailTemplates: `/admin/settings/get-all-templates`,
        deleteFooterMenu: `/admin/settings/delete-footer-menu`,
        getAllChatSettings: `/admin/settings/get-chat-setting`,
        updateChatSettings: `/admin/settings/update-chat-setting`,
    },
    profile: {
        updateProfileDetails: `/admin/profile/update-profile-details`,
        updatePassword: (userId: string) => `/admin/profile/update-password/${userId}`,
    },
    dashboard: {
        saveStickyNote: `/admin/dashboard/save-sticky-note`,
        deleteStickyNote: `/admin/dashboard/save-sticky-note`,
        getAllUsers: '/admin/users',
        status: '/admin/users/change',
        dashboardCounts: '/admin/dashboard/dashboardCounts',
        getUserCountByMonthYear: '/admin/dashboard/getUserCountByMonthYear'
    },
    role: {
        getAllRoles: `/admin/roles`,
        addUpdateRoleDetails: `/admin/roles/add-Update-Role-Details`,
        deleteRole: '/admin/roles/delete-Role',
    },
    user: {
        addUpdateUser: '/admin/users/addUpdateUser',
        deleteUser: `/admin/users/deleteUser`,
        sendEmail: '/admin/users/sendEmail'
    },
    contactUs: {
        getAllContactUs: '/admin/contactus',
        deleteContactUs: '/admin/contactus/deleteContactUs',
        // addContactUs: '/admin/contactus/addContactUs',
        submitContactUsMessage: `/admin/contactus/submitContactUsMessage`,
        getContactUsData: (createdBy: string) => `/admin/contactus/getContactUsData/${createdBy}`,
    },
    documentation: {
        addUpdateKnowledgeBase: `/admin/documentations/add-update-knowledge-base`,
        getKnowledgeBase: `/admin/documentations/get-knowledge-base`,
        updateKnowledgeBaseOrder: `/admin/documentations/update-knowledge-base-order`,
        deleteKnowledgeBase: `/admin/documentations/delete-knowledge-base`,
        getAllDocumentations: `/admin/documentations/get-all-documentations`,
        getReceipt: `/admin/invoice`,
    },
    // here testimonial
    testimonial: {
        addUpdateTestimonial: `/admin/testimonial/addUpdateTestimonial`,
        getAllTestimonials: `/admin/testimonial/getAllTestimonials`,
        deleteTestimonials: `/admin/testimonial/deleteTestimonials`
    },
    state: {
        getAllStates: `/admin/states`,
        addUpdateStateDetails: `/admin/states/addUpdateStateDetail`,
        deleteState: `/admin/states/deleteState`,
    },
    packages: {
        addPackagesDetails: '/admin/packages/addPackagesDetails',
        getPackages: '/admin/packages/getPackage',
        deletePackage: '/admin/packages/deletePackages',
        PublishPackage: '/admin/packages/publishPackages',
        assignPackage: '/admin/packages/AssignPackage',
        test: '/admin/packages/tests',
        getSinglePackageInfo: (packageId: string) => `/admin/packages/getSinglePackageInfo/${packageId}`,
    },
    AddFeedBack: {
        feedBack: '/admin/feedback/addFeedback',
        packageFeedBack: '/admin/packageFeedback/package',
        questionFeedback: '/admin/questionFeedback/question',
    },
    subject: {
        getAllSubjects: `/admin/subjects`,
        addUpdateSubjectDetails: `/admin/subjects/addUpdateSubjectDetails`,
        deleteSubject: `/admin/subjects/deleteSubject`,
    },
    examType: {
        getAllExamType: `/admin/examtype`,
        addUpdateExamTypeDetails: `/admin/examtype/addUpdateExamTypeDetails`,
        deleteExamType: `/admin/examtype/deleteExamType`,
    },
    grade: {
        getAllGrades: `/admin/grades`,
        addUpdateGradeDetails: `/admin/grades/addUpdateGradeDetails`,
        deleteGrade: `/admin/grades/deleteGrade`,
    },
    complexity: {
        getAllComplexity: `/admin/complexity`,
        addUpdateComplexityDetails: `/admin/complexity/addUpdateComplexityDetails`,
        deleteComplexity: `/admin/complexity/deleteComplexity`,
    },
    testConducted: {
        getAllTestConduct: `/admin/testConducted`,
        addUpdateTestConductDetails: `/admin/testConducted/addUpdateTestConductDetails`,
        deleteTestConduct: `/admin/testConducted/deleteTestConduct`,
    },
    packageEssay: {
        getAllPackageEssay: `/admin/packageEssay/getEssay`,
        addUpdatePackageEssayDetails: `/admin/packageEssay/addUpdatePackageEssayDetails`,
        deletePackageEssay: `/admin/packageEssay/deletePackageEssay`,
    },
    eBook: {
        getAllEbook: `/admin/ebook`,
        addUpdateEbook: `/admin/ebook/addUpdateEBook`,
        deleteEbook: `/admin/ebook/deleteEbook`,
        getAllFreeEBooks: `/admin/ebook/freeEbooks`
    },
    testAdmin: {
        createTest: `/admin/test/createTest`,
        getAllTests: `/admin/test/getAllTests`,
        deleteTests: `/admin/test/deleteTest`,
        getTestById: '/admin/test/getTestById',

    },

    addFaqs: {
        addFaq: '/admin/faq/addQuestion',
        getFaqs: '/admin/faq/getFaqs',
        deleteFaq: '/admin/faq/deleteFaq',
    },
    questionsAdmin: {
        getAll: `/admin/questionFeedback/getAllQuestionReport`,

    },
    homeBanner: {
        addHomePage: '/admin/homepageContent/addHomePageContent',
        getHomePage: '/admin/homepageContent/getHomePageContent',
    },
    allOrders: {
        getAllEbookOrders: '/admin/all-orders/getAllEbookOrders',
        getAllPackageOrders: `/admin/all-orders/getAllPackageOrders`,
        getAllPackagesForFilter: `/admin/all-orders/getAllPackagesForFilter`,
        getAllEbooksForFilter: `/admin/all-orders/getAllEbooksForFilter`,
    },
    duration: {
        addDuration: '/admin/duration/addDuration',
        getDuration: '/admin/duration/getDuration',
        deleteDuration: '/admin/duration/deleteDuration',
    },
    termsAndCondition: {
        addUpdate: '/admin/termsCondition/addUpdate',
        getDataTermsCondition: '/admin/termsCondition'
    },
    email: {
        addEmailPage: '/admin/emailContent/addEmailPageContent',
        getEmailPage: '/admin/emailContent/getEmailPageContent',
    },

    packageType: {
        AddPackageType: '/admin/packageType/addPackageType',
        getPackageType: '/admin/packageType/',
        DeletePackageType: '/admin/packageType/deletePackageType'
    },
    whyChooseUs: {
        AddSectionOne: '/admin/whyChooseUs/addSectionOne',
        getSectionOne: '/admin/whyChooseUs/getSectionData',
    },
    tutorialClass: {
        addClass: '/admin/addClass/addTutorial',
        getClass: '/admin/addClass'
    },

    privacyPolicy: {
        addPrivacyPolicy: '/admin/privacyPolicy/addPrivacyPolicy',
        getPrivacyPolicy: '/admin/privacyPolicy'

    }


}


