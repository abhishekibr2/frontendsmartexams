export interface Notification {
	_id: string
	notification: string
	notifyBy?: {
		_id: string
		name: string
		email: string
		image: string
		fullName: string
	}
	notifyTo: string
	url: string
	type: string
	tag?: string
	isRead: string
	status: string
	createdBy: any
	updatedBy: any
	deletedBy: any
	createdAt: string
	updatedAt: string
	deletedAt: string
	__v: number
}

export interface AdminSettings {
	_id?: string | null;
	logo?: string | null;
	logoAltText?: string | null;
	favicon?: string | null;
	faviconAltText?: string | null;
	paymentGateway?: 'paypal' | 'stripe' | 'other' | null;
	paymentMode?: 'test' | 'live';
	stripeTestSecretKey?: string | null;
	stripeTestPublishKey?: string | null;
	stripeLiveSecretKey?: string | null;
	stripeLivePublishKey?: string | null;
	linkedinLink?: string | null;
	twitterLink?: string | null;
	instagramLink?: string | null;
	facebookLink?: string | null;
	websiteUrl?: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy?: string | null;
	createdAt?: Date;
	updatedBy?: string | null;
	updatedAt?: Date;
	deletedBy?: string | null;
	deletedAt?: Date | null;
}

interface Blog {
	slug: string;
	authorId: Author;
	_id: string;
	key?: string;
	title: string;
	status: string,
	description: string;
	address?: string;
	blogViewCount?: number,

	image: string;
	name: string,
	createdAt: string,

}


export interface Author {
	_id: string;
	name?: string;
	slug?: string;
	gender: 'male' | 'female' | 'other';
	profileImage?: string | null;
	designation?: string | null;
	description?: string | null;
	linkedin?: string | null;
	facebook?: string | null;
	twitter?: string | null;
	instagram?: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy?: string | null;
	createdAt?: Date;
	updatedBy?: string | null;
	updatedAt?: Date;
	deletedBy?: string | null;
	deletedAt?: Date | null;
}
export interface Address {
	street?: string | null;
	building?: string | null;
	city?: string | null;
	zip?: string | null;
	state?: string | null;
	country?: string | null;
	lat?: string | null;
	long?: string | null;
}

export interface SocialLinks {
	twitter?: string | null;
	facebook?: string | null;
	linkedin?: string | null;
	instagram?: string | null;
	website?: string | null;
}

export interface DocumentImage {
	imageType?: string | null;
	imagePath?: string | null;
}

export interface MetaTags {
	metaTitle?: string | null;
	metaDescription?: string | null;
}

export interface User {
	find(arg0: (r: any) => boolean): unknown;
	_id?: string | null;
	userId: string
	firstName: string;
	fullName: string;
	lastName: string;
	email: string;
	role: 'superadmin' | 'admin' | 'guest' | 'staff' | 'student' | 'user';
	roleId: any | null;
	hotelId: string | null;
	departmentId: string | null;
	loginTime: string | null;
	checkoutTime: string | null;
	checkInDate: string | null;
	checkOutDate: string | null;
	slug?: string | null;
	password?: string | null;
	isShowEmail: boolean;
	isEmailVerified: boolean;
	phoneNumber: string;
	phone?: string | null;
	isShowPhoneNumber: boolean;
	isPhoneVerified: boolean;
	designation?: string | null;
	companyName?: string | null;
	passwordUpdatedAt?: Date | null;
	gender: 'male' | 'female' | 'other';
	profileImage?: string | null;
	// dob: Date | null;
	dob: any;
	bio?: string | null;
	about?: string | null;
	age?: number | null;
	isApproved: boolean;
	otp?: number | null;
	profileViewCount: number;
	planId?: number | null;
	document?: DocumentImage[];
	address: Address;
	socialLinks: SocialLinks;
	metaTags: MetaTags;
	subscriptionExpiryDate?: Date | null;
	stripeCustomerId?: string | null;
	stickyNote?: string | null;
	timeZone?: any;
	paymentMethod?: string | null;
	lastSeen?: Date;
	isOnline: 'yes' | 'no';
	twoFactorAuth: 'enabled' | 'disabled';
	loginTypeGoogle?: string | null;
	loginType?: string | null;
	isReported: boolean;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy?: string | null;
	createdAt?: string;
	updatedBy?: string | null;
	updatedAt?: Date | null;
	deletedBy?: string | null;
	deletedAt?: Date | null;
	name: string;
	roomName: string;
	totalAmount: string;
	arrival: string;
	token: string;
	image: string;
	chatStatus: string;
	block?: string | null;
	isAdmin: boolean;
	key: string;
	country: string;
	state: any;
	city: string;
	fatherName: string;
	course: string;
	referCode: string;
}

export type Country = {
	id: number;
	country_name: string;
	slug: string;
	flag: string;
	currency: string;
	capital: string;
	status: 'active' | 'inactive';
	created_at: string;
	updated_at: string;
};

export type City = {
	id: string;
	city_name: string;
	country_name: string;
	country_id: string;
	status: string;
};

export type ErrorsLogs = {
	error_message: string;
	id: string;
	file_name: string;
	line_number: string;
};

export type PaginationMeta = {
	current_page: number;
	path: string;
	from: number;
	last_page: number;
	per_page: number;
	to: number;
	total: number;
};

export type File = {
	created_at: string;
	name: string;
	size: number;
	source: string;
	thumbnail: string;
	type: string;
	updated_at: string;
	uuid: string;
};

export type Roles = {
	_id: any;
	roleName: string;
	permissions: {
		dashboard: boolean;
		stays: boolean;
		properties: boolean;
		promotions: boolean;
		guest: boolean;
		staff: boolean;
		blogs: boolean;
		ratesAndAvailability: boolean;
		tickets: boolean;
		frontDesk: boolean;
		calendar: boolean;
		roles: boolean;
		[key: string]: boolean;
	};
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy?: string;
	updatedBy?: string;
	deletedBy?: string;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string;
};

export type Hotel = {
	_id?: string | null;
	hotelName: string | null;
	slug: string | null;
	hotelImage: string | null;
	email: string | null;
	contactNumber: string | null;
	website: string | null;
	location: string | null;
	lat: number | null;
	long: number | null;
	numberOfEmployees: number | null;
	description: string | null;
	linkedIn: string | null;
	twitter: string | null;
	facebook: string | null;
	instagram: string | null;
	managerUserId: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy: string | null;
	createdAt: Date;
	updatedBy: string | null;
	updatedAt: Date;
	deletedBy: string | null;
	deletedAt: Date;
};

export type RoomType = {
	_id?: string | null;
	roomType: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy: string | null;
	createdAt: Date;
	updatedBy: string | null;
	updatedAt: Date;
	deletedBy: string | null;
	deletedAt: Date;
};

export type Amenities = {
	amenityNames: any;
	image: string;
	_id?: string | undefined;
	name: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy: string | null;
	createdAt: Date;
	updatedBy: string | null;
	updatedAt: Date;
	deletedBy: string | null;
	deletedAt: Date;
};

export interface Image {
	imagePath: string | null;
	isPrimary: boolean;
	status: 'active' | 'inactive' | 'deleted';
}

export type Rooms = {
	checkInDate: string;
	checkOutDate: string;
	_id: string;
	hotelId: string | any;
	roomTypeId: string | null;
	roomName: string | null;
	roomTypeName: string | null;
	floor: number | null;
	location: string | null;
	description: string | null;
	images: Image[];
	bedType: string | null;
	amenityNames: string[];
	amenities: string[]; // You may need to adjust this based on your use case
	status: 'available' | 'booked' | 'maintenance' | 'reserved';
	createdBy: string | null;
	createdAt: Date;
	updatedBy: string | null;
	updatedAt: Date;
	deletedBy: string | null;
	deletedAt: Date;
};

export type HotelManager = {
	fullName: string;
	_id: string;
};
export type HotelDetails = {
	hotelName?: string;
	email?: string;
	contactNumber?: string;
	location?: string;
};
export type Department = {
	_id: string;
	departmentName: string;
	status: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	deletedBy: string;
	deletedAt: string;
	__v: number;
};

export interface Contact {
	_id: string;
	name?: string | null;
	email?: string | null;
	address?: string | null;
	phone?: string | null;
	topic?: string | null;
	description?: string | null;
	message: string | undefined;
	status: string;
	createdBy: string;
	created_at: string;
	updatedBy: string;
	updatedAt: string;
	deletedBy: string;
	deletedAt: string;
}

export interface Deal {
	_id?: string;
	dealName?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	promoCode?: string | null;
	daysOfWeek?: {
		sunday?: boolean;
		monday?: boolean;
		tuesday?: boolean;
		wednesday?: boolean;
		thursday?: boolean;
		friday?: boolean;
		saturday?: boolean;
	} | null;
	roomTypeId: {
		_id: string;
		roomType: string;
	};
	minLOS?: number | null;
	maxLOS?: number | null;
	cutOff?: number | null;
	lastMinuteBooking?: number | null;
	closeToArrival?: boolean | null;
	closeToDeparture?: boolean | null;
	discountType?: string | null;
	discountValue?: number | null;
	description?: string | null;
	status: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	deletedBy: string;
	deletedAt: string;
}

export interface Forum {
	_id: string
	id: string
	title: string
	description: string
	attachment: string
	categoryId: CategoryId
	subCategoryId: SubCategoryId
	// userId: User
	slug: string
	likes: any[]
	dislikes: any[]
	comments: any[]
	createdAt: string
	updatedAt: string
	__v: number
	viewCount: number
	userId: {
		image: string

	}
}

export interface CategoryId {
	_id: string
	name: string
	description: string
	createdAt: string
	updatedAt: string
	__v: number
}

export interface SubCategoryId {
	_id: string
	name: string
	description: string
	categoryId: string
	createdAt: string
	updatedAt: string
	__v: number
}

export interface Count {
	examType: number,
	users: number;
	blogs?: number;
	tickets?: number;
	todos?: number;
	ebook?: any;
	package?: number;
	test?: number;
	questions?: number;
	testConductedBy?: number;
	packageFeedback?: number;
	questionFeedbackModel?: number;
	student?: number;
	testFeedback?: number;
	publishEbookCount?: number;
	PackageSold?: number;
	subjectsCount: number;

}

export interface TicketData {
	_id: string
	title: string
	description: string
	status: string
	priority: string
	creator?: {
		_id: string
		name: string
		email: string
	},
	chatId: ChatId
	image?: string
	attachments: any[]
	createdAt?: Date | undefined
	updatedAt: string
	__v: number
}

export interface TicketParams {
	role?: string | undefined;
	userId?: string | undefined;
	page?: number | undefined;
	pageSize?: number | undefined;
	status?: string | undefined;
	search?: string | undefined;
}

export interface ForumCategory {
	_id: string
	name: string
	description: string
	createdAt: string
	updatedAt: string
	__v: number
}

export interface ForumSubCategory {
	_id: string
	name: string
	description: string
	categoryId: string
	createdAt: string
	updatedAt: string
	__v: number
}

export interface AllCategories {
	categories: ForumCategory[]
	subCategories: ForumSubCategory[]
}

export interface ChatId {
	_id: string
	chatName: string
	isGroupChat: boolean
	users: string[]
	deleteFor: any[]
	favourites: any[]
	groupAdmin: string
	isApproved: boolean
	isMute: boolean
	markRead: any[]
	createdAt: string
	updatedAt: string
	__v: number
}

export interface TodoType {
	_id: string
	title: string
	description: string
	status?: string;
	category?: string;
	searchQuery?: string;
	priority: string
	assignedDate: string
	targetDate: string
	createdBy: User
	assignedTo: string[]
	chatId: ChatId
	recurrenceType: string
	__v: number
	googleEventId: string

}

export interface SubMenu {
	title: string
	link: string
}

export interface HeaderMenu {
	_id: string
	key: string
	userId: string
	title: string
	link: string
	subMenu: SubMenu[]
	order: number
	createdAt: string
	updatedAt: string
	__v: number
}

export interface FooterMenu {
	_id: string
	key: string
	userId: string
	title: string
	link: string
	subMenu: SubMenu[]
	order: number
	createdAt: string
	updatedAt: string
	__v: number
}

export interface chatSetting {
	_id: string
	showOnline: boolean
	showTodo: boolean
	showInformation: boolean
	showZoomCall: boolean
	showSticky: boolean
	showGroup: boolean
	showBookMark: boolean
	allowDeleteChat: boolean
	allowEditChat: boolean
	allowClearChat: boolean
	showSharedFiles: boolean
	showPhotosAndMedia: boolean
	showScheduledMessage: boolean
	showBookmarkMessage: boolean
	showMeeting: boolean
	showFavorite: boolean
	__v: number
	allowCreateGroup: boolean
	enableZoomRecording: boolean
}

export interface knowledgeBase {
	_id: string;
	title: string;
	description: string;
	content: string;
	userId: string;
	baseId: string;
	youtubeLink: string;
	category: string
}
export interface Subject {
	DurationTime: any
	_id: any
	subjectName: string
	status?: any;
	createdAt: string
	updatedAt: string
	__v: number
}

export interface Duration {
	DurationTime: string
	_id: any
	duration: string
	durationOption: ['days', 'weeks', 'months', 'years'],
	calculatedTime: Date,
	status?: any;
	createdAt: string
	updatedAt: string

}

export interface ExamType {
	_id: any
	examType: string
	status?: any;
	createdAt: string
	updatedAt: string
	__v: number
	stateId: {
		_id: string
		title: string
	};
	complexityId: {
		_id: string
		complexityId: string,
		complexityLevel: string
	};
	eligibility: string;
	duration: string;
	onlineAvailability: string;
	testSubjects: string;
	Title: string;

}

export interface Grade {
	_id: any
	gradeLevel: string
	status?: any;
	createdAt: string
	updatedAt: string
	__v: number
}

export interface Complexity {
	_id: any
	complexityLevel: string
	status?: any;
	createdAt: string
	updatedAt: string
	__v: number
}

export interface TestConductBy {
	_id: any
	name: string
	status?: any;
	createdAt: string
	updatedAt: string
	__v: number
}

export interface PackageEssay {
	_id: string;
	title: string
	packageFilter?: any
	packageId: {
		packageId: string
		_id: string
		packageName: string
	}
	essayName: string;
	essayType: string
	duration: number
	addedTotalEssay: number
	status?: any;
	createdAt: string
	updatedAt: string
	__v: number
}
export interface PackageEssaySubmit {
	_id: string;
	title: string
	packageId: string
	essayName: string
	essayType: string
	duration: number
	addedTotalEssay: number
	status?: any;
	createdAt: string
	updatedAt: string
	__v: number
	[key: string]: any;
}

export interface Feature {
	_id: string;
	featureName: string;
	availability: "available" | "unavailable";
}

export interface Package {
	orderSummary: any
	status: string
	_id: string;
	id?: string;
	name?: string;
	packageValidity: {
		calculatedTime: string
	}
	packageId: {
		tests: any,
		_id: string,
		packageName: string,
		numTests: number,
		essayTypes: number,
	};
	packageName: string;
	packageDescription: string;
	packagePrice: string;
	packageDiscount: string;
	packageDiscountPrice: string;
	adminComment: string;
	discountApplied: string;
	packageDuration: any;
	state: {
		_id: string
		stateId: string,
		title: string;
	};
	grade: {
		_id: string
		gradeLevel: string
	};
	examType: {
		_id: string
		examType: string
	};
	numSubjects: string;
	subjectsInPackage: Subject[]
	assignTest: Test[];
	testType: string;
	qualityChecked: string;
	numTests: number;
	totalEssayCount: number;
	isFree: string;
	isPublished: string;
	numUniqueSubjects: number;
	assignedTo: string;
	packageStatus: string;
	testConductedBy: {
		_id: string
		name: string
	};
	hasEssay: string | null;
	hasPackage: string;
	packageImage: string | null;
	createdAt: string;
	updatedAt: string;
	tests: Test[];
	features: Feature[];
	compareAtPrice: string;
	packageColor: string;
	tag: string;
	__v: number;
}

export interface Question {
	_id: string
	comprehensionId: any
	complexityId: any
	subjectId: any
	gradeId: any
	examTypeId: any
	questionOptions: QuestionOption[]
	createdById: any
	questionText: string
	questionType: string
	topic: string
	subTopic: string
	hasImage: boolean
	qualityChecked: boolean
	status: string
	isArchived: boolean
	answerFeedback: string
	createdAt: string
	explanation: string
	updatedAt: string
	__v: number
}

export interface QuestionOption {
	_id: string
	title: string
	isCorrect: boolean
	hasImage: boolean
	createdAt: string
	updatedAt: string
	__v: number
}

export interface Comprehension {
	_id: string
	paragraph: string
	topic: string
	subTopic: string
	subjectId: string
	gradeId: string
	examTypeId: string
	complexityId: string
	questionId: Question[]
	status: string
	hasImage: boolean
	qualityChecked: boolean
	totalQuestions: number
	createdAt: string
	updatedAt: string
	__v: number
}

export interface QuestionAndComprehension {
	_id: string;
	comprehensionId: string | null;
	complexityId: string | null;
	subjectId: string;
	gradeId: string;
	examTypeId: string;
	questionOptions: QuestionOption[];
	createdById: string;
	questionText: string;
	questionType: 'multipleChoice' | 'trueFalse' | 'multipleResponse' | 'comprehension';
	topic: string;
	subTopic: string;
	answerFeedback: string;
	paragraph: string;
	totalQuestions: number;
	questionId: Question[];
	isArchived: boolean
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	hasImage: boolean;
	qualityChecked: boolean;
	explanation: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

// here EBook Types
export interface State {
	_id: string;
	title: string;
	description: string;
	status: string;
	createdBy: string;
	updatedBy: string | null;
	createdAt: string;
	updatedAt: string | null;
}
export interface EBook {
	title: string;
	examType: string;
	description: string;
	subject: string;
	photo: any;
	grade: string;
	state: string;
	authorText: string;
	price: number;
	discount: number;
	discountedPrice: number;
	isFree: string;
	isFeatured: string;
	status: string;
	examTypeId: ExamType,
	stateId: State;
	subjectId: Subject
	gradeId: Grade
	[key: string]: any;

}



export interface CustomMenuItem {
	key: string;
	label: React.ReactNode;
	children?: CustomMenuItem[];
	_id: string;
	title: string;
}

export interface Test {
	examType: string;
	_id: string;
	key: string;
	testName: string;
	testDisplayName: string;
	testDescription: string;
	questionCount: number;
	questionOrder: string[],
	introduction: string,
	onlineAvailability: string,
	maxQuestions: any
	packageName: { packageName: string },
	state: { title: string },
	qualityChecked: boolean;
	isPublished: boolean;
	totalAddedQuestion?: number;
}

export interface TestPacksProps {
	menuItemdata: CustomMenuItem[];
	allData: any[];
	stateDataExam: any[];
	homepageContent?: HomeFormValues | undefined;

}

export interface CartData {
	cart: {
		coupon: {
			isCouponApplied: boolean
			couponCode: string
			discountPercentage: number
		},
		_id: string
		userId: string
		package: {
			packageId: {
				_id: string
				packageName: string
				packageDescription: string
				packagePrice: string
				packageDiscount: string
				packageDiscountPrice: string
				packageDuration: {
					_id: string
					DurationTime: string
					calculatedTime: Date
				}
			}
			quantity: string
			_id: string
		}[]
		eBook: {
			eBookId: {
				_id: string
				title: string
				description: string
				price: string
				discount: string
			}
			quantity: string
			_id: string
		}[]
	}
	packageDetails: {
		itemTotal: string
		discount: string | number
		totalAfterDiscount: string
		couponDiscount: string
	}
	eBookDetails: {
		itemTotal: string
		discount: string | number
		totalAfterDiscount: string
	}
	subTotal: string
	tax: string
	totalAmount: string
}

export interface OrderDetail {
	orderSummary: {
		coupon: {
			isCouponApplied: boolean
			couponCode: string
			discountPercentage: number
			totalCouponDiscount: number
		},
		package: {
			packageId: string
			packageName: string
			packagePrice: number
			packageDiscountPrice: number
			packageDiscount: number
			packageQuantity: number
			packageValidity: {
				durationTime: string
				calculatedTime: Date
			},
			_id: string
		}[]
		eBook: {
			eBookTitle: string
			eBookDescription: string
			eBookPrice: number
			eBookDiscount: number
			eBookDiscountPrice: number
			eBookQuantity: number
			_id: string
		}[]
		subTotal: number
		tax: number
		totalAmount: number
		paymentMethod: any
		paymentStatus: string
	}
	_id: string
	firstName: string
	lastName: string
	country: string
	streetAddress1: string
	streetAddress2: string
	townCity: string
	state: string
	zipCode: string
	phone: string
	email: string
	userId: {
		_id: string;
		name: string;
		lastName: string;
		email: string;
		image: string;
	};
	paymentIntentId?: string
	clientSecret?: string
	stripeCustomerId: any
	paymentMethodId?: string
	currency: string
	transactionStatus: string
	status: string
	createdAt: string
	updatedAt: string
	__v: number
}

export interface packageData {
	_id: string;
	packageId: {
		packageName: string;
		_id: string;
	};
	state: {
		title: string;
	};
	price: number;
	examType: {
		examType: string;
	};
	description: string;
	packageName: string;
	duration: {
		DurationTime: string;
	};
	packageImage: any[];
	stateId: {  // Updated from 'state'
		_id: string;
		title: string;
		description: string;
		status: string;
		createdAt: string;
		updatedAt: string;
	};
	examTypeId: {  // Updated from 'examType'
		_id: string;
		examType: string;
		eligibility: string;
		duration: number;
		onlineAvailability: string;
		testSubjects: string;
		status: string;
		createdAt: string;
		updatedAt: string;
	};
	package: any

}

export interface HomeFormValues {
	_id?: any;
	image: any;
	heading: string;
	startTime: string;
	endTime: string;
	description: string;
	secondHeading: string;
	couponCode: String;
	discount: any;

	headingOne: string;
	descriptionOne: string;
	imageOne: string;
	buttonOne: string;

	headingTwo: string;
	subHeadingTwo: string;
	sectionTwoTitleOne: string;
	sectionTwoTitleTwo: string;
	sectionTwoTitleThree: string;
	sectionTwoTitleFour: string;
	sectionTwoTitleFive: string;
	sectionTwoTitleSix: string;
	sectionTwoImageOne: any;
	sectionTwoImageTwo: any;
	sectionTwoImageThree: any;
	sectionTwoImageFour: any;
	sectionTwoImageFive: any;
	sectionTwoImageSix: any;

	headingThree: string;
	subHeadingThree: string;
	descriptionThree: string;
	stateHeading: string;

	headingFour: string;
	descriptionFour: string;
	cardTextOne: string;
	cardTextTwo: string;
	cardTextThree: string;
	cardTextFour: string;
	cardCountOne: string;
	cardCountTwo: string;
	cardCountThree: string;
	cardCountFour: string;
	[key: string]: any;
}

export interface ContentItem {
	title: string;
	image: any[];
}

export interface PracticePackage {
	_id: string
	packageName: string
	packageDescription: string
	packagePrice: string
	packageDiscountPrice: string
	packageDiscount?: string
	packageImage?: string
	adminComment: string
	packageType: string
	discountApplied: any
	packageDuration: {
		_id: string
		DurationTime: number
	}
	state: {
		_id: string
		title: string
	}
	grade: string
	tests: any[]
	examType: {
		_id: string
		examType: string
	}
	numSubjects: any
	subjectsInPackage: string[]
	testType: any
	qualityChecked: string
	numTests: number
	isFree: string
	isPublished: any
	isActive: string
	numUniqueSubjects: any
	assignedTo: any
	status: string
	testConductedBy: string
	essayTypes: number
	hasEssay: string
	hasPackage: any
	assignTest: any[]
	createdAt: string
	updatedAt: string
	__v: number
}

export interface SubmitEssay {
	_id: string;
	packageId: string;
	packageEssayId: {
		_id: string;
		essayName: string;
	};
	description: string;
	comment: any;
	comments: any;
	createdAt: string;
	userId?: string; // ID of the user who made the comment
	isAdmin?: boolean; // Indicates if the comment was made by an admin
	userName?: string;
}

export interface ContactUs {
	_id: string;
	createdBy: string;
	messages: [
		{
			senderId: {

				_id: string;
				image: string;
				name: string;
			},
			message: string;
			_id: string;
			createdAt: Date;
		}
	]
}


export interface AboutFormValues {
	_id?: any;
	image: any;
	heading: string;
	description: string;
	secondHeading: string;

	headingOne: string;
	descriptionOne: string;
	imageOne: string;
	buttonOne: string;

	headingTwo: string;
	subHeadingTwo: string;
	sectionTwoTitleOne: string;
	sectionTwoTitleTwo: string;
	sectionTwoTitleThree: string;
	sectionTwoTitleFour: string;
	sectionTwoTitleFive: string;
	sectionTwoTitleSix: string;
	sectionTwoImageOne: any;
	sectionTwoImageTwo: any;
	sectionTwoImageThree: any;
	sectionTwoImageFour: any;
	sectionTwoImageFive: any;
	sectionTwoImageSix: any;

	headingThree: string;
	subHeadingThree: string;
	descriptionThree: string;
	stateHeading: string;

	headingFour: string;
	descriptionFour: string;
	cardTextOne: string;
	cardTextTwo: string;
	cardTextThree: string;
	cardTextFour: string;
	cardCountOne: string;
	cardCountTwo: string;
	cardCountThree: string;
	cardCountFour: string;
	[key: string]: any;
}
