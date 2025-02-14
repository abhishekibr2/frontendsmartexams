'use client';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Upload, message } from 'antd';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import TextArea from 'antd/es/input/TextArea';
import { PlusOutlined } from '@ant-design/icons';
import { addUpdateTestimonial } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { handleFileCompression } from '@/lib/commonServices';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setEditData, setFetchTestimonials, setModal } from '@/redux/reducers/testimonialReducer';
import { useAppDispatch } from '@/redux/hooks';
import { getStateWithExamTypes } from '@/lib/frontendApi';

interface ExamType {
    _id: string;
    examType: string;
}

interface State {
    _id: string;
    title: string;
    examTypes: ExamType[];
}

export default function FormModal() {
    const [form] = Form.useForm();
    const [testimonialsId, setTestimonialsId] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const dispatch = useAppDispatch();
    const editData = useSelector((state: RootState) => state.testimonialReducer.editData);
    const fetchTestimonials = useSelector((state: RootState) => state.testimonialReducer.fetchTestimonials)
    const [filteredExamTypes, setFilteredExamTypes] = useState<ExamType[]>([]);
    const [state, setState] = useState<State[]>([]);
    const [page, setPage] = useState<string>('');
    const { Option } = Select;

    useEffect(() => {
        if (editData && editData !== null) {
            setTestimonialsId(editData._id);
            form.setFieldsValue({
                name: editData.name,
                designation: editData.designation,
                description: editData.description,
                pages: editData.pages,
                state: editData.state?._id,
                examType: editData.examType?.examType
            });
            if (editData?.image) {
                setFileList([
                    {
                        uid: '1',
                        name: editData.image,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/testimonials/original/${editData.image}`
                    }
                ]);
            } else {
                setFileList([])
            }
            setPage(editData.pages);

        } else {
            setTestimonialsId('');
            form.resetFields();
            setFileList([]);
        }
    }, [editData]);


    const onFinish = async (values: {
        name: string;
        designation: string | Blob;
        description: string | Blob;
        pages?: string;
        state?: string;
        examType?: string;
    }) => {
        const formData = new FormData();
        if (fileList && fileList.length > 0) {
            if (fileList[0]?.originFileObj) {
                const file = fileList[0]?.originFileObj as Blob;
                formData.append('image', file);
            } else {
                const file = fileList[0]?.name;
                formData.append('image', file as string);
            }
        }
        const capitalizedName = values.name.replace(/\b\w/g, (char: string) => char.toUpperCase());
        formData.append('name', capitalizedName);
        formData.append('designation', values.designation);
        formData.append('testimonialsId', testimonialsId);
        formData.append('description', values.description);
        if (values.pages) formData.append('pages', values.pages);
        if (values.state) formData.append('state', values.state);
        if (values.examType) formData.append('examType', values.examType);

        const res = await addUpdateTestimonial(formData);
        if (res.status === true) {
            dispatch(setFetchTestimonials(!fetchTestimonials));
            dispatch(setModal(false));
            dispatch(setEditData(null));
            form.resetFields();
            setFileList([]);

            message.success(res.message);
        }
    };

    const handleBeforeUpload = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFileList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemove = () => {
        setFileList([]);
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const getStates = async () => {
        try {
            const response = await getStateWithExamTypes();
            setState(response.data);
        } catch (error) {
            console.error('Error while getting states:', error);
        }
    };

    useEffect(() => {
        getStates();
    }, []);

    const handleStateChange = (stateId: string) => {
        const selectedStateItem = state.find((item) => item._id === stateId);
        if (selectedStateItem) {
            setFilteredExamTypes(selectedStateItem.examTypes);
        }
    };
    const handlePageName = async (values: any) => {
        setPage(values)
    }

    return (
        <>
            <Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ status: 'active' }} >


                <Row align="middle" gutter={16} >
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter name',
                                },
                                {
                                    pattern: /^[A-Za-z\s]*$/,
                                    message: 'Numbers and special characters are not allowed!',
                                },
                            ]}
                        >
                            <Input placeholder="Please enter name" type="text" maxLength={50} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            name="designation"
                            label="Designation"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter designation!',
                                },
                            ]}
                        >
                            <Input placeholder="Please enter designation" type="text" maxLength={100} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            label="Pages"
                            name="pages"
                            rules={[{ required: true, message: 'Please select a page type' }]}
                        >
                            <Select mode="multiple" placeholder="Select a page type" onChange={handlePageName}>
                                <Select.Option value="Home">Home</Select.Option>
                                <Select.Option value="Exam Info">Exam Info</Select.Option>
                                <Select.Option value="Tutoring & Classes">Tutoring & Classes</Select.Option>
                                <Select.Option value="Why Choose Us">Why Choose Us</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {page === 'Home' || page === 'Tutoring & Classes' || page === 'Why Choose Us' ? (
                        <>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Form.Item
                                    label="State"
                                    name="state"
                                    rules={[{ message: 'Please select a state!' }]}
                                >
                                    <Select
                                        placeholder="Select a state"
                                        onChange={handleStateChange}
                                        disabled={page === 'Home' || page === 'Tutoring & Classes' || page === 'Why Choose Us'}
                                    >
                                        {state.map((item) => (
                                            <Option key={item._id} value={item._id}>
                                                {item.title}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Form.Item
                                    label="Exam Type"
                                    name="examType"
                                    rules={[{ message: 'Please select an exam type!' }]}
                                >
                                    <Select
                                        placeholder="Select an exam type"
                                        disabled={page === 'Home' || page === 'Tutoring & Classes' || page === 'Why Choose Us'}
                                    >
                                        {filteredExamTypes.map((examType) => (
                                            <Option key={examType._id} value={editData ? editData?.examType?._id : examType._id} >
                                                {examType.examType}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </>
                    ) : (
                        <>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Form.Item
                                    label="State"
                                    name="state"
                                    rules={[{ required: true, message: 'Please select a state!' }]}
                                >
                                    <Select placeholder="Select a state" onChange={handleStateChange}>
                                        {state.map((item) => (
                                            <Option key={item._id} value={item._id}>
                                                {item.title}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Form.Item
                                    label="Exam Type"
                                    name="examType"
                                    rules={[{ required: true, message: 'Please select an exam type!' }]}
                                >
                                    <Select placeholder="Select an exam type">
                                        {filteredExamTypes.map((item) => (
                                            <Option key={item._id} value={item._id}>
                                                {item.examType}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </>
                    )}
                    <Col xs={24}>
                        <Form.Item name="description" label="Description">
                            <TextArea placeholder="Message" maxLength={500} rows={8} />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Upload
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            listType="picture-card"
                            fileList={fileList}
                            beforeUpload={handleBeforeUpload}
                            accept=".jpg,.jpeg,.png"
                            onRemove={handleRemove}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    </Col>
                    <Col xs={24}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                width: '100%',
                                marginTop: '10px',
                            }}
                        >
                            {editData ? 'Update' : 'Save'}
                        </Button>
                    </Col>
                </Row>
            </Form>

        </>
    );
}
