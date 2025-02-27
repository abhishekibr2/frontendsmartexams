import AuthContext from '@/contexts/AuthContext';
import { Form, Input, Button, Col, Row, Select } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { AddQuestions } from '@/lib/adminApi';
import RichText from '@/commonUI/RichText';
import { getStateWithExamTypes } from '@/lib/frontendApi';

interface ExamType {
	_id: string;
	examType: string;
}

interface State {
	_id: string;
	title: string;
	examTypes: ExamType[];
}

interface FAQFormProps {
	handleEdit?: any;
	onClose: () => void;
	getFaqHandler: () => void;
	faqId: string;
	setFaqId: React.Dispatch<React.SetStateAction<string>>;
}

export default function FAQForm({ handleEdit, onClose, getFaqHandler, faqId, setFaqId }: FAQFormProps) {
	const { user } = useContext(AuthContext);
	const [form] = Form.useForm();
	// const [faqId, setFaqId] = useState<string>('');
	const [answerText, setAnswerText] = useState<string>('');
	const [state, setState] = useState<State[]>([]);
	const [filteredExamTypes, setFilteredExamTypes] = useState<ExamType[]>([]);
	const [page, setPage] = useState<string>('');

	useEffect(() => {
		if (handleEdit) {
			setFaqId(handleEdit._id);
			form.setFieldsValue({
				questions: handleEdit.questions,
				answer: handleEdit.answer,
				pages: handleEdit.pages,
				state: handleEdit.stateId?._id,
				examType: handleEdit.examTypeId?._id,
				numberOrder: handleEdit?.orderBy
			});

			setAnswerText(handleEdit.answer);
			setPage(handleEdit.pages);

			const selectedStateItem = state.find((item) => item._id === handleEdit.stateId?._id);
			if (selectedStateItem) {
				setFilteredExamTypes(selectedStateItem.examTypes);
			}

		} else {
			form.resetFields();
			setAnswerText('');
		}
	}, [handleEdit, form, state]);

	const getStates = async () => {
		try {
			const response = await getStateWithExamTypes();
			setState(response.data);
		} catch (error) {
			console.error('Error while getting states:', error);
		}
	};

	useEffect(() => {
		getStates();
	}, []);

	const onFinish = async (values: any) => {
		try {
			const data = {
				questions: values.questions,
				pages: values.pages,
				// stateId: values.state,
				// examTypeId: values.examType,
				stateId: values.pages === 'Home' ? null : values.state,
				examTypeId: values.pages === 'Home' ? null : values.examType,
				answer: values.answer,
				updateId: faqId || '',
				orderBy: values.numberOrder
			};

			const response = await AddQuestions(data);

			if (response) {
				onClose();
				getFaqHandler();
				form.resetFields();
				setFaqId('');
				setAnswerText('');
			} else {
				console.error('Failed to add question');
			}
		} catch (error) {
			console.error('Error while adding question:', error);
		}
	};

	const handleStateChange = (stateId: string) => {
		const selectedStateItem = state.find((item) => item._id === stateId);
		if (selectedStateItem) {
			setFilteredExamTypes(selectedStateItem.examTypes);
		}
	};

	const handlePageName = async (values: any) => {
		setPage(values)
		if (values === 'Home') {
			form.setFieldsValue({
				state: null,
				examType: null,
			});
		}
	}

	return (
		<Form layout="vertical" onFinish={onFinish} form={form}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Form.Item
						label="Question"
						name="questions"
						rules={[{ message: 'Please enter a question' }]}
					>
						<Input placeholder="Enter Question" maxLength={50} />
					</Form.Item>
				</Col>

			</Row>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={24} md={6} xl={6}>
					<Form.Item
						label="Pages"
						name="pages"
						rules={[{ message: 'Please select a location type!' }]}
					>
						<Select placeholder="Select a location type" onChange={handlePageName}>
							<Select.Option value="Home">Home</Select.Option>
							<Select.Option value="Exam Info">Exam Info</Select.Option>
						</Select>
					</Form.Item>
				</Col>
				{
					page === 'Home' ? (
						<>

							<Col xs={24} sm={24} md={6} xl={6}>
								<Form.Item
									label="State"
									name="state"
									rules={[{ message: 'Please select a state!' }]}
								>
									<Select
										placeholder="Select a state"
										onChange={handleStateChange}
										disabled={page === 'Home'}
									>
										{state.map((item) => (
											<Select.Option key={item._id} value={item._id}>
												{item.title}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>

							<Col xs={24} sm={24} md={6} xl={6}>
								<Form.Item
									label="Exam Type"
									name="examType"
									rules={[{ message: 'Please select an exam type!' }]}
								>
									<Select
										placeholder="Select an exam type"
										disabled={page === 'Home'}
									>
										{filteredExamTypes.map((examType) => (
											<Select.Option key={examType._id} value={examType._id}>
												{examType.examType}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</>
					) : (
						<>
							<Col xs={24} sm={24} md={6} xl={6}>
								<Form.Item
									label="State"
									name="state"
									rules={[{ required: true, message: 'Please select a state!' }]}
								>
									<Select placeholder="Select a state" onChange={handleStateChange}>
										{state.map((item) => (
											<Select.Option key={item._id} value={item._id}>
												{item.title}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>

							<Col xs={24} sm={24} md={6} xl={6}>
								<Form.Item
									label="Exam Type"
									name="examType"
									rules={[{ required: true, message: 'Please select an exam type!' }]}
								>
									<Select placeholder="Select an exam type">
										{filteredExamTypes.map((item) => (
											<Select.Option key={item._id} value={item._id}>
												{item.examType}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</>
					)
				}
				<Col xs={24} sm={24} md={6} xl={6}>
					<Form.Item
						label="Order"
						name="numberOrder"
					>
						<Select placeholder="Select question order" >
							{[...Array(20)].map((_, index) => (
								<Select.Option key={index + 1} value={index + 1}>
									{index + 1}
								</Select.Option>
							))}
						</Select>

					</Form.Item>
				</Col>
			</Row>



			<Col span={24}>
				<Form.Item
					label="Answer"
					name="answer"
					rules={[{ message: 'Please enter an answer' }]}
				>
					<RichText
						editorValue={form.getFieldValue('description') || handleEdit?.answer || handleEdit?.answer}
						onChange={(value) => {
							form.setFieldsValue({ answer: value || handleEdit?.answer });
						}}
					/>

				</Form.Item>
			</Col>

			<Col span={24}>
				<Form.Item>
					<Button type="primary" htmlType="submit" style={{ width: '100%' }}>
						{handleEdit ? 'Update ' : 'Add'}

					</Button>
				</Form.Item>
			</Col>

		</Form >
	);
}
