export const books = [
  {
    book: "Genesis",
    verses: 1533,
    chapters: 50,
  },
  {
    book: "Exodus",
    verses: 1213,
    chapters: 40,
  },
  {
    book: "Leviticus",
    verses: 859,
    chapters: 27,
  },
  {
    book: "Numbers",
    verses: 1288,
    chapters: 36,
  },
  {
    book: "Deuteronomy",
    verses: 959,
    chapters: 34,
  },
  {
    book: "Joshua",
    verses: 658,
    chapters: 24,
  },
  {
    book: "Judges",
    verses: 618,
    chapters: 21,
  },
  {
    book: "Ruth",
    verses: 85,
    chapters: 4,
  },
  {
    book: "1 Samuel",
    verses: 810,
    chapters: 31,
  },
  {
    book: "2 Samuel",
    verses: 695,
    chapters: 24,
  },
  {
    book: "1 Kings",
    verses: 816,
    chapters: 22,
  },
  {
    book: "2 Kings",
    verses: 719,
    chapters: 25,
  },
  {
    book: "1 Chronicles",
    verses: 942,
    chapters: 29,
  },
  {
    book: "2 Chronicles",
    verses: 822,
    chapters: 36,
  },
  {
    book: "Ezra",
    verses: 280,
    chapters: 10,
  },
  {
    book: "Nehemiah",
    verses: 406,
    chapters: 13,
  },
  {
    book: "Esther",
    verses: 167,
    chapters: 10,
  },
  {
    book: "Job",
    verses: 1070,
    chapters: 42,
  },
  {
    book: "Psalms",
    verses: 2461,
    chapters: 150,
  },
  {
    book: "Proverbs",
    verses: 915,
    chapters: 31,
  },
  {
    book: "Ecclesiastes",
    verses: 222,
    chapters: 12,
  },
  {
    book: "Song of Solomon",
    verses: 117,
    chapters: 8,
  },
  {
    book: "Isaiah",
    verses: 1292,
    chapters: 66,
  },
  {
    book: "Jeremiah",
    verses: 1364,
    chapters: 52,
  },
  {
    book: "Lamentations",
    verses: 154,
    chapters: 5,
  },
  {
    book: "Ezekiel",
    verses: 1273,
    chapters: 48,
  },
  {
    book: "Daniel",
    verses: 357,
    chapters: 12,
  },
  {
    book: "Hosea",
    verses: 197,
    chapters: 14,
  },
  {
    book: "Joel",
    verses: 73,
    chapters: 3,
  },
  {
    book: "Amos",
    verses: 146,
    chapters: 9,
  },
  {
    book: "Obadiah",
    verses: 21,
    chapters: 1,
  },
  {
    book: "Jonah",
    verses: 48,
    chapters: 4,
  },
  {
    book: "Micah",
    verses: 105,
    chapters: 7,
  },
  {
    book: "Nahum",
    verses: 47,
    chapters: 3,
  },
  {
    book: "Habakkuk",
    verses: 56,
    chapters: 3,
  },
  {
    book: "Zephaniah",
    verses: 53,
    chapters: 3,
  },
  {
    book: "Haggai",
    verses: 38,
    chapters: 2,
  },
  {
    book: "Zechariah",
    verses: 211,
    chapters: 14,
  },
  {
    book: "Malachi",
    verses: 55,
    chapters: 4,
  },
  {
    book: "Matthew",
    verses: 1071,
    chapters: 28,
  },
  {
    book: "Mark",
    verses: 678,
    chapters: 16,
  },
  {
    book: "Luke",
    verses: 1151,
    chapters: 24,
  },
  {
    book: "John",
    verses: 879,
    chapters: 21,
  },
  {
    book: "Acts",
    verses: 1007,
    chapters: 28,
  },
  {
    book: "Romans",
    verses: 433,
    chapters: 16,
  },
  {
    book: "1 Corinthians",
    verses: 437,
    chapters: 16,
  },
  {
    book: "2 Corinthians",
    verses: 257,
    chapters: 13,
  },
  {
    book: "Galatians",
    verses: 149,
    chapters: 6,
  },
  {
    book: "Ephesians",
    verses: 155,
    chapters: 6,
  },
  {
    book: "Philippians",
    verses: 104,
    chapters: 4,
  },
  {
    book: "Colossians",
    verses: 95,
    chapters: 4,
  },
  {
    book: "1 Thessalonians",
    verses: 89,
    chapters: 5,
  },
  {
    book: "2 Thessalonians",
    verses: 47,
    chapters: 3,
  },
  {
    book: "1 Timothy",
    verses: 133,
    chapters: 6,
  },
  {
    book: "2 Timothy",
    verses: 83,
    chapters: 4,
  },
  {
    book: "Titus",
    verses: 46,
    chapters: 3,
  },
  {
    book: "Philemon",
    verses: 25,
    chapters: 1,
  },
  {
    book: "Hebrews",
    verses: 303,
    chapters: 13,
  },
  {
    book: "James",
    verses: 108,
    chapters: 5,
  },
  {
    book: "1 Peter",
    verses: 105,
    chapters: 5,
  },
  {
    book: "2 Peter",
    verses: 61,
    chapters: 3,
  },
  {
    book: "1 John",
    verses: 105,
    chapters: 5,
  },
  {
    book: "2 John",
    verses: 13,
    chapters: 1,
  },
  {
    book: "3 John",
    verses: 14,
    chapters: 1,
  },
  {
    book: "Jude",
    verses: 25,
    chapters: 1,
  },
  {
    book: "Revelation",
    verses: 404,
    chapters: 22,
  },
];

export type CategorizedBooks = {
  [category: string]: Array<{
    book: string;
    bookShort: string;
    verses: number;
    chapters: number;
  }>;
};

export const categorizedBooks: CategorizedBooks = {
  Pentateuch: [
    { book: "Genesis", verses: 1533, chapters: 50, bookShort: "Gen" },
    { book: "Exodus", verses: 1213, chapters: 40, bookShort: "Ex" },
    { book: "Leviticus", verses: 859, chapters: 27, bookShort: "Lev" },
    { book: "Numbers", verses: 1288, chapters: 36, bookShort: "Num" },
    { book: "Deuteronomy", verses: 959, chapters: 34, bookShort: "Deut " },
  ],
  "Old Testament Historical Books": [
    { book: "Joshua", verses: 658, chapters: 24, bookShort: "Josh" },
    { book: "Judges", verses: 618, chapters: 21, bookShort: "Judg" },
    { book: "Ruth", verses: 85, chapters: 4, bookShort: "Ruth" },
    { book: "1 Samuel", verses: 810, chapters: 31, bookShort: "1Sam" },
    { book: "2 Samuel", verses: 695, chapters: 24, bookShort: "2Sam" },
    { book: "1 Kings", verses: 816, chapters: 22, bookShort: "1Kings" },
    { book: "2 Kings", verses: 719, chapters: 25, bookShort: "2Kings" },
    { book: "1 Chronicles", verses: 942, chapters: 29, bookShort: "1Chron" },
    { book: "2 Chronicles", verses: 822, chapters: 36, bookShort: "2Chron" },
    { book: "Ezra", verses: 280, chapters: 10, bookShort: "Ezra" },
    { book: "Nehemiah", verses: 406, chapters: 13, bookShort: "Neh" },
    { book: "Esther", verses: 167, chapters: 10, bookShort: "Est" },
  ],
  "Wisdom Literature": [
    { book: "Job", verses: 1070, chapters: 42, bookShort: "Job" },
    { book: "Psalms", verses: 2461, chapters: 150, bookShort: "Ps" },
    { book: "Proverbs", verses: 915, chapters: 31, bookShort: "Prov" },
    { book: "Ecclesiastes", verses: 222, chapters: 12, bookShort: "Eccles" },
    { book: "Song of Solomon", verses: 117, chapters: 8, bookShort: "Song" },
  ],
  Prophets: [
    { book: "Isaiah", verses: 1292, chapters: 66, bookShort: "Isa" },
    { book: "Jeremiah", verses: 1364, chapters: 52, bookShort: "Jer" },
    { book: "Lamentations", verses: 154, chapters: 5, bookShort: "Lam" },
    { book: "Ezekiel", verses: 1273, chapters: 48, bookShort: "Ezek" },
    { book: "Daniel", verses: 357, chapters: 12, bookShort: "Dan" },
    { book: "Hosea", verses: 197, chapters: 14, bookShort: "Hos" },
    { book: "Joel", verses: 73, chapters: 3, bookShort: "Joel" },
    { book: "Amos", verses: 146, chapters: 9, bookShort: "Amos" },
    { book: "Obadiah", verses: 21, chapters: 1, bookShort: "Obad" },
    { book: "Jonah", verses: 48, chapters: 4, bookShort: "Jonah" },
    { book: "Micah", verses: 105, chapters: 7, bookShort: "Mic" },
    { book: "Nahum", verses: 47, chapters: 3, bookShort: "Nah" },
    { book: "Habakkuk", verses: 56, chapters: 3, bookShort: "Hab" },
    { book: "Zephaniah", verses: 53, chapters: 3, bookShort: "Zeph" },
    { book: "Haggai", verses: 38, chapters: 2, bookShort: "Hag" },
    { book: "Zechariah", verses: 211, chapters: 14, bookShort: "Zech" },
    { book: "Malachi", verses: 55, chapters: 4, bookShort: "Mal" },
  ],

  Gospels: [
    { book: "Matthew", verses: 1071, chapters: 28, bookShort: "Matt" },
    { book: "Mark", verses: 678, chapters: 16, bookShort: "Mark" },
    { book: "Luke", verses: 1151, chapters: 24, bookShort: "Luke" },
    { book: "John", verses: 879, chapters: 21, bookShort: "John" },
  ],
  "New Testament Historical Books": [
    { book: "Acts", verses: 1007, chapters: 28, bookShort: "Acts" },
  ],
  "Pauline Epistles": [
    { book: "Romans", verses: 433, chapters: 16, bookShort: "Rom" },
    { book: "1 Corinthians", verses: 437, chapters: 16, bookShort: "1Cor" },
    { book: "2 Corinthians", verses: 257, chapters: 13, bookShort: "2Cor" },
    { book: "Galatians", verses: 149, chapters: 6, bookShort: "Gal" },
    { book: "Ephesians", verses: 155, chapters: 6, bookShort: "Eph" },
    { book: "Philippians", verses: 104, chapters: 4, bookShort: "Phil" },
    { book: "Colossians", verses: 95, chapters: 4, bookShort: "Col" },
    { book: "1 Thessalonians", verses: 89, chapters: 5, bookShort: "1Thess" },
    { book: "2 Thessalonians", verses: 47, chapters: 3, bookShort: "2Thess" },
    { book: "1 Timothy", verses: 133, chapters: 6, bookShort: "1Tim" },
    { book: "2 Timothy", verses: 83, chapters: 4, bookShort: "2Tim" },
    { book: "Titus", verses: 46, chapters: 3, bookShort: "Titus" },
    { book: "Philemon", verses: 25, chapters: 1, bookShort: "Philem" },
  ],
  "General Epistles": [
    { book: "Hebrews", verses: 303, chapters: 13, bookShort: "Heb" },
    { book: "James", verses: 108, chapters: 5, bookShort: "James" },
    { book: "1 Peter", verses: 105, chapters: 5, bookShort: "1Pet" },
    { book: "2 Peter", verses: 61, chapters: 3, bookShort: "2Pet" },
    { book: "1 John", verses: 105, chapters: 5, bookShort: "1John" },
    { book: "2 John", verses: 13, chapters: 1, bookShort: "2John" },
    { book: "3 John", verses: 14, chapters: 1, bookShort: "3John" },
    { book: "Jude", verses: 25, chapters: 1, bookShort: "Jude" },
  ],
  Revelation: [
    { book: "Revelation", verses: 404, chapters: 22, bookShort: "Rev" },
  ],
};
