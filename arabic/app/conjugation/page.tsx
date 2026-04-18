"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { VERBS } from '@/data/verbs';
import { PRONOUNS } from '@/data/conjugations';
import { conjugate, Tense, getRussianVerbTranslation } from '@/lib/conjugationEngine';
import { ArabicText } from '@/components/ArabicText';
import { useProgress } from '@/hooks/useProgress';
import Link from 'next/link';
import { ArrowUpRight, UserCircle, User, Users, UserPlus } from 'lucide-react';

const MATRIX = [
  {
    person: 3,
    title: '3-е лицо (Он/Она)',
    icon: ArrowUpRight,
    rows: [
      { gender: 'm', items: ['hum', 'huma_m', 'huwa'] },
      { gender: 'f', items: ['hunna', 'huma_f', 'hiya'] }
    ]
  },
  {
    person: 2,
    title: '2-е лицо (Ты/Вы)',
    icon: UserCircle,
    rows: [
      { gender: 'm', items: ['antum', 'antuma', 'anta'] },
      { gender: 'f', items: ['antunna', 'antuma', 'anti'] }
    ]
  },
  {
    person: 1,
    title: '1-е лицо (Я/Мы)',
    icon: User,
    rows: [
      { gender: 'n', items: ['nahnu', null, 'ana'] }
    ]
  }
];

function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function ConjugationContent() {
  const { updateProgress } = useProgress();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'table' | 'practice'>('table');

  // Read verb from query param: /conjugation?verb=5
  const verbIdFromUrl = searchParams.get('verb');
  const initialVerbId = verbIdFromUrl
    ? Number(verbIdFromUrl)
    : VERBS[0].id;

  const [selectedVerbId, setSelectedVerbId] = useState(initialVerbId);
  const [selectedTense, setSelectedTense] = useState<Tense>('past');

  function generatePractice() {
    const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
    const tense = ['past', 'present', 'passive_past', 'passive_present'][Math.floor(Math.random() * 4)] as Tense;
    const pronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
    const correct = conjugate(verb, tense, pronoun.id);

    const distractors = new Set<string>();
    let attempts = 0;
    while (distractors.size < 3 && attempts < 100) {
      const randomPronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)];
      const distractorText = conjugate(verb, tense, randomPronoun.id);
      if (distractorText !== correct) {
        distractors.add(distractorText);
      }
      attempts++;
    }

    const options = shuffle([correct, ...Array.from(distractors)]);
    return { verb, tense, pronoun, correct, options };
  }

  const [practiceQuestion, setPracticeQuestion] = useState<{
    verb: typeof VERBS[0];
    tense: Tense;
    pronoun: typeof PRONOUNS[0];
    correct: string;
    options: string[];
  } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydration mismatch fix
    setPracticeQuestion(generatePractice());
  }, []);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentVerb = VERBS.find(v => v.id === selectedVerbId) || VERBS[0];

  const handleAnswer = (option: string) => {
    if (selectedAnswer !== null || !practiceQuestion) return;
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
          <nav className="flex flex-wrap items-center gap-2 text-micro-label mb-4 text-[var(--mizan-slate)]">
            <Link href="/" className="hover:text-[var(--mizan-mauve)] transition-colors">ГЛАВНАЯ</Link>
            <span className="text-[var(--mizan-sand)]">/</span>
            <span className="text-[var(--mizan-deep)]">СПРЯЖЕНИЯ</span>
            <span className="text-[var(--mizan-sand)]">/</span>
            <span className="text-[var(--mizan-deep)] uppercase font-mono">{mode === 'table' ? currentVerb.root : practiceQuestion?.verb.root ?? '...'}</span>
          </nav>
          <h1 className="text-3xl mb-2 heading-display-black text-[var(--text-primary)]">
            Спряжения
          </h1>
          <p className="font-display text-[var(--mizan-mauve)]">Тренажёр глагольных форм</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-static p-4">
              <label
                htmlFor="verb-select"
                className="block text-micro-label mb-2"
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
                className="block text-micro-label mb-2"
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

          <div className="flex flex-col">
            <div className="w-full overflow-x-auto pb-8 sm:pb-0 hide-scrollbar" style={{ direction: 'rtl' }}>
              
              <div className="min-w-[800px] border-[3px] border-[var(--text-primary)] bg-[var(--bg-primary)] grid grid-cols-[80px_1fr] relative">
                
                {/* Y-Axis Labels */}
                <div className="border-l-[3px] border-[var(--text-primary)] flex flex-col">
                  <div className="h-10 border-b border-[var(--mizan-slate)] bg-[var(--bg-card)]"></div>
                  {MATRIX.map((block, idx) => (
                    <div key={idx} className="flex-1 min-h-[300px] border-b last:border-b-0 border-[var(--text-primary)] bg-[var(--bg-card)] flex justify-center items-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[var(--mizan-mauve)] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      
                      {/* Rotated Container for Text & Icon */}
                      <div className="flex items-center gap-4 -rotate-90 whitespace-nowrap pointer-events-none" style={{ direction: 'ltr' }}>
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[var(--text-primary)] uppercase">
                          {block.title}
                        </span>
                        <block.icon className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity rotate-90" style={{ color: 'var(--mizan-mauve)' }} />
                      </div>

                    </div>
                  ))}
                </div>

                {/* X-Axis Data */}
                <div className="flex flex-col w-full">
                  {/* Headers */}
                  <div className="h-10 border-b border-[var(--text-primary)] bg-[var(--mizan-deep)] grid text-center sticky top-0 z-10" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', direction: 'ltr' }}>
                    <div className="border-r border-[var(--text-primary)] flex justify-center items-center text-[var(--mizan-sand)] font-mono text-[10px] uppercase tracking-widest font-black">
                      <Users className="w-4 h-4 mr-2 hidden md:block" /> Мн. ч. (Plural)
                    </div>
                    <div className="border-r border-[var(--text-primary)] flex justify-center items-center text-[var(--mizan-sand)] font-mono text-[10px] uppercase tracking-widest font-black">
                      <UserPlus className="w-4 h-4 mr-2 hidden md:block" /> Дв. ч. (Dual)
                    </div>
                    <div className="flex justify-center items-center text-[var(--mizan-sand)] font-mono text-[10px] uppercase tracking-widest font-black">
                      <User className="w-4 h-4 mr-2 hidden md:block" /> Ед. ч. (Singular)
                    </div>
                  </div>

                  {/* Matrix Cells */}
                  <div className="flex flex-col">
                    {MATRIX.map((block, blockIdx) => (
                      <div key={blockIdx} className="min-h-[300px] border-b last:border-b-0 border-[var(--text-primary)] flex flex-col bg-[var(--bg-card)]">
                        {block.rows.map((row, rowIdx) => (
                          <div key={rowIdx} className="flex-1 grid border-b last:border-b-0 border-[var(--border-default)]" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', direction: 'ltr' }}>
                            {row.items.map((itemId, itemIdx) => {
                              if (!itemId) {
                                return <div key={itemIdx} className="border-r last:border-r-0 border-[var(--border-default)] flex items-center justify-center opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,var(--text-primary)_10px,var(--text-primary)_11px)]"></div>;
                              }
                              const pronoun = PRONOUNS.find(p => p.id === itemId);
                              if (!pronoun) return <div key={itemIdx} />;
                              const conjugated = conjugate(currentVerb, selectedTense, pronoun.id);
                              
                              let themeColor = 'var(--text-primary)';
                              let themeAccent = 'var(--mizan-slate)';

                              if (block.person === 1) {
                                themeColor = 'var(--text-primary)';
                                themeAccent = 'var(--mizan-sand)';
                              } else if (row.gender === 'm') {
                                themeColor = 'var(--color-info)'; // typically blueish
                                themeAccent = 'var(--color-info)';
                              } else if (row.gender === 'f') {
                                themeColor = 'var(--color-error)'; // pinkish/red 
                                themeAccent = 'var(--color-error)';
                              }

                              // Editorial Brutalism Mizan Matrix Cell
                              return (
                                <div key={itemIdx} className="border-r last:border-r-0 border-[var(--border-default)] p-6 flex flex-col justify-between items-center text-center relative group bg-[var(--bg-card)] hover:bg-[var(--mizan-sand)] hover:border-[var(--mizan-deep)] transition-all cursor-pointer snap-center">
                                  
                                  <div className="w-full flex justify-between items-center mb-4">
                                    <div className="text-[11px] font-mono tracking-widest text-[var(--mizan-slate)] uppercase opacity-0 group-hover:opacity-100 transition-opacity delay-75">
                                      {pronoun.id.replace(/_[mf]/, '')}
                                    </div>
                                    <div className="font-arabic text-xl opacity-70 group-hover:opacity-100 transition-all font-bold" style={{ color: themeAccent }}>
                                      {pronoun.arabic}
                                    </div>
                                  </div>

                                  <div className="flex-1 flex items-center justify-center py-6 relative z-10 w-full group-hover:scale-110 transition-transform duration-500 ease-out">
                                    <h3 
                                      className="font-arabic text-4xl sm:text-5xl md:text-6xl font-black leading-none drop-shadow-sm"
                                      style={{ color: themeColor }}
                                    >
                                      {conjugated}
                                    </h3>
                                  </div>

                                  <div className="w-full mt-auto pt-4 border-t border-transparent group-hover:border-[var(--mizan-deep)] transition-colors text-[11px] sm:text-xs font-serif italic text-[var(--mizan-slate)] group-hover:text-[var(--text-primary)]">
                                    {getRussianVerbTranslation(currentVerb.russian, selectedTense, pronoun.id)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      ) : practiceQuestion ? (
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
      ) : null}
    </div>
  );
}

export default function Conjugation() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center font-mono text-sm uppercase tracking-widest text-[var(--mizan-deep)]">
        [ LOADING... ]
      </div>
    }>
      <ConjugationContent />
    </Suspense>
  );
}
