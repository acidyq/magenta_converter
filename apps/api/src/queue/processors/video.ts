import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function processVideoConversion(
  inputPath: string,
  targetFormat: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputFilename = `${uuidv4()}.${targetFormat}`
    const outputPath = path.join(path.dirname(inputPath), outputFilename)

    const command = ffmpeg(inputPath)
      .output(outputPath)
      .format(targetFormat)

    // Set codec and quality based on format
    switch (targetFormat.toLowerCase()) {
      case 'mp4':
        command.videoCodec('libx264').audioCodec('aac')
        break
      case 'webm':
        command.videoCodec('libvpx-vp9').audioCodec('libopus')
        break
      case 'avi':
        command.videoCodec('libx264').audioCodec('mp3')
        break
      case 'mov':
        command.videoCodec('libx264').audioCodec('aac')
        break
      case 'mkv':
        command.videoCodec('libx264').audioCodec('aac')
        break
      default:
        // Use default codecs
        break
    }

    // Add progress tracking
    command.on('progress', (progress) => {
      const percent = Math.round(progress.percent || 0)
      onProgress?.(percent)
    })

    command.on('end', () => {
      resolve(outputFilename)
    })

    command.on('error', (err) => {
      console.error('FFmpeg error:', err)
      reject(new Error(`Video conversion failed: ${err.message}`))
    })

    command.run()
  })
}
