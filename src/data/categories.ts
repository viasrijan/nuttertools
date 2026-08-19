import toolsData from './tools.json'
import type { Hue } from '../lib/style'

export type Category = {
  slug: string
  name: string
  group: string
  icon: string
  blurb: string
  count: number
  hue: Hue
}

export type Group = {
  id: string
  label: string
  categories: Category[]
}

const CATEGORY_META: Omit<Category, 'count'>[] = [
  { slug: 'image-tools', name: 'Image Tools', group: 'images', icon: '🖼️', blurb: 'Compress, convert, resize and enhance images', hue: 'sky' },
  { slug: 'pdf-tools', name: 'PDF Tools', group: 'documents', icon: '📄', blurb: 'Merge, split, compress and edit PDFs', hue: 'rose' },
  { slug: 'developer-tools', name: 'Developer Tools', group: 'developer', icon: '💻', blurb: 'Format, validate and generate code', hue: 'indigo' },
  { slug: 'encoding-security', name: 'Encoding & Security', group: 'developer', icon: '🔐', blurb: 'Encode, hash and protect your data', hue: 'emerald' },
  { slug: 'text-writing', name: 'Text & Writing', group: 'textweb', icon: '✍️', blurb: 'Count, rewrite, summarize and polish text', hue: 'amber' },
  { slug: 'color-design', name: 'Color & Design', group: 'images', icon: '🎨', blurb: 'Palettes, gradients and design assets', hue: 'fuchsia' },
  { slug: 'video-tools', name: 'Video Tools', group: 'media', icon: '🎬', blurb: 'Compress, convert and edit video', hue: 'purple' },
  { slug: 'audio-tools', name: 'Audio Tools', group: 'media', icon: '🎧', blurb: 'Convert, trim and transcribe audio', hue: 'cyan' },
  { slug: 'file-tools', name: 'File Tools', group: 'documents', icon: '📦', blurb: 'Convert, archive and manage files', hue: 'lime' },
  { slug: 'web-seo', name: 'Web & SEO', group: 'textweb', icon: '🌐', blurb: 'Meta tags, URLs and site helpers', hue: 'teal' },
  { slug: 'everyday-utilities', name: 'Everyday Utilities', group: 'everyday', icon: '🛠️', blurb: 'Calculators, converters and daily tools', hue: 'orange' },
  { slug: 'ai-tools', name: 'AI Tools', group: 'everyday', icon: '🤖', blurb: 'Smart helpers for everyday tasks', hue: 'violet' },
  { slug: 'calculators', name: 'Calculators', group: 'everyday', icon: '🧮', blurb: 'Money, math and quick number crunching', hue: 'blue' },
  { slug: 'building-diy', name: 'Building & DIY', group: 'everyday', icon: '🏗️', blurb: 'Material estimates for home projects', hue: 'green' },
  { slug: 'hardware-tech', name: 'Hardware & Tech', group: 'everyday', icon: '🔌', blurb: 'Electronics, wiring and gadget helpers', hue: 'yellow' },
  { slug: 'name-generators', name: 'Name Generators', group: 'everyday', icon: '✨', blurb: 'Random names for characters, bands and more', hue: 'pink' },
]

const toolCount = (name: string) =>
  (toolsData as any[]).filter((t) => t.category === name).length

export const CATEGORIES: Category[] = CATEGORY_META.map((c) => ({ ...c, count: toolCount(c.name) }))

const GROUP_DEFS: { id: string; label: string; slugs: string[] }[] = [
  { id: 'media', label: 'Video & Audio', slugs: ['video-tools', 'audio-tools'] },
  { id: 'documents', label: 'PDF & Docs', slugs: ['pdf-tools', 'file-tools'] },
  { id: 'images', label: 'Images & Design', slugs: ['image-tools', 'color-design'] },
  { id: 'textweb', label: 'Text & Web', slugs: ['text-writing', 'web-seo'] },
  { id: 'developer', label: 'Developer', slugs: ['developer-tools', 'encoding-security'] },
  { id: 'everyday', label: 'Everyday & AI', slugs: ['everyday-utilities', 'ai-tools'] },
]

export const GROUPS: Group[] = GROUP_DEFS.map((g) => ({
  id: g.id,
  label: g.label,
  categories: CATEGORIES.filter((c) => g.slugs.includes(c.slug)),
}))

export const TOTAL_TOOLS = (toolsData as any[]).length
