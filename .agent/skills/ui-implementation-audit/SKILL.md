---
name: ui-implementation-audit
description: UI Implementation Guidelines & Audit checklist based on IF Builder patterns. Use to review and audit frontend code for accessibility, performance, and best practices.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# UI Implementation Guidelines & Audit

> **Core Principle:** This checklist ensures high-quality frontend implementation in IF Builder. It focuses on accessibility, performance, semantics, and React/Tailwind v4 best practices.
> **Reference:** Inspired by Vercel Web Interface Guidelines, adapted for IF Builder's stack (React, Tailwind v4, shadcn, i18next, react-window).

---

## 🔍 Audit Categories

### 1. Focus States & Accessibility
- Interactive elements MUST have visible focus. Use Tailwind v4 utilities like `focus-visible:ring-2 focus-visible:ring-ring` (shadcn pattern).
- **NEVER** use `outline-none` / `outline: none` without providing a focus replacement.
- Prefer `:focus-visible` over `:focus` to avoid showing focus rings on mouse click.
- For compound controls, group focus with `:focus-within`.

### 2. Forms & Inputs
- Inputs must have `autocomplete` and a meaningful `name`.
- Use the correct `type` (`email`, `tel`, `url`, `number`) and `inputmode` for mobile keyboards.
- **NEVER** block paste (`onPaste` + `preventDefault`).
- Labels must be clickable (`htmlFor` linking to input `id`, or wrapping the control).
- Disable spellcheck on emails, codes, usernames: `spellCheck={false}`.
- Submit buttons should remain enabled until the request starts, showing a loading indicator during the request.
- Form validation errors should appear inline.

### 3. Animation & Motion
- Follow `animation-guide.md` and `motion-graphics.md` (from `frontend-design` skill).
- Honor `prefers-reduced-motion` using Tailwind's `motion-safe` or `motion-reduce` utilities.
- Animate **only** `transform` and `opacity` for compositor-friendly performance.
- **NEVER** use `transition-all`. Always list specific properties (e.g., `transition-colors`, `transition-transform`).

### 4. Typography & Content
- Use `…` (ellipsis character) instead of `...` (three dots).
- Use `react-i18next` (`useTranslation`, `t()`) for **ALL** user-facing text. Do not hardcode strings.
- Long text containers must handle overflow gracefully: use `truncate`, `line-clamp-*`, or `break-words`.
- Flex children containing text may need `min-w-0` to allow truncation to work.
- Handle empty states gracefully. Don't render broken UI for empty strings or arrays.

### 5. Images & Icons
- Use `lucide-react` for icons. Icon buttons MUST have an `aria-label` or visually hidden text for screen readers.
- `<img>` tags must have explicit `width` and `height` to prevent Cumulative Layout Shift (CLS).
- Off-screen images should use `loading="lazy"`.

### 6. Performance & Virtualization
- Large lists (e.g., Scene List, Variables) MUST be virtualized using `react-window` and `react-virtualized-auto-sizer`.
- Avoid layout reads during render (`getBoundingClientRect`, `offsetHeight`, etc.).
- Prefer uncontrolled inputs where appropriate; if controlled, the update cycle must be extremely cheap.

### 7. Layout & Safe Areas
- Prefer Flexbox (`flex`) or Grid (`grid`) over manual JS measurements for layouts.
- Avoid unwanted scrollbars: use `overflow-x-hidden` on containers when necessary.
- For modal dialogs and sheets, use `overscroll-contain` (or `overscroll-behavior: contain`) to prevent background scrolling.

### 8. Theming (Dark Mode & Themes)
- Use Tailwind's dark mode utilities (`dark:`) correctly or rely on CSS variables mapped to themes.
- Ensure the UI adapts seamlessly to IF Builder's dynamic themes (App Themes and Game Themes).
- `color-scheme: dark` should be set on dark themes to fix scrollbars and native inputs.

---

## 🛑 Anti-patterns (FLAG THESE IMMEDIATELY)

When reviewing or writing code, flag these critical violations:
- `transition-all` (Always specify what is transitioning).
- `outline-none` without a `focus-visible` replacement.
- `onPaste` with `preventDefault()`.
- Buttons or clickable `div`s without keyboard interactivity (`onKeyDown` for Enter/Space) or missing `aria-label`s.
- `<a>` tags without valid `href` attributes (use `<button>` for actions).
- Using hardcoded UI strings instead of `t('key')` from `i18next`.
- Images missing dimensions.
- Large array `.map()` renders without `react-window` virtualization.
- Inputs without associated labels.

---

## 📝 Output Format for Audits

When asked to audit a component or file against these guidelines, output findings grouped by file in a `file:line` format (which is VS Code clickable). Provide terse findings.

```text
## src/components/Sidebar.tsx

src/components/Sidebar.tsx:42 - icon button missing aria-label
src/components/Sidebar.tsx:55 - hardcoded string instead of i18next t()
src/components/Sidebar.tsx:67 - transition-all → list properties (e.g. transition-colors)

## src/components/Modal.tsx

src/components/Modal.tsx:12 - missing overscroll-behavior: contain
src/components/Modal.tsx:34 - "..." → use true ellipsis "…"

## src/components/Card.tsx

✓ pass
```

State the issue and location directly. Skip long explanations unless the fix is non-obvious. No preamble.
