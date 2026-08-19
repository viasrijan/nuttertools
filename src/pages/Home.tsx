import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, TOTAL_TOOLS } from '../data/categories'
import { tileGrad } from '../lib/style'
import ToolCard from '../components/ToolCard'
import { POPULAR_TOOLS } from '../data/popular'
import { toolIconUrl } from '../components/Icon'

const ThreeBackground = lazy(() => import('../components/ThreeBackground'))

const SECTION_LABEL_BASE = 'text-[24px] md:text-[35px] font-extrabold tracking-[-0.02em] text-center'
const SECTION_LABEL = `${SECTION_LABEL_BASE} text-black dark:text-white`
const SECTION_LABEL_WHY = `${SECTION_LABEL_BASE} text-green-600 dark:text-green-400`
const SECTION_LABEL_SUPPORT = `${SECTION_LABEL_BASE} text-yellow-400`

export default function Home() {
  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6 animate-[omni-fade_0.3s_ease-out]">
      <section className="relative pt-8 pb-8 md:pt-16 md:pb-14 text-center overflow-hidden">
        <Suspense fallback={null}><ThreeBackground /></Suspense>
        <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
          {[
            { id: 'qr-generator', cls: 'left-[2%] top-[16%] w-10 h-10 md:w-12 md:h-12 opacity-20 animate-[omni-drift-a_9s_ease-in-out_infinite]' },
            { id: 'image-compressor', cls: 'right-[3%] top-[10%] w-11 h-11 md:w-14 md:h-14 opacity-20 animate-[omni-drift-b_11s_ease-in-out_infinite]' },
            { id: 'pdf-to-word', cls: 'left-[6%] bottom-[8%] w-9 h-9 md:w-11 md:h-11 opacity-20 animate-[omni-drift-c_12s_ease-in-out_infinite]' },
            { id: 'video-to-gif', cls: 'right-[8%] bottom-[18%] w-10 h-10 md:w-12 md:h-12 opacity-20 animate-[omni-drift-a_10s_ease-in-out_infinite_0.5s]' },
            { id: 'json-formatter', cls: 'left-[16%] top-[34%] w-8 h-8 md:w-10 md:h-10 opacity-20 animate-[omni-drift-b_13s_ease-in-out_infinite_0.8s]' },
            { id: 'palette-extractor', cls: 'right-[15%] top-[38%] w-8 h-8 md:w-10 md:h-10 opacity-20 animate-[omni-drift-c_9s_ease-in-out_infinite_0.3s]' },
            { id: 'audio-converter', cls: 'left-[10%] top-[64%] w-9 h-9 md:w-11 md:h-11 opacity-20 animate-[omni-drift-a_12s_ease-in-out_infinite_1.2s]' },
            { id: 'merge-pdf', cls: 'right-[4%] bottom-[6%] w-9 h-9 md:w-11 md:h-11 opacity-20 animate-[omni-drift-b_10s_ease-in-out_infinite_1.5s]' },
            { id: 'uuid-generator', cls: 'left-[28%] top-[8%] w-8 h-8 md:w-9 md:h-9 opacity-20 animate-[omni-drift-c_11s_ease-in-out_infinite_2s]' },
            { id: 'password-generator', cls: 'right-[26%] bottom-[6%] w-8 h-8 md:w-9 md:h-9 opacity-20 animate-[omni-drift-a_12s_ease-in-out_infinite_0.9s]' },
          ].map((f) => (
            <img key={f.id} src={toolIconUrl(f.id)} alt="" draggable={false} className={`hidden md:block absolute drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)] ${f.cls}`} />
          ))}
        </div>
        <div className="relative">
          <p className="mb-6 text-[17px] font-semibold text-zinc-900 dark:text-white">
            Your go to library of web tools.{' '}
            <br className="sm:hidden" />
            <span className="font-bold text-[25.5px] leading-none text-[#f97316]">{TOTAL_TOOLS} tools</span>{' '}and counting.
          </p>
          <h1 className="font-[800] tracking-[-0.035em] text-[clamp(22.5px,6.8vw,57.6px)] leading-[1.04] [filter:drop-shadow(0_3px_12px_rgba(0,0,0,0.12))] text-black dark:text-white">
            All useful tools in{' '}
            <span className="relative inline-block whitespace-nowrap">
              <svg aria-hidden className="absolute left-0 top-[0.58em] w-full h-[0.24em]" viewBox="0 0 200 20" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="uline-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#6366f1" stopOpacity="0.8" />
                    <stop offset="0.5" stopColor="#3730a3" stopOpacity="1" />
                    <stop offset="1" stopColor="#6366f1" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path pathLength="1" className="[stroke-dasharray:1] [stroke-dashoffset:1] animate-[omni-draw_0.7s_ease-out_0.4s_both]" d="M2 10 L198 10" stroke="url(#uline-grad)" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
              <span className="relative bg-gradient-to-br from-indigo-500 to-indigo-800 bg-clip-text text-transparent">one place</span>
            </span><span className="bg-gradient-to-br from-indigo-500 to-indigo-800 bg-clip-text text-transparent">.</span>
          </h1>
          <p className="mt-4 text-[15.5px] md:text-[18px] font-medium text-zinc-900 dark:text-white max-w-xl mx-auto leading-relaxed text-pretty">
            Images, PDFs, code, media and everyday utilities — organized into clean sections, ready when you need them.
          </p>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <p className={`${SECTION_LABEL} mb-5 md:mb-6 text-center`}>Browse by Categories</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/tools/${c.slug}`}
                  className={`group relative overflow-hidden  p-5 ${tileGrad(c.hue)} soft-shadow transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)] flex flex-col items-center text-center`}>
                  <div aria-hidden className="absolute -top-10 -right-10 w-32 h-32  bg-white/15 blur-2xl group-hover:bg-white/30 group-hover:scale-125 transition-all duration-500" />
                  <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/25" />
                  <span className="relative w-11 h-11  bg-white/25 backdrop-blur-sm grid place-items-center text-[16px] font-bold text-white tabular-nums shadow-sm transition-transform duration-300 group-hover:scale-110">{c.count}</span>
                  <h3 className="relative mt-3 font-bold text-[16px] tracking-[-0.01em] text-white">{c.name}</h3>
                </Link>
              ))}
            </div>
          </section>

          <section className="pb-12 md:pb-16">
            <p className={`${SECTION_LABEL} mb-5 md:mb-6 text-center`}>Popular Tools</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {POPULAR_TOOLS.slice(0, 12).map((t) => <ToolCard key={t.id} tool={t} />)}
            </div>
          </section>

          <section className="pb-12 md:pb-16">
            <p className={`${SECTION_LABEL_WHY} mb-4 md:mb-5 text-center`}>Why NutterTools?</p>
            <div className="relative overflow-hidden  bg-white dark:bg-[#242424]/90 border border-zinc-200/70 dark:border-zinc-800 px-6 md:px-12 py-8 md:py-10 flex flex-col justify-center soft-shadow">
              <h2 className="text-[30px] md:text-[40px] font-[800] tracking-[-0.03em] text-balance text-center leading-[1.08] text-zinc-900 dark:text-white">Free. Private. No sign-up.</h2>
              <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['100% free forever', 'No paywalls, no trials, no accounts.'],
                  ['Works on any device', 'Desktop, tablet or phone — the same tools, anywhere you are.'],
                  ['Fast & lightweight', 'Every tool opens instantly, ready to use.'],
                  ['Fresh tools, always', 'New utilities added all the time.'],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3.5 text-left">
                      <span className="w-6 h-6  bg-green-500 grid place-items-center shrink-0 mt-0.5 shadow-sm">
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
              <p className={`${SECTION_LABEL_SUPPORT} mb-4 md:mb-5 text-center`}>Support Us</p>
              <div className="relative overflow-hidden  bg-gradient-to-br from-red-800 via-rose-800 to-pink-700 px-6 md:px-12 py-10 md:py-12 soft-shadow flex flex-col justify-center transition-transform duration-300 hover:scale-[1.005]">
                <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute left-1/2 top-1/2 w-[240%] h-[360%] animate-[omni-rotate_24s_linear_infinite]">
                    <div className="w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,#ef4444_0%,#f43f5e_25%,#fb7185_45%,#ec4899_65%,#fda4af_85%,#ef4444_100%)] blur-2xl mix-blend-screen" />
                  </div>
                  <div className="absolute -top-1/3 -left-1/3 w-[80%] h-[160%]">
                    <div className="w-full h-full  bg-[radial-gradient(circle,rgba(255,255,255,0.4),transparent_60%)] blur-2xl mix-blend-screen animate-[omni-aurora-a_16s_ease-in-out_infinite]" />
                  </div>
                  <div className="absolute -bottom-1/3 -right-1/3 w-[80%] h-[160%]">
                    <div className="w-full h-full  bg-[radial-gradient(circle,rgba(244,114,182,0.5),transparent_60%)] blur-2xl mix-blend-screen animate-[omni-aurora-b_20s_ease-in-out_infinite]" />
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
                  className="inline-flex items-center gap-2 mt-8 px-8 h-11 bg-white text-pink-600 font-bold text-[15px]  soft-shadow hover:scale-105 active:scale-95 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                  </svg>
                  Donate with PayPal
                </a>
              </div>
              </div>
            </section>
    </div>
  )
}
