'use client'

import { useState } from 'react'
import { FileUploader } from '@/components/FileUploader'
import { ConversionPanel } from '@/components/ConversionPanel'
import { JobStatus } from '@/components/JobStatus'
import { ConversionJob } from '@magenta-converter/shared'

export default function Home() {
  const [currentJob, setCurrentJob] = useState<ConversionJob | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setCurrentJob(null)
  }

  const handleConversionStart = (job: ConversionJob) => {
    setCurrentJob(job)
  }

  const handleJobComplete = () => {
    setUploadedFile(null)
    setCurrentJob(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="neon-text animate-glow">Convert</span>{' '}
            <span className="text-white">Anything</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Drop any media file and convert it to your desired format. 
            Video, audio, images, and documents - all supported.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload */}
          <div className="lg:col-span-2">
            <FileUploader 
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
            />
          </div>

          {/* Conversion Options */}
          <div className="space-y-6">
            <ConversionPanel 
              uploadedFile={uploadedFile}
              onConversionStart={handleConversionStart}
            />
            
            {currentJob && (
              <JobStatus 
                job={currentJob}
                onComplete={handleJobComplete}
              />
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {[
            {
              title: 'Video',
              description: 'MP4, AVI, MOV, MKV, WebM',
              icon: '🎬',
            },
            {
              title: 'Audio',
              description: 'MP3, WAV, FLAC, AAC, OGG',
              icon: '🎵',
            },
            {
              title: 'Images',
              description: 'JPEG, PNG, WebP, AVIF, TIFF',
              icon: '🖼️',
            },
            {
              title: 'Documents',
              description: 'PDF, DOCX, XLSX, PPTX',
              icon: '📄',
            },
          ].map((feature, index) => (
            <div key={index} className="glass-panel-hover p-6 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 neon-text">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
