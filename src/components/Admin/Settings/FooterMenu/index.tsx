import ParaText from '@/app/commonUl/ParaText'
import AuthContext from '@/contexts/AuthContext'
import { addUpdateFooterData } from '@/lib/adminApi'
import ErrorHandler from '@/lib/ErrorHandler'
import { validationRules } from '@/lib/validations'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import { Button, Col, Drawer, Form, Input, message, Row } from 'antd'
import React, { useContext } from 'react'
import { FaPlus } from 'react-icons/fa'
import FooterData from './FooterData'
import { setDrawer, setLoading, setMenuId, setReload } from '@/redux/reducers/footerMenuReducer'

interface Props {
    activeKey: string;
}

interface formValues {
    userId: string | null | undefined
    title: string;
    description: string;
    menuId: string;
}

interface editData {
    link: string;
    order: number;
    _id: string;
    title: string;
    userId: string;
}


export default function FooterMenu({ activeKey }: Props) {
    const { menuId, drawer, loading, reload } = useAppSelector((state: RootState) => state.footerMenuReducer);
    const dispatch = useAppDispatch();

    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const handleItems = () => {
        dispatch(setDrawer(true));
        form.resetFields();
        dispatch(setMenuId(''));
    }

    const onFinish = async (values: formValues) => {
        try {
            dispatch(setLoading(true));
            values.userId = user?._id;
            values.menuId = menuId || '';
            const res = await addUpdateFooterData(values);
            if (res.status == true) {
                message.success(res.message);
                form.resetFields();
                dispatch(setDrawer(false));
                dispatch(setLoading(false));
                dispatch(setReload(!reload));
            }
        } catch (error) {
            dispatch(setLoading(false));
            ErrorHandler.showNotification(error);
        }
    }

    const handleEdit = (data: editData) => {
        dispatch(setMenuId(data._id));
        dispatch(setDrawer(true));
        form.setFieldsValue({
            title: data.title,
            link: data.link,
            order: data.order,
            menuId: data._id,
        });
    };

    return (
        <>
            <div className="smallTopMargin"></div>
            <Row gutter={[24, 24]} align='middle'>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                        Footer Menu
                    </ParaText>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className={'textEnd'}>
                    <Button icon={<FaPlus />} type={'primary'} onClick={handleItems} >
                        Add Item
                    </Button>
                </Col>
            </Row>
            <div className="gapMarginTopOne"></div>
            <FooterData activeKey={activeKey} onEdit={(data: editData) => handleEdit(data)} />
            <Drawer title={menuId ? 'Edit item' : "Add new item"} onClose={() => dispatch(setDrawer(false))} open={drawer}>
                <Form
                    layout='vertical'
                    size='large'
                    form={form}
                    onFinish={onFinish}
                >
                    <Row>
                        <Col md={24}>
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
                                <Input placeholder='Enter title' />
                            </Form.Item>
                        </Col>
                        <Col md={24}>
                            <Form.Item
                                label="Link"
                                name="link"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter link'
                                    },
                                    {
                                        pattern: validationRules.websiteURL.pattern,
                                        message: validationRules.websiteURL.message
                                    }
                                ]}
                            >
                                <Input type='url' placeholder='Enter link' />
                            </Form.Item>
                        </Col>
                        <Col md={24}>
                            <div style={{ textAlign: 'end' }}>
                                <Button type='primary' loading={loading} htmlType='submit'>
                                    {loading ? 'Submitting' : 'Submit Item'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    )
}
