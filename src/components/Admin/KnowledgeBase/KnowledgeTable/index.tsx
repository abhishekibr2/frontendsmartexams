import React, { ReactNode, useContext, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ErrorHandler from '@/lib/ErrorHandler';
import { deleteKnowledgeBase, getKnowledgeBase } from '@/lib/adminApi';
import { useAppDispatch } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { setKnowledgebase, setAuthorId } from '@/redux/reducers/knowledgebaseReducer';
import { FaEdit } from 'react-icons/fa';
import { DeleteOutlined } from '@ant-design/icons';
import AuthContext from '@/contexts/AuthContext';
import ResponsiveTable from '@/commonUI/ResponsiveTable';
import { useSelector } from 'react-redux';
import { knowledgeBase } from '@/lib/types';
import Link from 'next/link';

interface Props {
	onEdit: (data: knowledgeBase) => void;
}

interface DataType {
	key: string;
	title: string;
	category: string;
	youtubeLink: string;
	action: ReactNode;
}

export default function KnowledgeTable({ onEdit }: Props) {
	const { user } = useContext(AuthContext);
	const dispatch = useAppDispatch();
	const dataSource = useSelector((state: RootState) => state.knowledgebaseReducer.knowledgebase);
	const searchQuery = useSelector((state: RootState) => state.knowledgebaseReducer.searchQuery);
	const reload = useSelector((state: RootState) => state.knowledgebaseReducer.reload);

	const columns: ColumnsType<DataType> = [
		{ title: 'Title', dataIndex: 'title' },
		{ title: 'Category', dataIndex: 'category' },
		{ title: 'Youtube Link', dataIndex: 'youtubeLink' },
		{ title: 'Action', dataIndex: 'action' }
	];

	useEffect(() => {
		fetchData();
	}, [searchQuery, reload]);

	const handleDelete = async (baseId: string) => {
		try {
			const res = await deleteKnowledgeBase({ baseId: baseId });
			if (res.status === true) {
				message.success(res.message);
				fetchData();
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const fetchData = async () => {
		try {
			const res = await getKnowledgeBase(searchQuery);
			if (res.status === true) {
				const formattedData = res.data.map((item: knowledgeBase) => ({
					key: item._id,
					title: item.title,
					category: item.category,
					youtubeLink: (
						<Link target={'blank'} href={item.youtubeLink}>
							{item.youtubeLink}
						</Link>
					),
					action: (
						<>
							<div style={{ display: 'flex', gap: '10px' }}>
								<div>
									<Button type="text" ghost onClick={() => onEdit(item)}>
										<FaEdit />
									</Button>
								</div>
								<div>
									<Popconfirm
										title="Are you sure you want to delete this item?"
										onConfirm={() => {
											handleDelete(item._id);
										}}
										okText="Yes"
										cancelText="No"
									>
										<Button style={{ marginLeft: '10px' }}>
											<DeleteOutlined />
										</Button>
									</Popconfirm>
								</div>
							</div>
						</>
					)
				}));
				dispatch(setKnowledgebase(formattedData));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const GetSelectedId = (data: string) => {
		dispatch(setAuthorId(data));
	};

	return (
		<DndContext modifiers={[restrictToVerticalAxis]}>
			<SortableContext items={dataSource.map((item) => item.key)} strategy={verticalListSortingStrategy}>
				<ResponsiveTable columns={columns} data={dataSource} GetSelectedId={GetSelectedId} />
			</SortableContext>
		</DndContext>
	);
}
