'use client';
import FormModal from '../FormModal';
import Titles from '@/app/commonUl/Titles';
import { deleteExamType } from '@/lib/adminApi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import PrimaryButton from '@/app/commonUl/primaryButton';
import ResponsiveTable from '@/commonUI/ResponsiveTable';
import React, { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
	Form,
	Input,
	InputNumber,
	Popconfirm,
	Image,
	Modal,
	Row,
	Col,
	Button,
	notification,
	Space,
	message,
	Typography
} from 'antd';
import { ExamType } from '@/lib/types';

interface TableDataProps {
	examTypes: ExamType[];
	fetchData: () => Promise<void>;
	setExamType: (services: ExamType[]) => void;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: string;
	inputType: 'number' | 'text';
	record: ExamType;
	index: number;
	children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

	return (
		<td {...restProps}>
			{editing && dataIndex !== 'authorId' ? (
				<Form.Item
					name={dataIndex}
					style={{ margin: 0 }}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`
						}
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				<div>{children}</div>
			)}
		</td>
	);
};

const TableData: React.FC<TableDataProps> = ({ examTypes, fetchData }) => {
	const [form] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<ExamType | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredService, setFilteredService] = useState<ExamType[]>([]);
	const [servicesId, setServicesId] = useState<string[]>([]);
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value.toLowerCase());
	};
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 300);
		return () => {
			clearTimeout(handler);
		};
	}, [searchQuery]);

	useEffect(() => {
		const filtered = examTypes?.filter((item: ExamType) => {
			const query = debouncedSearchQuery.toLowerCase();
			const titleMatches = item.examType?.toLowerCase().includes(query);
			const statusMatches = item.status?.toLowerCase().includes(query);
			return titleMatches || statusMatches;
		});
		setFilteredService(filtered);
	}, [examTypes, debouncedSearchQuery]);

	const showModal = () => {
		setIsModalOpen(true);
		setSelectedService(null);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);


	};

	const confirmDelete = async (ids: string[]) => {
		try {
			const res = await deleteExamType(ids);
			if (res) {
				fetchData();
				setServicesId([]);
				message.success(res.message);
			}
		}
		catch (error) {
			message.error(error.message);
		}
	};

	const columns = [
		{
			title: 'State',
			dataIndex: 'state',
			key: 'state',
			width: '10%',
			sorter: (a: ExamType, b: ExamType) =>
				(a.stateId?.title || '').localeCompare(b.stateId?.title || ''),
			render: (text: string, record: ExamType) => (
				<div>
					<Row align="middle">
						<span>{record?.stateId ? record?.stateId?.title : 'N/A'}</span>
					</Row>
				</div>
			),
		},
		{
			title: 'Exam Name',
			dataIndex: 'examType',
			key: 'examType',
			width: '15%',
			showOnResponse: true,
			showOnDesktop: true,
			sorter: (a: ExamType, b: ExamType) =>
				(a.examType || '').localeCompare(b.examType || ''),
			render: (text: string, record: ExamType) => (
				<div>
					<Row align="middle">
						<span>
							{record?.examType
								? record.examType.split(' ').slice(0, 10).join(' ') +
								(record.examType.split(' ').length > 10 ? '...' : '')
								: ''}
						</span>
					</Row>
				</div>
			),
		},
		{
			title: 'Eligibility',
			dataIndex: 'eligibility',
			key: 'eligibility',
			width: '15%',
			sorter: (a: ExamType, b: ExamType) =>
				(a.eligibility || '').localeCompare(b.eligibility || ''),
			render: (text: string, record: ExamType) => (
				<div>
					<Row align="middle">
						<span>{record?.eligibility ? record?.eligibility : 'N/A'}</span>
					</Row>
				</div>
			),
		},
		{
			title: 'Duration',
			dataIndex: 'duration',
			key: 'duration',
			width: '10%',
			sorter: (a: ExamType, b: ExamType) => {
				const durationA = a.duration != null ? String(a.duration) : ''; // Convert to string or empty string if null/undefined
				const durationB = b.duration != null ? String(b.duration) : ''; // Same for the second item
				return durationA.localeCompare(durationB); // Sort based on the string representation
			},
			render: (text: string, record: ExamType) => (
				<div>
					<Row align="middle">
						<span>{record?.duration ? record?.duration : 'N/A'}</span>
					</Row>
				</div>
			),
		},
		{
			title: 'Description',
			dataIndex: 'onlineAvailability',
			key: 'onlineAvailability',
			width: '15%',
			sorter: (a: ExamType, b: ExamType) =>
				(a.onlineAvailability || '').localeCompare(b.onlineAvailability || ''),
			render: (text: string, record: ExamType) => (
				<div>
					<Row align="middle">
						<span>{record?.onlineAvailability ? record?.onlineAvailability : 'N/A'}</span>
					</Row>
				</div>
			),
		},
		{
			title: 'Test Subjects',
			dataIndex: 'testSubjects',
			key: 'testSubjects',
			width: '15%',
			sorter: (a: ExamType, b: ExamType) =>
				(a.testSubjects || '').localeCompare(b.testSubjects || ''),
			render: (text: string, record: ExamType) => (
				<div>
					<Row align="middle">
						<span>{record?.testSubjects ? record?.testSubjects : 'N/A'}</span>
					</Row>
				</div>
			),
		},
		{
			title: 'Complexity Level',
			dataIndex: 'complexityLevel',
			key: 'complexityLevel',
			width: '10%',
			sorter: (a: ExamType, b: ExamType) =>
				(a.complexityId?.complexityLevel || '').localeCompare(
					b.complexityId?.complexityLevel || ''
				),
			render: (text: string, record: ExamType) => (
				<div>
					<Row align="middle">
						<span>
							{record?.complexityId && record?.complexityId.complexityLevel
								? record?.complexityId.complexityLevel
								: 'N/A'}
						</span>
					</Row>
				</div>
			),
		},
		{
			title: 'Action',
			dataIndex: 'operation',
			key: 'operation',
			showOnResponse: true,
			width: '10%',
			showOnDesktop: true,
		},
	];


	const handleEditClick = (record: ExamType) => {
		setSelectedService(record);
		setIsModalOpen(true);
	};

	const serviceData = filteredService?.map((data: ExamType) => ({
		...data,
		title: data.examType,
		key: data._id,
		createdAt: data.createdAt.slice(0, 10),
		status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
		operation: (
			<span>
				<Button
					onClick={() => {
						showModal();
						handleEditClick(data);
					}}
				>
					<EditOutlined />
				</Button>
				<Popconfirm
					title="Are you sure you want to delete this ExamType?"
					onConfirm={() => confirmDelete([data._id])}
					okText="Yes"
					cancelText="No"
				>
					<Button style={{ marginLeft: '10px' }}>
						<DeleteOutlined />
					</Button>
				</Popconfirm>
			</span>
		)
	}));

	const GetSelectedId = (data: []) => {
		setServicesId(data);
	};

	return (
		<>
			<div>
				<Row >
					<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<Titles level={5} className="top-title">
							Exam Type
						</Titles>
					</Col>
					<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<div className="floatRight text-end">
							<Space>
								{servicesId.length > 0 && (
									<Popconfirm
										style={{ height: '40px' }}
										title="Are you sure to delete selected examType?"
										onConfirm={() => confirmDelete(servicesId)}
										okText="Yes"
										cancelText="No"
									>
										<Button
											className="primary"
											danger
											ghost
											style={{
												marginLeft: '10px',
												color: '#b90d0d',
												background: '#af03031f'
											}}
										>
											<RiDeleteBin5Line style={{ fontSize: '15px', margin: '0 5px -1px 0' }} />
											Delete
										</Button>
									</Popconfirm>
								)}

								<Input placeholder="Search" onChange={handleSearchChange} maxLength={40} style={{ width: '200px', height: '38px' }} />
								<PrimaryButton label="Add New ExamType" onClick={showModal} />


							</Space>
						</div>
					</Col>
				</Row>

				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<h6 >Count: {filteredService.length}</h6>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>

					</Col>
				</Row>

				<Form form={form} component={false}>
					<ResponsiveTable columns={columns} data={serviceData} GetSelectedId={GetSelectedId} />
				</Form>
				<Modal
					title={selectedService ? 'Edit ExamType' : 'Add New ExamType'}
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
					footer={null}
					className="width-modal"
					width={800}>
					<FormModal
						examType={selectedService as any}
						onEdit={fetchData}
						onClose={handleCancel}
						authorName=""
					/>
				</Modal>
			</div >
		</>
	);
};
export default TableData;
