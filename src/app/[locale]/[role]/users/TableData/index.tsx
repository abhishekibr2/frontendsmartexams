'use client';
import './style.css';
import { User } from '@/lib/types';
import FormModal from '../FormModal';
import Titles from '@/app/commonUl/Titles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RiDeleteBin5Line } from 'react-icons/ri';
import React, { useEffect, useState } from 'react';
// import { useSocket } from '@/contexts/SocketMessage';
import ResponsiveTable from '@/commonUI/ResponsiveTable';
import PrimaryButton from '@/app/commonUl/primaryButton';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { changeStatus, deleteUser, getAllUsers } from '@/lib/adminApi';
import {
	setCurrentUser, setShowUserForm, setLoadingId, setSelectedStatus, setSelectedUserId, setFilteredUser, setIsDeleteModalOpen, setCurrentPageData,
	setIsModalOpen
} from '@/redux/reducers/userReducer';
import { Form, Input, Popconfirm, Modal, Row, Col, Button, notification, Switch, Select, message, Spin, Typography, Image } from 'antd';
import { RootState } from '@/redux/store';

interface TableProps {
	users: User[];
	fetchData: () => void;
	setUsers: (blogs: User[]) => void;
}

const TableData: React.FC<TableProps> = ({ users, fetchData }) => {
	const dispatch = useAppDispatch();
	const [form] = Form.useForm();
	// const { sendNotification } = useSocket();
	const [searchQuery, setSearchQuery] = useState('');
	const { loadingId, selectedStatus, selectedUserId, filteredUser, selectedUser, isModalOpen, currentPage, pageSize } = useAppSelector((state: RootState) => state.userReducer);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value.toLowerCase());
	};

	useEffect(() => {
		let filtered = users;

		if (searchQuery) {
			filtered = filtered.filter(
				(user) =>
					user.name?.toLowerCase().includes(searchQuery) ||
					user.email?.toLowerCase().includes(searchQuery) ||
					user.status?.toLowerCase().includes(searchQuery)
			);
		}

		if (selectedStatus) {
			filtered = filtered.filter((user) => user.status === selectedStatus);
		}

		dispatch(setFilteredUser(filtered));
	}, [users, searchQuery, selectedStatus]);

	const handleOk = () => {
		dispatch(setIsModalOpen(false));
	};

	const handleCancel = () => {
		dispatch(setIsModalOpen(false));
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await getAllUsers();

			if (response?.data) {
				dispatch(setFilteredUser(response.data));
			}
		} catch (error) {
			notification.error({ message: 'Failed to fetch users' });
		}
	};

	const confirmDelete = async (id: string | string[]) => {
		try {
			const res = await deleteUser(Array.isArray(id) ? id : [id]);
			if (res) {
				fetchUsers();
				// sendNotification('deleted');

				dispatch(setIsDeleteModalOpen(false));
				dispatch(setSelectedUserId([]));
				message.success(res.message);
			}
		} catch (error) {
			notification.error({ message: 'Failed to delete user' });
		}
	};

	useEffect(() => {
		const startIdx = (currentPage - 1) * pageSize;
		const endIdx = startIdx + pageSize;
		const currentPageData = filteredUser.slice(startIdx, endIdx);
		dispatch(setCurrentPageData(currentPageData));
	}, [filteredUser, currentPage, pageSize]);

	const handleStatusChange = async (userId: string, currentStatus: string) => {
		const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
		const data = { userId, newStatus };

		try {
			const response = await changeStatus(data);
			if (response.status) {
				message.success(`User status updated to ${newStatus}`, 4);
				fetchData();
			} else {
				notification.error({ message: response.message || 'Failed to update user status' });
			}
		} catch (error) {
			notification.error({ message: 'Failed to update user status' });
		}
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a: User, b: User) =>
				(a.name || '').localeCompare(b.name || ''),
			render: (_: string, Users: User) => (
				<div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'normal', wordWrap: 'break-word' }}>
					<Image
						src={
							Users.image
								? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/small/${Users.image}`
								: `${process.env.NEXT_PUBLIC_BASE_URL}/images/profile-user.jpg`
						}
						alt="Profile"
						style={{ width: 40, height: 40, borderRadius: '25px', marginRight: '8px' }}
					/>
					<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
						{Users?.name}
					</span>
				</div>
			)
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: (a: User, b: User) =>
				(a.email || '').localeCompare(b.email || ''),

		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
			render: (_: string, record: User) => record.roleId?.roleName.charAt(0).toUpperCase() + record.roleId?.roleName.slice(1)
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a: User, b: User) => {
				const statusPriority: Record<string, number> = {
					active: 1,
					inactive: 2,
					blocked: 3
				};
				return (statusPriority[a.status] ?? 0) - (statusPriority[b.status] ?? 0);
			},
			render: (status: string, record: User) => (
				<Spin spinning={loadingId === record._id}>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Switch
							checked={status === 'active'}
							onChange={async () => {
								dispatch(setLoadingId(record._id ?? null));
								await handleStatusChange(record._id ?? '', status);
								dispatch(setLoadingId(null));
							}}
							disabled={status === 'blocked'}
							style={{
								backgroundColor: status === 'active' ? '#1dbd89' : status === 'blocked' ? '#e34760' : '#f0ad4e',
								borderColor: status === 'active' ? '#1dbd89' : status === 'blocked' ? '#e34760' : '#f0ad4e',
								width: '30px',
							}}
						/>
						<span style={{ paddingLeft: '5px' }}>{status === 'active' ? 'Active' : status === 'inactive' ? 'Inactive' : 'Blocked'}</span>
					</div>
				</Spin>
			),
		},

		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			sorter: (a: User, b: User) => {
				const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
				const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
				return dateA - dateB;
			},
			render: (createdAt: string) => {
				const date = new Date(createdAt);
				const day = date.getDate().toString().padStart(2, '0');
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const year = date.getFullYear();
				return `${month}/${day}/${year}`;
			}
		},
		{
			title: 'Action',
			dataIndex: 'operation',
			render: (_: string, record: User) => (
				<div>
					<Button onClick={() => handleEditClick(record)}>
						<EditOutlined />
					</Button>
					<Popconfirm
						title="Are you sure you want to delete this user?"
						onConfirm={() => confirmDelete(record._id ?? '')}
						okText="Yes"
						cancelText="No"
					>
						<Button style={{ marginLeft: '10px' }}>
							<DeleteOutlined />
						</Button>
					</Popconfirm>
				</div>
			)
		}
	];

	const handleEditClick = (record: User) => {
		dispatch(setCurrentUser(record));
		dispatch(setShowUserForm(true));
	};

	const userData = filteredUser.map((user) => ({
		...user,
		key: user._id
	}));

	const GetSelectedId = (data: []) => {
		dispatch(setSelectedUserId(data));
	};

	const handleFilterChange = (value: string | null) => {
		dispatch(setSelectedStatus(value));
	};

	return (
		<>
			<div>
				<div>
					<Row gutter={[12, 12]} align="middle">
						<Col xs={24} sm={12} md={10} lg={8} xl={6} xxl={6}>
							<Titles level={5} className="top-title">
								Users
							</Titles>
						</Col>
						<Col xs={24} sm={12} md={14} lg={16} xl={18} xxl={18} >
							<Row gutter={[8, 12]} justify="end" align="middle" >
								{selectedUserId.length > 0 && (
									<Col xs={24} sm={7} md={5} lg={5} xl={4} xxl={4}>
										<Popconfirm
											title="Are you sure you want to delete selected users?"
											onConfirm={() => confirmDelete(selectedUserId)}
											okText="Yes"
											cancelText="No"
										>
											<Button
												className="primary"
												danger
												ghost
												style={{ color: '#b90d0d', background: '#af03031f' }}
											>
												<RiDeleteBin5Line
													style={{ fontSize: '15px', margin: '0 5px -1px 0' }}
												/>
												Delete
											</Button>
										</Popconfirm>
									</Col>
								)}
								<Col xs={24} sm={10} md={8} lg={7} xl={6} xxl={5}>
									<Select
										placeholder="Filter by status"
										onChange={handleFilterChange}
										style={{ width: '100%' }}
										defaultValue="All"
									>
										<Select.Option value={null}>All</Select.Option>
										<Select.Option value="active">Active</Select.Option>
										<Select.Option value="inactive">Inactive</Select.Option>
										<Select.Option value="blocked">Blocked</Select.Option>
									</Select>
								</Col>

								<Col xs={24} sm={10} md={8} lg={7} xl={6} xxl={5} >
									<Input
										placeholder="Search"
										value={searchQuery}
										onChange={handleSearchChange}
										maxLength={40}
									/>
								</Col>
								<Col xs={24} sm={7} md={5} lg={5} xl={4} xxl={3} >
									<PrimaryButton

										label="Add Users"
										onClick={() => {
											dispatch(setCurrentUser(null));
											dispatch(setShowUserForm(true));
										}}
										className='w-100'
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</div>

				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<h6 >Count: {filteredUser.length}</h6>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>

					</Col>
				</Row>

				<Form form={form} component={false}>
					<ResponsiveTable columns={columns} data={userData} GetSelectedId={GetSelectedId} />
				</Form>
				<Modal
					title={selectedUser ? 'Edit User' : 'Add New User'}
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
					footer={null}
					width="30%"
				>
					<FormModal />
				</Modal>
			</div >
		</>
	);
};

export default TableData;
