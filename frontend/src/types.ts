export interface Term {
  term: string;
  simpleEnglish: string;
  french: string;
  darija: string;
}

export interface Flashcard {
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
  terms: Term[];
  flashcards: Flashcard[];
  dyslexiaSections: DyslexiaSection[];
  audioScript: string;
}

export interface Lecture {
  id: string;
  filename: string;
  fileHash: string;
  digestJson: LectureDigest;
  createdAt: string;
}

export interface AnalyzeResponse {
  lecture: Lecture;
  cached?: boolean;
}