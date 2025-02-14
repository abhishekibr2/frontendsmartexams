'use client'
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Divider, Flex, Form, Layout, message, Row, Spin, theme, Typography } from 'antd';
import { RiListCheck3 } from 'react-icons/ri';
import MultiChoiceFormItem from './MultiChoiceFormItem';
import BooleanFormItem from './BooleanFormItem';
import ComprehensionFormItem from './ComprehensionFormItem';
import QuestionFormItem from './QuestionFormItem';
import './style.css';
import axios from 'axios';
import { Question, QuestionOption } from '@/lib/types';
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import ParagraphFormItem from './ParagraphFormItem';
import RichText from '@/commonUI/RichText';
import MultiResponseFormItem from './MultiResponseFormItem';
import { useSearchParams } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';

interface QuestionFormProps {
	questionId?: string;
	testId?: string;
}

type QuestionType = 'multipleResponse' | 'trueFalse' | 'multipleChoice' | 'comprehension';

export default function QuestionForm({ questionId = '', testId }: QuestionFormProps) {
	const {
		token: { colorBgContainer, borderRadiusLG }
	} = theme.useToken();
	const { user } = useContext(AuthContext)
	const [questionType, setQuestionType] = useState<QuestionType>('multipleResponse');
	const [questionText, setQuestionText] = useState<string | undefined>(undefined)
	const [isInitialized, setIsInitialized] = useState(true)
	const [loading, setLoading] = useState(true)
	const [form] = Form.useForm();
	const router = useRouter();
	const searchParams = useSearchParams()
	const page = searchParams.get('page')

	const fetchQuestion = async (id: string) => {
		setLoading(true)
		const response = await axios.get(`/admin/question/${id}`);
		const { question, questionType } = response.data;
		setQuestionType(questionType)
		if (questionType === 'comprehension') {
			let explanation;
			const comprehensionOptions = await Promise.all(
				question.questionId.map(async (item: Question) => {
					explanation = item.explanation;
					const options = await Promise.all(
						item.questionOptions.map(async (option: QuestionOption) => ({
							...option
						}))
					);
					return {
						...item,
						options
					};
				})
			);

			await form.setFieldsValue({
				...question,
				comprehension: comprehensionOptions,
				explanation
			});
		} else {
			const questionOptions = question.questionOptions.map((item: QuestionOption) => ({
				...item
			}));

			setQuestionText(question.questionText)

			await form.setFieldsValue({
				...question,
				question: question.questionText,
				[question.questionType]: questionOptions,
				explanation: question.explanation
			});
		}
		setLoading(false)
	};

	useEffect(() => {
		if (questionId) {
			fetchQuestion(questionId);
		} else {
			setLoading(false);
		}
	}, [questionId]);

	const handleQuestionTypeChange = (type: QuestionType) => {
		if (questionId) {
			message.info("Can't change question type");
			return;
		}
		form.setFieldValue('questionType', type)
		setQuestionType(type);
	};

	const onFinish = async (values: any, isRedirect: boolean, isAddMore: boolean) => {
		try {
			await form.validateFields();
			values.questionId = questionId;
			values.testId = testId;
			values.roleId = user?.roleId._id
			const response = await axios.post('/admin/question', values);
			const data = response.data;
			if (data.success === false) {
				message.error(data.message)
				return
			} else {
				message.success(`Question ${questionId ? 'updated' : 'saved'} successfully`);
				if (isRedirect) {
					if (testId) {
						router.push(`/${user?.roleId.roleName}/test/${testId}/editor/edit`);
					} else {
						router.push(`/${user?.roleId.roleName}/question?page=${page}`);
					}
				} else {
					if (isAddMore) {
						form.resetFields();
						router.push(`/${user?.roleId.roleName}/question/create`);
					} else {
						form.resetFields();
					}
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error("Form submission error: ", error.message);
			}

			const errorInfo = error as { errorFields: any[] };
			if (errorInfo && errorInfo.errorFields && errorInfo.errorFields.length > 0) {
				await onFinishFailed(errorInfo);
			}
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		const firstError = errorInfo.errorFields[0];
		if (firstError) {
			const element = document.querySelector(`#${firstError.name[0]}_help`);
			if (element) {
				window.scrollTo({
					top: element.getBoundingClientRect().top + window.scrollY - 200,
					behavior: 'smooth'
				});
			}
		}
	};

	return (
		<Layout.Content
			style={{
				padding: 24,
				margin: 0,
				minHeight: 280,
				background: colorBgContainer,
				borderRadius: borderRadiusLG
			}}
		>
			<Spin spinning={loading} fullscreen />
			<Row gutter={24} className="question-form-wrapper" justify={'center'}>
				<Col xl={24} lg={24} md={24} sm={24} xs={24}>
					<Form
						form={form}
						layout="vertical"
						size="large"
						onFinish={(values) => onFinish(values, true, false)}
						scrollToFirstError
						onFinishFailed={onFinishFailed}
					>
						<Flex className="form-group-title" gap={'small'}>
							<div className="s-number">1</div>
							<Typography.Title level={5}>Select Question Type</Typography.Title>
						</Flex>
						<Divider />
						<Row justify={'center'} style={{ marginBottom: 30 }}>
							<Col lg={24} md={24} sm={24} xs={24}>
								<Row gutter={20} justify={'space-between'}>
									<Col xl={6} lg={6} md={6} sm={24} xs={24}>
										<div
											className={`question-type-box ${questionType === 'multipleResponse' ? 'active' : ''}`}
											onClick={() => handleQuestionTypeChange('multipleResponse')}
										>
											<div>
												<RiListCheck3 className="question-type-icon" />
												<Typography className="question-type-title">
													Multiple Response
												</Typography>
											</div>
										</div>
									</Col>
									<Col lg={6} md={6} sm={24} xs={24}>
										<div
											className={`question-type-box ${questionType === 'trueFalse' ? 'active' : ''}`}
											onClick={() => handleQuestionTypeChange('trueFalse')}
										>
											<div>
												<RiListCheck3 className="question-type-icon" />
												<Typography className="question-type-title">True False</Typography>
											</div>
										</div>
									</Col>
									<Col lg={6} md={6} sm={24} xs={24}>
										<div
											className={`question-type-box ${questionType === 'multipleChoice' ? 'active' : ''}`}
											onClick={() => handleQuestionTypeChange('multipleChoice')}
										>
											<div>
												<RiListCheck3 className="question-type-icon" />
												<Typography className="question-type-title">Multiple Choice</Typography>
											</div>
										</div>
									</Col>
									<Col lg={6} md={6} sm={24} xs={24}>
										<div
											className={`question-type-box ${questionType === 'comprehension' ? 'active' : ''}`}
											onClick={() => handleQuestionTypeChange('comprehension')}
										>
											<div>
												<RiListCheck3 className="question-type-icon" />
												<Typography className="question-type-title">
													Reading Comprehension
												</Typography>
											</div>
										</div>
									</Col>
								</Row>
							</Col>
						</Row>
						{questionType !== 'comprehension' ? (
							<>
								<Flex className="form-group-title mt-20" gap="small">
									<div className="s-number">2</div>
									<div>
										<Typography.Title level={5}>Write Your Question</Typography.Title>
										<Typography style={{ color: '#ccc' }}>Enter your question only, without answers.</Typography>
									</div>
								</Flex>
								<Divider />
								<Form.Item
									name="question"
									label={'Question'}
									rules={[{ required: true, message: 'Please enter the question!' }]}
								>
									{
										!questionId &&
										<RichText
											placeholder="Enter question"
											onChange={(value) => {
												form.setFieldsValue({
													question: value
												});
											}}
											editorValue={''}
										/>
									}
									{
										questionText &&
										<RichText
											onChange={(value) => {
												form.setFieldsValue({
													question: value
												});
											}}
											editorValue={questionText}
										/>
									}
								</Form.Item>
								<QuestionFormItem required={true} questionType={questionType} />
							</>
						) : (
							<ParagraphFormItem form={form} questionId={questionId} />
						)}
						{!loading && questionType === 'multipleChoice' && <MultiChoiceFormItem form={form} questionId={questionId} setIsInitialized={setIsInitialized} />}
						{!loading && questionType === 'trueFalse' && <BooleanFormItem form={form} questionId={questionId} setIsInitialized={setIsInitialized} />}
						{!loading && questionType === 'multipleResponse' && <MultiResponseFormItem form={form} questionId={questionId} setIsInitialized={setIsInitialized} />}
						{!loading && questionType === 'comprehension' && <ComprehensionFormItem form={form} questionId={questionId} setIsInitialized={setIsInitialized} />}
						{
							!loading && questionType !== 'comprehension' &&
							<React.Fragment>
								<Flex className="form-group-title mt-20" align="" gap={'small'}>
									<div className="s-number">4</div>
									<Typography.Title level={5}>Explanation</Typography.Title>
									<Typography.Text type="secondary">Optional</Typography.Text>
								</Flex>
								<Divider />
								<Form.Item
									name="explanation"
									label="Explanation for correct answer"
								>
									{
										!questionId ?
											<RichText
												placeholder="Enter Explanation"
												onChange={(value) => {
													form.setFieldsValue({
														explanation: value
													});
												}}
												editorValue={''}
											/>
											:
											<RichText
												onChange={(value) => {
													form.setFieldsValue({
														explanation: value
													});
												}}
												editorValue={form.getFieldValue('explanation') ? form.getFieldValue('explanation') : ''}
											/>
									}
								</Form.Item>
							</React.Fragment>
						}
						<Flex gap={'small'} className="mt-20">
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
								>
									Save
								</Button>
							</Form.Item>
							{
								!questionId &&
								<Form.Item>
									<Button
										type="default"
										htmlType="button"
										onClick={() => onFinish(form.getFieldsValue(), false, true)}
									>
										Save and add more
									</Button>
								</Form.Item>
							}
						</Flex>
					</Form>
				</Col>
			</Row>
		</Layout.Content>
	);
}
