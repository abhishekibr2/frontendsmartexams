import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, message, Form } from 'antd';
import type { UploadProps } from 'antd';
import { handleFileCompression } from '@/lib/commonServices';
import ErrorHandler from '@/lib/ErrorHandler';
import { RcFile } from 'antd/es/upload';
import './style.css'

const { Dragger } = Upload;

const FileUpload: React.FC<{
    fileList: any[];
    setFileList: (files: any[]) => void;
    onValidate?: (isValid: boolean) => void;
    multiple?: boolean;
}> = ({ fileList, setFileList, multiple = true, onValidate }) => {
    const uploadProps: UploadProps = {
        name: 'file',
        multiple,
        fileList,
        beforeUpload: async (file: RcFile) => {
            try {
                const compressedFile = await handleFileCompression(file, 'Ebook');
                setFileList(compressedFile);
                onValidate?.(true);
                return false;
            } catch (error) {
                ErrorHandler.showNotification(error);
                message.error("File compression failed!");
                onValidate?.(false);
                return false;
            }
        },
        accept: ".pdf",
        listType: "picture",
        onRemove: (file) => {
            const newFileList = fileList.filter((item) => item.uid !== file.uid);
            setFileList(newFileList);
            onValidate?.(newFileList.length > 0);
        },
    };

    return (
        <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
    );
};

export default FileUpload;
