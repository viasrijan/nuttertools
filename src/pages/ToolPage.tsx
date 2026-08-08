import { Suspense, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES } from '../data/categories'
import { hueFor, tileGrad } from '../lib/style'
import { whiteToolIconUrl } from '../components/Icon'
import ToolCard from '../components/ToolCard'
import registry from '../tools/registry'

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
    return () => { document.title = 'NutterTools - All useful tools in one place' }
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
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
      <nav className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-[13px] font-medium text-zinc-900 dark:text-white pt-6 md:pt-8">
        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Home</Link>
        <span>/</span>
        {cat && <Link to={`/tools/${cat.slug}`} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{cat.name}</Link>}
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100 truncate max-w-[180px] sm:max-w-none">{tool.name}</span>
      </nav>

      <div className="pt-8 pb-8 md:pt-10 md:pb-10 flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 md:gap-4">
        <span className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${tileGrad(h)} grid place-items-center shrink-0 shadow-lg ring-1 ring-black/10 dark:ring-white/20`}>
          <img src={whiteToolIconUrl(tool.id)} alt="" className="w-7 h-7 md:w-8 md:h-8" draggable={false} />
        </span>
        <div className="min-w-0">
          <h1 className="text-[22px] md:text-[36px] font-[800] tracking-[-0.03em] leading-none text-balance">{tool.name}</h1>
          <p className="text-zinc-900 dark:text-white mt-2.5 text-[14.5px] font-medium text-pretty">{tool.desc}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-transparent p-6 md:p-8 min-h-[400px] soft-shadow mb-12">
        {Comp ? (
          <Suspense fallback={
            <div className="flex items-center justify-center py-24">
              <span className="w-10 h-10 rounded-full border-[3px] border-zinc-200 dark:border-zinc-700 border-t-green-500 dark:border-t-green-400 animate-spin" />
            </div>
          }>
            <Comp />
          </Suspense>
        ) : (
          <div className="py-20 text-center">
            <div className="text-4xl">🚧</div>
            <h3 className="font-semibold mt-3">Coming Soon</h3>
            <p className="text-sm font-medium text-zinc-900 dark:text-white mt-1 max-w-sm mx-auto">This tool is on its way. Check back soon.</p>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="pb-12">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400 mb-4">More in {tool.category}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {related.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        </section>
      )}

      {cat && (
        <section className="pb-24">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400 mb-4">All sections</h4>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/tools/${c.slug}`}
                className={`px-3 h-8 text-[12px] font-medium bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 grid place-items-center hover:ring-zinc-300 dark:hover:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all ${c.slug === cat.slug ? 'ring-[#4454c9] text-[#4454c9]' : ''}`}>
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
