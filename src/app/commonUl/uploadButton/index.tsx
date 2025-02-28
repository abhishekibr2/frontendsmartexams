'use client';
import React from 'react';
import styles from './uploadButton.module.css';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';

const props: UploadProps = {
	name: 'file',
	action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
	headers: {
		authorization: 'authorization-text'
	},
	onChange(info) {
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	}
};

export default function UploadButton() {
	return (
		<>
			<Upload {...props}>
				<div className={styles.uploadButton}>
					<Button icon={<UploadOutlined />}>Click to Upload</Button>
				</div>
			</Upload>
		</>
	);
}
