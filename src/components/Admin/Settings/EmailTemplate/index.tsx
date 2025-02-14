'use client'
import ParaText from '@/app/commonUl/ParaText';
import TextEditor from '@/app/commonUl/TextEditor';
import AuthContext from '@/contexts/AuthContext';
import { getAllEmailTemplates, updateEmailTemplate } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import { Button, Card, Col, Form, Input, message, Row, Table, Upload, UploadFile } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import RichText from '@/commonUI/RichText';
import { PlusOutlined } from '@ant-design/icons';
import { handleFileCompression } from '@/lib/commonServices';
import { RcFile } from 'antd/es/upload';

interface Props {
    activeKey: string;
}

interface formValues {
    templateId: string | null | undefined;
    title: string;
    template: string;
}

interface templateData {
    _id: string
    name: string
    subject: string
    template: string
    type: string
    createdBy: string
    updatedBy: string
    deletedBy: string
    createdAt: string
    updatedAt: string
    deletedAt: string
    __v: number
    key: string | null

}


const EmailTemplate = ({ activeKey }: Props) => {
    const { user } = useContext(AuthContext);
    const [templates, setAllTemplates] = useState<templateData[]>([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [expandedRowKey, setExpandedRowKey] = useState('');
    // const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleQuillChange = (content: string) => {
        form.setFieldsValue({
            template: content
        });
    };

    useEffect(() => {
        if (user) fetchTemplate();
    }, [activeKey, user?._id]);


    const fetchTemplate = async () => {
        try {
            const res = await getAllEmailTemplates();
            if (res.status) {
                setAllTemplates(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const onFinish = async (values: formValues) => {
        try {
            setLoading(true);
            const templateId = expandedRowKey;
            const res = await updateEmailTemplate({ ...values, templateId });

            if (res.status) {
                message.success(res.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    };

    const columns = [
        {
            key: 'id',
            name: 'Name',
            dataIndex: 'name',
        }
    ];

    const data = templates.map((data: templateData) => ({
        key: data._id,
        name: data.name,
        subject: data.subject,
        type: data.type,
        template: data.template,
        _id: data._id,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        deletedBy: data.deletedBy,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        deletedAt: data.deletedAt,
        __v: data.__v,
    }));
    const handleChange = ({ fileList: newFileList }: any) => {
        // setFileList(Array.isArray(newFileList) ? newFileList : []);
    };

    const handleBeforeUpload = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            // setFileList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };
    const onExpand = (expanded: boolean, record: templateData) => {
        if (expanded) {
            setExpandedRowKey(record._id);
            form.setFieldsValue(record);
        } else {
            setExpandedRowKey('');
        }
    };



    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleRemove = () => {
        // setFileList([]);
    };
    return (
        <>
            <div className="smallTopMargin"></div>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                Email Templates
            </ParaText>
            <Row gutter={16}>

                <Col xl={16} lg={16} md={16} sm={24} xs={24} className='emailTemplate'>
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={data}
                        expandable={{
                            expandedRowRender: (record) => (

                                <div key={record._id}>
                                    <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                                        {record.name}
                                    </ParaText>
                                    <div className="smallTopMargin"></div>
                                    <Form
                                        layout='vertical'
                                        size='large'
                                        form={form}
                                        onFinish={onFinish}
                                    >
                                        <Row gutter={16}>
                                            {/* <Col span={4}>
                                                <Form.Item label="Upload Logo" name="logo" valuePropName="fileList">
                                                    <Upload
                                                        listType="picture-card"
                                                        fileList={fileList}
                                                        onRemove={handleRemove}
                                                        onChange={handleChange}
                                                        beforeUpload={handleBeforeUpload}
                                                        accept=".jpg,.jpeg,.png"
                                                    >
                                                        {fileList.length >= 1 ? null : uploadButton}
                                                    </Upload>
                                                </Form.Item>
                                            </Col> */}
                                            <Col md={12}>
                                                <Form.Item
                                                    label="Email Template Name"
                                                    name="name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please enter Name!'
                                                        },
                                                        {
                                                            max: validationRules.textLength.maxLength,
                                                            message: `Name must be at most ${validationRules.textLength.maxLength} characters`
                                                        }
                                                    ]}
                                                >
                                                    <Input placeholder='Enter email template name' />
                                                </Form.Item>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Item
                                                    label="Email Template Subject"
                                                    name="subject"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please enter Subject!'
                                                        },
                                                        {
                                                            max: validationRules.textLength.maxLength,
                                                            message: `Subject must be at most ${validationRules.textLength.maxLength} characters`
                                                        }
                                                    ]}
                                                >
                                                    <Input placeholder='Enter email template subject' />
                                                </Form.Item>
                                                <Form.Item
                                                    name="type"
                                                >
                                                    <Input type='hidden' placeholder='Enter email template subject' />
                                                </Form.Item>
                                            </Col>
                                            <Col md={24}>
                                                <Form.Item
                                                    name="template"
                                                    rules={[{ required: true, message: 'Please enter Description!' }]}
                                                >
                                                    <RichText
                                                        editorValue={form.getFieldValue('template')}
                                                        onChange={handleQuillChange}
                                                        placeholder="Enter email template text"
                                                    />
                                                </Form.Item>

                                            </Col>
                                            <Col md={24}>
                                                <div style={{ textAlign: 'end' }}>
                                                    <Button type='primary' loading={loading} htmlType='submit'>
                                                        {loading ? 'Submitting' : 'Submit template'}
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            ),
                            onExpand: onExpand
                        }}
                    />
                </Col>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                    <div className="largeTopMargin"></div>
                    <Card>
                        <ParaText size="extraSmall" fontWeightBold={600} color="PrimaryColor">
                            Use the variables below in your editor to dynamically format your content. Ensure you use the same format and symbols as shown.
                        </ParaText>
                        <div className="smallTopMargin"></div>
                        <span>
                            *|Name|*  <br /> *|Email|*  <br /> *|Phone|* <br /> *|ResetLink|*
                        </span>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default EmailTemplate;
