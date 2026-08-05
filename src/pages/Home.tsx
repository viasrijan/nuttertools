import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES, TOTAL_TOOLS } from '../data/categories'
import { tile, textAccent, cardRing } from '../lib/style'
import ToolCard from '../components/ToolCard'
import SectionHeading from '../components/SectionHeading'
import { CategoryIcon } from '../components/Icon'
import Fuse from 'fuse.js'

const TOOLS = toolsData as any[]
const READY = TOOLS.filter((t) => t.implemented).slice(0, 12)

export default function Home() {
  const [q, setQ] = useState('')
  const fuse = useMemo(() => new Fuse(TOOLS, { keys: ['name', 'desc', 'category'], threshold: 0.3 }), [])
  const results = q.trim() ? fuse.search(q.trim()).map((r) => r.item) : []

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-24 text-center overflow-hidden">
        <div aria-hidden className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-br from-indigo-400/20 via-violet-400/15 to-fuchsia-400/10 blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-zinc-600 dark:text-zinc-300 bg-white/70 dark:bg-zinc-900/70 backdrop-blur border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 rounded-full mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
            {TOTAL_TOOLS} free tools, one place
          </p>
          <h1 className="font-[800] tracking-[-0.035em] text-[clamp(28px,8.5vw,72px)] leading-[1.04]">
            <span className="block whitespace-nowrap">Every useful tool.</span>
            <span className="block whitespace-nowrap bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">All in one place.</span>
          </h1>
          <p className="mt-6 text-[15.5px] md:text-[18px] text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed text-pretty">
            Images, PDFs, code, media and everyday utilities — organized into clean sections, ready when you need them.
          </p>
          <div className="mt-10 relative max-w-lg mx-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any tool…"
              className="w-full h-[52px] pl-[46px] pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[15px] text-zinc-900 dark:text-zinc-100 shadow-lg shadow-zinc-900/5 dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-zinc-400"
            />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {q.trim() && (
            <div className="mt-12 text-left">
              <p className="text-[13px] text-zinc-500 mb-4">{results.length} result{results.length === 1 ? '' : 's'} for “{q.trim()}”</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((t) => <ToolCard key={t.id} tool={t} />)}
              </div>
              {results.length === 0 && <p className="text-zinc-500 py-10 text-center text-sm">No tools match “{q.trim()}”. Try “compress”, “pdf” or “qr”.</p>}
            </div>
          )}
        </div>
      </section>

      {!q.trim() && (
        <>
          <section className="pb-16 md:pb-24">
            <SectionHeading eyebrow="Sections" title="Browse by section" sub="Everything is organized, nothing is lost." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/tools/${c.slug}`}
                  className={`group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 ring-0 transition-all duration-200 hover:shadow-xl hover:shadow-zinc-900/5 dark:hover:shadow-black/20 ${cardRing(c.hue)}`}>
                  <div className="flex items-center gap-4">
                    <span className={`w-12 h-12 rounded-xl grid place-items-center shadow-sm shrink-0 ${tile(c.hue)}`}>
                      <CategoryIcon slug={c.slug} className="w-6 h-6 text-white" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[15px] tracking-[-0.01em]">{c.name}</h3>
                      <p className="text-[12.5px] text-zinc-500 mt-1 leading-snug">{c.blurb}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[12px] font-medium text-zinc-400 dark:text-zinc-500">{c.count} tools</span>
                    <span className={`text-[12px] font-semibold flex items-center gap-1 ${textAccent(c.hue)}`}>
                      Open
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
                        <path d="M5 2.5L10 7L5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="pb-16 md:pb-24">
            <SectionHeading eyebrow="Favorites" title="Ready-to-use tools" sub="The ones that work right now." />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {READY.map((t) => <ToolCard key={t.id} tool={t} />)}
            </div>
          </section>

          <section className="pb-20 md:pb-28">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-12 md:py-16 text-center shadow-xl shadow-indigo-900/10">
              <div aria-hidden className="absolute top-[-80px] right-[-80px] w-[280px] h-[280px] rounded-full bg-white/10 blur-2xl" />
              <div aria-hidden className="absolute bottom-[-100px] left-[-60px] w-[260px] h-[260px] rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-100/90">Support</p>
                <h2 className="text-[24px] md:text-[30px] font-bold tracking-[-0.03em] mt-2 text-white text-balance">Love OmniTools?</h2>
                <p className="text-[14px] text-indigo-100 mt-2 max-w-md mx-auto leading-relaxed text-pretty">
                  Every tool here is free and always will be. A small donation helps keep the lights on.
                </p>
                <a href="https://www.paypal.me/iSrijan" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-7 px-7 h-12 rounded-full bg-white text-indigo-700 font-bold text-[15px] shadow-lg hover:scale-105 active:scale-95 transition-transform">
                  Donate with PayPal
                </a>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
