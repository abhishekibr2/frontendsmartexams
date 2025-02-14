'use client'
import ErrorHandler from '@/lib/ErrorHandler';
import { getSingleTicketData } from '@/lib/commonApi';
import React, { useEffect, useState } from 'react'

export default function Page({ params }: { params: { slug: string } }) {
    const [ticketData, setTicketData] = useState('');

    const handleTicketChat = async (ticketId: any) => {
        try {
            const res = await getSingleTicketData(ticketId);
            if (res.status === true) {
                setTicketData(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    useEffect(() => {
        params.slug && handleTicketChat(params.slug)
    }, [])
    return (
        <div>
            {/* {
                ticketData &&
                <TicketPageReply
                    ticketData={ticketData}
                    // onStatusUpdate={handleUpdateFunction}
                    handleTicketChat={(params: any) => handleTicketChat(params.slug)}
                />
            } */}
        </div>
    )
}

