import axios from 'axios';
import { FRONTEND } from '@/constants/API/frontendApi';
import { API_BASE_URL } from '@/constants/ENV';

const baseURL = API_BASE_URL;
const { blog, other, forum, testimonial, frontEndHeader, ebook, faq, payment, publishPackage, cart, termsCondition, privacyPolicy, tutorialClass,
	whyChooseUs, state, examType } = FRONTEND;

export const uploadFile = ({ file }: any) => {
	const formData = new FormData();
	formData.append('image', file);

	return axios
		.post(`${baseURL}${blog.upload}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then((res) => res.data)
		.catch((err) => Promise.reject(err));
};

export const getAllBlogs = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${blog.blogs}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getSingleBlog = async (slug: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const url = `${baseURL}${blog.singleBlog(slug)}`;
		const req = axios.request({
			url: url,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const blogViews = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${blog.blogViews}`,
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

export const contactUs = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${other.contactUs}`,
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


export const getHeaderMenus = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${other.headerMenus}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getSingleKnowledgeBase = async (id: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const url = `${baseURL}${other.singleKnowledgeBase(id)}`;
		const req = axios.request({
			url: url,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getSingleForum = async (slug: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const url = `${baseURL}${forum.singleForum(slug)}`;
		const req = axios.request({
			url: url,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const submitForumComment = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.submitForumComment}`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const submitForumVote = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.submitForumVote}`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const submitForumReply = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.submitForumReply}`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const forumQuestionViews = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.forumQuestionViews}`,
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

export const getRelatedForums = async (id: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const url = `${baseURL}${forum.relatedForums(id)}`;
		const req = axios.request({
			url: url,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteComment = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.deleteComment}`,
			method: "post",
			headers: {
				Accept: "application/json"
			},
			data: data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getTestimonial = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testimonial.getAllTestimonial}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const fetchViewsBlogData = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${blog.fetchViewsBlogData}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllForums = async (search?: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.getAllForums}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			},
			params: {
				search
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getForumCategories = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${forum.getForumCategories}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}
export const getCommonHeaderFrontEnd = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.getFrontEndHeaderMenus}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}


export const getCommonFooterFrontEnd = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.getFooter}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getServicesFrontEnd = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.getServices}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getBrandDetails = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.getFrontEndBrandDetails}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}


export const addUpdateHeaderFrontend = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.addUpdateHeaderData}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
//frontend ebooks
export const getAllEbooks = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${ebook.getAllEbooks}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getSingleEbook = async (slug: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const url = `${baseURL}${ebook.getSingleEbook(slug)}`;
		const req = axios.request({
			url: url,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
export const getTestsFrontEnd = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.getTests}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
			},
			data: {
				data
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}



export const getFaq = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${faq.getAllFAQ}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getAllStateWithTheirTests = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.getAllStateWithTheirTests}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getHomepageContent = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/homepageContent/getHomePageContent`,
			// url: `${baseURL}${homepageContent.getHomePageContent}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			}

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllPayments = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${payment.getAllPayments}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getExamTypeFrontEnd = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.getExamTypes}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
			},
			data: {
				data
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getAllTestPacks = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${publishPackage.getAllTestPacks}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
			},
			data: data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllCartItems = async (data: { userId: string, coupon: string, forCheckout: string }): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${cart.getAllCartItems}`,
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

export const addToCartDetails = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${cart.addToCartItem}`,
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

export const removeCartItem = async (data: { userId: string } & ({ packageId: string } | { eBookId: string })): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${cart.removeCartItem}`,
			method: 'delete',
			headers: {
				Accept: 'application/json',
			},
			data: {
				...data,
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getStateWithExamTypes = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.getStateWithExamTypes}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
export const createPaymentIntent = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${payment.createPaymentIntent}`,
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

export const getClientSecret = async (data: { totalAmount: number }): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${payment.getClientSecret}`,
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
}

export const updateCartItemQuantity = async (
	data: { userId: string } & { type: string } & ({ packageId: string } | { eBookId: string })
): Promise<any> => {
	return axios
		.request({
			url: `${baseURL}${cart.updateCartItemQuantity}`,
			method: 'post',
			headers: { Accept: 'application/json' },
			data,
		})
		.then((res) => res.data)
		.catch((err) => {
			throw err;
		});
};

export const confirmProductCheckout = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${payment.confirmProductCheckout}`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data: {
				...data
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getUserOrderDetails = async (userId: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${payment.getUserOrderDetails(userId)}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getTermsCondition = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${termsCondition.getTermsConditionData}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			},

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getStateWithExamTypesWithSlug = async (stateslug: string, examSlug: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.getStateWithExamTypesWithSlug(stateslug, examSlug)}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			},
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const validateCouponCode = async (data: { userId: string, couponCode: string }): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${cart.validateCouponCode}`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data: {
				...data
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const applyCouponCode = async (data: { userId: string, couponCode: string }): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${cart.applyCouponCode}`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data: {
				...data
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}


export const GetPrivacyPolicy = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${privacyPolicy.getPrivacyPolicy}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			},

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
export const getSectionData = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${whyChooseUs.getSectionOne}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			},

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getFaqStateWithExamTypes = async (stateId: string, examId: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${faq.getFaqStateWithExamTypes(stateId, examId)}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			},
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getTestimonialStateWithExamTypes = async (stateId: string, examId: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testimonial.getTestimonialStateWithExamTypes(stateId, examId)}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			},
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getTutorialTestimonials = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testimonial.getTutorialTestimonials}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getWhyChooseUsTestimonials = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${testimonial.getWhyChooseUsTestimonials}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getFooterTests = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${frontEndHeader.getFooterTests}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getSingleCartItem = async (data: { userId: string, packageId: string, coupon: string, forCheckout: string }): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${cart.getSingleCartItem}`,
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


// here states
export const getAllStates = async (searchTerm: string = ''): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${state.getAllStates}`,
			method: 'get',
			params: {
				searchTerm: searchTerm
			},
			headers: {
				Accept: 'application/json'
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
// here examType
export const getAllExamType = async (searchTerm: string = ''): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${baseURL}${examType.getAllExamType}`,
			method: 'get',
			params: {
				searchTerm: searchTerm
			},
			headers: {
				Accept: 'application/json'
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAboutPageContent = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/aboutpageContent/getAboutPageContent`,
			method: 'get',
			headers: {
				Accept: 'application/json',
			}

		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
