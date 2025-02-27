'use client';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { getContactUsData, submitContactUsMessage } from '@/lib/adminApi';
import { ContactUs } from '@/lib/types';
import { Input, Image } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import './style.css'
export default function ViewMessages({ id }: any) {
    const { user } = useContext(AuthContext);
    const [newMessage, setNewMessage] = useState('');
    const [allMessages, setAllMessages]: any = useState<ContactUs>();

    const fetchMessages = async () => {
        try {
            const res = await getContactUsData(id as string);
            if (res) {
                setAllMessages(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }
    console.log(allMessages, 'allMessages')
    useEffect(() => {
        if (user) fetchMessages();
    }, [user]);

    const handleMessageSend = async () => {
        try {
            const res = await submitContactUsMessage({
                userId: user?._id as string,
                message: newMessage,
                createdBy: allMessages?.createdBy as string
            });
            if (res.success == true) {
                setNewMessage('')
                fetchMessages()
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    return (
        <>
            <section className="dash-part bg-light-steel ">
                <div className="spac-dash">
                    <h2 className="top-title">Contact Us</h2>
                    <div className="card-dash mt-3">
                        <div className="row align">
                            <div className="col-sm-5 col-6 xs-right-spac-0">
                                <div className="user-card align">
                                    <div className="user-img">
                                        <Image
                                            // src={allMessages?.messages?.[0]?.senderId?.image ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${allMessages?.messages?.[0]?.senderId?.image}` : '/images/smart/user.png'}
                                            src={allMessages?.createdBy?.image ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${allMessages?.createdBy?.image}` : '/images/smart/user.png'}
                                            className="rounded-circle"
                                            height={50}
                                            width={50}
                                        />
                                    </div>
                                    <div className="user-name">
                                        <h5 className="color-dark-gray opacity-7 p-sm bottom-no-space">
                                            {/* {allMessages?.messages?.[0]?.senderId?.name || "No Name Available"} */}
                                            {allMessages?.createdBy?.name || "No Name Available"}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chat-container mt-3 mb-3 chat-height"
                            style={{ height: '-webkit-fill-available' }}

                        >
                            {allMessages &&
                                allMessages.messages.map((message: any, index: any) => {
                                    return (
                                        <div className={`${message?.senderId._id === user?._id ? 'right-chat' : 'left-chat'}`} key={index}>
                                            <div className="d-flex align-items-start  contant-mg-chat">
                                                <div className="user-img-chat">
                                                    {message?.senderId._id !== user?._id && (

                                                        <Image
                                                            src={allMessages?.messages?.[0]?.senderId?.image ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${allMessages?.messages?.[0]?.senderId?.image}` : '/images/smart/user.png'}
                                                            className="rounded-circle"
                                                            height={40}
                                                            width={40}
                                                        />
                                                    )}
                                                </div>
                                                <div className="user-chat text-start">
                                                    <p className="color-dark-gray opacity-6 p-xs fw-medium bottom-small-space ">
                                                        {`${message?.senderId._id === user?._id ? '' : message?.senderId.name}`}
                                                    </p>
                                                    <div className="message-box p-sm"
                                                        style={{
                                                            fontSize: 14,
                                                            color: '#535F74',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {message.message}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className="chat-input w-100">
                            <div className="d-flex align">
                                <div className="message-list-chat w-100">
                                    <div className="message-text">
                                        <Input style={{ height: '50px' }} placeholder="Type a Message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                                        <div style={{ cursor: 'pointer' }} onClick={handleMessageSend}>
                                            <i className="fa-regular fa-paper-plane" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
