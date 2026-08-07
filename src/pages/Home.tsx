import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES, TOTAL_TOOLS } from '../data/categories'
import { tileGrad } from '../lib/style'
import ToolCard from '../components/ToolCard'
import { POPULAR_TOOLS } from '../data/popular'
import Fuse from 'fuse.js'

const TOOLS = toolsData as any[]

const SECTION_LABEL = 'text-[40px] md:text-[44px] font-extrabold tracking-[-0.02em] bg-gradient-to-b from-emerald-500 to-emerald-800 bg-clip-text text-transparent text-center'

export default function Home() {
  const [q, setQ] = useState('')
  const fuse = useMemo(() => new Fuse(TOOLS, { keys: ['name', 'desc', 'category'], threshold: 0.3 }), [])
  const results = q.trim() ? fuse.search(q.trim()).map((r) => r.item) : []

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 animate-[omni-fade_0.3s_ease-out]">
      <section className="relative pt-8 pb-8 md:pt-16 md:pb-14 text-center">
        <div className="relative">
          <p className="inline-flex items-center gap-2 text-[15px] font-semibold text-white bg-gradient-to-b from-emerald-500 to-emerald-800 px-[18px] py-[9px] mb-6 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white" />
            {TOTAL_TOOLS} free tools, one place
          </p>
          <h1 className="font-[800] tracking-[-0.035em] text-[clamp(22.5px,6.8vw,57.6px)] leading-[1.04] [filter:drop-shadow(0_3px_12px_rgba(0,0,0,0.12))]">
            All useful tools in{' '}
            <span className="relative inline-block whitespace-nowrap">
              <svg aria-hidden className="absolute left-0 top-[0.58em] w-full h-[0.24em]" viewBox="0 0 200 20" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="uline-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#22c55e" stopOpacity="0.8" />
                    <stop offset="0.5" stopColor="#22c55e" stopOpacity="1" />
                    <stop offset="1" stopColor="#22c55e" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path pathLength="1" className="[stroke-dasharray:1] [stroke-dashoffset:1] animate-[omni-draw_0.7s_ease-out_0.4s_both]" d="M2 10 L198 10" stroke="url(#uline-grad)" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
              <span className="relative bg-gradient-to-b from-emerald-500 to-emerald-800 bg-clip-text text-transparent">one place</span>
            </span>.
          </h1>
          <p className="mt-4 text-[15.5px] md:text-[18px] font-medium text-zinc-900 dark:text-white max-w-xl mx-auto leading-relaxed text-pretty">
            Images, PDFs, code, media and everyday utilities — organized into clean sections, ready when you need them.
          </p>
          <div className="mt-8 relative max-w-lg mx-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any tool…"
              className="w-full h-[52px] pl-[46px] pr-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[15px] text-zinc-900 dark:text-zinc-100 soft-shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400">
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
            <p className={`${SECTION_LABEL} mb-5 md:mb-6`}>Browse by Categories</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/tools/${c.slug}`}
                  className={`group relative overflow-hidden p-5 ${tileGrad(c.hue)} soft-shadow transition-all duration-200 hover:scale-[1.03] flex flex-col items-center text-center`}>
                  <div aria-hidden className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/15 blur-2xl group-hover:bg-white/25 transition-colors duration-200" />
                  <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/25" />
                  <span className="relative w-11 h-11 rounded-full bg-white/25 grid place-items-center text-[16px] font-bold text-white tabular-nums shadow-sm">{c.count}</span>
                  <h3 className="relative mt-3 font-bold text-[16px] tracking-[-0.01em] text-white">{c.name}</h3>
                </Link>
              ))}
            </div>
          </section>

          <section className="pb-12 md:pb-16">
            <p className={`${SECTION_LABEL} mb-5 md:mb-6`}>Popular Tools</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {POPULAR_TOOLS.slice(0, 12).map((t) => <ToolCard key={t.id} tool={t} />)}
            </div>
          </section>

          <section className="pb-12 md:pb-16">
            <p className={`${SECTION_LABEL} mb-4 md:mb-5`}>Why NutterTools?</p>
            <div className="bg-gradient-to-b from-white to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 px-6 md:px-12 py-8 md:py-10 flex flex-col justify-center soft-shadow">
              <h2 className="text-[30px] md:text-[40px] font-[800] tracking-[-0.03em] text-balance text-center leading-[1.08] text-zinc-900 dark:text-white">Free. Private. No sign-up.</h2>
              <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['100% free forever', 'No paywalls, no trials, no accounts.'],
                  ['Your files never leave your device', 'Everything runs locally in your browser.'],
                  ['Fast & lightweight', 'Every tool opens instantly, ready to use.'],
                  ['Fresh tools, always', 'New utilities added all the time.'],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3.5 text-left">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-800 grid place-items-center shrink-0 mt-0.5 shadow-sm">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </span>
                    <div className="min-w-0">
                      <p className="text-[16px] font-bold tracking-[-0.01em]">{t}</p>
                      <p className="text-[14px] font-medium text-zinc-900 dark:text-white mt-1 leading-relaxed">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
              </div>
            </section>
            <section className="pb-12 md:pb-16">
              <p className={`${SECTION_LABEL} mb-4 md:mb-5`}>Support Us</p>
              <div className="relative overflow-hidden bg-gradient-to-br from-red-800 via-rose-800 to-pink-700 px-6 md:px-12 py-10 md:py-12 soft-shadow flex flex-col justify-center">
                <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute left-1/2 top-1/2 w-[240%] h-[360%] animate-[omni-rotate_24s_linear_infinite]">
                    <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,#ef4444_0%,#f43f5e_25%,#fb7185_45%,#ec4899_65%,#fda4af_85%,#ef4444_100%)] blur-2xl mix-blend-screen" />
                  </div>
                  <div className="absolute -top-1/3 -left-1/3 w-[80%] h-[160%]">
                    <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4),transparent_60%)] blur-2xl mix-blend-screen animate-[omni-aurora-a_16s_ease-in-out_infinite]" />
                  </div>
                  <div className="absolute -bottom-1/3 -right-1/3 w-[80%] h-[160%]">
                    <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.5),transparent_60%)] blur-2xl mix-blend-screen animate-[omni-aurora-b_20s_ease-in-out_infinite]" />
                  </div>
                </div>
                <div className="relative flex flex-col items-center text-center">
                  <h2 className="text-[30px] md:text-[40px] font-[800] tracking-[-0.03em] text-white text-balance leading-[1.08]">Love ❤️ NutterTools?</h2>
                <p className="text-[15.5px] font-medium text-white/90 mt-3.5 leading-relaxed text-pretty">
                  Every tool here is free and always will be.
                  <br />
                  A small donation helps keep the lights on.
                </p>
                <a href="https://www.paypal.me/iSrijan" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-8 px-8 h-11 bg-white text-pink-600 font-bold text-[15px] rounded-lg soft-shadow hover:scale-105 active:scale-95 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                  </svg>
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
