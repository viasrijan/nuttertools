import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES } from '../data/categories'
import { tileGrad } from '../lib/style'
import { whiteCatIconUrl } from '../components/Icon'
import ToolCard from '../components/ToolCard'
import Fuse from 'fuse.js'

const TOOLS = toolsData as any[]

export default function CategoryPage() {
  const { slug } = useParams()
  const cat = CATEGORIES.find((c) => c.slug === slug)
  const [q, setQ] = useState('')

  useEffect(() => {
    if (!cat) return
    document.title = `${cat.name} - ${cat.count} free tools | NutterTools`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = `${cat.blurb}. ${cat.count} free, private tools — no sign-up needed.`
    return () => { document.title = 'NutterTools' }
  }, [cat])

  const list = useMemo(() => (cat ? TOOLS.filter((t) => t.category === cat.name) : []), [cat])
  const fuse = useMemo(() => new Fuse(list, { keys: ['name', 'desc'], threshold: 0.3 }), [list])
  const shown = q.trim() ? fuse.search(q.trim()).map((r) => r.item) : list

  if (!cat) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-24 text-center">
        <p className="text-zinc-900 dark:text-white font-medium">Section not found.</p>
        <Link to="/" className="inline-block mt-3 text-green-600 dark:text-green-400 font-medium underline">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
      <nav className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-[13px] font-medium text-zinc-900 dark:text-white pt-6 md:pt-8">
        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Home</Link>
        <span>/</span>
        <span>{cat.name}</span>
      </nav>

      <div className="pt-8 pb-8 md:pt-10 md:pb-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 md:gap-4">
        <span className={`w-14 h-14 md:w-16 md:h-16  bg-gradient-to-br ${tileGrad(cat.hue)} grid place-items-center shrink-0 shadow-lg ring-1 ring-black/10 dark:ring-white/20`}>
          <img src={whiteCatIconUrl(cat.slug)} alt="" className="w-7 h-7 md:w-8 md:h-8" draggable={false} />
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
          className="w-full h-[46px] pl-[42px] pr-4  border border-transparent bg-white dark:bg-[#242424] text-[14px] text-zinc-900 dark:text-zinc-100 soft-shadow focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
        />
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2">
          <defs>
            <linearGradient id="cat-search-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6366f1" />
              <stop offset="1" stopColor="#3730a3" />
            </linearGradient>
          </defs>
          <circle cx="8" cy="8" r="5.75" stroke="url(#cat-search-grad)" strokeWidth="1.5" />
          <path d="M12.5 12.5L16 16" stroke="url(#cat-search-grad)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
        {shown.map((t) => <ToolCard key={t.id} tool={t} />)}
      </div>
      {shown.length === 0 && <p className="text-zinc-900 dark:text-white font-medium py-16 text-center">No tools match “{q.trim()}”.</p>}
    </div>
  )
}
