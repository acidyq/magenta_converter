'use client'

import { useState } from 'react'
import { Settings, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { SUPPORTED_FORMATS, ConversionJob } from '@magenta-converter/shared'
import { uploadAndConvert } from '@/lib/api'
import { getFileType } from '@/lib/utils'

interface ConversionPanelProps {
  uploadedFile: File | null
  onConversionStart: (job: ConversionJob) => void
}

export function ConversionPanel({ uploadedFile, onConversionStart }: ConversionPanelProps) {
  const [selectedType, setSelectedType] = useState<'video' | 'audio' | 'image' | 'document'>('video')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [isConverting, setIsConverting] = useState(false)

  const getFileType = (file: File): 'video' | 'audio' | 'image' | 'document' => {
    const type = file.type.toLowerCase()
    if (type.startsWith('video/')) return 'video'
    if (type.startsWith('audio/')) return 'audio'
    if (type.startsWith('image/')) return 'image'
    return 'document'
  }

  const handleConvert = async () => {
    if (!uploadedFile || !selectedFormat) return

    setIsConverting(true)
    
    try {
      const result = await uploadAndConvert(uploadedFile, selectedFormat, selectedType)
      
      const job: ConversionJob = {
        id: result.jobId,
        status: 'pending',
        type: selectedType,
        inputFile: uploadedFile.name,
        targetFormat: selectedFormat,
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      onConversionStart(job)
    } catch (error) {
      console.error('Conversion failed:', error)
    } finally {
      setIsConverting(false)
    }
  }

  // Auto-detect file type when file is uploaded
  if (uploadedFile && selectedType !== getFileType(uploadedFile)) {
    setSelectedType(getFileType(uploadedFile))
    setSelectedFormat('')
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-5 h-5 text-magenta-500" />
          <h3 className="text-lg font-semibold">Conversion Settings</h3>
        </div>

        {/* File Type Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {(['video', 'audio', 'image', 'document'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type)
                setSelectedFormat('')
              }}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                selectedType === type
                  ? 'bg-magenta-500 text-white shadow-neon'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Format Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Target Format
          </label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500 transition-colors"
            disabled={!uploadedFile}
          >
            <option value="">Select format...</option>
            {SUPPORTED_FORMATS[selectedType].map((format) => (
              <option key={format} value={format} className="bg-gray-800">
                .{format.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Convert Button */}
        <motion.button
          onClick={handleConvert}
          disabled={!uploadedFile || !selectedFormat || isConverting}
          className="w-full mt-6 neon-button disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: uploadedFile && selectedFormat ? 1.02 : 1 }}
          whileTap={{ scale: uploadedFile && selectedFormat ? 0.98 : 1 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Play className="w-4 h-4" />
            <span>
              {isConverting ? 'Converting...' : 'Start Conversion'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Format Info */}
      {selectedType && (
        <div className="glass-panel p-4">
          <h4 className="text-sm font-medium text-magenta-500 mb-2">
            Supported {selectedType} formats:
          </h4>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_FORMATS[selectedType].map((format) => (
              <span
                key={format}
                className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300"
              >
                .{format}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
