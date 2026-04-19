"use client";

import { useState, useCallback } from 'react';
import { PRONOUNS } from '@/data/conjugations';
import { VERBS } from '@/data/verbs';
import { conjugate, Tense, getRussianVerbTranslation } from '@/lib/conjugationEngine';
import { ArabicText } from '@/components/ArabicText';

interface TheoryTableProps {
  tense: Tense;
  exampleVerbId?: number;
  showPractice?: boolean;
}

const TENSE_LABELS: Record<Tense, { arabic: string; russian: string }> = {
  past: { arabic: 'الماضي', russian: 'Прошедшее' },
  present: { arabic: 'المضارع', russian: 'Настоящее' },
  passive_past: { arabic: 'الماضي المجهول', russian: 'Пассив прош.' },
  passive_present: { arabic: 'المضارع المجهول', russian: 'Пассив наст.' },
};

// Highlight parts of conjugated form
function HighlightedForm({
  conjugated,
  tense,
  pronounId,
}: {
  conjugated: string;
  tense: Tense;
  pronounId: string;
}) {
  // For past tense, highlight the suffix (ending) in yellow
  if (tense === 'past') {
    // Suffixes are the personal endings added after the root
    const suffixMap: Record<string, number> = {
      huwa: 0, // no suffix (base form)
      hiya: 2,  // تْ
      huma_m: 1, // ا
      huma_f: 2, // تَا
      hum: 3,   // وا
      hunna: 2, // نَ
      anta: 2,  // تَ
      anti: 2,  // تِ
      antuma: 4, // تُمَا
      antum: 3, // تُمْ
      antunna: 4, // تُنَّ
      ana: 2,   // تُ
      nahnu: 3, // نَا
    };

    const suffixLen = suffixMap[pronounId] || 0;
    if (suffixLen === 0) {
      return <span>{conjugated}</span>;
    }
    const base = conjugated.slice(0, -suffixLen);
    const suffix = conjugated.slice(-suffixLen);
    return (
      <span>
        {base}
        <span className="highlight-suffix">{suffix}</span>
      </span>
    );
  }

  // For present tense, highlight the prefix in blue
  if (tense === 'present' || tense === 'passive_present') {
    // First char is the prefix (ي ت أ ن)
    const prefix = conjugated.slice(0, 2); // letter + vowel
    const rest = conjugated.slice(2);

    // Check for suffix too (ونَ, انِ, نَ)
    const suffixPatterns = ['ونَ', 'انِ', 'ْنَ'];
    const matchedSuffix = suffixPatterns.find(s => rest.endsWith(s));

    if (matchedSuffix) {
      const middle = rest.slice(0, -matchedSuffix.length);
      return (
        <span>
          <span className="highlight-prefix">{prefix}</span>
          {middle}
          <span className="highlight-suffix">{matchedSuffix}</span>
        </span>
      );
    }

    return (
      <span>
        <span className="highlight-prefix">{prefix}</span>
        {rest}
      </span>
    );
  }

  // For passive past, highlight vowel change
  if (tense === 'passive_past') {
    // In passive past, first vowel changes to damma, second to kasra
    const chars = [...conjugated];
    if (chars.length >= 3) {
      return (
        <span>
          <span className="highlight-vowel">{chars.slice(0, 2).join('')}</span>
          <span className="highlight-vowel">{chars.slice(2, 4).join('')}</span>
          {chars.slice(4).join('')}
        </span>
      );
    }
  }

  return <span>{conjugated}</span>;
}

// Ordered pronouns for display
const DISPLAY_ORDER = [
  { id: 'huwa', label: 'он' },
  { id: 'hiya', label: 'она' },
  { id: 'huma_m', label: 'они (дв. м.)' },
  { id: 'huma_f', label: 'они (дв. ж.)' },
  { id: 'hum', label: 'они (м.)' },
  { id: 'hunna', label: 'они (ж.)' },
  { id: 'anta', label: 'ты (м.)' },
  { id: 'anti', label: 'ты (ж.)' },
  { id: 'antuma', label: 'вы (дв.)' },
  { id: 'antum', label: 'вы (м.)' },
  { id: 'antunna', label: 'вы (ж.)' },
  { id: 'ana', label: 'я' },
  { id: 'nahnu', label: 'мы' },
];

export function TheoryConjugationTable({ tense, exampleVerbId = 21, showPractice = false }: TheoryTableProps) {
  const [practiceMode, setPracticeMode] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const verb = VERBS.find(v => v.id === exampleVerbId) || VERBS[0];
  const tenseLabel = TENSE_LABELS[tense];

  const handleChange = useCallback((pronounId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [pronounId]: value }));
    setChecked(false);
  }, []);

  const checkAnswers = useCallback(() => {
    setChecked(true);
  }, []);

  const resetPractice = useCallback(() => {
    setAnswers({});
    setChecked(false);
  }, []);

  const correctCount = checked
    ? DISPLAY_ORDER.filter(p => {
        const correct = conjugate(verb, tense, p.id);
        return (answers[p.id] || '').trim() === correct;
      }).length
    : 0;

  return (
    <div className="space-y-4">
      {/* Table header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-arabic text-base text-[var(--mizan-deep)]">{tenseLabel.arabic}</span>
          <span className="font-mono text-xs text-[var(--mizan-slate)] uppercase tracking-wider">— {tenseLabel.russian}</span>
        </div>
        {showPractice && (
          <button
            onClick={() => { setPracticeMode(!practiceMode); resetPractice(); }}
            className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-[var(--border-default)] rounded-[var(--radius-sm)] transition-all hover:bg-[var(--mizan-sand)]"
            style={{
              background: practiceMode ? 'var(--mizan-mauve)' : 'var(--bg-card)',
              color: practiceMode ? 'white' : 'var(--text-secondary)',
              borderColor: practiceMode ? 'var(--mizan-mauve)' : 'var(--border-default)',
            }}
          >
            {practiceMode ? '✎ Практика' : '→ Заполнить'}
          </button>
        )}
      </div>

      {/* Verb context */}
      <div className="flex items-center gap-3 px-3 py-2 bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] border border-[var(--border-default)]">
        <ArabicText className="text-xl text-[var(--mizan-deep)] font-bold">{verb.arabic}</ArabicText>
        <span className="text-sm text-[var(--mizan-slate)]">—</span>
        <span className="font-display italic text-sm text-[var(--mizan-slate)]">{verb.russian}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--border-default)]">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr>
              <th className="theory-cell-header w-[100px]">Местоим.</th>
              <th className="theory-cell-header">Арабский</th>
              <th className="theory-cell-header">Форма</th>
              <th className="theory-cell-header hidden sm:table-cell">Перевод</th>
            </tr>
          </thead>
          <tbody>
            {DISPLAY_ORDER.map((entry) => {
              const pronoun = PRONOUNS.find(p => p.id === entry.id);
              if (!pronoun) return null;
              const conjugated = conjugate(verb, tense, entry.id);
              const translation = getRussianVerbTranslation(verb.russian, tense, entry.id);

              const userAnswer = answers[entry.id] || '';
              const isCorrect = checked && userAnswer.trim() === conjugated;
              const isIncorrect = checked && userAnswer.trim() !== conjugated && userAnswer.trim() !== '';

              return (
                <tr key={entry.id} className="border-t border-[var(--border-default)] hover:bg-[var(--mauve-5)] transition-colors">
                  <td className="theory-cell !text-left">
                    <div className="flex flex-col gap-0.5">
                      <ArabicText className="text-base">{pronoun.arabic}</ArabicText>
                      <span className="font-mono text-[10px] text-[var(--mizan-slate)]">{entry.label}</span>
                    </div>
                  </td>
                  <td className="theory-cell">
                    <ArabicText className="text-base text-[var(--mizan-slate)]">{pronoun.arabic}</ArabicText>
                  </td>
                  <td className="theory-cell">
                    {practiceMode ? (
                      <input
                        type="text"
                        dir="rtl"
                        value={userAnswer}
                        onChange={(e) => handleChange(entry.id, e.target.value)}
                        placeholder="..."
                        className={`theory-cell-input w-full ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                      />
                    ) : (
                      <ArabicText className="text-xl font-bold">
                        <HighlightedForm conjugated={conjugated} tense={tense} pronounId={entry.id} />
                      </ArabicText>
                    )}
                    {checked && isIncorrect && (
                      <div className="mt-1">
                        <ArabicText className="text-sm text-[var(--color-success)]">{conjugated}</ArabicText>
                      </div>
                    )}
                  </td>
                  <td className="theory-cell hidden sm:table-cell">
                    <span className="font-display italic text-sm text-[var(--mizan-slate)]">{translation}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Practice controls */}
      {practiceMode && (
        <div className="flex items-center gap-4">
          <button onClick={checkAnswers} className="btn-primary">
            Проверить
          </button>
          <button onClick={resetPractice} className="btn-ghost">
            Сбросить
          </button>
          {checked && (
            <span className="font-mono text-sm" style={{ color: correctCount === DISPLAY_ORDER.length ? 'var(--color-success)' : 'var(--mizan-mauve)' }}>
              {correctCount} / {DISPLAY_ORDER.length} верно
            </span>
          )}
        </div>
      )}

      {/* Legend */}
      {!practiceMode && (
        <div className="flex flex-wrap gap-4 px-3 py-2 bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] border border-[var(--border-default)]">
          <span className="flex items-center gap-1.5 text-xs text-[var(--mizan-slate)]">
            <span className="highlight-suffix text-xs">текст</span> Окончание
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--mizan-slate)]">
            <span className="highlight-prefix text-xs">текст</span> Приставка
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--mizan-slate)]">
            <span className="highlight-vowel text-xs">текст</span> Изменение огласовки
          </span>
        </div>
      )}
    </div>
  );
}
