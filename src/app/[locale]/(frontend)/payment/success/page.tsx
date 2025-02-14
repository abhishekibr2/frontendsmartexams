'use client';
import React, { useEffect } from 'react';
import { Result, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';

export default function SuccessPage() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push('/');
		}, 2000);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div style={{ maxWidth: '300px', margin: 'auto', paddingTop: '300px' }}>
			<Result
				icon={<CheckCircleOutlined style={{ fontSize: '48px', color: '#1890ff' }} />}
				title="Payment Successful"
				extra={
					<Button type="primary" onClick={() => router.push('/')}>
						Go Home
					</Button>
				}
			/>
		</div>
	);
}
