import { roundNumber } from '@/helper/roundNumber';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Flex, Row, Table } from 'antd';
import React from 'react'

export default function EbookInfoModal() {
    const singleEbookOrderInfo = useAppSelector((state: RootState) => state.ebookOrdersReducer.singleEbookOrderInfo);
    return (
        <Row>
            <Col md={24} ><p className='fw-bold fs-5'>User Details</p></Col>
            <Row>

                <Col md={9}>
                    {singleEbookOrderInfo?.userId.image ?
                        <Avatar src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${singleEbookOrderInfo?.userId.image}`} size={180} />
                        :
                        <Avatar icon={<UserOutlined />} size={180} />
                    }
                </Col>
                <Col md={15} >
                    <Row>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Student Name</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1' >
                            <span>{singleEbookOrderInfo?.firstName} {singleEbookOrderInfo?.lastName}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Email</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1' >
                            <span>{singleEbookOrderInfo?.email}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Phone Number</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1' >
                            <span>{singleEbookOrderInfo?.phone}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Street Address</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span>{singleEbookOrderInfo?.streetAddress1} {singleEbookOrderInfo?.streetAddress2}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Town/City</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span>{singleEbookOrderInfo?.townCity}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>ZIP Code</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span>{singleEbookOrderInfo?.zipCode}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>State</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span>{singleEbookOrderInfo?.state}</span>
                        </Col>

                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Country</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span>{singleEbookOrderInfo?.country}</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Col md={24} className='borde-bottom'>
                <p className='fw-bold fs-5'>Order Summary</p>
            </Col>
            <Col md={24}>
                <Row>
                    <Col md={24} className='orderInfoModalTable'>
                        <Table
                            rowKey="_id"
                            columns={[
                                {
                                    title: 'Ebook Name',
                                    dataIndex: 'eBookTitle',
                                    key: 'eBookTitle',
                                },
                                {
                                    title: 'Quantity',
                                    dataIndex: 'eBookQuantity',
                                    key: 'eBookQuantity',
                                },
                                {
                                    title: 'Price',
                                    dataIndex: 'eBookDiscountPrice',
                                    key: 'eBookDiscountPrice',
                                    render: (text: string, record: any) => {
                                        const { eBookDiscountPrice, eBookPrice, eBookQuantity } = record;
                                        const price = eBookDiscountPrice ?? eBookPrice;
                                        return (
                                            <span>
                                                ${Number(price) * Number(eBookQuantity)}
                                                {eBookQuantity > 1 && (
                                                    <span className='mx-1' style={{ fontSize: '12px' }}>
                                                        (${price} each)
                                                    </span>
                                                )}
                                            </span>
                                        );
                                    },
                                },

                            ]}
                            dataSource={singleEbookOrderInfo?.orderSummary?.eBook}
                            pagination={false}
                            bordered={false}
                            className="custom-table text-center"
                            footer={
                                () =>
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                        className="table-footer"
                                        style={{ backgroundColor: '#fff' }}
                                    >
                                        <p className='fw-bold'>
                                            Total Ebooks: {singleEbookOrderInfo?.orderSummary?.eBook.length}
                                        </p>
                                        <p className="fw-bold">
                                            Sub Total: $
                                            {roundNumber(
                                                Number(
                                                    singleEbookOrderInfo?.orderSummary?.eBook?.reduce(
                                                        (total, eBook) =>
                                                            total +
                                                            (Number(eBook.eBookDiscountPrice ?? eBook.eBookPrice) * Number(eBook.eBookQuantity)),
                                                        0
                                                    )
                                                ),
                                                2
                                            )}
                                        </p>
                                        <p className="fw-bold">
                                            Total Amount: $
                                            {roundNumber(
                                                Number(
                                                    singleEbookOrderInfo?.orderSummary?.eBook?.reduce(
                                                        (total, eBook) =>
                                                            total +
                                                            (Number(eBook.eBookDiscountPrice ?? eBook.eBookPrice) * Number(eBook.eBookQuantity)),
                                                        0
                                                    )
                                                ),
                                                2
                                            )}
                                        </p>
                                    </Flex>

                            }
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
