import { Queue, Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import { ConversionJob } from '@magenta-converter/shared'
import { processVideoConversion } from './processors/video'
import { processAudioConversion } from './processors/audio'
import { processImageConversion } from './processors/image'
import { processDocumentConversion } from './processors/document'

let redisConnection: Redis | null = null
let conversionQueue: Queue | null = null

function getRedisConnection() {
  if (!redisConnection) {
    redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
    })
  }
  return redisConnection
}

function getQueue() {
  if (!conversionQueue) {
    conversionQueue = new Queue('conversion', { connection: getRedisConnection() })
  }
  return conversionQueue
}

// Job storage (in production, use a proper database)
const jobs = new Map<string, ConversionJob>()

export interface ConversionJobData {
  id: string
  type: 'video' | 'audio' | 'image' | 'document'
  inputFile: string
  targetFormat: string
  originalName: string
  filePath: string
}

export async function setupQueue() {
  // Create worker to process conversion jobs
  const worker = new Worker('conversion', async (job: Job<ConversionJobData>) => {
    const { id, type, inputFile, targetFormat, filePath } = job.data
    
    // Update job status to processing
    const conversionJob = jobs.get(id)
    if (conversionJob) {
      conversionJob.status = 'processing'
      conversionJob.updatedAt = new Date()
      jobs.set(id, conversionJob)
    }

    try {
      let outputFile: string

      // Process based on file type
      switch (type) {
        case 'video':
          outputFile = await processVideoConversion(filePath, targetFormat, (progress) => {
            if (conversionJob) {
              conversionJob.progress = progress
              jobs.set(id, conversionJob)
            }
          })
          break
        case 'audio':
          outputFile = await processAudioConversion(filePath, targetFormat, (progress) => {
            if (conversionJob) {
              conversionJob.progress = progress
              jobs.set(id, conversionJob)
            }
          })
          break
        case 'image':
          outputFile = await processImageConversion(filePath, targetFormat)
          break
        case 'document':
          outputFile = await processDocumentConversion(filePath, targetFormat)
          break
        default:
          throw new Error(`Unsupported conversion type: ${type}`)
      }

      // Update job as completed
      if (conversionJob) {
        conversionJob.status = 'completed'
        conversionJob.progress = 100
        conversionJob.outputFile = outputFile
        conversionJob.updatedAt = new Date()
        jobs.set(id, conversionJob)
      }

      return { outputFile }

    } catch (error) {
      console.error(`Conversion failed for job ${id}:`, error)
      
      // Update job as failed
      if (conversionJob) {
        conversionJob.status = 'failed'
        conversionJob.error = error instanceof Error ? error.message : 'Unknown error'
        conversionJob.updatedAt = new Date()
        jobs.set(id, conversionJob)
      }

      throw error
    }
  }, { connection: getRedisConnection() })

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`)
  })

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message)
  })

  console.log('🔄 Conversion queue worker started')
}

export async function addConversionJob(data: ConversionJobData): Promise<ConversionJob> {
  // Create job record
  const job: ConversionJob = {
    id: data.id,
    status: 'pending',
    type: data.type,
    inputFile: data.originalName,
    targetFormat: data.targetFormat,
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Store job
  jobs.set(data.id, job)

  // Add to queue
  await getQueue().add('convert', data, {
    jobId: data.id,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  })

  return job
}

export async function getJobStatus(id: string): Promise<ConversionJob | null> {
  return jobs.get(id) || null
}

export async function getAllJobs(): Promise<ConversionJob[]> {
  return Array.from(jobs.values())
}
