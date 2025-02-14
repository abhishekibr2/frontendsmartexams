export const CHAT = {
    chat: {
        upload: `/messenger/file/upload`,
    },
    common: {
        fetchMessages: (selectedChatId: string) => `/messenger/message/${selectedChatId}`,
        sendMessage: `/messenger/message`,
        chatSeen: `/messenger/chat/seen`,
        deleteMessage: `/messenger/message/delete`,
        favoriteChat: `/messenger/chat/favourite`,
        clearChat: (selectedChatId: string) => `/messenger/chat/clear-chat/${selectedChatId}`,
        deleteChat: (selectedChatId: string) => `/messenger/chat/delete-chat/${selectedChatId}`,
        muteUnMute: `/messenger/chat/mute-unmute`,
        blockChat: `/messenger/chat/block`,
        continueChat: (selectedChatId: string) => `/messenger/chat/continue/${selectedChatId}`,
        messageDelete: `/messenger/message/delete`,
        bookMarkMessage: (id: string) => `/messenger/message/bookmark/${id}`,
        fetchChats: `/messenger/chat`,
        groupChat: `/messenger/chat/group`,
        searchChat: `/common/user?search=`,
        chatFiles: (chatId: string) => `/messenger/chat/files/${chatId}`,
        blockUser: (userId: string) => `/messenger/user/block/${userId}`,
        unBlockUser: `/messenger/chat/block`,
        stickyNote: `/messenger/chat/sticky-note`,
        deleteScheduledMessage: (id: string) => `/messenger/message/delete/${id}`,
        scheduledMessage: (chatId: string) => `/messenger/message/scheduled/${chatId}`,
        groupRemove: `/messenger/chat/groupremove`,
        updateUser: (userId: string) => `/common/user/update/${userId}`,
    }

}
