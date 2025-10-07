import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileType(file: File): 'video' | 'audio' | 'image' | 'document' {
  const type = file.type.toLowerCase()
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  if (type.startsWith('image/')) return 'image'
  return 'document'
}

export function getFileIcon(type: string): string {
  switch (type) {
    case 'video':
      return '🎬'
    case 'audio':
      return '🎵'
    case 'image':
      return '🖼️'
    case 'document':
      return '📄'
    default:
      return '📁'
  }
}
