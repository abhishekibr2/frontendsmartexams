import ParaText from '@/app/commonUl/ParaText'
import TextEditor from '@/app/commonUl/TextEditor'
import AuthContext from '@/contexts/AuthContext'
import { addUpdateKnowledgeBase } from '@/lib/adminApi'
import ErrorHandler from '@/lib/ErrorHandler'
import { validationRules } from '@/lib/validations'
import { Button, Col, Drawer, Form, Input, message, Row, Select, Space } from 'antd'
import React, { useContext } from 'react'
import { FaPlus } from 'react-icons/fa'
import KnowledgeTable from './KnowledgeTable'
import { setLoading, setDrawer, setReload, setSearchQuery, setBaseId, setDescription } from '@/redux/reducers/knowledgebaseReducer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { knowledgeBase } from '@/lib/types'

interface formValues {
    title: string;
    description: string;
    content: string;
    userId: string;
    baseId: string;
}

export default function KnowledgeBase() {
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext)
    const dispatch = useDispatch()
    const loading = useSelector((state: RootState) => state.knowledgebaseReducer.loading)
    const drawer = useSelector((state: RootState) => state.knowledgebaseReducer.drawer)
    const reload = useSelector((state: RootState) => state.knowledgebaseReducer.reload)
    const baseId = useSelector((state: RootState) => state.knowledgebaseReducer.baseId)
    const description = useSelector((state: RootState) => state.knowledgebaseReducer.description)

    const handleItems = () => {
        dispatch(setDrawer(true))
        form.resetFields();
        dispatch(setBaseId(''));
    }

    const onFinish = async (values: formValues) => {
        try {
            dispatch(setLoading(true))
            if (!user?._id) {
                message.error('User not authenticated');
                return; // Prevent submitting if user ID is not available
            }
            values.userId = user?._id;
            values.baseId = baseId || '';
            const res = await addUpdateKnowledgeBase(values);
            if (res.status == true) {
                message.success(res.message);
                form.resetFields();
                dispatch(setDrawer(false))
                dispatch(setLoading(false))
                dispatch(setReload(!reload))
            }
        } catch (error) {
            dispatch(setLoading(false))
            ErrorHandler.showNotification(error);
        }
    }

    const handleEdit = (data: knowledgeBase) => {
        dispatch(setBaseId(data._id));
        dispatch(setDescription(data.description))
        dispatch(setDrawer(true))
        form.setFieldsValue({
            title: data.title,
            youtubeLink: data.youtubeLink,
            description: data.description,
            category: data.category,
            baseId: data._id,
        });
    };

    const handleQuillChange = (content: string) => {
        dispatch(setDescription(content));
        form.setFieldsValue({
            description: content
        });
    };

    return (
        <>
            <div>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={16}>
                        <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                            Knowledge Base
                        </ParaText>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={8} className='textEnd'>
                        <Space >
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select category"
                                allowClear
                                options={[
                                    { label: 'Getting Started', value: 'Getting Started' },
                                    { label: 'Account Management', value: 'Account Management' },
                                    { label: 'Product Features', value: 'Product Features' },
                                    { label: 'Troubleshooting', value: 'Troubleshooting' },
                                    { label: 'Billing and Payments', value: 'Billing and Payments' },
                                    { label: 'Usage Tips', value: 'Usage Tips' },
                                    { label: 'Updates and Announcements', value: 'Updates and Announcements' },
                                    { label: 'Developer Resources', value: 'Developer Resources' },
                                    { label: 'Policies and Compliance', value: 'Policies and Compliance' },
                                    { label: 'Community and Support', value: 'Community and Support' }
                                ]}
                                onChange={(value: string) => {
                                    dispatch(setSearchQuery(value));
                                }}
                            />
                            <Button icon={<FaPlus />} type={'primary'} onClick={handleItems} >
                                Add Item
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <div className='gapMarginTopTwo'></div>
                <KnowledgeTable onEdit={(data: knowledgeBase) => handleEdit(data)} />
                <Drawer width={640} title={baseId ? 'Edit item' : "Add article"} onClose={() => dispatch(setDrawer(false))
                } open={drawer}>
                    <Form
                        layout='vertical'
                        size='large'
                        form={form}
                        onFinish={onFinish}
                    >
                        <Row gutter={10}>
                            <Col md={12}>
                                <Form.Item
                                    label="Title"
                                    name="title"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter title'
                                        },
                                        {
                                            max: validationRules.textLength.maxLength,
                                            message: `Title must be at most ${validationRules.textLength.maxLength} characters`
                                        }
                                    ]}
                                >
                                    <Input placeholder='Enter title' maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col md={12}>
                                <Form.Item
                                    label="Category"
                                    name="category"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter title'
                                        }
                                    ]}
                                >
                                    <Select
                                        placeholder="Select category"
                                        allowClear
                                        options={[
                                            { label: 'Getting Started', value: 'Getting Started' },
                                            { label: 'Account Management', value: 'Account Management' },
                                            { label: 'Product Features', value: 'Product Features' },
                                            { label: 'Troubleshooting', value: 'Troubleshooting' },
                                            { label: 'Billing and Payments', value: 'Billing and Payments' },
                                            { label: 'Usage Tips', value: 'Usage Tips' },
                                            { label: 'Updates and Announcements', value: 'Updates and Announcements' },
                                            { label: 'Developer Resources', value: 'Developer Resources' },
                                            { label: 'Policies and Compliance', value: 'Policies and Compliance' },
                                            { label: 'Community and Support', value: 'Community and Support' }
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={24}>
                                <Form.Item
                                    label="Youtube Video Link"
                                    name="youtubeLink"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter a valid YouTube URL'
                                        },
                                        {
                                            pattern: validationRules.youtubeURL.pattern,
                                            message: validationRules.youtubeURL.message
                                        }
                                    ]}
                                >
                                    <Input placeholder='Enter link' style={{ textTransform: 'none' }} />
                                </Form.Item>
                            </Col>
                            <Col md={24}>
                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter Description!'
                                        }

                                    ]}
                                >
                                    <TextEditor
                                        theme="snow"
                                        value={description}
                                        onChange={handleQuillChange}
                                        height={200}
                                        content={''}
                                        handleQuillChange={handleQuillChange}
                                    />

                                </Form.Item>
                            </Col>
                            <Col md={24}>
                                <div style={{ textAlign: 'end' }}>
                                    <Button type='primary' loading={loading} htmlType='submit'>
                                        {loading ? 'Submitting' : 'Submit Article'}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Drawer>
            </div>
        </>
    )
}
