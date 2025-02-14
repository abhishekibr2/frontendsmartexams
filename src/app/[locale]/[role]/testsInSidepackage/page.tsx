'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useContext } from 'react'
import { Button, Col, Pagination, Row, Table } from 'antd'
import { TestSInPackage } from '@/lib/adminApi'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from 'next/navigation'
import { EditOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { FaEye } from 'react-icons/fa'
import AuthContext from '@/contexts/AuthContext';

const Page = () => {
    const searchId = useSearchParams();
    const testid = searchId.get('packageId');
    const [test, setTest] = useState([]);
    const [essayData, setEssayData] = useState([]);
    const router = useRouter();
    const [packageName, setPackageName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { user } = useContext(AuthContext);
    const roleName = user?.roleId?.roleName;
    const getTests = async () => {
        const response = await TestSInPackage({ testid });
        if (response?.status) {
            setPackageName(response.packageData.packageName)
            setTest(response?.packageData.tests);
            setEssayData(response?.essayData || {});
        }
    };

    useEffect(() => {
        getTests();
    }, [testid]);

    //for string
    const capitalizeFirstLetter = (str: any) => {
        if (typeof str !== 'string') return str || '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    //for array
    const capitalizeArrayOrString = (data: any) => {
        if (Array.isArray(data)) {
            return data.map(item => capitalizeFirstLetter(item));
        }
        return capitalizeFirstLetter(data);
    };


    const columns = [

        {
            title: 'Test Name',
            dataIndex: 'testName',
            key: 'testName',
            sorter: (a: any, b: any) => String(a.testDisplayName || '').localeCompare(String(b.testDisplayName || '')),

        },
        {
            title: 'Subject',
            dataIndex: 'subjectInPackage',
            key: 'subjectInPackage',
            sorter: (a: any, b: any) => String(a.subjectInPackage || '').localeCompare(String(b.subjectInPackage || '')),
            render: (text: string) => capitalizeArrayOrString(text),
            width: '20%',
        },
        {
            title: 'Test Conducted By',
            dataIndex: 'testConductedBy',
            key: 'testConductedBy',
            render: (testConductedBy: any) => {
                const name = testConductedBy?.name || 'N/A';
                return capitalizeArrayOrString(name);
            }, sorter: (a: any, b: any) => String(a.testConductedBy?.name || '').localeCompare(String(b.testConductedBy?.name || '')),
        },
        {
            title: 'Total Questions',
            dataIndex: 'maxQuestions',
            key: 'maxQuestions',
            sorter: (a: any, b: any) => a.maxQuestions - b.maxQuestions,
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            sorter: (a: any, b: any) => a.duration - b.duration,
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
            sorter: (a: any, b: any) => String(a.difficulty || '').localeCompare(String(b.difficulty || '')),
            render: (text: string) => capitalizeArrayOrString(text)
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            render: (state: any) => {
                const status = state?.title || 'N/A';
                return capitalizeArrayOrString(status);
            },
            sorter: (a: any, b: any) => String(a.state || '').localeCompare(String(b.state || '')),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a: any, b: any) => String(a.status || '').localeCompare(String(b.status || '')),
            render: (status: string) => (
                <span
                    style={{
                        backgroundColor: status === 'active' ? '#5fbd5f' : '#5fbd5f',
                        color: 'white',
                        padding: '5px 10px',
                        textAlign: 'center',
                        borderRadius: '4px',
                        display: 'inline-block',
                        width: '100%'
                    }}
                >
                    {capitalizeArrayOrString(status)}
                </span>
            ),
        },


        {
            title: 'Action',
            key: 'action',
            render: (record: any) => (
                <>
                    <Link href={`/${roleName}/test/${record._id}/editor/preview`}>
                        <Button style={{
                            marginRight: '5px'
                        }}>
                            <FaEye />
                        </Button>
                    </Link>
                    <Link href={`/${roleName}/test/create?EditId=${record._id}`}>
                        <Button><EditOutlined /></Button>
                    </Link>
                </>
            ),
        }

    ];

    const dataSource = [
        ...test,
        ...essayData
    ].filter(item => Object.keys(item).length > 0);


    const paginatedTests = dataSource.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div>
            <Row>
                <Col span={20}>
                    <IoMdArrowRoundBack
                        style={{ fontSize: '25px', marginBottom: '1rem', cursor: 'pointer' }}
                        onClick={() => router.push(`/${roleName}/packages`)}
                    />
                </Col>
                <Col span={4} style={{ textAlign: 'end', marginTop: '12px' }}>
                    <h6>Total Tests In Package :{dataSource.length}</h6>
                </Col>

            </Row>
            <Row>
                <Col span={20}>
                    <h2 className="color-dark-gray title-lg fw-regular">Tests in Package:  {packageName}</h2>
                </Col>
                <Col span={4}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={dataSource.length}
                        onChange={(page, pageSize) => {
                            setCurrentPage(page);
                            setPageSize(pageSize);
                        }}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '50', '100']}
                        onShowSizeChange={(current, size) => setPageSize(size)}
                        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}
                    /></Col>
            </Row>

            {dataSource.length > 0 ? (
                <><Table
                    dataSource={paginatedTests}
                    columns={columns}
                    pagination={false} />

                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={dataSource.length}
                        onChange={(page, pageSize) => {
                            setCurrentPage(page);
                            setPageSize(pageSize);
                        }}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '50', '100']}
                        onShowSizeChange={(current, size) => setPageSize(size)}
                        style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}
                    />
                </>
            ) : (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                    textAlign: 'center',
                }}>
                    <p>No Tests</p>

                </div>
            )}

        </div>
    );
};

export default Page;
