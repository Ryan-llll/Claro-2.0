import 'dotenv/config';
import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { db } from './prisma/db.js';
import { extractLectureText } from './parser.js';
import { generateLectureDigest } from './ai.js';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'claro-backend' });
});

// 2. List all saved lectures (newest first)
app.get('/api/lectures', async (_req, res) => {
  try {
    const lectures = await db.orm.public.Lecture
      .orderBy((l) => l.createdAt.desc())
      .all();
    res.json(lectures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load lectures' });
  }
});

// 3. Delete a lecture by ID
app.delete('/api/lectures/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    await db.orm.public.Lecture.where({ id }).deleteAll();
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete lecture' });
  }
});

// 4. Upload & analyze a lecture (with SHA-256 cache)
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  const start = Date.now();

  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const fileHash = crypto
      .createHash('sha256')
      .update(req.file.buffer)
      .digest('hex');

    // Cache hit? Return immediately (0 Gemini calls)
    const cached = await db.orm.public.Lecture
      .whereUnique({ fileHash })
      .first();

    if (cached) {
      res.json({ lecture: cached, cached: true, ms: Date.now() - start });
      return;
    }

    // Cache miss: parse file -> call Gemini -> save to Neon
const { text, media } = await extractLectureText(req.file.buffer, req.file.originalname);
const digest = await generateLectureDigest(text, req.file.originalname, media);

    const lecture = await db.orm.public.Lecture.create({
      fileHash,
      filename: req.file.originalname,
      title: digest.title,
      digestJson: JSON.parse(JSON.stringify(digest)),
    });

    res.json({ lecture, cached: false, ms: Date.now() - start });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Failed to analyze file';
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Claro backend running on http://localhost:${PORT}`);
});