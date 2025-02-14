"use client";
import React, { useContext, useEffect, useState } from 'react';
import { Col, Row, Button, Input, Modal, Form, message, Select, DatePicker, Spin } from 'antd';
import { addUpdateTodo, getAllTodo, getAllUsers } from '@/lib/commonApi';
import AuthContext from '@/contexts/AuthContext';
import dayjs from 'dayjs';
import moment from 'moment';
import ErrorHandler from '@/lib/ErrorHandler';
import { setShowTodoForm, setTodo, setUsers } from '@/redux/reducers/todoReducer';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
// import Loading from '@/ChatUI/components/Loading';
const { Option } = Select;
import TextEditor from '@/app/commonUl/TextEditor'
import { validationRules } from '@/lib/validations'

const Todo = () => {
    const { user } = useContext(AuthContext);
    const dispatch = useAppDispatch();
    const { todo, users, showTodoForm } = useAppSelector((state: RootState) => state.todoReducer);
    const [form] = Form.useForm();
    const [editTaskId, setEditTaskId] = useState<String | null>();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [defaultSelectedUsers, setDefaultSelectedUsers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [eventType, setEventType] = useState('');
    const [recurrenceType, setRecurrenceType] = useState('');

    const handleQuillChange = (content: string) => {
        form.setFieldsValue({
            description: content
        });
    };

    const handleChange = () => {
        setDropdownVisible(false);
    };

    useEffect(() => {
        fetchAllUsers();
        if (user && user?._id) {
            setLoading(false)
            setDefaultSelectedUsers([user?._id?.toString()])
        }
    }, [user]);

    const initialValues = {
        assignedTo: defaultSelectedUsers,
    };

    useEffect(() => {
        fetchAllTask();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await getAllUsers();
            dispatch(setUsers(response.data));
        } catch (error) {
            ErrorHandler.showNotification(error)
        }
    };

    const fetchAllTask = async () => {
        try {
            const response = await getAllTodo();
            dispatch(setTodo(response.data));
        } catch (error) {
            ErrorHandler.showNotification(error)
        }
    };

    const showModal = () => {
        setEditTaskId(null);
        form.resetFields();
        dispatch(setShowTodoForm(true));
        setEventType('');
        setRecurrenceType('');
    };

    const handleCancel = () => {
        dispatch(setShowTodoForm(false));
        setEventType('');
        setRecurrenceType('');
    };

    const onFinish = async (values: any) => {
        try {
            if (values.recurrenceType) {
                switch (values.recurrenceType) {
                    case 'DAILY':
                        if (values.dateRange[0] && values.dateRange[1]) {
                            const endDate = dayjs(values.dateRange[1]);
                            const untilDate = endDate.endOf('day').format('YYYYMMDD[T]HHmmss[Z]');
                            values.recurrenceDetails = {
                                type: 'DAILY',
                                rule: `RRULE:FREQ=DAILY;UNTIL=${untilDate}`
                            };
                        }
                        break;
                    case 'WEEKLY':
                        if (values.weeklyRecurrence && values.dateRange) {
                            const selectedDays = values.weeklyRecurrence.join(',');
                            const endDate = dayjs(values.dateRange[1]);

                            const untilDate = endDate.endOf('day').format('YYYYMMDD[T]HHmmss[Z]');

                            values.recurrenceDetails = {
                                type: 'WEEKLY',
                                rule: `RRULE:FREQ=WEEKLY;BYDAY=${selectedDays};UNTIL=${untilDate}`,
                            };
                        }
                        break;
                    case 'MONTHLY':
                        if (values.monthlyRecurrenceDay && values.dateRange[0] && values.dateRange[1]) {
                            const dayOfMonth = values.monthlyRecurrenceDay.date();
                            const endDate = dayjs(values.dateRange[1]);
                            const untilDate = endDate.endOf('day').format('YYYYMMDD[T]HHmmss[Z]');
                            values.recurrenceDetails = {
                                type: 'MONTHLY',
                                rule: `RRULE:FREQ=MONTHLY;BYMONTHDAY=${dayOfMonth};UNTIL=${untilDate}`
                            };
                        }
                        break;
                    case 'YEARLY':
                        if (values.yearlyRecurrenceDate && values.dateRange[0] && values.dateRange[1]) {
                            const month = values.yearlyRecurrenceDate.format('MM');
                            const dayOfMonth = values.yearlyRecurrenceDate.format('DD');
                            const endDate = dayjs(values.dateRange[1]);
                            const untilDate = endDate.endOf('day').format('YYYYMMDD[T]HHmmss[Z]');
                            values.recurrenceDetails = {
                                type: 'YEARLY',
                                rule: `RRULE:FREQ=YEARLY;BYMONTH=${month};BYMONTHDAY=${dayOfMonth};UNTIL=${untilDate}`
                            };
                        }
                        break;
                }
            }

            if (editTaskId) {
                values = { ...values, todoId: editTaskId };
            }

            values = { ...values, createdBy: user?._id };
            const res = await addUpdateTodo(values);
            if (res.status == true) {
                message.success(res.message);
                fetchAllTask();
            } else {
                message.error(res.message);
            }
            dispatch(setShowTodoForm(false));
        } catch (error) {
            ErrorHandler.showNotification(error)
        }
    };
    if (!user) {
        // return <Loading />;
    }

    const handleEventTypeChange = (value: string) => {
        setEventType(value);
    };

    const handleRecurrenceTypeChange = (value: string) => {
        setRecurrenceType(value);
    };

    return (
        <>
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin style={{ marginTop: '-20vh' }} />
            </div>
                :
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={24} md={18} lg={18} xl={20} xxl={20}>
                    </Col>
                    <Col sm={24} xs={24} md={6} lg={6} xl={4} xxl={4} className='textEnd'>
                        <Button type='primary' onClick={showModal} >Create New Task</Button>
                    </Col>
                </Row>
            }
            <div style={{ marginTop: '5px' }}></div>
            <Modal
                title="Create New Task"
                open={showTodoForm}
                width={700}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    name="createTask"
                    form={form}
                    onFinish={onFinish}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    initialValues={initialValues}

                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            { required: true, message: 'Please input the title!' },
                            { max: 29, message: 'Title cannot exceed 30 characters!' }
                        ]}
                    >
                        <Input
                            placeholder="Enter task title"
                            onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                let inputValue = target.value;
                                inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

                                if (inputValue.length > 30) {
                                    inputValue = inputValue.slice(0, 30);
                                }
                                target.value = inputValue;
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter Description!'
                            },
                            {
                                max: validationRules.textEditor.maxLength,
                                message: `Description must be at most ${validationRules.textEditor.maxLength} characters`

                            },
                            {
                                min: validationRules.textEditor.minLength,
                                message: `Description must be at least ${validationRules.textEditor.minLength} characters`
                            }

                        ]}
                    >

                        <TextEditor
                            theme="snow"
                            onChange={handleQuillChange}
                            placeholder="Enter forum description here"
                            height={200} handleQuillChange={function (content: string): void {
                                throw new Error('Function not implemented.');
                            }} content={''}
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: 'Please select the Category!' }]}
                            >
                                <Select placeholder="Select Category">
                                    <Option value="personal">Personal</Option>
                                    <Option value="work">Work</Option>
                                    <Option value="health_and_fitness">Health & Fitness</Option>
                                    <Option value="daily_goals">Daily Goals</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Assigned To"
                                name="assignedTo"
                                rules={[{ required: true, message: 'Please select at least one user!' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select users"
                                    maxTagCount="responsive"
                                    style={{ width: '100%' }}
                                    onChange={handleChange}
                                    onDropdownVisibleChange={(open) => setDropdownVisible(open)}
                                    open={dropdownVisible}
                                    value={defaultSelectedUsers}
                                >
                                    {users.map((item) => (
                                        <Option key={item._id} value={item._id && item._id.toString()}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Start Date - Target Date"
                                name="dateRange"
                                rules={[
                                    { required: true, message: 'Please select the date range!' },
                                    () => ({
                                        validator(_, value) {
                                            const startDate = value[0];
                                            const endDate = value[1];
                                            if (startDate && endDate && startDate.isSame(endDate, 'minute')) {
                                                return Promise.reject('Start Date and End Date cannot be the same!');
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker.RangePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    picker="date"
                                    style={{ width: '100%' }}
                                    inputReadOnly
                                    disabledDate={(current) => current && current < moment().startOf('day')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name="status"
                                rules={[{ required: true, message: 'Please select the status!' }]}
                            >
                                <Select placeholder="Select status">
                                    <Option value="pending">Pending</Option>
                                    <Option value="in_progress">In Progress</Option>
                                    <Option value="completed">Completed</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Priority"
                                name="priority"
                                rules={[{ required: true, message: 'Please select the priority!' }]}
                            >
                                <Select placeholder="Select priority">
                                    <Option value="Low">Low</Option>
                                    <Option value="Medium">Medium</Option>
                                    <Option value="High">High</Option>
                                    <Option value="Critical">Critical</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Event Type"
                                name="eventType"
                                rules={[{ required: true, message: 'Please select the event type!' }]}
                            >
                                <Select placeholder="Select event type" onChange={handleEventTypeChange}>
                                    <Option value="One Time">One Time</Option>
                                    <Option value="Recurring">Recurring</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {eventType === 'Recurring' && (
                        <>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Recurrence Type"
                                        name="recurrenceType"
                                        rules={[{ required: true, message: 'Please select the recurrence type!' }]}
                                    >
                                        <Select placeholder="Select recurrence type" onChange={handleRecurrenceTypeChange}>
                                            <Option value="DAILY">Daily</Option>
                                            <Option value="WEEKLY">Weekly</Option>
                                            <Option value="MONTHLY">Monthly</Option>
                                            <Option value="YEARLY">Yearly</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    {recurrenceType === 'DAILY' && (
                                        <></>
                                    )}

                                    {recurrenceType === 'WEEKLY' && (
                                        <Form.Item
                                            label="Weekly Recurrence Rule"
                                            name="weeklyRecurrence"
                                            rules={[{ required: true, message: 'Please input the weekly recurrence rule!' }]}
                                        >
                                            <Select
                                                placeholder="Select days for weekly recurrence"
                                                mode="multiple"
                                                style={{ width: '100%' }}
                                            >
                                                <Select.Option value="MO">Monday</Select.Option>
                                                <Select.Option value="TU">Tuesday</Select.Option>
                                                <Select.Option value="WE">Wednesday</Select.Option>
                                                <Select.Option value="TH">Thursday</Select.Option>
                                                <Select.Option value="FR">Friday</Select.Option>
                                                <Select.Option value="SA">Saturday</Select.Option>
                                                <Select.Option value="SU">Sunday</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    )}

                                    {recurrenceType === 'MONTHLY' && (
                                        <>
                                            <Form.Item
                                                label="Monthly Recurrence Day"
                                                name="monthlyRecurrenceDay"
                                                rules={[{ required: true, message: 'Please select the day for monthly recurrence!' }]}
                                            >
                                                <DatePicker
                                                    placeholder="Select day for monthly recurrence"
                                                    style={{ width: '100%' }}
                                                    picker="date"
                                                    format="DD"
                                                />
                                            </Form.Item>
                                        </>
                                    )}

                                    {recurrenceType === 'YEARLY' && (
                                        <Form.Item
                                            label="Yearly Recurrence Rule - Date"
                                            name="yearlyRecurrenceDate"
                                            rules={[
                                                { type: 'object', required: true, message: 'Please select the date for yearly recurrence!' }
                                            ]}
                                        >
                                            <DatePicker
                                                placeholder="Select date for yearly recurrence"
                                                format="MMMM DD" // Display format showing both month and day
                                                style={{ width: '100%' }}
                                                picker="date" // Use date picker
                                            />
                                        </Form.Item>
                                    )}
                                </Col>
                            </Row>
                        </>
                    )}

                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            {editTaskId ? "Update Todo" : "Create Todo"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );

}

export default Todo;
