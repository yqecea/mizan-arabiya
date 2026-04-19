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
    m_s: "مَ1ْ2ُو3ٌ",
    m_d: "مَ1ْ2ُو3َانِ",
    m_p: "مَ1ْ2ُو3ُونَ",
    f_s: "مَ1ْ2ُو3َةٌ",
    f_d: "مَ1ْ2ُو3َتَانِ",
    f_p: "مَ1ْ2ُو3َاتٌ",
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

export interface BabInfo {
  number: number;
  pastVowel: string;
  presentVowel: string;
  vowelLabel: string;
  arabicPattern: string;
  arabicExample: string;
}

const VOWEL_MAP: Record<string, string> = {
  'َ': 'a',
  'ُ': 'u',
  'ِ': 'i',
};

export function getBabInfo(verb: Verb): BabInfo {
  const past = verb.pastVowel || 'َ';
  const present = verb.mudariVowel;
  const pastLetter = VOWEL_MAP[past] || '?';
  const presentLetter = VOWEL_MAP[present] || '?';

  if (past === 'َ' && present === 'ُ') return { number: 1, pastVowel: pastLetter, presentVowel: presentLetter, vowelLabel: `${pastLetter}-${presentLetter}`, arabicPattern: 'فَعَلَ—يَفْعُلُ', arabicExample: 'نَصَرَ' };
  if (past === 'َ' && present === 'ِ') return { number: 2, pastVowel: pastLetter, presentVowel: presentLetter, vowelLabel: `${pastLetter}-${presentLetter}`, arabicPattern: 'فَعَلَ—يَفْعِلُ', arabicExample: 'ضَرَبَ' };
  if (past === 'َ' && present === 'َ') return { number: 3, pastVowel: pastLetter, presentVowel: presentLetter, vowelLabel: `${pastLetter}-${presentLetter}`, arabicPattern: 'فَعَلَ—يَفْعَلُ', arabicExample: 'فَتَحَ' };
  if (past === 'ِ' && present === 'َ') return { number: 4, pastVowel: pastLetter, presentVowel: presentLetter, vowelLabel: `${pastLetter}-${presentLetter}`, arabicPattern: 'فَعِلَ—يَفْعَلُ', arabicExample: 'عَلِمَ' };
  if (past === 'ُ' && present === 'ُ') return { number: 5, pastVowel: pastLetter, presentVowel: presentLetter, vowelLabel: `${pastLetter}-${presentLetter}`, arabicPattern: 'فَعُلَ—يَفْعُلُ', arabicExample: 'حَسُنَ' };
  if (past === 'ِ' && present === 'ِ') return { number: 6, pastVowel: pastLetter, presentVowel: presentLetter, vowelLabel: `${pastLetter}-${presentLetter}`, arabicPattern: 'فَعِلَ—يَفْعِلُ', arabicExample: 'حَسِبَ' };

  return { number: 0, pastVowel: '?', presentVowel: '?', vowelLabel: '?', arabicPattern: '?', arabicExample: '?' };
}

/** @deprecated Use getBabInfo() for structured data */
export function getBab(verb: Verb): string {
  const info = getBabInfo(verb);
  return `${info.number} — ${info.vowelLabel}`;
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
    let female = `${base}а`;
    let plural = `${base}ли`;
    if (base.endsWith('л')) {
      plural = base.slice(0, -1) + 'ли';
    } else if (base.endsWith('лся')) {
      female = base.slice(0, -2) + 'ась';
      plural = base.slice(0, -3) + 'лись';
    }
    if (['hiya', 'anti'].includes(pronounId)) return `${pronoun}${female}`.trim();
    if (['hum', 'hunna', 'antuma', 'antum', 'antunna', 'nahnu'].includes(pronounId)) return `${pronoun}${plural}`.trim();
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

// ═══════════════════════════════════════════════
// IMPERATIVE (AMR) — 2nd person only
// Pattern: remove present-tense prefix, add hamzat al-wasl if needed
// ═══════════════════════════════════════════════

const AMR_PATTERNS: Record<string, string> = {
  anta:    "اُ1ْ2V3ْ",
  anti:    "اُ1ْ2V3ِي",
  antuma:  "اُ1ْ2V3َا",
  antum:   "اُ1ْ2V3ُوا",
  antunna: "اُ1ْ2V3ْنَ",
};

export function getAmr(verb: Verb, pronounId: string): string {
  const rootLetters = verb.root.split('-');
  if (rootLetters.length !== 3) return '';
  const pattern = AMR_PATTERNS[pronounId];
  if (!pattern) return '';

  let result = pattern
    .replace(/1/g, rootLetters[0])
    .replace(/2/g, rootLetters[1])
    .replace(/3/g, rootLetters[2])
    .replace(/V/g, verb.mudariVowel);

  // If the middle vowel is damma or kasra, the hamza at start takes that vowel
  if (verb.mudariVowel === 'ُ') {
    result = result.replace('اُ', 'اُ');
  } else {
    result = result.replace('اُ', 'اِ');
  }

  return result;
}

// ═══════════════════════════════════════════════
// PROHIBITION (NAHY) — لا + مجزوم (present with jazm)
// ═══════════════════════════════════════════════

const NAHY_PATTERNS: Record<string, string> = {
  huwa:    "لَا يَ1ْ2V3ْ",
  hiya:    "لَا تَ1ْ2V3ْ",
  huma_m:  "لَا يَ1ْ2V3َا",
  huma_f:  "لَا تَ1ْ2V3َا",
  hum:     "لَا يَ1ْ2V3ُوا",
  hunna:   "لَا يَ1ْ2V3ْنَ",
  anta:    "لَا تَ1ْ2V3ْ",
  anti:    "لَا تَ1ْ2V3ِي",
  antuma:  "لَا تَ1ْ2V3َا",
  antum:   "لَا تَ1ْ2V3ُوا",
  antunna: "لَا تَ1ْ2V3ْنَ",
  ana:     "لَا أَ1ْ2V3ْ",
  nahnu:   "لَا نَ1ْ2V3ْ",
};

export function getNahy(verb: Verb, pronounId: string): string {
  const rootLetters = verb.root.split('-');
  if (rootLetters.length !== 3) return '';
  const pattern = NAHY_PATTERNS[pronounId];
  if (!pattern) return '';

  return pattern
    .replace(/1/g, rootLetters[0])
    .replace(/2/g, rootLetters[1])
    .replace(/3/g, rootLetters[2])
    .replace(/V/g, verb.mudariVowel);
}

// ═══════════════════════════════════════════════
// NEGATION — Past (ما + past) and Present (لا + present)
// ═══════════════════════════════════════════════

export function getNegativePast(verb: Verb, pronounId: string): string {
  const pastForm = conjugate(verb, 'past', pronounId);
  return `مَا ${pastForm}`;
}

export function getNegativePresent(verb: Verb, pronounId: string): string {
  const presentForm = conjugate(verb, 'present', pronounId);
  return `لَا ${presentForm}`;
}

// Negation with لَمْ  + مجزوم (past meaning but present form with jazm)
const LAM_PATTERNS: Record<string, string> = {
  huwa:    "لَمْ يَ1ْ2V3ْ",
  hiya:    "لَمْ تَ1ْ2V3ْ",
  huma_m:  "لَمْ يَ1ْ2V3َا",
  huma_f:  "لَمْ تَ1ْ2V3َا",
  hum:     "لَمْ يَ1ْ2V3ُوا",
  hunna:   "لَمْ يَ1ْ2V3ْنَ",
  anta:    "لَمْ تَ1ْ2V3ْ",
  anti:    "لَمْ تَ1ْ2V3ِي",
  antuma:  "لَمْ تَ1ْ2V3َا",
  antum:   "لَمْ تَ1ْ2V3ُوا",
  antunna: "لَمْ تَ1ْ2V3ْنَ",
  ana:     "لَمْ أَ1ْ2V3ْ",
  nahnu:   "لَمْ نَ1ْ2V3ْ",
};

export function getNegativePastLam(verb: Verb, pronounId: string): string {
  const rootLetters = verb.root.split('-');
  if (rootLetters.length !== 3) return '';
  const pattern = LAM_PATTERNS[pronounId];
  if (!pattern) return '';

  return pattern
    .replace(/1/g, rootLetters[0])
    .replace(/2/g, rootLetters[1])
    .replace(/3/g, rootLetters[2])
    .replace(/V/g, verb.mudariVowel);
}

// ═══════════════════════════════════════════════
// ISM ZAMAN / MAKAN (Place/Time noun)
// Patterns: مَفْعَل or مَفْعِل
// ═══════════════════════════════════════════════

export function getIsmZamanMakan(verb: Verb): { mafal: string; mafil: string } {
  const rootLetters = verb.root.split('-');
  if (rootLetters.length !== 3) return { mafal: '', mafil: '' };
  const [r1, r2, r3] = rootLetters;
  return {
    mafal: `مَ${r1}ْ${r2}َ${r3}ٌ`,
    mafil: `مَ${r1}ْ${r2}ِ${r3}ٌ`,
  };
}

// ═══════════════════════════════════════════════
// ISM ALA (Tool/Instrument noun)
// 3 patterns: مِفْعَل، مِفْعَال، مِفْعَلَة
// ═══════════════════════════════════════════════

export function getIsmAla(verb: Verb): { mifal: string; mifaal: string; mifalah: string } {
  const rootLetters = verb.root.split('-');
  if (rootLetters.length !== 3) return { mifal: '', mifaal: '', mifalah: '' };
  const [r1, r2, r3] = rootLetters;
  return {
    mifal:   `مِ${r1}ْ${r2}َ${r3}ٌ`,
    mifaal:  `مِ${r1}ْ${r2}َا${r3}ٌ`,
    mifalah: `مِ${r1}ْ${r2}َ${r3}َةٌ`,
  };
}

// ═══════════════════════════════════════════════
// ISM TAFDIL (Superlative/Comparative)
// Masculine: أَفْعَل  |  Feminine: فُعْلَى
// ═══════════════════════════════════════════════

export function getIsmTafdil(verb: Verb): { male: string; female: string } {
  const rootLetters = verb.root.split('-');
  if (rootLetters.length !== 3) return { male: '', female: '' };
  const [r1, r2, r3] = rootLetters;
  return {
    male:   `أَ${r1}ْ${r2}َ${r3}ُ`,
    female: `${r1}ُ${r2}ْ${r3}َى`,
  };
}
