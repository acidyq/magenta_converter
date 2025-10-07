# Universal File Conversion Suite (Starter Monorepo)

One-stop web app for converting **video, audio, images, and documents**.
- **Frontend**: Next.js 14 (App Router)
- **API**: Node + Express + BullMQ + Sharp + FFmpeg (native)
- **Queue**: Redis
- **Docs**: Gotenberg (LibreOffice + Chromium) as a container

## Quickstart (Docker)
```bash
docker compose up --build
# web: http://localhost:3000
# api: http://localhost:4000
```

## Local Dev (no Docker)
```bash
# in apps/api
cp .env.example .env
npm i
npm run dev

# in apps/web
npm i
npm run dev
```

## Endpoints
- `POST /convert/media` — fields: `file` (binary), `target` (e.g., mp4, webm, mp3, wav), optional `ffargs[]`.
- `POST /convert/image` — fields: `file`, `target` (png/webp/jpg/avif/tiff), `options` (JSON).
- `POST /convert/document` — **requires Docker/Gotenberg**. Converts DOCX/PPTX/XLSX/HTML/MD -> PDF.
- `POST /jobs` — queue a conversion (`kind` = media/image/document, `targetFormat`, optional `options`), then poll:
- `GET /jobs/:id` — returns status and `resultUrl` when complete.

## Notes
- The document conversion is stubbed for local-only dev; full proxy works with the `gotenberg` service in Docker.
- Storage lives in a Docker volume `data:` and is served at `/files/*` from the API.
- For very large media, consider splitting the worker into its own container and mounting `/data` volume.
- Frontend is intentionally minimal so you can expand with presets, batch uploads, and history.
