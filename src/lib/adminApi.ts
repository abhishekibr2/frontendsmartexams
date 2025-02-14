import axios from 'axios';
import Cookies from 'js-cookie';
import { ADMIN } from '@/constants/API/adminApi';
import { API_BASE_URL } from '@/constants/ENV';
import Email from 'next-auth/providers/email';

const baseURL = API_BASE_URL;
const { AddFeedBack, blog, profile, author, setting, user, dashboard, role, contactUs, eBook, documentation, testimonial, state, subject, examType, grade, complexity, testConducted,
	packageEssay, packages, testAdmin, addFaqs, questionsAdmin, allOrders, homeBanner, duration, email, termsAndCondition, packageType, whyChooseUs, tutorialClass, privacyPolicy } = ADMIN;
export const getAllBlogs = async (searchTerm: string = ''): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${blog.getAllBlogs}`,
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

export const addUpdateBlogDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${blog.addUpdateBlogDetails}`, formData, {
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

export const deleteBlog = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${blog.deleteBlog}`,
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

export const getAllAuthors = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${author.getAllAuthors}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteAuthor = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${author.deleteAuthor}`,
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

export const updateAuthor = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${author.updateAuthor}`,
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

export const updateBrandDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.updateBrandDetails}`,
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

export const getSingleBrandDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.getSingleBrandDetails}`,
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

export const deleteBrandLogo = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.deleteBrandLogo}`,
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

export const updatePaymentDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.updatePaymentDetails}`,
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

export const updateSEODetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.updateSEODetails}`,
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

export const updateSocialLinks = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.updateSocialLinks}`,
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

export const updateSignature = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.updateSignature}`,
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

export const updateProfileDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${profile.updateProfileDetails}`,
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

export const updatePassword = async (userId: any, updatedData: any) => {
	try {
		const token = Cookies.get('session_token');
		const res = await axios.put(
			`${baseURL}${profile.updatePassword(userId)}`,
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

export const saveStickyNote = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${dashboard.saveStickyNote}`,
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

export const deleteStickyNote = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${dashboard.saveStickyNote}`,
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


export const getAllUsers = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${dashboard.getAllUsers}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};



export const changeStatus = async (data: any): Promise<any> => {

	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${dashboard.status}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
export const getAllRoles = async (search?: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${role.getAllRoles}`,
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

export const addUpdateRoleDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${role.addUpdateRoleDetails}`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteRole = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${role.deleteRole}`,
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


export const addUpdateUser = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${user.addUpdateUser}`,
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

export const deleteUser = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${user.deleteUser}`,
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

export const updateEmailTemplate = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.updateEmailTemplate}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				// 'Content-Type': `multipart/form-data; boundary = ${data._boundary} `,
				Authorization: `Bearer ${token} `
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllEmailTemplates = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.getAllEmailTemplates}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllContactUs = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${contactUs.getAllContactUs}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteContactUs = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${contactUs.deleteContactUs}`,
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

export const addUpdateHeaderData = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.addUpdateHeaderData}`,
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

export const getHeaderMenus = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.getHeaderMenus}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const updateOrderOfMenu = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.updateOrderOfMenu}`,
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

export const updateFooterOrderOfMenu = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.updateFooterOrderOfMenu}`,
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


export const addUpdateFooterData = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.addUpdateFooterData}`,
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

export const getFooterMenus = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.getFooterMenus}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const deleteHeaderMenu = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.deleteHeaderMenu}`,
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

export const deleteFooterMenu = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.deleteFooterMenu}`,
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

export const addUpdateKnowledgeBase = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${documentation.addUpdateKnowledgeBase}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getKnowledgeBase = async (search?: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${documentation.getKnowledgeBase}`,
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
	})
}


export const updateKnowledgeBaseOrder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${documentation.updateKnowledgeBaseOrder}`,
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

export const deleteKnowledgeBase = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${documentation.deleteKnowledgeBase}`,
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

export const getAllDocumentations = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${documentation.getAllDocumentations}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
};

export const getReceipt = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${documentation.getReceipt}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getAllChatSettings = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.getAllChatSettings}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const updateChatSettings = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${setting.updateChatSettings}`,
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

export const getDashboardCounts = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${dashboard.dashboardCounts}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getUserCountByMonthYear = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${dashboard.getUserCountByMonthYear}`,
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

// here testimonial
export const addUpdateTestimonial = async (formData: FormData): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${testimonial.addUpdateTestimonial}`, formData, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': `multipart/form-data; boundary=${formData}`,
				Authorization: `Bearer ${token}`
			},
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllTestimonials = async (searchTerm: string = ''): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testimonial.getAllTestimonials}`,
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

export const deleteTestimonials = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testimonial.deleteTestimonials}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				data
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

export const addUpdateStateDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${state.addUpdateStateDetails}`, formData, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteState = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${state.deleteState}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		// req.then((res) => resolve(res.data)).catch((err) => reject(err));
		req.then((res) => resolve(res.data))
			.catch((err) => {
				if (err.response) {
					reject(err.response.data);
				} else {
					reject({ message: err.message });
				}
			});
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

export const addUpdateSubjectDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${subject.addUpdateSubjectDetails}`, formData, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteSubject = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${subject.deleteSubject}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data))
			.catch((err) => {
				if (err.response) {
					reject(err.response.data);
				} else {
					reject({ message: err.message });
				}
			});
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

export const addUpdateExamTypeDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${examType.addUpdateExamTypeDetails}`, formData, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteExamType = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${examType.deleteExamType}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		// req.then((res) => resolve(res.data)).catch((err) => reject(err));
		req.then((res) => resolve(res.data))
			.catch((err) => {
				if (err.response) {
					reject(err.response.data);
				} else {
					reject({ message: err.message });
				}
			});
	});
};



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

export const addUpdateGradeDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${grade.addUpdateGradeDetails}`, formData, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteGrade = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${grade.deleteGrade}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data))
			.catch((err) => {
				if (err.response) {
					reject(err.response.data);
				} else {
					reject({ message: err.message });
				}
			});
	});
};


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

export const addUpdateComplexityDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${complexity.addUpdateComplexityDetails}`, formData, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteComplexity = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${complexity.deleteComplexity}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data))
			.catch((err) => {
				if (err.response) {
					reject(err.response.data);
				} else {
					reject({ message: err.message });
				}
			});
	});
};



export const getAllTestConducted = async (searchTerm: string = ''): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testConducted.getAllTestConduct}`,
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

export const addUpdateTestConductedDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${testConducted.addUpdateTestConductDetails}`, formData, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteTestConducted = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testConducted.deleteTestConduct}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data))
			.catch((err) => {
				if (err.response) {
					reject(err.response.data);
				} else {
					reject({ message: err.message });
				}
			});
	});
};

export const getAllPackageEssay = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packageEssay.getAllPackageEssay}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: data
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const addUpdatePackageEssayDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${packageEssay.addUpdatePackageEssayDetails}`, formData, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deletePackageEssay = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packageEssay.deletePackageEssay}`,
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


export const addPackagesDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packages.addPackagesDetails}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
				Authorization: `Bearer ${token}`
			},
			data: formData
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const GetAllPackages = async (id?: string, orderBy: string = 'newest', values = {}, pageSize = 10): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packages.getPackages}${id ? `?id=${id}` : ''}`,
			method: 'get',
			params: {
				id,
				orderBy,
				limit: pageSize,
				...values
			},
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const AssignPackage = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packages.assignPackage}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: data

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const DeletePackage = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packages.deletePackage}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				data
			}

		});
		req.then((res) => resolve(res.data))
			.catch((err) => {
				if (err.response) {
					reject(err.response.data);
				} else {
					reject({ message: err.message });
				}
			});
	});
};

export const PublishPackages = async (formData: FormData): Promise<any> => {
	const token = Cookies.get('session_token');
	return axios
		.request({
			url: `${baseURL}${packages.PublishPackage}`,
			method: 'post',
			headers: {
				Authorization: `Bearer ${token}`,

			},
			data: formData,
		})
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});
};



export const AddFeedBackUser = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${AddFeedBack.feedBack}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				data
			}

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const AddFeedPackageFeedBack = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${AddFeedBack.packageFeedBack}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				data
			}

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const AddFeedQuestionFeedBack = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${AddFeedBack.questionFeedback}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				data
			}

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

// eBook addAndUpdate
export const addUpdateEbook = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${baseURL}${eBook.addUpdateEbook}`, formData, {
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

export const getAllEbook = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${eBook.getAllEbook}`,
			method: 'get',

			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteEbook = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${eBook.deleteEbook}`,
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

export const createTest = async (testData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testAdmin.createTest}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: testData
		});

		req.then((res) => resolve(res.data))
			.catch((err) => reject(err));
	});
};

export const GetAllTests = async (values: any = null): Promise<any> => {
	const token = Cookies.get('session_token');

	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testAdmin.getAllTests}`,
			method: 'get',
			params: values,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getTestsById = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testAdmin.getTestById}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const GetAllQuestionsReport = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${questionsAdmin.getAll}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteTests = async (data: any) => {
	const token = Cookies.get('session_token');
	const req = await axios.request({
		url: `${baseURL}${testAdmin.deleteTests}`,
		method: 'post',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		},
		data: data
	});
	return req.data
}

export const AddQuestions = async (data: {}) => {
	const token = Cookies.get('session_token');
	const req = await axios.request({
		url: `${baseURL}${addFaqs.addFaq}`,
		method: 'post',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		},
		data: {
			data
		}
	});
	return req.data
}

export const getQuestions = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${addFaqs.getFaqs}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},


		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const deleteFaq = async (data: any) => {
	const token = Cookies.get('session_token');
	const reqDelete = await axios.request({
		url: `${baseURL}${addFaqs.deleteFaq}`,
		method: 'post',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		},
		data: {
			data: data
		}
	});
	return reqDelete.data
}

export const getAllEbookOrders = async (page: number, limit: number, searchQuery: string, ebookFilterId: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${allOrders.getAllEbookOrders}?page=${page}&limit=${limit}&searchQuery=${searchQuery}&ebookFilterId=${ebookFilterId}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllPackageOrders = async (page: number, limit: number, searchQuery: string, packageFilterId: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${allOrders.getAllPackageOrders}?page=${page}&limit=${limit}&searchQuery=${searchQuery}&packageFilterId=${packageFilterId}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const TestSInPackage = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packages.test}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const AddDuration = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${duration.addDuration}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getDuration = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${duration.getDuration}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
export const DeleteDuration = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${duration.deleteDuration}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: { data }

		});
		// req.then((res) => resolve(res.data)).catch((err) => reject(err));
		req.then((res) => resolve(res.data))
			.catch((err) => {
				if (err.response) {
					reject(err.response.data);
				} else {
					reject({ message: err.message });
				}
			});
	});
};
export const addHomePageContent = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	try {
		const res = await axios.post('/admin/homepageContent/addHomePageContent', formData, {
			headers: {
				Accept: 'application/json',
				// Let axios set the correct 'Content-Type' for multipart/form-data automatically
				'Authorization': `Bearer ${token}`,
			},
		});

		return res.data;
	} catch (err) {
		throw err;
	}
};

export const addFrontendHomePageContent = async (formData: any): Promise<any> => {
	console.log(formData, 'formData')
	const token = Cookies.get('session_token');
	try {
		const res = await axios.post('/admin/homepageContent/addFrontendHomePageContent', formData, {
			headers: {
				Accept: 'application/json',
				// 'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
				'Content-Type': 'multipart/form-data',
				'Authorization': `Bearer ${token}`,
			},
		});

		return res.data;
	} catch (err) {
		throw err;
	}
};

export const getHomepageContent = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${homeBanner.getHomePage}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const addAndUpdateTermsCondition = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	try {
		const res = await axios.post(`${baseURL}${termsAndCondition.addUpdate}`, formData, {
			headers: {
				Accept: 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		});
		return res.data;
	} catch (err) {
		throw err;
	}
};



export const addEmailPageContent = async (data: {}) => {
	const token = Cookies.get('session_token');
	const req = await axios.request({
		url: `${baseURL}${email.addEmailPage}`,
		method: 'post',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		},
		data: {
			data
		}
	});
	return req.data
}

export const getEmailPageContent = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${email.getEmailPage}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getDataTermsAndCondition = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${termsAndCondition.getDataTermsCondition}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const AddPackageType = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packageType.AddPackageType}`,
			method: 'Post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				data
			}

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const GetPackageType = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packageType.getPackageType}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},


		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};



export const DeletePackageType = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packageType.DeletePackageType}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				data
			}


		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllPackagesForFilter = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${allOrders.getAllPackagesForFilter}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getAllEbooksForFilter = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${allOrders.getAllEbooksForFilter}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getSectionData = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${whyChooseUs.getSectionOne}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}
export const AddSectionOne = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${whyChooseUs.AddSectionOne}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}


export const getSinglePackageInfo = async (packageId: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${packages.getSinglePackageInfo(packageId)}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

// free Ebooks
export const getAllFreeEBooks = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${eBook.getAllFreeEBooks}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));

	})
}


export const AddPrivacyPolicy = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${privacyPolicy.addPrivacyPolicy}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}


export const GetPrivacyPolicy = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${privacyPolicy.getPrivacyPolicy}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})

};

export const AddTutorial = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${tutorialClass.addClass}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: formData
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}
export const GetTutorial = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${tutorialClass.getClass}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			},

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}
// here chat functionality start
export const getContactUsData = async (createdBy: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const url = `${baseURL}${contactUs.getContactUsData(createdBy)}`;
		const req = axios.get(url, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const submitContactUsMessage = async (data: { userId: string, message: string, createdBy: string }): Promise<any> => {
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

// End

// here send  Email
export const sendEmail = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${user.sendEmail}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
