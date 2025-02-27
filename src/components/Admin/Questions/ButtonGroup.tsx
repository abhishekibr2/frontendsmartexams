import { Button, Checkbox, Col, Collapse, Divider, Flex, message, Popconfirm, Row, Tooltip, Typography } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import AddQuestionInTestModal from '../AddQuestionInTestModal';
import { QuestionAndComprehension, Test } from '@/lib/types';
import dateFormat from "dateformat";
import { usePathname, useSearchParams } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';

interface ButtonGroupProps {
    item: any;
    reload: boolean;
    setReload: (reload: boolean) => void;
    showAnswerButton?: boolean;
    showDuplicateButton?: boolean;
    testId?: string;
    existingQuestionIds?: string[];
    showAllAnswer?: boolean;
}

export default function ButtonGroup({
    item,
    reload,
    setReload,
    showAnswerButton = true,
    testId,
    existingQuestionIds = [],
    showAllAnswer = false
}: ButtonGroupProps) {
    const { user } = useContext(AuthContext)
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState<QuestionAndComprehension>();
    const [expandedAnswers, setExpandedAnswers] = useState<{ [key: string]: boolean }>({});
    const [expandedTests, setExpandedTests] = useState<{ [key: string]: boolean }>({});
    const [tests, setTests] = useState<Test[]>([]);
    const [addedIds, setAddedIds] = useState<string[]>(existingQuestionIds)
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const pathname = usePathname();
    console.log('pathname: ', pathname)
    const page = searchParams.get('page')
    const roleName = user?.roleId?.roleName;
    const handleUsedIn = async (questionId: string) => {
        try {
            const response = await axios.get(`/admin/question/usedin/${questionId}`);
            const data = response.data.data;

            if (data.length === 0) {
                message.info('This question is not currently assigned to any test.');
            } else {
                setTests(data);
                setExpandedTests((prevState) => ({
                    ...prevState,
                    [questionId]: !prevState[questionId],
                }));
                setExpandedAnswers((prevState) => ({
                    ...prevState,
                    [questionId]: false,
                }));
            }
        } catch (error) {
            console.error("Error fetching test data:", error);
            message.error('An error occurred while fetching test data. Please try again later.');
        }
    };

    const handleAnswerClick = (questionId: string) => {
        setExpandedAnswers((prevState) => ({
            ...prevState,
            [questionId]: !prevState[questionId],
        }));
    };

    const handleDelete = async (questionId: string): Promise<void> => {
        try {
            const response = await axios.delete(`/admin/question/${questionId}`);

            const updatedStatus = response.data.updatedQuestion.status;
            const successMessage =
                updatedStatus === 'deleted'
                    ? 'Question successfully marked as deleted'
                    : 'Question successfully restored';
            setReload(!reload);
            message.success(successMessage);
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'An unknown error occurred';
            message.error(errorMessage);
        }
    };

    const handleArchive = async (questionId: string): Promise<void> => {
        try {
            const response = await axios.patch(`/admin/question/${questionId}/archive`);

            const isArchived = response.data.updatedQuestion.isArchived;
            const successMessage = isArchived
                ? 'Question successfully archived'
                : 'Question successfully unarchived';
            setReload(!reload);
            message.success(successMessage);
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'An unknown error occurred';
            message.error(errorMessage);
        }
    };

    const handleDuplicate = async (questionId: string): Promise<void> => {
        try {
            const response = await axios.post(`/admin/question/${questionId}/duplicate`);
            setReload(!reload);
            const newQuestionId = response.data.duplicatedQuestion._id;
            router.push(`/${user?.roleId.roleName}/question/${newQuestionId}`);

            message.success('Question duplicated successfully. You can now edit the duplicated question.');
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'An unknown error occurred';
            message.error(errorMessage);
        }
    };

    const handleToggleQuestionClick = (questionId: string) => {
        setLoading(true)
        const questionIds = [...addedIds];

        if (addedIds.includes(questionId)) {
            onRemoveQuestion(testId || '', questionId);
            setAddedIds(questionIds.filter(id => id !== questionId));
            setReload(!reload)
        } else {
            onFinish(testId || '', questionId);
        }
        setLoading(false)
    };

    const onFinish = async (testId: string, questionId: string) => {
        try {
            const questionIds = [...addedIds];
            const response = await axios.post('/admin/test/assignQuestions', {
                testIds: [testId],
                questionId,
                questionType: item?.questionType ? item?.questionType : 'comprehension'
            });
            const data = response.data
            if (data.success === false) {
                message.error(data.message)
                return
            }
            setReload(!reload)
            questionIds.push(questionId);
            setAddedIds(questionIds);
            message.success('Question added to the test.');
        } catch (error) {
            console.error('Error assigning question:', error);
        }
    };

    const onRemoveQuestion = async (testId: string, questionId: string) => {
        try {
            await axios.post('/admin/test/removeQuestion', {
                testIds: [testId],
                questionId,
            });
            message.success('Question removed from the test.');
        } catch (error) {
            console.error('Error removing question:', error);
        }
    };

    const takeOwnership = async (questionId: string) => {
        try {
            await axios.get(`/admin/question/ownership/${questionId}`);
            setReload(!reload)
            message.success('Question ownership transferred successfully.');
        } catch (error) {
            message.error('An error occurred while transferring ownership. Please try again later.');
        }
    }

    return (
        <React.Fragment>
            <Flex align='center' justify='space-between'>
                <Flex gap="small" wrap>
                    {showAnswerButton &&
                        <Button
                            size="large"
                            type={showAllAnswer || expandedAnswers[item._id] ? 'primary' : 'default'}
                            onClick={() => handleAnswerClick(item._id)}
                        >
                            Answer
                        </Button>
                    }
                    <Link href={`/${user?.roleId.roleName}/question/${item._id}?page=${page}`}>
                        <Button size="large">Edit</Button>
                    </Link>
                    {
                        !testId &&
                        <>
                            <Popconfirm
                                title="Are you sure you want to duplicate this question?"
                                onConfirm={() => handleDuplicate(item._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button size="large">Duplicate</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Are you sure you want to delete this question?"
                                onConfirm={() => handleDelete(item._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button size="large">Delete</Button>
                            </Popconfirm>
                            {
                                user?.roleId.roleName === 'admin' &&
                                <Popconfirm
                                    title="Are you sure you want to archive this question?"
                                    onConfirm={() => handleArchive(item._id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button size="large">{item.isArchived ? 'Unarchive' : 'Archive'}</Button>
                                </Popconfirm>
                            }
                        </>
                    }
                    {
                        user?.roleId.roleName === 'admin' &&
                        <React.Fragment>
                            <Button
                                size="large"
                                type={expandedTests[item._id] ? 'primary' : 'default'}
                                onClick={() => handleUsedIn(item._id)}
                            >
                                Used In
                            </Button>
                            {
                                testId && !pathname.includes('/reorder') && (
                                    <Button size="large" onClick={() => { setQuestion(item); setOpen(true); }}>
                                        Add Question to Test
                                    </Button>
                                )
                            }

                        </React.Fragment>
                    }
                </Flex>
                {testId && (
                    <Button
                        color={`${addedIds.includes(item._id) || existingQuestionIds.includes(item._id) ? 'danger' : 'primary'}`}
                        variant="outlined"
                        type={addedIds.includes(item._id) || existingQuestionIds.includes(item._id) ? "primary" : "default"}
                        size="large"
                        loading={loading}
                        onClick={() => handleToggleQuestionClick(item._id)}
                        style={{
                            color: addedIds.includes(item._id) || existingQuestionIds.includes(item._id) ? '' : '#3EB07D',
                            borderColor: addedIds.includes(item._id) || existingQuestionIds.includes(item._id) ? '' : '#3EB07D'
                        }}
                    >
                        {addedIds.includes(item._id) || existingQuestionIds.includes(item._id) ? 'Remove Question from the Test' : 'Add Question to the Test'}
                    </Button>
                )}
                {
                    user?.roleId.roleName === 'admin' && item.ownership === 'operator' &&
                    <Button
                        style={{
                            color: '#3EB07D',
                            borderColor: '#3EB07D'
                        }}
                        size="large"
                        onClick={() => takeOwnership(item._id)}
                    >
                        Take Ownership
                    </Button>
                }
            </Flex>
            <Collapse
                className="filter-collapse"
                activeKey={showAllAnswer || expandedAnswers[item._id] ? [item._id] : []}
                ghost
            >
                <Collapse.Panel header="" showArrow={false} key={item._id}>
                    <Divider />
                    <Typography.Title level={5}>Question Options</Typography.Title>
                    <Row>
                        <Col xxl={24} xl={24} md={24} sm={24} xs={24}>
                            <Flex gap="small" wrap className="mt-2" vertical>
                                {item.questionOptions?.map((option: any, index: number) => (
                                    <Button
                                        key={option._id}
                                        type={option.isCorrect ? 'primary' : 'default'}
                                        style={{
                                            color: option.isCorrect ? 'white' : '#333',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            height: 'auto',
                                            width: '100%',
                                            textAlign: 'left',
                                            flexWrap: 'nowrap',
                                            padding: '8px',
                                        }}
                                        size="large"
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    minWidth: '30px',
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {String.fromCharCode(65 + index)}.
                                            </div>
                                            <div
                                                className="option-with-answer"
                                                style={{
                                                    flex: 1,
                                                    marginLeft: '8px',
                                                    whiteSpace: 'normal',
                                                    overflowWrap: 'break-word',
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: option.title }} />
                                            </div>
                                            <div
                                                style={{
                                                    marginLeft: '8px',
                                                }}
                                            >
                                                <Checkbox
                                                    checked={option.isCorrect}
                                                    disabled={!option.isCorrect}
                                                />
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </Flex>

                            <Divider />
                        </Col>
                        <Col xxl={24} xl={24} md={24} sm={24} xs={24}></Col>
                        <Col xxl={6} xl={6} md={6} sm={24} xs={24}>
                            <Flex
                                justify='space-between'
                            >
                                <Flex vertical>
                                    <Typography.Text type='secondary'>
                                        Question Type:
                                    </Typography.Text>
                                    <Typography.Text type='secondary'>
                                        Date added:
                                    </Typography.Text>
                                    <Typography.Text type='secondary'>
                                        Last Modified:
                                    </Typography.Text>
                                    <Typography.Text type='secondary'>
                                        QID#:
                                    </Typography.Text>
                                </Flex>
                                <Flex
                                    vertical
                                    justify='flex-end'
                                    style={{
                                        textAlign: 'right'
                                    }}>
                                    <Typography.Text type='secondary'>
                                        {item.questionType}
                                    </Typography.Text>
                                    <Typography.Text type='secondary'>
                                        {dateFormat(item.createdAt, "ddd, dS mmm, yyyy")}
                                    </Typography.Text>
                                    <Typography.Text type='secondary'>
                                        {dateFormat(item.updatedAt, "ddd, dS mmm, yyyy")}
                                    </Typography.Text>
                                    <Typography.Text type='secondary'>
                                        {item._id}
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </Col>
                    </Row>
                </Collapse.Panel>
            </Collapse>
            <Collapse
                className="filter-collapse"
                activeKey={expandedTests[item._id] ? [item._id] : []}
                ghost
            >
                <Collapse.Panel header="" showArrow={false} key={item._id}>
                    <Divider />
                    <Typography.Title level={5} type="secondary">
                        This Question Is Assigned to These Tests
                    </Typography.Title>
                    {tests?.map((test, index: number) => (
                        <Flex gap={'small'} key={test._id}>
                            <Typography.Title level={5} type='secondary'>
                                {index + 1}:
                            </Typography.Title>
                            <Tooltip title={`View Test ${test.testDisplayName}`} placement='right'>
                                <Link href={`/${roleName}/test/${test._id}`} target='_blank'>
                                    <Typography.Text type='secondary'>
                                        {test.testDisplayName}
                                    </Typography.Text>
                                </Link>
                            </Tooltip>
                        </Flex>
                    ))}
                </Collapse.Panel>
            </Collapse>
            <AddQuestionInTestModal testId={tests.map((test) => { return test._id })} setOpen={setOpen} question={question} open={open} />
        </React.Fragment>
    );
}
