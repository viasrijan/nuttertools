import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES, GROUPS } from '../data/categories'
import { tile, chipActive } from '../lib/style'
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
        <p className="text-zinc-500">Section not found.</p>
        <Link to="/" className="inline-block mt-3 text-indigo-600 dark:text-indigo-400 font-medium underline">Back to home</Link>
      </div>
    )
  }

  const group = GROUPS.find((g) => g.id === cat.group)

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
      <nav className="flex items-center gap-2 text-[13px] text-zinc-500 pt-6">
        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Home</Link>
        <span>/</span>
        <span>{cat.name}</span>
      </nav>

      <div className="pt-8 pb-9 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className={`w-14 h-14 rounded-2xl grid place-items-center text-[26px] shadow-sm shrink-0 ${tile(cat.hue)}`}>{cat.icon}</span>
          <div>
            <h1 className="text-[28px] md:text-[36px] font-[800] tracking-[-0.03em] leading-none text-balance">{cat.name}</h1>
            <p className="text-zinc-500 mt-2 text-[14.5px] text-pretty">{cat.blurb} — {cat.count} tools.</p>
          </div>
        </div>
        {group && (
          <div className="flex flex-wrap gap-2 shrink-0">
            {group.categories.map((c) => (
              <Link key={c.slug} to={`/tools/${c.slug}`}
                className={`px-4 h-9 rounded-full text-[13px] font-semibold grid place-items-center ring-1 transition-all ${c.slug === cat.slug ? `${chipActive(c.hue)} shadow-sm` : 'bg-white dark:bg-zinc-900 ring-zinc-200 dark:ring-zinc-800 text-zinc-600 dark:text-zinc-400 hover:ring-zinc-300 dark:hover:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80'}`}>
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="relative max-w-md mb-8">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${cat.name}…`}
          className="w-full h-[46px] pl-[42px] pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-zinc-400"
        />
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
          <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-20">
        {shown.map((t) => <ToolCard key={t.id} tool={t} />)}
      </div>
      {shown.length === 0 && <p className="text-zinc-500 py-16 text-center">No tools match “{q.trim()}”.</p>}
    </div>
  )
}
