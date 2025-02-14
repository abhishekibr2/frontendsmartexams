
import React from 'react'
import { getAllForums } from '@/lib/frontendApi';
import { Metadata } from 'next';
import AllForum from '@/components/frontend/Forum';
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: `Forum | ${process.env.NEXT_APP_NAME}`,
        description: `${process.env.NEXT_APP_NAME}`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/forum`
        },
        openGraph: {
            title: `Forum | ${process.env.NEXT_APP_NAME}`,
            description: `${process.env.NEXT_APP_NAME}`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/forum`,
            siteName: `${process.env.NEXT_APP_NAME}`,
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo.png`,
                    width: 350,
                    height: 50
                }
            ],
            type: 'website'
        }
    };
}
export default async function page() {
    const forumdata = await getAllForums();

    return (
        <>
            <AllForum forums={forumdata} />

        </>
    )
}

