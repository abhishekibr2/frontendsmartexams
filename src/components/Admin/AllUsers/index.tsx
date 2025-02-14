'use client';
import React, { useState, useEffect } from 'react';
import { Button, message, Table } from 'antd';
import { getAllUsers, sendEmail } from '@/lib/adminApi';
import './style.css';
interface Props {
    handleCancel: () => void
}
function AllUsers({ handleCancel }: Props) {
    const [users, setUsers] = useState<any[]>([]); // State to hold all users
    const [filteredData, setFilteredData] = useState<any[]>([]); // State to hold filtered data
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response: any = await getAllUsers();
            if (response.status === true) {
                const userData = response.data.map((user: any, index: number) => ({ ...user, key: user.id || index }));
                setUsers(userData);
                setFilteredData(userData);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
        const selectedIds = selectedRows.map((row) => row._id);
        setSelectedUserIds(selectedIds);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        const filtered = users.filter((user) =>
            user.name.toLowerCase().includes(value)
        );
        setFilteredData(filtered);
    };


    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: any[]) => {
            onSelectChange(newSelectedRowKeys, selectedRows);
        },
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filterDropdown: (
                <div style={{ padding: 8 }}>
                    <input
                        placeholder="Search Name"
                        style={{ width: 188, marginBottom: 8 }}
                        onChange={handleSearch}
                    />
                </div>
            ),
            onFilter: (value: any, record: any) =>
                record.name.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Mobile Number',
            width: '20%',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (phoneNumber: string | null | undefined) => phoneNumber || 'NA',
        },
    ];
    const handleEmail = async () => {
        try {
            const res = await sendEmail(selectedUserIds)
            if (res.status == true) {
                message.success('Email sent successfully');
                setSelectedRowKeys([]);
                setSelectedUserIds([]);
                handleCancel();
            }
        } catch (error) {
            message.error('Failed to send email');
            console.error(error);
        }
    }

    return (
        <div
            style={{
                height: '50vh',
                overflowY: 'scroll',
            }}
            className="custom-scrollbar"
        >{
                selectedUserIds.length > 0 &&
                <Button
                    style={{
                        float: 'right',
                        marginTop: '10px',
                        marginBottom: '10px',
                        marginRight: '10px',
                    }}
                    onClick={handleEmail}
                >
                    Send Mail
                </Button>

            }

            <Table
                dataSource={filteredData}
                columns={columns}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                pagination={false}
            />
        </div>
    );
}

export default AllUsers;
