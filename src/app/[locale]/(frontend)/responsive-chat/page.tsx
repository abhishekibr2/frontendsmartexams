'use client'
import React, { useCallback, useEffect, useState } from 'react'
import {
    MainContainer,
    Sidebar,
    Search,
    ConversationList,
    Conversation,
    Avatar,
    ChatContainer,
    ConversationHeader,
    VoiceCallButton,
    VideoCallButton,
    MessageList,
    TypingIndicator,
    MessageSeparator,
    Message,
    InfoButton,
    MessageInput
} from '@chatscope/chat-ui-kit-react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

export default function Page() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [sidebarStyle, setSidebarStyle] = useState({});
    const [chatContainerStyle, setChatContainerStyle] = useState({});
    const [conversationContentStyle, setConversationContentStyle] = useState({});
    const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
    const [height, setHeight] = useState('100vh');  // state for dynamic height

    const handleBackClick = () => setSidebarVisible(!sidebarVisible);

    const handleConversationClick = useCallback(() => {
        if (sidebarVisible) {
            setSidebarVisible(false);
        }
    }, [sidebarVisible]);

    useEffect(() => {
        // Function to update height dynamically
        const updateHeight = () => {
            const viewportHeight = window.innerHeight;
            setHeight(`${viewportHeight}px`);  // Set height excluding the toolbar
        };

        // Update the height on mount and resize
        updateHeight();
        window.addEventListener('resize', updateHeight);

        // Cleanup listener when the component unmounts
        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    useEffect(() => {
        if (sidebarVisible) {
            setSidebarStyle({
                display: "flex",
                flexBasis: "auto",
                width: "100%",
                maxWidth: "100%"
            });

            setConversationContentStyle({
                display: "flex"
            });

            setConversationAvatarStyle({
                marginRight: "1em"
            });

            setChatContainerStyle({
                display: "none"
            });
        } else {
            setSidebarStyle({});
            setConversationContentStyle({});
            setConversationAvatarStyle({});
            setChatContainerStyle({});
        }
    }, [sidebarVisible]);

    return (
        <div
            style={{
                width: '100%',
                height: height,  // Use the dynamically set height here
                position: 'relative',
                overflowX: 'hidden'
            }}>
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transform: 'translateX(0%)' // Fixed typo here from 'transtaleX' to 'translateX'
            }}>
                <MainContainer responsive>
                    <Sidebar position="left" style={sidebarStyle}>
                        <Search placeholder="Search..." />
                        <ConversationList>
                            <Conversation onClick={handleConversationClick}>
                                <Avatar
                                    name="Lilly"
                                    src="https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg"
                                    status="available"
                                    style={conversationAvatarStyle}
                                />
                                <Conversation.Content
                                    name="Lilly"
                                    lastSenderName="Lilly"
                                    info="Yes I can do it for you"
                                    style={conversationContentStyle}
                                />
                            </Conversation>
                        </ConversationList>
                    </Sidebar>
                    <ChatContainer style={chatContainerStyle}>
                        <ConversationHeader>
                            <ConversationHeader.Back onClick={handleBackClick} />
                            <Avatar
                                name="Zoe"
                                src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                            />
                            <ConversationHeader.Content
                                info="Active 10 mins ago"
                                userName="Zoe"
                                style={conversationContentStyle}
                            />
                            <ConversationHeader.Actions>
                                <VoiceCallButton />
                                <VideoCallButton />
                                <InfoButton />
                            </ConversationHeader.Actions>
                        </ConversationHeader>
                        <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
                            <MessageSeparator content="Saturday, 30 November 2019" />
                            <Message
                                model={{
                                    direction: 'incoming',
                                    message: 'Hello my friend',
                                    position: 'single',
                                    sender: 'Zoe',
                                    sentTime: '15 mins ago'
                                }}
                            >
                                <Avatar
                                    name="Zoe"
                                    src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
                                />
                            </Message>
                            {/* Add other messages here as in your original code */}
                        </MessageList>
                        <MessageInput placeholder="Type message here" />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
}
