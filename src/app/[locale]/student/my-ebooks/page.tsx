'use client';
import { getAllExamType, getAllFreeEBooks, getAllStates } from '@/lib/adminApi';
import { useAppSelector } from '@/redux/hooks';
import { setExamType } from '@/redux/reducers/examReducer';
import { setServices } from '@/redux/reducers/serviceReducer';
import { RootState } from '@/redux/store';
import { Col, Row, Select, Image, Button, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import ErrorHandler from '@/lib/ErrorHandler';
import { DownloadOutlined } from '@ant-design/icons';
const { Option } = Select;

interface StateType {
    _id: string;
    title: string;
}

interface EbookType {
    _id: string;
    title: string;
    pdfFile: string;
    image: string;
    stateId: { _id: string };
    examTypeId: { _id: string };
}

function Page() {

    const [data, setData] = useState([]);
    const [stateFilter, setStateFilter] = useState<string | null>(null);
    const [examFilter, setExamFilter] = useState<string | null>(null);

    const stateList = useAppSelector((state: RootState) => state.serviceReducer.services);
    const examList = useAppSelector((state: RootState) => state.examTypeReducer.examTypes);
    const dispatch = useDispatch();

    // Fetch data and update Redux store
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getAllFreeEBooks();
            setData(res.eBooks);

            const state = await getAllStates();
            if (state?.data) {
                const filteredServices = state.data.filter((service: any) =>
                    res.eBooks.some((ebook: EbookType) => ebook.stateId._id === service._id)
                );
                dispatch(setServices(filteredServices));

                const examType = await getAllExamType();
                if (examType?.data) {
                    const filteredExamTypes = examType.data.filter((exam: any) =>
                        res.eBooks.some((ebook: any) => ebook.examTypeId._id === exam._id)
                    );
                    dispatch(setExamType(filteredExamTypes));
                }
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleStateFilterChange = (value: string) => {
        setStateFilter(value);
        setExamFilter(null);
    };

    const handleExamFilterChange = (value: string) => {
        setExamFilter(value);
    };

    const filteredData = data.filter((item: any) => {
        const matchesState = stateFilter ? item.stateId._id === stateFilter : true;
        const matchesExam = examFilter ? item.examTypeId._id === examFilter : true; // Change this line
        return matchesState && matchesExam;
    });

    const handleDownload = async (item: { pdfFile: string }) => {
        try {
            const fileUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/E-bookss/pdfs/${item.pdfFile}`;
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
            const blob = await response.blob();
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', item.pdfFile);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            ErrorHandler.showNotification('Download failed:', error);
        }
    };


    const columns = [
        {
            title: 'Ebook Name',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span className="fw-medium">{text}</span>,
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Exam Name',
            dataIndex: 'examName',
            key: 'examName',
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'Download PDF',
            key: 'download',
            render: (_: any, record: any) => (
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(record)}
                >
                    Download
                </Button>
            ),
        },
    ];

    const dataSource = filteredData.map((item: any, index: number) => {
        return {
            key: index,
            title: item.title,
            subject: item.subjectId.subjectName,
            examName: item.examTypeId.examType,
            state: item.stateId.title,
            pdfFile: item.pdfFile,
        };
    });



    return (
        <div>
            <section className="dash-part bg-light-steel">
                <h2 className="top-title">My ebooks</h2>
                <div className="card-dash mt-3">
                    <Row gutter={16} className="mb-3">
                        <Col lg={5} md={7} sm={12} xs={24} >
                            <p className="p-sm color-dark-gray p-xs fw-medium mb-1">State</p>
                            <Select
                                className="select-list-2 p-relative w-100 mb-3"
                                placeholder="Select State"
                                value={stateFilter || undefined}
                                onChange={handleStateFilterChange}
                                allowClear
                            >
                                {stateList?.map((item: any) => (
                                    <Option value={item._id} key={item._id}>
                                        {item.title}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                        <Col lg={5} md={7} sm={12} xs={24}>
                            <p className="p-sm color-dark-gray p-xs fw-medium mb-1">Exam Type</p>
                            <Select
                                placeholder="Select Exam Type"
                                className="select-list-2 p-relative w-100"
                                value={examFilter || undefined}
                                onChange={handleExamFilterChange}
                                allowClear
                                disabled={!stateFilter}
                            >
                                {examList?.map((item: any) => (
                                    <Option value={item._id} key={item._id}>
                                        {item.examType}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        pagination={{ pageSize: 10 }}
                        bordered
                        style={{ marginTop: '20px' }}
                    />
                </div >
            </section >
        </div >
    );
}

export default Page;
