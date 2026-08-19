export type Hue =
  | 'sky' | 'rose' | 'indigo' | 'emerald' | 'amber' | 'fuchsia'
  | 'purple' | 'cyan' | 'lime' | 'teal' | 'orange' | 'violet'
  | 'blue' | 'green' | 'yellow' | 'pink'

export type HueDef = {
  tile: string
  tileDark: string
  grad: string
  chip: string
  soft: string
  text: string
  cardRing: string
}

const H: Record<Hue, HueDef> = {
  sky: {
    tile: 'bg-sky-600 text-white',
    tileDark: 'dark:from-sky-500/40 dark:to-blue-500/40 dark:ring-1 dark:ring-sky-400/30',
    grad: 'from-sky-500 to-sky-800',
    chip: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30',
    soft: 'bg-sky-50 dark:bg-sky-500/10',
    text: 'text-sky-600 dark:text-sky-400',
    cardRing: 'hover:ring-sky-300 dark:hover:ring-sky-600',
  },
  rose: {
    tile: 'bg-rose-700 text-white',
    tileDark: 'dark:from-rose-500/40 dark:to-red-500/40 dark:ring-1 dark:ring-rose-400/30',
    grad: 'from-rose-500 to-rose-800',
    chip: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
    soft: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    cardRing: 'hover:ring-rose-300 dark:hover:ring-rose-600',
  },
  indigo: {
    tile: 'bg-indigo-700 text-white',
    tileDark: 'dark:from-indigo-500/40 dark:to-violet-500/40 dark:ring-1 dark:ring-indigo-400/30',
    grad: 'from-indigo-500 to-indigo-800',
    chip: 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30',
    soft: 'bg-indigo-50 dark:bg-indigo-500/10',
    text: 'text-indigo-600 dark:text-indigo-400',
    cardRing: 'hover:ring-indigo-300 dark:hover:ring-indigo-600',
  },
  emerald: {
    tile: 'bg-emerald-700 text-white',
    tileDark: 'dark:from-emerald-500/40 dark:to-teal-500/40 dark:ring-1 dark:ring-emerald-400/30',
    grad: 'from-emerald-500 to-emerald-800',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    soft: 'bg-emerald-50 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    cardRing: 'hover:ring-emerald-300 dark:hover:ring-emerald-600',
  },
  amber: {
    tile: 'bg-amber-600 text-white',
    tileDark: 'dark:from-amber-500/40 dark:to-orange-500/40 dark:ring-1 dark:ring-amber-400/30',
    grad: 'from-amber-500 to-amber-800',
    chip: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    soft: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    cardRing: 'hover:ring-amber-300 dark:hover:ring-amber-600',
  },
  fuchsia: {
    tile: 'bg-fuchsia-700 text-white',
    tileDark: 'dark:from-fuchsia-500/40 dark:to-pink-500/40 dark:ring-1 dark:ring-fuchsia-400/30',
    grad: 'from-fuchsia-500 to-fuchsia-800',
    chip: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-300 dark:ring-fuchsia-500/30',
    soft: 'bg-fuchsia-50 dark:bg-fuchsia-500/10',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    cardRing: 'hover:ring-fuchsia-300 dark:hover:ring-fuchsia-600',
  },
  purple: {
    tile: 'bg-purple-700 text-white',
    tileDark: 'dark:from-purple-500/40 dark:to-violet-500/40 dark:ring-1 dark:ring-purple-400/30',
    grad: 'from-purple-500 to-purple-800',
    chip: 'bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:ring-purple-500/30',
    soft: 'bg-purple-50 dark:bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    cardRing: 'hover:ring-purple-300 dark:hover:ring-purple-600',
  },
  cyan: {
    tile: 'bg-cyan-700 text-white',
    tileDark: 'dark:from-cyan-500/40 dark:to-sky-500/40 dark:ring-1 dark:ring-cyan-400/30',
    grad: 'from-cyan-500 to-cyan-800',
    chip: 'bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:ring-cyan-500/30',
    soft: 'bg-cyan-50 dark:bg-cyan-500/10',
    text: 'text-cyan-600 dark:text-cyan-400',
    cardRing: 'hover:ring-cyan-300 dark:hover:ring-cyan-600',
  },
  lime: {
    tile: 'bg-lime-700 text-white',
    tileDark: 'dark:from-lime-500/40 dark:to-green-500/40 dark:ring-1 dark:ring-lime-400/30',
    grad: 'from-lime-500 to-lime-800',
    chip: 'bg-lime-50 text-lime-700 ring-lime-200 dark:bg-lime-500/10 dark:text-lime-300 dark:ring-lime-500/30',
    soft: 'bg-lime-50 dark:bg-lime-500/10',
    text: 'text-lime-600 dark:text-lime-400',
    cardRing: 'hover:ring-lime-300 dark:hover:ring-lime-600',
  },
  teal: {
    tile: 'bg-teal-700 text-white',
    tileDark: 'dark:from-teal-500/40 dark:to-cyan-500/40 dark:ring-1 dark:ring-teal-400/30',
    grad: 'from-teal-500 to-teal-800',
    chip: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-500/30',
    soft: 'bg-teal-50 dark:bg-teal-500/10',
    text: 'text-teal-600 dark:text-teal-400',
    cardRing: 'hover:ring-teal-300 dark:hover:ring-teal-600',
  },
  orange: {
    tile: 'bg-orange-700 text-white',
    tileDark: 'dark:from-orange-500/40 dark:to-amber-500/40 dark:ring-1 dark:ring-orange-400/30',
    grad: 'from-orange-500 to-orange-800',
    chip: 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30',
    soft: 'bg-orange-50 dark:bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    cardRing: 'hover:ring-orange-300 dark:hover:ring-orange-600',
  },
  violet: {
    tile: 'bg-violet-700 text-white',
    tileDark: 'dark:from-violet-500/40 dark:to-purple-500/40 dark:ring-1 dark:ring-violet-400/30',
    grad: 'from-violet-500 to-violet-800',
    chip: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30',
    soft: 'bg-violet-50 dark:bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    cardRing: 'hover:ring-violet-300 dark:hover:ring-violet-600',
  },
  blue: {
    tile: 'bg-blue-700 text-white',
    tileDark: 'dark:from-blue-500/40 dark:to-indigo-500/40 dark:ring-1 dark:ring-blue-400/30',
    grad: 'from-blue-500 to-blue-800',
    chip: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30',
    soft: 'bg-blue-50 dark:bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    cardRing: 'hover:ring-blue-300 dark:hover:ring-blue-600',
  },
  green: {
    tile: 'bg-green-700 text-white',
    tileDark: 'dark:from-green-500/40 dark:to-emerald-500/40 dark:ring-1 dark:ring-green-400/30',
    grad: 'from-green-500 to-green-800',
    chip: 'bg-green-50 text-green-700 ring-green-200 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-500/30',
    soft: 'bg-green-50 dark:bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    cardRing: 'hover:ring-green-300 dark:hover:ring-green-600',
  },
  yellow: {
    tile: 'bg-yellow-700 text-white',
    tileDark: 'dark:from-yellow-500/40 dark:to-amber-500/40 dark:ring-1 dark:ring-yellow-400/30',
    grad: 'from-yellow-500 to-yellow-800',
    chip: 'bg-yellow-50 text-yellow-700 ring-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-300 dark:ring-yellow-500/30',
    soft: 'bg-yellow-50 dark:bg-yellow-500/10',
    text: 'text-yellow-600 dark:text-yellow-400',
    cardRing: 'hover:ring-yellow-300 dark:hover:ring-yellow-600',
  },
  pink: {
    tile: 'bg-pink-700 text-white',
    tileDark: 'dark:from-pink-500/40 dark:to-rose-500/40 dark:ring-1 dark:ring-pink-400/30',
    grad: 'from-pink-500 to-pink-800',
    chip: 'bg-pink-50 text-pink-700 ring-pink-200 dark:bg-pink-500/10 dark:text-pink-300 dark:ring-pink-500/30',
    soft: 'bg-pink-50 dark:bg-pink-500/10',
    text: 'text-pink-600 dark:text-pink-400',
    cardRing: 'hover:ring-pink-300 dark:hover:ring-pink-600',
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
    'Calculators': 'blue',
    'Building & DIY': 'green',
    'Hardware & Tech': 'yellow',
    'Name Generators': 'pink',
  }
  return map[category] || 'indigo'
}

export const tile = (h: Hue) => `bg-gradient-to-br ${H[h].tile} ${H[h].tileDark}`

export const tileGrad = (h: Hue) => `bg-gradient-to-br ${H[h].grad}`

export const iconTile = (h: Hue) => `ring-1 ring-black/20 dark:ring-white/35 ${H[h].text} shadow-sm`

export const chip = (h: Hue) => `bg-white ring-1 ring-zinc-200 text-zinc-900 font-semibold dark:bg-zinc-900 dark:ring-zinc-800 dark:text-white hover:ring-zinc-300 dark:hover:ring-zinc-700`

export const chipActive = (h: Hue) => `bg-gradient-to-br ${H[h].tile} ${H[h].tileDark} ring-1 ring-transparent`

export const textAccent = (h: Hue) => H[h].text

export const hoverTextAccent = (h: Hue): string => {
  const map: Record<Hue, string> = {
    sky: 'hover:text-sky-600 hover:dark:text-sky-400',
    rose: 'hover:text-rose-600 hover:dark:text-rose-400',
    indigo: 'hover:text-indigo-600 hover:dark:text-indigo-400',
    emerald: 'hover:text-emerald-600 hover:dark:text-emerald-400',
    amber: 'hover:text-amber-600 hover:dark:text-amber-400',
    fuchsia: 'hover:text-fuchsia-600 hover:dark:text-fuchsia-400',
    purple: 'hover:text-purple-600 hover:dark:text-purple-400',
    cyan: 'hover:text-cyan-600 hover:dark:text-cyan-400',
    lime: 'hover:text-lime-600 hover:dark:text-lime-400',
    teal: 'hover:text-teal-600 hover:dark:text-teal-400',
    orange: 'hover:text-orange-600 hover:dark:text-orange-400',
    violet: 'hover:text-violet-600 hover:dark:text-violet-400',
    blue: 'hover:text-blue-600 hover:dark:text-blue-400',
    green: 'hover:text-green-600 hover:dark:text-green-400',
    yellow: 'hover:text-yellow-600 hover:dark:text-yellow-400',
    pink: 'hover:text-pink-600 hover:dark:text-pink-400',
  }
  return map[h]
}

export const cardRing = (h: Hue) => H[h].cardRing
