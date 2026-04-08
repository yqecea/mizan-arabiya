const STORAGE_KEY = "arabic-trainer-progress";

export interface QuizHistoryEntry {
  score: number;
  date: string;
}

export interface ProgressData {
  vocabulary: { known: number[] };
  conjugation: { correct: number; total: number };
  quiz: { completed: number; bestScore: number; history: QuizHistoryEntry[] };
  homework: { completed: number[] };
}

const defaultProgress: ProgressData = {
  vocabulary: { known: [] },
  conjugation: { correct: 0, total: 0 },
  quiz: { completed: 0, bestScore: 0, history: [] },
  homework: { completed: [] },
};

export function getProgress(): ProgressData {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultProgress;
    const parsed = JSON.parse(data) as ProgressData;
    if (!parsed.vocabulary || !parsed.conjugation || !parsed.quiz || !parsed.homework) {
      return defaultProgress;
    }
    return parsed;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: ProgressData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
