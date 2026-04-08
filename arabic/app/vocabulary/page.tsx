"use client";

import { useState } from 'react';
import { VERBS } from '@/data/verbs';
import { useProgress } from '@/hooks/useProgress';
import { ArabicText } from '@/components/ArabicText';
import { getBab } from '@/lib/conjugationEngine';

export default function Vocabulary() {
  const { progress, updateProgress } = useProgress();
  const [mode, setMode] = useState<'table' | 'cards'>('table');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cardVerbs.length);
    }, 150);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-slide-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="section-label mb-3">Лексика</p>
          <h1 className="text-3xl mb-2" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
            Словарь
          </h1>
          <p className="font-display" style={{ color: 'var(--mizan-mauve)' }}>
            {VERBS.length} основных глаголов
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex" style={{ border: '1px solid var(--border-default)' }}>
          <button
            onClick={() => setMode('table')}
            style={{
              padding: '10px 20px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              background: mode === 'table' ? 'var(--mizan-mauve)' : 'transparent',
              color: mode === 'table' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 300ms ease-in-out',
            }}
          >
            Таблица
          </button>
          <button
            onClick={() => setMode('cards')}
            style={{
              padding: '10px 20px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              background: mode === 'cards' ? 'var(--mizan-mauve)' : 'transparent',
              color: mode === 'cards' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderLeft: '1px solid var(--border-default)',
              cursor: 'pointer',
              transition: 'all 300ms ease-in-out',
            }}
          >
            Карточки
          </button>
        </div>
      </header>

      {mode === 'table' ? (
        <div className="card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'var(--mizan-sand)', borderBottom: '1px solid var(--border-default)' }}>
                  <th className="p-4" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)' }}>Арабский</th>
                  <th className="p-4" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)' }}>Транслит</th>
                  <th className="p-4" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)' }}>Перевод</th>
                  <th className="p-4" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)' }}>Корень</th>
                  <th className="p-4 text-center" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--mizan-mauve)' }}>Баб</th>
                </tr>
              </thead>
              <tbody>
                {VERBS.map((verb) => {
                  const isKnown = knownVerbs.has(verb.id);
                  return (
                    <tr
                      key={verb.id}
                      style={{
                        borderBottom: '1px solid var(--border-default)',
                        borderLeft: isKnown ? '3px solid var(--color-success)' : '3px solid transparent',
                        transition: 'background 150ms ease-in-out',
                      }}
                      className="hover:bg-[var(--mizan-sand)]"
                    >
                      <td className="p-4">
                        <ArabicText className="text-2xl" style={{ color: 'var(--mizan-deep)' }}>{verb.arabic}</ArabicText>
                      </td>
                      <td className="p-4" style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>{verb.transliteration}</td>
                      <td className="p-4" style={{ fontWeight: 700 }}>{verb.russian}</td>
                      <td className="p-4">
                        <ArabicText className="text-lg" style={{ color: 'var(--mizan-slate)' }}>{verb.root}</ArabicText>
                      </td>
                      <td className="p-4 text-center" style={{ fontWeight: 700, color: 'var(--mizan-mauve)' }}>
                        {getBab(verb)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center max-w-md mx-auto">
          <div className="w-full flex justify-between text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            <span>Изучено: {knownVerbs.size} / {VERBS.length}</span>
            <span>{currentCardIndex + 1} / {VERBS.length}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 mb-8 overflow-hidden" style={{ background: 'var(--mizan-sand)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / VERBS.length) * 100}%`, background: 'var(--mizan-mauve)' }}
            />
          </div>

          {/* Flashcard */}
          <div
            className="w-full h-64 perspective-1000 cursor-pointer mb-8"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
              >
                <ArabicText className="text-6xl mb-4" style={{ color: 'var(--mizan-deep)' }}>{currentVerb.arabic}</ArabicText>
                <p style={{ color: 'var(--text-secondary)' }}>{currentVerb.transliteration}</p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180"
                style={{ background: 'var(--mizan-sand)', border: '1px solid var(--border-active)' }}
              >
                <h3 className="text-2xl mb-6" style={{ fontWeight: 700 }}>{currentVerb.russian}</h3>
                <div className="space-y-3 w-full text-center">
                  <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Корень:</span>
                    <ArabicText className="text-lg">{currentVerb.root}</ArabicText>
                  </div>
                  <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Баб:</span>
                    <span className="text-lg" style={{ fontWeight: 700, color: 'var(--mizan-mauve)' }}>{getBab(currentVerb)}</span>
                  </div>
                  <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>المضارع:</span>
                    <ArabicText className="text-lg" style={{ color: 'var(--mizan-slate)' }}>{currentVerb.mudari}</ArabicText>
                  </div>
                  <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>الماضي المجهول:</span>
                    <ArabicText className="text-lg" style={{ color: 'var(--mizan-slate)' }}>{currentVerb.passivePast}</ArabicText>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>المضارع المجهول:</span>
                    <ArabicText className="text-lg" style={{ color: 'var(--mizan-slate)' }}>{currentVerb.passivePresent}</ArabicText>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <button
              onClick={nextCard}
              className="btn-ghost flex-1 py-3"
              style={{ border: '1px solid var(--color-error)', color: 'var(--color-error)', letterSpacing: '0.15em' }}
            >
              Учу ✗
            </button>
            <button
              onClick={handleKnow}
              className="btn-primary flex-1 py-3"
              style={{ background: 'var(--color-success)', letterSpacing: '0.15em' }}
            >
              Знаю ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
