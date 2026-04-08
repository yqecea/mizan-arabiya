export interface Pronoun {
  id: string;
  arabic: string;
  russian: string;
  person: 3 | 2 | 1;
  gender: 'm' | 'f' | 'n';
  number: 'sing' | 'dual' | 'plural';
}

export const PRONOUNS: Pronoun[] = [
  { id: "huwa",     arabic: "هُوَ",     russian: "Он",              person: 3, gender: "m", number: "sing" },
  { id: "huma_m",   arabic: "هُمَا",    russian: "Они (дв. м.)",    person: 3, gender: "m", number: "dual" },
  { id: "hum",      arabic: "هُمْ",     russian: "Они (мн. м.)",    person: 3, gender: "m", number: "plural" },
  { id: "hiya",     arabic: "هِيَ",     russian: "Она",             person: 3, gender: "f", number: "sing" },
  { id: "huma_f",   arabic: "هُمَا",    russian: "Они (дв. ж.)",    person: 3, gender: "f", number: "dual" },
  { id: "hunna",    arabic: "هُنَّ",    russian: "Они (мн. ж.)",    person: 3, gender: "f", number: "plural" },
  { id: "anta",     arabic: "أَنْتَ",   russian: "Ты (м.)",         person: 2, gender: "m", number: "sing" },
  { id: "antuma",   arabic: "أَنْتُمَا", russian: "Вы (дв.)",       person: 2, gender: "m", number: "dual" },
  { id: "antum",    arabic: "أَنْتُمْ",  russian: "Вы (мн. м.)",    person: 2, gender: "m", number: "plural" },
  { id: "anti",     arabic: "أَنْتِ",   russian: "Ты (ж.)",         person: 2, gender: "f", number: "sing" },
  { id: "antunna",  arabic: "أَنْتُنَّ", russian: "Вы (мн. ж.)",    person: 2, gender: "f", number: "plural" },
  { id: "ana",      arabic: "أَنَا",    russian: "Я",               person: 1, gender: "n", number: "sing" },
  { id: "nahnu",    arabic: "نَحْنُ",   russian: "Мы",              person: 1, gender: "n", number: "plural" },
];
