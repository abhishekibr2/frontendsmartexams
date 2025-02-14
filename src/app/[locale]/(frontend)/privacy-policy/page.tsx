import { GetPrivacyPolicy } from '@/lib/frontendApi'
import React from 'react'
import PrivacyPolicy from '@/components/frontend/privacypolicy';

export default async function page() {
    const res = await GetPrivacyPolicy();

    return (

        <PrivacyPolicy data={res.data} />
    )
}

