export type View = 'upload' | 'recent' | 'darija' | 'flashcards' | 'dyslexia';

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
}

export function Sidebar({ view, setView }: SidebarProps) {
  const navBtn = (target: View, label: string, icon: React.ReactNode) => {
    const isActive = view === target;
    return (
      <button
        onClick={() => setView(target)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
          isActive
            ? 'bg-cyan-500/10 text-white border border-cyan-500/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
        }`}
      >
        <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
          {icon}
        </span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-[#111622] border-r border-slate-800/80 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1 pt-1">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l1.9 5.8L20 10.7l-5.8 1.9L12 18.5l-1.9-5.9L4 10.7l5.8-1.9L12 3z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Claro
          </span>
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Study Modes
          </p>
          {navBtn(
            'darija',
            'Darija & French',
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 5h12M10 5c0 5-3 9-6 11M5 9c2 2 5 4 8 5M14 19l4-9 4 9M15.5 16h5" />
            </svg>
          )}
          {navBtn(
            'flashcards',
            'Flashcards',
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
            </svg>
          )}
          {navBtn(
            'dyslexia',
            'Dyslexia & Audio',
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 18v-6a9 9 0 0118 0v6" />
              <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
            </svg>
          )}
        </div>

        <div className="border-t border-slate-800/80" />

        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Workspace
          </p>
          {navBtn(
            'upload',
            'Upload Document',
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
          {navBtn(
            'recent',
            'Recent Lectures',
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <div className="px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <span>Neon Cache</span>
          <span className="text-cyan-400 font-medium">Active</span>
        </div>
      </div>
    </aside>
  );
}