"use client";

import { useState } from 'react';
import { VERBS } from '@/data/verbs';
import { useProgress } from '@/hooks/useProgress';
import { ArabicText } from '@/components/ArabicText';
import { getBab } from '@/lib/conjugationEngine';
import Link from 'next/link';

export default function Vocabulary() {
  const { progress, updateProgress } = useProgress();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  if (!progress) return null;

  const knownVerbs = new Set(progress.vocabulary.known);
  const unknownVerbs = VERBS.filter(v => !knownVerbs.has(v.id));
  const cardVerbs = [...unknownVerbs, ...VERBS.filter(v => knownVerbs.has(v.id))];
  const currentVerb = cardVerbs[currentCardIndex];

  const handleKnow = () => {
    if (!knownVerbs.has(currentVerb.id)) {
      updateProgress(prev => ({
        ...prev,
        vocabulary: { known: [...prev.vocabulary.known, currentVerb.id] }
      }));
    }
    nextCard();
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cardVerbs.length);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-8 animate-fade-slide-up">
      {/* Header */}
      <header className="mb-16 border-b border-[var(--mizan-deep)] pb-8">
        <nav className="flex flex-wrap items-center gap-2 text-micro-label mb-6 text-[var(--mizan-slate)]">
          <Link href="/" className="hover:text-[var(--mizan-deep)] transition-colors">ГЛАВНАЯ</Link>
          <span className="text-[var(--mizan-sand)]">/</span>
          <span className="text-[var(--mizan-deep)]">СЛОВАРЬ</span>
        </nav>
        <div className="flex justify-between items-end">
          <h1 className="text-4xl md:text-5xl heading-display-black text-[var(--mizan-deep)] uppercase tracking-tight">
            Лексика
          </h1>
          <div className="text-right">
            <div className="font-mono text-xs uppercase tracking-widest text-[var(--mizan-slate)] mb-1">
              Прогресс
            </div>
            <div className="font-display italic text-xl text-[var(--mizan-deep)]">
              {knownVerbs.size} / {VERBS.length}
            </div>
          </div>
        </div>
      </header>

      {/* Dictionary Entry */}
      <div className="relative bg-[var(--bg-card)] border border-[var(--mizan-deep)] p-8 md:p-16 mb-12 shadow-[8px_8px_0_0_var(--mizan-sand)]">
        {/* Entry Header */}
        <div className="flex justify-between items-start mb-12 border-b border-[var(--mizan-sand)] pb-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mizan-slate)] mb-4">
              Словарная статья № {currentVerb.id}
            </div>
            <ArabicText className="text-7xl md:text-8xl text-[var(--mizan-deep)] leading-tight">
              {currentVerb.arabic}
            </ArabicText>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mizan-slate)] mb-2">
              Транскрипция
            </div>
            <div className="font-sans text-lg text-[var(--mizan-slate)] tracking-wide">
              [{currentVerb.transliteration}]
            </div>
          </div>
        </div>

        {/* Translation */}
        <div className="mb-12">
          <div className="font-display italic text-3xl md:text-4xl text-[var(--mizan-deep)]">
            {currentVerb.russian}
          </div>
        </div>

        {/* Morphological Data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[var(--mizan-sand)] pt-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mizan-slate)] mb-2">
              Корень
            </div>
            <ArabicText className="text-2xl text-[var(--mizan-deep)]">
              {currentVerb.root}
            </ArabicText>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mizan-slate)] mb-2">
              Баб
            </div>
            <div className="font-display italic text-2xl text-[var(--mizan-deep)]">
              {getBab(currentVerb)}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mizan-slate)] mb-2">
              Настоящее
            </div>
            <ArabicText className="text-2xl text-[var(--mizan-slate)]">
              {currentVerb.mudari}
            </ArabicText>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mizan-slate)] mb-2">
              Пассив
            </div>
            <ArabicText className="text-2xl text-[var(--mizan-slate)]">
              {currentVerb.passivePast}
            </ArabicText>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={nextCard}
          className="flex-1 py-6 border border-[var(--mizan-deep)] bg-[var(--bg-card)] text-[var(--mizan-deep)] font-mono text-xs uppercase tracking-[0.2em] transition-all hover:bg-[var(--mizan-sand)] active:bg-[var(--mizan-warm)] shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]"
        >
          Нужна практика
        </button>
        <button
          onClick={handleKnow}
          className="flex-1 py-6 border border-[var(--mizan-deep)] bg-[var(--bg-card)] text-[var(--mizan-deep)] font-mono text-xs uppercase tracking-[0.2em] transition-all hover:bg-[var(--mizan-sand)] active:bg-[var(--mizan-warm)] shadow-[4px_4px_0_0_var(--mizan-deep)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]"
        >
          Усвоено
        </button>
      </div>
    </div>
  );
}
