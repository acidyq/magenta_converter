import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function processAudioConversion(
  inputPath: string,
  targetFormat: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputFilename = `${uuidv4()}.${targetFormat}`
    const outputPath = path.join(path.dirname(inputPath), outputFilename)

    const normalizedFormat = targetFormat.toLowerCase()

    let containerFormat = normalizedFormat

    const command = ffmpeg(inputPath)
      .output(outputPath)
      .noVideo() // Audio only

    // Set codec and quality based on format
    switch (normalizedFormat) {
      case 'mp3':
        containerFormat = 'mp3'
        command.audioCodec('libmp3lame').audioBitrate('192k')
        break
      case 'wav':
        containerFormat = 'wav'
        command.audioCodec('pcm_s16le')
        break
      case 'flac':
        containerFormat = 'flac'
        command.audioCodec('flac')
        break
      case 'aac':
        containerFormat = 'adts'
        command.audioCodec('aac').audioBitrate('192k')
        break
      case 'ogg':
        containerFormat = 'ogg'
        command.audioCodec('libvorbis').audioBitrate('192k')
        break
      case 'm4a':
        containerFormat = 'ipod'
        command.audioCodec('aac').audioBitrate('192k')
        command.outputOptions('-movflags', 'use_metadata_tags')
        break
      case 'wma':
        containerFormat = 'asf'
        command.audioCodec('wmav2').audioBitrate('192k')
        break
      default:
        // Use default codec
        break
    }

    command.format(containerFormat)

    // Add progress tracking
    command.on('progress', (progress) => {
      const percent = Math.round(progress.percent || 0)
      onProgress?.(percent)
    })

    command.on('end', () => {
      resolve(outputFilename)
    })

    command.on('error', (err) => {
      console.error('FFmpeg audio error:', err)
      reject(new Error(`Audio conversion failed: ${err.message}`))
    })

    command.run()
  })
}
