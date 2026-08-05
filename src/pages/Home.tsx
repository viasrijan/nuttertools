import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES, TOTAL_TOOLS } from '../data/categories'
import { tile } from '../lib/style'
import ToolCard from '../components/ToolCard'
import SectionHeading from '../components/SectionHeading'
import Fuse from 'fuse.js'

const TOOLS = toolsData as any[]

export default function Home() {
  const [q, setQ] = useState('')
  const fuse = useMemo(() => new Fuse(TOOLS, { keys: ['name', 'desc', 'category'], threshold: 0.3 }), [])
  const results = q.trim() ? fuse.search(q.trim()).map((r) => r.item) : []

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
      <section className="relative pt-10 pb-10 md:pt-14 md:pb-14 text-center overflow-hidden">
        <div aria-hidden className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-indigo-400/30 via-violet-400/20 to-fuchsia-400/15 blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-zinc-600 dark:text-zinc-300 bg-white/70 dark:bg-zinc-900/70 backdrop-blur border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 mb-6 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
            {TOTAL_TOOLS} free tools, one place
          </p>
          <h1 className="font-[800] tracking-[-0.035em] text-[clamp(28px,8.5vw,72px)] leading-[1.04]">
            <span className="block whitespace-nowrap">Every useful tool.</span>
            <span className="flex items-center justify-center gap-3 whitespace-nowrap">
              <span aria-hidden className="w-2.5 h-2.5 rounded-full shrink-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400" />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">All in one place.</span>
            </span>
          </h1>
          <p className="mt-4 text-[15.5px] md:text-[18px] text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto leading-relaxed text-pretty">
            Images, PDFs, code, media and everyday utilities — organized into clean sections, ready when you need them.
          </p>
          <div className="mt-8 relative max-w-lg mx-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any tool…"
              className="w-full h-[52px] pl-[46px] pr-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[15px] text-zinc-900 dark:text-zinc-100 shadow-lg shadow-zinc-900/5 dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-zinc-400"
            />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {q.trim() && (
            <div className="mt-12 text-left">
              <p className="text-[13px] text-zinc-600 dark:text-zinc-300 mb-4">{results.length} result{results.length === 1 ? '' : 's'} for “{q.trim()}”</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((t) => <ToolCard key={t.id} tool={t} />)}
              </div>
              {results.length === 0 && <p className="text-zinc-600 dark:text-zinc-300 py-10 text-center text-sm">No tools match “{q.trim()}”. Try “compress”, “pdf” or “qr”.</p>}
            </div>
          )}
        </div>
      </section>

      {!q.trim() && (
        <>
          <section className="pb-12 md:pb-16">
            <SectionHeading eyebrow="Categories" title="Browse by section" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/tools/${c.slug}`}
                  className={`group relative overflow-hidden p-5 ${tile(c.hue)} transition-all duration-200 hover:shadow-xl hover:shadow-zinc-900/15 hover:-translate-y-0.5`}>
                  <span className="w-8 h-8 rounded-full border border-white/60 grid place-items-center text-[13px] text-white/90 tabular-nums">{c.count}</span>
                  <h3 className="mt-4 font-semibold text-[15px] tracking-[-0.01em] text-white">{c.name}</h3>
                  <p className="text-[12px] text-white/75 mt-1 leading-snug">{c.blurb}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="pb-16 md:pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-500 to-orange-300 px-8 py-12 md:py-14 shadow-xl shadow-red-900/10">
                <div aria-hidden className="absolute top-[-80px] right-[-80px] w-[280px] h-[280px] bg-white/10 blur-2xl" />
                <div className="relative pb-[45%]">
                  <p className="text-[24px] font-bold tracking-[-0.01em] text-white/90">Support Us</p>
                  <h2 className="text-[26px] md:text-[32px] font-bold tracking-[-0.03em] mt-3 text-white text-balance">Love OmniTools?</h2>
                  <p className="text-[15px] md:text-[16px] text-white/90 mt-3 max-w-sm leading-relaxed text-pretty">
                    Every tool here is free and always will be. A small donation helps keep the lights on.
                  </p>
                  <a href="https://www.paypal.me/iSrijan" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-8 px-8 h-12 bg-white text-red-600 font-bold text-[16px] shadow-lg hover:scale-105 active:scale-95 transition-transform">
                    Donate with PayPal
                  </a>
                </div>
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-[45%] overflow-hidden pointer-events-none">
                  <svg className="absolute inset-0 w-[200%] h-full animate-[omni-wave_16s_linear_infinite]" preserveAspectRatio="none" viewBox="0 0 1600 100">
                    <path d="M0 55 C 100 15, 200 95, 300 55 C 400 15, 500 95, 600 55 C 700 15, 800 55, 800 55 L 800 100 L 0 100 Z" fill="#fff" opacity="0.35" />
                    <path d="M800 55 C 900 15, 1000 95, 1100 55 C 1200 15, 1300 95, 1400 55 C 1500 15, 1600 55, 1600 55 L 1600 100 L 800 100 Z" fill="#fff" opacity="0.35" />
                  </svg>
                  <svg className="absolute inset-0 w-[200%] h-full animate-[omni-wave_11s_linear_infinite_reverse]" preserveAspectRatio="none" viewBox="0 0 1600 100">
                    <path d="M0 60 C 100 90, 200 20, 300 60 C 400 90, 500 20, 600 60 C 700 90, 800 60, 800 60 L 800 100 L 0 100 Z" fill="#fff" opacity="0.3" />
                    <path d="M800 60 C 900 90, 1000 20, 1100 60 C 1200 90, 1300 20, 1400 60 C 1500 90, 1600 60, 1600 60 L 1600 100 L 800 100 Z" fill="#fff" opacity="0.3" />
                  </svg>
                  <svg className="absolute inset-0 w-[200%] h-full animate-[omni-wave_7s_linear_infinite]" preserveAspectRatio="none" viewBox="0 0 1600 100">
                    <path d="M0 62 C 100 45, 200 75, 300 58 C 400 45, 500 75, 600 58 C 700 45, 800 60, 800 60 L 800 100 L 0 100 Z" fill="#fff" opacity="0.22" />
                    <path d="M800 62 C 900 45, 1000 75, 1100 58 C 1200 45, 1300 75, 1400 58 C 1500 45, 1600 60, 1600 60 L 1600 100 L 800 100 Z" fill="#fff" opacity="0.22" />
                  </svg>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-8 py-12 md:py-14">
                <p className="text-[24px] font-bold tracking-[-0.01em] text-indigo-600 dark:text-indigo-400">Why OmniTools?</p>
                <h2 className="text-[26px] md:text-[32px] font-bold tracking-[-0.03em] mt-3 text-balance">Free. Private. No sign-up.</h2>
                <ul className="mt-6 space-y-4">
                  {[
                    ['100% free forever', 'No paywalls, no trials, no accounts.'],
                    ['Your files never leave your device', 'Everything runs locally in your browser.'],
                    ['Fast & lightweight', 'Every tool opens instantly, ready to use.'],
                    ['Fresh tools, always', 'New utilities added all the time.'],
                  ].map(([t, d]) => (
                    <li key={t} className="flex gap-3.5">
                      <span className="w-2 h-2 mt-2 shrink-0 bg-gradient-to-r from-red-500 to-orange-500" />
                      <div>
                        <p className="text-[15px] font-semibold">{t}</p>
                        <p className="text-[13.5px] text-zinc-600 dark:text-zinc-300 mt-0.5 leading-relaxed">{d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
