# Claro

An inclusive, AI-powered university study assistant built for Moroccan students. Upload lecture slides or notes (`.pdf`, `.docx`, `.pptx`) and get instant multilingual study guides, active-recall flashcards, and dyslexia-friendly audio recaps.

## Features
- **Multimodal Parsing:** Reads both text and image-heavy/math slides (`.pdf`, `.pptx`, `.docx`) directly with Gemini.
- **Darija & French Mode:** Plain-English summaries with key terms explained in English, French, and Moroccan Darija (Latin script).
- **Active-Recall Flashcards:** Bite-sized bullet points and Q&A cards for quick revision.
- **Dyslexia & Audio Mode:** Scannable reading sections paired with a spoken audio recap.
- **Neon PostgreSQL Caching:** Saves analyzed lectures so you can revisit them instantly in Recent Lectures.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma, Neon PostgreSQL
- **AI & Parsing:** Google Gemini API (`@google/genai`), `officeparser`, `adm-zip`

## Local Setup

### 1. Clone the repo
```bash
git clone [https://github.com/Ryan-IIII/Claro-2.0.git](https://github.com/Ryan-IIII/Claro-2.0.git)
cd Claro-2.0
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your DATABASE_URL and GEMINI_API_KEY in .env
npx prisma migrate dev
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and start uploading!
