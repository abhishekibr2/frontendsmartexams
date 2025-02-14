'use client';
import Titles from '@/app/commonUl/Titles';
import { deletePackageEssay } from '@/lib/adminApi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import ResponsiveTable from '@/commonUI/ResponsiveTable';
import React, { useState, useEffect } from 'react';
import { Form, Popconfirm, Button, notification, Space, Row, Col } from 'antd';
import { Package, PackageEssay } from '@/lib/types';
import './style.css';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface TableDataProps {
	packageEssay: PackageEssay[];
	fetchData: () => Promise<void>;
	setPackageEssay: (packageEssay: PackageEssay[]) => void;
	onEdit: (record: PackageEssay) => void;
	getPackagesData: () => void;
}

const TableData: React.FC<TableDataProps> = ({ packageEssay, fetchData, onEdit, getPackagesData }) => {
	const [form] = Form.useForm();
	const [servicesId, setServicesId] = useState<string[]>([]);
	const totalEssay = packageEssay.length;
	const [sortedData, setSortedData] = useState<PackageEssay[]>(packageEssay);
	const [sorter, setSorter] = useState<any>({});

	const confirmDelete = async (ids: string[]) => {
		const res = await deletePackageEssay(ids);
		if (res) {
			getPackagesData();
			fetchData();
			setServicesId([]);
			notification.success({ message: res.message });
		}
	};

	const columns = [
		{
			title: 'Package Name',
			dataIndex: 'packageName',
			key: 'packageName',
			width: '25%',
			showOnResponse: true,
			showOnDesktop: true,
			sorter: (a: PackageEssay, b: PackageEssay) =>
				(a.packageId?.packageName || '').localeCompare(b.packageId?.packageName || ''),
			render: (text: string, record: PackageEssay) => (
				<Row align='middle'>
					<span>{record?.packageId?.packageName || 'N/A'}</span>
				</Row>
			),
		},
		{
			title: 'Essay Name',
			dataIndex: 'title',
			key: 'title',
			width: '30%',
			showOnResponse: true,
			showOnDesktop: true,
			sorter: (a: PackageEssay, b: PackageEssay) =>
				(a.title || '').localeCompare(b.title || ''),
			render: (text: string, record: PackageEssay) => (
				<Row align='middle'>
					<span>
						{record?.essayName
							? record.essayName.split(' ').slice(0, 10).join(' ') + (record.essayName.split(' ').length > 10 ? '...' : '')
							: ''}
					</span>
				</Row>
			),
		},
		{
			title: 'Essay Type',
			dataIndex: 'title',
			key: 'title',
			width: '30%',
			showOnResponse: true,
			showOnDesktop: true,
			sorter: (a: PackageEssay, b: PackageEssay) =>
				(a.title || '').localeCompare(b.title || ''),
			render: (text: string, record: PackageEssay) => (
				<Row align='middle'>
					<span>{record?.essayType || 'N/A'}</span>
				</Row>
			),
		},
		{
			title: 'Duration',
			dataIndex: 'duration',
			key: 'duration',
			showOnResponse: true,
			showOnDesktop: true,
			width: '30%',
			render: (text: string) => (text ? text : 'N/A'),
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

	const handleSortChange = (sorter: any) => {
		setSorter(sorter);
		const sorted = [...packageEssay];
		if (sorter.order && sorter.columnKey) {
			sorted.sort((a: any, b: any) => {
				const column = columns.find(col => col.key === sorter.columnKey);
				if (column && column.sorter) {
					return column.sorter(a, b);
				}
				return 0;
			});
		}
		setSortedData(sorted);
	};

	useEffect(() => {
		handleSortChange(sorter);
	}, [sorter, packageEssay]);

	const handleEditClick = (record: PackageEssay) => {
		onEdit(record);
	};

	const GetSelectedId = (data: []) => {
		setServicesId(data);
	};

	const serviceData = sortedData?.map((data: PackageEssay) => ({
		...data,
		title: data.essayType,
		packageName: data.packageId?.packageName,
		essayName: data.essayName,
		key: data._id,
		createdAt: data.duration,
		addedTotalEssay: data.addedTotalEssay,
		status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
		operation: (
			<Space size="middle"  >
				<Popconfirm
					title="Are you sure you want to delete this essay?"
					onConfirm={() => confirmDelete([data._id])}
					okText="Yes"
					cancelText="No"

				>

					<Button style={{ marginLeft: '10px' }}>
						<DeleteOutlined />
					</Button>
				</Popconfirm>
				<Button
					onClick={() => handleEditClick(data)}
				>
					<EditOutlined />
				</Button>
			</Space>
		),
	}));

	return (
		<>
			<div>
				<Row gutter={[16, 16]}>
					<Col span={12}>
						<Titles level={5} className="top-title">
							Essays in Package
						</Titles>
					</Col>
					<Col span={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
						<Space style={{ display: 'flex', alignItems: 'center' }}>
							{servicesId.length > 0 && (
								<Popconfirm
									style={{ height: '40px' }}
									title="Are you sure to delete selected Essay?"
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
											background: '#af03031f',
										}}
									>
										<RiDeleteBin5Line style={{ fontSize: '15px', margin: '0 5px -1px 0' }} />
										Delete
									</Button>
								</Popconfirm>
							)}
							<h6 style={{ textAlign: 'end', marginLeft: '10px' }}>Count: {sortedData.length}</h6>
						</Space>
					</Col>
				</Row>

				<div className="gapMarginTopTwo"></div>
				<Form form={form} component={false}>
					<ResponsiveTable
						columns={columns}
						data={serviceData}
						GetSelectedId={GetSelectedId}
					/>
				</Form>
			</div>
		</>
	);
};

export default TableData;
