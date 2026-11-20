import path from 'node:path';
import AdmZip from 'adm-zip';
import { OfficeParser } from 'officeparser';

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.pptx']);
const MAX_CHARS = 18_000;
const MAX_IMAGES = 12;

export interface MediaPart {
  mimeType: string;
  data: string; // base64
}

export interface ParsedLecture {
  text: string;
  media: MediaPart[];
}

function getMime(ext: string): string | null {
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  return null;
}

export async function extractLectureText(
  buffer: Buffer,
  filename: string
): Promise<ParsedLecture> {
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`Unsupported file type "${ext}". Upload a .pdf, .docx, or .pptx.`);
  }

  let cleaned = '';
  try {
    const ast = await OfficeParser.parseOffice(buffer);
    const { value } = await ast.to('text');
    cleaned = String(value).replace(/\s+/g, ' ').trim();
  } catch {
    cleaned = '';
  }

  const media: MediaPart[] = [];

  // Always attach visual media for PDFs and PPTX slides
  if (ext === '.pdf') {
    media.push({ mimeType: 'application/pdf', data: buffer.toString('base64') });
  } else if (ext === '.pptx') {
    const zip = new AdmZip(buffer);
    for (const entry of zip.getEntries()) {
      if (!entry.entryName.startsWith('ppt/media/')) continue;
      const mimeType = getMime(path.extname(entry.entryName).toLowerCase());
      if (!mimeType) continue;
      const imgBuf = entry.getData();
      if (imgBuf.length < 8_000) continue; // skip tiny icons/bullets
      media.push({ mimeType, data: imgBuf.toString('base64') });
      if (media.length >= MAX_IMAGES) break;
    }
  }

  console.log(`[parser] ${filename}: ${cleaned.length} chars, ${media.length} media parts`);

  if (!cleaned && media.length === 0) {
    throw new Error('Could not extract readable text or slide images from this file.');
  }

  return { text: cleaned.slice(0, MAX_CHARS), media };
}