import React, { useEffect, useState } from 'react';
import { Form, Select, Row, Col, Typography, Radio, Divider, Flex, Skeleton, message } from 'antd';
import RichText from '@/commonUI/RichText';
import InfiniteScroll from 'react-infinite-scroll-component';
import RichTextLoader from '@/commonUI/RichTextLoader';

interface BooleanFormItemProps {
	form: any;
	questionId?: string;
	setIsInitialized: (isInitialized: boolean) => void;
}

function BooleanFormItem({
	form,
	questionId,
	setIsInitialized
}: BooleanFormItemProps) {

	const [visibleCount, setVisibleCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const initialValues = [
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false },
	];

	const handleIsCorrectChange = (index: number) => {
		const currentValues = form.getFieldValue('trueFalse');
		const updatedValues = [...currentValues];

		updatedValues.forEach((item, idx) => {
			if (idx === index) {
				item.isCorrect = true;
			} else {
				item.isCorrect = false;
			}
		});
		form.setFieldsValue({ trueFalse: updatedValues });
	};

	const loadMore = () => {
		if (visibleCount < initialValues.length) {
			setIsInitialized(false)
			setVisibleCount(visibleCount + 1);
		} else {
			setHasMore(false);
			setIsInitialized(true)
		}
	};

	return (
		<div className="boolean-form-input-wrapper">
			<Flex className="form-group-title mt-20" gap={'small'}>
				<div className="s-number">3</div>
				<div>
					<Typography.Title level={5}>Add your True/False answer options</Typography.Title>
					<Typography style={{ color: '#ccc' }}>
						Test takers will select between these answer options.
					</Typography>
				</div>
			</Flex>
			<Divider />

			<InfiniteScroll
				dataLength={visibleCount}
				next={loadMore}
				hasMore={hasMore}
				loader={<RichTextLoader />}
				scrollThreshold={0.6}
				style={{
					overflow: 'hidden'
				}}
			>
				<Form.List
					name="trueFalse"
					initialValue={initialValues}
					rules={[
						{
							validator: async (_, fields) => {
								const hasCheckedOption = fields.some((field: any) => field.isCorrect === true);
								if (!hasCheckedOption) {
									return message.error('Please mark at least one option as the correct answer!');
								}
							},
						},
					]}
				>
					{(fields) => (
						<Row gutter={[24, 24]}>
							{fields.slice(0, visibleCount).map((field, index) => {
								const optionLetter = String.fromCharCode(65 + index);

								return (
									<Col span={24} key={field.key}>
										<Flex className="question-choice-option" gap={'small'}>
											<div
												className="s-number"
												style={{
													marginTop: '10px',
													color: '#ccc',
													background: 'transparent',
													border: '1px solid #ccc',
												}}
											>
												{optionLetter}
											</div>
											<div>
												<Flex justify="space-between" align='baseline'>
													<Form.Item
														name={[field.name, 'isCorrect']}
														initialValue={true}
														className="m-0"
														rules={[
															{
																required: true,
																message: 'Please specify whether this is the correct answer.',
															},
														]}
													>
														<Radio.Group
															onChange={() => handleIsCorrectChange(index)}
														>
															<Radio value={true}>Set as correct answer</Radio>
														</Radio.Group>
													</Form.Item>
													<Typography.Text type="secondary">Mandatory</Typography.Text>
												</Flex>
												<Form.Item
													name={[field.name, 'title']}
													rules={[{ required: true, message: 'Please provide an answer!' }]}
												>
													{questionId && (
														<RichText
															onChange={(value) => {
																form.setFieldsValue({
																	['trueFalse']: [
																		...form.getFieldValue('trueFalse').map(
																			(item: any, idx: number) => {
																				if (idx === index) {
																					item.title = value;
																				}
																				return item;
																			}
																		),
																	],
																});
															}}
															editorValue={form.getFieldValue('trueFalse')[index]?.title}
														/>
													)}
													{!questionId && (
														<RichText
															onChange={(value) => {
																form.setFieldsValue({
																	['trueFalse']: [
																		...form.getFieldValue('trueFalse').map(
																			(item: any, idx: number) => {
																				if (idx === index) {
																					item.title = value;
																				}
																				return item;
																			}
																		),
																	],
																});
															}}
														/>
													)}
												</Form.Item>
												<Flex gap={'small'} align="center">
													<Form.Item
														name={[field.name, 'hasImage']}
														label={`Is image present in choice ${optionLetter}?`}
														rules={[
															{
																required: true,
																message: 'Please specify if an image is present.',
															},
														]}
														initialValue={false}
													>
														<Select>
															<Select.Option value={true}>Yes</Select.Option>
															<Select.Option value={false}>No</Select.Option>
														</Select>
													</Form.Item>
												</Flex>
											</div>
										</Flex>
									</Col>
								);
							})}
						</Row>
					)}
				</Form.List>
			</InfiniteScroll>
		</div>
	);
}

export default BooleanFormItem;
