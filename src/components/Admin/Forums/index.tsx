import ParaText from '@/app/commonUl/ParaText';
import TextEditor from '@/app/commonUl/TextEditor';
import AuthContext from '@/contexts/AuthContext';
import { handleFileCompression } from '@/lib/commonServices';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import { Button, Col, Drawer, Form, Input, message, Row, Select, Space, Upload, UploadFile } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import ForumData from './ForumData';
import { PlusOutlined } from '@ant-design/icons';
import { addUpdateForumData, getForumCategories } from '@/lib/commonApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import {
	setDrawer,
	setForumCategory,
	setForumId,
	setLoading,
	setReload,
	setSearchQuery,
	setSelectedCategoryId
} from '@/redux/reducers/forumReducer';
import { Forum } from '@/lib/types';

interface Props {
	activeKey: string;
}

interface formValues {
	title: string;
	description: string;
	category: string; // categoryId
	subCategory: string; // subCategoryId
	attachment: UploadFile[]; // attachment
	userId: string;
	forumId: string;
	attachmentId: string;
	categoryId: string; // categoryId
	_id: string; // _id
}
interface Category {
	_id: string;
	name: string;
}

interface categoryId {
	categoryId: string;
	_id: string;
	name: string;
}

export default function Forums({ activeKey }: Props) {
	const dispatch = useAppDispatch();
	const { drawer, forumId, forumCategory, selectedCategoryId, reload, loading, searchQuery, editData } =
		useAppSelector((state: RootState) => state.forumReducer);
	const [form] = Form.useForm();
	const { user } = useContext(AuthContext);
	const [attachment, setAttachment] = useState<UploadFile[]>([]);
	const [subCategory, setSubCategory] = useState('');
	const HandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setSearchQuery(e.target.value));
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleItems = () => {
		dispatch(setDrawer(true));
		form.resetFields();
		dispatch(setForumId(''));
		setAttachment([]);
	};

	const onFinish = async (values: formValues) => {
		try {
			dispatch(setLoading(true));
			const formData = new FormData();
			if (attachment.length > 0) {
				formData.append('attachment', attachment[0]?.originFileObj as Blob);
			}
			formData.append('title', values.title);
			formData.append('description', values.description);
			formData.append('userId', user?._id || '');
			formData.append('forumId', forumId || '');
			formData.append('categoryId', values.category || '');
			formData.append('subCategoryId', subCategory || '');

			const res = await addUpdateForumData(formData);
			if (res.status === true) {
				message.success(res.message);
				form.resetFields();
				dispatch(setDrawer(false));
				dispatch(setLoading(false));
				dispatch(setReload(!reload));
				setAttachment([]);
			}
		} catch (error) {
			dispatch(setLoading(false));
			ErrorHandler.showNotification(error);
		}
	};

	const handleEdit = (data: Forum) => {
		dispatch(setForumId(data._id));
		dispatch(setDrawer(true));

		form.setFieldsValue({
			title: data.title,
			description: data.description,
			forumId: data._id,
			category: data.categoryId._id,
			subCategory: data.subCategoryId.name
		});
		setSubCategory(data.subCategoryId._id);
		if (data.attachment) {
			setAttachment([
				{
					uid: '1',
					name: data.attachment,
					status: 'done',
					url: `${process.env['NEXT_PUBLIC_IMAGE_URL']}/forumImages/medium/${data.attachment}`
				}
			]);
		}
	};

	const handleQuillChange = (content: string) => {
		form.setFieldsValue({
			description: content
		});
	};

	const handleImageUpload = async (file: File): Promise<boolean> => {
		try {
			const compressedFiles = await handleFileCompression(file, '');
			setAttachment(compressedFiles);
			return false;
		} catch (error) {
			ErrorHandler.showNotification(error);
			return true;
		}
	};

	const fetchCategories = async () => {
		try {
			const res = await getForumCategories();
			if (res.status === true) {
				dispatch(setForumCategory(res.data));
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	const handleRemove = () => {
		setAttachment([]);
	};

	return (
		<>
			<div className="smallTopMargin"></div>
			<Row>
				<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
					<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
						Forums
					</ParaText>
				</Col>

				<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className="textEnd ">
					<div className="floatRight">
						<Space>
							<Input
								type="search"
								placeholder="search"
								value={searchQuery}
								onChange={HandleSearch}
								allowClear
								size="small"
							/>
							<Button
								icon={<FaPlus />}
								type={'primary'}
								onClick={handleItems}
								style={{ margin: '0', height: '39px' }}
							>
								Add Item
							</Button>
						</Space>
					</div>
				</Col>
			</Row>
			<div className="gapMarginTopOne"></div>
			<ForumData onEdit={(data: Forum) => handleEdit(data)} />
			<Drawer
				width={640}
				title={forumId ? 'Edit Item' : 'Add New Item'} // Dynamic title based on edit or add mode
				onClose={() => dispatch(setDrawer(false))}
				open={drawer}
			>
				<Form layout="vertical" size="large" form={form} onFinish={onFinish}>
					<Row gutter={14}>
						<Col md={24}>
							<Form.Item
								label="Title"
								name="title"
								rules={[
									{
										required: true,
										message: 'Please enter a title'
									},
									{
										max: validationRules.textLength.maxLength,
										message: `Title must be at most ${validationRules.textLength.maxLength} characters`
									},
									{
										min: validationRules.textLength.minLength,
										message: `Title must be at least ${validationRules.textLength.minLength} characters`
									}
								]}
							>
								<Input
									placeholder="Enter title"
									maxLength={validationRules.textLength.maxLength}
									style={{ textTransform: 'capitalize' }}
								/>
							</Form.Item>
						</Col>
						<Col md={12}>
							<Form.Item
								label="Category"
								name="category"
								rules={[
									{
										required: true,
										message: 'Please select the category'
									}
								]}
							>
								<Select
									placeholder={'Select a category'}
									showSearch
									allowClear
									optionFilterProp="children"
									options={forumCategory.categories?.map((item: Category) => {
										return {
											value: item._id,
											label: item.name
										};
									})}
									onChange={(value: string) => dispatch(setSelectedCategoryId(value))}
								/>
							</Form.Item>
						</Col>
						<Col md={12}>
							<Form.Item label="Sub-category" name="subCategory">
								<Select
									placeholder={'Select a sub-category'}
									showSearch
									allowClear
									optionFilterProp="children"
									options={
										selectedCategoryId
											? forumCategory.subCategories
													?.filter(
														(item: categoryId) => item.categoryId == selectedCategoryId
													)
													.map((item: categoryId) => ({
														value: item._id,
														label: item.name
													}))
											: []
									}
								/>
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
									value={form.getFieldValue('description')}
									onChange={handleQuillChange}
									handleQuillChange={function (content: string): void {
										throw new Error('Function not implemented.');
									}}
									content={''}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Col>
						<Form.Item label="Attachment" name="attachment" valuePropName="fileList">
							<Upload
								beforeUpload={handleImageUpload}
								fileList={attachment}
								onRemove={handleRemove}
								customRequest={(e) => {
									return false;
								}}
							>
								{uploadButton}
							</Upload>
						</Form.Item>
					</Col>
					<Button type="primary" htmlType="submit" loading={loading} block size="large">
						{forumId ? 'Update' : 'Submit'}
					</Button>
				</Form>
			</Drawer>
		</>
	);
}
