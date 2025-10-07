import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { addConversionJob } from '../queue'
import { ApiResponse, FileUploadResponse } from '@magenta-converter/shared'

const router = Router()

// Ensure storage directory exists
const storageDir = path.join(__dirname, '../../storage')
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now
    cb(null, true)
  }
})

// Main conversion endpoint
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    const { targetFormat, type } = req.body

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      } as ApiResponse)
    }

    if (!targetFormat || !type) {
      return res.status(400).json({
        success: false,
        error: 'Missing targetFormat or type'
      } as ApiResponse)
    }

    // Create conversion job
    const jobId = uuidv4()
    const job = await addConversionJob({
      id: jobId,
      type: type as any,
      inputFile: file.filename,
      targetFormat,
      originalName: file.originalname,
      filePath: file.path
    })

    res.json({
      success: true,
      data: {
        jobId,
        filename: file.originalname,
        size: file.size,
        type: file.mimetype
      } as FileUploadResponse
    } as ApiResponse<FileUploadResponse>)

  } catch (error) {
    console.error('Conversion error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to start conversion'
    } as ApiResponse)
  }
})

// Legacy endpoints for specific conversion types
router.post('/media', upload.single('file'), async (req, res, next) => {
  req.body.type = req.body.type || 'video'
  return router.stack[0].handle(req, res, next)
})

router.post('/image', upload.single('file'), async (req, res, next) => {
  req.body.type = 'image'
  return router.stack[0].handle(req, res, next)
})

router.post('/document', upload.single('file'), async (req, res, next) => {
  req.body.type = 'document'
  return router.stack[0].handle(req, res, next)
})

export { router as conversionRoutes }
