'use client'
import React, { createContext, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { notification } from 'antd'
import { User } from '@/lib/types';
//@ts-ignore
import { useRouter } from 'nextjs-toploader/app';
import { message } from 'antd';
import { regSw, subscribe } from '@/helper/webNotification';
import { API_BASE_URL } from '@/constants/ENV';

interface AuthContextDefaults {
	user?: User | undefined;
	locale?: any;
	setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
	logout: () => Promise<void>;
	login: (email: string, password: string, url: string) => Promise<string>;
	chatSettings?: any;
	setChatSettings: React.Dispatch<React.SetStateAction<any>>;
	initialized: boolean;
	setInitialized: React.Dispatch<React.SetStateAction<any>>;
	loading: boolean;
}

interface AuthContextProp {
	children?: React.ReactNode;
	locale?: string;
}

const AuthContext = createContext<AuthContextDefaults>({
	logout: () => Promise.resolve(),
	login: () => Promise.resolve(''),
	setUser: () => { },
	locale: undefined,
	chatSettings: undefined,
	setChatSettings: () => { },
	initialized: false,
	setInitialized: () => { },
	loading: false
});

const api = axios.create({
	baseURL: process.env['NEXT_PUBLIC_API_URL'] || ''
});

const AuthContextProvider = ({ children, locale }: AuthContextProp) => {
	const router = useRouter();
	const [user, setUser] = useState<User | undefined>();
	const [chatSettings, setChatSettings] = useState<any>(undefined);
	const [initialized, setInitialized] = useState(false);
	const [loading, setLoading] = useState(false); // Add loading state

	useEffect(() => {
		const token = Cookies.get('session_token');
		const pathName = window.location.pathname;
		axios.defaults.baseURL = API_BASE_URL || ''

		const checkSession = async () => {
			setLoading(true); // Start loading code
			if (token) {
				try {
					axios.defaults.headers.common.Authorization = `Bearer ${token}`;
					const response = await api.get('/auth/check-session', {
						headers: {
							Authorization: `${token}`
						}
					});
					axios.defaults.headers.common.Authorization = `Bearer ${token}`;
					if (response.data.user) {
						const currentUser: User = response.data.user;

						if (currentUser.status === 'inactive') {
							Cookies.remove('session_token');
							Cookies.remove('roleName');
							setUser(undefined);
							router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/login`);
							return;
						}
						if (currentUser.roleId.roleName === 'admin') {
							currentUser.isAdmin = true
						}

						setUser(currentUser);
						setChatSettings(response.data.chatSettings);

						Cookies.set('session_token', response.data.refreshedToken);
						axios.defaults.headers.common.Authorization = `Bearer ${token}`;
					} else {
						Cookies.remove('session_token');
						Cookies.remove('roleName');
						setUser(undefined);
						router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}`);
					}
				} catch (error) {
					// ErrorHandler.showNotification(error);
					Cookies.remove('session_token');
					Cookies.remove('roleName');
					setUser(undefined);
					router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}`);
				}
			} else {
				setUser(undefined);
				if (pathName.includes('admin') || pathName.includes('user')) {
					router.push('/');
				}
			}
			setInitialized(true);
			setLoading(false); // End loading
		};
		checkSession();
	}, []);

	useEffect(() => {
		async function registerAndSubscribe() {
			try {
				const serviceWorkerReg = await regSw();
				await subscribe(serviceWorkerReg);
			} catch (error) {
				// ErrorHandler.showNotification(error);
			}
		}
		registerAndSubscribe();
	}, [user]);

	const login = async (email: string, password: string, url: string) => {
		setLoading(true); // Start loading
		const data = {
			email: email,
			password: password
		};
		const requestConfig: AxiosRequestConfig = {
			url: process.env['NEXT_PUBLIC_API_URL'] + '/auth/login',
			method: 'post',
			data: {
				...data
			}
		};
		const blockedMessageCounter = Number(localStorage.getItem('blockedMessageCounter')) || 0;
		try {
			const response = await axios(requestConfig);
			if (response && response.data && response.data.token && response.data.user) {
				const { token, user: loggedInUser } = response.data;
				axios.defaults.headers.common.Authorization = `Bearer ${token}`;
				Cookies.set('session_token', token);
				Cookies.set('roleName', loggedInUser.roleId?.roleName);

				setUser(loggedInUser);
				setChatSettings(response.data.chatSettings);
				message.success('You are logged In!');
				if (url) {
					router.push(url);
				} else {
					const storedPath = localStorage.getItem('pathName');
					const roleName = loggedInUser.roleId?.roleName?.toLowerCase();
					if (storedPath) {
						router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/${locale}/${storedPath}`);
						localStorage.removeItem('pathName');
					} else if (roleName === 'admin') {
						router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/${locale}/admin/dashboard`);
					}
					else if (roleName === 'student') {
						router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/${locale}/student/dashboard`);
					}
					else if (roleName) {
						router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/${locale}/${roleName}/profile`);
					} else {
						router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/${locale}`);
					}
				}
				localStorage.removeItem('blockedMessageCounter');
				return token;
			}
		} catch (error: any) {
			console.log(error.response.data.message, 'error.response.data.message')
			if (
				error.response &&
				error.response.status === 403 &&
				error.response.data &&
				error.response.data.message
			) {
				if (blockedMessageCounter < 1) {
					message.error(error.response.data.message);
					localStorage.setItem('blockedMessageCounter', (blockedMessageCounter + 1).toString());
				}
			} else {
				notification.error({
					message: <div>
						<div dangerouslySetInnerHTML={{ __html: error.response.data.message }} />
					</div>
				})
				// message.error(error.response.data.message)
				// ErrorHandler.showNotification(error);
			}
		} finally {
			setLoading(false);
		}
	};

	const logout = async (): Promise<void> => {
		try {
			Cookies.remove('session_token');
			Cookies.remove('roleName');

			window.location.href = `${process.env['NEXT_PUBLIC_SITE_URL']}/login`;
			// await signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/login` });
			setUser(undefined);

			await new Promise(resolve => setTimeout(resolve, 50));
		} catch (error) {
			console.error('Logout Error: ',);
		}
	};
	return (
		<AuthContext.Provider
			value={{
				user,
				logout,
				setUser,
				login,
				locale,
				chatSettings,
				setChatSettings,
				initialized,
				setInitialized,
				loading
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContextProvider };
export default AuthContext;
