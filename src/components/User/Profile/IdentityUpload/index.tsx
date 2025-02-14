import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import { Button, Card, Col, message, Modal, Popconfirm, Row, Select, Image, UploadFile } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import ErrorHandler from '@/lib/ErrorHandler';
import { deleteUserDocument, getUserDocuments, uploadIdentityDocuments } from '@/lib/userApi';
import { FaTrash } from 'react-icons/fa';
import './style.css';

interface Props {
    activeKey: string;
}

interface UserDocument {
    _id: string;
    type: string;
    imagePath: string;
}

export default function IdentityUpload({ activeKey }: Props) {
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [documentType, setDocumentType] = useState<string>('');
    const [userData, setUserData] = useState<{ documents: UserDocument[] } | null>(null);

    useEffect(() => {
        if (activeKey === '3' && user) {
            fetchDocuments();
        }
    }, [activeKey, user]);

    const fetchDocuments = async () => {
        try {
            const res = await getUserDocuments({ userId: user?._id });
            if (res.status === true) {
                setUserData(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        fileList,
        disabled: fileList.length >= 1,
        accept: '.pdf,.png,.jpg,.jpeg',
        async beforeUpload(file: File) {
            if (file.type === 'application/pdf') {
                return true;
            }

            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                message.error('You can only upload JPG, JPEG, and PNG files!');
                return false;
            }

            try {
                const options = { maxSizeMB: 0.1, maxWidthOrHeight: 1024, useWebWorker: true };
                const compressedFile = await imageCompression(file, options);

                if (compressedFile.size / 1024 < 100) {
                    const formattedFile = new File([compressedFile], compressedFile.name, {
                        type: compressedFile.type,
                        lastModified: Date.now(),
                    });
                    return formattedFile;
                } else {
                    message.error('File size must be under 100 KB after compression.');
                    return false;
                }
            } catch (error) {
                message.error('Failed to compress image!');
                return false;
            }
        },
        onChange(info: any) {
            setFileList(info.fileList.slice(-1)); // Limit to one file
        },
        onDrop(e: React.DragEvent<HTMLDivElement>) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleSubmit = async () => {
        if (!documentType) {
            message.error('Please select document type.');
            return;
        }

        if (fileList.length === 0) {
            message.error('Please upload at least one document.');
            return;
        }

        const formData = new FormData();
        formData.append('userId', user?._id as string);
        formData.append('documentType', documentType);
        if (fileList[0]) {
            formData.append('file', fileList[0]?.originFileObj as File);
        }

        setLoading(true);
        try {
            const res = await uploadIdentityDocuments(formData);
            if (res.status === true) {
                message.success(res.message);
                setModalVisible(false);
                fetchDocuments();
                setFileList([]);
                setDocumentType('');
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await deleteUserDocument({ userId: user?._id, documentId: id });
            if (res.status === true) {
                message.success(res.message);
                fetchDocuments();
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                Upload Identities
            </ParaText>
            <div className="gapMarginTopOne" />
            <Row>
                <Col md={20} xl={20} lg={20} sm={24} xs={24}>
                    <ParaText size="extraSmall" fontWeightBold={600} color="PrimaryColor">
                        Document Upload: Easily upload and manage your important documents to keep your profile information complete and up-to-date.
                    </ParaText>
                    <div className="gapMarginTopTwo" />
                    <Row gutter={10}>
                        {userData?.documents?.map((doc) => (
                            <Col md={8} xl={8} lg={8} sm={24} xs={24} key={doc._id}>
                                <Card className="document-upload-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{doc.type}</span>
                                        <Popconfirm
                                            title="Delete Document"
                                            description="Are you sure to delete this document?"
                                            onConfirm={() => handleDelete(doc._id)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button className="custom-button" ghost>
                                                <FaTrash />
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                    <Image
                                        width="100%"
                                        alt="document"
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/userDocuments/small/${doc.imagePath}`}
                                        style={{ borderRadius: '10px' }}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <div className="gapMarginTopOne" />
                    <div className="textEnd">
                        <Button type="primary" onClick={() => setModalVisible(true)}>
                            Upload Document
                        </Button>
                    </div>
                </Col>
            </Row>
            <Modal
                visible={modalVisible}
                title="Upload Document"
                onCancel={() => setModalVisible(false)}
                onOk={handleSubmit}
                confirmLoading={loading}
            >
                <Select
                    placeholder="Select document type"
                    onChange={(value) => setDocumentType(value)}
                    style={{ width: '100%', marginBottom: '1rem' }}
                >
                    <Select.Option value="aadharFront">Aadhaar Card (Front)</Select.Option>
                    <Select.Option value="aadharBack">Aadhaar Card (Back)</Select.Option>
                    <Select.Option value="selfie">Selfie</Select.Option>
                    <Select.Option value="voterFront">Voter ID (Front)</Select.Option>
                    <Select.Option value="voterBack">Voter ID (Back)</Select.Option>
                </Select>
                <Dragger {...uploadProps}>

                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p>Click or drag file to this area to upload</p>
                </Dragger>
            </Modal>
        </>
    );
}
