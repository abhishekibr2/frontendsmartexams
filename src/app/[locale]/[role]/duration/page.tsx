'use client';
import { Modal } from 'antd';
import TableData from './TableData';
import FormModal from './FormModal';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getDuration } from '@/lib/adminApi';

export default function Subjects() {
	const dispatch = useAppDispatch();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { user } = useContext(AuthContext);
	const [duration, setDuration] = useState([])


	useEffect(() => {
		if (user) {
			fetchData();
		}
	}, [user]);

	async function fetchData() {
		try {
			const res = await getDuration();
			if (res.status === true) {
				setDuration(res.data);
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
					<TableData duration={duration} fetchData={fetchData} />
					<Modal
						title="Add Duration"
						open={isModalOpen}
						onOk={handleOk}
						onCancel={handleCancel}
						footer={null}
					>
						<FormModal
							onEdit={handleUpdateSubjects}
							onClose={handleCancel}
							service={duration as any}
							authorName={''}
						/>
					</Modal>
				</>
			</div>
		</>
	);
}
