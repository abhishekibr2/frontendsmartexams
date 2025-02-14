import React, { useState } from "react";
import { Table, Row, Col, Card, Typography, Button, Flex } from "antd";
import './ResponsiveTable.css';
import { setPageSize, setCurrentPage } from '@/redux/reducers/responsiveTableReducer';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

interface ResponsiveTableProps {
    columns: any[];
    data: any[];
    pageSize?: number;
    currentPage?: number;
    rowSelection?: {
        selectedRowKeys: string[];
        onChange: (selectedRowKeys: string[]) => void;
        type: 'checkbox' | 'radio';
    };
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize: number) => void;
    };
    GetSelectedId: any
}

const { Text } = Typography;

const ResponsiveTable = ({ columns, data, GetSelectedId }: ResponsiveTableProps) => {
    const { pageSize, currentPage, total } = useAppSelector((state: RootState) => state.responsiveTableReducer);
    const [selectedIds, setSelectedIds] = useState<any[]>([]);

    const dispatch = useAppDispatch();

    const renderMobileView = (rowData: any, index: number) => {
        return (

            <Row gutter={[16, 16]} key={rowData.id} className="mobile-row">
                <Col span={24}>
                    <Card
                        bordered={false}
                        className="mobile-card"
                        title={
                            <div className="card-header">
                                <Text strong>{index + 1}.</Text>
                            </div>
                        }
                    >
                        <div className="card-content">
                            {/* {columns.map((col, index) => (
                                <Flex justify="space-between" gap={'small'} key={index} className="card-item">
                                    <strong>{col.title}:</strong> <span>{rowData[col.dataIndex]}</span>
                                </Flex>
                            ))} */}
                            {columns.map((col, index) => {
                                const cellValue = rowData[col.dataIndex];
                                const displayValue = typeof cellValue === 'object' ? cellValue?.title || 'No Data' : cellValue;
                                return (
                                    <Flex justify="space-between" gap={'small'} key={index} className="card-item">
                                        <strong>{col.title}:</strong> <span>{displayValue}</span>
                                    </Flex>
                                );
                            })}

                        </div>
                    </Card>
                </Col>
            </Row>
        );
    };

    const handlePaginationChange = (page: number, pageSize: number) => {
        dispatch(setCurrentPage(page));
        dispatch(setPageSize(pageSize));
    };



    const rowSelection = {
        selectedRowKeys: selectedIds,
        onChange: (selectedRowKeys: any) => {
            setSelectedIds(selectedRowKeys);
            GetSelectedId(selectedRowKeys);
        },
    };


    return (
        <div>
            {data.length > 0 ? <>

                <div className="desktop-view card-dash shadow-none top-medium-space">
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection
                        }}
                        pagination={{
                            current: currentPage,
                            pageSize,
                            total: total,
                            onChange: handlePaginationChange,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30', `${total}`],
                            position: ['topRight', 'bottomRight'],
                        }}
                    />

                </div>
                <div className="mobile-view">
                    {data?.map((rowData, index) => renderMobileView(rowData, index))}
                </div>

            </> : <p className="mobile-space-0" style={{ textAlign: 'center', fontSize: '20px', color: 'gray', padding: '250px' }}>No Data Found</p>}
        </div>
    );
};

export default ResponsiveTable;
