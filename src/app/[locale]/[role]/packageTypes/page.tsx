'use client';
import React, { useEffect, useState } from 'react';
import FormModal from './FormModal';
import TableData from './TableData';
import { Modal, Button } from 'antd';
import { GetPackageType } from '@/lib/adminApi';

export default function PackageTypes() {
	const [isVisible, setIsVisible] = useState(false);
	const [packageTypes, setPackageTypes] = useState<any[]>([]);

	const showModal = () => {
		setIsVisible(true);
	};

	const handleOk = () => {
		setIsVisible(false);
	};

	const handleCancel = () => {
		setIsVisible(false);
	};


	const handleFetch = async () => {
		try {
			const response = await GetPackageType();
			setPackageTypes(response.packageTypes);
		} catch (error) {
			console.error('Error fetching package types:', error);
		}
	};

	useEffect(() => {
		handleFetch();
	}, []);

	return (
		<div className="blogSection">


			<Modal
				title="Add Package Type"
				onCancel={handleCancel}
				onOk={handleOk}
				footer={null}
				visible={isVisible}

			>
				<FormModal />
			</Modal>

			<TableData packageTypes={packageTypes} handleFetch={handleFetch} />
		</div>
	);
}
