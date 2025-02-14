import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { User } from '@/lib/types';
import { AUTH } from '@/constants/API/authApi';
import { API_BASE_URL } from '@/constants/ENV';

const baseURL = API_BASE_URL;
export const register = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${AUTH.register}`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data: {
				...data
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const OtpMatch = async (data?: any): Promise<any> => {
	const response = await axios.post(`${baseURL}${AUTH.otpMatch}`, {
		data: {
			...data
		}
	});
	return response.data;
};

export const forgetEmailPassword = async (data?: any): Promise<any> => {
	const response = await axios.post(`${baseURL}${AUTH.forgetEmailPassword}`, {
		data: {
			...data
		}
	});
	return response.data;
};
export const generateCaptcha = async (data?: any): Promise<any> => {
	const response = await axios.post(`${baseURL}${AUTH.captcha}`, {
		data: {
			...data
		}
	});
	return response.data;
};

export const createNewPassword = async (data?: any): Promise<any> => {
	const response = await axios.post(`${baseURL}${AUTH.createNewPassword}`, {
		data: {
			...data
		}
	});
	return response.data;
};

export const resendOtp = async (data?: any): Promise<any> => {
	const response = await axios.post(`${baseURL}${AUTH.resendOtp}`, {
		data: {
			...data
		} // Directly pass the object
	});
	return response.data;
};

export const socialLogin = async (data?: any): Promise<any> => {
	const response = await axios.post(`${baseURL}${AUTH.socialLogin}`, {
		data: {
			...data
		}
	});
	return response.data;
};

export const sendEmailVerification = async (data?: any): Promise<User[]> => {
	const response = await axios.post(`${baseURL}${AUTH.sendEmailVerification}`, {
		data: {
			...data
		}
	});
	return response.data;
};

export const matchEmailOtp = async (data?: any): Promise<User[]> => {
	const response = await axios.post(`${baseURL}${AUTH.matchEmailOtp}`, {
		data: {
			...data
		}
	});
	return response.data;
};

export const getUserById = async (id: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${AUTH.getUserById(id)}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
