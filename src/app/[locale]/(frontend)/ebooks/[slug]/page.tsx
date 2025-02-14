import React from 'react';
import SingleEbook from '@/components/SingleEbook';
import { getSingleEbook } from '@/lib/frontendApi';

type Props = {
    params: { slug: string };
};
export default async function Page({ params }: { params: { slug: string } }) {
    try {
        const res = await getSingleEbook(params.slug);
        console.log(res.randomBooks.length)
        if (!res || !res.data) {
            throw new Error('Failed to fetch eBook data.');
        }
        return (
            <>
                <SingleEbook ebookData={res.data} randomBooks={res.randomBooks} />
            </>
        );
    } catch (error) {
        console.error('Error fetching eBook data:', error);
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>Unable to load eBook. Please try again later.</p>
            </div>
        );
    }
}
