**DEBUGGER TASK (ANTI-CLI)**:
Пользователь сообщает о критическом баге навигации в Next.js App Router (версия 15.x). 
Локация: `arabic/app/page.tsx`

**Симптомы:**
На руте `/` отображается Hero-секция (состояние `isNewUser = true`). 
Внутри секции используются стандартные Next.js `<Link href="/vocabulary">` и `<Link href="/conjugation">`. 
При клике на них в браузере НИЧЕГО не происходит. Переход (client-side routing) не работает, ошибок сборки нет (билдится на Vercel/Firebase без проблем). Страница "зависла" в Hero секции.

**Задачи по фазам (Systematic Debugging):**
1. Исследуй `arabic/app/page.tsx` (строка 33+ где if (isNewUser)...) и `arabic/app/layout.tsx`. Убедись, что `<Link>` внутри `page.tsx` ничем не перекрывается.
2. Проверь хук `useProgress` в `arabic/hooks/useProgress.ts`. Может ли он прерывать рендер или вызывать бесконечный цикл, который ломает гидратацию React? (Обрати внимание, в `vocabulary/page.tsx` мы используем `useProgress` тоже).
3. Проанализируй, может ли проблема быть в `onClick` логике или в том, что `div` с анимацией `animate-fade-slide-up` блокирует Pointer Events?
4. Модифицируй `arabic/app/page.tsx`, чтобы `Link` работали 100% корректно (возможно, добавив `passHref`, убрав `pointer-events-none` или починив логику гидратации/state).

Действуй радикально, найди рут-коуз (Root Cause) и закоммить исправление.
