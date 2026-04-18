"use client";

import { useState, useEffect, useCallback } from 'react';
import { getProgress, saveProgress, updateStreak, ProgressData } from '@/lib/storage';

const defaultProgress: ProgressData = {
  vocabulary: { known: [] },
  conjugation: { correct: 0, total: 0 },
  quiz: { completed: 0, bestScore: 0, history: [] },
  homework: { completed: [] },
  exam: {
    verbsAttempted: [],
    verbsMastered: [],
    totalAttempts: 0,
    history: [],
  },
  streak: {
    currentStreak: 0,
    lastActiveDate: '',
    longestStreak: 0,
  },
};

export function useProgress() {
  const [progress, setProgressState] = useState<ProgressData>(defaultProgress);

  useEffect(() => {
    setProgressState(getProgress());
    
    const handleStorageChange = () => {
      setProgressState(getProgress());
    };
    
    window.addEventListener('progressUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange); // Also sync across tabs
    return () => {
      window.removeEventListener('progressUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateProgress = useCallback((updater: (prev: ProgressData) => ProgressData) => {
    setProgressState((prev) => {
      let newProgress = updater(prev);
      // Auto-update streak on every progress change
      newProgress = updateStreak(newProgress);
      saveProgress(newProgress);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('progressUpdated'));
      }
      return newProgress;
    });
  }, []);

  return { progress, updateProgress };
}
