import { Form, Button, Select, Tooltip, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Input } from 'antd';
import './style.css';
import { Roles } from '@/lib/types';
import { addUpdateRoleDetails } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';

const { Option } = Select;
interface RoleProps {
	onClose: (type: string) => void;
	roleData: Roles | null;
	fetchData: () => void;
}

export default function Role({ onClose, roleData, fetchData }: RoleProps) {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [roleId, setRoleId] = useState('');
	const [checkedPermissions, setCheckedPermissions] = useState<string[]>(['Profile']);
	const { user } = useContext(AuthContext);

	const onFinish = async (values: any) => {
		// Check if permissionsArray is empty
		const permissionsArray = values.permissions || [];
		if (!permissionsArray.includes('Profile')) {
			permissionsArray.push('Profile');
		}

		if (permissionsArray.length === 0) {
			message.warning("Please select at least one permission");
			return;
		}
		try {
			setLoading(true);
			const permission: any = {};
			if (Array.isArray(permissionsArray)) {
				permissionsArray.forEach((value: string) => {
					permission[value] = true;
				});
			}
			const requestData = {
				roleName: values.roleName.toLowerCase(),
				permissions: permission,
				status: 'active',
				roleId: roleId
			};
			const res = await addUpdateRoleDetails(requestData);
			if (res.status === true) {
				fetchData();
				{ roleId ? onClose('SaveEdit') : '' }
				form.resetFields();
				message.success(res.message);
				setCheckedPermissions(['Profile']);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (roleData && roleData !== null) {
			setRoleId(roleData._id);
			form.setFieldsValue({
				roleName: roleData.roleName,
				status: roleData.status
			});
			const permissions = roleData.permissions || {}; // Ensure permissions is an object
			setCheckedPermissions(Object.keys(permissions).filter((key) => permissions[key]));
		} else {
			setRoleId('');
			form.resetFields();
			setCheckedPermissions([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roleData]);

	const handlePermissionsChange = (checkedValues: string[]) => {
		// Ensure "Dashboard" is always included
		if (!checkedValues.includes('Profile')) {
			checkedValues.push('Profile'); // Keep 'Dashboard' always selected
		}
		setCheckedPermissions(checkedValues);
	};
	return (
		<>
			<div className="roleFiled table-container">
				<Form layout="vertical" form={form} onFinish={onFinish}>
					<Form.Item
						label="Role Name"
						name="roleName"
						rules={[
							{
								required: true,
								message: 'Please enter a role name!',
							},
							{
								validator: (_, value) => {
									if (value && value.length > 50) {
										// Trim the input to 50 characters
										const trimmedValue = value.slice(0, 50);

										// Update the field value with the trimmed value
										form.setFieldsValue({ roleName: trimmedValue });

										return Promise.reject('Role name must not exceed 50 characters.');
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Input placeholder="Name" />
					</Form.Item>


					<div className="smallTopMargin"></div>
					<Form.Item name="permissions" label="Allow Permission" valuePropName="checked">
						<Select
							placeholder="Select permission"
							size={'large'}
							mode='multiple'
							maxTagCount="responsive"
							maxTagPlaceholder={(omittedValues) => (
								<Tooltip title={omittedValues.map(({ label }) => label).join(', ')}>
									<span>...</span>
								</Tooltip>
							)}
							onChange={handlePermissionsChange}
							value={checkedPermissions}
						>
							{/* <Option value="Dashboard">Dashboard</Option> */}
							<Option value="Profile">Profile</Option>
							<Option value="Packages">Packages</Option>
							<Option value="PackageEssay">Package Essay</Option>
							<Option value="PackageOrderList">Package Order List</Option>
							<Option value="SubmitPackageList">Submit Package List</Option>
							<Option value="AllTest">All Test</Option>
							<Option value="QuestionBank">Question Bank</Option>
							<Option value="QuestionReport">Question Report</Option>
							<Option value="Ebook">Ebook</Option>
							<Option value="EbookOrderList">Ebook Order List</Option>
							<Option value="Users">Users</Option>
							<Option value="AdminTasks">Admin Tasks</Option>
							<Option value="ContactUs">Contact Us</Option>
							<Option value="Masters">Masters</Option>
						</Select>
					</Form.Item>

					<div className="smallTopMargin"></div>
					<div className="textEnd">
						<Button type="primary" htmlType="submit" loading={loading}>
							{' '}
							{roleId ? 'Update' : 'Save & Add More'}
						</Button>
					</div>
				</Form>
			</div >
		</>
	);
}
