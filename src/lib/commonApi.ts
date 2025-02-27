import { message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { COMMON } from '@/constants/API/commonApi';
import { API_BASE_URL } from '@/constants/ENV';
import { TicketParams } from './types';
import { StringGradients } from 'antd/es/progress/progress';

const baseURL = API_BASE_URL;
const { notification, profile, ticket, todo, user, forum, fileManager, blog, commonHeader, commonFooter, commonStates, grade, state, examType,
	payment, complexity, subject, testAdmin, packages, packageEssay, essay } = COMMON;
export const getUserNotification = async (userId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const url = `${baseURL}${notification.getUserNotification(userId)}`
		const req = axios.get(url, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const updateAllReadStatus = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${notification.updateAllReadStatus}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteAllMessages = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${notification.deleteAllMessages}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteMessage = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${notification.deleteMessage}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const storeCardDetail = async (data: any) => {
	const token = Cookies.get('session_token');
	const res: any = await axios
		.post(`${baseURL}${profile.storeCardDetail}`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		})
		.catch((error) => {
			if (error.response) {
				message.error(error.response.data.message);
			}
		});

	return res.data;
};

export const getAllCards = async (data: any) => {
	try {
		const token = Cookies.get('session_token');
		const res = await axios.post(`${baseURL}${profile.getAllCards}`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		return res.data;
	} catch (err) {
		throw err;
	}
};


export const deleteCard = async (data: any) => {
	try {
		const token = Cookies.get('session_token');
		const res = await axios.post(`${baseURL}${profile.deleteCard}`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		return res.data;
	} catch (err) {
		throw err;
	}
};

export const addUpdateTicketDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${ticket.addUpdateTicketDetails}`, formData, {
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

export const getAllTicketsWithParams = async (params: TicketParams): Promise<any> => {
	const token = Cookies.get('session_token');

	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${ticket.getAllTicketsWithParams}`,
			method: 'get',
			params,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllUsers = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${user.getAllUsers}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const addUpdateTodo = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${todo.addUpdateTodo}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllTodo = async (query: any = {}): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${todo.getAllTodo}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: query // Pass query parameters
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
export const getUserTodo = async (data: any): Promise<any> => {
	const token = Cookies.get("session token");
	return new Promise((resolve, reject) => {
		axios.request({
			url: `${baseURL}${todo.getUserTodo}`,
			method: "post",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`
			},
			data: data

		})
			.then((res) => resolve(res.data))
			.catch((err) => reject(err));
	});
};

export const deleteTodo = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${todo.deleteTodo}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllEvents = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${todo.getAllEvents}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			// Pass query parameters
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getEventsById = async (id: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${todo.getEventsById(id)}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			// Pass query parameters
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllRoles = async (search?: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${user.getAllRoles}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: {
				search
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};



export const getSingleTicketData = async (ticketId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.get(`${baseURL}${ticket.getSingleTicketData(ticketId)}`, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const deleteTicket = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${ticket.deleteTicket}`,
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


export const updateTicketStatus = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${ticket.updateTicketStatus}`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllTickets = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${ticket.getAllTickets}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const assignTicket = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${ticket.assignTicket}`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getAllUserData = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${ticket.getAllUserData}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const addUpdateForumData = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.addUpdateForumData}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': `multipart/form-data; boundary = ${data._boundary} `,
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteForumAttachment = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.deleteForumAttachment}`,
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

export const deleteForum = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.deleteForum}`,
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

export const getAllForums = async (query: { search?: string; page?: number; pageSize?: number }): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.getAllForums}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			params: {
				search: query.search,  // Passing the search query as a plain string
				page: query.page,
				pageSize: query.pageSize,
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getForumCategories = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.getForumCategories}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const addOrRemoveFileToFavorite = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.addOrRemoveFileToFavorite}`,
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

export const checkIsFavoriteFile = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.checkIsFavoriteFile}`,
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

export const deleteUserFile = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.deleteUserFile}`,
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

export const getFavoriteFiles = async (id: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.getFavoriteFiles(id)}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getFileDetails = async (id: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.getFileDetails(id)}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const createFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.createFolder}`,
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


export const getFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	try {
		const response = await axios.get(`${baseURL}${fileManager.getFolder(data.userId)}`, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: {
				parentFolderId: data.folderId,
				role: data.role
			}
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};


export const updateFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.updateFolder(data.folderRenameId)}`,
			method: 'put',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
export const deleteFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.deleteFolder}`,
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

export const getFileTypes = async (userId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.getFileTypes(userId)}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getFilesWithParams = async (search?: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.getFilesWithParams}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
			params: {
				search
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const downloadZipFile = async (folderId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	try {
		const response = await axios.request({
			url: `${baseURL}${fileManager.downloadZipFile(folderId)}`,
			method: 'get',
			responseType: 'blob', // Important to handle binary data
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const RecoverFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.RecoverFolder(data.folderId)}`,
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

export const RecoverFile = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.RecoverFile(data.fileId)}`,
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

export const deleteFolderPermanently = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.deleteFolderPermanently}`,
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

export const deleteFilePermanently = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.deleteFilePermanently}`,
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

export const GetRecycledFilesAndFolders = async (userId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.GetRecycledFilesAndFolders(userId)}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getFilesByFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.getFilesByFolder}`,
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

export const fileUpload = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.fileUpload}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': `multipart/form-data; boundary = ${data._boundary} `,
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getListOfContributors = async (id: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.getListOfContributors(id)}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getSingleFolder = async (id: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${fileManager.getSingleFolder(id)}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllBlogs = async (): Promise<any> => {
	const token = Cookies.get('session_token');

	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${blog.blogs}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`

			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getCommonHeader = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${commonHeader.header}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`

			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
}

export const getCommonFooter = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${commonFooter.footer}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`

			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
}

export const getCommonStates = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${commonStates.states}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`

			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const addUpdateCommonStates = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${commonStates.addStates}`, formData, {
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

export const deleteCommonStates = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${commonStates.deleteStates}`,
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

// state data && grades start
export const getAllGrades = async (searchTerm: string = ''): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${grade.getAllGrades}`,
			method: 'get',
			params: {
				searchTerm: searchTerm
			},
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
export const getAllStates = async (searchTerm: string = ''): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${state.getAllStates}`,
			method: 'get',
			params: {
				searchTerm: searchTerm
			},
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
export const getAllExamType = async (searchTerm: string = ''): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${examType.getAllExamType}`,
			method: 'get',
			params: {
				searchTerm: searchTerm
			},
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
// state data && grades & examType end

// get payments
export const getAllPayments = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${payment.getAllPayments}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

// here make a common api
export const getAllComplexity = async (searchTerm: string = ''): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${complexity.getAllComplexity}`,
			method: 'get',
			params: {
				searchTerm: searchTerm
			},
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllSubjects = async (searchTerm: string = ''): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${subject.getAllSubjects}`,
			method: 'get',
			params: {
				searchTerm: searchTerm
			},
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const GetAllTests = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testAdmin.getAllTests}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},


		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const GetAllPackage = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packages.getAllPackage}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const GetAllPackageEssay = async (data: { userId: string, packageId: string }): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packageEssay.getAllEssay}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				...data
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const GetSubmitPackageEssay = async (userId?: any): Promise<any> => {
	const token = Cookies.get('session_token');
	const url = userId
		? `${baseURL}${essay.getSubmitPackageEssay}?userId=${userId}`
		: `${baseURL}${essay.getSubmitPackageEssay}`;
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: url,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const GetPackageEssayById = async (essayId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${essay.getPackageEssayById}/${essayId}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const updatePackageEssay = async (essayId: any, data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${essay.updatePackageEssay}/${essayId}`,
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
