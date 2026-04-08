"use client";

import { useState, useEffect } from 'react';
import { getProgress, saveProgress, ProgressData } from '@/lib/storage';

export function useProgress() {
  const [progress, setProgressState] = useState<ProgressData | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
    setProgressState(getProgress());
  }, []);

  const updateProgress = (updater: (prev: ProgressData) => ProgressData) => {
    setProgressState((prev) => {
      if (!prev) return prev;
      const newProgress = updater(prev);
      saveProgress(newProgress);
      return newProgress;
    });
  };

  return { progress, updateProgress };
}
