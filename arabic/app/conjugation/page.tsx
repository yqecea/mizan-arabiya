"use client";

import { useState } from 'react';
import { VERBS } from '@/data/verbs';
import { PRONOUNS } from '@/data/conjugations';
import { conjugate, Tense, getRussianVerbTranslation } from '@/lib/conjugationEngine';
import { ArabicText } from '@/components/ArabicText';
import { useProgress } from '@/hooks/useProgress';

function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function Conjugation() {
  const { updateProgress } = useProgress();
  const [mode, setMode] = useState<'table' | 'practice'>('table');
  const [selectedVerbId, setSelectedVerbId] = useState(VERBS[0].id);
  const [selectedTense, setSelectedTense] = useState<Tense>('past');

  function generatePractice() {
    const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
    const tense = ['past', 'present', 'passive_past', 'passive_present'][Math.floor(Math.random() * 4)] as Tense;
    const pronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
    const correct = conjugate(verb, tense, pronoun.id);

    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const randomPronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
      if (randomPronoun.id !== pronoun.id) {
        distractors.add(conjugate(verb, tense, randomPronoun.id));
      }
    }

    const options = shuffle([correct, ...Array.from(distractors)]);
    return { verb, tense, pronoun, correct, options };
  }

  const [practiceQuestion, setPracticeQuestion] = useState(() => generatePractice());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentVerb = VERBS.find(v => v.id === selectedVerbId) || VERBS[0];

  const handleAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    const correct = option === practiceQuestion.correct;
    setIsCorrect(correct);
    updateProgress(prev => ({
      ...prev,
      conjugation: {
        correct: prev.conjugation.correct + (correct ? 1 : 0),
        total: prev.conjugation.total + 1
      }
    }));
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPracticeQuestion(generatePractice());
  };

  const tenseName: Record<string, string> = {
    past: 'الماضي المعلوم',
    present: 'المضارع المعلوم',
    passive_past: 'الماضي المجهول',
    passive_present: 'المضارع المجهول'
  };

  const getPronounColor = (person: number) => {
    if (person === 3) return 'var(--mizan-slate)';
    if (person === 2) return 'var(--mizan-mauve)';
    return 'var(--mizan-warm)';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-slide-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="section-label mb-3">Грамматика</p>
          <h1 className="text-3xl mb-2" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
            Спряжения
          </h1>
          <p className="font-display" style={{ color: 'var(--mizan-mauve)' }}>Тренажёр глагольных форм</p>
        </div>

        <div className="flex" style={{ border: '1px solid var(--border-default)' }}>
          <button
            onClick={() => setMode('table')}
            style={{
              padding: '10px 20px', fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.15em',
              background: mode === 'table' ? 'var(--mizan-mauve)' : 'transparent',
              color: mode === 'table' ? 'white' : 'var(--text-secondary)',
              border: 'none', cursor: 'pointer', transition: 'all 300ms ease-in-out',
            }}
          >
            Справочник
          </button>
          <button
            onClick={() => setMode('practice')}
            style={{
              padding: '10px 20px', fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.15em',
              background: mode === 'practice' ? 'var(--mizan-mauve)' : 'transparent',
              color: mode === 'practice' ? 'white' : 'var(--text-secondary)',
              border: 'none', borderLeft: '1px solid var(--border-default)',
              cursor: 'pointer', transition: 'all 300ms ease-in-out',
            }}
          >
            Практика
          </button>
        </div>
      </header>

      {mode === 'table' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-static p-4">
              <label
                htmlFor="verb-select"
                style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)', marginBottom: '8px' }}
              >
                Глагол
              </label>
              <select
                id="verb-select"
                value={selectedVerbId}
                onChange={(e) => setSelectedVerbId(Number(e.target.value))}
                className="input-field w-full"
              >
                {VERBS.map(v => (
                  <option key={v.id} value={v.id}>{v.arabic} - {v.russian}</option>
                ))}
              </select>
            </div>
            <div className="card-static p-4">
              <label
                style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)', marginBottom: '8px' }}
              >
                Время
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['past', 'present', 'passive_past', 'passive_present'] as Tense[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTense(t)}
                    className="font-arabic text-sm sm:text-base"
                    style={{
                      padding: '8px 4px',
                      background: selectedTense === t ? 'var(--mizan-mauve)' : 'var(--bg-card)',
                      color: selectedTense === t ? 'white' : 'var(--text-primary)',
                      border: selectedTense === t ? 'none' : '1px solid var(--border-default)',
                      cursor: 'pointer',
                      transition: 'all 300ms ease-in-out',
                    }}
                  >
                    {tenseName[t]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card-static overflow-hidden">
            <div
              className="grid grid-cols-3 p-4 text-center"
              style={{
                background: 'var(--mizan-sand)',
                borderBottom: '1px solid var(--border-default)',
                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.25em', color: 'var(--mizan-mauve)',
              }}
            >
              <div>Местоимение</div>
              <div>Форма</div>
              <div>Перевод</div>
            </div>
            <div>
              {PRONOUNS.map((pronoun, idx) => {
                const conjugated = conjugate(currentVerb, selectedTense, pronoun.id);
                return (
                  <div
                    key={pronoun.id}
                    className="grid grid-cols-3 p-4 items-center text-center transition-colors"
                    style={{
                      borderBottom: '1px solid var(--border-default)',
                      background: idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-primary)',
                    }}
                  >
                    <div className="font-arabic text-2xl" style={{ color: getPronounColor(pronoun.person) }}>
                      {pronoun.arabic}
                    </div>
                    <div className="font-arabic text-3xl" style={{ color: 'var(--text-primary)' }}>
                      {conjugated}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>
                      {getRussianVerbTranslation(currentVerb.russian, selectedTense, pronoun.id)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto mt-12">
          <div className="card-static p-8 text-center">
            <div className="mb-8 space-y-4">
              <div
                className="inline-block px-4 py-1 text-sm font-arabic"
                style={{ background: 'var(--mizan-sand)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
              >
                {tenseName[practiceQuestion.tense]}
              </div>
              <div className="flex justify-center items-center gap-4 text-4xl">
                <ArabicText style={{ color: 'var(--mizan-deep)' }}>{practiceQuestion.verb.arabic}</ArabicText>
                <span style={{ color: 'var(--text-secondary)' }}>+</span>
                <ArabicText style={{ color: getPronounColor(practiceQuestion.pronoun.person) }}>{practiceQuestion.pronoun.arabic}</ArabicText>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                {getRussianVerbTranslation(practiceQuestion.verb.russian, practiceQuestion.tense, practiceQuestion.pronoun.id)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {practiceQuestion.options.map((option) => {
                let bg = 'var(--bg-card)';
                let borderColor = 'var(--border-default)';
                let textColor = 'var(--text-primary)';
                let opacity = '1';

                if (selectedAnswer) {
                  if (option === practiceQuestion.correct) {
                    bg = 'var(--color-success-bg)';
                    borderColor = 'var(--color-success)';
                    textColor = 'var(--color-success)';
                  } else if (option === selectedAnswer) {
                    bg = 'var(--color-error-bg)';
                    borderColor = 'var(--color-error)';
                    textColor = 'var(--color-error)';
                  } else {
                    opacity = '0.4';
                  }
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className="p-6 text-3xl font-arabic transition-all"
                    style={{
                      background: bg,
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      opacity,
                      cursor: selectedAnswer ? 'default' : 'pointer',
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selectedAnswer && (
              <div className="animate-fade-slide-up">
                <p
                  className="text-lg mb-6"
                  style={{ fontWeight: 700, color: isCorrect ? 'var(--color-success)' : 'var(--color-error)' }}
                >
                  {isCorrect ? '✓ Верно!' : '✗ Неверно'}
                </p>
                <button onClick={nextQuestion} className="btn-primary">
                  Следующий
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
