'use client';
import './style.css';
import { Modal } from 'antd';
import FormModal from './FormModal';
import TableData from './TableData';
import { RootState } from '@/redux/store';
import { getAllUsers } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import React, { useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setShowUserForm, setUsers } from '@/redux/reducers/userReducer';

export default function Users() {
	const dispatch = useAppDispatch();
	const { users, showUserForm, currentUser } = useAppSelector((state: RootState) => state.userReducer);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		fetchData();
	}, []);

	async function fetchData() {
		try {
			const res = await getAllUsers();
			dispatch(setUsers(res.data));
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}
	if (!user) {
		return null;
	}
	const modalTitle = currentUser ? 'Edit User' : 'Add New Users';
	return (
		<div className="userStyle">
			<TableData users={users} setUsers={setUsers} fetchData={fetchData} />
			<Modal
				title={modalTitle}
				open={showUserForm}
				onOk={() => dispatch(setShowUserForm(false))}
				onCancel={() => dispatch(setShowUserForm(false))}
				footer={null}
				width={400}
			>
				<FormModal fetchData={fetchData} />
			</Modal>
		</div>
	);
}
