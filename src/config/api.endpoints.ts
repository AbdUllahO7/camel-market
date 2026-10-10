/**
 * قاموس مسارات ونقاط نهاية الـ Backend (API Endpoints Dictionary)
 * مطابق لتوثيق: SUBSCRIPTION_AUCTION_SYSTEM.md & API_REQUESTS_WEB.md
 */

export const API_ENDPOINTS = {
  // 1. المصادقة والحسابات (Auth)
  AUTH: {
    LOGIN: 'Auth/Login',
    REGISTER: 'Auth/Register',
    SEND_OTP: 'Auth/ResendOtp',
    VERIFY_OTP: 'Auth/VerifyOtp',
    RESEND_OTP: 'Auth/ResendOtp',
    FORGOT_PASSWORD: 'Auth/ForgotPassword',
    RESET_PASSWORD: 'Auth/ResetPassword',
    UPDATE_VERIFICATION_FILES: 'Auth/UpdateVerificationFiles',
    GET_MY_VERIFICATION_DATA: 'Auth/GetMyVerificationData',
    REFRESH_TOKEN: 'Auth/RefreshToken',
    LOGOUT: 'Auth/Logout',
    DELETE_ACCOUNT: 'Auth/DeleteMyAccount',
    ME: 'Users/GetMyCustomerProfile',
  },

  // 2. الاشتراكات العامة والباقات والدفع
  SUBSCRIPTION: {
    GET_MY_PLAN: 'Subscription/GetMyPlan',
    GET_CURRENT: 'Subscription/GetCurrentSubscription',
  },

  FEATURE_PLANS: {
    GET_PLANS: 'FeaturePlansManagement/GetPlans',
  },

  PRODUCT_PACKAGES: {
    PURCHASE_PACKAGE: 'ProductPackages/PurchasePackage',
  },

  PAYMENTS: {
    CREATE_SUBSCRIPTION_PAYMENT: 'Payments/CreateSubscriptionPayment',
    CREATE_WALLET_TOPUP_PAYMENT: 'Payments/CreateWalletTopupPayment',
    CHECK_PAYMENT_STATUS_TESTER: 'Payments/CheckPaymentStatusTester',
  },

  // 3. المحفظة
  WALLETS: {
    GET_MY_WALLET: 'Wallets/GetMyWallet',
    GET_MY_TRANSACTION: 'Wallets/GetMyTransaction',
  },

  // 4. التصنيفات والسلالات
  CATEGORIES: {
    GET_ALL: 'Categories/GetAll',
    GET_OPENING_CLOSING: 'Categories/GetCategoriesOpeningClosing',
  },

  BREEDS: {
    GET_ALL: 'Breeds/GetAll',
  },

  // 5. إعلانات ومنتجات سوق الإبل
  LISTINGS: {
    BASE: 'Products/GetProducts',
    BY_ID: (id: string | number) => `Products/GetProductById?id=${id}`,
    CREATE: 'Products/Create',
    UPDATE: (id: string | number) => `Products/Update?id=${id}`,
    DELETE: (id: string | number) => `Products/Delete?id=${id}`,
    MY_LISTINGS: 'Products/GetMyProducts',
  },

  // 6. المزادات والمزايدة
  AUCTIONS: {
    BASE: 'Auctions/GetAuctions',
    BY_ID: (id: string | number) => `Auctions/GetById?id=${id}`,
    PLACE_BID: 'Auctions/PlaceBid',
    CREATE: 'Auctions/Create',
    GET_MY: 'Auctions/GetMyAuctions',
    ACCEPT: (id: string | number) => `Auctions/AcceptAuction?id=${id}`,
    STOP: (id: string | number) => `Auctions/StopAuction?id=${id}`,
    DELETE: (id: string | number) => `Auctions/Delete?id=${id}`,
    GET_FEATURE_PLANS: 'FeaturePlansManagement/GetPlans',
  },

  // 7. مجمع الخدمات
  SERVICES: {
    BASE: '/services',
    BY_CATEGORY: (category: string) => `/services?category=${category}`,
    BY_ID: (id: string) => `/services/${id}`,
    BOOK: '/services/bookings',
    MY_BOOKINGS: '/services/my-bookings',
    VET_CERTIFICATES: (camelId: string) => `/services/vet-certificates/${camelId}`,
  },

  // 8. إدارة الملف الشخصي والمستخدمين
  USER: {
    PROFILE: 'Users/GetMyCustomerProfile',
    GET_STORES: 'Users/GetStores',
    GET_BUSINESS_PROFILE: (userId: string) => `Users/GetBusinessProfileDetails?userId=${userId}`,
    GET_MY_BUSINESS_PROFILE: 'Users/GetMyBusinessProfile',
    GET_MY_ADVERTISER_PROFILE: 'Users/GetMyAdvertiserProfile',
    UPDATE_MY_BUSINESS_PROFILE: 'Users/UpdateMyBusinessProfile',
    UPDATE_MY_PROFILE: 'Users/UpdateMyProfile',
  },

  // 9. تقييمات وآراء العملاء
  REVIEWS: {
    ALL: 'Reviews/GetAllReviews',
    SELLER: 'Reviews/GetSellerReviews',
    AVERAGE: 'Reviews/GetAverage',
    ADD: 'Reviews/Add',
  },

  // 10. الشكاوى والدعم الفني
  COMPLAINTS: {
    CREATE: 'Complaints/Create',
    MY: 'Complaints/GetMy',
    ALL: 'Complaints/GetAll',
  },
} as const;

