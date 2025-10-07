'use client'

import { useState, useEffect, useCallback } from 'react'
import { ConversionJob } from '@magenta-converter/shared'
import { getJobStatus } from '@/lib/api'

export function useJobPolling(initialJob: ConversionJob | null) {
  const [job, setJob] = useState<ConversionJob | null>(initialJob)
  const [isPolling, setIsPolling] = useState(false)

  const startPolling = useCallback((jobToTrack: ConversionJob) => {
    setJob(jobToTrack)
    setIsPolling(true)
  }, [])

  const stopPolling = useCallback(() => {
    setIsPolling(false)
    setJob(null)
  }, [])

  useEffect(() => {
    if (!job || !isPolling) return

    const pollJob = async () => {
      try {
        const updatedJob = await getJobStatus(job.id)
        setJob(updatedJob)

        // Stop polling if job is completed or failed
        if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
          setIsPolling(false)
        }
      } catch (error) {
        console.error('Failed to poll job status:', error)
      }
    }

    // Poll immediately, then every second
    pollJob()
    const interval = setInterval(pollJob, 1000)

    return () => clearInterval(interval)
  }, [job?.id, isPolling])

  return {
    job,
    isPolling,
    startPolling,
    stopPolling,
  }
}
