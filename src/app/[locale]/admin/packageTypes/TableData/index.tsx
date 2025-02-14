'use client';
import React, { useState } from 'react';
import { Table, Button, message as antdMessage, Popconfirm, Modal, Form, Row, Col, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import FormModal from '../FormModal';
import { DeletePackageType } from '@/lib/adminApi';
import Titles from '@/app/commonUl/Titles';
import PrimaryButton from '@/app/commonUl/primaryButton';

const TableData = ({ packageTypes, handleFetch }: any) => {
	const [edit, setEdit] = useState<any>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleDelete = async (packageId: string) => {
		try {
			const response = await DeletePackageType({ packageId });
			if (response) {
				setIsModalVisible(false);

				handleFetch();
				antdMessage.success('Package type deleted successfully!');
			} else {
				antdMessage.error('Failed to delete package type');
			}
		} catch (error) {
			antdMessage.error('Error deleting package type');
			console.error('Error deleting package type:', error);
		}
	};

	const handleEditClick = (record: any) => {
		setEdit(record);
		setIsModalVisible(true);
	};

	const handleAddClick = () => {
		setEdit(null);
		setIsModalVisible(true);


	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setEdit(null);
		handleFetch();
	};

	const columns = [
		{
			title: 'Package Type',
			dataIndex: 'selectedPackage',
			key: 'selectedPackage',
			width: '40%',
			sorter: (a: any, b: any) => {
				const packageA = a.selectedPackage || '';
				const packageB = b.selectedPackage || '';
				return packageA.localeCompare(packageB);
			},
		},
		{
			title: 'Active',
			dataIndex: 'isActive',
			key: 'isActive',
			render: (isActive: boolean) => (isActive ? 'Yes' : 'No'),
			width: '30%',
			sorter: (a: any, b: any) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1),
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (createdAt: string) => new Date(createdAt).toLocaleString(),
			width: '20%',
			sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: 'Action',
			key: 'action',
			render: (_: any, record: any) => (
				<span>
					<Button onClick={() => handleEditClick(record)}>
						<EditOutlined />
					</Button>
					<Popconfirm
						title="Are you sure you want to delete this package Type?"
						onConfirm={() => handleDelete(record._id)}
						okText="Yes"
						cancelText="No"
					>
						<Button style={{ marginLeft: '10px' }}>
							<DeleteOutlined />
						</Button>
					</Popconfirm>
				</span>
			),
			width: '10%',
		},
	];


	return (
		<div>
			<Row gutter={[24, 24]} >
				<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
					<Titles level={5} className="top-title">
						Package Type
					</Titles>
				</Col>
				<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
					<div className="floatRight text-end">
						<Space size="small">
							<PrimaryButton
								label="Add Package Type"
								onClick={handleAddClick}
							/>
						</Space>
					</div>

				</Col>
			</Row>
			<Row gutter={[16, 16]} align="middle">
				<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
					<h6 >Count: {packageTypes.length}</h6>
				</Col>
				<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>

				</Col>
			</Row>



			<Modal
				title={edit ? 'Edit Package Type' : 'Add Package Type'}
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}
				width={520}
			>
				<FormModal
					edit={edit}
					handleCancel={handleCancel}
					handleFetch={handleFetch}
					setIsModalVisible={setIsModalVisible}

				/>
			</Modal>
			<div className="desktop-view card-dash shadow-none top-medium-space">
				<Table
					columns={columns}
					dataSource={packageTypes}
					rowKey="_id"
					pagination={false}
				/>
			</div>
		</div>
	);
};

export default TableData;
