'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  uploadedFile: File | null
}

export function FileUploader({ onFileUpload, uploadedFile }: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0])
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const removeFile = () => {
    onFileUpload(null as any)
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              {...getRootProps()}
              className={`drag-zone p-12 text-center cursor-pointer ${
                isDragActive ? 'drag-active' : ''
              }`}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={{ scale: isDragActive ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="mx-auto w-16 h-16 bg-magenta-500/20 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-magenta-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {isDragActive ? 'Drop your file here' : 'Drop or browse files'}
                  </h3>
                  <p className="text-gray-400">
                    Support for video, audio, images, and documents
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Maximum file size: 500MB
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-magenta-500/20 rounded-lg flex items-center justify-center">
                    <File className="w-6 h-6 text-magenta-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{uploadedFile.name}</h4>
                    <p className="text-sm text-gray-400">
                      {formatFileSize(uploadedFile.size)} • {uploadedFile.type || 'Unknown type'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
