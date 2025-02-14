'use client';
import { deleteForum, getAllForums } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { message, Popconfirm, Button } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState, useContext } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import ResponsiveTable from '@/commonUI/ResponsiveTable';
import { setForums } from '@/redux/reducers/forumReducer';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { setTotal } from '@/redux/reducers/responsiveTableReducer';
import { Forum } from '@/lib/types';
import { RiDeleteBin5Line } from 'react-icons/ri';
import AuthContext from '@/contexts/AuthContext';

interface DataType {
    key: string;
    title: React.ReactNode;
    attachment: React.ReactNode;
    category: string;
    views: number;
    action: React.ReactNode;
}

interface Props {
    onEdit: (item: any) => void;
}

export default function ForumData({ onEdit }: Props) {
    const { forums, reload, searchQuery } = useAppSelector((state: RootState) => state.forumReducer);
    const { currentPage, pageSize } = useAppSelector((state: RootState) => state.responsiveTableReducer);
    const { user } = useContext(AuthContext);
    const roleName = user?.roleId?.roleName;
    const dispatch = useAppDispatch();

    // State for selected forum IDs
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, reload, searchQuery]);

    const fetchData = async () => {
        try {
            const Query = {
                search: searchQuery,
                page: currentPage,
                pageSize: pageSize,
            };
            const res = await getAllForums(Query);
            if (res.status) {
                dispatch(setForums(res.data));
                dispatch(setTotal(res.total));
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteForum(selectedIds);
            if (res.status === true) {
                message.success(res.message);
                fetchData();
                setSelectedIds([])
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const data: DataType[] = forums.map((data: Forum) => {
        return {
            key: data._id,
            title: (
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/${roleName}/questions/${data.slug}`}>
                    {data.title}
                </Link>
            ),
            attachment: data.attachment,
            category: data?.categoryId?.name,
            views: data.viewCount,
            action: (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <EditOutlined onClick={() => onEdit(data)} />
                </div>
            )
        };
    });

    const columns: ColumnsType<DataType> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '35%',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Image',
            dataIndex: 'attachment',
            render: (_: any, forum: any) => (
                <img
                    src={
                        forum.attachment
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/forumImages/small/${forum.attachment}`
                            : `${process.env.NEXT_PUBLIC_BASE_URL}/images/profile-user.jpg`
                    }
                    alt="Profile"
                    style={{ width: 40, height: 40, borderRadius: '25px', marginRight: '8px' }}
                />
            ),
        },
        { title: 'Category', dataIndex: 'category' },
        { title: 'Views', dataIndex: 'views' },
        { title: 'Action', dataIndex: 'action' }
    ];

    const GetSelectedId = (id: any) => {
        setSelectedIds(id)

    }

    return (
        <>
            {/* Conditionally render the delete button and Popconfirm */}
            {selectedIds.length > 0 && (
                <Popconfirm
                    title="Are you sure you want to delete these forums?"
                    onConfirm={handleDelete}
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
            )}

            <ResponsiveTable
                columns={columns}
                data={data}
                GetSelectedId={GetSelectedId}
            />
        </>
    );
}
