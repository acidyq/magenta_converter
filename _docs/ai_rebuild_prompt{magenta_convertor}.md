# Prompt: Rebuild Magenta Converter Web App

You are an expert full-stack engineer. Recreate **Magenta Converter**, a universal file conversion suite with neon magenta branding. Follow the specification below to ship a production-ready experience.

## High-Level Goals
- Accept uploads for video, audio, image, and document files up to 500 MB.
- Let users select a target format and kick off asynchronous conversions with real-time job progress updates.
- Deliver a polished neon-magenta UI that mirrors prior projects (Paste Downloader, Vocal Remover) while embracing the new brand.
- Provide a secure, stateless backend that queues conversions and streams completed assets back to the client.

## Architecture Requirements
- **Monorepo Layout**: Root workspace managed by npm workspaces + Turbo Repo.
  - `apps/web`: Next.js 14 App Router UI.
  - `apps/api`: Node.js 20 Express API.
  - `packages/shared`: Shared TypeScript types/constants.
  - `data/storage`: Local disk storage for uploaded and converted assets.
- **Frontend (`apps/web`)**: Next.js 14 + React 18 + TailwindCSS.
  - App Router with `app/` directory, TypeScript, and ESLint.
  - Neon magenta theme (#ff00cc) with glassmorphism, glow hovers, and responsive layout.
  - Drag-and-drop upload zone, conversion selector (Video | Audio | Image | Document), target format picker, and job progress panel.
  - Uses Fetch API to call backend endpoints; polls job status until completion.
- **Backend (`apps/api`)**: Express server on port `3001`.
  - Endpoints:
    - `POST /convert` → Accept upload + enqueue BullMQ job.
    - `GET /jobs/:id` → Return job status/progress.
    - `GET /files/:filename` → Stream completed files.
  - Multer handles uploads, BullMQ + Redis queue conversion jobs, FFmpeg processes media, Sharp converts images.
  - Document conversion should gracefully fallback (copy same-format files) with clear TODOs for integrating LibreOffice/Pandoc.
  - Serve local storage from `apps/api/storage` (symlinked or mounted) and expose `/files/*`.
- **Queue + Workers**: BullMQ worker in the same Express process.
  - Redis connection string via `REDIS_URL`.
  - Job progress updates surfaced back to frontend.
- **File Storage**: Local storage rooted at `STORAGE_PATH` (default `./storage`). Ensure directories exist at boot.
- **Tooling**: TypeScript across repo, Turbo build pipeline, shared tsconfig bases. Provide lint and build scripts.

## Functional Requirements
- Drag-and-drop or browse for a single file per job (with preview name/size and removal option).
- Detect file type to preselect conversion tab (Video/Audio/Image/Document).
- Allow users to choose from curated target format lists per media type.
- Kick off conversion jobs, display status (Pending → Processing → Completed/Failed), progress %, error messaging, and download CTA.
- Persist converted files long enough for user download; serve via signed-like direct link served by Express.
- Provide legal notice reminding users to convert only content they have rights to use.

## Non-Functional Requirements
- Consistent neon-magenta aesthetic aligned with supplied art direction.
- Responsive layout (desktop, tablet, mobile) with accessible color contrast and keyboard support.
- Meaningful error handling (upload failures, unsupported conversions, queue issues).
- Observability via console logging for queue events and conversion outcomes.
- Keep services stateless aside from file storage; do not persist job metadata outside in-memory map (stub for future database).

## Deliverables
1. **Monorepo** with `package.json`, `turbo.json`, and workspace configuration.
2. **Frontend app** in `apps/web` with components (`FileUploader`, `ConversionPanel`, `JobStatus`), Tailwind config, and global theme styles.
3. **Backend API** in `apps/api` with Express routes, BullMQ queue, FFmpeg/Sharp processors, and environment samples.
4. **Shared package** in `packages/shared` exporting TypeScript interfaces and constants for job + format definitions.
5. **Documentation**: Root `README.md` explaining setup, development, and conversion capabilities.
6. **Scripts**: Optional `scripts/dev-setup.sh` for local onboarding.

## Environment Variables
- `NEXT_PUBLIC_API_URL` (frontend → backend base URL, defaults to `http://localhost:3001`).
- `PORT` (API port, default `3001`).
- `NODE_ENV` (standard Node environment).
- `REDIS_URL` (e.g., `redis://localhost:6379`).
- `STORAGE_PATH` (filesystem directory for uploads + outputs).

## Dependencies
- **Frontend**: `next`, `react`, `tailwindcss`, `framer-motion`, `react-dropzone`, `lucide-react`, `clsx`, `tailwind-merge`.
- **Backend**: `express`, `multer`, `bullmq`, `ioredis`, `fluent-ffmpeg`, `sharp`, `uuid`, `dotenv`, `cors`, `helmet`.
- **Shared Tooling**: `typescript`, `turbo`, `concurrently`, `tsx` for dev watching.

## Testing Expectations
- Manual flows covering each conversion type (upload → select format → observe progress → download file).
- Error scenarios: unsupported format request, conversion failure (e.g., corrupt file), Redis unavailable, FFmpeg missing.
- Cross-browser smoke tests (Chrome, Firefox, Safari) and responsive viewport checks.
- Performance sanity: conversions should complete within reasonable bounds; UI remains responsive during queue waits.

Deliver the full codebase, configuration, and documentation necessary to run Magenta Converter locally with `npm run setup` followed by `npm run dev` (Redis + FFmpeg installed on the host).
