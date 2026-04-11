"use client";

import { useState } from 'react';
import { POSSESSIVE_PRONOUNS } from '@/data/pronouns';
import { ArabicText } from '@/components/ArabicText';
import Link from 'next/link';

function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function Pronouns() {
  const [mode, setMode] = useState<'table' | 'practice'>('table');
  const [selectedPerson, setSelectedPerson] = useState<3 | 2 | 1>(3);

  function generatePractice() {
    const pronoun = POSSESSIVE_PRONOUNS[Math.floor(Math.random() * POSSESSIVE_PRONOUNS.length)];
    const isSuffixMode = Math.random() > 0.5;
    const correct = isSuffixMode ? pronoun.suffix : pronoun.example;
    const question = isSuffixMode ? `كِتَابُـ___ = ${pronoun.russian} книга` : `${pronoun.russian} книга = ?`;
    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const randomPronoun = POSSESSIVE_PRONOUNS[Math.floor(Math.random() * POSSESSIVE_PRONOUNS.length)];
      if (randomPronoun.id !== pronoun.id) {
        distractors.add(isSuffixMode ? randomPronoun.suffix : randomPronoun.example);
      }
    }
    const options = shuffle([correct, ...Array.from(distractors)]);
    return { pronoun, question, correct, options, isSuffixMode };
  }

  const [practiceQuestion, setPracticeQuestion] = useState(() => generatePractice());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    setIsCorrect(option === practiceQuestion.correct);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPracticeQuestion(generatePractice());
  };

  // Mizan earth-tone palette for gender distinction
  const getGenderColor = (gender: string) => {
    if (gender === 'm') return 'var(--mizan-slate)';
    if (gender === 'f') return 'var(--mizan-mauve)';
    return 'var(--mizan-warm)';
  };

  const filteredPronouns = POSSESSIVE_PRONOUNS.filter(p => p.person === selectedPerson);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-slide-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-micro-label mb-4 text-[var(--mizan-slate)]">
            <Link href="/" className="hover:text-[var(--mizan-mauve)] transition-colors">ГЛАВНАЯ</Link>
            <span>/</span>
            <span className="text-[var(--mizan-deep)]">МЕСТОИМЕНИЯ</span>
          </nav>
          <h1 className="text-3xl mb-2 heading-display-black text-[var(--text-primary)]">
            Местоимения
          </h1>
          <p className="font-display text-[var(--mizan-mauve)]">Притяжательные суффиксы</p>
        </div>

        <div className="flex border border-[var(--border-default)]">
          <button
            onClick={() => setMode('table')}
            className={`tab-btn ${mode === 'table' ? 'active' : 'inactive'}`}
          >
            Справочник
          </button>
          <button
            onClick={() => setMode('practice')}
            className={`tab-btn border-l border-[var(--border-default)] ${mode === 'practice' ? 'active' : 'inactive'}`}
          >
            Практика
          </button>
        </div>
      </header>

      {mode === 'table' ? (
        <div className="space-y-6">
          <div className="flex gap-2">
            {[3, 2, 1].map(person => (
              <button
                key={person}
                onClick={() => setSelectedPerson(person as 3 | 2 | 1)}
                className="flex-1 py-3 transition-colors"
                style={{
                  fontWeight: 700,
                  fontSize: '12px',
                  background: selectedPerson === person ? 'var(--mizan-mauve)' : 'var(--bg-card)',
                  color: selectedPerson === person ? 'white' : 'var(--text-primary)',
                  border: selectedPerson === person ? 'none' : '1px solid var(--border-default)',
                  cursor: 'pointer',
                }}
              >
                {person} лицо {person === 3 ? '(الغائب)' : person === 2 ? '(المخاطب)' : '(المتكلم)'}
              </button>
            ))}
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
              <div>Суффикс</div>
              <div>Значение</div>
              <div>Пример</div>
            </div>
            <div>
              {filteredPronouns.map((pronoun, idx) => (
                <div
                  key={pronoun.id}
                  className={`grid grid-cols-3 p-4 items-center text-center transition-colors border-b border-[var(--border-default)] ${idx % 2 === 0 ? 'bg-[var(--bg-card)]' : 'bg-[var(--bg-primary)]'}`}
                >                  <div className="font-arabic text-4xl" style={{ color: getGenderColor(pronoun.gender) }}>
                    {pronoun.suffix}
                  </div>
                  <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    {pronoun.russian}
                  </div>
                  <div className="font-arabic text-3xl" style={{ color: 'var(--text-primary)' }}>
                    {pronoun.example}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto mt-12">
          <div className="card-static p-8 text-center">
            <div className="mb-8">
              <h2 className="text-2xl" style={{ fontWeight: 700 }}>{practiceQuestion.question}</h2>
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
                    className="p-6 text-4xl font-arabic transition-all"
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
