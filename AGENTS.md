# BuildMaster — Agent Instructions

## Project identity

BuildMaster is an intelligent construction-company and construction-project management product, currently being developed as a mobile-first application. Its purpose is to centralize project progress, site activity, workforce/task accountability, and financial visibility so owners and managers can follow work without always being physically present at a site.

The product addresses gaps reported in the project's three user interviews: difficulty monitoring progress remotely, unclear accountability for daily work, time-consuming manual reports, scattered project evidence, limited expense visibility, unplanned costs, uncertainty about who completed work, difficulty preparing periodic reports, and poor communication among project stakeholders. Treat interview findings as qualitative research, not universal claims; see [BISEDAT.md](./BISEDAT.md).

BuildMaster's long-term goal is a useful product for real construction companies, not only a university demonstration. Keep that goal distinct from what the current code actually supports.

## Current implementation (verified in code)

- The app is an Expo / React Native / TypeScript project using Expo Router, currently on Expo SDK 58. Dependencies are managed with npm and `package-lock.json`.
- `src/app/index.tsx` is a project overview screen with one sample project card and a small set of framework/tutorial articles.
- `src/components/ConstructionProjectCard.tsx` presents sample project status, location, dates, manager, budget/expenses, progress, worker/task counts, navigation actions, and native share UI.
- `src/app/projects/[section].tsx` provides details and financial overview screens backed by static demo data. Its daily-reports screen is an empty-state placeholder; creating or storing reports is not implemented.
- `src/data/` contains the sample project and article data/types. `src/utils/construction-project.ts` contains display-formatting and calculation helpers. `src/app/artikull/[id].tsx` is an article detail screen.
- The project has no backend, database, authentication, server API, persistent project storage, photo upload, daily-report creation, or expense entry. The project and financial figures are illustrative only. Do not describe planned functionality as implemented.
- `src/app/_layout.tsx` defines the root Expo Router stack. Route screens belong in `src/app/`; reusable UI, data, types, and helpers belong outside the route directory.

## Product scope and direction

The [HARTA.md](./HARTA.md) roadmap defines the intended MVP:

1. Daily construction-progress updates and project history.
2. Recording daily site activities.
3. Attaching photographs as evidence to work reports.
4. Project expense tracking, including recorded unplanned expenses.

These are planned capabilities, not current app behavior. Later ideas include AI-assisted report descriptions, automatic weekly/monthly/yearly reports, and deeper financial reporting and expense analysis. Confirm scope before implementing a future idea; do not imply that these capabilities or any supporting backend/data model already exist.

## Architecture and development principles

- Keep changes consistent with the existing Expo Router, React Native, and strict TypeScript setup. Reuse the current project data types and formatting/calculation helpers where applicable.
- Keep sample/demo data clearly labeled. Avoid hard-coding claims that imply live, shared, or persisted company data.
- Build mobile-first, accessible screens that work across iOS, Android, and web. Preserve responsive layouts, safe-area handling, color-scheme support, and meaningful accessibility labels/roles.
- Keep UI components focused and route-independent. Put new route screens under `src/app/`; keep reusable components, domain types, data access, and utilities in their existing source areas.
- Maintain clear separation between presentation and data access. If persistence or a service layer is introduced, document the actual integration and handle loading, empty, and error states explicitly; do not invent endpoints or database tables.
- Financial and progress calculations must be typed, predictable, and validated at the boundary. Preserve currency/date formatting conventions unless product requirements explicitly change.
- Protect project, worker, and financial information in any future data integration. Implement authorization and auditability only when a real data/auth design is introduced; do not present them as existing features.
- Prefer focused changes; do not add dependencies or unrelated scaffold. Update project documentation when actual functionality or architecture changes.

## Expo and React Native guidance

Expo APIs can change between SDK releases. Before changing Expo, EAS, or React Native API usage:

1. Check the installed `expo` version in `package.json`.
2. Consult the matching versioned documentation at `https://docs.expo.dev/versions/v<major>.0.0/`.
3. For additional documentation, use `https://docs.expo.dev/llms.txt` and follow links to the relevant official page.

- Use Expo Router for navigation. Import `Link`, `router`/`useRouter`, and `useLocalSearchParams` from `expo-router`.
- Install native dependencies with `npx expo install <package>` so versions match the installed SDK. Do not switch package managers; this repository uses npm.
- If `ios/` and `android/` are absent, use Continuous Native Generation. Do not create or hand-edit native project directories; configure native behavior through `app.json` and config plugins.
- Expo Go does not include every native module. A newly added native dependency may require a development build (`npx expo run:ios|android` or EAS development build).
- Use EAS for cloud builds/submissions/updates when configured. Consult `https://docs.expo.dev/eas/index/` and use `npx eas-cli@latest <command>`; do not assume EAS project configuration exists.

## Development and validation

The repository README specifies Node.js 24.3 or newer in the Node 24 LTS line (Node.js 25 is not supported). Run commands from the repository root:

```bash
npm install
npm start
npm run android
npm run ios
npm run web
npm run lint
npx tsc --noEmit
```

Run the smallest relevant validation for a change; run lint and type-check after code changes. Use `npx expo-doctor` to diagnose Expo dependency/configuration issues, and `npx expo install --fix` only when intentionally resolving SDK compatibility.
