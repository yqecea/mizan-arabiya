const STORAGE_KEY = "arabic-trainer-progress";

export interface QuizHistoryEntry {
  score: number;
  date: string;
}

export interface ExamHistoryEntry {
  verbId: number;
  score: number;
  total: number;
  date: string;
}

export interface ProgressData {
  vocabulary: { known: number[] };
  conjugation: { correct: number; total: number };
  quiz: { completed: number; bestScore: number; history: QuizHistoryEntry[] };
  homework: { completed: number[] };
  exam: {
    verbsAttempted: number[];
    verbsMastered: number[];
    totalAttempts: number;
    history: ExamHistoryEntry[];
  };
  streak: {
    currentStreak: number;
    lastActiveDate: string;
    longestStreak: number;
  };
}

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

function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/** Update streak based on current activity. Call on any user action. */
export function updateStreak(progress: ProgressData): ProgressData {
  const today = getTodayISO();
  const { streak } = progress;

  if (streak.lastActiveDate === today) {
    return progress; // Already active today, no change
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  let newStreak: number;
  if (streak.lastActiveDate === yesterdayISO) {
    newStreak = streak.currentStreak + 1;
  } else {
    newStreak = 1; // Reset: gap in days
  }

  return {
    ...progress,
    streak: {
      currentStreak: newStreak,
      lastActiveDate: today,
      longestStreak: Math.max(streak.longestStreak, newStreak),
    },
  };
}

export function getProgress(): ProgressData {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultProgress;
    const parsed = JSON.parse(data);
    // Migrate: ensure all fields exist for backward compatibility
    return {
      vocabulary: parsed.vocabulary || defaultProgress.vocabulary,
      conjugation: parsed.conjugation || defaultProgress.conjugation,
      quiz: parsed.quiz || defaultProgress.quiz,
      homework: parsed.homework || defaultProgress.homework,
      exam: parsed.exam || defaultProgress.exam,
      streak: parsed.streak || defaultProgress.streak,
    };
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
