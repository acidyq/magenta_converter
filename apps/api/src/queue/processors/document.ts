import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import PDFDocument from 'pdfkit'
import removeMarkdown from 'remove-markdown'

const markdownExtensions = new Set(['.md', '.markdown'])
const textLikeExtensions = new Set(['.txt', '.text', '.md', '.markdown'])

const createPdfFromText = async (inputPath: string, outputPath: string, isMarkdown: boolean) => {
  const rawContent = await fs.promises.readFile(inputPath, 'utf-8')

  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 56 })
    const stream = fs.createWriteStream(outputPath)

    stream.on('finish', () => resolve())
    stream.on('error', (err: Error) => reject(err))
    doc.on('error', (err: Error) => reject(err))

    doc.pipe(stream)

    const lines = rawContent.split(/\r?\n/)
    let inCodeBlock = false

    const resetBodyFont = () => {
      doc.font('Helvetica').fontSize(12).fillColor('#1f1f29')
    }

    resetBodyFont()

    lines.forEach((line) => {
      const trimmed = line.trim()

      if (/^```/.test(trimmed)) {
        inCodeBlock = !inCodeBlock
        if (inCodeBlock) {
          doc.moveDown(0.45)
          doc.font('Courier').fontSize(11).fillColor('#ff00cc')
        } else {
          doc.moveDown(0.45)
          resetBodyFont()
        }
        return
      }

      if (inCodeBlock) {
        doc.text(line.length ? line : ' ', { continued: false })
        return
      }

      if (trimmed.length === 0) {
        doc.moveDown(0.4)
        return
      }

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const headingText = headingMatch[2]
        const size = Math.max(16, 26 - level * 2)
        doc.moveDown(level === 1 ? 0.8 : 0.6)
        doc.font('Helvetica-Bold').fontSize(size).fillColor('#ff00cc').text(removeMarkdown(headingText))
        doc.moveDown(0.25)
        resetBodyFont()
        return
      }

      const listMatch = line.match(/^\s*([-*+]|\d+\.)\s+(.*)/)
      if (listMatch) {
        const listText = removeMarkdown(listMatch[2])
        doc.circle(doc.x - 10, doc.y + 5, 2).fill('#ff00cc')
        resetBodyFont()
        doc.text(listText, { indent: 8 })
        return
      }

      const paragraph = isMarkdown ? removeMarkdown(line, { stripListLeaders: false, useImgAltText: false }) : line
      doc.text(paragraph)
    })

    doc.end()
  })
}

export async function processDocumentConversion(
  inputPath: string,
  targetFormat: string
): Promise<string> {
  const outputFilename = `${uuidv4()}.${targetFormat}`
  const outputPath = path.join(path.dirname(inputPath), outputFilename)

  try {
    const inputExt = path.extname(inputPath).toLowerCase()
    const normalizedTarget = targetFormat.toLowerCase()

    if (inputExt === `.${normalizedTarget}`) {
      fs.copyFileSync(inputPath, outputPath)
      return outputFilename
    }

    if (normalizedTarget === 'pdf') {
      if (inputExt === '.pdf') {
        fs.copyFileSync(inputPath, outputPath)
        return outputFilename
      }

      if (textLikeExtensions.has(inputExt)) {
        await createPdfFromText(inputPath, outputPath, markdownExtensions.has(inputExt))
        return outputFilename
      }

      throw new Error(`Document conversion from ${inputExt} to PDF is not supported. Supported sources: Markdown (.md, .markdown) and plain text (.txt).`)
    }

    throw new Error(`Document conversion to ${targetFormat} is not implemented yet.`)

  } catch (error) {
    console.error('Document conversion error:', error)
    throw new Error(`Document conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
