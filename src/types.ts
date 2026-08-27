export type PostType =
  | 'job'
  | 'admit_card'
  | 'result'
  | 'answer_key'
  | 'syllabus'
  | 'admission'
  | 'scholarship'
  | 'sarkari_yojana'
  | 'online_form'
  | 'exam_date'
  | 'exam_city'
  | 'notice';

export type PostStatus =
  | 'draft'
  | 'published'
  | 'unpublished'
  | 'featured'
  | 'pinned'
  | 'archived';

export type ComputedStatus =
  | 'UPCOMING'
  | 'APPLY NOW'
  | 'CLOSING SOON'
  | 'APPLICATION CLOSED'
  | 'EXAM UPCOMING'
  | 'ADMIT CARD AVAILABLE'
  | 'RESULT AVAILABLE'
  | 'ANSWER KEY OUT'
  | 'ACTIVE';

export interface ImportantLink {
  id: string;
  name: string;
  btnText: string;
  url: string;
  type: 'apply' | 'notification' | 'admit_card' | 'result' | 'answer_key' | 'syllabus' | 'official' | 'status' | 'other';
  displayOrder: number;
  enabled: boolean;
  openInNewTab: boolean;
  clickCount?: number;
}

export interface VacancyItem {
  id: string;
  postName: string;
  total: string | number;
  general?: string | number;
  obc?: string | number;
  ews?: string | number;
  sc?: string | number;
  st?: string | number;
  qualification?: string;
}

export interface FeeStructure {
  general: string;
  obc: string;
  ews: string;
  sc: string;
  st: string;
  female: string;
  phOrOther: string;
  paymentMode: string;
}

export interface AgeLimit {
  minAge: string;
  maxAge: string;
  asOnDate?: string;
  ageRelaxation: string;
}

export interface Post {
  id: string;
  slug: string;
  type: PostType;
  title: string;
  shortDescription: string;
  category: string; // e.g. "Central Government", "Uttar Pradesh", "Railway", "SSC", "Banking", etc.
  department?: string; // e.g. "Staff Selection Commission (SSC)", "UPSC", "Railway Recruitment Board"
  organization?: string;
  state?: string; // "All India", "Uttar Pradesh", "Bihar", "Delhi", "Rajasthan", etc.
  status: PostStatus;
  manualStatusOverride?: ComputedStatus;

  // Dates
  startDate?: string;
  lastDate?: string;
  feeLastDate?: string;
  correctionDate?: string;
  examDate?: string;
  admitCardDate?: string;
  resultDate?: string;
  answerKeyDate?: string;
  objectionStartDate?: string;
  objectionLastDate?: string;

  // Job / Admission / Scholarship specific
  totalVacancy?: string;
  vacancies?: VacancyItem[];
  feeStructure?: FeeStructure;
  ageLimit?: AgeLimit;
  educationalQualification?: string;
  selectionProcess?: string[]; // CBT, PET, Skill Test, DV, Interview
  salaryPayScale?: string;
  examPattern?: string;
  syllabus?: string;
  requiredDocuments?: string[];
  importantInstructions?: string[];

  // Admit Card / Exam City
  examCity?: string;
  examCenterInfo?: string;

  // Result / Answer key
  cutOffInfo?: string;
  meritListInfo?: string;
  objectionFee?: string;

  // Sarkari Yojana / Scholarship
  benefits?: string[];
  eligibilityCriteria?: string[];
  whoCanApply?: string;
  howToApplySteps?: string[];

  // Links
  importantLinks: ImportantLink[];
  officialSource: {
    websiteName: string;
    websiteUrl: string;
    notificationUrl?: string;
    disclaimer?: string;
  };

  // SEO & Social Meta
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  featuredImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  authorName?: string;
  canonicalUrl?: string;
  robotsIndex?: string;
  schemaType?: string;

  // Metadata
  views: number;
  isFeatured?: boolean;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: PostType;
  description?: string;
  displayOrder: number;
  iconName?: string;
  badgeColor?: string;
  enabled: boolean;
}

export interface Announcement {
  id: string;
  text: string;
  link?: string;
  isPinned: boolean;
  startDate: string;
  endDate: string;
  badge?: string;
  enabled: boolean;
  createdAt: string;
}

export interface ComputerService {
  id: string;
  name: string;
  icon: string;
  description: string;
  turnaroundTime: string;
  requiredDocs: string[];
  feeRange?: string;
  isPopular?: boolean;
  enabled: boolean;
}

export interface Advertisement {
  id: string;
  placement:
    | 'header'
    | 'home_middle'
    | 'post_top'
    | 'post_before_links'
    | 'post_after_links'
    | 'footer'
    | 'sidebar';
  title: string;
  codeHtml: string;
  imageUrl?: string;
  targetUrl?: string;
  enabled: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string; // Can be a Youtube link or hosted video
  contactNumber?: string;
  whatsAppNumber?: string;
  promotionalLink?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  order: number;
}

export interface SiteSettings {
  websiteName: string;
  tagline: string;
  description: string;
  logoText: string;
  whatsAppUrl: string;
  whatsAppNumber: string;
  telegramUrl: string;
  contactNumber: string;
  contactEmail: string;
  address: string;
  timing: string;
  footerText: string;
  metaDescription: string;
  keywords: string;
  homeSectionsOrder: string[];
  enabledSections: { [key: string]: boolean };
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export interface AnalyticsSummary {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  totalViews: number;
  todayViews: number;
  sevenDayViews: number;
  thirtyDayViews: number;
  typeCounts: { [key in PostType]?: number };
  mostViewedPosts: { id: string; title: string; slug: string; type: PostType; views: number }[];
  mostClickedLinks: { linkName: string; postTitle: string; count: number; url: string }[];
  dailyViewsChart: { date: string; views: number }[];
}

export type CommentTag = 'question' | 'tip' | 'update' | 'form_issue' | 'general';

export interface CommentReply {
  id: string;
  authorName: string;
  authorBadge?: string;
  authorLocation?: string;
  isStaff?: boolean;
  content: string;
  createdAt: string;
  likes: number;
}

export interface PostComment {
  id: string;
  postId: string;
  postSlug: string;
  authorName: string;
  authorBadge?: string;
  authorLocation?: string;
  tag: CommentTag;
  content: string;
  createdAt: string;
  likes: number;
  isPinned?: boolean;
  isStaff?: boolean;
  replies: CommentReply[];
}
