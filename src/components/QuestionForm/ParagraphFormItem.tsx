import React, { useContext } from 'react';
import { Col, Divider, Flex, Form, Input, Row, Select, Typography } from 'antd';
import RichText from '@/commonUI/RichText';
import { Grade } from '@/lib/types';
import { FormInstance } from 'antd/lib';
import { useDataContext } from '@/contexts/DataContext';
import AuthContext from '@/contexts/AuthContext';

interface ParagraphFormItemProps {
	form: FormInstance;
	questionId?: string;
	showRichText?: boolean;
	required?: boolean;
	isUploadedByFile?: boolean;
	isDocxUpload?: boolean;
}

export default function ParagraphFormItem({
	form,
	questionId,
	showRichText = true,
	required = true,
	isUploadedByFile = false,
	isDocxUpload = false
}: ParagraphFormItemProps) {
	const {
		complexity,
		examTypes,
		subjects,
		grades
	} = useDataContext();
	const { user } = useContext(AuthContext)

	return (
		<div className="question-input-wrapper">
			{showRichText &&
				<React.Fragment>
					<Flex className="form-group-title mt-20" gap={'small'}>
						<div className="s-number">2</div>
						<div>
							<Typography.Title level={5}>Enter Your Question Paragraph</Typography.Title>
							<Typography style={{ color: '#ccc' }}>
								Enter the paragraph or description of your question here, without including the answer choices.
							</Typography>
						</div>
					</Flex>
					<Divider />
					<Form.Item
						name="paragraph"
						label="Paragraph"
						rules={[{ required: required, message: 'Please enter the paragraph!' }]}
					>
						{
							form.getFieldValue('paragraph') ?
								<RichText
									placeholder="Enter your paragraph here"
									onChange={(value) => {
										form.setFieldsValue({
											paragraph: value
										});
									}}
									editorValue={form.getFieldValue('paragraph')}
								/>
								:
								!questionId &&
								<RichText
									placeholder="Enter your paragraph here"
									onChange={(value) => {
										form.setFieldsValue({
											paragraph: value
										});
									}}
									editorValue={''}
								/>
						}
					</Form.Item>
				</React.Fragment>
			}
			<Row gutter={24} className="mt-20">
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name="complexityId"
						label="Paragraph Complexity"
						rules={[{ required: required, message: 'Please select the paragraph complexity!' }]}
					>
						<Select
							placeholder="Select complexity"
							options={complexity.map((item: any) => {
								return {
									label: item.complexityLevel,
									value: item._id
								};
							})}
						/>
					</Form.Item>
				</Col>
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name="examTypeId"
						label="Exam Type"
						rules={[{ required: required, message: 'Please select the question type!' }]}
					>
						<Select
							placeholder="Select question type"
							options={examTypes?.map((item: any) => {
								return {
									label: `${item.examType} (${item.stateId.title})`,
									value: item._id
								};
							})}
						/>
					</Form.Item>
				</Col>
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name={'hasImage'}
						label="Is Image Present in Paragraph?"
						rules={[{ required: required, message: 'Please select whether an image is present!' }]}
						initialValue={false}
					>
						<Select
							placeholder="Select yes or no"
							options={[
								{ label: 'Yes', value: true },
								{ label: 'No', value: false }
							]}
						/>
					</Form.Item>
				</Col>
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name="subjectId"
						label="Subject"
						rules={[{ required: required, message: 'Please select the subject!' }]}
					>
						<Select
							placeholder="Select subject"
							options={subjects.map((subject: any) => {
								return {
									label: subject.subjectName,
									value: subject._id
								};
							})}
						/>
					</Form.Item>
				</Col>
				{
					!isDocxUpload &&
					<>
						<Col lg={8} md={8} sm={24} xs={24}>
							<Form.Item
								name="topic"
								label="Paragraph Topic"
								rules={[{ required: required, message: 'Please select the paragraph topic!' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col lg={8} md={8} sm={24} xs={24}>
							<Form.Item
								name="subTopic"
								label="Paragraph Sub-Topic"
								rules={[{ required: required, message: 'Please select the paragraph sub-topic!' }]}
							>
								<Input />
							</Form.Item>
						</Col>
					</>
				}
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name="gradeId"
						label="Grade"
						rules={[{ required: required, message: 'Please select the grade!' }]}
					>
						<Select
							placeholder="Select grade"
							options={grades.map((item: Grade) => {
								return {
									label: item.gradeLevel,
									value: item._id
								};
							})}
						/>
					</Form.Item>
				</Col>
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name="qualityChecked"
						label="Quality Checked?"
						rules={[{ required: required, message: 'Please select if the question is quality checked!' }]}
						initialValue={false}
					>
						<Select
							disabled={user?.isAdmin ? false : true}
							placeholder="Select yes or no"
							options={[
								{ label: 'Yes', value: true },
								{ label: 'No', value: false }
							]}
						/>
					</Form.Item>
				</Col>
			</Row>
		</div>
	);
}
