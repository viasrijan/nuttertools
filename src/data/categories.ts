import toolsData from './tools.json'

export type Category = {
  slug: string
  name: string
  group: string
  icon: string
  blurb: string
  count: number
}

export type Group = {
  id: string
  label: string
  categories: Category[]
}

const CATEGORY_META: Omit<Category, 'count'>[] = [
  { slug: 'image-tools', name: 'Image Tools', group: 'images', icon: '🖼️', blurb: 'Compress, convert, resize and enhance images' },
  { slug: 'pdf-tools', name: 'PDF Tools', group: 'documents', icon: '📄', blurb: 'Merge, split, compress and edit PDFs' },
  { slug: 'developer-tools', name: 'Developer Tools', group: 'developer', icon: '💻', blurb: 'Format, validate and generate code' },
  { slug: 'encoding-security', name: 'Encoding & Security', group: 'developer', icon: '🔐', blurb: 'Encode, hash and protect your data' },
  { slug: 'text-writing', name: 'Text & Writing', group: 'textweb', icon: '✍️', blurb: 'Count, rewrite, summarize and polish text' },
  { slug: 'color-design', name: 'Color & Design', group: 'images', icon: '🎨', blurb: 'Palettes, gradients and design assets' },
  { slug: 'video-tools', name: 'Video Tools', group: 'media', icon: '🎬', blurb: 'Compress, convert and edit video' },
  { slug: 'audio-tools', name: 'Audio Tools', group: 'media', icon: '🎧', blurb: 'Convert, trim and transcribe audio' },
  { slug: 'file-tools', name: 'File Tools', group: 'documents', icon: '📦', blurb: 'Convert, archive and manage files' },
  { slug: 'web-seo', name: 'Web & SEO', group: 'textweb', icon: '🌐', blurb: 'Meta tags, URLs and site helpers' },
  { slug: 'everyday-utilities', name: 'Everyday Utilities', group: 'everyday', icon: '🛠️', blurb: 'Calculators, converters and daily tools' },
  { slug: 'ai-tools', name: 'AI Tools', group: 'everyday', icon: '🤖', blurb: 'Smart helpers for everyday tasks' },
]

const toolCount = (name: string) =>
  (toolsData as any[]).filter((t) => t.category === name).length

export const CATEGORIES: Category[] = CATEGORY_META.map((c) => ({ ...c, count: toolCount(c.name) }))

const GROUP_DEFS: { id: string; label: string; slugs: string[] }[] = [
  { id: 'images', label: 'Images & Design', slugs: ['image-tools', 'color-design'] },
  { id: 'documents', label: 'Documents & PDF', slugs: ['pdf-tools', 'file-tools'] },
  { id: 'developer', label: 'Developer', slugs: ['developer-tools', 'encoding-security'] },
  { id: 'media', label: 'Media', slugs: ['video-tools', 'audio-tools'] },
  { id: 'textweb', label: 'Text & Web', slugs: ['text-writing', 'web-seo'] },
  { id: 'everyday', label: 'Everyday & AI', slugs: ['everyday-utilities', 'ai-tools'] },
]

export const GROUPS: Group[] = GROUP_DEFS.map((g) => ({
  id: g.id,
  label: g.label,
  categories: CATEGORIES.filter((c) => g.slugs.includes(c.slug)),
}))

export const TOTAL_TOOLS = (toolsData as any[]).length
