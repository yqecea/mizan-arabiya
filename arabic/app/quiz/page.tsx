"use client";

import { useState } from 'react';
import { generateQuiz, QuizQuestion } from '@/lib/quizGenerator';
import { useProgress } from '@/hooks/useProgress';
import { ArabicText } from '@/components/ArabicText';
import Link from 'next/link';

export default function Quiz() {
  const { updateProgress } = useProgress();
  const [isStarted, setIsStarted] = useState(false);
  const [topics, setTopics] = useState({ vocab: true, conj: true, pronouns: true, babs: true, participles: true });
  const [questionCount, setQuestionCount] = useState(10);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<{q: QuizQuestion, correct: boolean, selected: string}[]>([]);

  const startQuiz = () => {
    if (!topics.vocab && !topics.conj && !topics.pronouns && !topics.babs && !topics.participles) return;
    const q = generateQuiz(questionCount, topics);
    setQuestions(q);
    setCurrentIndex(0);
    setScore(0);
    setResults([]);
    setIsStarted(true);
    setIsFinished(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    const isCorrect = option === questions[currentIndex].correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    setResults(prev => [...prev, { q: questions[currentIndex], correct: isCorrect, selected: option }]);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
      } else {
        finishQuiz(score + (isCorrect ? 1 : 0));
      }
    }, isCorrect ? 800 : 2000);
  };

  const finishQuiz = (finalScore: number) => {
    setIsFinished(true);
    const percentage = Math.round((finalScore / questions.length) * 100);
    updateProgress(prev => ({
      ...prev,
      quiz: {
        completed: prev.quiz.completed + 1,
        bestScore: Math.max(prev.quiz.bestScore, percentage),
        history: [...prev.quiz.history, { score: percentage, date: new Date().toISOString() }]
      }
    }));
  };

  // Setup Screen
  if (!isStarted) {
    const topicOptions = [
      { key: 'vocab', label: 'Словарь (перевод слов)' },
      { key: 'conj', label: 'Спряжения (الماضي, المضارع, المجهول)' },
      { key: 'pronouns', label: 'Притяжательные местоимения' },
      { key: 'babs', label: 'Типы глаголов (Бабы)' },
      { key: 'participles', label: 'Причастия (Фаиль / Мафъуль)' },
    ];

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-8 animate-fade-slide-up">
        <header className="mb-16 border-b border-[var(--mizan-deep)] pb-8">
          <nav className="flex flex-wrap items-center gap-2 text-micro-label mb-6 text-[var(--mizan-slate)]">
            <Link href="/" className="hover:text-[var(--mizan-deep)] transition-colors">ГЛАВНАЯ</Link>
            <span className="text-[var(--mizan-sand)]">/</span>
            <span className="text-[var(--mizan-deep)]">ЭКЗАМЕН</span>
          </nav>
          <h1 className="text-4xl md:text-5xl heading-display-black text-[var(--mizan-deep)] uppercase tracking-tight">
            Письменный экзамен
          </h1>
          <p className="font-display italic text-xl text-[var(--mizan-slate)] mt-4">
            Выберите дисциплины для проверки знаний.
          </p>
        </header>

        <div className="bg-[var(--bg-card)] border border-[var(--mizan-deep)] p-8 md:p-12 shadow-[8px_8px_0_0_var(--mizan-sand)]">
          <div className="space-y-12">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--mizan-deep)] border-b border-[var(--mizan-deep)] pb-2 mb-6">
                Дисциплины
              </div>
              <div className="space-y-4">
                {topicOptions.map(t => {
                  const isChecked = (topics as Record<string, boolean>)[t.key];
                  return (
                    <label
                      key={t.key}
                      className={`flex items-center gap-4 p-4 border border-[var(--mizan-deep)] cursor-pointer transition-all ${isChecked ? 'bg-[var(--mizan-sand)]' : 'bg-[var(--bg-card)] hover:bg-[var(--mizan-sand)] shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => setTopics(prev => ({...prev, [t.key]: e.target.checked}))}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 border border-[var(--mizan-deep)] flex items-center justify-center transition-colors ${isChecked ? 'bg-[var(--mizan-deep)]' : 'bg-transparent'}`}>
                        {isChecked && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span className="font-display italic text-lg text-[var(--mizan-deep)]">{t.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--mizan-deep)] border-b border-[var(--mizan-deep)] pb-2 mb-6">
                Объем экзамена
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {[10, 20, 30].map(num => {
                  const isSelected = questionCount === num;
                  return (
                    <label
                      key={num}
                      className={`flex-1 p-4 text-center border border-[var(--mizan-deep)] cursor-pointer transition-all ${isSelected ? 'bg-[var(--mizan-sand)]' : 'bg-[var(--bg-card)] hover:bg-[var(--mizan-sand)] shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]'}`}
                    >
                      <input type="radio" name="count" value={num} checked={isSelected} onChange={() => setQuestionCount(num)} className="hidden" />
                      <span className="font-mono text-lg text-[var(--mizan-deep)]">{num} ВОПРОСОВ</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={!topics.vocab && !topics.conj && !topics.pronouns && !topics.babs && !topics.participles}
              className="w-full py-6 border border-[var(--mizan-deep)] bg-[var(--bg-card)] text-[var(--mizan-deep)] font-mono text-sm uppercase tracking-[0.2em] transition-all hover:bg-[var(--mizan-sand)] active:bg-[var(--mizan-warm)] shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0_0_var(--mizan-deep)] disabled:hover:translate-y-0 disabled:hover:translate-x-0"
            >
              Приступить к экзамену
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-8 animate-fade-slide-up">
        <header className="mb-12 border-b border-[var(--mizan-deep)] pb-8 text-center">
          <nav className="flex flex-wrap items-center justify-center gap-2 text-micro-label mb-6 text-[var(--mizan-slate)]">
            <Link href="/" className="hover:text-[var(--mizan-deep)] transition-colors">ГЛАВНАЯ</Link>
            <span className="text-[var(--mizan-sand)]">/</span>
            <span className="text-[var(--mizan-deep)]">РЕЗУЛЬТАТЫ</span>
          </nav>
          <h1 className="text-4xl md:text-5xl heading-display-black text-[var(--mizan-deep)] uppercase tracking-tight">
            Ведомость успеваемости
          </h1>
        </header>

        <div className="bg-[var(--bg-card)] border border-[var(--mizan-deep)] p-8 md:p-16 mb-12 shadow-[8px_8px_0_0_var(--mizan-sand)] text-center">
          <div className="font-display italic text-2xl text-[var(--mizan-slate)] mb-4">
            Итоговый балл
          </div>
          <div className="text-8xl font-mono text-[var(--mizan-deep)] mb-8">
            {percentage}%
          </div>
          <div className="font-mono text-sm uppercase tracking-widest text-[var(--mizan-deep)] border-t border-[var(--mizan-sand)] pt-8">
            Верно: {score} из {questions.length}
          </div>
        </div>

        <div className="flex gap-6 mb-16">
          <button onClick={() => setIsStarted(false)} className="flex-1 py-6 border border-[var(--mizan-deep)] bg-[var(--bg-card)] text-[var(--mizan-deep)] font-mono text-xs uppercase tracking-[0.2em] transition-all hover:bg-[var(--mizan-sand)] active:bg-[var(--mizan-warm)] shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]">
            Новый экзамен
          </button>
          <button onClick={startQuiz} className="flex-1 py-6 border border-[var(--mizan-deep)] bg-[var(--bg-card)] text-[var(--mizan-deep)] font-mono text-xs uppercase tracking-[0.2em] transition-all hover:bg-[var(--mizan-sand)] active:bg-[var(--mizan-warm)] shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]">
            Пересдача
          </button>
        </div>

        {results.filter(r => !r.correct).length > 0 && (
          <div>
            <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--mizan-deep)] border-b border-[var(--mizan-deep)] pb-4 mb-8">
              Разбор ошибок
            </h3>
            <div className="space-y-6">
              {results.filter(r => !r.correct).map((r, i) => (
                <div key={i} className="border border-[var(--mizan-deep)] p-6 bg-[var(--bg-card)]">
                  <p className="font-display italic text-xl text-[var(--mizan-deep)] mb-6 pb-4 border-b border-[var(--mizan-sand)]">
                    {r.q.question}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="border border-[var(--mizan-deep)] p-4 bg-[var(--mizan-sand)]">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)] mb-2">Ваш ответ</div>
                      <div className={`text-xl text-[var(--mizan-deep)] ${r.q.type.includes('ar_ru') === false && r.q.type !== 'conj_identify' ? 'font-arabic' : 'font-display italic'}`}>{r.selected}</div>
                    </div>
                    <div className="border border-[var(--mizan-deep)] p-4 bg-[var(--bg-card)]">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)] mb-2">Правильный ответ</div>
                      <div className={`text-xl text-[var(--mizan-deep)] ${r.q.type.includes('ar_ru') === false && r.q.type !== 'conj_identify' ? 'font-arabic' : 'font-display italic'}`}>{r.q.correctAnswer}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quiz In-Progress
  const currentQ = questions[currentIndex];
  const isArabicOption = currentQ.type.includes('ar_ru') === false && currentQ.type !== 'conj_identify';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-8 animate-fade-slide-up">
      <header className="mb-12 flex items-end justify-between border-b border-[var(--mizan-deep)] pb-4">
        <div className="font-mono text-sm uppercase tracking-widest text-[var(--mizan-deep)]">
          Экзаменационный лист
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)] mb-1">
            Экзамен: {currentIndex + 1} / {questions.length}
          </div>
        </div>
      </header>

      <div className="bg-[var(--bg-card)] border border-[var(--mizan-deep)] p-8 md:p-16 mb-12 shadow-[8px_8px_0_0_var(--mizan-sand)]">
        <h2
          className={`text-3xl md:text-4xl text-center mb-16 leading-relaxed ${currentQ.question.match(/[\u0600-\u06FF]/) ? 'font-arabic' : 'font-display italic'} text-[var(--mizan-deep)]`}
        >
          {currentQ.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentQ.options.map((option) => {
            let isSelected = selectedAnswer === option;
            let isCorrect = option === currentQ.correctAnswer;
            let isIncorrectSelected = isSelected && !isCorrect;
            
            let bgClass = 'bg-[var(--bg-card)]';
            let opacityClass = 'opacity-100';
            let borderClass = 'border-[var(--mizan-deep)]';
            let textClass = 'text-[var(--mizan-deep)]';
            let shadowClass = 'shadow-[4px_4px_0_0_var(--mizan-deep)] hover:bg-[var(--mizan-sand)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]';
            let cursorClass = 'cursor-pointer';

            if (selectedAnswer) {
              cursorClass = 'cursor-default';
              shadowClass = 'shadow-none translate-y-[4px] translate-x-[4px]'; // Force pushed down state
              if (isCorrect) {
                // Correct answer highlighted subtly, not acidic
                bgClass = 'bg-[var(--mizan-sand)]';
                borderClass = 'border-[var(--mizan-mauve)]';
              } else if (isIncorrectSelected) {
                // Incorrect answer
                bgClass = 'bg-[var(--bg-card)]';
                textClass = 'text-[var(--mizan-slate)] line-through';
                borderClass = 'border-[var(--mizan-slate)]';
              } else {
                opacityClass = 'opacity-40';
              }
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`relative p-6 transition-all border ${borderClass} ${bgClass} ${opacityClass} ${textClass} ${shadowClass} ${cursorClass} active:bg-[var(--mizan-warm)]`}
              >
                <div className={`text-2xl md:text-3xl ${isArabicOption ? 'font-arabic' : 'font-display italic'}`}>
                  {option}
                </div>
                {selectedAnswer && isCorrect && (
                  <div className="absolute top-2 right-2 font-mono text-[10px] uppercase text-[var(--mizan-mauve)]">
                    Верно
                  </div>
                )}
                {selectedAnswer && isIncorrectSelected && (
                  <div className="absolute top-2 right-2 font-mono text-[10px] uppercase text-[var(--mizan-slate)]">
                    Ошибка
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

