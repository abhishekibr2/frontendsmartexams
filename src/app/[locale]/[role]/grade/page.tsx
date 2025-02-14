'use client';
import { Modal } from 'antd';
import TableData from './TableData';
import FormModal from './FormModal';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { getAllGrades } from '@/lib/adminApi';
import { setGrades } from '@/redux/reducers/gradeReducer';
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function AdminServices() {
	const dispatch = useAppDispatch();
	const grades = useAppSelector((state) => state.gradeReducer.grades);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user } = useContext(AuthContext);
	useEffect(() => {
		if (user) {
			fetchData();
		}
	}, [user]);

	async function fetchData() {
		try {
			const res = await getAllGrades();
			if (res.status === true) {
				dispatch(setGrades(res.data));
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
					<TableData grades={grades} setGrades={setGrades} fetchData={fetchData} />
					<Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
						<FormModal
							onEdit={handleUpdateService}
							onClose={handleCancel}
							grade={grades as any}
							authorName={''}
						/>
					</Modal>
				</>
			</div>
		</>
	);
}
