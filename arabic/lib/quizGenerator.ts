import { VERBS } from '@/data/verbs';
import { PRONOUNS } from '@/data/conjugations';
import { POSSESSIVE_PRONOUNS } from '@/data/pronouns';
import { conjugate, getRussianVerbTranslation, getBab, getParticiple, getParticipleTranslation } from './conjugationEngine';

function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function pickRandom<T>(array: T[], count: number): T[] {
  return shuffle(array).slice(0, count);
}

export type QuestionType = 'vocab_ar_ru' | 'vocab_ru_ar' | 'vocab_past_present' | 'conj_choose' | 'conj_identify' | 'conj_pronoun' | 'pronoun_choose' | 'pronoun_suffix' | 'ru_sentence_to_ar' | 'bab_identify' | 'participle_ar_ru' | 'participle_ru_ar' | 'voice_identify';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
}

export function generateQuiz(count: number, topics: { vocab: boolean, conj: boolean, pronouns: boolean, babs: boolean, participles: boolean }): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const availableTypes: QuestionType[] = [];
  
  if (topics.vocab) availableTypes.push('vocab_ar_ru', 'vocab_ru_ar', 'vocab_past_present');
  if (topics.conj) availableTypes.push('conj_choose', 'conj_identify', 'conj_pronoun', 'ru_sentence_to_ar', 'voice_identify');
  if (topics.pronouns) availableTypes.push('pronoun_choose', 'pronoun_suffix');
  if (topics.babs) availableTypes.push('bab_identify');
  if (topics.participles) availableTypes.push('participle_ar_ru', 'participle_ru_ar');

  if (availableTypes.length === 0) return [];

  for (let i = 0; i < count; i++) {
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    let q: QuizQuestion | null = null;

    if (type === 'vocab_ar_ru') {
      const verb = pickRandom(VERBS, 1)[0];
      const distractors = pickRandom(VERBS.filter(v => v.id !== verb.id), 3).map(v => v.russian);
      q = {
        id: `q_${i}`, type,
        question: `Переведите: ${verb.arabic}`,
        correctAnswer: verb.russian,
        options: shuffle([verb.russian, ...distractors])
      };
    } else if (type === 'vocab_ru_ar') {
      const verb = pickRandom(VERBS, 1)[0];
      const distractors = pickRandom(VERBS.filter(v => v.id !== verb.id), 3).map(v => v.arabic);
      q = {
        id: `q_${i}`, type,
        question: `Как по-арабски: ${verb.russian}`,
        correctAnswer: verb.arabic,
        options: shuffle([verb.arabic, ...distractors])
      };
    } else if (type === 'vocab_past_present') {
      const verb = pickRandom(VERBS, 1)[0];
      const correct = `${verb.arabic} - ${verb.mudari}`;
      const distractors = pickRandom(VERBS.filter(v => v.id !== verb.id), 3).map(v => `${v.arabic} - ${v.mudari}`);
      q = {
        id: `q_${i}`, type,
        question: `Прошедшее и настоящее время: ${verb.russian}?`,
        correctAnswer: correct,
        options: shuffle([correct, ...distractors])
      };
    } else if (type === 'conj_choose') {
      const verb = pickRandom(VERBS, 1)[0];
      const tense = pickRandom(['past', 'present', 'passive_past', 'passive_present'] as const, 1)[0];
      const pronoun = pickRandom(PRONOUNS, 1)[0];
      const correct = conjugate(verb, tense, pronoun.id);
      const distractors = pickRandom(PRONOUNS.filter(p => p.id !== pronoun.id), 3).map(p => conjugate(verb, tense, p.id));
      const translated = getRussianVerbTranslation(verb.russian, tense, pronoun.id);
      q = {
        id: `q_${i}`, type,
        question: `Как перевести: "${translated}"?`,
        correctAnswer: correct,
        options: shuffle([correct, ...distractors])
      };
    } else if (type === 'ru_sentence_to_ar') {
      const verb = pickRandom(VERBS, 1)[0];
      const tense = pickRandom(['past', 'present', 'passive_past', 'passive_present'] as const, 1)[0];
      const pronoun = pickRandom(PRONOUNS, 1)[0];
      const withPronoun = Math.random() > 0.5;
      const correctVerb = conjugate(verb, tense, pronoun.id);
      const correct = withPronoun ? `${pronoun.arabic} ${correctVerb}` : correctVerb;
      
      const distractors = pickRandom(PRONOUNS.filter(p => p.id !== pronoun.id), 3).map(p => {
        const distVerb = conjugate(verb, tense, p.id);
        return withPronoun ? `${p.arabic} ${distVerb}` : distVerb;
      });
      
      const translated = getRussianVerbTranslation(verb.russian, tense, pronoun.id, !withPronoun);
      
      q = {
        id: `q_${i}`, type,
        question: `Переведите на арабский: "${translated}"`,
        correctAnswer: correct,
        options: shuffle([correct, ...distractors])
      };
    } else if (type === 'conj_identify') {
      const verb = pickRandom(VERBS, 1)[0];
      const tense = pickRandom(['past', 'present', 'passive_past', 'passive_present'] as const, 1)[0];
      const pronoun = pickRandom(PRONOUNS, 1)[0];
      const form = conjugate(verb, tense, pronoun.id);
      const correct = tense === 'past' ? 'الماضي المعلوم' : tense === 'present' ? 'المضارع المعلوم' : tense === 'passive_past' ? 'الماضي المجهول' : 'المضارع المجهول';
      q = {
        id: `q_${i}`, type,
        question: `${form} — какое время?`,
        correctAnswer: correct,
        options: shuffle(['الماضي المعلوم', 'المضارع المعلوم', 'الماضي المجهول', 'المضارع المجهول'])
      };
    } else if (type === 'conj_pronoun') {
      const verb = pickRandom(VERBS, 1)[0];
      const tense = pickRandom(['past', 'present', 'passive_past', 'passive_present'] as const, 1)[0];
      const pronoun = pickRandom(PRONOUNS, 1)[0];
      const form = conjugate(verb, tense, pronoun.id);
      const distractors = pickRandom(PRONOUNS.filter(p => p.id !== pronoun.id), 3).map(p => p.arabic);
      q = {
        id: `q_${i}`, type,
        question: `${form} — какое местоимение?`,
        correctAnswer: pronoun.arabic,
        options: shuffle([pronoun.arabic, ...distractors])
      };
    } else if (type === 'pronoun_choose') {
      const p = pickRandom(POSSESSIVE_PRONOUNS, 1)[0];
      const distractors = pickRandom(POSSESSIVE_PRONOUNS.filter(x => x.id !== p.id), 3).map(x => x.example);
      q = {
        id: `q_${i}`, type,
        question: `${p.russian} книга = ?`,
        correctAnswer: p.example,
        options: shuffle([p.example, ...distractors])
      };
    } else if (type === 'pronoun_suffix') {
      const p = pickRandom(POSSESSIVE_PRONOUNS, 1)[0];
      const distractors = pickRandom(POSSESSIVE_PRONOUNS.filter(x => x.id !== p.id), 3).map(x => x.suffix);
      q = {
        id: `q_${i}`, type,
        question: `كِتَابُـ___ = ${p.russian} книга`,
        correctAnswer: p.suffix,
        options: shuffle([p.suffix, ...distractors])
      };
    } else if (type === 'bab_identify') {
      const verb = pickRandom(VERBS, 1)[0];
      const correct = getBab(verb);
      const allBabs = ['1 (نَصَرَ)', '2 (ضَرَبَ)', '3 (فَتَحَ)', '4 (عَلِمَ)', '5 (حَسُنَ)', '6 (حَسِبَ)'];
      const distractors = pickRandom(allBabs.filter(b => b !== correct), 3);
      q = {
        id: `q_${i}`, type,
        question: `К какому бабу (типу) относится глагол ${verb.arabic}? (Прош: ${verb.pastVowel || 'َ'}, Наст: ${verb.mudariVowel})`,
        correctAnswer: correct,
        options: shuffle([correct, ...distractors])
      };
    } else if (type === 'participle_ar_ru') {
      const verb = pickRandom(VERBS, 1)[0];
      const pType = Math.random() > 0.5 ? 'fail' : 'maful';
      const form = pickRandom(['m_s', 'm_d', 'm_p', 'f_s', 'f_d', 'f_p'] as const, 1)[0];
      const correctAr = getParticiple(verb, pType, form);
      const correctRu = getParticipleTranslation(verb.russian, pType, form);

      const distractors = pickRandom(['m_s', 'm_d', 'm_p', 'f_s', 'f_d', 'f_p'] as const, 4)
        .filter(f => f !== form).slice(0, 3)
        .map(f => getParticipleTranslation(verb.russian, pType, f));

      q = {
        id: `q_${i}`, type,
        question: `Как перевести: ${correctAr}?`,
        correctAnswer: correctRu,
        options: shuffle([correctRu, ...distractors])
      };
    } else if (type === 'participle_ru_ar') {
      const verb = pickRandom(VERBS, 1)[0];
      const pType = Math.random() > 0.5 ? 'fail' : 'maful';
      const form = pickRandom(['m_s', 'm_d', 'm_p', 'f_s', 'f_d', 'f_p'] as const, 1)[0];
      const correctAr = getParticiple(verb, pType, form);
      const correctRu = getParticipleTranslation(verb.russian, pType, form);

      const distractors = pickRandom(['m_s', 'm_d', 'm_p', 'f_s', 'f_d', 'f_p'] as const, 4)
        .filter(f => f !== form).slice(0, 3)
        .map(f => getParticiple(verb, pType, f));

      q = {
        id: `q_${i}`, type,
        question: `Как будет по-арабски: "${correctRu}"?`,
        correctAnswer: correctAr,
        options: shuffle([correctAr, ...distractors])
      };
    } else if (type === 'voice_identify') {
      const verb = pickRandom(VERBS, 1)[0];
      const tense = pickRandom(['past', 'present', 'passive_past', 'passive_present'] as const, 1)[0];
      const pronoun = pickRandom(PRONOUNS, 1)[0];
      const form = conjugate(verb, tense, pronoun.id);
      const isPassive = tense.includes('passive');
      const correct = isPassive ? 'Страдательный (Маджхуль)' : 'Действительный (Маълюм)';
      const wrong = isPassive ? 'Действительный (Маълюм)' : 'Страдательный (Маджхуль)';

      q = {
        id: `q_${i}`, type,
        question: `Определите залог: ${form}`,
        correctAnswer: correct,
        options: [correct, wrong]
      };
    }

    if (q) questions.push(q);
  }

  return questions;
}
