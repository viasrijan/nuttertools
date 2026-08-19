import { Suspense, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { TOOL_INFO } from '../data/toolInfo'
import { CATEGORIES } from '../data/categories'
import { hueFor, tileGrad } from '../lib/style'
import { whiteToolIconUrl, ToolIcon } from '../components/Icon'
import ToolCard from '../components/ToolCard'
import registry from '../tools/registry'

function ToolIconFallback({ id, className }: { id: string, className?: string }) {
  const [broken, setBroken] = useState(false)
  if (broken) return <ToolIcon id={id} className={`${className} text-white`} />
  return <img src={whiteToolIconUrl(id)} alt="" className={className} draggable={false} onError={() => setBroken(true)} />
}

export default function ToolPage() {
  const { id } = useParams()
  const tool = (toolsData as any[]).find((t) => t.id === id)

  useEffect(() => {
    if (!id) return
    const rec = JSON.parse(localStorage.getItem('recent') || '[]')
    const n = [id, ...rec.filter((x: string) => x !== id)].slice(0, 6)
    localStorage.setItem('recent', JSON.stringify(n))
  }, [id])

  useEffect(() => {
    if (!tool) return
    document.title = `${tool.name} - Free ${tool.category} tool | NutterTools`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = `${tool.desc}. 100% free, private and no sign-up needed.`
    return () => { document.title = 'NutterTools' }
  }, [tool])

  if (!tool) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-24 text-center">
        <p className="text-zinc-900 dark:text-white font-medium">Tool not found.</p>
        <Link to="/" className="inline-block mt-3 text-green-600 dark:text-green-400 font-medium underline">Back to home</Link>
      </div>
    )
  }

  const Comp = registry[tool.id]
  const cat = CATEGORIES.find((c) => c.name === tool.category)
  const h = hueFor(tool.category)
  const related = (toolsData as any[])
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 6)

  return (
    <div className="tool-page max-w-[1200px] mx-auto px-5 sm:px-6 animate-[omni-fade_0.35s_ease-out]">
      <nav className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 pt-6 md:pt-8">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
        <span aria-hidden className="text-zinc-300 dark:text-zinc-600">/</span>
        {cat && <Link to={`/tools/${cat.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{cat.name}</Link>}
        <span aria-hidden className="text-zinc-300 dark:text-zinc-600">/</span>
        <span className="text-zinc-900 dark:text-zinc-100 truncate max-w-[180px] sm:max-w-none">{tool.name}</span>
      </nav>

      <div className="pt-8 pb-8 md:pt-10 md:pb-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 md:gap-4">
        <span className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${tileGrad(h)} grid place-items-center shrink-0 shadow-lg ring-1 ring-black/10 dark:ring-white/20`}>
          <ToolIconFallback id={tool.id} className="w-7 h-7 md:w-8 md:h-8" />
        </span>
        <div className="min-w-0">
          <h1 className="text-[22px] md:text-[36px] font-[800] tracking-[-0.03em] leading-none text-balance">{tool.name}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2.5 text-[14.5px] font-medium text-pretty">{tool.desc}</p>
        </div>
      </div>

      <div className="relative  bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 p-6 md:p-10 min-h-[400px] soft-shadow mb-12 overflow-hidden omni-rise">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-48 bg-indigo-400/[0.07] blur-3xl" />
        <div className="relative">
          {Comp ? (
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center gap-4 py-24">
                <span className="w-10 h-10 border-[3px] border-zinc-200 dark:border-zinc-700 border-t-indigo-500 dark:border-t-indigo-400 animate-spin" />
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Loading tool…</p>
              </div>
            }>
              <Comp />
            </Suspense>
          ) : (
            <div className="py-20 text-center omni-pop">
              <div className="text-4xl">🚧</div>
              <h3 className="font-semibold mt-3">Coming Soon</h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">This tool is on its way. Check back soon.</p>
            </div>
          )}
        </div>
      </div>

      {(() => {
        const info = TOOL_INFO[tool.id]
        if (!info) {
          return (
            <section className="pb-14 max-w-3xl">
              <div className="space-y-8">
                <div>
                  <h4 className="text-[24px] md:text-[35px] font-extrabold tracking-[-0.02em] text-zinc-900 dark:text-white mb-4">What is {tool.name}?</h4>
                  <p className="text-[16px] font-medium text-zinc-900 dark:text-white leading-relaxed">{tool.desc}</p>
                  <p className="mt-3 text-[15px] font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {tool.name} runs entirely in your browser — your files and text never leave your device, no sign-up required, and it is free forever.
                  </p>
                </div>
              </div>
            </section>
          )
        }
        return (
          <section className="pb-14 max-w-3xl">
            <div className="space-y-8">
              <div>
                <h4 className="text-[24px] md:text-[35px] font-extrabold tracking-[-0.02em] text-zinc-900 dark:text-white mb-4">What is {tool.name}?</h4>
                <p className="text-[16px] font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">{info.whatIs}</p>
              </div>
              {info.howTo.length > 0 && (
                <div>
                  <h4 className="text-[24px] md:text-[35px] font-extrabold tracking-[-0.02em] text-zinc-900 dark:text-white mb-4">How to use it:</h4>
                  <ol className="space-y-3">
                    {info.howTo.map((step, i) => (
                      <li key={i} className="flex gap-3 text-[16px] font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        <span className="shrink-0 w-5 h-5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center text-[10px] font-bold shadow-[0_2px_8px_-2px_rgba(99,102,241,0.6)]">{i + 1}</span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {info.faqs && info.faqs.length > 0 && (
                <div>
                  <h4 className="text-[24px] md:text-[35px] font-extrabold tracking-[-0.02em] text-zinc-900 dark:text-white mb-4">Frequently asked questions</h4>
                  <div className="space-y-2.5">
                    {info.faqs.map((f, i) => (
                      <details key={i} className="group border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 soft-shadow transition-colors duration-200 hover:border-zinc-300 dark:hover:border-zinc-700">
                        <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-5 py-4 text-[14.5px] font-semibold text-zinc-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                          {f.q}
                          <span className="shrink-0 w-6 h-6 bg-zinc-100 dark:bg-zinc-800 grid place-items-center transition-transform duration-300 group-open:rotate-180">
                            <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                          </span>
                        </summary>
                        <p className="px-5 pb-5 text-[14.5px] font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )
      })()}

      {related.length > 0 && (
        <section className="pb-12">
          <h4 className="text-[24px] md:text-[35px] font-extrabold tracking-[-0.02em] text-zinc-900 dark:text-white text-center mb-5 md:mb-6">More in {tool.category}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {related.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        </section>
      )}

      {cat && (
        <section className="pb-24">
          <h4 className="text-[24px] md:text-[35px] font-extrabold tracking-[-0.02em] text-zinc-900 dark:text-white text-center mb-5 md:mb-6">All sections</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/tools/${c.slug}`}
                className={`group relative overflow-hidden p-4 md:p-5 ${tileGrad(c.hue)} soft-shadow transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)] flex flex-col items-center text-center ${c.slug === cat.slug ? 'ring-2 ring-white dark:ring-white/70' : ''}`}>
                <div aria-hidden className="absolute -top-10 -right-10 w-32 h-32 bg-white/15 blur-2xl group-hover:bg-white/30 group-hover:scale-125 transition-all duration-500" />
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/25" />
                <span className="relative w-10 h-10 bg-white/25 backdrop-blur-sm grid place-items-center text-[15px] font-bold text-white tabular-nums shadow-sm transition-transform duration-300 group-hover:scale-110">{c.count}</span>
                <h3 className="relative mt-3 font-bold text-[15px] tracking-[-0.01em] text-white">{c.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
