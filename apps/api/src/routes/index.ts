import { Express } from 'express'
import { conversionRoutes } from './conversion'
import { jobRoutes } from './jobs'
import { fileRoutes } from './files'

export function setupRoutes(app: Express) {
  // API routes
  app.use('/convert', conversionRoutes)
  app.use('/jobs', jobRoutes)
  app.use('/files', fileRoutes)

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    })
  })

  // Error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('API Error:', err)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  })
}
