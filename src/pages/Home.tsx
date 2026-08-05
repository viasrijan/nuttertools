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
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 animate-[omni-fade_0.3s_ease-out]">
      <section className="relative pt-10 pb-10 md:pt-14 md:pb-14 text-center">
        <div className="relative">
          <p className="inline-flex items-center gap-4 text-[25px] font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-7 py-3 mb-8 rounded-full shadow-md">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
            {TOTAL_TOOLS} free tools, one place
          </p>
          <h1 className="font-[800] tracking-[-0.035em] text-[clamp(28px,8.5vw,72px)] leading-[1.04]">
            All useful tools in{' '}
            <span className="relative inline-block whitespace-nowrap">
              <span className="text-sky-500 dark:text-sky-400">one place</span>
              <svg aria-hidden className="absolute left-0 -bottom-[0.16em] w-full h-[0.34em]" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path pathLength="1" className="[stroke-dasharray:1] [stroke-dashoffset:1] animate-[omni-draw_0.7s_ease-out_0.4s_both]" d="M2 10 L198 10" stroke="#0ea5e9" strokeWidth="7" strokeLinecap="round" fill="none" />
              </svg>
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
              className="w-full h-[52px] pl-[46px] pr-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[15px] text-zinc-900 dark:text-zinc-100 shadow-lg shadow-zinc-900/5 dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 dark:text-sky-400">
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
                  className={`group relative overflow-hidden p-5 ${tileGrad(c.hue)} shadow-lg shadow-zinc-900/10 transition-all duration-200 hover:shadow-xl hover:shadow-zinc-900/20 hover:-translate-y-1 flex flex-col items-center text-center`}>
                  <div aria-hidden className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/15 blur-2xl group-hover:bg-white/25 transition-colors duration-200" />
                  <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/25" />
                  <span className="relative w-11 h-11 rounded-full bg-white/25 grid place-items-center text-[16px] font-bold text-white tabular-nums shadow-sm">{c.count}</span>
                  <h3 className="relative mt-3 font-bold text-[16px] tracking-[-0.01em] text-white">{c.name}</h3>
                </Link>
              ))}
            </div>
          </section>

          <section className="pb-16 md:pb-24">
            <div className="grid grid-cols-1 md:grid-cols-[6fr_4fr] gap-4 min-h-[430px] md:min-h-[480px]">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-6 md:px-8 py-9 md:py-10 flex flex-col justify-center">
                <p className="text-[16px] font-bold tracking-[-0.01em] text-sky-500 dark:text-sky-400">Why OmniTools?</p>
                <h2 className="text-[22px] md:text-[26px] font-bold tracking-[-0.03em] mt-3 text-balance">Free. Private. No sign-up.</h2>
                <ul className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
                  {[
                    ['100% free forever', 'No paywalls, no trials, no accounts.'],
                    ['Your files never leave your device', 'Everything runs locally in your browser.'],
                    ['Fast & lightweight', 'Every tool opens instantly, ready to use.'],
                    ['Fresh tools, always', 'New utilities added all the time.'],
                  ].map(([t, d]) => (
                    <li key={t} className="flex gap-3">
                      <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 bg-gradient-to-r from-red-500 to-pink-500" />
                      <div>
                        <p className="text-[13.5px] font-semibold">{t}</p>
                        <p className="text-[12.5px] font-medium text-zinc-900 dark:text-white mt-0.5 leading-relaxed">{d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-pink-600 to-pink-400 px-6 py-9 md:py-10 shadow-xl shadow-red-900/10 flex flex-col justify-center"
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  e.currentTarget.style.setProperty('--mx', (((e.clientX - r.left) / r.width) - 0.5).toFixed(3))
                  e.currentTarget.style.setProperty('--my', (((e.clientY - r.top) / r.height) - 0.5).toFixed(3))
                }}>
                <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute left-1/2 top-1/2 w-[240%] h-[360%] animate-[omni-rotate_80s_linear_infinite]">
                    <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,#ef4444_0%,#f43f5e_25%,#fb7185_45%,#ec4899_65%,#fda4af_85%,#ef4444_100%)] blur-2xl mix-blend-screen" />
                  </div>
                  <div className="absolute -top-1/3 -left-1/3 w-[80%] h-[160%] transition-transform duration-300 ease-out will-change-transform" style={{ transform: 'translate3d(calc(var(--mx,0)*30px), calc(var(--my,0)*20px), 0)' }}>
                    <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4),transparent_60%)] blur-2xl mix-blend-screen animate-[omni-aurora-a_16s_ease-in-out_infinite]" />
                  </div>
                  <div className="absolute -bottom-1/3 -right-1/3 w-[80%] h-[160%] transition-transform duration-300 ease-out will-change-transform" style={{ transform: 'translate3d(calc(var(--mx,0)*-25px), calc(var(--my,0)*-18px), 0)' }}>
                    <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.5),transparent_60%)] blur-2xl mix-blend-screen animate-[omni-aurora-b_20s_ease-in-out_infinite]" />
                  </div>
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(260px circle at calc(50% + var(--mx,0)*30%) calc(50% + var(--my,0)*30%), rgba(255,255,255,0.2), transparent 65%)' }} />
                </div>
                <div className="relative flex flex-col items-center text-center">
                  <p className="text-[15px] font-bold tracking-[-0.01em] text-white/90">Support Us</p>
                  <h2 className="text-[22px] md:text-[26px] font-bold tracking-[-0.03em] mt-3 text-white text-balance">Love OmniTools?</h2>
                  <p className="text-[13.5px] font-medium text-white/90 mt-3 leading-relaxed text-pretty">
                    Every tool here is free and always will be. A small donation helps keep the lights on.
                  </p>
                  <a href="https://www.paypal.me/iSrijan" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-7 px-6 h-10 bg-white text-red-600 font-bold text-[13.5px] shadow-lg hover:scale-105 active:scale-95 transition-transform">
                    Donate with PayPal
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
