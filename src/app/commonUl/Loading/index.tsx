import { Spin } from 'antd'; // Removed Flex
import React from 'react';

interface LoadingProps {
	height?: string;
	loading?: boolean;
	children?: React.ReactNode;
}

export default function Loading({ height = '80vh', loading = true, children }: LoadingProps) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: height,
				width: '100%'
			}}
		>
			<Spin
				size="large"
				spinning={loading}
				style={{
					minHeight: height,
					width: '100%'
				}}
			>
				{children}
			</Spin>
		</div>
	);
}
