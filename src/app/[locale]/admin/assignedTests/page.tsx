'use client';
import { Table, Row, Col, Select, Input, Avatar, message } from 'antd';
import AuthContext from '@/contexts/AuthContext';
import { GetAllPackages, getAllExamType, getAllGrades, getAllSubjects, getAllTestConducted } from '@/lib/adminApi';
import { useContext, useEffect, useState } from 'react';
import { Button, Space } from 'antd';
import { useAppSelector } from '@/redux/hooks';
import { setExamType } from '@/redux/reducers/examReducer';
import { useDispatch } from 'react-redux';
import ErrorHandler from '@/lib/ErrorHandler';
import { setGrades } from '@/redux/reducers/gradeReducer';
import { getCommonStates } from '@/lib/commonApi';
import { setServices } from '@/redux/reducers/serviceReducer';
import { setTestConductBy, setMatchedPackageIds } from '@/redux/reducers/testConductedByReducer';
const { Option } = Select;
import { GoCode } from "react-icons/go";
import { SearchOutlined } from '@ant-design/icons';
import { setSubjects } from '@/redux/reducers/subjectReducer';
import { FaCheck, FaRegCircle } from "react-icons/fa";
import { useRouter, useSearchParams } from 'next/navigation';
import { AssignPackage } from '@/lib/adminApi';
import { IoMdArrowRoundBack } from "react-icons/io";

interface Package {
    [x: string]: any;
    duration: string;
    subjects: any;
    testType: string;
    active: string;
    qualityChecked: string;
    published: string;
    _id: string;
    packageName: string;
    examType: string;
    testConductedBy: string;
    state: string;
    grade: string;
    numTests: number;
    packagePrice: number;
    assignTest: { testId: string | null }[];
}
interface FilterCriteria {
    searchQuery: string;
    duration: string;
    examType: string;
    grade: string;
    subjects: string[];
    testType: string;
    state: string;
    active: string;
    qualityChecked: string;
    published: string;
    testConductedBy: string;
}

export default function Page() {
    const { user } = useContext(AuthContext);
    const [newPackages, setPackages] = useState<Package[]>([]);
    const examTypes = useAppSelector((state) => state.examTypeReducer.examTypes);
    const grades = useAppSelector((state) => state.gradeReducer.grades);
    const services = useAppSelector((state) => state.serviceReducer.services);
    const matchedPackageIds = useAppSelector((state) => state.testConductedByReducer.matchedPackageIds);
    const testConductedBy = useAppSelector((state) => state.testConductedByReducer.testConductBy);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const dispatch = useDispatch();
    const [clicked, setClicked] = useState(false)
    const subject = useAppSelector((state) => state.subjectReducer.subjects);
    const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const router = useRouter();
    const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);
    const roleName = user?.roleId?.roleName;
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
        searchQuery: '',
        duration: '',
        examType: '',
        grade: '',
        subjects: [],
        testType: '',
        state: '',
        active: '',
        qualityChecked: '',
        published: '',
        testConductedBy: ''
    });
    const paramsId = useSearchParams();
    const testid = paramsId.get('TestId');

    useEffect(() => {
        if (testid) {
            GetAllPackages();
        } else {
            router.push(`/${roleName}/test`)
        }
    }, [testid])

    const applyFilters = () => {
        let filtered = newPackages.filter((pkg) => {
            const matchesSearch = filterCriteria.searchQuery && pkg.packageName.toLowerCase().includes(filterCriteria.searchQuery.toLowerCase());
            const matchesDuration = filterCriteria.duration ? pkg.duration === filterCriteria.duration : false;
            const matchesExamType = filterCriteria.examType ? pkg.examType === filterCriteria.examType : false;
            const matchesGrade = filterCriteria.grade ? pkg.grade === filterCriteria.grade : false;
            const matchesSubjects = filterCriteria.subjects && filterCriteria.subjects.length > 0
                ? filterCriteria.subjects.some((subject) => pkg.subjects && pkg.subjects.includes(subject))
                : true;
            const matchesTestType = filterCriteria.testType ? pkg.testType === filterCriteria.testType : false;
            const matchesState = filterCriteria.state ? pkg.state === filterCriteria.state : false;
            const matchesActive = filterCriteria.active ? pkg.active === filterCriteria.active : false;
            const matchesQualityChecked = filterCriteria.qualityChecked ? pkg.qualityChecked === filterCriteria.qualityChecked : false;
            const matchesPublished = filterCriteria.published ? pkg.published === filterCriteria.published : false;
            const matchesTestConductedBy = filterCriteria.testConductedBy ? pkg.testConductedBy === filterCriteria.testConductedBy : false;

            return (
                matchesSearch ||
                matchesDuration ||
                matchesExamType ||
                matchesGrade ||
                // matchesSubjects ||
                matchesTestType ||
                matchesState ||
                matchesActive ||
                matchesQualityChecked ||
                matchesPublished ||
                matchesTestConductedBy
            );
        });

        setFilteredPackages(filtered);
    };

    const handleFilterChange = (key: keyof FilterCriteria, value: string | string[]) => {
        setFilterCriteria((prevCriteria) => {
            const newCriteria = { ...prevCriteria, [key]: value };
            return newCriteria;
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterCriteria((prevCriteria) => ({
            ...prevCriteria,
            searchQuery: e.target.value,
        }));
    };

    const clearFilters = () => {
        setFilterCriteria({
            searchQuery: '',
            duration: '',
            examType: '',
            grade: '',
            subjects: [],
            testType: '',
            state: '',
            active: '',
            qualityChecked: '',
            published: '',
            testConductedBy: ''
        });

        setFilteredPackages(newPackages);
    };

    const getAllGradesData = async () => {
        try {
            const res = await getAllGrades();
            if (res.status === true) {
                dispatch(setGrades(res.data));
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const getExam = async () => {
        try {
            const res = await getAllExamType();
            if (res.status === true) {
                dispatch(setExamType(res.data));
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };
    const packages = async () => {
        const response = await GetAllPackages();
        if (response) {
            setPackages(response.data);
            setFilteredPackages(response.data);
        }
    };
    async function fetchData() {
        try {
            const res = await getCommonStates();
            if (res.status === true) {
                dispatch(setServices(res.data));
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }
    async function getTests() {
        try {
            const res = await getAllTestConducted();
            if (res.status === true) {
                dispatch(setTestConductBy(res.data));
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }
    async function subjects() {
        try {
            const res = await getAllSubjects();
            if (res.status === true) {
                dispatch(setSubjects(res.data));
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }


    useEffect(() => {
        const fetchFunctions = async () => {
            await getExam();
            await packages();
            await getAllGradesData();
            await fetchData();
            await getTests();
            await subjects();
            packages();
        }
        fetchFunctions();
    }, [user])


    const handleSubmitAssignPackages = async () => {
        if (!selectedPackages) {
            message.error('Please select a package to assign');
            return;
        }
        const data = {
            packageId: matchedPackageIds,
            testId: testid
        };

        try {
            const response = await AssignPackage(data);
            if (response && response.status) {
                message.success(`${response.message}`);
                setSelectedPackage(null);
            } else {
                message.error(response.message || 'An error occurred while assigning the package');
            }
        } catch (error) {
            message.error('This Package is already exists', 3);

        }
    };


    useEffect(() => {
        const matchedPackages = filteredPackages.filter(pkg =>
            pkg.assignTest.some((assign: { testId: string | null }) => assign.testId === testid)
        );

        if (matchedPackages.length > 0) {
            const matchedPackageIds = matchedPackages.map(pkg => pkg._id);
            dispatch(setMatchedPackageIds(matchedPackageIds));
        } else {
            dispatch(setMatchedPackageIds([]));
        }
    }, [filteredPackages, testid, dispatch]);



    const toggleSelection = (id: string) => {
        if (selectedId === id) {
            setSelectedId(null);
            dispatch(setMatchedPackageIds([]));
        } else {
            setSelectedId(id);
            dispatch(setMatchedPackageIds([id]));
        }
    };

    const columns = [
        {
            title: 'Action',
            dataIndex: 'index',
            key: 'index',
            render: (_: string, record: Package) => {
                const isMatched = matchedPackageIds.includes(record._id);
                return (
                    <div
                        onClick={() => toggleSelection(record._id)}
                        style={{
                            cursor: 'pointer',
                            backgroundColor: isMatched ? 'black' : 'transparent',
                            borderRadius: '50%',
                            padding: '5px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '20px',
                            height: '20px',
                            lineHeight: '30px',
                            transition: 'background-color 0.2s ease',
                        }}
                    >
                        {isMatched ? (
                            <FaCheck style={{ color: 'white' }} />
                        ) : (
                            <FaRegCircle style={{ color: 'black' }} />
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Package Name',
            dataIndex: 'packageName',
            key: 'packageName',
            sorter: (a: Package, b: Package) =>
                (a.packageName || '').localeCompare(b.packageName || ''),
            render: (text: string) => (
                <div
                    style={{
                        wordWrap: 'break-word',
                        whiteSpace: 'normal',
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: 'EXAM TYPE',
            dataIndex: 'examType',
            key: 'examType',
            sorter: (a: Package, b: Package) =>
                (a.examType || '').localeCompare(b.examType || ''),
            render: (text: Package) => text.examType || 'N/A',
        },
        {
            title: 'TEST CONDUCTED BY',
            dataIndex: 'testConductedBy',
            key: 'testConductedBy',
            render: (text: Package) => text.name || 'N/A',
        },
        {
            title: 'STATE',
            dataIndex: 'state',
            key: 'state',
            sorter: (a: Package, b: Package) =>
                (a.state || '').localeCompare(b.state || ''),
            render: (text: Package) => text.title || 'N/A',
        },
        {
            title: 'GRADE',
            dataIndex: 'grade',
            key: 'grade',
            sorter: (a: Package, b: Package) =>
                (a.grade || '').localeCompare(b.grade || ''),
            render: (text: Package) => text.gradeLevel || 'N/A',
        },
        {
            title: 'NUMBER OF TESTS',
            dataIndex: 'numTests',
            key: 'numTests',
        },
        {
            title: 'PACKAGE PRICE',
            dataIndex: 'packagePrice',
            key: 'packagePrice',

        },
    ];

    const iconHandler = () => {
        setClicked(prev => !prev);
    };

    return (
        <>
            <div style={{ width: '100%' }}>
                <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Col>
                        <IoMdArrowRoundBack
                            style={{ fontSize: '25px', marginBottom: '1rem', cursor: 'pointer' }}
                            onClick={() => router.push(`/${roleName}/test`)}
                        />
                    </Col>

                    <Col>
                        <Button

                            onClick={iconHandler}
                            style={{
                                backgroundColor: 'black',
                                color: 'white',
                                fontSize: '15px',
                                marginBottom: '1rem',
                                padding: '10px 20px',
                                fontWeight: '600',


                            }}
                        >
                            Filter Now
                        </Button>
                    </Col>
                </Row>
                <div >
                    {clicked ? <div style={{ width: '100%' }}>
                        <Row gutter={16} style={{ marginBottom: '1rem' }}>
                            <Col span={4}>
                                <span>Package Duration</span>
                                <Select placeholder="Select Package Duration" style={{ width: '100%' }} onChange={(value) => handleFilterChange('duration', value)} value={filterCriteria.duration || undefined}  >
                                    <Option value="3months">3 Months</Option>
                                    <Option value="6months">6 Months</Option>
                                    <Option value="9months">9 Months</Option>
                                    <Option value="12months">12 Months</Option>
                                </Select>
                            </Col>
                            <Col span={4}>
                                <span>Exam Type</span>

                                <Select placeholder="Please Select Exam Type" style={{ width: '100%' }} onChange={(value) => handleFilterChange('examType', value)} value={filterCriteria.examType || undefined}>
                                    {examTypes.map((data) => (
                                        <Option key={data._id} value={data.examType}>
                                            {data.examType}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={4}>
                                <span >Grade</span>
                                <Select placeholder="Grade" style={{ width: '100%' }} onChange={(value) => handleFilterChange('grade', value)} value={filterCriteria.grade || undefined}>
                                    {grades.map((data) => (
                                        <Option key={data._id} value={data.gradeLevel}>
                                            {data.gradeLevel}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={4}>
                                <div>
                                    <span >Subjects in Package</span>
                                    <Select placeholder="Select Subjects" style={{ width: '100%' }} mode="multiple" onChange={(value) => handleFilterChange('subjects', value)} value={filterCriteria.subjects || undefined} >
                                        {subject.map((data) => (
                                            <Option key={data._id} value={data._id}>
                                                {data.subjectName}
                                            </Option>
                                        ))}

                                    </Select>
                                </div>
                            </Col>
                            <Col span={4}>
                                <div>
                                    <span >Single Test or Multiple Subject Test</span>
                                    <Select placeholder="Single Test or Multiple Subject Test" style={{ width: '100%' }} onChange={(value) => handleFilterChange('testType', value)} value={filterCriteria.testType || undefined}>
                                        <Option value="single">Single Test</Option>
                                        <Option value="multiple">Multiple Subject Test</Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col span={4}>
                                <div>
                                    <span >State</span>
                                    <Select placeholder="Please Select State" style={{ width: '100%' }} onChange={(value) => handleFilterChange('state', value)} value={filterCriteria.state || undefined}>
                                        {services.map((data) => (
                                            <Option key={data._id} value={data.title}>
                                                {data.title}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginBottom: '1rem' }}>
                            <Col span={4}>
                                <div>
                                    <span >Package Active</span>
                                    <Select placeholder="Package Type" style={{ width: '100%' }} onChange={(value) => handleFilterChange('active', value)} value={filterCriteria.active || undefined} >
                                        <Option value="yes">Yes</Option>
                                        <Option value="no">No</Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col span={4}>
                                <div>
                                    <span >Package Quality Checked</span>
                                    <Select placeholder="Package Quality" style={{ width: '100%' }} onChange={(value) => handleFilterChange('qualityChecked', value)} value={filterCriteria.qualityChecked || undefined}>
                                        <Option value="yes">Yes</Option>
                                        <Option value="no">No</Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col span={4} >
                                <span >Search Package Name</span>

                                <Input
                                    type="search"
                                    placeholder="Search Package Name"
                                    style={{ width: '100%', height: '39px' }}
                                    value={filterCriteria.searchQuery}
                                    onChange={handleSearchChange}
                                    suffix={<SearchOutlined />}
                                />
                            </Col>
                            <Col span={4}>
                                <div>
                                    <span >Package Published</span>
                                    <Select placeholder="Package Published" style={{ width: '100%' }} onChange={(value) => handleFilterChange('published', value)} value={filterCriteria.published || undefined}>
                                        <Option value="yes">Yes</Option>
                                        <Option value="no">No</Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col span={4}>
                                <span>Test Conducted By</span>
                                <Select placeholder="Test Conducted By" style={{ width: '100%' }} onChange={(value) => handleFilterChange('testConductedBy', value)} value={filterCriteria.testConductedBy || undefined}>
                                    {testConductedBy.map((data) => (
                                        <Option key={data._id} value={data.name}>
                                            {data.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col
                                span={4}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '20px',
                                    alignItems: 'center',
                                    paddingRight: '0px',
                                    top: '10px'
                                }}
                            >
                                <Button
                                    onClick={applyFilters}
                                    style={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        fontWeight: '600',
                                        padding: '10px 20px',
                                    }}
                                >
                                    Filter
                                </Button>
                                <Button
                                    onClick={clearFilters}
                                    style={{

                                        fontWeight: '600',
                                        padding: '10px 20px',
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </Col>
                        </Row>

                    </div> : ''}
                </div>

                <Table dataSource={filteredPackages}
                    columns={columns}
                    rowKey="_id"
                />
                <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Button
                            onClick={handleSubmitAssignPackages}
                            className='hello321'
                            style={{
                                padding: '33px 150px',
                                backgroundColor: 'blue',
                                color: 'white',
                                borderRadius: '8px',
                                fontSize: '24px',
                            }}
                        >
                            Assign To Package
                        </Button>
                    </Col>
                </Row>
            </div >
        </>
    );
}
