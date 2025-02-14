import React from 'react'
import { getServicesFrontEnd, getAllStateWithTheirTests, getStateWithExamTypes, getHomepageContent } from '@/lib/frontendApi';
import TestPacks from '@/components/frontend/TestPacks';

export default async function page() {
    const menuResponse = await getServicesFrontEnd();

    const stateTestsResponse = await getAllStateWithTheirTests();
    const stateExamType = await getStateWithExamTypes();
    const homepageContent = await getHomepageContent();


    const menuItems = menuResponse?.data.map((item: any) => ({
        key: item._id,
        label: item.title.toUpperCase(),
        children: [],
    })) || [];

    const allData = stateTestsResponse.status ? stateTestsResponse.data : [];
    const stateData = stateExamType.status ? stateExamType.data : [];
    const data = homepageContent.status ? homepageContent.data : [];




    return (
        <>
            <TestPacks menuItemdata={menuItems} allData={allData}
                stateDataExam={stateData} homepageContent={data} />
        </>
    );
}



