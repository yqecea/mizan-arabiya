"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { VERBS, Verb } from '@/data/verbs';
import { conjugate, getAmr, getNahy, getNegativePast, getParticiple } from '@/lib/conjugationEngine';
import { useProgress } from '@/hooks/useProgress';
import { ArabicText } from '@/components/ArabicText';
import Link from 'next/link';
import { RotateCcw, CheckCircle, XCircle, Shuffle, Trophy, Target } from 'lucide-react';

interface ExamCell {
  pronounId: string;
  columnKey: string;
  correctAnswer: string;
  mustFill: boolean;
}

interface ExamConfig {
  verb: Verb;
  cells: ExamCell[];
}

const EXAM_PRONOUNS = [
  { id: 'huwa',  arabic: 'هُوَ',    russian: 'Он' },
  { id: 'hiya',  arabic: 'هِيَ',    russian: 'Она' },
  { id: 'hum',   arabic: 'هُمْ',    russian: 'Они' },
  { id: 'anta',  arabic: 'أَنْتَ',  russian: 'Ты (м.)' },
  { id: 'antum', arabic: 'أَنْتُمْ', russian: 'Вы (м.)' },
  { id: 'ana',   arabic: 'أَنَا',   russian: 'Я' },
  { id: 'nahnu', arabic: 'نَحْنُ',  russian: 'Мы' },
];

const EXAM_COLUMNS = [
  { key: 'past',        label: 'Прош. время',     arabicLabel: 'الماضي' },
  { key: 'present',     label: 'Наст. время',     arabicLabel: 'المضارع' },
  { key: 'negative',    label: 'Отриц. прош.',     arabicLabel: 'ما + الماضي' },
  { key: 'fail',        label: 'Фаъиль',          arabicLabel: 'اسم الفاعل' },
  { key: 'amr',         label: 'Амр (приказ)',     arabicLabel: 'الأمر' },
  { key: 'nahy',        label: 'Нахий (запрет)',   arabicLabel: 'النهي' },
];

function getCorrectAnswer(verb: Verb, pronounId: string, columnKey: string): string {
  switch (columnKey) {
    case 'past':
      return conjugate(verb, 'past', pronounId);
    case 'present':
      return conjugate(verb, 'present', pronounId);
    case 'negative':
      return getNegativePast(verb, pronounId);
    case 'fail':
      return getParticiple(verb, 'fail', 'm_s');
    case 'amr':
      if (['anta', 'anti', 'antuma', 'antum', 'antunna'].includes(pronounId)) {
        return getAmr(verb, pronounId);
      }
      return '—';
    case 'nahy':
      return getNahy(verb, pronounId);
    default:
      return '';
  }
}

function generateExam(preferredVerbId?: number): ExamConfig {
  let verb: Verb;
  if (preferredVerbId !== undefined) {
    verb = VERBS.find(v => v.id === preferredVerbId) || VERBS[Math.floor(Math.random() * VERBS.length)];
  } else {
    verb = VERBS[Math.floor(Math.random() * VERBS.length)];
  }

  const cells: ExamCell[] = [];

  EXAM_PRONOUNS.forEach(pronoun => {
    EXAM_COLUMNS.forEach(col => {
      const correctAnswer = getCorrectAnswer(verb, pronoun.id, col.key);

      if (col.key === 'amr' && !['anta', 'anti', 'antuma', 'antum', 'antunna'].includes(pronoun.id)) {
        cells.push({ pronounId: pronoun.id, columnKey: col.key, correctAnswer: '—', mustFill: false });
        return;
      }

      const mustFill = Math.random() > 0.35;
      cells.push({ pronounId: pronoun.id, columnKey: col.key, correctAnswer, mustFill });
    });
  });

  return { verb, cells };
}

function normalizeArabic(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/ٱ/g, 'ا')
    .replace(/آ/g, 'ا')
    .replace(/إ/g, 'ا')
    .replace(/أ/g, 'ا')
    .trim();
}

export default function ExamSimulator() {
  const { progress, updateProgress } = useProgress();
  const [exam, setExam] = useState<ExamConfig | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const startNewExam = useCallback((preferredVerbId?: number) => {
    setExam(generateExam(preferredVerbId));
    setAnswers({});
    setIsChecked(false);
    setResults({});
    setScore({ correct: 0, total: 0 });
    inputRefs.current.clear();
  }, []);

  useEffect(() => {
    startNewExam();
  }, [startNewExam]);

  if (!exam) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-sm uppercase tracking-widest text-[var(--mizan-deep)]">
        [ LOADING... ]
      </div>
    );
  }

  const cellKey = (pronounId: string, columnKey: string) => `${pronounId}_${columnKey}`;

  // Build ordered list of fillable cell keys for Tab navigation
  const fillableKeys: string[] = [];
  EXAM_PRONOUNS.forEach(pronoun => {
    EXAM_COLUMNS.forEach(col => {
      const cell = exam.cells.find(c => c.pronounId === pronoun.id && c.columnKey === col.key);
      if (cell && cell.mustFill && cell.correctAnswer !== '—') {
        fillableKeys.push(cellKey(pronoun.id, col.key));
      }
    });
  });

  const handleInputChange = (pronounId: string, columnKey: string, value: string) => {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [cellKey(pronounId, columnKey)]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, pronounId: string, columnKey: string) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      const currentKey = cellKey(pronounId, columnKey);
      const currentIdx = fillableKeys.indexOf(currentKey);
      const nextIdx = e.shiftKey ? currentIdx - 1 : currentIdx + 1;

      if (nextIdx >= 0 && nextIdx < fillableKeys.length) {
        const nextInput = inputRefs.current.get(fillableKeys[nextIdx]);
        nextInput?.focus();
      }
    }
  };

  const checkExam = () => {
    const newResults: Record<string, boolean> = {};
    let correct = 0;
    let total = 0;

    exam.cells.forEach(cell => {
      if (!cell.mustFill || cell.correctAnswer === '—') return;
      total++;
      const key = cellKey(cell.pronounId, cell.columnKey);
      const userAnswer = answers[key] || '';
      const isCorrect = normalizeArabic(userAnswer) === normalizeArabic(cell.correctAnswer);
      newResults[key] = isCorrect;
      if (isCorrect) correct++;
    });

    setResults(newResults);
    setScore({ correct, total });
    setIsChecked(true);

    // Save exam result to progress
    const verbId = exam.verb.id;
    const isPerfect = correct === total;

    updateProgress(prev => {
      const newAttempted = prev.exam.verbsAttempted.includes(verbId)
        ? prev.exam.verbsAttempted
        : [...prev.exam.verbsAttempted, verbId];

      let newMastered = prev.exam.verbsMastered;
      if (isPerfect && !prev.exam.verbsMastered.includes(verbId)) {
        newMastered = [...prev.exam.verbsMastered, verbId];
      }

      return {
        ...prev,
        exam: {
          verbsAttempted: newAttempted,
          verbsMastered: newMastered,
          totalAttempts: prev.exam.totalAttempts + 1,
          history: [
            ...prev.exam.history,
            { verbId, score: correct, total, date: new Date().toISOString() },
          ],
        },
      };
    });
  };

  const fillableCells = exam.cells.filter(c => c.mustFill && c.correctAnswer !== '—');
  const filledCount = fillableCells.filter(c => {
    const val = answers[cellKey(c.pronounId, c.columnKey)] || '';
    return val.trim().length > 0;
  }).length;

  // Exam mastery stats
  const masteredCount = progress.exam.verbsMastered.length;
  const attemptedCount = progress.exam.verbsAttempted.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-slide-up">
      {/* Header */}
      <header className="mb-6 border-b border-[var(--mizan-deep)] pb-6">
        <nav className="flex flex-wrap items-center gap-2 text-micro-label mb-4 text-[var(--mizan-slate)]">
          <Link href="/" className="hover:text-[var(--mizan-deep)] transition-colors">ГЛАВНАЯ</Link>
          <span className="text-[var(--mizan-sand)]">/</span>
          <span className="text-[var(--mizan-deep)]">ЭКЗАМЕН САРФ</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl heading-display-black text-[var(--mizan-deep)] uppercase tracking-tight">
              Экзамен — 1 часть сарфа
            </h1>
            <p className="font-display italic text-lg text-[var(--mizan-slate)] mt-1">
              Заполни таблицу спряжений для данного глагола
            </p>
          </div>
          <button
            onClick={() => startNewExam()}
            className="flex items-center gap-2 px-6 py-3 border border-[var(--mizan-deep)] bg-[var(--bg-card)] text-[var(--mizan-deep)] font-mono text-xs uppercase tracking-widest hover:bg-[var(--mizan-sand)] transition-all shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]"
          >
            <Shuffle className="w-4 h-4" />
            Новый глагол
          </button>
        </div>
      </header>

      {/* Progress Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 px-4 py-3 border border-[var(--border-default)] bg-[var(--bg-card)]">
          <Trophy className="w-4 h-4 text-[var(--mizan-mauve)]" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)]">Освоено</div>
            <div className="font-mono text-lg font-bold text-[var(--mizan-deep)]">{masteredCount} <span className="text-xs text-[var(--mizan-slate)] font-normal">/ {VERBS.length}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border border-[var(--border-default)] bg-[var(--bg-card)]">
          <Target className="w-4 h-4 text-[var(--mizan-mauve)]" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)]">Пробовали</div>
            <div className="font-mono text-lg font-bold text-[var(--mizan-deep)]">{attemptedCount} <span className="text-xs text-[var(--mizan-slate)] font-normal">/ {VERBS.length}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border border-[var(--border-default)] bg-[var(--bg-card)] col-span-2 md:col-span-1">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)]">Всего попыток</div>
          <div className="font-mono text-lg font-bold text-[var(--mizan-deep)] ml-auto">{progress.exam.totalAttempts}</div>
        </div>
      </div>

      {/* Verb Display */}
      <div className="bg-[var(--bg-card)] border border-[var(--mizan-deep)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-[8px_8px_0_0_var(--mizan-sand)]">
        <div className="text-center md:text-right flex-1">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)] mb-2">
            Глагол для экзамена
          </div>
          <ArabicText className="text-6xl md:text-7xl text-[var(--mizan-deep)] leading-tight">
            {exam.verb.arabic}
          </ArabicText>
        </div>
        <div className="hidden md:block w-px h-20 bg-[var(--mizan-sand)]" />
        <div className="flex-1 space-y-2 text-center md:text-left">
          <p className="font-display italic text-2xl text-[var(--mizan-deep)]">
            {exam.verb.russian}
          </p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 text-xs font-mono bg-[var(--mizan-sand)] border border-[var(--border-default)] text-[var(--text-primary)]">
              Корень: <ArabicText>{exam.verb.root}</ArabicText>
            </span>
            <span className="px-3 py-1 text-xs font-mono bg-[var(--mizan-sand)] border border-[var(--border-default)] text-[var(--text-primary)]">
              المضارع: <ArabicText>{exam.verb.mudari}</ArabicText>
            </span>
          </div>
        </div>
        {!isChecked && (
          <div className="font-mono text-sm text-[var(--mizan-slate)]">
            {filledCount} / {fillableCells.length}
          </div>
        )}
      </div>

      {/* Score (after check) */}
      {isChecked && (
        <div
          className="border p-6 text-center animate-fade-slide-up"
          style={{
            borderColor: score.correct === score.total ? 'var(--color-success)' : 'var(--color-error)',
            background: score.correct === score.total ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
          }}
        >
          <div className="font-mono text-4xl font-bold mb-2" style={{ color: score.correct === score.total ? 'var(--color-success)' : 'var(--color-error)' }}>
            {score.correct} / {score.total}
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--mizan-slate)]">
            {score.correct === score.total
              ? '✦ Превосходно! Глагол освоен и записан.'
              : `Верных ответов: ${Math.round((score.correct / score.total) * 100)}% — повтори этот глагол`}
          </div>
        </div>
      )}

      {/* Exam Table */}
      <div className="w-full overflow-x-auto border border-[var(--mizan-deep)] bg-[var(--bg-card)]">
        <table className="w-full min-w-[950px]" style={{ direction: 'ltr' }}>
          <thead>
            <tr className="bg-[var(--mizan-deep)] text-[var(--mizan-sand)]">
              <th className="px-3 py-3 text-right font-mono text-[10px] uppercase tracking-widest border-r border-[rgba(255,255,255,0.1)] w-20">
                <ArabicText className="text-base text-[var(--mizan-sand)]">{exam.verb.arabic}</ArabicText>
              </th>
              {EXAM_COLUMNS.map(col => (
                <th key={col.key} className="px-3 py-3 text-center font-mono text-[10px] uppercase tracking-widest border-r border-[rgba(255,255,255,0.1)] last:border-r-0">
                  <div>{col.label}</div>
                  <div className="font-arabic text-xs mt-1 opacity-70">{col.arabicLabel}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EXAM_PRONOUNS.map((pronoun, rowIdx) => (
              <tr key={pronoun.id} className={`border-t border-[var(--border-default)] ${rowIdx % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--mizan-sand)]'}`}>
                <td className="px-3 py-3 text-right border-r border-[var(--mizan-deep)] bg-[var(--mizan-deep)]">
                  <ArabicText className="text-lg text-[var(--mizan-sand)] font-bold">
                    {pronoun.arabic}
                  </ArabicText>
                  <div className="font-mono text-[8px] text-[var(--cream-50)] uppercase tracking-wider mt-1">
                    {pronoun.russian}
                  </div>
                </td>

                {EXAM_COLUMNS.map(col => {
                  const cell = exam.cells.find(c => c.pronounId === pronoun.id && c.columnKey === col.key);
                  if (!cell) return <td key={col.key} />;

                  const key = cellKey(pronoun.id, col.key);

                  if (!cell.mustFill || cell.correctAnswer === '—') {
                    return (
                      <td key={col.key} className="px-2 py-3 text-center border-r border-[var(--border-default)] last:border-r-0">
                        {cell.correctAnswer === '—' ? (
                          <span className="text-[var(--mizan-slate)] opacity-30">—</span>
                        ) : (
                          <ArabicText className="text-base text-[var(--mizan-slate)] opacity-60">
                            {cell.correctAnswer}
                          </ArabicText>
                        )}
                      </td>
                    );
                  }

                  const userAnswer = answers[key] || '';
                  const isCorrectResult = results[key];
                  const showResult = isChecked && isCorrectResult !== undefined;

                  let cellBg = '';
                  let cellBorder = 'var(--mizan-mauve)';

                  if (showResult) {
                    cellBg = isCorrectResult ? 'var(--color-success-bg)' : 'var(--color-error-bg)';
                    cellBorder = isCorrectResult ? 'var(--color-success)' : 'var(--color-error)';
                  }

                  return (
                    <td key={col.key} className="px-1 py-2 text-center border-r border-[var(--border-default)] last:border-r-0" style={{ background: cellBg }}>
                      <div className="relative">
                        <input
                          ref={el => {
                            if (el) inputRefs.current.set(key, el);
                          }}
                          type="text"
                          value={userAnswer}
                          onChange={e => handleInputChange(pronoun.id, col.key, e.target.value)}
                          onKeyDown={e => handleKeyDown(e, pronoun.id, col.key)}
                          disabled={isChecked}
                          className="w-full h-10 text-center font-arabic text-base bg-transparent outline-none"
                          style={{
                            borderBottom: `2px solid ${cellBorder}`,
                            color: showResult
                              ? (isCorrectResult ? 'var(--color-success)' : 'var(--color-error)')
                              : 'var(--text-primary)',
                            direction: 'rtl',
                          }}
                          dir="rtl"
                          placeholder="..."
                        />
                        {showResult && !isCorrectResult && (
                          <div className="mt-1">
                            <ArabicText className="text-xs text-[var(--color-success)] opacity-80">
                              {cell.correctAnswer}
                            </ArabicText>
                          </div>
                        )}
                        {showResult && (
                          <div className="absolute top-0 right-0">
                            {isCorrectResult
                              ? <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
                              : <XCircle className="w-3 h-3 text-[var(--color-error)]" />
                            }
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {!isChecked ? (
          <button
            onClick={checkExam}
            disabled={filledCount === 0}
            className="flex-1 py-5 border border-[var(--mizan-deep)] bg-[var(--bg-card)] text-[var(--mizan-deep)] font-mono text-sm uppercase tracking-[0.2em] transition-all hover:bg-[var(--mizan-sand)] active:bg-[var(--mizan-warm)] shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0_0_var(--mizan-deep)] disabled:hover:translate-y-0 disabled:hover:translate-x-0"
          >
            Проверить ответы
          </button>
        ) : (
          <>
            <button
              onClick={() => startNewExam()}
              className="flex-1 flex items-center justify-center gap-2 py-5 border border-[var(--mizan-deep)] bg-[var(--bg-card)] text-[var(--mizan-deep)] font-mono text-sm uppercase tracking-[0.2em] transition-all hover:bg-[var(--mizan-sand)] active:bg-[var(--mizan-warm)] shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]"
            >
              <RotateCcw className="w-4 h-4" />
              Новый экзамен
            </button>
            {score.correct < score.total && (
              <button
                onClick={() => startNewExam(exam.verb.id)}
                className="flex-1 flex items-center justify-center gap-2 py-5 border border-[var(--mizan-deep)] bg-[var(--bg-card)] text-[var(--mizan-deep)] font-mono text-sm uppercase tracking-[0.2em] transition-all hover:bg-[var(--mizan-sand)] active:bg-[var(--mizan-warm)] shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]"
              >
                <Target className="w-4 h-4" />
                Повторить глагол
              </button>
            )}
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)] mb-3">
          Инструкция
        </div>
        <ul className="space-y-2 font-display italic text-sm text-[var(--mizan-slate)]">
          <li>• Заполняй только пустые ячейки с подчёркиванием</li>
          <li>• Серые ячейки — подсказки (уже заполнены)</li>
          <li>• Прочерк «—» означает, что форма не применима</li>
          <li>• Проверка сравнивает формы без огласовок</li>
          <li>• <strong>Tab / Enter</strong> — переход к следующей ячейке, <strong>Shift+Tab</strong> — к предыдущей</li>
          <li>• Используй арабскую клавиатуру для ввода</li>
        </ul>
      </div>
    </div>
  );
}
