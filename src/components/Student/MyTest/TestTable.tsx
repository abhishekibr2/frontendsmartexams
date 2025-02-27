import { Table, Button, Flex } from 'antd';
import Link from 'next/link';
import { IoReload } from 'react-icons/io5';
import { MdOutlineBarChart } from 'react-icons/md';

interface Test {
    _id?: string;
    subject?: {
        subjectName?: string;
    };
    testDisplayName?: string;
    questions?: any[];
    duration?: string;
    status?: string;
}

interface PackageData {
    packageId?: {
        tests?: Test[];
    };
}

interface TestTableProps {
    packageData: PackageData;
}

const TestTable: React.FC<TestTableProps> = ({ packageData }) => {
    const columns = [
        {
            title: 'ID'.toUpperCase(),
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: 'Subject'.toUpperCase(),
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Test Name'.toUpperCase(),
            dataIndex: 'testName',
            key: 'testName',
        },
        {
            title: 'Questions'.toUpperCase(),
            dataIndex: 'questions',
            key: 'questions'
        },
        {
            title: 'Time'.toUpperCase(),
            dataIndex: 'time',
            key: 'time'
        },
        {
            title: 'Status'.toUpperCase(),
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Action'.toUpperCase(),
            dataIndex: 'action',
            key: 'action'
        },
    ];
    // @ts-ignore
    const dataSource = packageData?.packageId?.tests?.length > 0
        // @ts-ignore
        ? packageData.packageId.tests.map((test: any, index) => ({
            key: test._id || index.toString(),
            id: index + 1,
            subject: test.subject?.subjectName || 'N/A',
            testName: test?.testDisplayName || 'N/A',
            questions: test.questions?.length || 0,
            time: test?.duration || 'N/A',
            // @ts-ignore
            status: test?.testAttempt ? 'Completed' : 'Incomplete',
            action: <Flex gap="small">
                {
                    test.testAttempt ?
                        <>
                            <Link href={`/student/test-report/${test.testAttempt._id}`} passHref>
                                <Button type="link" style={{
                                    color: '#35942F',
                                    border: 'none',
                                    fontSize: '14px',
                                }}
                                    size='small'>
                                    <Flex vertical justify="center" align="center">
                                        <MdOutlineBarChart />
                                        <span>View Result</span>
                                    </Flex>
                                </Button>
                            </Link>
                            <Link href={`/student/test/${test._id}`} passHref>
                                <Button type="link" style={{
                                    color: '#35942F',
                                    border: 'none',
                                    fontSize: '14px',
                                }}
                                    size='small'>
                                    <Flex vertical justify="center" align="center">
                                        <IoReload />
                                        <span>Retake</span>
                                    </Flex>
                                </Button>
                            </Link>
                        </>
                        :
                        <Link href={`/student/test/${test._id}`} passHref>
                            <Button type="link" style={{
                                color: '#35942F',
                                border: 'none',
                                fontSize: '14px',
                            }}
                                size='small'>
                                <Flex vertical justify="center" align="center">
                                    <i className="fa-solid fa-arrow-right" />
                                    <span>Start</span>
                                </Flex>
                            </Button>
                        </Link>
                }
            </Flex>
        }))
        : [];
    // @ts-ignore
    return <Table columns={columns} dataSource={dataSource} pagination={false} bordered />;
};

export default TestTable;
