'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Image, Modal, Row, Col, Button, notification, Space } from 'antd';
import FormModal from '../FormModal';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { deleteBlog } from '@/lib/adminApi';
import Link from 'next/link';
import PrimaryButton from '@/app/commonUl/primaryButton';
import { RiDeleteBin5Line } from 'react-icons/ri';
import Titles from '@/app/commonUl/Titles';
import ResponsiveTable from '@/commonUI/ResponsiveTable';
import './style.css'

interface Item {
	slug: string;
	authorId: {
		name: string; _id: string
	};
	_id: string;
	key?: string;
	title: string;
	status: string,
	description: string;
	address?: string;
	blogViewCount?: number,
	name: string,
	createdAt: string,
	image: string;
}

interface TableDataProps {
	blogs: Item[];
	fetchData: () => Promise<void>;
	setBlogs: (blogs: Item[]) => void;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: string;
	inputType: 'number' | 'text';
	record: Item;
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

const TableData: React.FC<TableDataProps> = ({ blogs, fetchData }) => {
	const [form] = Form.useForm();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [authorName, setAuthorName] = useState('');
	const [selectedBlog, setSelectedBlog] = useState<Item | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredBlog, setFilteredBlog] = useState<Item[]>([]);
	const [blogsId, setBlogsId] = useState<string[]>([])
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
		const filtered = blogs?.filter((item: Item) => {
			const query = debouncedSearchQuery.toLowerCase();
			const titleMatches = item.title?.toLowerCase().includes(query);
			const statusMatches = item.status?.toLowerCase().includes(query);
			return titleMatches || statusMatches;
		});
		setFilteredBlog(filtered);
	}, [blogs, debouncedSearchQuery]);


	const showModal = () => {
		setIsModalOpen(true);
		setSelectedBlog(null);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};


	const confirmDelete = async (ids: string[]) => {
		const res = await deleteBlog(ids);
		if (res) {
			fetchData();
			setBlogsId([]);
			notification.success({ message: res.message });
		}
	};

	const columns = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			width: '25%',
			showOnResponse: true,
			showOnDesktop: true,
			render: (text: string, record: Item) => {
				return (
					<div>
						<Image
							src={record
								? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/blogs/original/${record?.image}`
								: '/images/profile-user.jpg'}
							alt="Profile"
							style={{ width: 50, height: 50, borderRadius: '10%', marginRight: '10px' }}
						/>
						<span>
							{
								record?.title
									? record.title.split(' ').slice(0, 10).join(' ') + (record.title.split(' ').length > 10 ? '...' : '')
									: ''
							}
						</span>
					</div>
				);
			}
		},
		{
			title: 'Views',
			dataIndex: 'views',
			key: 'blogViewCount',
			showOnResponse: true,
			showOnDesktop: true,
			width: '7%'
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			showOnResponse: true,
			width: '11%',
			showOnDesktop: true
		},

		{
			title: 'Author',
			dataIndex: 'authorId',
			key: 'authorId',
			showOnResponse: true,
			width: '25%',
			showOnDesktop: true

		},
		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			key: 'createdAt',
			showOnResponse: true,
			showOnDesktop: true,
			width: '11%'

		},
		{
			title: 'Action',
			dataIndex: 'operation',
			key: 'operation',
			showOnResponse: true,
			width: '15%',
			showOnDesktop: true
		}
	];

	const handleEditClick = (record: Item) => {
		setSelectedBlog(record);
		setAuthorName(record.authorId?.name || '');
		setIsModalOpen(true);
	};

	const blogData = filteredBlog?.map((data: Item) => ({
		...data,
		title: data.title,
		key: data._id,
		views: <Link href={`${process.env['NEXT_PUBLIC_SITE_URL']}/blog/${data?.slug}`} target="_blank" passHref>
			{data.blogViewCount}
		</Link>,
		authorId: data.authorId?.name,
		createdAt: data.createdAt.slice(0, 10),
		status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
		operation: <span>
			<Button
				onClick={() => {
					showModal();
					handleEditClick(data);
				}}
			>
				<EditOutlined />
			</Button>
			<Popconfirm
				title="Are you sure you want to delete this blog?"
				onConfirm={() => confirmDelete([data._id])}
				okText="Yes"
				cancelText="No"
			>
				<Button style={{ marginLeft: '10px' }}>
					<DeleteOutlined />
				</Button>
			</Popconfirm>
		</span>
	}))

	const GetSelectedId = (data: []) => {
		setBlogsId(data)

	}
	return (
		<>
			<div>
				<Row gutter={[16, 16]} align="middle">
					<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<Titles level={5} className="top-title">
							Blogs
						</Titles>
					</Col>
					<Col className="" xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
						<div className="floatRight">
							<Space>
								{blogsId.length > 0 && (
									<Popconfirm
										style={{ height: '40px' }}
										title="Are you sure to delete selected blog?"
										onConfirm={() => confirmDelete(blogsId)}
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
											<RiDeleteBin5Line
												style={{ fontSize: '15px', margin: '0 5px -1px 0' }}
											/>
											Delete
										</Button>
									</Popconfirm>
								)}
								<Row gutter={[12, 12]}>
									<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12} className="floatRight" style={{ float: "left" }}>
										<Input
											placeholder="Search"
											onChange={handleSearchChange}
											maxLength={40}


										/>
									</Col>
									<Col xs={24} sm={12} md={12} lg={12} xxl={12} xl={12}>
										<PrimaryButton label="Add New Blog" onClick={showModal} />
									</Col>
								</Row>
							</Space>
						</div>
					</Col>
				</Row>
				<div className="gapMarginTopTwo"></div>
				<Form form={form} component={false}>
					<ResponsiveTable
						columns={columns}
						data={blogData}
						GetSelectedId={GetSelectedId}
					/>
				</Form>

				<Modal
					title={selectedBlog ? 'Edit Blog' : 'Add New Blog'}
					open={isModalOpen}
					onOk={handleOk}
					onCancel={handleCancel}
					footer={null}
					// width="60%"
					className='width-modal'
				>
					<FormModal blog={selectedBlog as any} onEdit={fetchData} onClose={handleCancel} authorName='' />
				</Modal>
			</div>
		</>

	);
};
export default TableData;
