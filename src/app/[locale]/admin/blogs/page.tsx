'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'antd';
import './style.css';
import TableData from './TableData';
import FormModal from './FormModal';
import { getAllBlogs } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { setBlogs, setModel } from '@/redux/reducers/blogReducer';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import AuthContext from '@/contexts/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function AdminBlogs() {
	const dispatch = useAppDispatch();
	const blogs = useAppSelector((state) => state.blogReducer.blogs);
	const { user } = useContext(AuthContext);
	const isModelOpen = useSelector((state: RootState) => state.blogReducer.model);

	useEffect(() => {
		fetchData();
	}, [user]);

	async function fetchData() {
		try {
			const res = await getAllBlogs();
			if (res.status === true) {
				dispatch(setBlogs(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}

	const handleOk = () => {
		dispatch(setModel(false));
	};

	const handleCancel = () => {
		dispatch(setModel(false));
	};

	const handleUpdateBlog = async () => {
		await fetchData();
		dispatch(setModel(false));
	};
	return (
		<>
			<div className="blogSection">
				<>
					<TableData blogs={blogs} setBlogs={setBlogs} fetchData={fetchData} />
					<Modal
						title="Add New Blog"
						open={isModelOpen}
						onOk={handleOk}
						onCancel={handleCancel}
						footer={null}
						width={700}
					>
						<FormModal
							onEdit={handleUpdateBlog}
							onClose={handleCancel}
							blog={blogs as any}
							authorName={''}
						/>
					</Modal>
				</>
			</div>
		</>
	);
}
