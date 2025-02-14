import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '@/contexts/AuthContext'
import { Button, Col, Modal, Popconfirm, Row, Tooltip, message } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import FAQForm from '../FormModal'
import { deleteFaq } from '@/lib/adminApi'
import { RiDeleteBin5Line } from 'react-icons/ri'
import PrimaryButton from '@/app/commonUl/primaryButton'
import Titles from '@/app/commonUl/Titles'
import ResponsiveTable from '@/commonUI/ResponsiveTable'

interface FAQProps {
	getFaqHandler: () => void;
	faqs: any[];
}

interface RecordType {
	_id: string;
	questions: string;
	answer: string;
	createdAt: string | Date;
}

const TableData = ({ getFaqHandler, faqs }: FAQProps) => {
	const { user } = useContext(AuthContext);
	const userId = user?._id;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [edit, setEdit] = useState<RecordType | null>(null)
	const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([]);

	useEffect(() => {
		getFaqHandler();
	}, [user]);

	const handleEdit = async (record: RecordType) => {
		setEdit(record);
		setIsModalVisible(true);
		getFaqHandler();
	}

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
			title: 'Numbering Order',
			key: 'index',
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Pages',
			dataIndex: 'pages',
			key: 'pages',
		},
		{
			title: 'State',
			dataIndex: 'state',
			key: 'state',
			render: (text: any, record: any) => record?.stateId?.title
		},
		{
			title: 'Exam Name',
			dataIndex: 'examType',
			key: 'examType',
			render: (text: any, record: any) => record?.examTypeId?.examType
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
		setIsModalVisible(true);
		setEdit(null);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		getFaqHandler();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	// const rowSelection = {
	// 	selectedRowKeys: selectedIds,
	// 	onChange: (selectedRowKeys: any) => {
	// 		setSelectedIds(selectedRowKeys);
	// 	},
	// };

	const GetSelectedId = (data: string[]) => {
		setSelectedAuthorIds(data)

	}

	const formattedData = faqs?.map((item: any) => ({
		...item,
		key: item._id,
	})) || [];

	return (
		<>
			<Row gutter={[24, 24]} className="mb-3" align="middle" justify="space-between">
				<Col>
					<Titles level={5} className="top-title">
						FAQ
					</Titles>
				</Col>
				<Col style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
					<PrimaryButton label="Add Question" onClick={showModal} />
				</Col>
			</Row>

			<Row gutter={[16, 16]} align="middle">
				<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>
					<h6 >Count: {faqs.length}</h6>
				</Col>
				<Col xs={24} sm={24} md={12} lg={12} xxl={12} xl={12}>

				</Col>
			</Row>

			<ResponsiveTable columns={columns} data={formattedData} GetSelectedId={GetSelectedId}
			// rowKey='_id'
			// pagination={{
			// 	pageSize: 10,
			// 	pageSizeOptions: ['10', '20', '30'],
			// 	showSizeChanger: true,
			// }}
			/>

			<Modal
				title={edit && edit ? 'Edit Question' : 'Add Question'}
				visible={isModalVisible}
				footer={null}
				onOk={handleOk}
				onCancel={handleCancel}
				style={{ width: 'fit-content ' }}
				width={900}

			>
				<FAQForm handleEdit={edit} onClose={handleCancel} getFaqHandler={getFaqHandler} />
			</Modal>
		</>
	)
}

export default TableData;
