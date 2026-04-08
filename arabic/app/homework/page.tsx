"use client";

import { useState } from 'react';
import { HOMEWORK } from '@/data/homework';
import { useProgress } from '@/hooks/useProgress';
import { ArabicText } from '@/components/ArabicText';

export default function Homework() {
  const { progress, updateProgress } = useProgress();
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});

  if (!progress) return null;

  const completedSet = new Set(progress.homework.completed);

  const normalizeArabic = (text: string) => {
    return text
      .replace(/[\u064B-\u065F]/g, '')
      .replace(/أ|إ|آ/g, 'ا')
      .replace(/ة/g, 'ه')
      .trim();
  };

  const handleCheck = (id: number, answer: string) => {
    const input = inputs[id] || '';
    const isCorrect = normalizeArabic(input) === normalizeArabic(answer);
    setResults(prev => ({ ...prev, [id]: isCorrect }));
    if (isCorrect && !completedSet.has(id)) {
      updateProgress(prev => ({
        ...prev,
        homework: { completed: [...prev.homework.completed, id] }
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-slide-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="section-label mb-3">Практика</p>
          <h1 className="text-3xl mb-2" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
            Домашнее задание
          </h1>
          <p className="font-display" style={{ color: 'var(--mizan-mauve)' }}>Перевод предложений</p>
        </div>
        <div
          className="px-4 py-2 text-sm"
          style={{
            background: 'var(--mizan-sand)',
            border: '1px solid var(--border-default)',
            fontWeight: 400,
          }}
        >
          Выполнено: <span style={{ color: 'var(--mizan-mauve)', fontWeight: 700 }}>{completedSet.size}</span> / {HOMEWORK.length}
        </div>
      </header>

      <div className="space-y-4">
        {HOMEWORK.map((item, index) => {
          const isCompleted = completedSet.has(item.id);
          const result = results[item.id];

          let borderLeft = '3px solid transparent';
          let bg = 'var(--bg-card)';
          if (result === true || isCompleted) {
            borderLeft = '3px solid var(--color-success)';
            bg = 'var(--color-success-bg)';
          } else if (result === false) {
            borderLeft = '3px solid var(--color-error)';
            bg = 'var(--color-error-bg)';
          }

          return (
            <div
              key={item.id}
              className="p-6 transition-all"
              style={{ background: bg, borderLeft, border: `1px solid var(--border-default)`, borderLeftWidth: '3px', borderLeftColor: result === true || isCompleted ? 'var(--color-success)' : result === false ? 'var(--color-error)' : 'var(--border-default)' }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-6 h-6 flex items-center justify-center text-xs"
                      style={{ background: 'var(--mizan-sand)', color: 'var(--text-secondary)', fontWeight: 700 }}
                    >
                      {index + 1}
                    </span>
                    <h3 className="text-xl" style={{ fontWeight: 700 }}>{item.russian}</h3>
                  </div>
                  <p className="text-sm ml-8" style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>
                    Глагол: <ArabicText style={{ color: 'var(--mizan-deep)' }}>{item.verb}</ArabicText> |{' '}
                    Лицо: <span style={{ fontFamily: 'var(--font-mono)' }}>{item.pronoun}</span> |{' '}
                    Тема: {
                      item.type === 'passive' ? 'الماضي المجهول (Пассив)' :
                      item.type === 'passive_present' ? 'المضارع المجهول (Пассив наст.)' :
                      item.type === 'past' ? 'الماضي المعلوم (Прошедшее)' :
                      item.type === 'present' ? 'المضارع المعلوم (Настоящее)' :
                      item.type === 'root_extraction' ? 'Извлечение корня' :
                      item.type === 'fail' ? 'اسم الفاعل (Причастие действительное)' :
                      item.type === 'maful' ? 'اسم المفعول (Причастие страдательное)' :
                      'Глагол + Слитное местоимение'
                    }
                  </p>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      dir="rtl"
                      placeholder="اكتب هنا..."
                      value={inputs[item.id] || ''}
                      onChange={(e) => {
                        setInputs(prev => ({ ...prev, [item.id]: e.target.value }));
                        if (results[item.id] !== undefined) {
                          const newResults = { ...results };
                          delete newResults[item.id];
                          setResults(newResults);
                        }
                      }}
                      className="input-field flex-1 font-arabic text-2xl"
                      style={{ height: 'auto', padding: '8px 16px' }}
                    />
                    <button
                      onClick={() => handleCheck(item.id, item.answer)}
                      className="btn-ghost"
                      style={{ padding: '8px 24px', fontSize: '11px' }}
                    >
                      Проверить
                    </button>
                  </div>

                  {result === true || isCompleted ? (
                    <p className="text-sm flex items-center gap-2" style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                      <span>✓ صحيح!</span>
                      <ArabicText className="text-xl">{item.answer}</ArabicText>
                    </p>
                  ) : result === false ? (
                    <p className="text-sm flex items-center gap-2" style={{ color: 'var(--color-error)', fontWeight: 700 }}>
                      <span>✗ Неверно. Правильный ответ:</span>
                      <ArabicText className="text-xl">{item.answer}</ArabicText>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
