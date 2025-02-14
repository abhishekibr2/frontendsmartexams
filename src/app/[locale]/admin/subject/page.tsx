'use client';
import { Modal } from 'antd';
import TableData from './TableData';
import FormModal from './FormModal';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { getAllSubjects } from '@/lib/adminApi';
import { setSubjects } from '@/redux/reducers/subjectReducer';
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function Subjects() {
	const dispatch = useAppDispatch();
	const subjects = useAppSelector((state) => state.subjectReducer.subjects);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user) {
			fetchData();
		}
	}, [user]);

	async function fetchData() {
		try {
			const res = await getAllSubjects();
			if (res.status === true) {
				dispatch(setSubjects(res.data));
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

	const handleUpdateSubjects = async () => {
		await fetchData();
		setIsModalOpen(false);
	};

	return (
		<>
			<div className="serviceSection">
				<>
					<TableData subjects={subjects} setSubjects={setSubjects} fetchData={fetchData} />
					<Modal
						title="Add New State"
						open={isModalOpen}
						onOk={handleOk}
						onCancel={handleCancel}
						footer={null}
					>
						<FormModal
							onEdit={handleUpdateSubjects}
							onClose={handleCancel}
							service={subjects as any}
							authorName={''}
						/>
					</Modal>
				</>
			</div>
		</>
	);
}
