import { Router } from 'express'
import path from 'path'
import fs from 'fs'
import { ApiResponse } from '@magenta-converter/shared'

const router = Router()

// Serve converted files for download
router.get('/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(__dirname, '../../storage', filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      } as ApiResponse)
    }

    // Get file stats
    const stats = fs.statSync(filePath)
    
    // Set appropriate headers
    res.setHeader('Content-Length', stats.size)
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase()
    const contentTypes: { [key: string]: string } = {
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.mkv': 'video/x-matroska',
      '.webm': 'video/webm',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.flac': 'audio/flac',
      '.aac': 'audio/aac',
      '.ogg': 'audio/ogg',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.tiff': 'image/tiff',
      '.pdf': 'application/pdf',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }

    const contentType = contentTypes[ext] || 'application/octet-stream'
    res.setHeader('Content-Type', contentType)

    // Stream the file
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)

  } catch (error) {
    console.error('File serve error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to serve file'
    } as ApiResponse)
  }
})

export { router as fileRoutes }
