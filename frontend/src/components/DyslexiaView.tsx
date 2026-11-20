import { useState } from 'react';
import type { LectureDigest } from '../types';

export function DyslexiaView({ digest }: { digest: LectureDigest }) {
  const [speaking, setSpeaking] = useState(false);

  function toggleAudio() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(digest.audioScript);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border border-cyan-500/30 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
            35-Second Audio Recap
          </h2>
          <button
            onClick={toggleAudio}
            className="px-4 py-1.5 rounded-lg bg-cyan-400 text-slate-950 text-xs font-semibold hover:bg-cyan-300"
          >
            {speaking ? 'Stop' : '▶ Play'}
          </button>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {digest.audioScript}
        </p>
      </div>

      <div className="space-y-6 bg-[#111622] border border-slate-800 rounded-2xl p-8">
        {digest.dyslexiaSections.map((sec, i) => (
          <div key={i} className="space-y-3">
            <h3 className="text-xl font-semibold text-cyan-300 tracking-wide">
              {sec.heading}
            </h3>
            {sec.paragraphs.map((p, j) => (
              <p
                key={j}
                className="text-lg text-slate-100 leading-loose tracking-wider max-w-2xl"
              >
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}