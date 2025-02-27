import axios from 'axios';
import Cookies from 'js-cookie';
import { student } from '@/constants/API/studentApi';
import { API_BASE_URL } from '@/constants/ENV';

const baseURL = API_BASE_URL;
const { ebook, cart, profile, essay, checkout, dashboard, contactUs } = student;

export const getEbooksForStudent = async (
    stateId: string,
    examTypeId: string,
    filterPrice: string,
    perPage: number,
    purchaseType: string,
    userId: string
): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${baseURL}${ebook.getEbooksForStudent}?stateId=${stateId}&examTypeId=${examTypeId}&filterPrice=${filterPrice}&perPage=${perPage}&purchaseType=${purchaseType}&userId=${userId}`,
            method: 'get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};


export const getAllStatesForFilter = async (): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${baseURL}${ebook.getAllStatesForFilter}`,
            method: 'get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
}

export const getStudentCartDetails = async (userId: string): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const url = `${baseURL}${cart.getStudentCartDetails(userId)}`;
        const req = axios.request({
            url: url,
            method: 'get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
}

export const getAllExamTypeForFilter = async (): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const url = `${baseURL}${ebook.getAllExamTypeForFilter}`;
        const req = axios.request({
            url: url,
            method: 'get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
}

export const getSingleEbook = async (id: string): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const url = `${baseURL}${ebook.getSingleEbook(id)}`;
        const req = axios.request({
            url: url,
            method: 'get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};


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

export const submitEssayDetails = async (data: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const token = Cookies.get('session_token');
        const req = axios.post(`${baseURL}${essay.submitEssayDetails}`, data, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};




export const getStudentCheckoutDetails = async (userId: string): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${baseURL}${checkout.getStudentCheckoutDetails(userId)}`,
            method: 'get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    })
}

export const getUserDashboardData = async (userId: string): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const url = `${baseURL}${dashboard.getUserDashboardData(userId)}`;
        const req = axios.get(url, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    })
}

export const submitContactUsMessage = async (data: { message: string, userId: string }): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.post(`${baseURL}${contactUs.submitContactUsMessage}`, data, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
}

export const getContactUsData = async (userId: string): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const url = `${baseURL}${contactUs.getContactUsData(userId)}`;
        const req = axios.get(url, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    })
}

// here ebooks api
export const getAllEBooks = async (userId: string): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${baseURL}${ebook.getAllEBooks(userId)}`,
            method: 'get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },

        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));

    })
}

export const getTestAttempt = async (testAttemptId: string): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${baseURL}/student/testAttempt/${testAttemptId}`,
            method: 'get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },

        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));

    })
}
