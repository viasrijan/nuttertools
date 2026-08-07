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

export const popularToolsForGroup = (groupCategories: { name: string }[]) => {
  const names = new Set(groupCategories.map((c) => c.name))
  const inGroup = (toolsData as any[]).filter((t) => names.has(t.category))
  return inGroup
    .sort((a, b) => {
      const ra = RANK.get(a.id)
      const rb = RANK.get(b.id)
      if (ra === undefined && rb === undefined) return a.name.localeCompare(b.name)
      if (ra === undefined) return 1
      if (rb === undefined) return -1
      return ra - rb
    })
    .slice(0, 6)
}
