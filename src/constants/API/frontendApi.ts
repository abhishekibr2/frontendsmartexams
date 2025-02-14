import { getAllExamType } from "@/lib/adminApi";


export const FRONTEND = {
	blog: {
		upload: '/upload',
		blogs: '/blogs',
		singleBlog: (slug: string) => `/blogs/single/${slug}`,
		blogViews: '/blogs/blogViews',
		fetchViewsBlogData: '/blogs/fetchViewsBlogData'
	},
	other: {
		contactUs: '/contactUs',
		headerMenus: '/menus/header',
		singleKnowledgeBase: (id: string) => `/knowledgeBase/single/${id}`,
	},
	forum: {
		singleForum: (slug: string) => `/forums/single/${slug}`,
		submitForumComment: '/forums/submit-comment',
		submitForumVote: '/forums/submit-vote',
		submitForumReply: '/forums/submit-reply',
		forumQuestionViews: '/forums/forum-views',
		relatedForums: (id: string) => `/forums/related-forums/${id}`,
		deleteComment: '/forums/delete',
		getAllForums: '/forums/get-all-forums',
		getForumCategories: `/forums/get-forums-categories`,

	},
	testimonial: {
		getAllTestimonial: `/testimonials`,
		getTestimonialStateWithExamTypes: (stateId: string, examId: string) => `/testimonials/${stateId}/${examId}`,
		getTutorialTestimonials: `/testimonials/tutorialTestimonials`,
		getWhyChooseUsTestimonials: `/testimonials/whyChooseUsTestimonials`,

	},
	frontEndHeader: {
		getFrontEndHeaderMenus: '/services/menus',
		getFooter: '/services/footer',
		getServices: '/services/allStates',
		getFrontEndBrandDetails: '/services/brandSetting',
		addUpdateHeaderData: '/services/updateMenus',
		getTests: '/services/allTests',
		getAllStateWithTheirTests: '/services/getAllStateWithTheirTests',
		getExamTypes: '/services/allExamTypes',
		getStateWithExamTypes: '/services/getStateWithExamTypes',
		getStateWithExamTypesWithSlug: (stateslug: string, examSlug: string) => `/services/${stateslug}/${examSlug}`,
		getFooterTests: `/services/getAllFooterTests`,

	},


	addUpdateHeaderData: '/services/updateMenus',
	ebook: {
		getAllEbooks: '/ebook',
		getSingleEbook: (slug: string) => `/ebook/single/${slug}`,
	},
	faq: {
		getAllFAQ: '/faqData/Faqs',
		getFaqStateWithExamTypes: (stateId: string, examId: string) => `/faqData/${stateId}/${examId}`,

	},
	payment: {
		getAllPayments: '/payment',
		createPaymentIntent: '/payment/create-payment-intent',
		getClientSecret: '/payment/get-client-secret',
		confirmProductCheckout: `/payment/confirmProductCheckout`,
		getUserOrderDetails: (userId: string) => `/payment/getUserOrderDetails/${userId}`,
	},

	homepageContent: {
		getHomePageContent: '/getHomePageContent'
	},
	publishPackage: {
		getAllTestPacks: '/get-all-test-packs',
		getSinglePackage: (slug: string) => `/package/single/${slug}`,
	},
	cart: {
		getAllCartItems: `/cart/`,
		getSingleCartItem: `/cart/singleCartItemData`,
		addToCartItem: '/cart/addToCartDetails',
		removeCartItem: `/cart/removeCartItem`,
		updateCartItemQuantity: `/cart/updateCartItemQuantity`,
		validateCouponCode: `/cart/validateCouponCode`,
		applyCouponCode: `/cart/applyCouponCode`,
	},
	checkout: {
		getAllCartItems: '/cart',
	},
	termsCondition: {
		getTermsConditionData: '/termsCondition'
	},
	privacyPolicy: {
		getPrivacyPolicy: '/privacyRoute'
	},
	tutorialClass: {
		getClass: '/tutorialClass'
	},
	whyChooseUs: {
		getSectionOne: '/whyChooseUs'
	},
	state: {
		getAllStates: '/state',
	},
	examType: {
		getAllExamType: '/examTypes',
	}

}


