export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconSrc?: string;
  iconName?: string;
  link?: string;
  order?: number;
  isActive?: boolean;
}

export interface AboutSectionData {
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
  mainImage?: string;
  smallImage?: string;
}

export interface HeroData {
  title: string;
  tagline1: string;
  tagline2: string;
  tagline3: string;
  description: string;
  buttonText: string;
  heroImage?: string;
}

export interface AudienceCategoryItem {
  id: string;
  title: string;
  iconSrc: string;
  order: number;
}

export interface WhyUsFeatureItem {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  order: number;
}

export interface AppDownloadData {
  titleLine1: string;
  titleLine2: string;
  description: string;
  googlePlayUrl: string;
  appStoreUrl: string;
  imageSrc: string;
}

export interface CustomerReviewItem {
  id: string;
  name: string;
  initials: string;
  rating: number;
  text: string;
  avatarUrl?: string;
  date?: string;
  isActive?: boolean;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug?: string;
  image: string;
  date: string;
  summary?: string;
  author?: string;
  category?: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  message: string;
  ticketId?: string;
}

export interface FooterData {
  description: string;
  email: string;
  phone: string;
  location: string;
  facebookUrl: string;
  instagramUrl: string;
  snapchatUrl?: string;
  rights: string;
}
