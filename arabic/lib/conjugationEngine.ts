import { Verb } from '@/data/verbs';

export type Tense = 'past' | 'present' | 'passive_past' | 'passive_present';
export type ParticipleForm = 'm_s' | 'm_d' | 'm_p' | 'f_s' | 'f_d' | 'f_p';

const PARTICIPLE_PATTERNS = {
  fail: {
    m_s: "1َا2ِ3ٌ",
    m_d: "1َا2ِ3َانِ",
    m_p: "1َا2ِ3ُونَ",
    f_s: "1َا2ِ3َةٌ",
    f_d: "1َا2ِ3َتَانِ",
    f_p: "1َا2ِ3َاتٌ",
  },
  maful: {
    m_s: "مَ1ْ2ُ3ٌ",
    m_d: "مَ1ْ2ُ3َانِ",
    m_p: "مَ1ْ2ُ3ُونَ",
    f_s: "مَ1ْ2ُ3َةٌ",
    f_d: "مَ1ْ2ُ3َتَانِ",
    f_p: "مَ1ْ2ُ3َاتٌ",
  }
};

const PATTERNS = {
  past: {
    huwa: "1َ2P3َ",
    huma_m: "1َ2P3َا",
    hum: "1َ2P3ُوا",
    hiya: "1َ2P3َتْ",
    huma_f: "1َ2P3َتَا",
    hunna: "1َ2P3ْنَ",
    anta: "1َ2P3ْتَ",
    antuma: "1َ2P3ْتُمَا",
    antum: "1َ2P3ْتُمْ",
    anti: "1َ2P3ْتِ",
    antunna: "1َ2P3ْتُنَّ",
    ana: "1َ2P3ْتُ",
    nahnu: "1َ2P3ْنَا",
  },
  present: {
    huwa: "يَ1ْ2V3ُ",
    huma_m: "يَ1ْ2V3َانِ",
    hum: "يَ1ْ2V3ُونَ",
    hiya: "تَ1ْ2V3ُ",
    huma_f: "تَ1ْ2V3َانِ",
    hunna: "يَ1ْ2V3ْنَ",
    anta: "تَ1ْ2V3ُ",
    antuma: "تَ1ْ2V3َانِ",
    antum: "تَ1ْ2V3ُونَ",
    anti: "تَ1ْ2V3ِينَ",
    antunna: "تَ1ْ2V3ْنَ",
    ana: "أَ1ْ2V3ُ",
    nahnu: "نَ1ْ2V3ُ",
  },
  passive_past: {
    huwa: "1ُ2ِ3َ",
    huma_m: "1ُ2ِ3َا",
    hum: "1ُ2ِ3ُوا",
    hiya: "1ُ2ِ3َتْ",
    huma_f: "1ُ2ِ3َتَا",
    hunna: "1ُ2ِ3ْنَ",
    anta: "1ُ2ِ3ْتَ",
    antuma: "1ُ2ِ3ْتُمَا",
    antum: "1ُ2ِ3ْتُمْ",
    anti: "1ُ2ِ3ْتِ",
    antunna: "1ُ2ِ3ْتُنَّ",
    ana: "1ُ2ِ3ْتُ",
    nahnu: "1ُ2ِ3ْنَا",
  },
  passive_present: {
    huwa: "يُ1ْ2َ3ُ",
    huma_m: "يُ1ْ2َ3َانِ",
    hum: "يُ1ْ2َ3ُونَ",
    hiya: "تُ1ْ2َ3ُ",
    huma_f: "تُ1ْ2َ3َانِ",
    hunna: "يُ1ْ2َ3ْنَ",
    anta: "تُ1ْ2َ3ُ",
    antuma: "تُ1ْ2َ3َانِ",
    antum: "تُ1ْ2َ3ُونَ",
    anti: "تُ1ْ2َ3ِينَ",
    antunna: "تُ1ْ2َ3ْنَ",
    ana: "أُ1ْ2َ3ُ",
    nahnu: "نُ1ْ2َ3ُ",
  }
};

export function conjugate(verb: Verb, tense: Tense, pronounId: string): string {
  const rootLetters = verb.root.split('-');
  if (rootLetters.length !== 3) return verb.arabic;

  const pattern = PATTERNS[tense][pronounId as keyof typeof PATTERNS['past']];
  if (!pattern) return '';

  let result = pattern
    .replace(/1/g, rootLetters[0])
    .replace(/2/g, rootLetters[1])
    .replace(/3/g, rootLetters[2]);

  if (tense === 'past') {
    result = result.replace(/P/g, verb.pastVowel || 'َ');
  } else if (tense === 'present') {
    result = result.replace(/V/g, verb.mudariVowel);
  }

  return result;
}

export function getRussianPronounTranslation(pronounId: string): string {
  const translations: Record<string, string> = {
    huwa: "он", huma_m: "они (двое, м)", hum: "они (м)",
    hiya: "она", huma_f: "они (двое, ж)", hunna: "они (ж)",
    anta: "ты (м)", antuma: "вы (двое)", antum: "вы (м)",
    anti: "ты (ж)", antunna: "вы (ж)",
    ana: "я", nahnu: "мы"
  };
  return translations[pronounId] || "";
}

export function getBab(verb: Verb): string {
  const past = verb.pastVowel || 'َ';
  const present = verb.mudariVowel;
  
  if (past === 'َ' && present === 'ُ') return '1 (نَصَرَ)';
  if (past === 'َ' && present === 'ِ') return '2 (ضَرَبَ)';
  if (past === 'َ' && present === 'َ') return '3 (فَتَحَ)';
  if (past === 'ِ' && present === 'َ') return '4 (عَلِمَ)';
  if (past === 'ُ' && present === 'ُ') return '5 (حَسُنَ)';
  if (past === 'ِ' && present === 'ِ') return '6 (حَسِبَ)';
  
  return '?';
}

export function getParticiple(verb: Verb, type: 'fail' | 'maful', form: ParticipleForm): string {
  const rootLetters = verb.root.split('-');
  if (rootLetters.length !== 3) return '';
  const pattern = PARTICIPLE_PATTERNS[type][form];
  return pattern
    .replace(/1/g, rootLetters[0])
    .replace(/2/g, rootLetters[1])
    .replace(/3/g, rootLetters[2]);
}

export function getParticipleTranslation(verbRussian: string, type: 'fail' | 'maful', form: ParticipleForm): string {
  const base = verbRussian.toLowerCase();
  const formText = {
    m_s: "(он)",
    m_d: "(двое, м.)",
    m_p: "(мн.ч., м.)",
    f_s: "(она)",
    f_d: "(двое, ж.)",
    f_p: "(мн.ч., ж.)"
  }[form];

  if (type === 'fail') {
    return `Причастие действ. (Фаиль) от '${base}' ${formText}`;
  } else {
    return `Причастие страдат. (Мафъуль) от '${base}' ${formText}`;
  }
}

export function getRussianVerbTranslation(verbRussian: string, tense: Tense, pronounId: string, omitPronoun: boolean = false): string {
  // A simplified heuristic for generating Russian translations.
  // This is not perfect for all Russian verbs but provides a good hint.
  const base = verbRussian.toLowerCase();
  const pronoun = omitPronoun ? '' : getRussianPronounTranslation(pronounId) + ' ';
  
  if (tense === 'past') {
    if (['hiya', 'anti'].includes(pronounId)) return `${pronoun}${base}а`.trim();
    if (['hum', 'hunna', 'antuma', 'antum', 'antunna', 'nahnu'].includes(pronounId)) return `${pronoun}${base}ли`.trim();
    return `${pronoun}${base}`.trim();
  }
  
  if (tense === 'present') {
    if (pronounId === 'ana') return `${pronoun}(наст. вр., 1-е л. ед.ч. от: ${base})`.trim();
    if (['huwa', 'hiya'].includes(pronounId)) return `${pronoun}(наст. вр., 3-е л. ед.ч. от: ${base})`.trim();
    if (['hum', 'hunna'].includes(pronounId)) return `${pronoun}(наст. вр., 3-е л. мн.ч. от: ${base})`.trim();
    if (pronounId === 'nahnu') return `${pronoun}(наст. вр., 1-е л. мн.ч. от: ${base})`.trim();
    return `${pronoun}(наст. вр., 2-е л. от: ${base})`.trim();
  }
  
  if (tense === 'passive_past') {
    if (['hiya', 'anti'].includes(pronounId)) return `${pronoun}была (страд. от ${base})`.trim();
    if (['hum', 'hunna', 'antuma', 'antum', 'antunna', 'nahnu'].includes(pronounId)) return `${pronoun}были (страд. от ${base})`.trim();
    return `${pronoun}был (страд. от ${base})`.trim();
  }
  
  if (tense === 'passive_present') {
    return `${pronoun}(страд. наст. от ${base})`.trim();
  }
  
  return `${pronoun}${base}`.trim();
}
