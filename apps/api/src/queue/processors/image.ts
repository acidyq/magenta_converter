import sharp from 'sharp'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function processImageConversion(
  inputPath: string,
  targetFormat: string
): Promise<string> {
  const outputFilename = `${uuidv4()}.${targetFormat}`
  const outputPath = path.join(path.dirname(inputPath), outputFilename)

  try {
    let sharpInstance = sharp(inputPath)

    // Configure output based on target format
    switch (targetFormat.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: 90 })
        break
      case 'png':
        sharpInstance = sharpInstance.png({ compressionLevel: 6 })
        break
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: 90 })
        break
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality: 90 })
        break
      case 'tiff':
        sharpInstance = sharpInstance.tiff({ compression: 'lzw' })
        break
      case 'bmp':
        // Sharp doesn't support BMP output directly, use PNG instead
        sharpInstance = sharpInstance.png()
        break
      case 'gif':
        // Sharp doesn't support GIF output, so we'll use PNG instead
        sharpInstance = sharpInstance.png()
        break
      default:
        throw new Error(`Unsupported image format: ${targetFormat}`)
    }

    await sharpInstance.toFile(outputPath)
    return outputFilename

  } catch (error) {
    console.error('Sharp conversion error:', error)
    throw new Error(`Image conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
