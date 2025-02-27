import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '@/contexts/AuthContext'
import { Button, Col, Modal, Popconfirm, Row, Select, Tooltip, message, Space, Form } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import FAQForm from '../FormModal'
import { deleteFaq } from '@/lib/adminApi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import PrimaryButton from '@/app/commonUl/primaryButton'
import Titles from '@/app/commonUl/Titles'
import ResponsiveTable from '@/commonUI/ResponsiveTable'
import { ExamType, State } from '@/lib/types'
import { getStateWithExamTypes } from '@/lib/frontendApi'

interface FAQProps {
	getFaqHandler: () => void;
	faqs: any[];
}

interface RecordType {
	_id: string;
	questions: string;
	answer: string;
	createdAt: string | Date;

	stateId: {
		title: 'string'
	};
	examTypeId: {
		examType: 'string'
	};
	pages: string;
	orderBy: string;
}

const TableData = ({ getFaqHandler, faqs }: FAQProps) => {
	const { user } = useContext(AuthContext);
	const userId = user?._id;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [edit, setEdit] = useState<RecordType | null>(null)
	const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);
	const [stateFilter, setStateFilter] = useState<string>('');
	const [form] = Form.useForm();
	const [state, setState] = useState<any[]>([]);
	const [examTypeFilter, setExamTypeFilter] = useState<string>('');
	const [pageFilter, setPageFilter] = useState<string>('');
	const { Option } = Select;
	const [faqId, setFaqId] = useState<string>('');

	const [filteredExamTypes, setFilteredExamTypes] = useState<any[]>([]);

	useEffect(() => {
		getFaqHandler();
	}, [user]);

	const handleEdit = async (record: RecordType) => {
		console.log(edit, 'editdata')

		setEdit(record);
		setIsModalVisible(true);
		getFaqHandler();
	}

	const handlePageChange = (value: string) => {
		setPageFilter(value);
		setStateFilter('');
		setExamTypeFilter('');
	};

	const handleStateChange = (value: string) => {
		if (value === "") {
			setStateFilter(value);
			setExamTypeFilter('');
		} else {
			setStateFilter(value);
			setExamTypeFilter('');
		}
		const selectedState = state.find((item) => item._id === value);
		if (selectedState) {
			setFilteredExamTypes(selectedState.examTypes || []);
		} else {
			setFilteredExamTypes([]);
		}
	};

	const handleExamTypeChange = (value: string) => {
		setExamTypeFilter(value);
	};

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
	const deleteHandler = async (id: string[]) => {
		const response = await deleteFaq({ id });
		if (response) {
			getFaqHandler();
			message.success(response.message);
			setSelectedAuthorIds([]); // Clear selection after delete
		}
	}
	const columns = [
		{
			title: 'Order',
			dataIndex: 'order',
			key: 'order',
			render: (text: any, record: any) => record?.orderBy,
			sorter: (a: any, b: any) => a.orderBy - b.orderBy,
			defaultSortOrder: 'ascend',
		},
		{
			title: 'Pages',
			dataIndex: 'pages',
			key: 'pages',
			sorter: (a: RecordType, b: RecordType) => a.pages?.localeCompare(b.pages),
			defaultSortOrder: 'ascend',
		},
		{
			title: 'State',
			dataIndex: 'state',
			key: 'state',
			render: (text: any, record: any) => record?.stateId?.title,
			sorter: (a: RecordType, b: RecordType) => a.stateId?.title.localeCompare(b.stateId?.title),
			defaultSortOrder: 'ascend',
		},
		{
			title: 'Exam Name',
			dataIndex: 'examType',
			key: 'examType',
			render: (text: any, record: any) => record?.examTypeId?.examType,
			sorter: (a: RecordType, b: RecordType) => a.examTypeId?.examType.localeCompare(b.examTypeId?.examType),
			defaultSortOrder: 'ascend',
		},


		{
			title: 'Question',
			dataIndex: 'questions',
			key: 'questions',
			sorter: (a: RecordType, b: RecordType) =>
				a.questions.localeCompare(b.questions),
		},
		{
			title: 'Answer',
			dataIndex: 'answer',
			render: (text: any) => (
				<Tooltip title={<div dangerouslySetInnerHTML={{ __html: text }} />}>
					<div
						dangerouslySetInnerHTML={{ __html: text }}
						style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
					/>
				</Tooltip>
			),
		},


		{
			title: 'CreatedAt',
			dataIndex: 'createdAt',
			key: 'createdAt',
			// width: '20%',

			sorter: (a: RecordType, b: RecordType) =>
				(new Date(a.createdAt).getTime() || 0) - (new Date(b.createdAt).getTime() || 0),
			render: (value: string | Date) => new Date(value).toLocaleString(),
		},
		{
			title: 'Actions',
			key: 'action',
			// width: '20%',

			render: (_: any, record: RecordType) => {
				return (
					<div>
						<Button onClick={() => handleEdit(record)} style={{ marginRight: '8px' }}><EditOutlined /></Button>
						<Popconfirm
							title="Are you sure you want to delete this FAQ?"
							onConfirm={() => deleteHandler([record._id])}
							okText="Yes"
							cancelText="No"
						>
							<Button style={{ color: 'red' }}><DeleteOutlined /></Button>
						</Popconfirm>
					</div>
				)
			}
		}
	]

	const showModal = () => {
		console.log(edit, 'editdata')
		setEdit(null);
		setFaqId('');
		form.resetFields();
		setIsModalVisible(true);
	};

	useEffect(() => {
		if (!handleEdit) {
			form.resetFields();  // Agar edit ka data na ho toh form reset karo
		} else {
			form.setFieldsValue(handleEdit); // Agar edit me data hai toh usko set karo
		}
	}, [handleEdit]);


	const handleOk = () => {
		setIsModalVisible(false);
		getFaqHandler();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};


	const GetSelectedId = (data: string[]) => {
		setSelectedAuthorIds(data)
	}



	const formattedData = faqs?.map((item: any) => ({
		...item,
		key: item._id,
	})) || [];

	const filteredData = formattedData.filter((item: any) => {
		// Page filter
		const isPageMatch = pageFilter ? item.pages === pageFilter : true;
		// State filter
		const isStateMatch = stateFilter ? item.stateId?._id === stateFilter : true;
		// Exam type filter
		const isExamTypeMatch = examTypeFilter ? item.examTypeId?._id === examTypeFilter : true;
		return isPageMatch && isStateMatch && isExamTypeMatch;
	});


	return (
		<>
			<Row gutter={[24, 24]} className="mb-3" align="middle" justify="space-between">
				<Col className="" xs={24} sm={24} md={8} lg={8} xxl={13} xl={8}>
					<Titles level={5} className="top-title">
						FAQ ({faqs.length})
					</Titles>
				</Col>

				<Col className="" xs={24} sm={24} md={16} lg={16} xxl={11} xl={16}>
					<div className="floatRight" >
						<Row gutter={16} >
							<Col xs={24} sm={24} md={4} lg={4} xxl={4} xl={4}>
								{selectedAuthorIds.length > 0 && (
									<Popconfirm
										title="Are you sure to delete selected faq?"
										onConfirm={() => deleteHandler(selectedAuthorIds)}
										okText="Yes"
										cancelText="No"
									>
										<Button
											className="primary"
											danger
											ghost
											style={{
												color: '#b90d0d',
												background: '#af03031f',
											}}
										>
											<RiDeleteBin5Line style={{ fontSize: '15px', marginRight: '5px' }} />
											Delete
										</Button>
									</Popconfirm>
								)}
							</Col>
							<Col xs={24} sm={24} md={5} lg={5} xxl={5} xl={5}>

								<Select placeholder="Select Page" onChange={handlePageChange}
									// value={pageFilter}
									value={pageFilter || undefined}
									style={{ width: '100%' }}
								>
									<Option value="">All</Option>
									<Option value="Home">Home</Option>
									<Option value="Exam Info">Exam Info</Option>
								</Select>
							</Col>

							<Col xs={24} sm={24} md={5} lg={5} xxl={5} xl={5}>

								<Select
									placeholder="Select a state"
									onChange={handleStateChange}
									style={{ width: '100%' }}
									// value={stateFilter}
									value={stateFilter || undefined}

								>
									<Option value="">All</Option>
									{state.map((item) => (
										<Option key={item._id} value={item._id}>
											{item.title}
										</Option>
									))}
								</Select>
							</Col>

							<Col xs={24} sm={24} md={5} lg={5} xxl={5} xl={5}>

								<Select
									placeholder="Select Exam Type"
									style={{ width: '100%' }}
									// value={examTypeFilter}
									value={examTypeFilter || undefined}

									onChange={handleExamTypeChange}
								>
									<Option value="">All</Option>
									{filteredExamTypes.map((examType: any) => (
										<Option key={examType._id} value={examType._id}>
											{examType.examType}
										</Option>
									))}
								</Select>
							</Col>
							<Col xs={24} sm={24} md={5} lg={5} xxl={5} xl={5}>

								<PrimaryButton label="Add Question" onClick={showModal}
								/>

							</Col>
						</Row>
					</div>

				</Col>
			</Row>

			{/* <Row gutter={[16, 16]} align="middle">
				<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
					<h6 >Count: {faqs.length}</h6>
				</Col>
				<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>

				</Col>
			</Row> */}

			<ResponsiveTable columns={columns} data={filteredData} GetSelectedId={GetSelectedId}
			// rowKey='_id'
			// pagination={{
			// 	pageSize: 10,
			// 	pageSizeOptions: ['10', '20', '30'],
			// 	showSizeChanger: true,
			// }}
			/>

			<Modal
				title={edit ? 'Edit Question' : 'Add Question'}
				visible={isModalVisible}
				footer={null}
				onOk={handleOk}
				onCancel={handleCancel}
				style={{ width: 'fit-content ' }}
				width={900}

			>
				<FAQForm handleEdit={edit} onClose={handleCancel} getFaqHandler={getFaqHandler}
					faqId={faqId}
					setFaqId={setFaqId}
				/>
			</Modal>
		</>
	)
}

export default TableData;
