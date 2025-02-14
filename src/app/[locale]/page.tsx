import React from 'react'
import { getServicesFrontEnd, getAllStateWithTheirTests, getStateWithExamTypes, getHomepageContent } from '@/lib/frontendApi';
import HomePage from '@/components/frontend/HomePage';

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
	const stateDataExam = stateExamType.status ? stateExamType.data : [];
	const data = homepageContent.status ? homepageContent.data : [];

	return (
		<>
			<HomePage menuItemdata={menuItems} allData={allData} stateDataExam={stateDataExam} homepageContent={data} />
		</>
	)
}
