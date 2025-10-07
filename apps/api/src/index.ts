import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { setupRoutes } from './routes'
import { setupQueue } from './queue'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from storage
app.use('/files', express.static(path.join(__dirname, '../storage')))

// Health check
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Setup routes
setupRoutes(app)

// Start server first, then setup queue
app.listen(PORT, () => {
  console.log(`🚀 Magenta Converter API running on port ${PORT}`)
  console.log(`📁 Storage directory: ${path.join(__dirname, '../storage')}`)

  // Setup queue after server is listening
  setupQueue().catch(error => {
    console.error('Failed to setup queue:', error)
  })
})
