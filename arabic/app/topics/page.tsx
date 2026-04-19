"use client";

import { useState } from 'react';
import { ArabicText } from '@/components/ArabicText';
import { TheoryConjugationTable } from '@/components/TheoryTable';
import { PatternTheoryTable } from '@/components/PatternTheoryTable';
import Link from 'next/link';
import { ChevronDown, BookOpen, Pen, Clock, Layers, Eye, UserCheck, UserX, MinusCircle, Ban, Command, ShieldOff, Zap, MapPin, Wrench, Trophy, ArrowRight } from 'lucide-react';

interface Topic {
  id: number;
  title: string;
  arabicTitle: string;
  icon: typeof BookOpen;
  description: string;
  formula?: string;
  examples: { arabic: string; russian: string }[];
  note?: string;
  practiceLink?: string;
  practiceLabel?: string;
  theoryTense?: 'past' | 'present' | 'passive_past' | 'passive_present';
  theoryPatternId?: number;
}

const TOPICS: Topic[] = [
  {
    id: 1,
    title: 'Введение в курс и обзор форм',
    arabicTitle: 'مقدمة الصرف',
    icon: BookOpen,
    description: 'Базовое знакомство с 11 формами, которые можно образовать от одного трёхбуквенного глагола. Все формы строятся по определённым шаблонам (أَوْزَان).',
    examples: [
      { arabic: 'فَعَلَ → 11 صيغة', russian: 'От одного глагола — 11 форм' },
    ],
    practiceLink: '/conjugation',
    practiceLabel: 'Открыть спряжения',
  },
  {
    id: 2,
    title: 'Прошедшее время глагола (الماضي)',
    arabicTitle: 'الفعل الماضي',
    icon: Clock,
    description: 'Основа арабского глагола. Строится по шаблону فَعَلَ. Спрягается по лицам, числам и родам путём добавления суффиксов.',
    formula: 'فَعَلَ + суффикс лица',
    examples: [
      { arabic: 'نَصَرَ — نَصَرَتْ — نَصَرُوا — نَصَرْتُ', russian: 'он помог — она помогла — они помогли — я помог' },
      { arabic: 'كَتَبَ — كَتَبْنَا', russian: 'он написал — мы написали' },
    ],
    theoryTense: 'past' as const,
    practiceLink: '/conjugation',
    practiceLabel: 'Практиковать прошедшее время',
  },
  {
    id: 3,
    title: 'Настоящее-будущее время (المضارع)',
    arabicTitle: 'الفعل المضارع',
    icon: Pen,
    description: 'Образуется добавлением одной из четырёх приставок (أ، ن، ي، ت) к корню. Огласовка средней буквы зависит от баба.',
    formula: 'Приставка (أنيت) + فْعَل + суффикс',
    examples: [
      { arabic: 'يَنْصُرُ — تَنْصُرُ — أَنْصُرُ — نَنْصُرُ', russian: 'он помогает — ты/она помогает — я помогаю — мы помогаем' },
    ],
    theoryTense: 'present' as const,
    practiceLink: '/conjugation',
    practiceLabel: 'Практиковать настоящее время',
  },
  {
    id: 4,
    title: 'Типы глаголов — 6 бабов',
    arabicTitle: 'الأبواب الستة',
    icon: Layers,
    description: 'Шесть моделей, отличающихся огласовками прошедшего и настоящего времени. Каждый баб определяет поведение глагола.',
    examples: [
      { arabic: 'نَصَرَ — يَنْصُرُ', russian: 'Баб 1: a-u — фатха—дамма' },
      { arabic: 'ضَرَبَ — يَضْرِبُ', russian: 'Баб 2: a-i — фатха—касра' },
      { arabic: 'فَتَحَ — يَفْتَحُ', russian: 'Баб 3: a-a — фатха—фатха' },
      { arabic: 'عَلِمَ — يَعْلَمُ', russian: 'Баб 4: i-a — касра—фатха' },
      { arabic: 'كَرُمَ — يَكْرُمُ', russian: 'Баб 5: u-u — дамма—дамма' },
      { arabic: 'حَسِبَ — يَحْسِبُ', russian: 'Баб 6: i-i — касра—касра' },
    ],
    practiceLink: '/verbs',
    practiceLabel: 'Смотреть все глаголы по бабам',
  },
  {
    id: 5,
    title: 'Страдательная форма (المجهول)',
    arabicTitle: 'الفعل المجهول',
    icon: Eye,
    description: 'Пассивная форма — когда действие направлено на объект, а исполнитель неизвестен. В прошедшем: ضمّة на первую + كسرة на вторую. В настоящем: ضمّة на приставку + فتحة перед последней.',
    formula: 'Прош: فُعِلَ | Наст: يُفْعَلُ',
    examples: [
      { arabic: 'نُصِرَ — يُنْصَرُ', russian: 'ему была оказана помощь — ему оказывается помощь' },
      { arabic: 'كُتِبَ — يُكْتَبُ', russian: 'было написано — пишется' },
    ],
    theoryTense: 'passive_past' as const,
    practiceLink: '/conjugation',
    practiceLabel: 'Практиковать страдательную форму',
  },
  {
    id: 6,
    title: 'Действующее лицо — Исм Фаиль (اسم الفاعل)',
    arabicTitle: 'اسم الفاعل',
    icon: UserCheck,
    description: 'Имя существительное, указывающее на того, кто совершает действие. Строится по шаблону فَاعِل.',
    formula: 'فَاعِلٌ / فَاعِلَةٌ / فَاعِلُونَ / فَاعِلَاتٌ',
    examples: [
      { arabic: 'نَاصِرٌ — نَاصِرَةٌ — نَاصِرُونَ', russian: 'помощник — помощница — помощники' },
      { arabic: 'كَاتِبٌ', russian: 'пишущий, писатель' },
    ],
    practiceLink: '/exam',
    practiceLabel: 'Практиковать в экзамене',
    theoryPatternId: 6,
  },
  {
    id: 7,
    title: 'Объект действия — Исм Мафъуль (اسم المفعول)',
    arabicTitle: 'اسم المفعول',
    icon: UserX,
    description: 'Имя существительное, указывающее на того, над кем совершено действие. Шаблон: مَفْعُول.',
    formula: 'مَفْعُولٌ / مَفْعُولَةٌ / مَفْعُولُونَ / مَفْعُولَاتٌ',
    examples: [
      { arabic: 'مَنْصُورٌ — مَنْصُورَةٌ', russian: 'тот, кому оказана помощь (м/ж)' },
      { arabic: 'مَكْتُوبٌ', russian: 'написанный' },
    ],
    practiceLink: '/quiz',
    practiceLabel: 'Практиковать в тесте',
    theoryPatternId: 7,
  },
  {
    id: 8,
    title: 'Отрицание прошедшего времени',
    arabicTitle: 'نفي الماضي',
    icon: MinusCircle,
    description: 'Два способа: (1) مَا + глагол в прошедшем времени. (2) لَمْ + глагол в настоящем времени с джазмом (усечённое окончание). Второй способ «забирает» окончание.',
    formula: 'مَا + فَعَلَ   |   لَمْ + يَفْعَلْ',
    examples: [
      { arabic: 'مَا نَصَرَ', russian: 'он не помог (с مَا)' },
      { arabic: 'لَمْ يَنْصُرْ', russian: 'он не помог (с لَمْ — джазм)' },
    ],
    note: 'Оба варианта переводятся одинаково, но لَمْ более лёгкая и частая форма.',
    practiceLink: '/exam',
    practiceLabel: 'Практиковать отрицание в экзамене',
    theoryPatternId: 8,
  },
  {
    id: 9,
    title: 'Отрицание настоящего-будущего',
    arabicTitle: 'نفي المضارع',
    icon: Ban,
    description: 'Добавляется частица لَا перед глаголом настоящего-будущего времени. Глагол остаётся в обычной форме (марфуъ).',
    formula: 'لَا + يَفْعُلُ',
    examples: [
      { arabic: 'لَا يَنْصُرُ', russian: 'он не помогает' },
      { arabic: 'لَا يَكْتُبُ', russian: 'он не пишет' },
    ],
    practiceLink: '/exam',
    practiceLabel: 'Практиковать в экзамене',
    theoryPatternId: 9,
  },
  {
    id: 10,
    title: 'Повелительное наклонение — Амр (الأمر)',
    arabicTitle: 'فعل الأمر',
    icon: Command,
    description: 'Приказ/просьба для 2-го лица. Образуется: убрать приставку настоящего времени + добавить хамзат аль-васл. Для 3-го и 1-го лица используется لِيَفْعَلْ.',
    formula: 'اُفْعُلْ / اِفْعَلْ (2-е лицо)',
    examples: [
      { arabic: 'اُنْصُرْ — اُنْصُرِي — اُنْصُرُوا', russian: 'помоги (м.) — помоги (ж.) — помогите' },
      { arabic: 'اِضْرِبْ', russian: 'ударь' },
    ],
    note: 'Огласовка хамзы зависит от баба: дамма для баба 1 и 5, касра для остальных.',
    practiceLink: '/exam',
    practiceLabel: 'Практиковать Амр в экзамене',
    theoryPatternId: 10,
  },
  {
    id: 11,
    title: 'Запрет — Нахий (النهي)',
    arabicTitle: 'النهي',
    icon: ShieldOff,
    description: 'Отрицательное повелительное наклонение. لَا + глагол настоящего времени в форме джазм. Работает для всех лиц.',
    formula: 'لَا + تَفْعَلْ (2-е лицо) / لَا يَفْعَلْ (3-е лицо)',
    examples: [
      { arabic: 'لَا تَنْصُرْ — لَا تَنْصُرُوا', russian: 'не помогай — не помогайте' },
      { arabic: 'لَا يَضْرِبْ', russian: 'пусть он не ударяет' },
    ],
    practiceLink: '/exam',
    practiceLabel: 'Практиковать Нахий в экзамене',
    theoryPatternId: 11,
  },
  {
    id: 12,
    title: 'Усиление — Та\'кид (التأكيد)',
    arabicTitle: 'التأكيد',
    icon: Zap,
    description: 'Для настоящего/будущего времени используется нун: одинарный (لَيَفْعَلَنْ) или двойной (لَيَفْعَلَنَّ). Для прошедшего времени используется قَدْ или لَقَدْ.',
    formula: 'لَـ + فعل + ـنَّ / ـنْ',
    examples: [
      { arabic: 'لَيَنْصُرَنَّ', russian: 'он непременно поможет (двойной нун)' },
      { arabic: 'لَيَنْصُرَنْ', russian: 'он непременно поможет (одинарный нун)' },
    ],
  },
  {
    id: 13,
    title: 'Исм заман/макан (اسم الزمان والمكان)',
    arabicTitle: 'اسم الزمان والمكان',
    icon: MapPin,
    description: 'Слова, обозначающие место или время совершения действия. Два шаблона: مَفْعَل (если настоящее с дамма/фатха) и مَفْعِل (если настоящее с касра).',
    formula: 'مَفْعَلٌ (للمفتوح والمضموم) | مَفْعِلٌ (للمكسور)',
    examples: [
      { arabic: 'مَكْتَبٌ', russian: 'место, где пишут (офис, письменный стол)' },
      { arabic: 'مَلْعَبٌ', russian: 'место, где играют (стадион)' },
      { arabic: 'مَجْلِسٌ', russian: 'место, где сидят (заседание)' },
    ],
    note: 'Если средняя огласовка настоящего времени — касра (يَفْعِلُ), то исм заман/макан будет مَفْعِل.',
    theoryPatternId: 13,
  },
  {
    id: 14,
    title: 'Исм аля — орудие (اسم الآلة)',
    arabicTitle: 'اسم الآلة',
    icon: Wrench,
    description: 'Имя орудия — слово, обозначающее инструмент, которым выполняется действие. Три шаблона: مِفْعَل، مِفْعَال، مِفْعَلَة.',
    formula: 'مِفْعَلٌ / مِفْعَالٌ / مِفْعَلَةٌ',
    examples: [
      { arabic: 'مِفْتَاحٌ', russian: 'ключ (от فَتَحَ — открыл)' },
      { arabic: 'مِسْطَرَةٌ', russian: 'линейка (от سَطَرَ — начертил линию)' },
      { arabic: 'مِكْنَسَةٌ', russian: 'веник (от كَنَسَ — подмёл)' },
      { arabic: 'مِضْرَابٌ', russian: 'ракетка, бита (от ضَرَبَ — ударил)' },
    ],
    theoryPatternId: 14,
  },
  {
    id: 15,
    title: 'Исм тафдыль — превосходная (اسم التفضيل)',
    arabicTitle: 'اسم التفضيل',
    icon: Trophy,
    description: 'Слова, выражающие высшую степень признака. Мужской род — по шаблону أَفْعَلُ, женский — по шаблону فُعْلَى.',
    formula: 'أَفْعَلُ (муж.) / فُعْلَى (жен.)',
    examples: [
      { arabic: 'أَكْبَرُ — كُبْرَى', russian: 'больший — бо́льшая' },
      { arabic: 'أَحْسَنُ — حُسْنَى', russian: 'лучший — лучшая' },
      { arabic: 'أَصْغَرُ — صُغْرَى', russian: 'меньший — меньшая' },
      { arabic: 'أَقْرَبُ', russian: 'ближайший (от قَرِيبٌ — близкий)' },
      { arabic: 'أَبْعَدُ', russian: 'дальнейший (от بَعِيدٌ — далёкий)' },
    ],
    theoryPatternId: 15,
  },
];

export default function TopicsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-slide-up">
      <header className="mb-8 border-b border-[var(--border-default)] pb-8">
        <nav className="flex flex-wrap items-center gap-2 text-micro-label mb-6 text-[var(--mizan-slate)]">
          <Link href="/" className="hover:text-[var(--mizan-deep)] transition-colors">ГЛАВНАЯ</Link>
          <span className="text-[var(--mizan-sand)]">/</span>
          <span className="text-[var(--mizan-deep)]">ТЕМЫ САРФА</span>
        </nav>
        <h1 className="text-4xl md:text-5xl heading-display-black text-[var(--mizan-deep)] uppercase tracking-tight">
          Справочник тем
        </h1>
        <p className="font-display italic text-xl text-[var(--mizan-slate)] mt-2">
          Все 15 тем первой части курса морфологии (сарфа)
        </p>
      </header>

      {/* Topic Grid */}
      <div className="space-y-3">
        {TOPICS.map((topic) => {
          const isExpanded = expandedId === topic.id;
          const Icon = topic.icon;

          return (
            <div
              key={topic.id}
              className="border border-[var(--border-default)] bg-[var(--bg-card)] transition-all rounded-[var(--radius-md)] overflow-hidden"
              style={{
                boxShadow: isExpanded ? 'var(--shadow-soft)' : 'none',
              }}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggle(topic.id)}
                className="w-full flex items-center gap-4 p-5 md:p-6 text-left hover:bg-[var(--mizan-sand)] transition-colors"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-[var(--border-default)] rounded-[var(--radius-sm)]"
                  style={{
                    background: isExpanded ? 'var(--mizan-deep)' : 'transparent',
                    color: isExpanded ? 'var(--mizan-cream)' : 'var(--mizan-slate)',
                  }}
                >
                  <span className="font-mono text-sm font-bold">{topic.id}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[var(--mizan-mauve)] flex-shrink-0" />
                    <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-[var(--mizan-deep)] truncate">
                      {topic.title}
                    </h2>
                  </div>
                  <div className="font-arabic text-sm text-[var(--mizan-mauve)] mt-1">
                    {topic.arabicTitle}
                  </div>
                </div>

                <ChevronDown
                  className="w-5 h-5 text-[var(--mizan-slate)] transition-transform flex-shrink-0"
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="border-t border-[var(--border-default)] p-5 md:p-8 space-y-6 animate-fade-slide-up">
                  {/* Description */}
                  <p className="font-display italic text-base leading-relaxed text-[var(--mizan-deep)]">
                    {topic.description}
                  </p>

                  {/* Formula */}
                  {topic.formula && (
                    <div className="bg-[var(--mizan-sand)] border border-[var(--border-default)] p-4">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)] mb-2">
                        Формула / Шаблон
                      </div>
                      <ArabicText className="text-xl text-[var(--mizan-deep)] font-bold">
                        {topic.formula}
                      </ArabicText>
                    </div>
                  )}

                  {/* Examples */}
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-slate)] mb-3">
                      Примеры
                    </div>
                    <div className="space-y-2">
                      {topic.examples.map((ex, i) => (
                        <div key={i} className="flex flex-col md:flex-row items-stretch border border-[var(--border-default)]">
                          <div className="flex-1 p-3 text-right bg-[var(--bg-card)] border-b md:border-b-0 md:border-r border-[var(--border-default)]">
                            <ArabicText className="text-lg text-[var(--mizan-deep)]">
                              {ex.arabic}
                            </ArabicText>
                          </div>
                          <div className="flex-1 p-3">
                            <span className="font-display italic text-sm text-[var(--mizan-slate)]">
                              {ex.russian}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Note */}
                  {topic.note && (
                    <div className="flex gap-3 p-4 bg-[rgba(176,148,136,0.06)] rounded-[var(--radius-sm)]" style={{ borderLeft: '3px solid var(--mizan-mauve)' }}>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--mizan-mauve)] font-bold flex-shrink-0 mt-0.5">
                        NB
                      </div>
                      <p className="text-sm text-[var(--mizan-deep)]">
                        {topic.note}
                      </p>
                    </div>
                  )}

                  {/* Color-coded conjugation table */}
                  {topic.theoryTense && (
                    <TheoryConjugationTable
                      tense={topic.theoryTense}
                      exampleVerbId={21}
                      showPractice={true}
                    />
                  )}

                  {/* Pattern theory table for non-conjugation topics */}
                  {topic.theoryPatternId && (
                    <PatternTheoryTable
                      topicId={topic.theoryPatternId}
                      exampleVerbId={21}
                      showPractice={true}
                    />
                  )}

                    {/* Practice action button */}
                    {topic.practiceLink && (
                      <Link
                        href={topic.practiceLink}
                        className="flex items-center justify-center gap-2 w-full py-4 border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--mizan-deep)] font-mono text-xs uppercase tracking-[0.15em] transition-all hover:bg-[var(--mizan-sand)] rounded-[var(--radius-md)] shadow-[var(--shadow-soft)] min-h-[50px]"
                      >
                        <ArrowRight className="w-4 h-4" />
                        {topic.practiceLabel}
                      </Link>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
