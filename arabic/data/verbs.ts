export interface Verb {
  id: number;
  arabic: string;
  root: string;
  transliteration: string;
  russian: string;
  mudari: string;
  mudariVowel: string;
  pastVowel?: string;
  passivePast: string;
  passivePresent?: string;
}

export const VERBS: Verb[] = [
  { id: 1, arabic: "جَمَعَ", root: "ج-م-ع", transliteration: "jamaʿa", russian: "собрал", mudari: "يَجْمَعُ", mudariVowel: "َ", passivePast: "جُمِعَ", passivePresent: "يُجْمَعُ" },
  { id: 2, arabic: "كَتَبَ", root: "ك-ت-ب", transliteration: "kataba", russian: "написал", mudari: "يَكْتُبُ", mudariVowel: "ُ", passivePast: "كُتِبَ", passivePresent: "يُكْتَبُ" },
  { id: 3, arabic: "كَفَرَ", root: "ك-ف-ر", transliteration: "kafara", russian: "не уверовал", mudari: "يَكْفُرُ", mudariVowel: "ُ", passivePast: "كُفِرَ", passivePresent: "يُكْفَرُ" },
  { id: 4, arabic: "نَظَرَ", root: "ن-ظ-ر", transliteration: "naẓara", russian: "посмотрел", mudari: "يَنْظُرُ", mudariVowel: "ُ", passivePast: "نُظِرَ", passivePresent: "يُنْظَرُ" },
  { id: 5, arabic: "جَعَلَ", root: "ج-ع-ل", transliteration: "jaʿala", russian: "сделал, сотворил", mudari: "يَجْعَلُ", mudariVowel: "َ", passivePast: "جُعِلَ", passivePresent: "يُجْعَلُ" },
  { id: 6, arabic: "فَتَحَ", root: "ف-ت-ح", transliteration: "fataḥa", russian: "открыл", mudari: "يَفْتَحُ", mudariVowel: "َ", passivePast: "فُتِحَ", passivePresent: "يُفْتَحُ" },
  { id: 7, arabic: "سَجَدَ", root: "س-ج-د", transliteration: "sajada", russian: "совершил суджуд", mudari: "يَسْجُدُ", mudariVowel: "ُ", passivePast: "سُجِدَ", passivePresent: "يُسْجَدُ" },
  { id: 8, arabic: "قَتَلَ", root: "ق-ت-ل", transliteration: "qatala", russian: "убил", mudari: "يَقْتُلُ", mudariVowel: "ُ", passivePast: "قُتِلَ", passivePresent: "يُقْتَلُ" },
  { id: 9, arabic: "دَرَسَ", root: "د-ر-س", transliteration: "darasa", russian: "изучил", mudari: "يَدْرُسُ", mudariVowel: "ُ", passivePast: "دُرِسَ", passivePresent: "يُدْرَسُ" },
  { id: 10, arabic: "دَخَلَ", root: "د-خ-ل", transliteration: "dakhala", russian: "вошёл", mudari: "يَدْخُلُ", mudariVowel: "ُ", passivePast: "دُخِلَ", passivePresent: "يُدْخَلُ" },
  { id: 11, arabic: "تَرَكَ", root: "ت-ر-ك", transliteration: "taraka", russian: "оставил", mudari: "يَتْرُكُ", mudariVowel: "ُ", passivePast: "تُرِكَ", passivePresent: "يُتْرَكُ" },
  { id: 12, arabic: "ذَهَبَ", root: "ذ-ه-ب", transliteration: "dhahaba", russian: "ушёл, пошёл", mudari: "يَذْهَبُ", mudariVowel: "َ", passivePast: "ذُهِبَ", passivePresent: "يُذْهَبُ" },
  { id: 13, arabic: "رَفَعَ", root: "ر-ف-ع", transliteration: "rafaʿa", russian: "поднял", mudari: "يَرْفَعُ", mudariVowel: "َ", passivePast: "رُفِعَ", passivePresent: "يُرْفَعُ" },
  { id: 14, arabic: "ذَكَرَ", root: "ذ-ك-ر", transliteration: "dhakara", russian: "упомянул", mudari: "يَذْكُرُ", mudariVowel: "ُ", passivePast: "ذُكِرَ", passivePresent: "يُذْكَرُ" },
  { id: 15, arabic: "رَكَعَ", root: "ر-ك-ع", transliteration: "rakaʿa", russian: "совершил руку'", mudari: "يَرْكَعُ", mudariVowel: "َ", passivePast: "رُكِعَ", passivePresent: "يُرْكَعُ" },
  { id: 16, arabic: "عَبَدَ", root: "ع-ب-د", transliteration: "ʿabada", russian: "поклонялся", mudari: "يَعْبُدُ", mudariVowel: "ُ", passivePast: "عُبِدَ", passivePresent: "يُعْبَدُ" },
  { id: 17, arabic: "خَرَجَ", root: "خ-ر-ج", transliteration: "kharaja", russian: "вышел", mudari: "يَخْرُجُ", mudariVowel: "ُ", passivePast: "خُرِجَ", passivePresent: "يُخْرَجُ" },
  { id: 18, arabic: "ضَرَبَ", root: "ض-ر-ب", transliteration: "ḍaraba", russian: "ударил", mudari: "يَضْرِبُ", mudariVowel: "ِ", passivePast: "ضُرِبَ", passivePresent: "يُضْرَبُ" },
  { id: 19, arabic: "ظَلَمَ", root: "ظ-ل-م", transliteration: "ẓalama", russian: "притеснил", mudari: "يَظْلِمُ", mudariVowel: "ِ", passivePast: "ظُلِمَ", passivePresent: "يُظْلَمُ" },
  { id: 20, arabic: "رَزَقَ", root: "ر-ز-ق", transliteration: "razaqa", russian: "наделил пропитанием", mudari: "يَرْزُقُ", mudariVowel: "ُ", passivePast: "رُزِقَ", passivePresent: "يُرْزَقُ" },
  { id: 21, arabic: "نَصَرَ", root: "ن-ص-ر", transliteration: "naṣara", russian: "помог (одержал победу)", mudari: "يَنْصُرُ", mudariVowel: "ُ", passivePast: "نُصِرَ", passivePresent: "يُنْصَرُ" },
  { id: 22, arabic: "فَهِمَ", root: "ف-ه-م", transliteration: "fahima", russian: "понял", mudari: "يَفْهَمُ", mudariVowel: "َ", pastVowel: "ِ", passivePast: "فُهِمَ", passivePresent: "يُفْهَمُ" },
  { id: 23, arabic: "حَسِبَ", root: "ح-س-ب", transliteration: "ḥasiba", russian: "посчитал, подумал", mudari: "يَحْسِبُ", mudariVowel: "ِ", pastVowel: "ِ", passivePast: "حُسِبَ", passivePresent: "يُحْسَبُ" },
  { id: 24, arabic: "كَرُمَ", root: "ك-ر-م", transliteration: "karuma", russian: "был щедрым", mudari: "يَكْرُمُ", mudariVowel: "ُ", pastVowel: "ُ", passivePast: "كُرِمَ", passivePresent: "يُكْرَمُ" },
  { id: 25, arabic: "حَفِظَ", root: "ح-ف-ظ", transliteration: "ḥafiẓa", russian: "сохранил, выучил", mudari: "يَحْفَظُ", mudariVowel: "َ", pastVowel: "ِ", passivePast: "حُفِظَ", passivePresent: "يُحْفَظُ" },
  { id: 26, arabic: "سَمِعَ", root: "س-م-ع", transliteration: "samiʿa", russian: "услышал", mudari: "يَسْمَعُ", mudariVowel: "َ", pastVowel: "ِ", passivePast: "سُمِعَ", passivePresent: "يُسْمَعُ" },
  { id: 27, arabic: "خَلَقَ", root: "خ-ل-ق", transliteration: "khalaqa", russian: "создал", mudari: "يَخْلُقُ", mudariVowel: "ُ", passivePast: "خُلِقَ", passivePresent: "يُخْلَقُ" },
  { id: 28, arabic: "كَرِهَ", root: "ك-ر-ه", transliteration: "kariha", russian: "ненавидел", mudari: "يَكْرَهُ", mudariVowel: "َ", pastVowel: "ِ", passivePast: "كُرِهَ", passivePresent: "يُكْرَهُ" },
  { id: 29, arabic: "جَلَسَ", root: "ج-ل-س", transliteration: "jalasa", russian: "сидел", mudari: "يَجْلِسُ", mudariVowel: "ِ", passivePast: "جُلِسَ", passivePresent: "يُجْلَسُ" },
  { id: 30, arabic: "كَسَبَ", root: "ك-س-ب", transliteration: "kasaba", russian: "приобрел, заработал", mudari: "يَكْسِبُ", mudariVowel: "ِ", passivePast: "كُسِبَ", passivePresent: "يُكْسَبُ" },
  { id: 31, arabic: "مَلَكَ", root: "م-ل-ك", transliteration: "malaka", russian: "владел", mudari: "يَمْلِكُ", mudariVowel: "ِ", passivePast: "مُلِكَ", passivePresent: "يُمْلَكُ" },
  { id: 32, arabic: "صَبَرَ", root: "ص-ب-ر", transliteration: "ṣabara", russian: "терпел", mudari: "يَصْبِرُ", mudariVowel: "ِ", passivePast: "صُبِرَ", passivePresent: "يُصْبَرُ" },
  { id: 33, arabic: "حَجَبَ", root: "ح-ج-ب", transliteration: "ḥajaba", russian: "скрыл", mudari: "يَحْجُبُ", mudariVowel: "ُ", passivePast: "حُجِبَ", passivePresent: "يُحْجَبُ" },
  { id: 34, arabic: "كَثُرَ", root: "ك-ث-ر", transliteration: "kathura", russian: "был многочисленным", mudari: "يَكْثُرُ", mudariVowel: "ُ", pastVowel: "ُ", passivePast: "كُثِرَ", passivePresent: "يُكْثَرُ" },
  { id: 35, arabic: "خَشَعَ", root: "خ-ش-ع", transliteration: "khashaʿa", russian: "был смиренным", mudari: "يَخْشَعُ", mudariVowel: "َ", passivePast: "خُشِعَ", passivePresent: "يُخْشَعُ" },
  { id: 36, arabic: "نَصِبَ", root: "ن-ص-ب", transliteration: "naṣiba", russian: "трудился, утомлялся", mudari: "يَنْصَبُ", mudariVowel: "َ", pastVowel: "ِ", passivePast: "نُصِبَ", passivePresent: "يُنْصَبُ" },
  { id: 37, arabic: "نَعِمَ", root: "ن-ع-م", transliteration: "naʿima", russian: "наслаждался, был в благополучии", mudari: "يَنْعَمُ", mudariVowel: "َ", pastVowel: "ِ", passivePast: "نُعِمَ", passivePresent: "يُنْعَمُ" },
  { id: 38, arabic: "حَسَدَ", root: "ح-س-د", transliteration: "ḥasada", russian: "завидовал", mudari: "يَحْسُدُ", mudariVowel: "ُ", passivePast: "حُسِدَ", passivePresent: "يُحْسَدُ" },
  { id: 39, arabic: "مَنَعَ", root: "م-ن-ع", transliteration: "manaʿa", russian: "запретил, воспрепятствовал", mudari: "يَمْنَعُ", mudariVowel: "َ", passivePast: "مُنِعَ", passivePresent: "يُمْنَعُ" },
  { id: 40, arabic: "حَمِدَ", root: "ح-م-د", transliteration: "ḥamida", russian: "хвалил", mudari: "يَحْمَدُ", mudariVowel: "َ", pastVowel: "ِ", passivePast: "حُمِدَ", passivePresent: "يُحْمَدُ" },
  { id: 41, arabic: "شَكَرَ", root: "ش-ك-ر", transliteration: "shakara", russian: "благодарил", mudari: "يَشْكُرُ", mudariVowel: "ُ", passivePast: "شُكِرَ", passivePresent: "يُشْكَرُ" },
  { id: 42, arabic: "فَعَلَ", root: "ف-ع-ل", transliteration: "faʿala", russian: "делал, совершал", mudari: "يَفْعَلُ", mudariVowel: "َ", passivePast: "فُعِلَ", passivePresent: "يُفْعَلُ" },
  { id: 43, arabic: "عَلِمَ", root: "ع-ل-م", transliteration: "ʿalima", russian: "знал", mudari: "يَعْلَمُ", mudariVowel: "َ", pastVowel: "ِ", passivePast: "عُلِمَ", passivePresent: "يُعْلَمُ" }
];
