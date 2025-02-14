'use client';
import React, { useContext, useState } from 'react';
import { Table, message, Tooltip, Col, Row, Modal, Tag, Button, Typography } from 'antd';
import { deleteRole, getAllRoles } from '@/lib/adminApi';
import { Roles } from '@/lib/types';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { FiEdit } from 'react-icons/fi';
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import { Popconfirm } from 'antd';
import Role from '../Role';
import { setRoles } from '@/redux/reducers/roleReducer';
import { useAppDispatch } from '@/redux/hooks';
import Titles from '@/app/commonUl/Titles';
import PrimaryButton from '@/app/commonUl/primaryButton';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Column } = Table;

interface RoleDataProps {
	roles: Roles[];
	onClose: (type: string) => void;
	onSingleEdit: (roles: any) => void;
}

export default function RoleTable({ roles, onClose, onSingleEdit }: RoleDataProps) {
	const { user } = useContext(AuthContext);
	const [roleModal, setRoleModal] = useState(false);
	const [roleData, setRoleData]: any = useState<Roles | null>(null);
	const dispatch = useAppDispatch()


	const canEditOrDelete = (roleName: string) => {
		if (roleName === 'student') {
			return 'student';
		}
		if (roleName === 'admin' || roleName === 'superadmin') {
			return false;
		}
		return true;
	};



	const handleRoleEdit = (roles: Roles) => {
		const editStatus = canEditOrDelete(roles.roleName);
		if (editStatus === 'student') {
			message.warning('The "student" role cannot be edited because it is a default role.');
			return;
		}
		if (!editStatus) {
			message.warning(`You can't edit "${roles.roleName}" role.`);
			return;
		}
		onSingleEdit(roles);
	};

	const handleDelete = async (roleId: string, roleName: string) => {
		if (roleName === 'admin' || roleName === 'superAdmin') {
			message.warning(`You cannot delete the "${roleName}" role.`);
			return;
		}
		if (roleName === 'student') {
			message.warning(`You cannot delete the "student" role because it's a default role.`);
			return;
		}
		try {
			const data = {
				id: roleId,
				userId: user?._id
			};
			const res = await deleteRole(data);
			if (res.status === true) {
				message.success(res.message);
				onClose('delete');
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const renderPermissions = (permissions: any) => {
		if (!permissions || Object.keys(permissions).length === 0) {
			return <Tag color="volcano">No Permissions Assigned</Tag>;
		}

		const truePermissions = Object.keys(permissions).filter((key) => permissions[key]);
		return truePermissions.map((permission) => (
			<Tag key={permission}>{permission.charAt(0).toUpperCase() + permission.slice(1)}</Tag>
		));
	};

	const fetchData = async () => {
		try {
			const res = await getAllRoles();
			if (res.status === true) {
				dispatch(setRoles(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleClose = (type: string) => {

		if (type !== 'close') {
			fetchData();
		}
		setRoleModal(false);
	};

	return (
		<>
			<div>

				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<Titles level={5} className="top-title">
							Roles
						</Titles>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<div className="floatRight text-end">
							<PrimaryButton
								label="Add Role"
								type="primary"
								icon={<FaPlus size={10} />}
								onClick={() => {
									setRoleModal(true);
									setRoleData(null);
								}}
								background='#8C52FF'
							/>
						</div>
					</Col>
				</Row>
				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<h6 >Count: {roles.length}</h6>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>

					</Col>
				</Row>



				<div className='card-dash mt-3 shadow-none table-gap-span'>
					<Table dataSource={roles} className="permissionTable" bordered={true} tableLayout="fixed">
						<Column
							title="Role"
							dataIndex="roleName"
							key="roleName"
							width={50} // Set width for this column
							sorter={(a: Roles, b: Roles) => {
								const roleA = a.roleName.toLowerCase();
								const roleB = b.roleName.toLowerCase();
								return roleA.localeCompare(roleB);
							}}
							render={(roleName: string) => (
								<Tag color='#8C52FF'>
									{roleName
										.split(' ')
										.map(word => word.charAt(0).toUpperCase() + word.slice(1))
										.join(' ')}
								</Tag>
							)}
						/>
						<Column
							title="Permission"
							dataIndex="permissions"
							key="permissions"
							render={(text, record: Roles) => renderPermissions(record.permissions)}
							width={400} // Set width for this column
						/>
						<Column
							title="Manage"
							dataIndex=""
							key="manage"
							width={50} // Set width for this column
							render={(roles: any, index: any) => (
								<div>
									<Tooltip title="Edit">
										<Button
											onClick={() => handleRoleEdit(roles)}
											className='btn-icon-space table-gap-span'
										>
											<EditOutlined />
										</Button>
									</Tooltip>
									<Tooltip title="Delete">
										<Popconfirm
											title="Delete Role"
											description="Are you sure to delete this role?"
											onConfirm={() => {
												if (roles.roleName === 'admin' || roles.roleName === 'superAdmin') {
													message.warning(`You cannot delete the "${roles.roleName}" role.`);
													return;
												}
												handleDelete(roles._id, roles.roleName);
											}}
											okText="Yes"
											cancelText="No"
										>
											<Button style={{ marginLeft: '10px' }} className='btn-icon-space'>
												<DeleteOutlined />
											</Button>
										</Popconfirm>
									</Tooltip>
								</div>
							)}
						/>
					</Table>

				</div>
			</div>
			<Modal
				title={
					<span style={{ fontSize: '20px' }}>
						{' '}
						{roleData ? `Edit Role - ${roleData.roleName}` : 'Add New Role'}
					</span>
				}
				width={600}
				open={roleModal}
				onCancel={() => setRoleModal(false)}
				footer={null}
			>
				<Role onClose={handleClose} roleData={roleData} fetchData={fetchData} />
			</Modal>
		</>
	);
}
