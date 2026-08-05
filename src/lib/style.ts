export type Hue =
  | 'sky' | 'rose' | 'indigo' | 'emerald' | 'amber' | 'fuchsia'
  | 'purple' | 'cyan' | 'lime' | 'teal' | 'orange' | 'violet'

export type HueDef = {
  tile: string
  tileDark: string
  chip: string
  soft: string
  text: string
  cardRing: string
}

const H: Record<Hue, HueDef> = {
  sky: {
    tile: 'bg-sky-600 text-white',
    tileDark: 'dark:from-sky-500/25 dark:to-blue-500/25 dark:ring-1 dark:ring-sky-400/30',
    chip: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30',
    soft: 'bg-sky-50 dark:bg-sky-500/10',
    text: 'text-sky-600 dark:text-sky-400',
    cardRing: 'hover:ring-sky-300 dark:hover:ring-sky-600',
  },
  rose: {
    tile: 'bg-rose-700 text-white',
    tileDark: 'dark:from-rose-500/25 dark:to-red-500/25 dark:ring-1 dark:ring-rose-400/30',
    chip: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
    soft: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    cardRing: 'hover:ring-rose-300 dark:hover:ring-rose-600',
  },
  indigo: {
    tile: 'bg-indigo-700 text-white',
    tileDark: 'dark:from-indigo-500/25 dark:to-violet-500/25 dark:ring-1 dark:ring-indigo-400/30',
    chip: 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30',
    soft: 'bg-indigo-50 dark:bg-indigo-500/10',
    text: 'text-indigo-600 dark:text-indigo-400',
    cardRing: 'hover:ring-indigo-300 dark:hover:ring-indigo-600',
  },
  emerald: {
    tile: 'bg-emerald-700 text-white',
    tileDark: 'dark:from-emerald-500/25 dark:to-teal-500/25 dark:ring-1 dark:ring-emerald-400/30',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    soft: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    cardRing: 'hover:ring-emerald-300 dark:hover:ring-emerald-600',
  },
  amber: {
    tile: 'bg-amber-600 text-white',
    tileDark: 'dark:from-amber-500/25 dark:to-orange-500/25 dark:ring-1 dark:ring-amber-400/30',
    chip: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    soft: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    cardRing: 'hover:ring-amber-300 dark:hover:ring-amber-600',
  },
  fuchsia: {
    tile: 'bg-fuchsia-700 text-white',
    tileDark: 'dark:from-fuchsia-500/25 dark:to-pink-500/25 dark:ring-1 dark:ring-fuchsia-400/30',
    chip: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-300 dark:ring-fuchsia-500/30',
    soft: 'bg-fuchsia-50 dark:bg-fuchsia-500/10',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    cardRing: 'hover:ring-fuchsia-300 dark:hover:ring-fuchsia-600',
  },
  purple: {
    tile: 'bg-purple-700 text-white',
    tileDark: 'dark:from-purple-500/25 dark:to-violet-500/25 dark:ring-1 dark:ring-purple-400/30',
    chip: 'bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-500/30',
    soft: 'bg-purple-50 dark:bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    cardRing: 'hover:ring-purple-300 dark:hover:ring-purple-600',
  },
  cyan: {
    tile: 'bg-cyan-700 text-white',
    tileDark: 'dark:from-cyan-500/25 dark:to-sky-500/25 dark:ring-1 dark:ring-cyan-400/30',
    chip: 'bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/30',
    soft: 'bg-cyan-50 dark:bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-400',
    cardRing: 'hover:ring-cyan-300 dark:hover:ring-cyan-600',
  },
  lime: {
    tile: 'bg-lime-700 text-white',
    tileDark: 'dark:from-lime-500/25 dark:to-green-500/25 dark:ring-1 dark:ring-lime-400/30',
    chip: 'bg-lime-50 text-lime-700 ring-lime-200 dark:bg-lime-500/10 dark:text-lime-300 dark:ring-lime-500/30',
    soft: 'bg-lime-50 dark:bg-lime-500/10',
    text: 'text-lime-600 dark:text-lime-400',
    cardRing: 'hover:ring-lime-300 dark:hover:ring-lime-600',
  },
  teal: {
    tile: 'bg-teal-700 text-white',
    tileDark: 'dark:from-teal-500/25 dark:to-cyan-500/25 dark:ring-1 dark:ring-teal-400/30',
    chip: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-500/30',
    soft: 'bg-teal-50 dark:bg-teal-500/10',
    text: 'text-teal-600 dark:text-teal-400',
    cardRing: 'hover:ring-teal-300 dark:hover:ring-teal-600',
  },
  orange: {
    tile: 'bg-orange-700 text-white',
    tileDark: 'dark:from-orange-500/25 dark:to-amber-500/25 dark:ring-1 dark:ring-orange-400/30',
    chip: 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30',
    soft: 'bg-orange-50 dark:bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    cardRing: 'hover:ring-orange-300 dark:hover:ring-orange-600',
  },
  violet: {
    tile: 'bg-violet-700 text-white',
    tileDark: 'dark:from-violet-500/25 dark:to-purple-500/25 dark:ring-1 dark:ring-violet-400/30',
    chip: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30',
    soft: 'bg-violet-50 dark:bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    cardRing: 'hover:ring-violet-300 dark:hover:ring-violet-600',
  },
}

export const hueFor = (category: string): Hue => {
  const map: Record<string, Hue> = {
    'Image Tools': 'sky',
    'PDF Tools': 'rose',
    'Developer Tools': 'indigo',
    'Encoding & Security': 'emerald',
    'Text & Writing': 'amber',
    'Color & Design': 'fuchsia',
    'Video Tools': 'purple',
    'Audio Tools': 'cyan',
    'File Tools': 'lime',
    'Web & SEO': 'teal',
    'Everyday Utilities': 'orange',
    'AI Tools': 'violet',
  }
  return map[category] || 'indigo'
}

export const tile = (h: Hue) => `bg-gradient-to-br ${H[h].tile} ${H[h].tileDark}`

export const chip = (h: Hue) => `bg-white ring-1 ring-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:ring-zinc-800 dark:text-zinc-400 hover:ring-zinc-300 dark:hover:ring-zinc-700`

export const chipActive = (h: Hue) => `bg-gradient-to-br ${H[h].tile} ${H[h].tileDark} ring-1 ring-transparent`

export const textAccent = (h: Hue) => H[h].text

export const cardRing = (h: Hue) => H[h].cardRing
