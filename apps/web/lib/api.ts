import { ApiResponse, ConversionJob, FileUploadResponse } from '@magenta-converter/shared'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function uploadAndConvert(
  file: File,
  targetFormat: string,
  type: 'video' | 'audio' | 'image' | 'document'
): Promise<FileUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('targetFormat', targetFormat)
  formData.append('type', type)

  const response = await fetch(`${API_BASE_URL}/convert`, {
    method: 'POST',
    body: formData,
  })

  const result: ApiResponse<FileUploadResponse> = await response.json()

  if (!result.success) {
    throw new Error(result.error || 'Upload failed')
  }

  return result.data!
}

export async function getJobStatus(jobId: string): Promise<ConversionJob> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`)
  const result: ApiResponse<ConversionJob> = await response.json()

  if (!result.success) {
    throw new Error(result.error || 'Failed to get job status')
  }

  return result.data!
}

export async function getAllJobs(): Promise<ConversionJob[]> {
  const response = await fetch(`${API_BASE_URL}/jobs`)
  const result: ApiResponse<ConversionJob[]> = await response.json()

  if (!result.success) {
    throw new Error(result.error || 'Failed to get jobs')
  }

  return result.data!
}

export function getDownloadUrl(filename: string): string {
  return `${API_BASE_URL}/files/${filename}`
}
