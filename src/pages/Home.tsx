import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES, TOTAL_TOOLS } from '../data/categories'
import ToolCard from '../components/ToolCard'
import Fuse from 'fuse.js'

const TOOLS = toolsData as any[]
const FEATURED = TOOLS.filter((t) => t.popular).slice(0, 12)

export default function Home() {
  const [q, setQ] = useState('')
  const fuse = useMemo(() => new Fuse(TOOLS, { keys: ['name', 'desc', 'category'], threshold: 0.3 }), [])
  const results = q.trim() ? fuse.search(q.trim()).map((r) => r.item) : []

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        <div aria-hidden className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[560px] h-[380px] rounded-full bg-gradient-to-br from-indigo-400/20 via-violet-400/15 to-fuchsia-400/10 blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 px-3.5 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {TOTAL_TOOLS} free tools, one place
          </p>
          <h1 className="text-[44px] sm:text-[60px] md:text-[72px] font-[800] leading-[1.02] tracking-[-0.035em]">
            Every useful tool.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">All in one place.</span>
          </h1>
          <p className="mt-6 text-[17px] md:text-[19px] text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Images, PDFs, code, media and everyday utilities — organized into clean sections, ready when you need them.
          </p>
          <div className="mt-9 relative max-w-lg mx-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any tool…"
              className="w-full h-[54px] pl-[46px] pr-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[15px] shadow-lg shadow-zinc-900/5 dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400"
            />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {q.trim() && (
            <div className="mt-10 text-left">
              <p className="text-[13px] text-zinc-500 mb-3">{results.length} result{results.length === 1 ? '' : 's'} for “{q.trim()}”</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {results.map((t) => <ToolCard key={t.id} tool={t} />)}
              </div>
              {results.length === 0 && <p className="text-zinc-500 py-10 text-center text-sm">No tools match “{q.trim()}”. Try “compress”, “pdf” or “qr”.</p>}
            </div>
          )}
        </div>
      </section>

      {!q.trim() && (
        <>
          <section className="pb-16 md:pb-20">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-[22px] md:text-[26px] font-bold tracking-[-0.02em]">Browse by section</h2>
                <p className="text-[14px] text-zinc-500 mt-1">Everything is organized, nothing is lost.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/tools/${c.slug}`}
                  className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200">
                  <div className="flex items-center gap-3.5">
                    <span className="w-11 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 grid place-items-center text-[20px]">{c.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[15px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{c.name}</h3>
                      <p className="text-[12px] text-zinc-500 mt-0.5 truncate">{c.blurb}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">{c.count} tools</span>
                    <span className="text-[12px] font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Open section →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="pb-20">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-[22px] md:text-[26px] font-bold tracking-[-0.02em]">Popular tools</h2>
                <p className="text-[14px] text-zinc-500 mt-1">The ones everyone reaches for first.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {FEATURED.map((t) => <ToolCard key={t.id} tool={t} />)}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
