"use client";

import { useState, useCallback } from 'react';
import { VERBS, Verb } from '@/data/verbs';
import { getAmr, getNahy, getNegativePast, getParticiple, ParticipleForm, conjugate, getIsmZamanMakan, getIsmAla, getIsmTafdil } from '@/lib/conjugationEngine';
import { ArabicText } from '@/components/ArabicText';

/* ─── Types ─── */
interface PatternRow {
  label: string;
  arabicLabel?: string;
  form: string;
  highlight: 'suffix' | 'prefix' | 'vowel' | 'none';
  note?: string;
}

interface PatternTheoryTableProps {
  topicId: number;
  exampleVerbId?: number;
  showPractice?: boolean;
}

/* ─── Helpers ─── */
function getVowelNote(topicId: number): string | null {
  switch (topicId) {
    case 13: return '⚠ Только фатха (مَفْعَل) или касра (مَفْعِل) — даммы НЕ бывает!';
    case 14: return '⚠ Все три шаблона начинаются с касры (مِ). Это ключевой признак اسم الآلة.';
    case 15: return '⚠ Мужской — أَفْعَل, женский — فُعْلَى. Не путай с مَفْعَل!';
    default: return null;
  }
}

/* ─── Pattern generators ─── */
function getPatternRows(topicId: number, verb: Verb): PatternRow[] {
  switch (topicId) {
    case 6: // اسم الفاعل
      return [
        { label: 'Ед. ч. (м.)', arabicLabel: 'مفرد مذكر', form: getParticiple(verb, 'fail', 'm_s'), highlight: 'none' },
        { label: 'Ед. ч. (ж.)', arabicLabel: 'مفرد مؤنث', form: getParticiple(verb, 'fail', 'f_s'), highlight: 'suffix', note: 'ةٌ' },
        { label: 'Дв. ч. (м.)', arabicLabel: 'مثنى مذكر', form: getParticiple(verb, 'fail', 'm_d'), highlight: 'suffix', note: 'انِ' },
        { label: 'Дв. ч. (ж.)', arabicLabel: 'مثنى مؤنث', form: getParticiple(verb, 'fail', 'f_d'), highlight: 'suffix', note: 'تانِ' },
        { label: 'Мн. ч. (м.)', arabicLabel: 'جمع مذكر', form: getParticiple(verb, 'fail', 'm_p'), highlight: 'suffix', note: 'ونَ' },
        { label: 'Мн. ч. (ж.)', arabicLabel: 'جمع مؤنث', form: getParticiple(verb, 'fail', 'f_p'), highlight: 'suffix', note: 'اتٌ' },
      ];

    case 7: // اسم المفعول
      return [
        { label: 'Ед. ч. (м.)', arabicLabel: 'مفرد مذكر', form: getParticiple(verb, 'maful', 'm_s'), highlight: 'vowel', note: 'مَـ+ـُو (дамма+вав)' },
        { label: 'Ед. ч. (ж.)', arabicLabel: 'مفرد مؤنث', form: getParticiple(verb, 'maful', 'f_s'), highlight: 'suffix' },
        { label: 'Дв. ч. (м.)', arabicLabel: 'مثنى مذكر', form: getParticiple(verb, 'maful', 'm_d'), highlight: 'suffix' },
        { label: 'Дв. ч. (ж.)', arabicLabel: 'مثنى مؤنث', form: getParticiple(verb, 'maful', 'f_d'), highlight: 'suffix' },
        { label: 'Мн. ч. (м.)', arabicLabel: 'جمع مذكر', form: getParticiple(verb, 'maful', 'm_p'), highlight: 'suffix' },
        { label: 'Мн. ч. (ж.)', arabicLabel: 'جمع مؤنث', form: getParticiple(verb, 'maful', 'f_p'), highlight: 'suffix' },
      ];

    case 8: // Отрицание прошедшего
      return [
        { label: 'هُوَ (он)', form: getNegativePast(verb, 'huwa'), highlight: 'prefix', note: 'مَا' },
        { label: 'هِيَ (она)', form: getNegativePast(verb, 'hiya'), highlight: 'prefix' },
        { label: 'هُمْ (они)', form: getNegativePast(verb, 'hum'), highlight: 'prefix' },
        { label: 'أَنْتَ (ты м.)', form: getNegativePast(verb, 'anta'), highlight: 'prefix' },
        { label: 'أَنَا (я)', form: getNegativePast(verb, 'ana'), highlight: 'prefix' },
        { label: 'نَحْنُ (мы)', form: getNegativePast(verb, 'nahnu'), highlight: 'prefix' },
      ];

    case 9: // Отрицание настоящего
      return [
        { label: 'هُوَ (он)', form: 'لَا ' + conjugate(verb, 'present', 'huwa'), highlight: 'prefix', note: 'لَا' },
        { label: 'هِيَ (она)', form: 'لَا ' + conjugate(verb, 'present', 'hiya'), highlight: 'prefix' },
        { label: 'هُمْ (они)', form: 'لَا ' + conjugate(verb, 'present', 'hum'), highlight: 'prefix' },
        { label: 'أَنْتَ (ты м.)', form: 'لَا ' + conjugate(verb, 'present', 'anta'), highlight: 'prefix' },
        { label: 'أَنَا (я)', form: 'لَا ' + conjugate(verb, 'present', 'ana'), highlight: 'prefix' },
        { label: 'نَحْنُ (мы)', form: 'لَا ' + conjugate(verb, 'present', 'nahnu'), highlight: 'prefix' },
      ];

    case 10: // الأمر (imperative)
      return [
        { label: 'أَنْتَ (ты м.)', form: getAmr(verb, 'anta'), highlight: 'prefix', note: 'هَمْزة الوصل' },
        { label: 'أَنْتِ (ты ж.)', form: getAmr(verb, 'anti'), highlight: 'suffix', note: 'ي' },
        { label: 'أَنْتُمَا (вы дв.)', form: getAmr(verb, 'antuma'), highlight: 'suffix', note: 'ا' },
        { label: 'أَنْتُمْ (вы м.)', form: getAmr(verb, 'antum'), highlight: 'suffix', note: 'وا' },
        { label: 'أَنْتُنَّ (вы ж.)', form: getAmr(verb, 'antunna'), highlight: 'suffix', note: 'نَ' },
      ];

    case 11: // النهي (prohibition)
      return [
        { label: 'أَنْتَ (ты м.)', form: getNahy(verb, 'anta'), highlight: 'prefix', note: 'لَا' },
        { label: 'أَنْتِ (ты ж.)', form: getNahy(verb, 'anti'), highlight: 'prefix' },
        { label: 'هُوَ (он)', form: getNahy(verb, 'huwa'), highlight: 'prefix' },
        { label: 'هِيَ (она)', form: getNahy(verb, 'hiya'), highlight: 'prefix' },
        { label: 'أَنْتُمْ (вы м.)', form: getNahy(verb, 'antum'), highlight: 'prefix' },
        { label: 'نَحْنُ (мы)', form: getNahy(verb, 'nahnu'), highlight: 'prefix' },
      ];

    case 13: // اسم المكان/الزمان
      {
        const ism = getIsmZamanMakan(verb);
        return [
          { label: 'Шаблон 1 (فتحة)', arabicLabel: 'مَفْعَل', form: ism.mafal, highlight: 'vowel' as const, note: 'Когда наст. с фатхой/даммой' },
          { label: 'Шаблон 2 (كسرة)', arabicLabel: 'مَفْعِل', form: ism.mafil, highlight: 'vowel' as const, note: 'Когда наст. с касрой' },
        ];
      }

    case 14: // اسم الآلة
      {
        const ala = getIsmAla(verb);
        return [
          { label: 'Шаблон 1', arabicLabel: 'مِفْعَل', form: ala.mifal, highlight: 'prefix' as const, note: 'مِ — касра' },
          { label: 'Шаблон 2', arabicLabel: 'مِفْعَال', form: ala.mifaal, highlight: 'prefix' as const, note: 'مِ — касра + алиф' },
          { label: 'Шаблон 3', arabicLabel: 'مِفْعَلَة', form: ala.mifalah, highlight: 'prefix' as const, note: 'مِ — касра + та марбута' },
        ];
      }

    case 15: // اسم التفضيل
      {
        const tafdil = getIsmTafdil(verb);
        return [
          { label: 'Муж. род', arabicLabel: 'مذكر', form: tafdil.male, highlight: 'prefix' as const, note: 'أ — хамза с фатхой' },
          { label: 'Жен. род', arabicLabel: 'مؤنث', form: tafdil.female, highlight: 'vowel' as const, note: 'дамма-сукун-фатха-алиф макс.' },
        ];
      }

    default:
      return [];
  }
}

/* ─── Topic titles ─── */
const TOPIC_TITLES: Record<number, { arabic: string; russian: string }> = {
  6: { arabic: 'اسم الفاعل', russian: 'Действующее лицо' },
  7: { arabic: 'اسم المفعول', russian: 'Объект действия' },
  8: { arabic: 'نفي الماضي', russian: 'Отрицание прош.' },
  9: { arabic: 'نفي المضارع', russian: 'Отрицание наст.' },
  10: { arabic: 'الأمر', russian: 'Повеление' },
  11: { arabic: 'النهي', russian: 'Запрет' },
  13: { arabic: 'اسم الزمان والمكان', russian: 'Место/время' },
  14: { arabic: 'اسم الآلة', russian: 'Орудие' },
  15: { arabic: 'اسم التفضيل', russian: 'Превосходная' },
};

/* ─── Highlight wrapper — formula-style contrast ─── */
function HighlightedPatternForm({ form, highlight, note }: { form: string; highlight: PatternRow['highlight']; note?: string }) {
  if (highlight === 'none' || form.length < 3) return <span>{form}</span>;

  // For prefix: detect known particles and highlight them
  if (highlight === 'prefix') {
    // Check for known prefixes: مَا, لَا, or single-char prefix like مِ/أ
    const prefixes = ['مَا ', 'لَا '];
    for (const p of prefixes) {
      if (form.startsWith(p)) {
        return (
          <span>
            <span className="highlight-prefix">{p.trim()}</span>
            <span>{' '}</span>
            <span>{form.slice(p.length)}</span>
          </span>
        );
      }
    }
    // Single-char prefix with diacritics (e.g., مِ in مِفْعَل, أ in أَفْعَل)
    // Highlight first 2 characters (letter + diacritic)
    const chars = [...form];
    const prefixEnd = chars.length >= 2 ? 2 : 1;
    return (
      <span>
        <span className="highlight-prefix">{chars.slice(0, prefixEnd).join('')}</span>
        <span>{chars.slice(prefixEnd).join('')}</span>
      </span>
    );
  }

  // For suffix: use `note` field as the morpheme guide if available
  if (highlight === 'suffix') {
    if (note && form.endsWith(note)) {
      const base = form.slice(0, form.length - note.length);
      return (
        <span>
          <span>{base}</span>
          <span className="highlight-suffix">{note}</span>
        </span>
      );
    }
    // Fallback: highlight last 3 visible chars
    const chars = [...form];
    const suffixLen = Math.min(3, Math.max(1, chars.length - 2));
    return (
      <span>
        <span>{chars.slice(0, -suffixLen).join('')}</span>
        <span className="highlight-suffix">{chars.slice(-suffixLen).join('')}</span>
      </span>
    );
  }

  // For vowel: entire form is the highlighted vowel pattern
  if (highlight === 'vowel') {
    return <span className="highlight-vowel">{form}</span>;
  }

  return <span>{form}</span>;
}

/* ─── Component ─── */
export function PatternTheoryTable({ topicId, exampleVerbId = 21, showPractice = false }: PatternTheoryTableProps) {
  const [practiceMode, setPracticeMode] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const verb = VERBS.find(v => v.id === exampleVerbId) || VERBS[0];
  const title = TOPIC_TITLES[topicId];
  const rows = getPatternRows(topicId, verb);
  const vowelNote = getVowelNote(topicId);

  if (!title || rows.length === 0) return null;

  const handleChange = useCallback((idx: number, value: string) => {
    setAnswers(prev => ({ ...prev, [idx]: value }));
    setChecked(false);
  }, []);

  const checkAnswers = useCallback(() => setChecked(true), []);
  const resetPractice = useCallback(() => { setAnswers({}); setChecked(false); }, []);

  const correctCount = checked
    ? rows.filter((r, i) => (answers[i] || '').trim() === r.form).length
    : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-arabic text-base text-[var(--mizan-deep)]">{title.arabic}</span>
          <span className="font-mono text-xs text-[var(--mizan-slate)] uppercase tracking-wider">— {title.russian}</span>
        </div>
        {showPractice && (
          <button
            onClick={() => { setPracticeMode(!practiceMode); resetPractice(); }}
            className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-[var(--border-default)] rounded-[var(--radius-sm)] transition-all hover:bg-[var(--mizan-sand)] min-h-[36px]"
            style={{
              background: practiceMode ? 'var(--mizan-mauve)' : 'var(--bg-card)',
              color: practiceMode ? 'white' : 'var(--text-secondary)',
              borderColor: practiceMode ? 'var(--mizan-mauve)' : 'var(--border-default)',
            }}
          >
            {practiceMode ? '✎ Практика' : '→ Заполнить'}
          </button>
        )}
      </div>

      {/* Verb context */}
      <div className="flex items-center gap-3 px-3 py-2 bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] border border-[var(--border-default)]">
        <ArabicText className="text-xl text-[var(--mizan-deep)] font-bold">{verb.arabic}</ArabicText>
        <span className="text-sm text-[var(--mizan-slate)]">—</span>
        <span className="font-display italic text-sm text-[var(--mizan-slate)]">{verb.russian}</span>
      </div>

      {/* Vowel warning */}
      {vowelNote && (
        <div className="flex gap-3 p-3 rounded-[var(--radius-sm)] border border-[var(--color-warning)]" 
             style={{ background: 'color-mix(in srgb, var(--color-warning) 8%, transparent)' }}>
          <span className="font-mono text-sm font-bold text-[var(--color-warning)]">{vowelNote}</span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--border-default)]">
        <table className="w-full min-w-[320px]">
          <thead>
            <tr>
              <th className="theory-cell-header w-[140px]">Форма</th>
              <th className="theory-cell-header">Арабский</th>
              <th className="theory-cell-header hidden sm:table-cell">Примечание</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const userAnswer = answers[idx] || '';
              const isCorrect = checked && userAnswer.trim() === row.form;
              const isIncorrect = checked && userAnswer.trim() !== row.form && userAnswer.trim() !== '';

              return (
                <tr key={idx} className="border-t border-[var(--border-default)] hover:bg-[var(--mauve-5)] transition-colors">
                  <td className="theory-cell !text-left">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-xs text-[var(--text-primary)] font-bold">{row.label}</span>
                      {row.arabicLabel && (
                        <ArabicText className="text-sm text-[var(--mizan-slate)]">{row.arabicLabel}</ArabicText>
                      )}
                    </div>
                  </td>
                  <td className="theory-cell">
                    {practiceMode ? (
                      <input
                        type="text"
                        dir="rtl"
                        value={userAnswer}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        placeholder="..."
                        className={`theory-cell-input w-full min-h-[44px] ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                      />
                    ) : (
                      <ArabicText className="text-xl font-bold">
                        <HighlightedPatternForm form={row.form} highlight={row.highlight} note={row.note} />
                      </ArabicText>
                    )}
                    {checked && isIncorrect && (
                      <div className="mt-1">
                        <ArabicText className="text-sm text-[var(--color-success)]">{row.form}</ArabicText>
                      </div>
                    )}
                  </td>
                  <td className="theory-cell hidden sm:table-cell">
                    {row.note && (
                      <span className="font-mono text-[11px] text-[var(--mizan-slate)]">{row.note}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Practice controls */}
      {practiceMode && (
        <div className="flex items-center gap-4">
          <button onClick={checkAnswers} className="btn-primary min-h-[44px]">Проверить</button>
          <button onClick={resetPractice} className="btn-ghost min-h-[44px]">Сбросить</button>
          {checked && (
            <span className="font-mono text-sm" style={{ color: correctCount === rows.length ? 'var(--color-success)' : 'var(--mizan-mauve)' }}>
              {correctCount} / {rows.length} верно
            </span>
          )}
        </div>
      )}

      {/* Legend */}
      {!practiceMode && (
        <div className="flex flex-wrap gap-4 px-3 py-2 bg-[var(--bg-secondary)] rounded-[var(--radius-sm)] border border-[var(--border-default)]">
          <span className="flex items-center gap-1.5 text-xs text-[var(--mizan-slate)]">
            <span className="highlight-suffix text-xs">текст</span> Окончание
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--mizan-slate)]">
            <span className="highlight-prefix text-xs">текст</span> Приставка/частица
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[var(--mizan-slate)]">
            <span className="highlight-vowel text-xs">текст</span> Огласовка
          </span>
        </div>
      )}
    </div>
  );
}
