import DateFormat from '@/app/commonUl/DateFormat';
import { capitalizeString } from '@/helper/stringFunctions';
import { getAllPackageOrders, getAllPackagesForFilter } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { OrderDetail } from '@/lib/types';
import { useAppSelector } from '@/redux/hooks';
import { setPackageFilterId, setPackageInfoModal, setPackageOrderLimit, setPackageOrderLoading, setPackageOrderPage, setPackageOrders, setPackageOrderSearch, setPackageOrderTotalCount, setSinglePackageOrderInfo } from '@/redux/reducers/packageOrdersReducer';
import { RootState } from '@/redux/store';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Flex, Input, Modal, Row, Select, Table, Tag, } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PackageInfoModal from '../PackageInfoModal';

const PackageOrderTable: React.FC = () => {
    const packageOrders = useAppSelector((state: RootState) => state.packageOrdersReducer.packageOrders);
    const packageInfoModal = useAppSelector((state: RootState) => state.packageOrdersReducer.packageInfoModal);
    const packageOrderTotalCount = useAppSelector((state: RootState) => state.packageOrdersReducer.packageOrderTotalCount);
    const packageOrderPage = useAppSelector((state: RootState) => state.packageOrdersReducer.packageOrderPage);
    const packageOrderLimit = useAppSelector((state: RootState) => state.packageOrdersReducer.packageOrderLimit);
    const packageOrderLoading = useAppSelector((state: RootState) => state.packageOrdersReducer.packageOrderLoading);
    const packageOrderSearch = useAppSelector((state: RootState) => state.packageOrdersReducer.packageOrderSearch);
    const packageFilterId = useAppSelector((state: RootState) => state.packageOrdersReducer.packageFilterId);

    const dispatch = useDispatch();

    const [allPackages, setAllPackages] = useState([]);

    useEffect(() => {
        fetchAllPackages();
    }, []);

    const fetchAllPackages = async () => {
        try {
            const res = await getAllPackagesForFilter();
            if (res.status) setAllPackages(res.data);
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    useEffect(() => {
        getPayments(packageOrderPage, packageOrderLimit, packageOrderSearch, packageFilterId);
    }, [packageOrderPage, packageOrderLimit, packageOrderSearch, packageFilterId]);

    const getPayments = async (page: number, limit: number, searchQuery: string, packageFilterId: string) => {
        try {
            const res = await getAllPackageOrders(page, limit, searchQuery, packageFilterId);
            if (res.status) {
                dispatch(setPackageOrders(res.data));
                dispatch(setPackageOrderTotalCount(res.totalCount));
                dispatch(setPackageOrderLoading(false));
            }
        } catch (error) {
            dispatch(setPackageOrderLoading(false));
            ErrorHandler.showNotification(error);
        }
    };

    const columns = [
        {
            title: 'Student Name',
            dataIndex: 'studentName',
            key: 'studentName',
            sorter: (a: any, b: any) => (a.studentName || '').localeCompare(b.studentName || ''),
        },
        {
            title: 'Package Name',
            dataIndex: 'packageName',
            key: 'packageName',
            sorter: (a: any, b: any) => String(a.packageName || '').localeCompare(String(b.packageName || '')),
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: (a: any, b: any) => a.orderSummary?.totalAmount - b.orderSummary?.totalAmount,
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            sorter: (a: any, b: any) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        }
    ];

    const handleViewInfo = (order: OrderDetail) => {
        dispatch(setPackageInfoModal(true));
        dispatch(setSinglePackageOrderInfo(order))
    }


    const dataSource = packageOrders?.map((order: OrderDetail) => {
        return {
            key: order._id,
            studentName: `${order.firstName} ${order.lastName}`,
            packageName: (() => {
                const titles = order.orderSummary.package?.map((item) => capitalizeString(item.packageName)) || [];
                if (titles.length <= 2) {
                    return titles.join(', ');
                } else {
                    return (
                        <Flex gap={3}>
                            {titles.slice(0, 2).join(', ')}
                            <Tag
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                    handleViewInfo(order)
                                } color="blue">{titles.length - 2} More</Tag>
                        </Flex>
                    );
                }
            })(),
            totalAmount: (
                <>
                    $
                    {Number(
                        order?.orderSummary?.package?.reduce(
                            (total, pkg) =>
                                total +
                                ((pkg.packageDiscountPrice ?? pkg.packagePrice) * pkg.packageQuantity),
                            0
                        )
                    )}
                </>
            ),
            paymentStatus: (
                <div>
                    <Tag
                        style={{ width: 'fit-content' }}
                        color={
                            order.orderSummary.paymentStatus === 'paid' ? 'green' :
                                order.orderSummary.paymentStatus === 'failed' ? 'red' :
                                    order.orderSummary.paymentStatus === 'pending' ? 'orange' :
                                        order.orderSummary.paymentStatus === 'refunded' ? 'blue' :
                                            'teal'
                        }
                        className='text-center '
                    >
                        {capitalizeString(order.orderSummary.paymentStatus)}
                    </Tag>
                </div>
            ),
            orderDate: (
                <DateFormat date={order.
                    createdAt} />
            ),
            action: (
                <InfoCircleOutlined style={{ color: '#6610f2', fontSize: '18px', cursor: 'pointer' }} onClick={() =>
                    handleViewInfo(order)
                }
                />
            )
        }
    });

    const handlePaginationChange = (page: number, pageSize: number) => {
        dispatch(setPackageOrderPage(page));
        dispatch(setPackageOrderLimit(pageSize));
    };

    return (
        <>
            <div className='p-3'>
                <Row gutter={[14, 14]}>
                    <Col md={16} sm={24} xs={24}>
                        <h2 className='top-title mb-3'>Packages Order</h2>
                    </Col>
                    <Col md={4} sm={24} xs={24}>
                        <Input
                            placeholder="Search..."
                            onChange={(e) => dispatch(setPackageOrderSearch(e.target.value))}
                            suffix={<SearchOutlined />}
                        />
                    </Col>
                    <Col md={4} sm={24} xs={24} className='mb-3'>
                        <Select
                            placeholder="Select Package"
                            options={allPackages.map((pkg: { _id: string, packageName: string }) => ({
                                value: pkg._id,
                                label: pkg.packageName,
                            }))}
                            onChange={(value) => {
                                dispatch(setPackageFilterId(value))
                            }}
                            style={{ width: '100%' }}
                            allowClear
                        />

                    </Col>
                </Row>
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        current: packageOrderPage,
                        pageSize: packageOrderLimit,
                        total: packageOrderTotalCount,
                        // showSizeChanger: true,
                        onChange: handlePaginationChange,
                        // onShowSizeChange: handlePaginationChange,
                    }}
                    loading={packageOrderLoading}
                    bordered={false}
                    className="custom-table"
                />
                {packageInfoModal &&
                    <Modal
                        title={false}
                        footer={false}
                        visible={packageInfoModal}
                        onCancel={() => {
                            dispatch(setPackageInfoModal(false))
                            dispatch(setSinglePackageOrderInfo(null))
                        }}
                        width={650}
                    >
                        <PackageInfoModal />
                    </Modal>
                }
            </div>
        </>
    );
};
export default PackageOrderTable;
