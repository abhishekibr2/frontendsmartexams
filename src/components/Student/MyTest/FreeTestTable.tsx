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
    duration?: number;
    status?: string;
}

interface PackageData {
    packageId?: {
        tests?: Test[];
    };
}

interface FreeTestTableProps {
    packageData: PackageData;
}

const FreeTestTable: React.FC<FreeTestTableProps> = ({ packageData }) => {
    const formatDuration = (minutes: number | undefined) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours} hrs ${mins} mins` : `${mins} mins`;
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Test Name',
            dataIndex: 'testName',
            key: 'testName',
        },
        {
            title: 'Questions',
            dataIndex: 'questions',
            key: 'questions',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action'
        },
    ];
    // @ts-ignore
    const dataSource = packageData?.tests?.map((test, index) => ({
        key: test._id || index.toString(),
        id: index + 1,
        subject: test.subject?.subjectName || 'N/A',
        testName: test.testDisplayName || 'N/A',
        questions: test.questions?.length || 0,
        time: formatDuration(test.duration),
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
    })) || [];

    return <Table columns={columns} dataSource={dataSource} pagination={false} bordered />;
};

export default FreeTestTable;
