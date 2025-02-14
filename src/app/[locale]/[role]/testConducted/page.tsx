'use client';
import { Modal } from 'antd';
import TableData from './TableData';
import FormModal from './FormModal';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { getAllTestConducted } from '@/lib/adminApi';
import { setTestConductBy } from '@/redux/reducers/testConductedByReducer';
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function AdminServices() {
	const dispatch = useAppDispatch();
	// const testConductedBy = useAppSelector((state) => state.testConductedByReducer.testConductBy);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user } = useContext(AuthContext);
	const testConductedBy = useAppSelector((state) => state.testConductedByReducer.testConductBy);

	useEffect(() => {
		if (user) {
			fetchData();
		}
	}, [user]);

	async function fetchData() {
		try {
			const res = await getAllTestConducted();
			if (res.status === true) {
				dispatch(setTestConductBy(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const handleUpdateService = async () => {
		await fetchData();
		setIsModalOpen(false);
	};

	return (
		<>
			<div className="serviceSection">
				<>
					<TableData
						testConductedBy={testConductedBy}
						setTestConductBy={setTestConductBy}
						fetchData={fetchData}
					/>
					<Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
						<FormModal
							onEdit={handleUpdateService}
							onClose={handleCancel}
							testConductedBy={testConductedBy as any}
						/>
					</Modal>
				</>
			</div>
		</>
	);
}
