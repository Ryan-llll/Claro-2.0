import { useState } from 'react';
import type { Flashcard } from '../types';

export function FlashcardsView({ flashcards }: { flashcards: Flashcard[] }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-4">
      {flashcards.map((card, i) => (
        <div
          key={i}
          className="bg-[#111622] border border-slate-800 rounded-2xl p-6 space-y-3"
        >
          <h3 className="text-lg font-semibold text-cyan-400">
            {card.heading}
          </h3>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
            {card.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
          <div className="pt-3 border-t border-slate-800">
            <p className="text-sm font-medium text-white">Q: {card.question}</p>
            <button
              onClick={() =>
                setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))
              }
              className="mt-2 text-xs text-cyan-400 hover:underline"
            >
              {flipped[i] ? 'Hide Answer' : 'Reveal Answer'}
            </button>
            {flipped[i] && (
              <p className="mt-2 text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl">
                {card.answer}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}