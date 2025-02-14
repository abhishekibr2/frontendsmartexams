import DateFormat from '@/app/commonUl/DateFormat';
import { capitalizeString } from '@/helper/stringFunctions';
import { getAllEbookOrders, getAllEbooksForFilter } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { OrderDetail } from '@/lib/types';
import { useAppSelector } from '@/redux/hooks';
import { setEbookOrderLimit, setEbookOrderLoading, setEbookOrderPage, setEbookOrders, setEbookOrderTotalCount, setEbookInfoModal, setSingleEbookOrderInfo, setEbookOrderSearch, setEbookFilterId } from '@/redux/reducers/ebookOrdersReducer';
import { RootState } from '@/redux/store';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Flex, Input, Modal, Row, Select, Table, Tag, } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import EbookInfoModal from '../EbookInfoModal';
import { dateFormat } from '@/helper/dateFormat';
import { roundNumber } from '@/helper/roundNumber';


const EbookOrderTable: React.FC = () => {
    const eBookOrders = useAppSelector((state: RootState) => state.ebookOrdersReducer.ebookOrders);
    const ebookInfoModal = useAppSelector((state: RootState) => state.ebookOrdersReducer.ebookInfoModal);
    const ebookOrderTotalCount = useAppSelector((state: RootState) => state.ebookOrdersReducer.ebookOrderTotalCount);
    const ebookOrderPage = useAppSelector((state: RootState) => state.ebookOrdersReducer.ebookOrderPage);
    const ebookOrderLimit = useAppSelector((state: RootState) => state.ebookOrdersReducer.ebookOrderLimit);
    const ebookOrderLoading = useAppSelector((state: RootState) => state.ebookOrdersReducer.ebookOrderLoading);
    const ebookOrderSearch = useAppSelector((state: RootState) => state.ebookOrdersReducer.ebookOrderSearch);
    const ebookFilterId = useAppSelector((state: RootState) => state.ebookOrdersReducer.ebookFilterId);

    const dispatch = useDispatch();

    const [allEbooks, setAllEbooks] = useState([]);

    useEffect(() => {
        fetchAllEbooks();
    }, []);

    const fetchAllEbooks = async () => {
        try {
            const res = await getAllEbooksForFilter();
            if (res.status) setAllEbooks(res.data);
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };


    useEffect(() => {
        getPayments(ebookOrderPage, ebookOrderLimit, ebookOrderSearch, ebookFilterId);
    }, [ebookOrderPage, ebookOrderLimit, ebookOrderSearch, ebookFilterId]);

    const getPayments = async (page: number, limit: number, searchQuery: string, ebookFilterId: string) => {
        try {
            const res = await getAllEbookOrders(page, limit, searchQuery, ebookFilterId);
            if (res.status) {
                dispatch(setEbookOrders(res.data));
                dispatch(setEbookOrderTotalCount(res.totalCount));
                dispatch(setEbookOrderLoading(false));
            }
        } catch (error) {
            dispatch(setEbookOrderLoading(false));
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
            title: 'Ebook Name',
            dataIndex: 'eBookTitle',
            key: 'eBookTitle',
            sorter: (a: any, b: any) => String(a.eBookTitle || '').localeCompare(String(b.eBookTitle || '')),
        },

        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            sorter: (a: any, b: any) => a.duration - b.duration,

        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            sorter: (a: any, b: any) => String(a.paymentStatus || '').localeCompare(String(b.paymentStatus || '')),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        }
    ];

    const handleViewInfo = (order: OrderDetail) => {
        dispatch(setEbookInfoModal(true));
        dispatch(setSingleEbookOrderInfo(order))
    }

    const dataSource = eBookOrders?.map((order: OrderDetail) => {
        return {
            key: order._id,
            studentName: `${order.firstName} ${order.lastName}`,
            eBookTitle: (() => {
                const titles = order.orderSummary.eBook?.map((item) => capitalizeString(item.eBookTitle)) || [];
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
                                } color="blue">{titles.length - 2} More items</Tag>
                        </Flex>
                    );
                }
            })(),
            totalAmount: (
                <>
                    ${roundNumber(Number(
                        order?.orderSummary?.eBook?.reduce(
                            (total, ebook) =>
                                total +
                                ((ebook.eBookDiscountPrice ?? ebook.eBookPrice) * ebook.eBookQuantity || 0),
                            0
                        )
                    ), 2)}
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
        dispatch(setEbookOrderPage(page));
        dispatch(setEbookOrderLimit(pageSize));
    };

    return (
        <>
            <div className='p-3'>
                <Row gutter={[14, 14]}>
                    <Col md={18} sm={24}>
                        <h2 className='top-title mb-3'>Ebook Orders</h2>
                    </Col>
                    <Col md={3} sm={24}>
                        <Input
                            placeholder="Search..."
                            onChange={(e) => dispatch(setEbookOrderSearch(e.target.value))}
                            suffix={<SearchOutlined />}
                        />
                    </Col>
                    <Col md={3} sm={24}>
                        <Select
                            placeholder="Select Package"
                            options={allEbooks.map((ebook: { _id: string, title: string }) => ({
                                value: ebook._id,
                                label: ebook.title,
                            }))}
                            onChange={(value) => {
                                dispatch(setEbookFilterId(value))
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
                        pageSizeOptions: ['5', '10', '20', '50', '100'],
                        defaultPageSize: 10,
                        showSizeChanger: true,

                    }}
                    loading={ebookOrderLoading}
                    bordered={false}
                    className="custom-table"
                />
                {ebookInfoModal &&
                    <Modal
                        title={false}
                        footer={false}
                        visible={ebookInfoModal}
                        onCancel={() => {
                            dispatch(setEbookInfoModal(false))
                            dispatch(setSingleEbookOrderInfo(null))
                        }}
                        width={650}
                    >
                        <EbookInfoModal />
                    </Modal>
                }
            </div>
        </>
    );
};
export default EbookOrderTable;
