
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, FiqhSchool, Session, AnswerType, Message } from '../types';
import { useSessions } from '../hooks/useSessions';

interface DraftIntent {
  type: AnswerType;
  text: string;
  tag?: string;
}

interface FaqihContextType {
  appSettings: AppSettings;
  updateAppSettings: (newSettings: Partial<AppSettings>) => void;
  
  // Session Manager Interface
  sessions: Session[];
  currentSession: Session | null;
  startSession: (category: AnswerType, madhab: FiqhSchool) => Session;
  loadSession: (sessionId: string) => void;
  addMessage: (message: Message) => void;
  deleteSession: (sessionId: string) => void;
  endCurrentSession: () => void;
  
  // Legacy History helpers (mapped to session actions)
  activeChatId: string | null; // Mapped to currentSessionId
  
  // Intent State
  draftIntent: DraftIntent | null;
  setDraftIntent: (intent: DraftIntent | null) => void;
}

const defaultSettings: AppSettings = {
  darkMode: true,
  fontSize: 'medium',
  defaultSchool: FiqhSchool.General,
  notificationsEnabled: true,
  detailLevel: 'detailed',
  aiModel: 'gemini-3-flash-preview'
};

const FaqihContext = createContext<FaqihContextType | undefined>(undefined);

export const FaqihProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- Settings State ---
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    const saved = localStorage.getItem('faqih_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // --- Session Manager Hook ---
  const sessionManager = useSessions();
  
  // --- Quick Actions State (Draft Intent) ---
  const [draftIntent, setDraftIntent] = useState<DraftIntent | null>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('faqih_settings', JSON.stringify(appSettings));
    if (appSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appSettings]);

  const updateAppSettings = (newSettings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <FaqihContext.Provider value={{
      appSettings,
      updateAppSettings,
      
      // Expose Session Manager
      sessions: sessionManager.sessions,
      currentSession: sessionManager.currentSession,
      startSession: sessionManager.startSession,
      loadSession: sessionManager.loadSession,
      addMessage: sessionManager.addMessage,
      deleteSession: sessionManager.deleteSession,
      endCurrentSession: sessionManager.endCurrentSession,
      activeChatId: sessionManager.currentSessionId, // Alias for compatibility
      
      draftIntent,
      setDraftIntent
    }}>
      {children}
    </FaqihContext.Provider>
  );
};

export const useFaqih = () => {
  const context = useContext(FaqihContext);
  if (!context) {
    throw new Error('useFaqih must be used within a FaqihProvider');
  }
  return context;
};
