export type Locale = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface Translations {
  topBar: {
    email: string;
    phone: string;
    switchLanguage: string;
    currentLanguageLabel: string;
    toggleTheme: string;
  };
  navbar: {
    brandName: string;
    brandSlogan: string;
    home: string;
    about: string;
    services: string;
    blog: string;
    contactUs: string;
  };
  hero: {
    title: string;
    tagline1: string;
    tagline2: string;
    tagline3: string;
    description: string;
    learnMore: string;
  };
  audience: {
    mainTitle: string;
    mainTitleLine2: string;
    advertisers: string;
    merchants: string;
    stables: string;
    owners: string;
    visitors: string;
  };
  about: {
    badge: string;
    heading: string;
    subheading: string;
    description: string;
    experienceYears: string;
    experienceLabel: string;
    missionTitle: string;
    missionDesc: string;
    goalsTitle: string;
    goalsDesc: string;
  };
  servicesSection: {
    badge: string;
    heading: string;
    createMarketTitle: string;
    createMarketDesc: string;
    showCamelsTitle: string;
    showCamelsDesc: string;
    liveAuctionsTitle: string;
    liveAuctionsDesc: string;
    liveStreamingTitle: string;
    liveStreamingDesc: string;
  };
  whyUs: {
    badge: string;
    heading: string;
    trustedPlatformTitle: string;
    trustedPlatformDesc: string;
    onlineAuctionsTitle: string;
    onlineAuctionsDesc: string;
    directContactTitle: string;
    directContactDesc: string;
    proDisplayTitle: string;
    proDisplayDesc: string;
    integratedServicesTitle: string;
    integratedServicesDesc: string;
    digitalExperienceTitle: string;
    digitalExperienceDesc: string;
  };
  appDownload: {
    titleLine1: string;
    titleLine2: string;
    description: string;
    googlePlayAlt: string;
    appStoreAlt: string;
  };
  reviewsSection: {
    badge: string;
    heading: string;
    sampleReviewer: string;
    sampleInitials: string;
    sampleReviewText: string;
  };
  blogSection: {
    badge: string;
    heading: string;
    sampleArticleTitle: string;
    sampleDate: string;
    readMoreAlt: string;
  };
  contactSection: {
    firstNameLabel: string;
    firstNamePlaceholder: string;
    lastNameLabel: string;
    lastNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
  };
  footer: {
    description: string;
    quickLinksTitle: string;
    otherInfoTitle: string;
    location: string;
    rights: string;
  };
  common: {
    arabic: string;
    english: string;
    currency: string;
  };
  auth: {
    login: string;
    register: string;
    registerTitle: string;
    registerSubtitle: string;
    loginTitle: string;
    loginSubtitle: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    registerNewAccount: string;
    fullName: string;
    accountType: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    continueToVerification: string;
    identityVerification: string;
    identityVerificationDesc: string;
    guidelinesTitle: string;
    guideline1: string;
    guideline2: string;
    frontId: string;
    backId: string;
    selfieId: string;
    changeImage: string;
    submitVerification: string;
    whatsappOtpTitle: string;
    whatsappOtpDesc: string;
    confirmAndContinue: string;
    resendOtpIn: string;
    resendOtpNow: string;
    pendingApprovalTitle: string;
    pendingApprovalDesc: string;
    checkStatus: string;
    contactSupport: string;
    logout: string;
    reuploadIdentity: string;
    reuploadIdentityDesc: string;
    resetPasswordTitle: string;
    resetPasswordDesc: string;
    newPassword: string;
    confirmNewPassword: string;
    sendResetCode: string;
    backToLogin: string;
    officialPlatform: string;
  };
}
