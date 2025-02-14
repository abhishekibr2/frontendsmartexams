import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message, Row, Col, UploadFile, GetProp, UploadProps, Image } from 'antd';
import FileUpload from '../../FileUpload';
import { addUpdateEbook, getAllExamType } from '@/lib/adminApi';
import { EBook, ExamType } from '@/lib/types';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { handleFileCompression } from '@/lib/commonServices';
import ErrorHandler from '@/lib/ErrorHandler';
import Upload, { RcFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import './style.css'
import RichText from '@/commonUI/RichText';
import { setExamType } from '@/redux/reducers/examReducer';
import { useDispatch } from 'react-redux';

const { Option } = Select;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
const AddEbookForm: React.FC<{ ebook?: EBook, fetchData: () => void, closeForm: () => void }> = ({ ebook, fetchData, closeForm }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [ebookFileList, setEbookFileList] = useState<UploadFile[]>([]);
    const state = useAppSelector((state: RootState) => state.serviceReducer.services)
    const examType = useAppSelector((state: RootState) => state.examTypeReducer.examTypes)
    const grade = useAppSelector((state: RootState) => state.gradeReducer.grades)
    const subject = useAppSelector((state: RootState) => state.subjectReducer.subjects)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [filteredExamTypes, setFilteredExamTypes] = useState<ExamType[]>([]);
    const [isFreeChange, setIsFreeChange] = useState<string>('no');
    const [isFree, setIsFree] = useState(false);
    const [examTypeId, setExamTypeId] = useState('');
    const [priceDisabled, setPriceDisabled] = useState(false);

    useEffect(() => {
        if (ebook) {
            form.setFieldsValue({
                title: ebook?.title,
                slug: ebook?.slug || generateSlug(ebook?.title),
                examTypeId: ebook?.examTypeId?._id,
                description: ebook?.description || "",
                subjectId: ebook?.subjectId?._id,
                gradeId: ebook?.gradeId?._id,
                stateId: ebook?.stateId?._id,
                status: ebook?.status,
            });
            setExamTypeId(ebook?.examTypeId?._id);
            if (ebook?.isFree == 'yes') {
                setIsFree(true);
                setIsFreeChange('yes');
            }


            if (ebook?.image) {
                setEbookFileList([
                    {
                        uid: '1',
                        name: ebook.image,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/E-bookss/medium/${ebook.image}`
                    }
                ]);
            }

            if (ebook?.pdfFile) {
                setFileList([
                    {
                        uid: '1',
                        name: ebook.pdfFile,
                        status: 'done',
                        url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/E-book/medium/${ebook.pdfFile}`
                    }
                ]);
            }
        }
    }, [ebook]);

    useEffect(() => {
        const getExam = async () => {
            try {
                const res = await getAllExamType();
                if (res.status === true) {
                    const selectedStateId = state.find(state => state._id === form.getFieldValue('stateId'))?._id;
                    if (selectedStateId) {
                        handleStateChange(selectedStateId);

                        // Filter the exam types based on the selected state ID
                        const filtered = res.data.filter((examType: ExamType) => {
                            return examType.stateId?._id === selectedStateId;
                        });

                        if (filtered.length > 0) {
                            const matchingExamType = filtered.filter((item: ExamType) => {
                                return item._id === examTypeId
                            });

                            if (matchingExamType) {
                                form.setFieldsValue({ examType: matchingExamType[0]._id });
                            }
                        }

                        setFilteredExamTypes(filtered);
                        dispatch(setExamType(res.data));
                    }
                }
            } catch (error) {
                // ErrorHandler.showNotification(error);
            }
        };

        getExam();

    }, [examTypeId]);
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nameValue = e.target.value;
        form.setFieldsValue({
            slug: generateSlug(nameValue)
        });
    };

    const handleBeforeUpload = async (file: RcFile) => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setEbookFileList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleSubmit = async (values: EBook) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            if (fileList.length > 0 && fileList[0]?.originFileObj) {
                const file = fileList[0].originFileObj;
                formData.append('pdfFile', file);
            }
            if (ebookFileList.length > 0 && ebookFileList[0]?.originFileObj) {
                const imageFile = ebookFileList[0].originFileObj;
                const imageSize = (imageFile.size / (1024 * 1024)).toFixed(2);
                formData.append('image', imageFile);
                formData.append('imageSize', imageSize);
            }
            Object.keys(values).forEach((key) => {
                if (values[key]) {
                    formData.append(key, values[key]);
                }
            });
            if (ebook?._id) {
                formData.append('EBook_id', ebook._id);
            }
            await addUpdateEbook(formData);
            form.resetFields()
            closeForm()
            setEbookFileList([])
            fetchData();
            message.success(`Product ${ebook?._id ? 'updated' : 'added'} successfully`);
        } catch (error) {
            message.error('Failed to add or update product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = () => {
        setEbookFileList([])
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };


    const handleStateChange = (stateId: String) => {
        const filtered = examType.filter(
            (examTypes) => examTypes.stateId?._id === stateId
        );
        form.setFieldsValue({
            examType: undefined,
        });
        setFilteredExamTypes(filtered);
    };

    const handleIsFreeChange = (value: string) => {
        setIsFreeChange(value);
        setIsFree(value === 'yes');
        if (value === 'yes') {
            form.setFieldsValue({
                price: 0,
                discount: 0,
            });
        }
    };
    return (
        <div className="add-product-form-wrapper mb-4">
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    status: 'inactive',
                    is_featured: 'false',
                    examTypeId: '',
                    grade: '',
                    ...(ebook || {}),
                }}
                onFinish={handleSubmit}
                size='large'
            >
                <Row gutter={16}>
                    <Col xl={12} xxl={12} md={24} lg={24}>
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: 'Please enter the product title!' }]}
                        >
                            <Input
                                placeholder="title"
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

                        <Form.Item label="Subject" name="subjectId"
                            rules={[{ required: true, message: 'Please enter the Subject!' }]}
                        >
                            <Select placeholder="Select subject">
                                {subject?.map((item: any) => (
                                    <Option value={item._id} key={item._id}>{item.subjectName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xl={12} xxl={12} md={24} lg={24}>
                        <Form.Item label="Slug" name="slug" rules={[{ required: true, message: 'Please enter slug' }]}>
                            <Input placeholder="Slug" type="text" />
                        </Form.Item>
                        <Form.Item label="Grade" name="gradeId"
                            rules={[{ required: true, message: 'Please enter the Grade!' }]}
                        >
                            <Select placeholder="Select Grade">
                                {grade?.map((item: any) => (
                                    <Option value={item._id} key={item._id}>{item.gradeLevel}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} lg={12}>

                        <Form.Item label="State" name="stateId"
                            rules={[
                                { required: true, message: 'Please select the pState!' }
                            ]}
                        >
                            <Select placeholder="Select State" onChange={(value) => handleStateChange(value)}>
                                {state?.map((item: any) => (
                                    <Option value={item._id} key={item._id}>{item.title}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Row>
                                    <Col xs={24} md={12} lg={4}>
                                        <Form.Item
                                            label="Ebook Image"
                                            name="ebookImage"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please upload an ebook image',
                                                    validator: (_, value) => {
                                                        if (ebook?.image) {
                                                            return Promise.resolve();
                                                        }
                                                        if (ebookFileList.length > 0) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Please upload an ebook image'));
                                                    },
                                                },
                                            ]}
                                        >
                                            <Upload
                                                fileList={ebookFileList}
                                                onPreview={handlePreview}
                                                listType="picture-card"
                                                beforeUpload={handleBeforeUpload}
                                                onRemove={handleRemove}
                                            >
                                                {ebookFileList.length < 1 && uploadButton}
                                            </Upload>
                                            {previewImage && (
                                                <Image
                                                    wrapperStyle={{ display: 'none' }}
                                                    preview={{
                                                        visible: previewOpen,
                                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                                    }}
                                                    src={previewImage}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12} lg={20}>
                                        <Form.Item label="Pdf File" name="pdfFile"
                                            rules={[
                                                {
                                                    validator: (_, value) => {
                                                        if (fileList.length > 0) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Please upload at least one PDF file.'));
                                                    },
                                                },
                                            ]}
                                        >
                                            <FileUpload fileList={fileList} setFileList={setFileList}
                                                onValidate={(isValid) => {
                                                    form.setFields([
                                                        {
                                                            name: 'pdfFile',
                                                            errors: isValid ? [] : ['Please upload at least one PDF file.'],
                                                        },
                                                    ]);
                                                }}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={12} lg={12}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Is Free" name="isFree"
                                    rules={[
                                        { required: true, message: 'Please select the isFree!' }
                                    ]}>
                                    <Select placeholder="Select isFree"
                                        onChange={(value) => {
                                            form.validateFields()
                                            if (value === 'yes') {
                                                setPriceDisabled(true)
                                            } else if (value === 'no') { setPriceDisabled(false) }
                                        }}
                                    >
                                        <Option value="yes" key="yes">Yes</Option>
                                        <Option value="no" key="no">No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="ExamType" name="examTypeId"
                                    rules={[{ required: true, message: 'Please enter the Exam Type!' }]}
                                >
                                    <Select placeholder="Select ExamType">
                                        {filteredExamTypes.map((exam: any) => (
                                            <Option value={exam._id} key={exam._id}>{exam.examType}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Price"
                                    name="price"
                                    rules={
                                        priceDisabled === true || isFree
                                            ? []
                                            : [
                                                { required: !priceDisabled, message: 'Please enter the product price!' },
                                                {
                                                    validator: (_, value) => {
                                                        if (value && !/^\d{1,3}(\.\d{1,2})?$/.test(value)) {
                                                            return Promise.reject('Enter a valid price (e.g., 321.12)');
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                                {
                                                    validator: (_, value) => {
                                                        if (value === "0" || value === "000" || value === "00") {
                                                            return Promise.reject('Price cannot be 0. Please enter a valid amount.');
                                                        }
                                                        if (value && !/^(?!0\d)\d{1,3}(\.\d{1,2})?$/.test(value)) {
                                                            return Promise.reject('Enter a valid price (e.g., 321.12)');
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]
                                    }
                                >
                                    <Input
                                        placeholder="Enter product price"
                                        type="text"
                                        disabled={priceDisabled == true}
                                        maxLength={6}
                                        value={priceDisabled ? 0.00 : 0.00}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/[^\d.]/g, '');
                                            if (value.length > 3 && !value.includes('.')) {
                                                value = value.slice(0, 3) + '.' + value.slice(3);
                                            }
                                            const parts = value.split('.');
                                            if (parts[1] && parts[1].length > 2) {
                                                parts[1] = parts[1].slice(0, 2);
                                            }
                                            value = parts.join('.');
                                            if (value.length > 6) {
                                                value = value.slice(0, 6);
                                            }
                                            e.target.value = value;
                                        }}
                                    />
                                </Form.Item>

                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Discount(%)"
                                    name="discount"
                                    rules={
                                        isFree
                                            ? []
                                            : [
                                                {
                                                    validator: (_, value) => {
                                                        const discount = Number(value);

                                                        if (isNaN(discount)) {
                                                            return Promise.reject(new Error('Discount must be a valid number'));
                                                        }
                                                        if (discount < 0 || discount > 100) {
                                                            return Promise.reject(new Error('Discount must be between 0% and 100%'));
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]
                                    }
                                >
                                    <Input placeholder="Enter discount % (optional)"
                                        onInput={(e) => {
                                            const input = e.target as HTMLInputElement;
                                            let value = input.value;
                                            if (/^\d{2}$/.test(value)) {
                                                input.value = value + '.';
                                            }
                                            const regex = /^\d{0,2}(\.\d{0,2})?$/;
                                            if (!regex.test(value)) {
                                                input.value = value.slice(0, value.length - 1);
                                            }
                                            if (value.endsWith('.')) {
                                                input.value = value.slice(0, -1);
                                            }
                                            if (value === '') {
                                                input.value = '';
                                            }
                                        }} disabled={priceDisabled == true} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={24} lg={24}>
                        <Row gutter={[16, 16]} wrap={true}>
                            <Col xs={24} md={24} lg={24} sm={24} xl={24} xxl={24}>
                                <Form.Item label="Description" name="description">
                                    <RichText
                                        editorValue={form.getFieldValue('description') || ebook?.description || ""}
                                        onChange={(value) => form.setFieldsValue({ description: value })}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                </Row>
                <div className=''>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} >
                            {ebook ? 'Update eBook' : 'Upload New eBook'}
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default AddEbookForm;

