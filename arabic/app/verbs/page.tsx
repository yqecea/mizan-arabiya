"use client";

import { useState, useMemo } from 'react';
import { VERBS } from '@/data/verbs';
import { getBab } from '@/lib/conjugationEngine';
import { useProgress } from '@/hooks/useProgress';
import { ArabicText } from '@/components/ArabicText';
import Link from 'next/link';
import { Search, Filter, CheckCircle, Circle, Minus } from 'lucide-react';

const ALL_BABS = [
  { key: 'all', label: 'Все бабы' },
  { key: '1', label: '1 — نَصَرَ' },
  { key: '2', label: '2 — ضَرَبَ' },
  { key: '3', label: '3 — فَتَحَ' },
  { key: '4', label: '4 — عَلِمَ' },
  { key: '5', label: '5 — حَسُنَ' },
  { key: '6', label: '6 — حَسِبَ' },
];

type StatusFilter = 'all' | 'mastered' | 'attempted' | 'new';

export default function VerbsTable() {
  const { progress } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBab, setSelectedBab] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const masteredSet = useMemo(() => new Set(progress.exam.verbsMastered), [progress.exam.verbsMastered]);
  const attemptedSet = useMemo(() => new Set(progress.exam.verbsAttempted), [progress.exam.verbsAttempted]);

  const verbsWithBab = useMemo(() =>
    VERBS.map(v => ({ ...v, bab: getBab(v) })),
    []
  );

  const filteredVerbs = useMemo(() => {
    let result = verbsWithBab;
    if (selectedBab !== 'all') {
      result = result.filter(v => v.bab.startsWith(selectedBab));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.arabic.includes(q) ||
        v.russian.toLowerCase().includes(q) ||
        v.transliteration.toLowerCase().includes(q) ||
        v.root.includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(v => {
        if (statusFilter === 'mastered') return masteredSet.has(v.id);
        if (statusFilter === 'attempted') return attemptedSet.has(v.id) && !masteredSet.has(v.id);
        if (statusFilter === 'new') return !attemptedSet.has(v.id);
        return true;
      });
    }
    return result;
  }, [verbsWithBab, selectedBab, searchQuery, statusFilter, masteredSet, attemptedSet]);

  const babCounts = useMemo(() => {
    const counts: Record<string, number> = { all: verbsWithBab.length };
    verbsWithBab.forEach(v => {
      const babNum = v.bab.charAt(0);
      counts[babNum] = (counts[babNum] || 0) + 1;
    });
    return counts;
  }, [verbsWithBab]);

  const statusFilters: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'Все', count: VERBS.length },
    { key: 'mastered', label: '✓ Освоено', count: masteredSet.size },
    { key: 'attempted', label: '◎ В процессе', count: attemptedSet.size - masteredSet.size },
    { key: 'new', label: '— Новые', count: VERBS.length - attemptedSet.size },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-slide-up">
      <header className="mb-8 border-b border-[var(--mizan-deep)] pb-8">
        <nav className="flex flex-wrap items-center gap-2 text-micro-label mb-6 text-[var(--mizan-slate)]">
          <Link href="/" className="hover:text-[var(--mizan-deep)] transition-colors">ГЛАВНАЯ</Link>
          <span className="text-[var(--mizan-sand)]">/</span>
          <span className="text-[var(--mizan-deep)]">ВСЕ ГЛАГОЛЫ</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl heading-display-black text-[var(--mizan-deep)] uppercase tracking-tight">
              Все глаголы
            </h1>
            <p className="font-display italic text-xl text-[var(--mizan-slate)] mt-2">
              Полный справочник — {VERBS.length} глаголов для экзамена
            </p>
          </div>
          {/* Mastery summary */}
          <div className="flex gap-4 font-mono text-xs uppercase tracking-widest text-[var(--mizan-slate)]">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
              {masteredSet.size}
            </span>
            <span className="flex items-center gap-1">
              <Circle className="w-3 h-3 text-[var(--mizan-mauve)]" />
              {attemptedSet.size - masteredSet.size}
            </span>
            <span className="flex items-center gap-1">
              <Minus className="w-3 h-3 text-[var(--mizan-slate)]" />
              {VERBS.length - attemptedSet.size}
            </span>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--mizan-slate)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск по глаголу, переводу, корню..."
              className="input-field w-full pl-12"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-[var(--mizan-slate)] flex-shrink-0" />
            {ALL_BABS.map(bab => (
              <button
                key={bab.key}
                onClick={() => setSelectedBab(bab.key)}
                className="flex-shrink-0 font-mono text-[10px] uppercase tracking-widest px-3 py-2 border transition-all whitespace-nowrap"
                style={{
                  background: selectedBab === bab.key ? 'var(--mizan-deep)' : 'var(--bg-card)',
                  color: selectedBab === bab.key ? 'var(--mizan-cream)' : 'var(--text-secondary)',
                  borderColor: selectedBab === bab.key ? 'var(--mizan-deep)' : 'var(--border-default)',
                }}
              >
                {bab.label}
                <span className="ml-1 opacity-60">({babCounts[bab.key] || 0})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className="flex-shrink-0 font-mono text-[10px] uppercase tracking-widest px-3 py-2 border transition-all whitespace-nowrap"
              style={{
                background: statusFilter === f.key ? 'var(--mizan-mauve)' : 'var(--bg-card)',
                color: statusFilter === f.key ? 'white' : 'var(--text-secondary)',
                borderColor: statusFilter === f.key ? 'var(--mizan-mauve)' : 'var(--border-default)',
              }}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto border border-[var(--mizan-deep)] bg-[var(--bg-card)]">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-[var(--mizan-deep)] text-[var(--mizan-sand)]">
              <th className="px-2 py-3 text-center font-mono text-[10px] uppercase tracking-widest border-r border-[rgba(255,255,255,0.1)] w-8"></th>
              <th className="px-3 py-3 text-left font-mono text-[10px] uppercase tracking-widest border-r border-[rgba(255,255,255,0.1)] w-10">№</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest border-r border-[rgba(255,255,255,0.1)]">Глагол</th>
              <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest border-r border-[rgba(255,255,255,0.1)]">Корень</th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest border-r border-[rgba(255,255,255,0.1)]">Транскрипция</th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest border-r border-[rgba(255,255,255,0.1)]">Перевод</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest border-r border-[rgba(255,255,255,0.1)]">Настоящее</th>
              <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest">Баб</th>
            </tr>
          </thead>
          <tbody>
            {filteredVerbs.map((verb) => {
              const babNum = verb.bab.charAt(0);
              const babColors: Record<string, string> = {
                '1': 'var(--mizan-mauve)',
                '2': '#6B8F71',
                '3': '#B8860B',
                '4': '#5F7ADB',
                '5': '#C0392B',
                '6': '#8E44AD',
              };
              const accentColor = babColors[babNum] || 'var(--mizan-slate)';

              const isMastered = masteredSet.has(verb.id);
              const isAttempted = attemptedSet.has(verb.id);

              return (
                <tr
                  key={verb.id}
                  className="border-t border-[var(--border-default)] hover:bg-[var(--mizan-sand)] transition-colors group cursor-pointer"
                >
                  {/* Status indicator */}
                  <td className="px-2 py-4 text-center border-r border-[var(--border-default)]">
                    {isMastered ? (
                      <CheckCircle className="w-4 h-4 text-[var(--color-success)] mx-auto" />
                    ) : isAttempted ? (
                      <Circle className="w-4 h-4 text-[var(--mizan-mauve)] mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-[var(--mizan-slate)] opacity-30 mx-auto" />
                    )}
                  </td>
                  <td className="px-3 py-4 font-mono text-xs text-[var(--mizan-slate)] border-r border-[var(--border-default)]">
                    {verb.id}
                  </td>
                  <td className="px-4 py-4 text-right border-r border-[var(--border-default)]">
                    <Link href={`/conjugation?verb=${verb.id}`} className="hover:underline">
                      <ArabicText className="text-2xl text-[var(--mizan-deep)] group-hover:text-[var(--mizan-mauve)] transition-colors">
                        {verb.arabic}
                      </ArabicText>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center border-r border-[var(--border-default)]">
                    <ArabicText className="text-lg text-[var(--mizan-slate)]">
                      {verb.root}
                    </ArabicText>
                  </td>
                  <td className="px-4 py-4 border-r border-[var(--border-default)]">
                    <span className="font-mono text-sm text-[var(--mizan-slate)]">
                      {verb.transliteration}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-[var(--border-default)]">
                    <span className="font-display italic text-[var(--mizan-deep)]">
                      {verb.russian}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right border-r border-[var(--border-default)]">
                    <ArabicText className="text-lg text-[var(--mizan-slate)]">
                      {verb.mudari}
                    </ArabicText>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className="inline-block px-3 py-1 font-mono text-[10px] uppercase tracking-widest font-bold border"
                      style={{
                        color: accentColor,
                        borderColor: accentColor,
                        background: `${accentColor}10`,
                      }}
                    >
                      {verb.bab}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredVerbs.length === 0 && (
        <div className="text-center py-16 border border-[var(--border-default)] bg-[var(--bg-card)]">
          <p className="font-mono text-sm uppercase tracking-widest text-[var(--mizan-slate)]">
            Глаголы не найдены
          </p>
        </div>
      )}
    </div>
  );
}
