'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Download, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { ConversionJob } from '@magenta-converter/shared'
import { getJobStatus, getDownloadUrl } from '@/lib/api'

interface JobStatusProps {
  job: ConversionJob
  onComplete: () => void
}

export function JobStatus({ job, onComplete }: JobStatusProps) {
  const [currentJob, setCurrentJob] = useState<ConversionJob>(job)

  useEffect(() => {
    const pollJobStatus = async () => {
      try {
        const updatedJob = await getJobStatus(job.id)
        setCurrentJob(updatedJob)
        
        if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
          // Stop polling
          return
        }
      } catch (error) {
        console.error('Failed to poll job status:', error)
      }
    }

    const interval = setInterval(pollJobStatus, 1000)
    return () => clearInterval(interval)
  }, [job.id])

  const getStatusIcon = () => {
    switch (currentJob.status) {
      case 'pending':
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-magenta-500 animate-spin" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
    }
  }

  const getStatusText = () => {
    switch (currentJob.status) {
      case 'pending':
        return 'Queued for processing...'
      case 'processing':
        return 'Converting your file...'
      case 'completed':
        return 'Conversion completed!'
      case 'failed':
        return 'Conversion failed'
      default:
        return 'Processing...'
    }
  }

  const handleDownload = async () => {
    if (currentJob.outputFile) {
      const url = getDownloadUrl(currentJob.outputFile)

      const opened = window.open(url, '_blank', 'noopener,noreferrer')

      if (!opened) {
        const link = document.createElement('a')
        link.href = url
        link.download = currentJob.outputFile
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      onComplete()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <div className="space-y-4">
        {/* Status Header */}
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <h4 className="font-semibold text-white">{getStatusText()}</h4>
            <p className="text-sm text-gray-400">
              {currentJob.inputFile} → .{currentJob.targetFormat}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {currentJob.status === 'processing' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-magenta-500">{currentJob.progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="bg-magenta-500 h-2 rounded-full shadow-neon"
                initial={{ width: 0 }}
                animate={{ width: `${currentJob.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {currentJob.status === 'failed' && currentJob.error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{currentJob.error}</p>
          </div>
        )}

        {/* Download Button */}
        {currentJob.status === 'completed' && (
          <motion.button
            onClick={handleDownload}
            className="w-full neon-button"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Converted File</span>
            </div>
          </motion.button>
        )}

        {/* Retry Button */}
        {currentJob.status === 'failed' && (
          <button
            onClick={onComplete}
            className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  )
}
