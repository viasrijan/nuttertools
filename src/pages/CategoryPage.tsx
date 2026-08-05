import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES } from '../data/categories'
import { tileGrad } from '../lib/style'
import { CategoryIcon } from '../components/Icon'
import ToolCard from '../components/ToolCard'
import Fuse from 'fuse.js'

const TOOLS = toolsData as any[]

export default function CategoryPage() {
  const { slug } = useParams()
  const cat = CATEGORIES.find((c) => c.slug === slug)
  const [q, setQ] = useState('')

  const list = useMemo(() => (cat ? TOOLS.filter((t) => t.category === cat.name) : []), [cat])
  const fuse = useMemo(() => new Fuse(list, { keys: ['name', 'desc'], threshold: 0.3 }), [list])
  const shown = q.trim() ? fuse.search(q.trim()).map((r) => r.item) : list

  if (!cat) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-24 text-center">
        <p className="text-zinc-900 dark:text-white font-medium">Section not found.</p>
        <Link to="/" className="inline-block mt-3 text-sky-500 dark:text-sky-300 font-medium underline">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
      <nav className="flex items-center gap-2 text-[13px] font-medium text-zinc-900 dark:text-white pt-6 md:pt-8">
        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Home</Link>
        <span>/</span>
        <span>{cat.name}</span>
      </nav>

      <div className="pt-8 pb-8 md:pt-10 md:pb-10 flex items-center gap-3 md:gap-4">
        <span className={`w-14 h-14 md:w-16 md:h-16 grid place-items-center shrink-0 rounded-full shadow-lg ${tileGrad(cat.hue)} text-white`}>
          <CategoryIcon slug={cat.slug} className="w-7 h-7 md:w-8 md:h-8" />
        </span>
        <div>
          <h1 className="text-[22px] md:text-[38px] font-[800] tracking-[-0.03em] leading-none text-balance">{cat.name}</h1>
          <p className="text-zinc-900 dark:text-white mt-2.5 text-[14.5px] font-medium text-pretty">{cat.blurb} — {cat.count} tools.</p>
        </div>
      </div>

      <div className="relative max-w-md mb-8">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${cat.name}…`}
          className="w-full h-[46px] pl-[42px] pr-4  border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[14px] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 dark:text-sky-300">
          <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
        {shown.map((t) => <ToolCard key={t.id} tool={t} />)}
      </div>
      {shown.length === 0 && <p className="text-zinc-900 dark:text-white font-medium py-16 text-center">No tools match “{q.trim()}”.</p>}
    </div>
  )
}
