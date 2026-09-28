import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const source = path.resolve('public/images/companies')
const output = path.join(source, 'display')
await mkdir(output, { recursive: true })

const logos = (await readdir(source)).filter((name) => name.endsWith('.webp')).sort()
for (const name of logos) {
  const input = path.join(source, name)
  const target = path.join(output, name)
  try {
    await sharp(input)
      .flatten({ background: '#fffdfa' })
      .trim({ background: '#fffdfa', threshold: 12 })
      .resize(190, 90, { fit: 'contain', background: '#fffdfa', kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 94, effort: 5 })
      .toFile(target)
  } catch (error) {
    throw new Error(`Could not prepare company logo ${name}: ${error instanceof Error ? error.message : String(error)}`)
  }
}
console.log(`Prepared ${logos.length} company display logos`)
