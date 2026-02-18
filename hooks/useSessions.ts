
import { useState, useEffect, useCallback } from 'react';
import { Session, Message, AnswerType, FiqhSchool } from '../types';
import * as Manager from '../utils/sessionManager';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Load sessions on mount
  useEffect(() => {
    const loaded = Manager.getSessions();
    setSessions(loaded);
  }, []);

  // Update currentSession object whenever ID or list changes
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.sessionId === currentSessionId);
      setCurrentSession(session || null);
    } else {
      setCurrentSession(null);
    }
  }, [currentSessionId, sessions]);

  const startSession = useCallback((category: AnswerType, madhab: FiqhSchool) => {
    const newSess = Manager.newSession(category, madhab);
    const updatedList = Manager.saveSession(newSess);
    setSessions(updatedList);
    setCurrentSessionId(newSess.sessionId);
    return newSess;
  }, []);

  const loadSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const addMessage = useCallback((message: Message) => {
    if (!currentSessionId) return;
    
    const updatedList = Manager.addMessageToSession(currentSessionId, message);
    setSessions(updatedList);
  }, [currentSessionId]);

  const deleteSession = useCallback((sessionId: string) => {
    const updatedList = Manager.deleteSession(sessionId);
    setSessions(updatedList);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const endCurrentSession = useCallback(() => {
    if (currentSessionId) {
      Manager.endSession(currentSessionId);
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const createOrGetSession = useCallback((category: AnswerType, madhab: FiqhSchool): Session => {
    if (currentSessionId) {
      const existing = sessions.find(s => s.sessionId === currentSessionId);
      if (existing) return existing;
    }
    return startSession(category, madhab);
  }, [currentSessionId, sessions, startSession]);

  return {
    sessions,
    currentSession,
    currentSessionId,
    startSession,
    loadSession,
    addMessage,
    deleteSession,
    endCurrentSession,
    createOrGetSession, // Helper to ensure a session exists before sending
    refreshSessions: () => setSessions(Manager.getSessions())
  };
};
