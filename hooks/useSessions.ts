'use client';

import { useState, useEffect, useCallback } from 'react';
import { Session, Message, AnswerType, FiqhSchool } from '../types';
import * as Manager from '../utils/sessionManager';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const loadAllSessions = useCallback(async () => {
    const loaded = await Manager.getSessions();
    setSessions(loaded);
  }, []);

  // Load sessions on mount
  useEffect(() => {
    loadAllSessions();
  }, [loadAllSessions]);

  // Update currentSession object whenever ID or list changes
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.sessionId === currentSessionId);
      setCurrentSession(session || null);
    } else {
      setCurrentSession(null);
    }
  }, [currentSessionId, sessions]);

  const startSession = useCallback(async (category: AnswerType, madhab: FiqhSchool) => {
    const newSess = Manager.newSession(category, madhab);
    const updatedList = await Manager.saveSession(newSess);
    setSessions(updatedList);
    setCurrentSessionId(newSess.sessionId);
    return newSess;
  }, []);

  const loadSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  const addMessage = useCallback(async (message: Message, explicitSessionId?: string) => {
    const targetSessionId = explicitSessionId || currentSessionId;
    if (!targetSessionId) return;
    
    const updatedList = await Manager.addMessageToSession(targetSessionId, message);
    setSessions(updatedList);
  }, [currentSessionId]);

  const deleteSession = useCallback(async (sessionId: string) => {
    const updatedList = await Manager.deleteSession(sessionId);
    setSessions(updatedList);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const endCurrentSession = useCallback(async () => {
    if (currentSessionId) {
      await Manager.endSession(currentSessionId);
      setCurrentSessionId(null);
      await loadAllSessions();
    }
  }, [currentSessionId, loadAllSessions]);

  const createOrGetSession = useCallback(async (category: AnswerType, madhab: FiqhSchool): Promise<Session> => {
    if (currentSessionId) {
      const existing = sessions.find(s => s.sessionId === currentSessionId);
      if (existing) return existing;
    }
    return await startSession(category, madhab);
  }, [currentSessionId, sessions, startSession]);

  const importSessionsData = useCallback(async (importedSessions: Session[]) => {
    const updatedList = await Manager.importSessions(importedSessions);
    setSessions(updatedList);
  }, []);

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
    refreshSessions: loadAllSessions,
    importSessionsData
  };
};
