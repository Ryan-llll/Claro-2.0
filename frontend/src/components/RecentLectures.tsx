import type { Lecture } from '../types';

interface RecentLecturesProps {
  lectures: Lecture[];
  onSelect: (lec: Lecture) => void;
  onDelete: (id: string) => void;
}

export function RecentLectures({
  lectures,
  onSelect,
  onDelete,
}: RecentLecturesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Recent Lectures</h1>
        <p className="text-sm text-slate-400 mt-1">
          Cached in Neon PostgreSQL — click any lecture to study
        </p>
      </div>

      {lectures.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No lectures saved yet. Upload one to get started.
        </p>
      ) : (
        <div className="space-y-3">
          {lectures.map((lec) => (
            <div
              key={lec.id}
              onClick={() => onSelect(lec)}
              className="flex items-center justify-between p-4 rounded-xl bg-[#111622] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition"
            >
              <div>
                <h3 className="font-semibold text-white">
                  {lec.digestJson.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{lec.filename}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(lec.id);
                }}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}