'use client';
import { Button, Col, Modal, Row } from 'antd';
import TableData from './TableData';
import FAQForm from './FormModal';
import { useContext, useEffect, useState } from 'react';
import { getQuestions } from '@/lib/adminApi';
import AuthContext from '@/contexts/AuthContext';

export default function FaqSection() {
	const { user } = useContext(AuthContext);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [faqs, setFaqs] = useState([])
	const userId = user?._id;

	const showModal = () => {
		setIsModalVisible(true);
	};
	const handleOk = () => {
		setIsModalVisible(false);
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const getFaqHandler = async () => {
		try {
			const response = await getQuestions();
			if (response) {
				setFaqs(response.data);
			}
		} catch (error) {
			console.log('Error fetching FAQs:');
		}
	}

	useEffect(() => {
		if (user) {
			getFaqHandler();
		}
	}, [user])


	return (
		<>
			<TableData getFaqHandler={getFaqHandler} faqs={faqs} />
			<Modal
				title="Add Question"
				visible={isModalVisible}
				footer={null}
				onOk={handleOk}
				onCancel={handleCancel}


			>
				<FAQForm onClose={handleCancel} getFaqHandler={getFaqHandler} />
			</Modal>

		</>
	)
}

