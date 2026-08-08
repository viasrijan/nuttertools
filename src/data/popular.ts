import toolsData from './tools.json'

export const POPULAR_TOOL_IDS: string[] = [
  'qr-generator',
  'image-compressor',
  'password-generator',
  'image-resizer',
  'merge-pdf',
  'word-counter',
  'json-formatter',
  'compress-pdf',
  'color-picker',
  'video-to-mp3',
  'images-to-pdf',
  'pdf-to-word',
  'bg-remover',
  'image-ocr',
  'video-to-gif',
  'hash-generator',
  'base64-tool',
  'case-converter',
  'lorem-generator',
  'unit-converter',
  'split-pdf',
  'excel-to-pdf',
  'video-compressor',
  'audio-converter',
  'url-encoder',
  'uuid-generator',
  'bcrypt-tool',
  'jwt-tool',
  'text-reverser',
  'slug-generator',
  'tip-calculator',
  'bmi-calculator',
  'age-calc',
  'random-number',
  'percent-calc',
  'pomodoro',
]

const RANK = new Map(POPULAR_TOOL_IDS.map((id, i) => [id, i]))

export const POPULAR_TOOLS = (toolsData as any[])
  .filter((t) => RANK.has(t.id))
  .sort((a, b) => RANK.get(a.id)! - RANK.get(b.id)!)
