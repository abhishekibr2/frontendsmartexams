'use client';
import Titles from '@/app/commonUl/Titles';
import React, { useContext } from 'react';
import {
	Row,
	Col,
	Table,
	Button
} from 'antd';
import Link from 'next/link';
import dayjs from 'dayjs';
import { PackageEssaySubmit } from '@/lib/types';
import AuthContext from '@/contexts/AuthContext';


export default function AllEssaySubmitListing({ packages }: any) {
	const { user } = useContext(AuthContext);
	const roleName = user?.roleId?.roleName;
	const columns = [
		{
			title: '#',
			dataIndex: 'index',
			key: 'index',
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Essay Type',
			dataIndex: 'packageEssayId',
			key: 'essayType',
			render: (text: any) => text?.essayType || 'N/A'
		},
		{
			title: 'Essay Topic',
			dataIndex: 'packageEssayId',
			key: 'essayName',
			render: (text: any) => text?.essayName || 'N/A'
		},
		{
			title: 'Submission date',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (text: string) => dayjs(text).format('DD/MM/YYYY'),

		},
		{
			title: 'Submitted By',
			dataIndex: 'userId',
			key: 'userId',
			render: (text: any) => text?.name || 'N/A'

		},
		{
			title: 'Package',
			dataIndex: 'packageId',
			key: 'packageName',
			align: 'center',
			render: (text: any) => text?.packageName || 'N/A',
		},
		{
			title: 'Action',
			dataIndex: 'operation',
			key: 'operation',
			render: (_: any, record: any) => (
				<Link href={`/${roleName}/essay-submitted?EssayId=${record._id}`}>
					<Button>
						<i className="fa-regular fa-comment-dots" />
					</Button>
				</Link>
			),
		},
	];


	return (
		<>
			<div>
				<Row gutter={[24, 24]} align='middle'>
					<Col xs={24} sm={24} md={22} lg={22} xxl={22} xl={22}>
						<Titles level={5} className="top-title">
							Submitted Package Essays
						</Titles>
					</Col>
					<Col xs={24} sm={24} md={2} lg={2} xxl={2} xl={2}>
						<h6 >Count: {packages.length}</h6>
					</Col>
				</Row>

				<div className="desktop-view card-dash shadow-none top-medium-space">
					<Table
						className="text-center SubmittedTable shadow-sm w-100"
						columns={columns.map((col) => ({
							...col,
							align: 'center',
						}))}
						dataSource={packages.map((item: PackageEssaySubmit, index: PackageEssaySubmit) => ({
							...item,
							index,
						}))}
					/>
				</div>
			</div>
		</>
	);
};
