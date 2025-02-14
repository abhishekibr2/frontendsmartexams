import React, { useState } from 'react';
import { Form, Divider, Select, Row, Col, Typography, Checkbox, Input, Flex, Skeleton, message } from 'antd';
import RichText from '@/commonUI/RichText';
import { FormInstance } from 'antd/lib';
import { useDataContext } from '@/contexts/DataContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import RichTextLoader from '@/commonUI/RichTextLoader';

interface MultiResponseFormItemProps {
	form: FormInstance;
	questionId?: string;
	setIsInitialized: (isInitialized: boolean) => void;
}

function MultiResponseFormItem({
	form,
	questionId,
	setIsInitialized
}: MultiResponseFormItemProps) {
	const initialValues = [
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false },
		{ title: '', isCorrect: false, hasImage: false },
	];

	const [visibleCount, setVisibleCount] = useState(1);
	const [hasMore, setHasMore] = useState(true);

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
		<div className="multi-select-form-item-wrapper">
			<Flex className="form-group-title mt-20" gap={'small'}>
				<div className="s-number">3</div>
				<div>
					<Typography.Title level={5}>Add your Multiple select answer options</Typography.Title>
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
					name="multipleResponse"
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
					{(fields) => {
						return (
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
														<Form.Item
															name={[field.name, 'isCorrect']}
															valuePropName="checked"
															rules={[
																{
																	required: index < 4 ? true : false,
																	message:
																		'Please mark at least one option as the correct answer!',
																},
															]}
															className="m-0"
															initialValue={false}
														>
															<Checkbox>Set as correct answer</Checkbox>
														</Form.Item>
														<Typography.Text type="secondary">
															{index < 4 ? 'Mandatory' : 'Optional'}
														</Typography.Text>
													</Flex>
													<Form.Item
														style={{ display: 'none' }}
														name={[field.name, 'id']}
														initialValue={form.getFieldValue('multipleResponse')[index]?._id}
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
																		['multipleResponse']: [
																			...form.getFieldValue('multipleResponse').map((item: any, idx: number) => {
																				if (idx === index) {
																					item.title = value;
																				}
																				return item;
																			})
																		]
																	});
																}}
																editorValue={form.getFieldValue('multipleResponse')[index]?.title}
															/>
														)
															:
															!questionId && (
																<RichText
																	onChange={(value) => {
																		form.setFieldsValue({
																			['multipleResponse']: [
																				...form.getFieldValue('multipleResponse').map((item: any, idx: number) => {
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
															rules={[
																{
																	required: index < 4 ? true : false,
																	message: 'Please select if an image is present!',
																},
															]}
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
						);
					}}
				</Form.List>
			</InfiniteScroll>
		</div>
	);
}

export default MultiResponseFormItem;
