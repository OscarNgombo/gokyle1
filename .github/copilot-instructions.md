# Copilot instructions for this repository

## Build, test, and lint

- Install deps with `pnpm install`.
- Start the dev server with `pnpm run dev`.
- Build for production with `pnpm run build`.
- Build with development mode settings with `pnpm run build:dev`.
- Run the full test suite with `pnpm run test`.
- Run tests in watch mode with `pnpm run test:watch`.
- Run a single test file with `pnpm exec vitest run src/test/example.test.ts`.
- Run a single named test with `pnpm exec vitest run src/test/example.test.ts -t "should pass"`.
- Run lint with `pnpm run lint`.

Current validation baseline:

- `pnpm run build` passes.
- `pnpm run test` passes.
- `pnpm run lint` fails on the same pre-existing issues in `src/components/ui/command.tsx`, `src/components/ui/textarea.tsx`, and `tailwind.config.ts`, plus several fast-refresh warnings in generated-style UI files.

## High-level architecture

- This is a Vite + React + TypeScript single-page app. `src/main.tsx` mounts `App`, and `src/App.tsx` is the real application shell.
- `App` wires the global providers and runtime services: `QueryClientProvider`, `LanguageProvider`, `TooltipProvider`, `Toaster`, `Sonner`, and `BrowserRouter`.
- Routing is defined directly in `src/App.tsx`. Most routes render full pages from `src/pages/*`, and the catch-all route goes to `src/pages/NotFound.tsx`.
- The site is content-driven and mostly client-only. There is no API layer or server-backed booking flow in this repo. Safari and blog content comes from local data modules:
  - `src/data/safariPackages.ts` drives safari listings, booking package choices, and some booking details.
  - `src/data/blogPosts.ts` drives the blog index and blog detail pages.
- The booking flow is front-end only. `src/pages/Safaris.tsx` navigates to `/booking?package=...`, `src/pages/Booking.tsx` reads that search param, and both booking UIs generate `mailto:` and WhatsApp links instead of submitting to a backend.
- Localization is centralized in `src/contexts/LanguageContext.tsx`. Components call `useLanguage()` and render copy through `t(key)`. The provider currently supports English and German and falls back to returning the key when a translation is missing.
- Styling is a combination of Tailwind utilities, shadcn/ui primitives in `src/components/ui`, and custom theme tokens/classes in `src/index.css`. The theme is built around CSS variables like `--safari`, `--earth`, and shared classes like `.btn-safari`, `.section-title`, and `.link-underline`.

## Key conventions

- Use the `@/` alias for app imports. The alias points at `src` and is used consistently across pages, components, hooks, and data modules.
- Reuse the existing shadcn/ui primitives before adding new bespoke controls. Shared primitives live in `src/components/ui`, and class composition uses `cn()` from `src/lib/utils.ts`.
- There is no shared page layout wrapper. Most pages explicitly render `<Header />`, page content, `<PaymentMethods />`, and `<Footer />`. Keep that page-level composition pattern unless you are intentionally refactoring the app shell.
- Treat `safariPackages` as the source of truth for safari metadata. Booking screens look up packages by `title`, not by `id`, so title changes can break `/booking?package=...` preselection and booking modal/package matching.
- When adding or editing user-facing copy, update `LanguageContext.tsx` translations if the string is meant to be localized through `t(key)`. Some pages also use inline bilingual data objects such as `descEn`/`descDe` in `src/pages/Destinations.tsx`; follow the local pattern already used by that page instead of mixing approaches inside the same feature.
- Dynamic blog and destination pages are route-parameter driven but still resolve content locally from in-repo data. Keep new content additions synchronized with the route assumptions in `BlogPost`, `Destinations`, `Safaris`, and `Booking`.
