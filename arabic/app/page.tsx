"use client";

import { useProgress } from '@/hooks/useProgress';
import { ProgressRing } from '@/components/ProgressRing';
import { ArabicText } from '@/components/ArabicText';
import { VERBS } from '@/data/verbs';
import Link from 'next/link';
import { BookOpen, Edit3, Type, FileText, ClipboardList } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { progress } = useProgress();
  const [wordOfDay, setWordOfDay] = useState(VERBS[0]);

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setWordOfDay(VERBS[dayOfYear % VERBS.length]);
  }, []);

  if (!progress) return null;

  const vocabProgress = Math.round((progress.vocabulary.known.length / VERBS.length) * 100) || 0;
  const conjProgress = progress.conjugation.total > 0 ? Math.round((progress.conjugation.correct / progress.conjugation.total) * 100) : 0;
  const quizProgress = progress.quiz.completed > 0 ? 100 : 0;

  const statCards = [
    { label: 'Словарь', detail: `${progress.vocabulary.known.length} / ${VERBS.length} слов`, value: vocabProgress },
    { label: 'Спряжения', detail: `${conjProgress}% верных`, value: conjProgress },
    { label: 'Тесты', detail: `${progress.quiz.completed} пройдено`, value: progress.quiz.bestScore },
  ];

  const navTiles = [
    { href: '/vocabulary', label: 'Словарь', icon: BookOpen },
    { href: '/conjugation', label: 'Спряжения', icon: Edit3 },
    { href: '/pronouns', label: 'Местоимения', icon: Type },
    { href: '/quiz', label: 'Тест', icon: FileText },
    { href: '/homework', label: 'ДЗ', icon: ClipboardList },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-slide-up">
      <header className="mb-2">
        <p className="section-label mb-4">Обзор</p>
        <h1
          className="text-3xl lg:text-4xl mb-2"
          style={{ fontWeight: 900, letterSpacing: '-0.02em' }}
        >
          Добро пожаловать
        </h1>
        <p className="font-display text-lg" style={{ color: 'var(--mizan-mauve)' }}>
          Продолжайте изучение арабского языка
        </p>
      </header>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className={`card-static p-6 flex items-center justify-between stagger-${i + 1}`}
          >
            <div>
              <h3
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: 'var(--mizan-mauve)',
                  marginBottom: '8px',
                }}
              >
                {stat.label}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{stat.detail}</p>
            </div>
            <div className="relative">
              <ProgressRing radius={30} stroke={4} progress={stat.value} color="var(--mizan-mauve)" />
              <span
                className="absolute inset-0 flex items-center justify-center text-xs"
                style={{ fontWeight: 700, color: 'var(--text-primary)' }}
              >
                {stat.value}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Word of the Day */}
      <div className="card-static p-6 lg:p-8 stagger-4 relative overflow-hidden">
        <h2
          className="mb-6 flex items-center gap-3"
          style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)' }}
        >
          <span style={{ width: '40px', height: '2px', background: 'var(--mizan-mauve)', display: 'inline-block' }} />
          Слово дня
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-right flex-1">
            <ArabicText className="text-6xl block mb-2" style={{ color: 'var(--mizan-deep)' }}>
              {wordOfDay.arabic}
            </ArabicText>
            <p className="font-display text-lg" style={{ color: 'var(--mizan-mauve)' }}>
              {wordOfDay.transliteration}
            </p>
          </div>
          <div
            className="hidden md:block"
            style={{ width: '1px', height: '96px', background: 'var(--mizan-sand)' }}
          />
          <div className="flex-1 text-center md:text-left space-y-3">
            <p className="text-2xl" style={{ fontWeight: 700 }}>{wordOfDay.russian}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span
                className="px-3 py-1 text-sm"
                style={{ background: 'var(--mizan-sand)', border: '1px solid var(--border-default)' }}
              >
                Корень: <ArabicText>{wordOfDay.root}</ArabicText>
              </span>
              <span
                className="px-3 py-1 text-sm"
                style={{ background: 'var(--mizan-sand)', border: '1px solid var(--border-default)' }}
              >
                المضارع: <ArabicText>{wordOfDay.mudari}</ArabicText>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 stagger-5">
        {navTiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="card p-6 flex flex-col items-center justify-center text-center gap-3"
          >
            <div
              className="w-12 h-12 flex items-center justify-center"
              style={{ background: 'var(--mauve-10)', color: 'var(--mizan-mauve)' }}
            >
              <tile.icon size={24} strokeWidth={1.5} />
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--text-primary)',
              }}
            >
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
