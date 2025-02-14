'use client';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import './style.css';
import RoleTable from './rolesTable';
import Role from './Role';
import { getAllRoles } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Roles } from '../../../../lib/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { setRoles } from '@/redux/reducers/roleReducer';

export default function Page() {
	const { roles } = useAppSelector((state: RootState) => state.roleReducer);
	const dispatch = useAppDispatch();
	const [Staff, setStaff] = useState(false);
	const [roleData, setRoleData] = useState<Roles | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const res = await getAllRoles();
			if (res.status === true) {
				dispatch(setRoles(res.data));
				setLoading(false);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleEdit = (roleData: Roles) => {
		setRoleData(roleData);
		fetchData();
		setStaff(true);
	};

	const handleClose = (type: string) => {
		if (type != 'close') {
			fetchData();
		}
		setStaff(false);
	};

	return (
		<>
			<RoleTable onClose={handleClose} onSingleEdit={handleEdit} roles={roles} />
			<Modal
				title={
					<span style={{ fontSize: '20px' }}>
						{' '}
						{roleData ? `Edit Role - ${roleData.roleName}` : 'Add New Role'}
					</span>
				}
				width={600}
				open={Staff}
				onCancel={() => setStaff(false)}
				footer={null}
			>
				<Role onClose={handleClose} roleData={roleData} fetchData={fetchData} />
			</Modal>
		</>
	);
}
