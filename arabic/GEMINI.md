# Project Overview
This project is an interactive web-based platform for learning the Arabic language ("Arabic Trainer"). It focuses on helping users practice vocabulary, verb conjugations (active/passive, past/present), pronouns (including possessive suffixes), babs (verb types), and participles. It also includes tracking user learning progress and quizzes.

# Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 with PostCSS
- **UI Components:** React 19, Lucide React (for icons)
- **AI Integration:** Google GenAI SDK (`@google/genai`)
- **Linting:** ESLint 9

# Architecture & Directory Structure
- `app/`: Next.js App Router pages and global layouts (`page.tsx`, `layout.tsx`, `globals.css`). Contains specific learning routes such as `/conjugation`, `/homework`, `/pronouns`, `/quiz`, and `/vocabulary`.
- `components/`: Reusable React UI components (e.g., `ArabicText.tsx`, `ProgressRing.tsx`, `Sidebar.tsx`).
- `data/`: Static data files serving as the knowledge base for verbs, conjugations, pronouns, and homework (`verbs.ts`, `conjugations.ts`, etc.).
- `hooks/`: Custom React hooks, notably `useProgress.ts` for tracking and persisting user learning progress.
- `lib/`: Core business logic and utilities:
  - `conjugationEngine.ts`: Handles complex Arabic verb conjugation logic based on 3-letter roots, tenses, pronouns, and babs.
  - `quizGenerator.ts`: Dynamically generates random quizzes across different grammar and vocabulary topics.
  - `storage.ts`: Utilities for local storage management.

# Building and Running

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Environment Variables:** 
   Create a `.env.local` file and set your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. **Run development server:**
   ```bash
   npm run dev
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```
5. **Start production server:**
   ```bash
   npm run start
   ```
6. **Linting:**
   ```bash
   npm run lint
   ```

# Development Conventions
- **Language Targeting:** The application interface and translations are primarily in Russian, designed for Russian-speaking learners of Arabic.
- **Styling:** The project utilizes Tailwind CSS alongside custom CSS variables defined in `globals.css` (e.g., `var(--accent-gold)`, `var(--bg-primary)`) to maintain a consistent theme and support dark/light modes seamlessly.
- **Typography:** Uses the `Inter` font for UI elements and the `Amiri` font specifically for rendering Arabic text cleanly.
- **Logic Separation:** Heavy emphasis on separating complex grammatical logic (like root letter replacement and pattern matching) into pure, testable TypeScript functions within the `lib/` directory, keeping the React components focused solely on presentation.
