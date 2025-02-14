'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Select, Button, Upload, notification, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import { addUpdateBlogDetails, getAllAuthors } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import 'react-quill/dist/quill.snow.css';
import AuthContext from '@/contexts/AuthContext';
import './style.css';
import FormInput from '@/app/commonUl/FormInput';
import { handleFileCompression } from '@/lib/commonServices';
import TextEditor from '@/app/commonUl/TextEditor';
import { useDispatch, useSelector } from 'react-redux';
import { setBlogId } from '@/redux/reducers/blogReducer';


interface Blog {
	authorName: string;
	_id: string;
	title: string;
	content: string;
	author: string;
	createdAt: Date;
	updatedAt?: Date;
	slug?: string;
	description?: string;
	metaTitle?: string;
	metaDescription?: string;
	timeToRead?: number;
	imageAltText?: string;
	status?: 'active' | 'inactive';
	categoryId?: string;
	authorId?: { _id: string };
	image?: string;

}

interface Author {
	_id: string;
	name: string;
	authorName: string;
}
interface BlogModalProps {
	authorName: string;
	blog: Blog | null;
	onEdit: () => Promise<void>;
	onClose: () => void;
}
interface BlogFormValues {
	title: string;
	slug: string;
	description: string;
	metaTitle: string;
	metaDescription: string;
	timeToRead: number;
	imageAltText: string;
	status: 'active' | 'inactive';
	authorId: string;
	blogId: string;
}


export default function FormModal(props: BlogModalProps) {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [allAuthors, setAllAuthors] = useState<Author[]>([]);
	const { user } = useContext(AuthContext);
	const [isNew, setIsNew] = useState<boolean>(true);
	const dispatch = useDispatch();
	const blogId = useSelector((state: any) => state.blogReducer.blogId);


	useEffect(() => {
		if (props.blog) {
			form.setFieldsValue({
				authorName: props.blog?.authorName
			});
		} else {
			// Other form initialization...
		}
	}, [props.blog]);

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
	};

	const handleBeforeUpload = async (file: RcFile) => {
		try {
			const compressedFiles = await handleFileCompression(file, '');
			setFileList(compressedFiles);
			return false;
		} catch (error) {
			ErrorHandler.showNotification(error);
			return true;
		}
	};

	useEffect(() => {
		if (props.blog) {
			setIsNew(false);
			dispatch(setBlogId(props?.blog?._id))
			form.setFieldsValue({
				title: props.blog.title,
				slug: props.blog.slug || generateSlug(props.blog.title),
				description: props.blog.description,
				metaTitle: props.blog.metaTitle,
				metaDescription: props.blog.metaDescription,
				timeToRead: props.blog.timeToRead,
				imageAltText: props.blog.imageAltText,
				status: props.blog.status,
				categoryId: props.blog.categoryId,
				authorId: props.blog.authorId?._id,
				userID: user?._id
			});
			if (props.blog.image) {
				setFileList([
					{
						uid: '1',
						name: props.blog.image,
						status: 'done',
						url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/blogs/medium/${props.blog.image}`
					}
				]);
			} else {
				setFileList([]);
			}
		} else {
			setBlogId('');
			form.resetFields();
		}
	}, [props.blog, props.authorName]);

	const generateSlug = (text: string) => {
		return text
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '');
	};

	const onFinish = async (values: BlogFormValues) => {
		try {
			const formData = new FormData();

			if (fileList && fileList.length > 0) {
				const file = fileList[0]?.originFileObj as File;
				formData.append('image', file);
			}
			formData.append('title', values.title);
			formData.append('slug', values.slug);
			formData.append('description', values.description);
			formData.append('metaTitle', values.metaTitle);
			formData.append('metaDescription', values.metaDescription);
			// formData.append('timeToRead', values.timeToRead.toString());
			formData.append('imageAltText', values.imageAltText || '');
			formData.append('status', values.status);
			formData.append('authorId', values.authorId);
			formData.append('blogId', blogId);

			const res = await addUpdateBlogDetails(formData);
			if (res.status === true) {
				props.onClose();
				props.onEdit();
				form.resetFields();

				const action = isNew ? 'added' : 'updated';
				notification.success({ message: `Blog ${action} successfully`, duration: 4 });
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const nameValue = e.target.value;
		form.setFieldsValue({
			slug: generateSlug(nameValue)
		});
	};

	const handleQuillChange = (content: string) => {
		form.setFieldsValue({
			description: content
		});
	};

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	useEffect(() => {
		const fetchAuthors = async () => {
			try {
				const res = await getAllAuthors();
				if (res.status === true) {
					setAllAuthors(res.data);
				}
			} catch (error) {
				ErrorHandler.showNotification(error);
			}
		};
		fetchAuthors();
	}, []);

	const handleRemove = () => {
		setFileList([]);
	};

	return (
		<>
			<Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ status: 'active' }}>
				<Row align="middle" gutter={[16, 16]}>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							label="Title"
							name="title"
							rules={[{ required: true, message: 'Please enter title' }]}
						>
							<Input
								placeholder="Blog title"
								type="text"
								onChange={handleNameChange}
								style={{ textTransform: 'capitalize' }}
								maxLength={100}
								onKeyPress={(e) => {
									const charCode = typeof e.which === 'number' ? e.which : e.keyCode;
									const charStr = String.fromCharCode(charCode);
									if (!/[A-Za-z\s]/.test(charStr)) {
										e.preventDefault();
									}
								}}
							/>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item label="Slug" name="slug" rules={[{ required: true, message: 'Please enter slug' }]}>
							<FormInput placeHolder="Slug" type="text" />
						</Form.Item>
					</Col>
				</Row>
				<Row align="middle" gutter={[16, 16]}>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item label="Meta Title" name="metaTitle" rules={[{ required: true, message: 'Please enter meta title' }]}>
							<FormInput placeHolder="Meta Title" type="text" maxLength={60} />
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							name="metaDescription"
							label="Meta Description"
							rules={[{ required: true, message: 'Please enter meta description' }]}
						>
							<FormInput placeHolder="Meta Description" type="text" maxLength={120} />
						</Form.Item>
					</Col>
				</Row>
				<Row align="middle" gutter={[16, 16]}>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item
							label="Author Name"
							name="authorId"
							rules={[{ required: true, message: 'Please select author' }]}
						>
							<Select placeholder="Select a Author" style={{ height: '40px' }}>
								<Select.Option disabled>Select an author</Select.Option>
								{allAuthors.map((author) => (
									<Select.Option key={author._id} value={author._id}>
										{author.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={6} md={6} sm={12} xs={12}>
						<Form.Item name="status" label="Status">
							<Select placeholder="Select Status">
								<Select.Option value="active">Active</Select.Option>
								<Select.Option value="inactive">Inactive</Select.Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Row align="middle" gutter={[16, 16]}>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item label="Content" name="description">
							<TextEditor handleQuillChange={handleQuillChange} content={props.blog?.content || ''} />
						</Form.Item>
					</Col>
				</Row>

				<Row>
					<Col lg={24} md={24} sm={24} xs={24}>
						<Form.Item label="Upload Image" name="image">
							<Upload
								listType="picture-card"
								fileList={fileList}
								beforeUpload={handleBeforeUpload}
								onRemove={handleRemove}
								onPreview={handlePreview}
							>
								{uploadButton}
							</Upload>
						</Form.Item>
					</Col>
				</Row>

				<Button
					type="primary"
					htmlType="submit"
					loading={loading}
					style={{ width: '100%', height: 40 }}
				>
					Save Blog
				</Button>
			</Form>
		</>
	);
}
function getBase64(originFileObj: RcFile | undefined): string | PromiseLike<string> {
	throw new Error('Function not implemented.');
}

