"use client";

import { useMemo } from 'react';

import { useProgress } from '@/hooks/useProgress';
import { ProgressRing } from '@/components/ProgressRing';
import { ArabicText } from '@/components/ArabicText';
import { VERBS } from '@/data/verbs';
import Link from 'next/link';
import { BookOpen, Edit3, Type, FileText, ClipboardList, GraduationCap, List, BookMarked, Flame, Trophy, Target, ArrowRight } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

export default function Dashboard() {
  const { progress } = useProgress();
  const [wordOfDay, setWordOfDay] = useState<typeof VERBS[0] | null>(null);
  const [onboarded, setOnboarded] = useState(true); // default true to avoid flash

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setWordOfDay(VERBS[dayOfYear % VERBS.length]);
    setOnboarded(localStorage.getItem('mizan_onboarded') === 'true');
  }, []);

  const handleContinue = useCallback(() => {
    localStorage.setItem('mizan_onboarded', 'true');
    setOnboarded(true);
  }, []);

  // All hooks MUST be called before any early returns
  const recommendedVerb = useMemo(() => {
    if (!progress) return VERBS[0];
    const masteredSet = new Set(progress.exam.verbsMastered);
    const notMastered = VERBS.filter(v => !masteredSet.has(v.id));
    if (notMastered.length === 0) return VERBS[0];
    const attemptedSet = new Set(progress.exam.verbsAttempted);
    const notAttempted = notMastered.filter(v => !attemptedSet.has(v.id));
    if (notAttempted.length > 0) return notAttempted[0];
    return notMastered[0];
  }, [progress]);

  if (!progress || !wordOfDay) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-sm uppercase tracking-widest text-[var(--mizan-deep)]">
        [ LOADING... ]
      </div>
    );
  }

  const vocabProgress = Math.round((progress.vocabulary.known.length / VERBS.length) * 100) || 0;
  const conjProgress = progress.conjugation.total > 0 ? Math.round((progress.conjugation.correct / progress.conjugation.total) * 100) : 0;

  const isNewUser = !onboarded && vocabProgress === 0 && conjProgress === 0 && progress.quiz.completed === 0;

  // Exam mastery data
  const masteredCount = progress.exam.verbsMastered.length;
  const attemptedCount = progress.exam.verbsAttempted.length;
  const examPercent = Math.round((masteredCount / VERBS.length) * 100);

  // Streak
  const streakCount = progress.streak.currentStreak;

  if (isNewUser) {
    return (
      <div className="max-w-5xl mx-auto space-y-12 animate-fade-slide-up">
        <header className="mb-8 border-b border-[var(--mizan-deep)] pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--mizan-slate)] mb-4">
            Система инициализирована
          </p>
          <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tight text-[var(--mizan-deep)] mb-4 leading-none">
            Арабский<br />
            <span className="text-[var(--mizan-mauve)]">Тренер</span>
          </h1>
          <p className="font-mono text-sm max-w-lg text-[var(--mizan-slate)] leading-relaxed">
            ДОБРО ПОЖАЛОВАТЬ. ЭТОТ ИНСТРУМЕНТ СОЗДАН ДЛЯ ОТРАБОТКИ СЛОВАРНОГО ЗАПАСА, СПРЯЖЕНИЙ И ТЕСТИРОВАНИЯ. ВЫПОЛНИТЕ ШАГИ НИЖЕ ДЛЯ НАЧАЛА.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[var(--border-strong)] bg-[var(--bg-primary)] rounded-[var(--radius-md)] overflow-hidden">
          <Link href="/vocabulary" className="block p-8 border-b md:border-b-0 md:border-r border-[var(--border-default)] flex flex-col items-start hover:bg-[var(--mizan-sand)] transition-colors group cursor-pointer text-left">
            <span className="font-mono text-4xl font-black text-[var(--mizan-sand)] group-hover:text-[var(--mizan-mauve)] transition-colors mb-6">01</span>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-3 text-[var(--text-primary)]">Лексика</h2>
            <p className="font-mono text-xs text-[var(--mizan-slate)] mb-6 leading-relaxed">
              Освойте базовые глаголы и их значения. Формирование словарного запаса — первый шаг.
            </p>
          </Link>
          <Link href="/conjugation" className="block p-8 border-b md:border-b-0 md:border-r border-[var(--border-default)] flex flex-col items-start hover:bg-[var(--mizan-sand)] transition-colors group cursor-pointer text-left">
            <span className="font-mono text-4xl font-black text-[var(--mizan-sand)] group-hover:text-[var(--mizan-mauve)] transition-colors mb-6">02</span>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-3 text-[var(--text-primary)]">Спряжения</h2>
            <p className="font-mono text-xs text-[var(--mizan-slate)] mb-6 leading-relaxed">
              Теория и практика изменения глаголов. Интерактивные визуальные таблицы времен.
            </p>
          </Link>
          <Link href="/exam" className="block p-8 flex flex-col items-start hover:bg-[var(--mizan-sand)] transition-colors group cursor-pointer text-left">
            <span className="font-mono text-4xl font-black text-[var(--mizan-sand)] group-hover:text-[var(--mizan-mauve)] transition-colors mb-6">03</span>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-3 text-[var(--text-primary)]">Экзамен</h2>
            <p className="font-mono text-xs text-[var(--mizan-slate)] mb-6 leading-relaxed">
              Тренажёр формата экзамена — заполни таблицу спряжений для каждого глагола.
            </p>
          </Link>
        </div>

        <button
          onClick={handleContinue}
          className="block w-full bg-[var(--mizan-deep)] text-[var(--mizan-cream)] text-center py-6 font-mono text-lg uppercase tracking-widest font-bold hover:bg-[var(--mizan-slate)] transition-colors min-h-[48px] rounded-[var(--radius-md)] cursor-pointer"
        >
          Продолжить к обучению →
        </button>
      </div>
    );
  }

  const statCards = [
    { label: 'Словарь', detail: `${progress.vocabulary.known.length} / ${VERBS.length} слов`, value: vocabProgress },
    { label: 'Спряжения', detail: `${conjProgress}% верных`, value: conjProgress },
    { label: 'Тесты', detail: `${progress.quiz.completed} пройдено`, value: progress.quiz.bestScore },
  ];

  const navTiles = [
    { href: '/vocabulary', label: 'Словарь', icon: BookOpen },
    { href: '/verbs', label: 'Все глаголы', icon: List },
    { href: '/conjugation', label: 'Спряжения', icon: Edit3 },
    { href: '/pronouns', label: 'Местоимения', icon: Type },
    { href: '/topics', label: 'Темы', icon: BookMarked },
    { href: '/exam', label: 'Экзамен', icon: GraduationCap },
    { href: '/quiz', label: 'Тест', icon: FileText },
    { href: '/homework', label: 'ДЗ', icon: ClipboardList },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-slide-up">
      <header className="mb-2 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <p className="text-micro-label mb-4 flex items-center gap-3">
            <span className="w-10 h-0.5 bg-[var(--mizan-mauve)] inline-block" />
            Обзор
          </p>
          <h1 className="text-3xl lg:text-4xl mb-2 heading-display-black text-[var(--text-primary)]">
            Добро пожаловать
          </h1>
          <p className="font-display text-lg text-[var(--mizan-mauve)]">
            Продолжайте изучение арабского языка
          </p>
        </div>

        {/* Streak Badge */}
        {streakCount > 0 && (
          <div className="flex items-center gap-3 px-5 py-3 border border-[var(--border-default)] bg-[var(--bg-card)] rounded-[var(--radius-md)] shadow-[var(--shadow-soft)]">
            <Flame className="w-6 h-6 text-[#e67e22]" />
            <div>
              <div className="font-mono text-2xl font-black text-[var(--mizan-deep)] leading-none">{streakCount}</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--mizan-slate)]">
                {streakCount === 1 ? 'день' : streakCount < 5 ? 'дня' : 'дней'} подряд
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Exam CTA — Primary Call-to-Action */}
      <Link
        href="/exam"
        className="block border border-[var(--border-strong)] bg-[var(--bg-card)] p-5 md:p-8 hover:bg-[var(--bg-card-hover)] transition-all rounded-[var(--radius-md)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] group"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-[var(--mizan-deep)] text-[var(--mizan-cream)]">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)] mb-1">
              Подготовка к экзамену
            </div>
            <div className="text-xl md:text-2xl font-bold uppercase tracking-wide text-[var(--mizan-deep)] mb-2">
              {masteredCount === VERBS.length
                ? 'Все глаголы освоены!'
                : `Продолжить: ${recommendedVerb.russian}`
              }
            </div>
            {/* Progress bar */}
            <div className="w-full max-w-md mx-auto md:mx-0">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-[var(--mizan-sand)] border border-[var(--border-default)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--mizan-deep)] transition-all duration-500"
                    style={{ width: `${examPercent}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-[var(--mizan-slate)] flex-shrink-0">
                  {masteredCount}/{VERBS.length}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--mizan-slate)]">
                  <Trophy className="w-3 h-3 inline mr-1" />Освоено: {masteredCount}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--mizan-slate)]">
                  <Target className="w-3 h-3 inline mr-1" />Пробовали: {attemptedCount}
                </span>
              </div>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-[var(--mizan-slate)] group-hover:text-[var(--mizan-deep)] transition-colors flex-shrink-0" />
        </div>
      </Link>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className={`card-telemetry p-6 flex items-center justify-between stagger-${i + 1}`}
            aria-label={`Статистика: ${stat.label}`}
          >
            <div>
              <h3 className="text-micro-label mb-2">
                {stat.label}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">{stat.detail}</p>
            </div>
            <div className="relative">
              <ProgressRing radius={30} stroke={4} progress={stat.value} color="var(--mizan-deep)" />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-[var(--text-primary)]">
                {stat.value}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Word of the Day */}
      <div className="card-telemetry p-6 lg:p-8 stagger-4 relative overflow-hidden" aria-label="Слово дня">
        <h2 className="mb-6 flex items-center gap-3 text-micro-label">
          <span className="w-10 h-0.5 bg-[var(--mizan-mauve)] inline-block" />
          Слово дня
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-right flex-1">
            <ArabicText className="text-4xl md:text-6xl block mb-2 text-[var(--mizan-deep)]">
              {wordOfDay.arabic}
            </ArabicText>
            <p className="font-display text-lg text-[var(--mizan-mauve)]">
              {wordOfDay.transliteration}
            </p>
          </div>
          <div className="hidden md:block w-px h-24 bg-[var(--mizan-sand)]" />
          <div className="flex-1 text-center md:text-left space-y-3">
            <p className="text-2xl font-bold text-[var(--text-primary)]">{wordOfDay.russian}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-3 py-1 text-sm bg-[var(--mizan-sand)] border border-[var(--border-default)] text-[var(--text-primary)] font-mono">
                Корень: <ArabicText>{wordOfDay.root}</ArabicText>
              </span>
              <span className="px-3 py-1 text-sm bg-[var(--mizan-sand)] border border-[var(--border-default)] text-[var(--text-primary)] font-mono">
                المضارع: <ArabicText>{wordOfDay.mudari}</ArabicText>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-5">
        {navTiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="card-telemetry p-4 md:p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-[var(--mizan-sand)] transition-colors min-h-[48px]"
            aria-label={`Перейти в ${tile.label}`}
          >
            <div className="w-12 h-12 flex items-center justify-center bg-[var(--mauve-10)] text-[var(--mizan-mauve)] rounded-none">
              <tile.icon size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)] font-sans">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
