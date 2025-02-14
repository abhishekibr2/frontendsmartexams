import React, { useState } from 'react';
import { Form, Row, Col, Typography, Radio, Divider, Select, Flex, Input, FormInstance, message } from 'antd';
import RichText from '@/commonUI/RichText';
import InfiniteScroll from 'react-infinite-scroll-component';
import RichTextLoader from '@/commonUI/RichTextLoader';

interface MultiChoiceFormItemProps {
	form: FormInstance;
	questionId?: string;
	setIsInitialized: (isInitialized: boolean) => void;
}

function MultiChoiceFormItem({ form, questionId, setIsInitialized }: MultiChoiceFormItemProps) {
	const [visibleCount, setVisibleCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const initialValues = [
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false }
	];

	const handleIsCorrectChange = (index: number) => {
		const currentValues = form.getFieldValue('multipleChoice') || [];
		const updatedValues = currentValues.map((item: any, idx: number) => ({
			...item,
			isCorrect: idx === index
		}));
		form.setFieldsValue({ multipleChoice: updatedValues });
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
		<div className="multi-choice-form-wrapper">
			<Flex className="form-group-title mt-20" gap={'small'}>
				<div className="s-number">3</div>
				<div>
					<Typography.Title level={5}>Add your multiple choice answer options</Typography.Title>
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
					name="multipleChoice"
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
												<Flex justify="space-between" align="center">
													<Form.Item name={[field.name, 'isCorrect']} valuePropName="checked" className='m-0'>
														<Radio
															checked={form.getFieldValue('multipleChoice')[index]?.isCorrect}
															onChange={() => handleIsCorrectChange(index)}
														>
															Set as correct answer
														</Radio>
													</Form.Item>
													<Typography.Text type="secondary">Mandatory</Typography.Text>
												</Flex>
												<Form.Item
													style={{ display: 'none' }}
													name={[field.name, 'id']}
													initialValue={form.getFieldValue('multipleChoice')[index]?._id}
												>
													<Input />
												</Form.Item>
												<Form.Item
													name={[field.name, 'title']}
													rules={[{ required: index < 4 ? true : false, message: 'Please provide an answer for this option!' }]}
												>
													{questionId ? (
														<RichText
															onChange={(value) => {
																form.setFieldsValue({
																	['multipleChoice']: [
																		...form.getFieldValue('multipleChoice').map((item: any, idx: number) => {
																			if (idx === index) {
																				item.title = value;
																			}
																			return item;
																		})
																	]
																});
															}}
															editorValue={form.getFieldValue('multipleChoice')[index]?.title}
														/>
													)
														:
														!questionId && (
															<RichText
																onChange={(value) => {
																	form.setFieldsValue({
																		['multipleChoice']: [
																			...form.getFieldValue('multipleChoice').map((item: any, idx: number) => {
																				if (idx === index) {
																					item.title = value;
																				}
																				return item;
																			})
																		]
																	});
																}}
															/>
														)}
												</Form.Item>
												<Flex gap={'small'} align="center">
													<Form.Item
														name={[field.name, 'hasImage']}
														initialValue={false}
														label={`Is image present in choice ${optionLetter}?`}
														rules={[{ required: true, message: 'Please select if an image is present!' }]}
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

export default MultiChoiceFormItem;
