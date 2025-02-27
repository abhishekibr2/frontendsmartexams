'use client';
import { Modal } from 'antd';
import TableData from './TableData';
import FAQForm from './FormModal';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { getQuestions } from '@/lib/adminApi';
import AuthContext from '@/contexts/AuthContext';

export default function FaqSection() {
	const { user } = useContext(AuthContext);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [faqs, setFaqs] = useState([])

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
				<FAQForm onClose={handleCancel} getFaqHandler={getFaqHandler} faqId={''} setFaqId={function (value: SetStateAction<string>): void {
					throw new Error('Function not implemented.');
				}} />
			</Modal>

		</>
	)
}

