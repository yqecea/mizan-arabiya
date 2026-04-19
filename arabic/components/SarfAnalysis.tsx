"use client";

import { useState } from 'react';
import { Verb } from '@/data/verbs';
import {
  conjugate,
  getAmr,
  getNahy,
  getNegativePast,
  getNegativePresent,
  getParticiple,
  getIsmZamanMakan,
  getIsmAla,
  getIsmTafdil
} from '@/lib/conjugationEngine';
import { ArabicText } from '@/components/ArabicText';
import { CheckCircle, XCircle } from 'lucide-react';

interface SarfAnalysisProps {
  verb: Verb;
}

// Helper to normalize arabic answers for checking
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

export default function SarfAnalysis({ verb }: SarfAnalysisProps) {
  const [practiceMode, setPracticeMode] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isChecked, setIsChecked] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    if (isChecked) return;
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const togglePracticeMode = () => {
    setPracticeMode(!practiceMode);
    setAnswers({});
    setIsChecked(false);
  };

  const checkAnswers = () => {
    setIsChecked(true);
  };

  const ismZamanMakan = getIsmZamanMakan(verb);
  const ismAla = getIsmAla(verb);
  const ismTafdil = getIsmTafdil(verb);

  const rightColumn = [
    { key: 'past', arabic: conjugate(verb, 'past', 'huwa'), ru: 'Прошедшее время', pattern: 'فَعَلَ' },
    { key: 'present', arabic: conjugate(verb, 'present', 'huwa'), ru: 'Настоящее время', pattern: 'يَفْعَلُ' },
    { key: 'fail', arabic: getParticiple(verb, 'fail', 'm_s'), ru: 'Действующее лицо', pattern: 'فَاعِل' },
    { key: 'maful', arabic: getParticiple(verb, 'maful', 'm_s'), ru: 'Объект действия', pattern: 'مَفْعُول' },
    { key: 'negPast', arabic: getNegativePast(verb, 'huwa'), ru: 'Отрицание прош. времени', pattern: 'مَا فَعَلَ' },
    { key: 'negPresent', arabic: getNegativePresent(verb, 'huwa'), ru: 'Отрицание наст. времени', pattern: 'لَا يَفْعَلُ' }
  ];

  const leftColumn = [
    { key: 'amr', arabic: getAmr(verb, 'anta'), ru: 'Повеление', pattern: 'اِفْعَلْ' },
    { key: 'nahy', arabic: getNahy(verb, 'anta'), ru: 'Повеление отрицательное', pattern: 'لَا تَفْعَلْ' },
    { key: 'zamanMakan', arabic: `${ismZamanMakan.mafal} / ${ismZamanMakan.mafil}`, ru: 'Имя места или времени', pattern: 'مَفْعَل / مَفْعِل', note: 'Только كسرة или فتحة' },
    { key: 'ala', arabic: `${ismAla.mifal} / ${ismAla.mifaal} / ${ismAla.mifalah}`, ru: 'Орудие действия', pattern: 'مِفْعَل / مِفْعَال / مِفْعَلَة' },
    { key: 'tafdil', arabic: `${ismTafdil.male} / ${ismTafdil.female}`, ru: 'Превосходная форма', pattern: 'أَفْعَل / فُعْلَى' }
  ];

  const renderForm = (item: { key: string, arabic: string, ru: string, pattern: string, note?: string }) => {
    const userAnswer = answers[item.key] || '';
    const isCorrect = normalizeArabic(userAnswer) === normalizeArabic(item.arabic);
    const showResult = practiceMode && isChecked;

    let cellBg = 'var(--bg-card)';
    let cellBorder = 'var(--border-default)';

    if (showResult) {
      cellBg = isCorrect ? 'var(--color-success-bg)' : 'var(--color-error-bg)';
      cellBorder = isCorrect ? 'var(--color-success)' : 'var(--color-error)';
    }

    return (
      <div key={item.key} className="p-4 rounded-[var(--radius-md)] border shadow-[var(--shadow-soft)] transition-colors" style={{ backgroundColor: cellBg, borderColor: cellBorder }}>
        <div className="flex justify-between items-start mb-2 border-b border-[rgba(0,0,0,0.05)] pb-2">
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--mizan-slate)]">
            {item.ru}
          </div>
          <div className="font-arabic text-sm px-3 py-1 rounded-[4px] font-bold"
               style={{ 
                 background: 'linear-gradient(135deg, rgba(176,148,136,0.15) 0%, rgba(176,148,136,0.08) 100%)',
                 color: 'var(--mizan-mauve)',
                 border: '1px solid rgba(176,148,136,0.2)',
               }}>
            {item.pattern}
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center min-h-[60px]">
          {!practiceMode ? (
            <ArabicText className="text-3xl md:text-4xl text-[var(--mizan-deep)] leading-tight text-center">
              {item.arabic}
            </ArabicText>
          ) : (
            <div className="relative w-full max-w-[250px]">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => handleInputChange(item.key, e.target.value)}
                disabled={isChecked}
                dir="rtl"
                placeholder="..."
                className="w-full text-center font-arabic text-2xl py-2 px-3 border-b-2 bg-transparent outline-none transition-colors"
                style={{
                  borderBottomColor: showResult
                    ? (isCorrect ? 'var(--color-success)' : 'var(--color-error)')
                    : 'var(--mizan-deep)',
                  color: showResult
                    ? (isCorrect ? 'var(--color-success)' : 'var(--color-error)')
                    : 'var(--text-primary)',
                }}
              />
              {showResult && (
                <div className="absolute top-1/2 -translate-y-1/2 -right-6">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[var(--color-error)]" />
                  )}
                </div>
              )}
            </div>
          )}
          {showResult && !isCorrect && (
            <div className="mt-3">
              <ArabicText className="text-xl text-[var(--color-success)] opacity-90 text-center">
                {item.arabic}
              </ArabicText>
            </div>
          )}
        </div>
        {item.note && (
          <div className="mt-3 text-[10px] text-center text-[var(--mizan-slate)] opacity-80 uppercase tracking-wider font-mono">
            * {item.note}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-display text-[var(--mizan-deep)] uppercase tracking-widest">
          Морфологический разбор (Сарф)
        </h2>
        <button
          onClick={togglePracticeMode}
          className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-[var(--border-strong)] rounded shadow-[var(--shadow-soft)] hover:bg-[var(--mizan-sand)] transition-all bg-[var(--bg-card)]"
          style={{ color: practiceMode ? 'var(--mizan-mauve)' : 'var(--mizan-deep)' }}
        >
          {practiceMode ? 'Выйти из режима практики' : 'Режим практики'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="font-mono text-[10px] text-center uppercase tracking-widest text-[var(--mizan-slate)] mb-4 border-b border-[var(--border-default)] pb-2">
            Производные имена и команды
          </div>
          {leftColumn.map(renderForm)}
        </div>
        <div className="space-y-4">
          <div className="font-mono text-[10px] text-center uppercase tracking-widest text-[var(--mizan-slate)] mb-4 border-b border-[var(--border-default)] pb-2">
            Базовые времена и причастия
          </div>
          {rightColumn.map(renderForm)}
        </div>
      </div>

      {practiceMode && (
        <div className="flex justify-center mt-8">
          {!isChecked ? (
            <button
              onClick={checkAnswers}
              className="px-8 py-3 text-sm font-mono uppercase tracking-widest border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--mizan-deep)] rounded-[var(--radius-md)] shadow-[var(--shadow-soft)] hover:bg-[var(--mizan-sand)] transition-all min-h-[48px]"
            >
              Проверить ответы
            </button>
          ) : (
            <button
              onClick={togglePracticeMode}
              className="px-8 py-3 text-sm font-mono uppercase tracking-widest border border-[var(--border-strong)] bg-[var(--mizan-sand)] text-[var(--mizan-deep)]"
            >
              Сбросить
            </button>
          )}
        </div>
      )}
    </div>
  );
}
