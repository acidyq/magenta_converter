# Magenta Converter Overview

## Purpose
Magenta Converter is a neon-magenta themed file conversion suite that handles video, audio, image, and document assets. Users upload media, choose a target format, and receive converted downloads through a modern, responsive interface inspired by Paste Downloader and Vocal Remover.

## Primary Experience
- **Upload media** via drag-and-drop or file browser with instant file detail preview.
- **Choose conversion path** using tabs for Video, Audio, Image, or Document workflows.
- **Select target format** from curated lists tailored to each media type.
- **Monitor progress** through real-time job status, percentage updates, and clear success/failure states.
- **Download results** with a glowing CTA once conversion completes.

## System Architecture
- **Frontend (`apps/web/`)**
  - Next.js 14 App Router with TypeScript and TailwindCSS.
  - Components: `FileUploader`, `ConversionPanel`, `JobStatus` to orchestrate the user journey.
  - Uses `NEXT_PUBLIC_API_URL` to proxy API requests (default `http://localhost:3001`).
  - Neon magenta palette (#ff00cc) layered on a dark background with glassmorphism and glow animations.
- **API Server (`apps/api/`)**
  - Node.js 20 + Express server started via `npm run dev:api` (port `3001`).
  - Endpoints: `POST /convert`, `GET /jobs/:id`, `GET /files/:filename`, plus `/health`.
  - Multer handles uploads to `storage/`. BullMQ + Redis orchestrate asynchronous conversion jobs with in-memory job registry.
- **Conversion Engines**
  - **Video/Audio**: FFmpeg via `fluent-ffmpeg` to transcode between standard formats (MP4, MKV, MP3, WAV, FLAC, etc.).
  - **Image**: Sharp for transformations to JPEG, PNG, WebP, AVIF, TIFF, and more.
  - **Document**: Stub implementation copies matching extensions with TODO hooks for LibreOffice/Pandoc integration.
- **Shared Types (`packages/shared/`)**
  - TypeScript definitions for conversion jobs, API responses, and supported format arrays consumed by both web and API apps.
- **Storage**
  - Default path `apps/api/storage/` (configurable with `STORAGE_PATH`). Files served via `/files/*` and cleaned manually.

## Data Flow
1. **Upload**: User drops a file into `FileUploader`, which posts to `POST /convert` along with the target format/type.
2. **Queue**: API stores file, creates a BullMQ job, and returns a job ID.
3. **Processing**: Worker runs FFmpeg/Sharp/document handler, updating progress in shared job map.
4. **Polling**: Frontend `JobStatus` component polls `GET /jobs/:id` until job is completed or failed.
5. **Download**: When complete, the API responds with `outputFile` path; frontend reveals download button linking to `/files/:filename`.
6. **Cleanup**: Manual or scheduled cleanup can purge `storage/` as needed (future enhancement).

## Key Configuration
- **Environment variables**
  - `NEXT_PUBLIC_API_URL` (frontend) → default `http://localhost:3001`
  - `REDIS_URL` → `redis://localhost:6379`
  - `STORAGE_PATH` → relative path for file persistence (`./storage`)
  - `PORT`, `NODE_ENV`
- **Scripts**
  - `npm run setup` → install, build shared package, seed env files.
  - `npm run dev` → concurrently start API (`npm run dev:api`) and web (`npm run dev:web`).
  - `npm run build` → build shared, web, and api targets.

## Operational Notes
- Requires FFmpeg, Redis (e.g., Homebrew services), and Node.js 18+ installed locally.
- Queue uses in-memory job map; production should replace with persistent database.
- Document conversions currently copy or warn; integrate LibreOffice/Pandoc for full fidelity.
- Consider scheduled cron cleanup for `storage/` to manage disk footprint.
- Neon theming guidelines: #0a0a0f / #0d0d15 background gradients, #ff00cc accents, glass panels, and glowing CTA buttons.
