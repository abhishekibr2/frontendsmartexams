import React from 'react';
import { getFaqStateWithExamTypes, getStateWithExamTypesWithSlug, getTestimonialStateWithExamTypes } from "@/lib/frontendApi";
import DetailExamtype from '@/components/DetailExamtype';


export default async function Page({ params }: { params: { stateslug: string, examSlug: string } }) {

    const { stateslug, examSlug } = params;

    const res = await getStateWithExamTypesWithSlug(stateslug, examSlug);
    const stateId = res.data?.stateId?._id;
    const examId = res.data?._id;

    const resdata = await getFaqStateWithExamTypes(stateId, examId);
    const getTestimonial = await getTestimonialStateWithExamTypes(stateId, examId);

    return (
        <>
            <DetailExamtype statedata={res?.data} resdata={resdata} testimonial={getTestimonial?.data} />
        </>
    )
}
