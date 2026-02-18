
export enum MessageRole {
  User = 'user',
  Assistant = 'model'
}

export interface ReferenceData {
  title: string;
  text: string;
  pageOrSource: string;
  status: 'Trusted' | 'Under Review';
}

export type ConfidenceLevel = 'مؤكد' | 'مرجّح' | 'اجتهادي' | 'يحتاج مراجعة بشرية';

export interface MuftiResponse {
  message: string;
  reference?: ReferenceData;
  level: ConfidenceLevel;
  madhhab: string;
  escalation_flag: boolean;
  adaptiveQuestions?: string[];
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  type?: string; // AnswerType
  tag?: string;
  reference?: ReferenceData;
  timestamp: number;
  adaptiveQuestions?: string[];
  
  // New fields for Session Manager
  confidence?: string;
  verificationScore?: number;
  needsEscalation?: boolean;
  metadata?: {
    level?: ConfidenceLevel;
    madhhab?: string;
    escalation?: boolean;
  };
}

export interface Session {
  sessionId: string;
  createdAt: string;
  lastUpdated: string;
  category: string; // AnswerType
  madhab: string; // FiqhSchool
  sensitivityLevel: 'Normal' | 'High' | 'Critical';
  messages: Message[];
}

export enum FiqhSchool {
  General = 'عام',
  Hanafi = 'الحنفي',
  Maliki = 'المالكي',
  Shafii = 'الشافعي',
  Hanbali = 'الحنبلي'
}

export enum AnswerType {
  Fiqh = 'فقه',
  Tafsir = 'تفسير',
  Dreams = 'تفسير أحلام',
  Hadith = 'حديث',
  Khutbah = 'خطبة جمعة'
}

export interface ChatSettings {
  school: FiqhSchool;
  type: AnswerType;
  model?: AIModel;
}

export enum Page {
  Chat = 'chat',
  History = 'history',
  Settings = 'settings',
  HumanReview = 'human_review',
  Library = 'library',
  Privacy = 'privacy',
  Disclaimer = 'disclaimer',
  Contact = 'contact'
}

export type FontSize = 'small' | 'medium' | 'large';
export type DetailLevel = 'brief' | 'detailed';
// Updated model names based on Gemini guidelines: gemini-3-flash-preview and gemini-3-pro-preview
export type AIModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview';

export interface AppSettings {
  darkMode: boolean;
  fontSize: FontSize;
  defaultSchool: FiqhSchool;
  notificationsEnabled: boolean;
  detailLevel: DetailLevel;
  aiModel: AIModel;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: AnswerType;
  description: string;
  era: string;
  importance: string;
}

// Added QuestionTemplate interface to fix compilation error in data/templates.ts
export interface QuestionTemplate {
  id: string;
  label: string;
  sampleQuestion: string;
  type: AnswerType;
  tag?: string;
  warning?: string;
}
