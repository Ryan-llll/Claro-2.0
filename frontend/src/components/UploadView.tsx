import { useState } from 'react';

interface UploadViewProps {
  loading: boolean;
  onUpload: (file: File) => void;
}

export function UploadView({ loading, onUpload }: UploadViewProps) {
  const [dragging, setDragging] = useState(false);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Upload University Lecture
        </h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Drop your PDF slides, Word notes (.docx), or PowerPoint presentations
          (.pptx)
        </p>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`block cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition ${
          dragging
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-slate-700/80 bg-[#111622]/70 hover:border-cyan-500/50'
        }`}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 mb-5">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-white">
          {loading
            ? 'Analyzing your lecture...'
            : 'Upload Lecture Slides or Documents'}
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Drag &amp; drop your{' '}
          <span className="text-cyan-400 font-medium">
            PDF, DOCX, or PPTX
          </span>{' '}
          file here, or click to browse
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          {['PDF Slides', 'PowerPoint (.pptx)', 'Word (.docx)'].map((badge) => (
            <span
              key={badge}
              className="px-3.5 py-1.5 rounded-full text-xs bg-slate-900 border border-slate-800 text-slate-300"
            >
              {badge}
            </span>
          ))}
        </div>

        <input
          type="file"
          accept=".pdf,.docx,.pptx"
          onChange={handleFileInput}
          disabled={loading}
          className="hidden"
        />
      </label>
    </div>
  );
}