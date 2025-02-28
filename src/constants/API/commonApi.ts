export const COMMON = {
    notification: {
        getUserNotification: (id: string) => `/common/notification/${id}`,
        updateReadStatus: `/common/notification/mark-all-as-read`,
        updateAllReadStatus: `/common/notification/mark-all-as-read`,
        deleteAllMessages: `/common/notification/delete-all-messages`,
        deleteMessage: '/common/notification/delete-messages',
    },
    profile: {
        storeCardDetail: `/common/profile/store-payment-method`,
        getAllCards: `/common/profile/cards`,
        deleteCard: `/common/profile/delete-card`,
    },
    ticket: {
        addUpdateTicketDetails: `/common/ticket/addUpdateTicketDetails`,
        getAllTicketsWithParams: `/common/ticket/ticketsWithParams`,
        getSingleTicketData: (id: string) => `/common/ticket/details/${id}`,
        deleteTicket: `/common/ticket/delete-ticket`,
        updateTicketStatus: `/common/ticket/updateTicketStatus`,
        getAllTickets: `/common/ticket`,
        assignTicket: `/common/ticket/assignTicket`,
        getAllUserData: `/common/ticket/getticketusers`,
        addChatDetails: `/common/ticketchat/addChatDetails`,
        getChatDetail: (id: string) => `/common/ticketchat/details/${id}`,
    },
    todo: {
        addUpdateTodo: `/common/todo/addUpdateTodo`,
        getAllTodo: `/common/todo`,
        getUserTodo: `/common/todo/getTodo`,
        deleteTodo: `/common/todo/deleteTodo`,
        getAllEvents: `/common/todo/getAllEvents`,
        getEventsById: (id: string) => `/common/todo/getEventsById/${id}`,
    },
    user: {
        getAllUsers: `/common/user/allUsers`,
        getAllRoles: `/common/user/allRoles`,
    },
    forum: {
        addUpdateForumData: `/common/forum/update-forum-data`,
        deleteForumAttachment: `/common/forum/delete-forum-attachment`,
        deleteForum: `/common/forum/delete-forum`,
        getAllForums: '/common/forum/get-all-forums',
        getForumCategories: `/common/forum/get-forums-categories`,

    },
    fileManager: {
        addOrRemoveFileToFavorite: `/common/fileManager/addOrRemoveFileToFavorite`,
        checkIsFavoriteFile: `/common/fileManager/check-favorite-file`,
        deleteUserFile: `/common/fileManager/deleteUserFile`,
        getFavoriteFiles: (id: string) => `/common/fileManager/getFavoriteFiles/${id}`,
        getFileDetails: (id: string) => `/common/fileManager/getFileDetails/${id}`,
        createFolder: '/common/fileManager/createFolder',
        getFolder: (id: string) => `/common/fileManager/getFoldersByUserId/${id}`,
        updateFolder: (folderId: string) => `/common/fileManager/updateFolder/${folderId}`,
        deleteFolder: `/common/fileManager/deleteFolder`,
        getFileTypes: (userId: any) => `/common/fileManager/getFileTypes/${userId}`,
        getFilesWithParams: `/common/fileManager/getFilesWithParams`,
        downloadZipFile: (folderId: string) => `/common/fileManager/downloadFolder/${folderId}`,
        RecoverFolder: (folderId: string) => `/common/fileManager/recoverFolder/${folderId}`,
        RecoverFile: (fileId: string) => `/common/fileManager/recoverFile/${fileId}`,
        deleteFolderPermanently: `/common/fileManager/deleteFolderPermanently`,
        deleteFilePermanently: `/common/fileManager/deleteFilePermanently`,
        GetRecycledFilesAndFolders: (userId: string) => `/common/fileManager/recycledFilesAndFolder/${userId}`,
        getFilesByFolder: `/common/fileManager/getFilesByFolder`,
        fileUpload: `/common/fileManager/uploadFile`,
        getListOfContributors: (id: string) => `/common/fileManager/getListOfContributors/${id}`,
        getSingleFolder: (id: string) => `/common/fileManager/getSingleFolder/${id}`,
    },
    blog: {
        blogs: '/common/blogs',
    },

    commonHeader: {
        header: '/common/header/common'
    },
    commonFooter: {
        footer: '/common/footer/common'
    },
    commonStates: {
        states: '/common/states',
        addStates: '/common/states/addUpdateStateDetails',
        deleteStates: '/common/states/deleteState',
    },
    state: {
        getAllStates: `/common/states`,
    },
    grade: {
        getAllGrades: `/common/grades`,
    },
    examType: {
        getAllExamType: `/common/examTypes`,
    },
    payment: {
        getAllPayments: `/common/getAllPayments`
    },
    // here make a common
    complexity: {
        getAllComplexity: `/common/complexity`,
    },
    subject: {
        getAllSubjects: `/common/subjects`,
    },
    testAdmin: {
        getAllTests: `/common/test/getAllTests`,
        getTestById: '/common/test/getTestById',

    },
    packages: {
        getAllPackage: `/common/package/getPackage`,
    },
    packageEssay: {
        getAllEssay: `/common/packageEssay/getEssay`,
    },
    essay: {
        getSubmitPackageEssay: '/common/essay/getSubmitPackageEssay',
        getPackageEssayById: '/common/essay/getPackageEssayById',
        updatePackageEssay: '/common/essay/updatePackageEssay',
    },
}
