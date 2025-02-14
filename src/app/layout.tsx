'use client';
import { ReactNode, useContext } from 'react';
import AuthContext, { AuthContextProvider } from '@/contexts/AuthContext';
import { ConfigProvider, Spin } from 'antd';
import AntdConfig from '@/lib/AntdConfig';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';

type Props = {
	children: ReactNode;
};

export default function RootLayout({ children }: Props) {
	const { initialized } = useContext(AuthContext)
	return (
		<AntdRegistry>
			<AuthContextProvider>
				<ConfigProvider
					theme={{
						token: {
							fontFamily: '"Public Sans", serif',
							colorPrimary: '#0253b3',
							borderRadius: 4
						}
					}}
				>
					<AntdConfig>
						<Provider store={store}>
							{initialized ?
								<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
									<Spin size="large" />
								</div>
								:
								children
							}
						</Provider>
					</AntdConfig>
				</ConfigProvider>
			</AuthContextProvider>
		</AntdRegistry>
	);
}
