import axios from 'axios';
import Cookies from 'js-cookie';
import { USER } from '@/constants/API/userApi';
import { API_BASE_URL } from '@/constants/ENV';

const baseURL = API_BASE_URL;
const { profile, userTimer } = USER;


export const updateProfileDetails = async (formData: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const token = Cookies.get('session_token');
        const req = axios.post(`${baseURL}${profile.updateProfileDetails}`, formData, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: `Bearer ${token}`
            }
        });

        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};

export const updatePassword = async (userId: any, updatedData: any) => {
    try {
        const token = Cookies.get('session_token');
        const url = `${baseURL}${profile.updatePassword(userId)}`;
        const res = await axios.put(
            url,
            updatedData,
            {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const uploadIdentityDocuments = async (formData: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const token = Cookies.get('session_token');
        const req = axios.post(`${baseURL}${profile.uploadIdentityDocuments}`, formData, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: `Bearer ${token}`
            }
        });

        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};

export const getUserDocuments = async (data: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${baseURL}${profile.getUserDocuments}`,
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token} `
            },
            data
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};

export const deleteUserDocument = async (data: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${baseURL}${profile.deleteUserDocument}`,
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token} `
            },
            data
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};

export const uploadDigitalSignature = async (data: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${baseURL}${profile.uploadDigitalSignature}`,
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            data
        });

        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};

export const lastSeenUserDate = async (userId: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const url = `${baseURL}${profile.lastSeenUserDate(userId)}`
        const req = axios.request({
            url: url,
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token} `
            },
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};

export const userTimers = async (data: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const url = `${baseURL}${userTimer.updateTime}`
        const req = axios.request({
            url: url,
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token} `
            },
            data: {
                data
            }
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};


export const getUserTimers = async (data: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const url = `${baseURL}${userTimer.getTime}`
        const req = axios.request({
            url: url,
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token} `
            },
            data: {
                data
            }
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};
