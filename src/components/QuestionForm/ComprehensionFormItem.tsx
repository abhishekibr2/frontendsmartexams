'use client';
import React, { useState } from 'react';
import { Form, Col, Typography, Flex, Divider, Button, Skeleton, Spin, Pagination } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib';
import ComprehensionQuestionFormItem from './ComprehensionQuestionFormItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import RichTextLoader from '@/commonUI/RichTextLoader';

interface ComprehensionFormItemProps {
	form: FormInstance;
	questionId?: string;
	setIsInitialized: (isInitialized: boolean) => void;
}

function ComprehensionFormItem({
	form,
	questionId,
	setIsInitialized
}: ComprehensionFormItemProps) {
	const initialValues = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
	const [hasMore, setHasMore] = useState(true);
	const [visibleCount, setVisibleCount] = useState(1);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalQuestion, setTotalQuestion] = useState(10)
	const itemsPerPage = 1;

	const handleNextPage = () => {
		setCurrentPage(currentPage + 1);
	};

	const handlePreviousPage = () => {
		if (currentPage > 0) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<div className="comprehension-form-item">
			<Flex gap={100} align="center">
				<Flex className="form-group-title mt-20" gap="small">
					<div className="s-number">3</div>
					<div>
						<Typography.Title level={5}>Write Your Question</Typography.Title>
					</div>
				</Flex>
				<Flex className="form-group-title mt-20" gap="small">
					<div className="s-number">4</div>
					<div>
						<Typography.Title level={5}>Choose Options</Typography.Title>
					</div>
				</Flex>
				<Flex className="form-group-title mt-20" gap="small">
					<div className="s-number">5</div>
					<div>
						<Typography.Title level={5}>Give Answers</Typography.Title>
					</div>
				</Flex>
			</Flex>
			<Flex justify="flex-end" gap={'small'} align='center' className="pagination-buttons mb-2">
				<Pagination
					defaultCurrent={currentPage + 1}
					total={totalQuestion}
					pageSize={itemsPerPage}
					onChange={(page) => setCurrentPage(page - 1)}
					itemRender={(page, type, originalElement) => {
						if (type === 'prev') {
							return (
								<Button
									variant="outlined"
									color="primary"
									onClick={handlePreviousPage}
									disabled={currentPage === 0}
									style={{
										height: 32
									}}
								>
									Previous
								</Button>
							);
						}
						if (type === 'next') {
							return (
								<Button
									variant="outlined"
									color="primary"
									onClick={handleNextPage}
									style={{
										height: 32
									}}
									disabled={(currentPage + 1) * itemsPerPage >= totalQuestion}
								>
									Next
								</Button>
							);
						}
						return originalElement;
					}}
				/>
			</Flex>
			<Form.List name="comprehension" key="comprehensionFields" initialValue={initialValues}>
				{(fields, { add, remove }) => {
					setTotalQuestion(fields.length);
					const currentFields = fields.slice(
						currentPage * itemsPerPage,
						(currentPage + 1) * itemsPerPage
					);

					return (
						<>
							{currentFields.map((field, index) => {
								return (
									<ComprehensionQuestionFormItem
										questionId={questionId}
										field={field}
										key={index}
										fields={fields}
										remove={remove}
										index={index}
										form={form}
									/>
								);
							})}
						</>
					);
				}}
			</Form.List>
			<Flex justify="flex-end" gap={'small'} align='center' className="pagination-buttons mb-2">
				<Pagination
					defaultCurrent={currentPage + 1}
					total={totalQuestion}
					pageSize={itemsPerPage}
					onChange={(page) => setCurrentPage(page - 1)}
					itemRender={(page, type, originalElement) => {
						if (type === 'prev') {
							return (
								<Button
									variant="outlined"
									color="primary"
									onClick={handlePreviousPage}
									disabled={currentPage === 0}
									style={{
										height: 32
									}}
								>
									Previous
								</Button>
							);
						}
						if (type === 'next') {
							return (
								<Button
									variant="outlined"
									color="primary"
									onClick={handleNextPage}
									style={{
										height: 32
									}}
									disabled={(currentPage + 1) * itemsPerPage >= totalQuestion}
								>
									Next
								</Button>
							);
						}
						return originalElement;
					}}
				/>
			</Flex>
		</div>
	);
}

export default ComprehensionFormItem;
