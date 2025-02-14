'use client';
import React, { useContext, useEffect } from 'react';
import { Col, Modal, Row } from 'antd';
import TableAuthor from './TableAuthor';
import FormModal from './FormModal';
import { getAllAuthors } from '@/lib/adminApi';
import PrimaryButton from '@/app/commonUl/primaryButton';
import Titles from '@/app/commonUl/Titles';
import './style.css';
import ErrorHandler from '@/lib/ErrorHandler';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { setAuthors, setCurrentAuthor, setShowAuthorForm } from '@/redux/reducers/authorReducer';
import AuthContext from '@/contexts/AuthContext';

interface Author {
	status: string;
	_id: string;
	name: string;
}

export default function Author() {
	const dispatch = useAppDispatch();
	const { showAuthorForm } = useAppSelector((state: RootState) => state.authorReducer);
	const { user } = useContext(AuthContext);

	const showModal = () => {
		dispatch(setCurrentAuthor(null));
		dispatch(setShowAuthorForm(true));
	};

	useEffect(() => {
		getAuthors();
	}, [user]);

	const getAuthors = async () => {
		try {
			const response = await getAllAuthors();
			dispatch(setAuthors(response.data));
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};
	return (
		<div>
			<>
				<div className="dashBody">
					<Row gutter={[16, 16]} align={'middle'} className="textAlignment ">
						<Col xs={8} sm={16} md={18} lg={20} xl={20} xxl={21}>
							<Titles level={5} color="black" className="top-title">
								Author
							</Titles>
						</Col>
						<Col xs={16} sm={8} md={6} lg={4} xl={4} xxl={3} className="textEnd mNone">
							<div>
								<PrimaryButton label="Add New Author" onClick={showModal} />
							</div>
						</Col>
					</Row>
					<div className="gapPaddingTopOTwo"></div>
					<TableAuthor />
					<Modal
						title="Add New Author"
						open={showAuthorForm}
						onOk={() => dispatch(setShowAuthorForm(false))}
						onCancel={() => dispatch(setShowAuthorForm(false))}
						footer={null}
						className="width-modal"
					>
						<FormModal />
					</Modal>
				</div>
			</>
		</div>
	);
}
