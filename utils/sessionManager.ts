
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Session, Message, AnswerType, FiqhSchool } from '../types';

const DB_NAME = 'faqih_database';
const STORE_NAME = 'sessions';
const DB_VERSION = 1;

interface FaqihDB extends DBSchema {
  sessions: {
    key: string;
    value: Session;
    indexes: { 'by-date': string };
  };
}

let dbPromise: Promise<IDBPDatabase<FaqihDB>> | null = null;

if (typeof window !== 'undefined') {
  dbPromise = openDB<FaqihDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'sessionId' });
        store.createIndex('by-date', 'lastUpdated');
      }
    },
  });
}

// Helper to generate unique IDs
const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

/**
 * Retrieves all sessions from IndexedDB, sorted by lastUpdated descending.
 */
export const getSessions = async (): Promise<Session[]> => {
  if (!dbPromise) return [];
  try {
    const db = await dbPromise;
    const sessions = await db.getAllFromIndex(STORE_NAME, 'by-date');
    return sessions.reverse(); // Newest first
  } catch (error) {
    console.error("Error loading sessions from IndexedDB:", error);
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
 * Saves a completely new session or overwrites an existing one in IndexedDB.
 */
export const saveSession = async (session: Session): Promise<Session[]> => {
  if (!dbPromise) return [];
  try {
    const db = await dbPromise;
    await db.put(STORE_NAME, session);
    return await getSessions();
  } catch (error) {
    console.error("Error saving session to IndexedDB:", error);
    return await getSessions();
  }
};

/**
 * Adds a message to a specific session and updates timestamps.
 */
export const addMessageToSession = async (
  sessionId: string, 
  message: Message, 
  sensitivityUpdate?: 'Normal' | 'High' | 'Critical'
): Promise<Session[]> => {
  if (!dbPromise) return [];
  try {
    const db = await dbPromise;
    const session = await db.get(STORE_NAME, sessionId);
    
    if (session) {
      session.messages.push(message);
      session.lastUpdated = new Date().toISOString();
      
      if (sensitivityUpdate) {
        session.sensitivityLevel = sensitivityUpdate;
      } else if (message.needsEscalation) {
        session.sensitivityLevel = 'Critical';
      }
      
      await db.put(STORE_NAME, session);
    }
    return await getSessions();
  } catch (error) {
    console.error("Error adding message to session:", error);
    return await getSessions();
  }
};

/**
 * Deletes a session by ID.
 */
export const deleteSession = async (sessionId: string): Promise<Session[]> => {
  if (!dbPromise) return [];
  try {
    const db = await dbPromise;
    await db.delete(STORE_NAME, sessionId);
    return await getSessions();
  } catch (error) {
    console.error("Error deleting session:", error);
    return await getSessions();
  }
};

/**
 * Ends a session (Updates lastUpdated)
 */
export const endSession = async (sessionId: string): Promise<void> => {
  if (!dbPromise) return;
  try {
    const db = await dbPromise;
    const session = await db.get(STORE_NAME, sessionId);
    if (session) {
      session.lastUpdated = new Date().toISOString();
      await db.put(STORE_NAME, session);
    }
  } catch (error) {
    console.error("Error ending session:", error);
  }
};

/**
 * Imports sessions from a JSON array and overwrites/adds to existing.
 */
export const importSessions = async (importedSessions: Session[]): Promise<Session[]> => {
  if (!dbPromise) return [];
  try {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    for (const session of importedSessions) {
      await tx.store.put(session);
    }
    await tx.done;
    return await getSessions();
  } catch (error) {
    console.error("Error importing sessions:", error);
    return await getSessions();
  }
};
