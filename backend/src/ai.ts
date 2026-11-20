import { GoogleGenAI } from '@google/genai';
import type { MediaPart } from './parser.js';
import type { LectureDigest } from './types.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = [
  process.env.GEMINI_MODEL || 'gemini-4-hydrogen',
  'gemini-4-hydrogen',
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];

function buildFallbackDigest(text: string, filename: string): LectureDigest {
  const cleanTitle = filename.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
  const snippet = text ? text.slice(0, 260).trim() + '...' : 'Visual slide deck.';

  return {
    title: cleanTitle || 'Lecture Notes',
    summary: `Offline study preview generated from ${filename}. ${snippet}`,
    terms: [
      {
        term: 'Core Concept',
        simpleEnglish: 'The main idea introduced in this lecture.',
        french: "L'idée principale présentée dans ce cours.",
        darija: 'L-fikra l-asasiya li kayhdar 3liha had dars.',
      },
    ],
    flashcards: [
      {
        heading: 'Quick Overview',
        bullets: [
          'Review the main definitions from your slides.',
          'Connect new terms to examples you already know.',
          'Re-try AI analysis once the API limit resets.',
        ],
        question: 'What is the main topic of this document?',
        answer: cleanTitle || 'Check the opening slide of your lecture.',
      },
    ],
    dyslexiaSections: [{ heading: cleanTitle || 'Lecture Preview', paragraphs: [snippet] }],
    audioScript: `Here is a quick preview of ${cleanTitle}. ${snippet}`,
  };
}

export async function generateLectureDigest(
  text: string,
  filename: string,
  media: MediaPart[] = []
): Promise<LectureDigest> {
  const prompt = `You are Claro, an inclusive university study assistant for Moroccan students.
Turn the following lecture content from "${filename}" (text and/or attached slide images/PDF) into a JSON object matching this exact structure:
{
  "title": "Short clear lecture title",
  "summary": "2-3 sentence plain-English summary",
  "terms": [
    { "term": "Key term", "simpleEnglish": "Plain explanation", "french": "French explanation", "darija": "Natural Moroccan Darija in Latin script (e.g. 'hadi kat3ni...')" }
  ],
  "flashcards": [
    { "heading": "Concept name", "bullets": ["short point 1", "short point 2", "short point 3"], "question": "Active recall question", "answer": "Short clear answer" }
  ],
  "dyslexiaSections": [
    { "heading": "Section title", "paragraphs": ["Short, easy-to-read paragraph."] }
  ],
  "audioScript": "A natural, friendly 35-second spoken recap of the lecture."
}

Rules:
- Include 6 to 8 key terms.
- Include 4 to 5 flashcards (max 3 short bullets each).
- Keep dyslexiaSections short and scannable.
- Base your response ONLY on the provided text/images. Never invent a topic from the filename.
- Return ONLY valid JSON.

Extracted text (may be empty if slides are images):
${text || '(Read the attached images/PDF)'}`;

  const contents =
    media.length > 0
      ? [{ text: prompt }, ...media.map((m) => ({ inlineData: m }))]
      : prompt;

  for (const model of new Set(MODELS)) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: { responseMimeType: 'application/json' },
      });

      if (response.text) {
        console.log(`Digest generated using ${model}`);
        return JSON.parse(response.text) as LectureDigest;
      }
    } catch (err) {
      console.warn(`Model ${model} failed, trying next...`);
    }
  }

  console.error('All Gemini models failed, using offline fallback.');
  return buildFallbackDigest(text, filename);
}