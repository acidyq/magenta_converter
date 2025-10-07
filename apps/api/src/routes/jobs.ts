import { Router } from 'express'
import { getJobStatus, getAllJobs } from '../queue'
import { ApiResponse, ConversionJob } from '@magenta-converter/shared'

const router = Router()

// Get specific job status
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const job = await getJobStatus(id)

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      } as ApiResponse)
    }

    res.json({
      success: true,
      data: job
    } as ApiResponse<ConversionJob>)

  } catch (error) {
    console.error('Job status error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get job status'
    } as ApiResponse)
  }
})

// Get all jobs (for admin/debugging)
router.get('/', async (req, res) => {
  try {
    const jobs = await getAllJobs()
    
    res.json({
      success: true,
      data: jobs
    } as ApiResponse<ConversionJob[]>)

  } catch (error) {
    console.error('Jobs list error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get jobs'
    } as ApiResponse)
  }
})

export { router as jobRoutes }
