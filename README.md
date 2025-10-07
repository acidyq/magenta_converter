# Magenta Converter

A universal file conversion suite with neon magenta branding. Convert video, audio, image, and document files with a beautiful, modern interface.

## Features

- **Video Conversion**: Convert between MP4, AVI, MOV, MKV, and more using FFmpeg
- **Audio Conversion**: Support for MP3, WAV, FLAC, AAC, OGG formats
- **Image Conversion**: JPEG, PNG, WebP, AVIF, TIFF conversion with Sharp
- **Document Conversion**: Office files to PDF using Gotenberg
- **Drag & Drop Interface**: Modern UI with neon magenta theme
- **Real-time Progress**: Job queue with live status updates
- **Responsive Design**: Works on desktop and mobile

## Quick Start

1. **Prerequisites**:
   - Node.js 18+
   - Redis (install via `brew install redis` on macOS)
   - FFmpeg (install via `brew install ffmpeg` on macOS)

2. **Setup and run**:
   ```bash
   # Install dependencies and setup environment
   npm run setup
   
   # Start Redis (if not running)
   brew services start redis
   
   # Start both frontend and API
   npm run dev
   ```

3. **Access the app**:
   - Frontend: http://localhost:4003
   - API: http://localhost:3001

## Architecture

- **Frontend**: Next.js 14 + TailwindCSS + TypeScript
- **Backend**: Express + Node.js 20
- **Queue**: BullMQ + Redis
- **Conversion Engines**:
  - FFmpeg (video/audio)
  - Sharp (images)
  - Gotenberg (documents)

## Development

```bash
# Install dependencies
npm install

# Build shared package
npm run build:shared

# Start development servers (runs both API and web)
npm run dev

# Or start individually:
npm run dev:api   # API server on port 3001
npm run dev:web   # Next.js on port 4003

# Build for production
npm run build
```

## Supported Conversions

- **Video**: MP4, AVI, MOV, MKV, WebM (via FFmpeg)
- **Audio**: MP3, WAV, FLAC, AAC, OGG (via FFmpeg)
- **Images**: JPEG, PNG, WebP, AVIF, TIFF (via Sharp)
- **Documents**: Basic file operations (extensible for LibreOffice/Pandoc)

## Project Structure

```
magenta-converter/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── packages/
│   └── shared/       # Shared TypeScript types
└── data/
    └── storage/      # File storage
```

## License

MIT
