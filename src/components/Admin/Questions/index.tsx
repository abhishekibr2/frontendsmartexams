'use client'
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
    Button,
    Col,
    Row,
    Card,
    List,
    Typography,
    Pagination,
    Flex,
    Select,
    Form,
    MenuProps,
    Dropdown,
    message,
    Tooltip,
    Modal,
    Collapse,
    CollapseProps
} from 'antd';
import dateFormat from "dateformat";
import { QuestionAndComprehension, Test } from '@/lib/types';
import LayoutWrapper from '@/app/commonUl/LayoutWrapper';
import FilterQuestion from './FilterForm';
import QuestionListItem from '../QuestionListItem';
import ComprehensionList from './ComprehensionList';
import { BiCollapseVertical, BiExpandVertical } from 'react-icons/bi';
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import './style.css';
import { useSearchParams } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
import ExportQuestion from '../ExportQuestion';
import { PlusOutlined } from '@ant-design/icons';
import RichText from '@/commonUI/RichText';
import { createTest } from '@/lib/adminApi';


type QuestionType = '' | 'multipleResponse' | 'trueFalse' | 'multipleChoice' | 'comprehension';

interface QuestionsProps {
    testId?: string;
    existingQuestionIds?: string[];
    showOnlyTestQuestion?: boolean;
    title?: string;
    showFilter?: boolean;
    showIntroCard?: boolean;
}

export default function Questions({
    testId,
    existingQuestionIds,
    showOnlyTestQuestion = false,
    title = 'Question Bank',
    showFilter = true,
    showIntroCard = false
}: QuestionsProps) {
    const { user } = useContext(AuthContext)
    const [questions, setQuestions] = useState<QuestionAndComprehension[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [questionType, setQuestionType] = useState<QuestionType>('');
    const [pageSize, setPageSize] = useState<number>(10);
    const [reload, setReload] = useState<boolean>(false)
    const [showAllAnswer, setShowAllAnswer] = useState(false)
    const [test, setTest] = useState<Test>()
    const [activeKey, setActiveKey] = useState<string[]>([]);
    const [addedIds, setAddedIds] = useState<string[]>([])
    const [filterForm] = Form.useForm();
    const router = useRouter();
    const [form] = Form.useForm();
    const searchParams = useSearchParams()
    const page = searchParams.get('page')
    const [Params, setParams] = useState<any>()
    const [isModalVisible, setIsModalVisible] = useState(false);

    // const showModal = () => {
    //     setIsModalVisible(true);
    // };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const fetchQuestions = async (page = 1, limit = pageSize, questionType: QuestionType = '') => {
        try {
            const response = await axios.get(`/admin/question`, {
                params: {
                    filterQuery: filterForm.getFieldsValue(),
                    page,
                    limit,
                    questionType,
                    testId,
                    showOnlyTestQuestion
                }
            });

            const { questions, currentPage, totalQuestions } = response.data;

            setQuestions(questions);
            setTotalQuestions(totalQuestions);
            const addedIds = questions
                .filter((item: any) => item.ownership === 'operator')
                .map((item: any) => item._id);
            setAddedIds(addedIds);
            setCurrentPage(currentPage);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const getTestQuestions = async (id: string) => {
        try {
            const response = await axios.get(`/admin/test/${id}/questions`);
            const test = response.data.data
            const normalizedData = test.questions.map((item: any) => ({
                ...item,
                questionType: item.paragraph ? 'comprehension' : item.questionType,
            }));
            setTest(test)
            setQuestions(normalizedData);
        } catch (error) {
            console.error('Error fetching test questions:', error);
        }
    };

    useEffect(() => {
        if (showOnlyTestQuestion && testId) {
            getTestQuestions(testId)
        } else {
            fetchQuestions(parseInt(page || '1'), pageSize, questionType);
        }
    }, [currentPage, questionType, pageSize, reload, showOnlyTestQuestion, testId, page]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        router.push(`?page=${page}`, undefined, { shallow: true });
    };

    const handlePageSizeChange = (value: number) => {
        setPageSize(value);
        setCurrentPage(1);
        router.push(`?page=1`, undefined, { shallow: true });
    };

    const addQuestionItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Link href={`/${user?.roleId.roleName}/question/create`}>
                    Add new question
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link href={`/${user?.roleId.roleName}/question/import/excel`}>
                    Import spreadsheet(.CSV)
                </Link>
            ),
        },
        {
            key: '3',
            label: (
                <Link href={`/${user?.roleId.roleName}/question/import/docx`}>
                    Import word
                </Link>
            ),
        }
    ]

    const exportQuestions = async () => {

        const data = {
            filterQuery: filterForm.getFieldsValue(),
            page,
            pageSize,
            questionType,
            testId,
            showOnlyTestQuestion,
        }
        setParams(data)
        setIsModalVisible(true);
    };

    const actionItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span style={{ cursor: 'pointer' }} onClick={exportQuestions}>
                    Export question
                </span>

            ),
        }
    ];

    const takeBulkOwnership = async () => {
        try {
            if (addedIds.length === 0) {
                message.warning('No questions available on this page.');
                return;
            }
            await axios.post('/admin/question/ownership/bulk', {
                questionIds: addedIds,
            });
            setReload(!reload)
            message.success('Question ownership transferred successfully.');
        } catch (error) {
            message.error('An error occurred while transferring ownership. Please try again later.');
        }
    }

    const onIntroSubmit = async (values: any) => {
        try {
            const test = await createTest({
                introduction: values.introduction,
                testId: testId
            })
            setReload(!reload)
            setActiveKey(['0']);
            message.success(test.message);
        } catch (error) {
            message.error("Failed to save introduction. Please try again.");
        }
    }

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: <Button size='large' icon={<PlusOutlined />}>{test?.introduction ? 'Edit Introduction' : 'Add Introduction'}</Button>,
            children: <React.Fragment>
                <Form
                    layout='vertical'
                    size='large'
                    className='mt-2'
                    onFinish={onIntroSubmit}
                    form={form}
                >
                    <Form.Item name={'introduction'} label='Introduction text will be displayed before Users start this Test. Introduction text is optional.'>
                        <RichText
                            onChange={(value) => {
                                form.setFieldsValue({
                                    introduction: value
                                })
                            }}
                            editorValue={test?.introduction}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Flex gap={'small'} align='center'>
                            <Button type='primary' size='large' htmlType='submit'>
                                Save
                            </Button>
                            <Button size='large' htmlType='reset'>
                                Close
                            </Button>
                        </Flex>
                    </Form.Item>
                </Form>
            </React.Fragment>,
            showArrow: false,
        }
    ]

    return (

        <Row gutter={0} className="questions-wrapper" align="middle">
            <Modal
                title={<Typography.Title level={2} className="page-title" style={{ fontWeight: 400 }}>
                    {questionType}
                </Typography.Title>}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <ExportQuestion params={Params} handleCancel={handleCancel} />
            </Modal>
            <Col lg={12} xl={12} xxl={12} md={12} sm={24} xs={24}>
                <Typography.Title
                    level={2}
                    className="top-title m-0"
                    style={{
                        fontWeight: 400,
                    }}>
                    {title}
                </Typography.Title>
            </Col>
            <Col lg={12} xl={12} xxl={12} md={12} sm={24} xs={24}>
                {!testId &&
                    <Flex justify='flex-end' gap={'large'} align='center'>
                        <Dropdown menu={{ items: addQuestionItems }} placement="bottomRight" arrow>
                            <Button type='primary' size='large'>
                                Add Question
                            </Button>
                        </Dropdown>
                        <Dropdown menu={{ items: actionItems }} placement="bottomRight" arrow>
                            <Button size='large'>
                                Actions
                            </Button>
                        </Dropdown>
                    </Flex>
                }
            </Col>
            <Col
                span={24}
                className='mt-2'
            >
                {
                    showIntroCard &&
                    <Card
                        title={
                            <>
                                Test Introduction <Typography.Text type='secondary'>Optional</Typography.Text>
                            </>
                        }
                    >
                        {test?.introduction &&
                            <div className='mb-3'>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: test?.introduction || '',
                                    }}
                                />
                            </div>

                        }
                        <Collapse activeKey={activeKey}
                            onChange={(keys) => setActiveKey(keys as string[])} ghost items={items} />
                    </Card>
                }
            </Col>
            <Col span={24} className='mt-2'>
                <LayoutWrapper>
                    <Row gutter={[24, 10]} align={'middle'}>
                        {
                            showFilter &&
                            <>
                                <Col xl={12}>
                                    <Flex gap={'small'} className='w-100'>
                                        <Form.Item label={' '} layout='vertical'>
                                            <Tooltip title={`${showAllAnswer ? 'Hide answer' : 'Show answer'}`}>
                                                <Button
                                                    size='large'
                                                    color="default"
                                                    variant="outlined"
                                                    style={{
                                                        color: '#000'
                                                    }}
                                                    onClick={() => setShowAllAnswer(!showAllAnswer)}
                                                >
                                                    {
                                                        !showAllAnswer ?
                                                            <BiExpandVertical />
                                                            :
                                                            <BiCollapseVertical />
                                                    }
                                                </Button>
                                            </Tooltip>
                                        </Form.Item>
                                        <Form.Item layout='vertical' label="Question type" className='fw-semi-bold  label-color-black w-75'>
                                            <Select
                                                value={questionType}
                                                size='large'
                                                style={{ width: '100%' }}
                                                className='w-100'
                                                placeholder={'Please select'}
                                                onChange={(value: QuestionType) => setQuestionType(value)}
                                                options={[
                                                    {
                                                        label: 'All-Multiple, Response and True-False',
                                                        value: '',
                                                    },
                                                    {
                                                        label: 'Multiple-Choice',
                                                        value: 'multipleChoice',
                                                    },
                                                    {
                                                        label: 'Multiple-Response',
                                                        value: 'multipleResponse',
                                                    },
                                                    {
                                                        label: 'True-False',
                                                        value: 'trueFalse',
                                                    },
                                                    {
                                                        label: 'Reading Comprehension',
                                                        value: 'comprehension',
                                                    },
                                                ]}
                                            />
                                        </Form.Item>
                                    </Flex>
                                </Col>
                                <FilterQuestion addedIds={addedIds} filterForm={filterForm} setReload={setReload} reload={reload} takeBulkOwnership={takeBulkOwnership} />
                            </>
                        }
                        <Col span={24}>
                            <Flex align='baseline' justify='space-between' className='mb-2'>
                                <Typography.Paragraph className='m-0'>
                                    {test?.questionOrder?.length ? (
                                        <>
                                            Questions {test?.questionOrder?.length} of {test?.maxQuestions} (Remaining to be added : {Math.abs(test?.questionOrder?.length - test?.maxQuestions) || 0})
                                        </>
                                    ) : (
                                        <>
                                            Total Questions: {totalQuestions || 0}
                                        </>
                                    )}
                                </Typography.Paragraph>


                                {
                                    !showOnlyTestQuestion &&
                                    <Pagination
                                        current={currentPage}
                                        showSizeChanger
                                        pageSizeOptions={[
                                            5,
                                            10,
                                            20,
                                            50,
                                            100
                                        ]}
                                        total={totalQuestions}
                                        pageSize={pageSize}
                                        onChange={handlePageChange}
                                        onShowSizeChange={(_, size) => handlePageSizeChange(size)}
                                    />
                                }
                            </Flex>
                            <List
                                grid={{
                                    gutter: 16,
                                    xs: 1,
                                    sm: 1,
                                    md: 1,
                                    lg: 1,
                                    xl: 1,
                                    xxl: 1,
                                }}
                                dataSource={questions}
                                renderItem={(item, index: number) => (
                                    <List.Item style={{ width: '100%' }}>
                                        <Card
                                            style={{
                                                width: '100%',
                                            }}
                                            title={
                                                <Flex justify="space-between" align='center'>
                                                    <span>{`${questionType === 'comprehension' || item?.paragraph
                                                        ? 'Comprehension Paragraph'
                                                        : 'Question'
                                                        } ${(currentPage - 1) * pageSize + index + 1
                                                        }`}</span>
                                                    <Flex justify='space-between' align='center' gap={'large'}>
                                                        <Typography.Text type='secondary'>
                                                            Date added: {dateFormat(item.createdAt, "ddd, dS mmm, yyyy")}
                                                        </Typography.Text>
                                                        <Typography.Text type='secondary' className='m-0'>
                                                            Topic: {item.topic}
                                                        </Typography.Text>
                                                        <Typography.Text type='secondary'>
                                                            Sub topic: {item.subTopic}
                                                        </Typography.Text>
                                                        <Flex
                                                            justify='flex-end'
                                                            vertical
                                                            style={{
                                                                textAlign: 'right'
                                                            }}>
                                                            <Typography.Paragraph
                                                                type="secondary"
                                                                copyable={{ text: item._id }}
                                                                className='m-0'
                                                            >
                                                                {
                                                                    questionType === 'comprehension' || item?.paragraph
                                                                        ? 'Comprehension'
                                                                        : 'Question'}{' '}
                                                                ID: {item._id.slice(18, 24)
                                                                }
                                                            </Typography.Paragraph>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            }
                                        >
                                            {questionType === 'comprehension' || item?.paragraph ? (
                                                <ComprehensionList
                                                    item={item}
                                                    setReload={setReload}
                                                    reload={reload}
                                                    testId={testId}
                                                    existingQuestionIds={existingQuestionIds || test?.questionOrder}
                                                    showAllAnswer={showAllAnswer}
                                                />
                                            ) : (
                                                <QuestionListItem
                                                    item={item}
                                                    setReload={setReload}
                                                    reload={reload}
                                                    testId={testId}
                                                    existingQuestionIds={existingQuestionIds || test?.questionOrder}
                                                    showAllAnswer={showAllAnswer}
                                                />
                                            )}
                                        </Card>
                                    </List.Item>
                                )}
                            />
                            <Flex justify='flex-end'>
                                {
                                    !showOnlyTestQuestion &&
                                    <Pagination
                                        current={currentPage}
                                        showSizeChanger
                                        pageSizeOptions={[
                                            5,
                                            10,
                                            20,
                                            50,
                                            100
                                        ]}
                                        total={totalQuestions}
                                        pageSize={pageSize}
                                        onChange={handlePageChange}
                                        onShowSizeChange={(_, size) => handlePageSizeChange(size)}
                                    />
                                }
                            </Flex>
                        </Col>
                    </Row>
                </LayoutWrapper>
            </Col>
        </Row >
    );
}
