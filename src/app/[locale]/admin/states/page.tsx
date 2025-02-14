'use client';
import { Modal } from 'antd';
import TableData from './TableData';
import FormModal from './FormModal';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { getCommonStates } from '@/lib/commonApi';
import { setServices } from '@/redux/reducers/serviceReducer';
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function AdminServices() {
	const dispatch = useAppDispatch();
	const services = useAppSelector((state) => state.serviceReducer.services);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user) {
			fetchData();
		}
	}, [user]);

	async function fetchData() {
		try {
			const res = await getCommonStates();
			if (res.status === true) {
				dispatch(setServices(res.data));
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

			<TableData services={services} setServices={setServices} fetchData={fetchData} />
			<Modal
				title="Add New State"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
			>
				<FormModal
					onEdit={handleUpdateService}
					onClose={handleCancel}
					service={services as any}
					authorName={''}
				/>
			</Modal>

		</>
	);
}
