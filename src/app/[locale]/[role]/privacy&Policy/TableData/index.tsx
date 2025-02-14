import { EditOutlined } from '@ant-design/icons';
import { Button, Col, Modal, Row, Space, Table } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import FormModal from '../FormModal';
import { GetPrivacyPolicy } from '@/lib/adminApi';
import Titles from '@/app/commonUl/Titles';

interface PrivacyPolicy {
    title: string;
    description: string;
    _id: string;
}

const TableData: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState<PrivacyPolicy[]>([]);
    const [editData, setEditData] = useState<PrivacyPolicy | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await GetPrivacyPolicy();
            setData(res.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEditClick = (record: PrivacyPolicy) => {
        setIsModalVisible(true);
        setEditData(record);
    };

    const columns = useMemo(
        () => [
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                render: (text: string) => (
                    <div dangerouslySetInnerHTML={{ __html: text }} />
                ),
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (_: any, record: PrivacyPolicy) => (
                    <Space size="middle">
                        <Button onClick={() => handleEditClick(record)} type="primary" icon={<EditOutlined />} />
                    </Space>
                ),
            },
        ],
        []
    );

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditData(null);
    };

    return (
        <div>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
                    <Titles level={5} className="top-title">
                        Privacy & Policy
                    </Titles>
                </Col>
            </Row>

            <Modal
                title="Edit Privacy & Policy"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width="60%"
            >
                {editData && (
                    <FormModal
                        editData={editData}
                        fetchData={fetchData}
                        handleCancel={handleCancel}
                    />
                )}
            </Modal>

            <div className="desktop-view card-dash shadow-none top-medium-space">
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    bordered={false}
                    className="custom-table"
                />
            </div>
        </div>
    );
};

export default TableData;
