import { useEffect, useState } from 'react';
import { analyzeLecture, deleteLecture, getLectures } from './api';
import { DarijaView } from './components/DarijaView';
import { DyslexiaView } from './components/DyslexiaView';
import { FlashcardsView } from './components/FlashcardsView';
import { RecentLectures } from './components/RecentLectures';
import { Sidebar, type View } from './components/Sidebar';
import { UploadView } from './components/UploadView';
import type { Lecture } from './types';

export default function App() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [active, setActive] = useState<Lecture | null>(null);
  const [view, setView] = useState<View>('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cached, setCached] = useState(false);

  useEffect(() => {
    getLectures()
      .then((data) => {
        setLectures(data);
        if (data.length > 0) setActive(data[0]);
      })
      .catch(() => setError('Could not connect to backend on port 4000.'));
  }, []);

  async function handleUpload(file: File) {
    setLoading(true);
    setError('');
    setCached(false);
    try {
      const res = await analyzeLecture(file);
      setActive(res.lecture);
      setCached(Boolean(res.cached));
      setLectures((prev) => [
        res.lecture,
        ...prev.filter((l) => l.id !== res.lecture.id),
      ]);
      setView('darija');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteLecture(id);
    const next = lectures.filter((l) => l.id !== id);
    setLectures(next);
    if (active?.id === id) setActive(next[0] ?? null);
  }

  const digest = active?.digestJson;
  const isStudyView =
    view === 'darija' || view === 'flashcards' || view === 'dyslexia';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex">
      <Sidebar view={view} setView={setView} />

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 text-sm text-red-300 bg-red-950/50 border border-red-800/60 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {view === 'upload' && (
            <UploadView loading={loading} onUpload={handleUpload} />
          )}

          {view === 'recent' && (
            <RecentLectures
              lectures={lectures}
              onSelect={(lec) => {
                setActive(lec);
                setCached(false);
                setView('darija');
              }}
              onDelete={handleDelete}
            />
          )}

          {isStudyView &&
            (!digest ? (
              <div className="text-center py-20 text-slate-400 space-y-4">
                <p>No lecture selected yet.</p>
                <button
                  onClick={() => setView('upload')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-sm"
                >
                  Upload a Document
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h1 className="text-2xl font-bold text-white">
                    {digest.title}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    {active.filename}{' '}
                    {cached && (
                      <span className="ml-2 text-cyan-400">
                        • Instant Cache
                      </span>
                    )}
                  </p>
                </div>

                {view === 'darija' && <DarijaView digest={digest} />}
                {view === 'flashcards' && (
                  <FlashcardsView flashcards={digest.flashcards} />
                )}
                {view === 'dyslexia' && <DyslexiaView digest={digest} />}
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}