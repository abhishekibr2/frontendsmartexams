'use client';
import React, { useEffect, useContext } from 'react';
import { Modal } from 'antd';
import FormModal from './FormModal';
import TableData from './TableData/index';
import AuthContext from '@/contexts/AuthContext';
import { getAllTestimonials } from '@/lib/adminApi';
import { setTestimonial, setModal, setEditData } from '@/redux/reducers/testimonialReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ErrorHandler from '@/lib/ErrorHandler';

export default function Testimonials() {
	const { user } = useContext(AuthContext);
	const dispatch = useDispatch();

	const isModalOpen = useSelector((state: RootState) => state.testimonialReducer.modal);
	const fetchTestimonials = useSelector((state: RootState) => state.testimonialReducer.fetchTestimonials);
	const editData = useSelector((state: RootState) => state.testimonialReducer.editData); // Get the data for editing


	useEffect(() => {
		if (user) {
			getAllTestimonial();
		}
	}, [user, fetchTestimonials]);

	const getAllTestimonial = async () => {
		try {
			const response = await getAllTestimonials();
			dispatch(setTestimonial(response.data));
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	return (
		<>
			<div className='serviceSection'>
				<TableData />

				{/* <Modal
					title={editData ? 'Edit Testimonial' : 'Add Testimonial'} // Change title based on whether editing or adding
					open={isModalOpen}
					onOk={() => dispatch(setModal(false))}
					onCancel={() => dispatch(setModal(false))}
					footer={null}
					width={600}

				>
					<FormModal />
				</Modal> */}
			</div>
		</>

	);
}
