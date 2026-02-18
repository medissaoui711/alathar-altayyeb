
import { Session, Message, AnswerType, FiqhSchool } from '../types';

const STORAGE_KEY = 'faqih_sessions';

// Helper to generate unique IDs
const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

/**
 * Retrieves all sessions from local storage.
 */
export const getSessions = (): Session[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading sessions:", error);
    return [];
  }
};

/**
 * Creates a new session object.
 */
export const newSession = (category: AnswerType, madhab: FiqhSchool): Session => {
  return {
    sessionId: generateId(),
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    category,
    madhab,
    sensitivityLevel: 'Normal',
    messages: []
  };
};

/**
 * Saves a session (new or existing) to local storage.
 * Also simulates backend sync.
 */
const persistSessions = (sessions: Session[]) => {
  if (typeof window === 'undefined') return;
  try {
    // Local Storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    
    // Backend Stub (Placeholder for API call)
    // fetch('/api/sessions/sync', { method: 'POST', body: JSON.stringify(sessions) });
  } catch (error) {
    console.error("Error saving sessions:", error);
  }
};

/**
 * Adds a message to a specific session and updates timestamps.
 */
export const addMessageToSession = (
  sessionId: string, 
  message: Message, 
  sensitivityUpdate?: 'Normal' | 'High' | 'Critical'
): Session[] => {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.sessionId === sessionId);

  if (index !== -1) {
    const updatedSession = { ...sessions[index] };
    updatedSession.messages = [...updatedSession.messages, message];
    updatedSession.lastUpdated = new Date().toISOString();
    
    if (sensitivityUpdate) {
      updatedSession.sensitivityLevel = sensitivityUpdate;
    } else if (message.needsEscalation) {
      updatedSession.sensitivityLevel = 'Critical';
    }

    // Move updated session to the top
    sessions.splice(index, 1);
    sessions.unshift(updatedSession);
    
    persistSessions(sessions);
    return sessions;
  }
  return sessions;
};

/**
 * Saves a completely new session or overwrites an existing one in the list.
 */
export const saveSession = (session: Session): Session[] => {
  const sessions = getSessions();
  const index = sessions.findIndex(s => s.sessionId === session.sessionId);
  
  if (index !== -1) {
    sessions[index] = session;
  } else {
    sessions.unshift(session);
  }
  
  persistSessions(sessions);
  return sessions;
};

/**
 * Deletes a session by ID.
 */
export const deleteSession = (sessionId: string): Session[] => {
  const sessions = getSessions();
  const filtered = sessions.filter(s => s.sessionId !== sessionId);
  persistSessions(filtered);
  return filtered;
};

/**
 * Ends a session (Logic can be expanded to lock session, archive it, etc.)
 */
export const endSession = (sessionId: string) => {
  // Currently just ensures it's saved. 
  // In future: could set a 'status': 'closed' flag on the session object.
  const sessions = getSessions();
  const session = sessions.find(s => s.sessionId === sessionId);
  if (session) {
    session.lastUpdated = new Date().toISOString();
    persistSessions(sessions);
  }
};
