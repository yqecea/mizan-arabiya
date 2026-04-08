"use client";

import { useState } from 'react';
import { generateQuiz, QuizQuestion } from '@/lib/quizGenerator';
import { useProgress } from '@/hooks/useProgress';
import { ArabicText } from '@/components/ArabicText';
import { ProgressRing } from '@/components/ProgressRing';

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
      <div className="max-w-2xl mx-auto mt-12 animate-fade-slide-up">
        <div className="card-static p-8">
          <p className="section-label mb-4">Проверка знаний</p>
          <h1 className="text-3xl mb-8" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
            Настройка теста
          </h1>

          <div className="space-y-8">
            <div>
              <h3
                style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)', marginBottom: '16px' }}
              >
                Темы
              </h3>
              <div className="space-y-3">
                {topicOptions.map(t => (
                  <label
                    key={t.key}
                    className="flex items-center gap-3 p-3 cursor-pointer transition-colors"
                    style={{ border: '1px solid var(--border-default)', background: (topics as Record<string, boolean>)[t.key] ? 'var(--mauve-5)' : 'transparent' }}
                  >
                    <input
                      type="checkbox"
                      checked={(topics as Record<string, boolean>)[t.key]}
                      onChange={e => setTopics(prev => ({...prev, [t.key]: e.target.checked}))}
                      className="w-5 h-5"
                      style={{ accentColor: 'var(--mizan-mauve)' }}
                    />
                    <span style={{ fontWeight: 400 }}>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3
                style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)', marginBottom: '16px' }}
              >
                Количество вопросов
              </h3>
              <div className="flex gap-4">
                {[10, 20, 30].map(num => (
                  <label
                    key={num}
                    className="flex-1 p-3 text-center cursor-pointer transition-colors"
                    style={{
                      border: `1px solid ${questionCount === num ? 'var(--mizan-mauve)' : 'var(--border-default)'}`,
                      background: questionCount === num ? 'var(--mauve-10)' : 'transparent',
                      color: questionCount === num ? 'var(--mizan-mauve)' : 'var(--text-primary)',
                    }}
                  >
                    <input type="radio" name="count" value={num} checked={questionCount === num} onChange={() => setQuestionCount(num)} className="hidden" />
                    <span style={{ fontWeight: 700 }}>{num}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              disabled={!topics.vocab && !topics.conj && !topics.pronouns && !topics.babs && !topics.participles}
              className="btn-primary w-full py-4"
              style={{ fontSize: '12px' }}
            >
              Начать тест
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const ringColor = percentage >= 80 ? 'var(--color-success)' : percentage >= 50 ? 'var(--mizan-warm)' : 'var(--color-error)';

    return (
      <div className="max-w-3xl mx-auto mt-8 animate-fade-slide-up space-y-8">
        <div className="card-static p-8 text-center">
          <p className="section-label justify-center mb-4">Итоги</p>
          <h2 className="text-3xl mb-8" style={{ fontWeight: 900 }}>Результаты</h2>
          <div className="flex justify-center mb-8 relative">
            <ProgressRing radius={80} stroke={12} progress={percentage} color={ringColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl" style={{ fontWeight: 900 }}>{percentage}%</span>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>{score} / {questions.length}</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => setIsStarted(false)} className="btn-ghost">
              Настроить заново
            </button>
            <button onClick={startQuiz} className="btn-primary">
              Пройти снова
            </button>
          </div>
        </div>

        <div className="card-static p-6">
          <h3
            className="mb-4"
            style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)' }}
          >
            Разбор ошибок
          </h3>
          <div className="space-y-4">
            {results.filter(r => !r.correct).length === 0 ? (
              <p className="text-center py-4" style={{ color: 'var(--color-success)', fontWeight: 700 }}>Отлично! Ни одной ошибки.</p>
            ) : (
              results.filter(r => !r.correct).map((r, i) => (
                <div
                  key={i}
                  className="p-4"
                  style={{ background: 'var(--bg-primary)', borderLeft: '3px solid var(--color-error)' }}
                >
                  <p className="mb-2" style={{ fontWeight: 700 }}>{r.q.question}</p>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm">
                    <div className="flex-1 p-2" style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)' }}>
                      Ваш ответ: <ArabicText style={{ fontWeight: 700 }}>{r.selected}</ArabicText>
                    </div>
                    <div className="flex-1 p-2" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                      Правильно: <ArabicText style={{ fontWeight: 700 }}>{r.q.correctAnswer}</ArabicText>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz In-Progress
  const currentQ = questions[currentIndex];
  const isArabicOption = currentQ.type.includes('ar_ru') === false && currentQ.type !== 'conj_identify';

  return (
    <div className="max-w-3xl mx-auto mt-8 animate-fade-slide-up">
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
          <span>Вопрос {currentIndex + 1} из {questions.length}</span>
          <span>Счёт: {score}</span>
        </div>
        <div className="w-full h-1 overflow-hidden" style={{ background: 'var(--mizan-sand)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, background: 'var(--mizan-mauve)' }}
          />
        </div>
      </div>

      <div className="card-static p-8 text-center">
        <h2
          className={`text-2xl md:text-3xl mb-12 ${currentQ.question.match(/[\u0600-\u06FF]/) ? 'font-arabic' : ''}`}
          style={{ fontWeight: 700 }}
        >
          {currentQ.question}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQ.options.map((option) => {
            let bg = 'var(--bg-card)';
            let borderColor = 'var(--border-default)';
            let textColor = 'var(--text-primary)';
            let opacity = '1';

            if (selectedAnswer) {
              if (option === currentQ.correctAnswer) {
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
                className={`p-6 text-xl transition-all ${isArabicOption ? 'font-arabic text-3xl' : ''}`}
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
      </div>
    </div>
  );
}
