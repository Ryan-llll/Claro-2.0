import type { LectureDigest } from '../types';

export function DarijaView({ digest }: { digest: LectureDigest }) {
  return (
    <div className="space-y-6">
      <div className="bg-[#111622] border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-2">
          Plain-English Summary
        </h2>
        <p className="text-slate-200 leading-relaxed">{digest.summary}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {digest.terms.map((t, i) => (
          <div
            key={i}
            className="bg-[#111622] border border-slate-800 rounded-2xl p-5 space-y-2"
          >
            <h3 className="text-lg font-semibold text-cyan-400">{t.term}</h3>
            <p className="text-sm text-slate-200">
              <span className="text-slate-500">EN:</span> {t.simpleEnglish}
            </p>
            <p className="text-sm text-slate-300">
              <span className="text-slate-500">FR:</span> {t.french}
            </p>
            <p className="text-sm text-sky-200">
              <span className="text-slate-500">Darija:</span> {t.darija}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}