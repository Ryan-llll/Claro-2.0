export interface TermItem {
  term: string;
  simpleEnglish: string;
  french: string;
  darija: string;
}

export interface FlashcardItem {
  heading: string;
  bullets: string[];
  question: string;
  answer: string;
}

export interface DyslexiaSection {
  heading: string;
  paragraphs: string[];
}

export interface LectureDigest {
  title: string;
  summary: string;
  terms: TermItem[];
  flashcards: FlashcardItem[];
  dyslexiaSections: DyslexiaSection[];
  audioScript: string;
}

export interface LectureRecord {
  id: string;
  fileHash: string;
  filename: string;
  title: string;
  digestJson: LectureDigest;
  createdAt: string;
}