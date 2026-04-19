# TASK: Fix Conjugations Page (Спряжения)

The user has explicitly requested to deploy you (the Anti-CLI agents) to fix the Conjugations page (`arabic/app/conjugation/page.tsx`), and they noted specifically that you have access to `context7` which you should use if needed (e.g. fetching Next.js App Router or React documentation).

## Context
- I recently replaced the legacy list-based UI with a `MATRIX` 3x3 layout.
- The user spotted a bug in it or its rendering ("пусть пофиксят Спряжения").
- Look carefully at the Mobile Viewport (snap-scrolling constraints) and the React component lifecycle.
- Look at the `var(--test-primary)` typo in the layout.
- Look at how `useProgress` fetches data on the client. 
- Look for `lucide-react` issues or unhandled exceptions in the logic (e.g. `practice` mode array indexing, or undefined variables).

## Instructions
1. Perform a deep audit of `/home/yqecea/arabic-app/arabic/app/conjugation/page.tsx`.
2. Diagnose what might be visibly or functionally broken based on Mizan strict UI rules and standard React/Next.js limitations.
3. If necessary, use `context7` to confirm behavior (e.g. Next.js App Router client rendering).
4. Apply the necessary fixes to the file. Ensure the Mizan Editorial Brand is strictly maintained.
5. Do NOT remove the Matrix functionality—just fix what's broken in it!
