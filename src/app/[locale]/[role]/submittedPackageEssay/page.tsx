'use client';
import AuthContext from '@/contexts/AuthContext';
import { GetSubmitPackageEssay } from '@/lib/commonApi';
import React, { useContext, useEffect, useState } from 'react';
import AllEssaySubmitListing from './TableData';
import { SubmitEssay } from '@/lib/types';

export default function Page() {
	const { user } = useContext(AuthContext);

	const [packages, setPackages] = useState<SubmitEssay[]>([]);

	const fetchSubmitPackageData = async () => {
		const response = await GetSubmitPackageEssay();
		if (response) {
			setPackages(response.data);
		}
	};

	useEffect(() => {
		if (user) {
			fetchSubmitPackageData();
		}
	}, [user]);
	return (
		<>
			<AllEssaySubmitListing packages={packages} />

		</>
	);
}
