import DateFormat from '@/app/commonUl/DateFormat';
import { roundNumber } from '@/helper/roundNumber';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Flex, Row, Table } from 'antd';
import React from 'react'

export default function PackageInfoModal() {
    const singlePackageOrderInfo = useAppSelector((state: RootState) => state.packageOrdersReducer.singlePackageOrderInfo);
    return (
        <Row>
            <Col md={24} ><p className='fw-bold fs-5'>User Details</p></Col>
            <Row>

                <Col md={9}>
                    {singlePackageOrderInfo?.userId.image ?
                        <Avatar src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${singlePackageOrderInfo?.userId.image}`} size={180} />
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
                            <span>{singlePackageOrderInfo?.firstName} {singlePackageOrderInfo?.lastName}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Email</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1' >
                            <span>{singlePackageOrderInfo?.email}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Phone Number</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1' >
                            <span>{singlePackageOrderInfo?.phone}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Street Address</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span>{singlePackageOrderInfo?.streetAddress1} {singlePackageOrderInfo?.streetAddress2}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Town/City</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span>{singlePackageOrderInfo?.townCity}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>ZIP Code</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span>{singlePackageOrderInfo?.zipCode}</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>State</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span>{singlePackageOrderInfo?.state}</span>
                        </Col>

                        <Col md={12} className='border-bottom mb-1'>
                            <span className='fw-bold'>Country</span>
                        </Col>
                        <Col md={12} className='border-bottom mb-1'>
                            <span>{singlePackageOrderInfo?.country}</span>
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
                                    title: 'Package Name',
                                    dataIndex: 'packageName',
                                    key: 'packageName',
                                },
                                {
                                    title: 'Quantity',
                                    dataIndex: 'packageQuantity',
                                    key: 'packageQuantity',
                                },
                                {
                                    title: 'Valid Upto',
                                    dataIndex: 'validUpto',
                                    key: 'validUpto',
                                    render: (text: string, record: any) => {
                                        const { packageValidity } = record;
                                        return (
                                            packageValidity.durationTime.toLowerCase() === 'lifetime' ?
                                                <span>Lifetime</span>
                                                :
                                                <DateFormat date={packageValidity.calculatedTime} />
                                        );
                                    }
                                },
                                {
                                    title: 'Price',
                                    dataIndex: 'packageDiscountPrice',
                                    key: 'packageDiscountPrice',
                                    render: (text: string, record: any) => {
                                        const { packageDiscountPrice, packagePrice, packageQuantity } = record;
                                        const pricePerUnit = Number(packageDiscountPrice ?? packagePrice);
                                        return (
                                            <span>
                                                ${pricePerUnit * Number(packageQuantity)}
                                                {packageQuantity > 1 && (
                                                    <span className='mx-1' style={{ fontSize: '12px' }}>
                                                        (${pricePerUnit} each)
                                                    </span>
                                                )}
                                            </span>
                                        );
                                    },
                                },
                            ]}
                            dataSource={singlePackageOrderInfo?.orderSummary?.package}
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
                                            Total Packages: {singlePackageOrderInfo?.orderSummary?.package.length}
                                        </p>
                                        <p className='fw-bold'>
                                            Sub Total: $
                                            {roundNumber(
                                                Number(singlePackageOrderInfo?.orderSummary?.package?.reduce(
                                                    (total, pkg) =>
                                                        total +
                                                        (Number(pkg.packageDiscountPrice ?? pkg.packagePrice) * Number(pkg.packageQuantity)),
                                                    0
                                                )),
                                                2
                                            )}
                                        </p>
                                        <p className='fw-bold'>
                                            Total Amount: $
                                            {roundNumber(
                                                Number(singlePackageOrderInfo?.orderSummary?.package?.reduce(
                                                    (total, pkg) =>
                                                        total +
                                                        (Number(pkg.packageDiscountPrice ?? pkg.packagePrice) * Number(pkg.packageQuantity)),
                                                    0
                                                )),
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
