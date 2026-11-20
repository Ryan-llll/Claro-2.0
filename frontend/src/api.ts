import type { AnalyzeResponse, Lecture } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function analyzeLecture(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze document');
  }

  return res.json();
}

export async function getLectures(): Promise<Lecture[]> {
  const res = await fetch(`${API_BASE}/api/lectures`);
  if (!res.ok) throw new Error('Failed to load lectures');
  const data = await res.json();
  return Array.isArray(data) ? data : data.lectures ?? [];
}

export async function deleteLecture(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/lectures/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete lecture');
}