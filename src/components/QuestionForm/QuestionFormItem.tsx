import React from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import { Grade } from '@/lib/types';
import { useDataContext } from '@/contexts/DataContext';

interface QuestionFormItemProps {
	required: boolean;
	questionType?: string;
}

export default function QuestionFormItem({
	required = true,
	questionType
}: QuestionFormItemProps) {
	const {
		complexity,
		examTypes,
		subjects,
		grades
	} = useDataContext();
	return (
		<div className="question-input-wrapper">
			<Row gutter={24} className="mt-20">
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name="complexityId"
						label="Question Complexity"
						rules={[{ required: required, message: 'Please select the question complexity!' }]}
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
				<Col lg={8} md={8} sm={24} xs={24} style={{
					display: 'none'
				}}>
					<Form.Item
						name="questionType"
						label="Question Type"
						rules={[{ required: required, message: 'Please select the question type!' }]}
						initialValue={'multipleResponse'}
					>
						<Select
							placeholder="Select question type"
							disabled
							options={[
								{ label: 'Multiple Choice', value: 'multipleChoice' },
								{ label: 'True/False', value: 'trueFalse' },
								{ label: 'Multiple Response', value: 'multipleResponse' },
								{ label: 'Comprehension', value: 'comprehension' }
							]}
						/>
					</Form.Item>
				</Col>
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name="hasImage"
						label="Is image present in Question?"
						initialValue={false}
						rules={[
							{
								required: required,
								message: 'Please select whether the question contains an image!'
							}
						]}
					>
						<Select
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
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name="examTypeId"
						label="Exam Type"
						rules={[{ required: required, message: 'Please select the exam type!' }]}
					>
						<Select
							placeholder={'Select exam type'}
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
						name="topic"
						label="Topic"
						rules={[{ required: required, message: 'Please select the topic!' }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name="gradeId"
						label="Grade"
						rules={[{ required: required, message: 'Please select the grade!' }]}
					>
						<Select
							placeholder='Select grade'
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
						initialValue={true}
						rules={[
							{
								required: required,
								message: 'Please select if the question is quality checked!'
							}
						]}
					>
						<Select
							options={[
								{ label: 'Yes', value: true },
								{ label: 'No', value: false }
							]}
						/>
					</Form.Item>
				</Col>
				<Col lg={8} md={8} sm={24} xs={24}>
					<Form.Item
						name="subTopic"
						label="Sub Topic"
						rules={[{ required: required, message: 'Please select the sub-topic!' }]}
					>
						<Input placeholder='Sub title' />
					</Form.Item>
				</Col>
			</Row>
		</div>
	);
}
