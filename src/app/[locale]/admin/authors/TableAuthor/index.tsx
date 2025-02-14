'use client';
import React, { useState } from 'react';
import { Popconfirm, Image, Button, notification, Space, Modal } from 'antd';
import FormModal from '../FormModal';
import { deleteAuthor, getAllAuthors } from '@/lib/adminApi';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Author } from '@/lib/types';
import { setAuthors, setCurrentAuthor, setShowAuthorForm } from '@/redux/reducers/authorReducer';
import { RootState } from '@/redux/store';
import ResponsiveTable from '@/commonUI/ResponsiveTable';

interface Item {
	_id: string;
	key: string;
	name: string;
	status: string;
	createdAt: string;
	address: string;
	profileImage: string;
}

const TableData = () => {
	const { showAuthorForm, authors } = useAppSelector((state: RootState) => state.authorReducer)
	const dispatch = useAppDispatch()
	const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);



	const confirmDelete = async (id: string) => {
		const res = await deleteAuthor([id]);
		const updatedAuthors = authors.filter((author: Author) => author._id !== id)
		if (res) {
			dispatch(setAuthors(updatedAuthors))
			notification.success({ message: res.message });
		}
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: '40%',
			render: (_: string, author: Item) => (
				<Space>
					<Image
						src={
							author.profileImage
								? `${process.env.NEXT_PUBLIC_IMAGE_URL}/authors/small/${author.profileImage}`
								: `${process.env.NEXT_PUBLIC_BASE_URL}/images/users.jpg`
						}
						alt="Profile"
						className='profileImage'
						width={'35px'}
					/>
					<span>{author?.name}</span>
				</Space>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			width: '30%',
			render: (status: string) => status.charAt(0).toUpperCase() + status.slice(1),
		},
		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			width: '25%',
			render: (createdAt: string) => {
				const date = new Date(createdAt);
				const day = date.getDate().toString().padStart(2, '0');
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const year = date.getFullYear();
				return `${month}/${day}/${year}`;
			},
		},
		{
			title: 'Action',
			dataIndex: 'operation',
			width: '15%',
			render: (_: string, record: Author) => (
				<Space>
					<Button onClick={() => handleEditClick(record)}>
						<EditOutlined />
					</Button>
					<Popconfirm
						title="Are you sure you want to delete this author?"
						onConfirm={() => confirmDelete(record._id)}
						okText="Yes"
						cancelText="No"
					>
						<Button>
							<DeleteOutlined />
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const handleEditClick = (record: Author) => {
		dispatch(setCurrentAuthor(record));
		dispatch(setShowAuthorForm(true));
	};

	const handleDelete = async () => {
		try {
			const res = await deleteAuthor(selectedAuthorIds);
			if (res) {
				notification.success({ message: res.message });

				const updatedData = await getAllAuthors();
				if (updatedData?.data) {
					dispatch(setAuthors(updatedData.data)); // Update Redux store with new data

				}
				setSelectedAuthorIds([]);
			}
		} catch (error) {
			console.error("Error deleting authors:", error);
			notification.error({ message: "Failed to delete selected authors" });
		}
	};

	const GetSelectedId = (data: []) => {
		setSelectedAuthorIds(data)

	}

	return (
		<>
			<div>
				{selectedAuthorIds.length > 0 && (
					<Popconfirm
						title="Are you sure to delete selected authors?"
						onConfirm={handleDelete}
						okText="Yes"
						cancelText="No"
					>
						<Button className="primary" danger ghost>
							<RiDeleteBin5Line style={{ fontSize: '15px', margin: '0 5px -1px 0' }} />
							Delete
						</Button>
					</Popconfirm>
				)}
			</div>
			<div className="gapPaddingTopOTwo"></div>
			<div className='table-container'>
				<ResponsiveTable
					columns={columns}
					data={authors.map((a: Author) => ({ ...a, key: a._id }))}
					GetSelectedId={GetSelectedId}
				/>
			</div>
			<Modal
				title="Edit Author"
				open={showAuthorForm}
				onOk={() => dispatch(setShowAuthorForm(false))}
				onCancel={() => dispatch(setShowAuthorForm(false))}
				footer={null}
				width="60%"
			>
				<FormModal />
			</Modal>
		</>
	);
};

export default TableData;
