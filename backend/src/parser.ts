import path from 'node:path';
import { OfficeParser } from 'officeparser';

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.pptx']);
const MAX_CHARS = 18_000;

export async function extractLectureText(buffer: Buffer, filename: string): Promise<string> {
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`Unsupported file type "${ext}". Please upload a .pdf, .docx, or .pptx file.`);
  }

  const ast = await OfficeParser.parseOffice(buffer);
  const { value } = await ast.to('text');
  const cleaned = String(value).replace(/\s+/g, ' ').trim();

  if (!cleaned) {
    throw new Error('Could not extract any readable text from this file.');
  }

  return cleaned.slice(0, MAX_CHARS);
}