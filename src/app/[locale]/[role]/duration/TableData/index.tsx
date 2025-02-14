'use client';
import FormModal from '../FormModal';
import Titles from '@/app/commonUl/Titles';
import { RiDeleteBin5Line } from 'react-icons/ri';
import PrimaryButton from '@/app/commonUl/primaryButton';
import ResponsiveTable from '@/commonUI/ResponsiveTable';
import React, { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form, Input, Popconfirm, Modal, Row, Col, Button, Space, message, Typography, Tooltip } from 'antd';
import { Duration } from '@/lib/types';
import { DeleteDuration } from '@/lib/adminApi';


interface TableDataProps {
	duration: Duration[];
	fetchData: () => Promise<void>;
}


const TableData: React.FC<TableDataProps> = ({ duration, fetchData }) => {
	const [form] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedService, setSelectedService] = useState<Duration | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredService, setFilteredService] = useState<Duration[]>([]);
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
		const filtered = duration?.filter((item: Duration) => {
			const query = debouncedSearchQuery.toLowerCase();
			const titleMatches = item.duration?.toLowerCase().includes(query);
			const statusMatches = item.status?.toLowerCase().includes(query);
			return titleMatches || statusMatches;
		});
		setFilteredService(filtered);
	}, [duration, debouncedSearchQuery]);

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
			const res = await DeleteDuration(ids);
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
			title: 'DurationTime',
			dataIndex: 'DurationTime',
			key: 'DurationTime',
			width: '45%',
			showOnResponse: true,
			showOnDesktop: true,
			sorter: (a: Duration, b: Duration) =>
				(a.DurationTime || '').localeCompare(b.DurationTime || ''),
			render: (text: string) =>
				text
					? text.charAt(0).toUpperCase() + text.slice(1)
					: '',
		},


		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			key: 'createdAt',
			showOnResponse: true,
			showOnDesktop: true,
			width: '45%',
			sorter: (a: Duration, b: Duration) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			render: (text: string) => new Date(text).toLocaleString(),
		},
		{
			title: 'Action',
			dataIndex: 'operation',
			key: 'operation',
			showOnResponse: true,
			width: '10%',
			showOnDesktop: true
		}
	];

	const handleEditClick = (record: Duration) => {
		setSelectedService(record);
		setIsModalOpen(true);
	};


	const serviceData = filteredService?.map((data: Duration) => {
		const isLifetime =
			data.DurationTime.toLowerCase() === 'lifetime'; // Check for 'Lifetime' case-insensitively

		return {
			...data,
			title: data.duration,
			key: data._id,
			createdAt: data.createdAt.slice(0, 10),
			status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
			operation: (
				<span>
					<Tooltip
						title={
							isLifetime
								? 'This is a default option for free packages. You cannot edit or delete it.'
								: ''
						}
					>
						<Button
							disabled={isLifetime}
							onClick={() => {
								showModal();
								handleEditClick(data);
							}}
						>
							<EditOutlined />
						</Button>
					</Tooltip>
					<Tooltip
						title={
							isLifetime
								? 'This is a default option for free packages. You cannot edit or delete it.'
								: ''
						}
					>
						<Popconfirm
							title="Are you sure you want to delete this Subject?"
							onConfirm={() => confirmDelete([data._id])}
							okText="Yes"
							cancelText="No"
						>
							<Button
								disabled={isLifetime}
								style={{ marginLeft: '10px' }}
							>
								<DeleteOutlined />
							</Button>
						</Popconfirm>
					</Tooltip>
				</span>
			),
		};
	});


	const GetSelectedId = (data: []) => {
		setServicesId(data);
	};

	return (
		<>
			<div>
				<Row gutter={[16, 16]} align="middle">
					<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<Titles level={5} className="top-title ">
							Duration
						</Titles>
					</Col>
					<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<div className="floatRight text-end">
							<Space>
								{servicesId.length > 0 && (
									<Popconfirm
										style={{ height: '40px' }}
										title="Are you sure to delete selected Duration?"
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
								{/* <Input placeholder="Search" onChange={handleSearchChange} maxLength={40} style={{ width: '200px' }} /> */}
								<PrimaryButton label="Add Duration" onClick={showModal} />

							</Space>
						</div>
					</Col>
				</Row>
				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<h6 >Count: {duration.length}</h6>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>

					</Col>
				</Row>

				<Form form={form} component={false}>
					<ResponsiveTable columns={columns} data={serviceData} GetSelectedId={GetSelectedId} />
				</Form>
				<Modal
					title={selectedService ? 'Edit Duration' : 'Add Duration'}
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
					footer={null}
					className="width-modal"
				>
					<FormModal
						service={selectedService as any}
						onEdit={fetchData}
						onClose={handleCancel}
						authorName=""
					/>
				</Modal>
			</div>
		</>
	);
};
export default TableData;
