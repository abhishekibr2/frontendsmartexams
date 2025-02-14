import TermsOfService from '@/components/frontend/TermsOfService';
import { getTermsCondition } from '@/lib/frontendApi'
import React from 'react'

export default async function page() {
    const res = await getTermsCondition();

    return (
        <TermsOfService data={res.data} />
    )
}

