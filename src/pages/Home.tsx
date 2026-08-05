import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES, TOTAL_TOOLS } from '../data/categories'
import { tileGrad } from '../lib/style'
import ToolCard from '../components/ToolCard'
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
          <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-zinc-900 dark:text-white bg-white/70 dark:bg-zinc-900/70 backdrop-blur border border-zinc-200 dark:border-zinc-800 px-3.5 py-1.5 mb-6 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
            {TOTAL_TOOLS} free tools, one place
          </p>
          <h1 className="font-[800] tracking-[-0.035em] text-[clamp(28px,8.5vw,72px)] leading-[1.04]">
            <span className="flex items-center justify-center gap-3">
              <span aria-hidden className="w-2.5 h-2.5 rounded-full shrink-0 bg-purple-600 dark:bg-purple-400" />
              <span>All useful tools in <span className="text-purple-600 dark:text-purple-400">one place</span>.</span>
            </span>
          </h1>
          <p className="mt-4 text-[15.5px] md:text-[18px] font-medium text-zinc-900 dark:text-white max-w-xl mx-auto leading-relaxed text-pretty">
            Images, PDFs, code, media and everyday utilities — organized into clean sections, ready when you need them.
          </p>
          <div className="mt-8 relative max-w-lg mx-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any tool…"
              className="w-full h-[52px] pl-[46px] pr-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[15px] text-zinc-900 dark:text-zinc-100 shadow-lg shadow-zinc-900/5 dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400">
              <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {q.trim() && (
            <div className="mt-12 text-left">
              <p className="text-[13px] font-medium text-zinc-900 dark:text-white mb-4">{results.length} result{results.length === 1 ? '' : 's'} for “{q.trim()}”</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((t) => <ToolCard key={t.id} tool={t} />)}
              </div>
              {results.length === 0 && <p className="text-zinc-900 dark:text-white py-10 text-center text-sm font-medium">No tools match “{q.trim()}”. Try “compress”, “pdf” or “qr”.</p>}
            </div>
          )}
        </div>
      </section>

      {!q.trim() && (
        <>
          <section className="pb-12 md:pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/tools/${c.slug}`}
                  className={`group relative overflow-hidden p-5 ${tileGrad(c.hue)} transition-all duration-200 hover:shadow-xl hover:shadow-zinc-900/15 hover:-translate-y-0.5`}>
                  <span className="w-8 h-8 rounded-full border border-white/60 grid place-items-center text-[13px] text-white/90 tabular-nums">{c.count}</span>
                  <h3 className="mt-4 font-semibold text-[15px] tracking-[-0.01em] text-white">{c.name}</h3>
                  <p className="text-[12px] text-white/75 mt-1 leading-snug">{c.blurb}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="pb-16 md:pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-pink-600 to-pink-400 px-8 py-12 md:py-14 shadow-xl shadow-red-900/10">
                <div aria-hidden className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="fluid-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ef4444" stopOpacity="0.9" />
                        <stop offset="0.55" stopColor="#db2777" stopOpacity="0.9" />
                        <stop offset="1" stopColor="#f472b6" stopOpacity="0.9" />
                      </linearGradient>
                      <filter id="fluid-dist" x="-30%" y="-30%" width="160%" height="160%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.015" numOctaves="3" seed="7" result="n">
                          <animate attributeName="baseFrequency" dur="26s" values="0.008 0.015;0.016 0.008;0.008 0.015" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="n" scale="80" xChannelSelector="R" yChannelSelector="G" />
                      </filter>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#fluid-grad)" filter="url(#fluid-dist)" />
                  </svg>
                  <div className="absolute -top-16 -left-10 w-72 h-72 rounded-[45%] bg-white/25 blur-3xl mix-blend-screen animate-[omni-blob_14s_ease-in-out_infinite]" />
                  <div className="absolute top-1/3 -right-14 w-80 h-80 rounded-[55%] bg-pink-300/40 blur-3xl mix-blend-screen animate-[omni-blob_18s_ease-in-out_infinite_reverse]" />
                  <div className="absolute -bottom-16 left-1/4 w-72 h-72 rounded-[40%] bg-red-400/40 blur-3xl mix-blend-screen animate-[omni-blob_12s_ease-in-out_infinite]" />
                </div>
                <div className="relative">
                  <p className="text-[24px] font-bold tracking-[-0.01em] text-white/90">Support Us</p>
                  <h2 className="text-[26px] md:text-[32px] font-bold tracking-[-0.03em] mt-3 text-white text-balance">Love OmniTools?</h2>
                  <p className="text-[15px] md:text-[16px] font-medium text-white/90 mt-3 max-w-sm leading-relaxed text-pretty">
                    Every tool here is free and always will be. A small donation helps keep the lights on.
                  </p>
                  <a href="https://www.paypal.me/iSrijan" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-8 px-8 h-12 bg-white text-red-600 font-bold text-[16px] shadow-lg hover:scale-105 active:scale-95 transition-transform">
                    Donate with PayPal
                  </a>
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
                      <span className="w-2 h-2 mt-2 shrink-0 bg-gradient-to-r from-red-500 to-pink-500" />
                      <div>
                        <p className="text-[15px] font-semibold">{t}</p>
                        <p className="text-[13.5px] font-medium text-zinc-900 dark:text-white mt-0.5 leading-relaxed">{d}</p>
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
