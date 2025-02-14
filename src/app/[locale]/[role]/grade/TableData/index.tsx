'use client';
import FormModal from '../FormModal';
import Titles from '@/app/commonUl/Titles';
import { deleteGrade } from '@/lib/adminApi';
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
import { Grade } from '@/lib/types';

interface TableDataProps {
	grades: Grade[];
	fetchData: () => Promise<void>;
	setGrades: (grades: Grade[]) => void;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: string;
	inputType: 'number' | 'text';
	record: Grade;
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

const TableData: React.FC<TableDataProps> = ({ grades, fetchData }) => {
	const [form] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<Grade | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredService, setFilteredService] = useState<Grade[]>([]);
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
		const filtered = grades?.filter((item: Grade) => {
			const query = debouncedSearchQuery.toLowerCase();
			const titleMatches = item.gradeLevel?.toLowerCase().includes(query);
			const statusMatches = item.status?.toLowerCase().includes(query);
			return titleMatches || statusMatches;
		});
		setFilteredService(filtered);
	}, [grades, debouncedSearchQuery]);

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
			const res = await deleteGrade(ids);
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
			title: 'Grade',
			dataIndex: 'gradeLevel',
			key: 'gradeLevel',
			width: '40%',
			showOnResponse: true,
			showOnDesktop: true,
			sorter: (a: Grade, b: Grade) =>
				(a.gradeLevel || '').localeCompare(b.gradeLevel || ''),
			render: (text: string, record: Grade) => {
				return (
					<div>
						<Row align="middle">
							<span style={{ textTransform: 'capitalize' }}>
								{record?.gradeLevel
									? record.gradeLevel.split(' ').slice(0, 10).join(' ') +
									(record.gradeLevel.split(' ').length > 10 ? '...' : '')
									: ''}
							</span>
						</Row>
					</div>
				);
			},
		},

		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			key: 'createdAt',
			showOnResponse: true,
			showOnDesktop: true,
			width: '40%',
			sorter: (a: Grade, b: Grade) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			render: (text: string) => new Date(text).toLocaleString(),
		},
		{
			title: 'Action',
			dataIndex: 'operation',
			key: 'operation',
			showOnResponse: true,
			width: '20%',
			showOnDesktop: true
		}
	];

	const handleEditClick = (record: Grade) => {
		setSelectedService(record);
		setIsModalOpen(true);
	};

	const serviceData = filteredService?.map((data: Grade) => ({
		...data,
		title: data.gradeLevel,
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
					title="Are you sure you want to delete this grade?"
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
				<Row gutter={[16, 16]} align="middle">
					<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<Titles level={5} className="top-title">
							Grades
						</Titles>
					</Col>
					<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<div className="floatRight text-end">
							<Space>
								{servicesId.length > 0 && (
									<Popconfirm
										style={{ height: '40px' }}
										title="Are you sure to delete selected grade?"
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
								<PrimaryButton label="Add New Grade" onClick={showModal} />

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
					title={selectedService ? 'Edit Grade' : 'Add New Grade'}
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
					footer={null}
					className="width-modal"
				>
					<FormModal grade={selectedService as any} onEdit={fetchData} onClose={handleCancel} authorName="" />
				</Modal>
			</div>
		</>
	);
};
export default TableData;
