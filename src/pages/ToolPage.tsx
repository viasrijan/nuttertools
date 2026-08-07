import { Suspense, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES } from '../data/categories'
import { hueFor, textAccent, tileGrad } from '../lib/style'
import { CutoutToolIcon, whiteToolIconUrl } from '../components/Icon'
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
      <nav className="flex items-center gap-2 text-[13px] font-medium text-zinc-900 dark:text-white pt-6 md:pt-8">
        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Home</Link>
        <span>/</span>
        {cat && <Link to={`/tools/${cat.slug}`} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{cat.name}</Link>}
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100 truncate max-w-[180px] sm:max-w-none">{tool.name}</span>
      </nav>

      <div className="pt-8 pb-8 md:pt-10 md:pb-10 flex items-center gap-3 md:gap-4">
        <span className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${tileGrad(h)} grid place-items-center shrink-0 shadow-lg ring-1 ring-black/10 dark:ring-white/20`}>
          <img src={whiteToolIconUrl(tool.id)} alt="" className="w-7 h-7 md:w-8 md:h-8" draggable={false} />
        </span>
        <div className="min-w-0">
          <h1 className="text-[22px] md:text-[36px] font-[800] tracking-[-0.03em] leading-none text-balance">{tool.name}</h1>
          <p className="text-zinc-900 dark:text-white mt-2.5 text-[14.5px] font-medium text-pretty">{tool.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 pb-24">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800  p-6 md:p-8 min-h-[400px] soft-shadow">
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

        <aside className="space-y-6">
          {related.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400 mb-2.5">More in {tool.category}</h4>
              <div className="space-y-0.5">
                {related.map((t) => (
                  <Link key={t.id} to={`/tool/${t.id}`}
                    className="flex items-center gap-3 px-2 py-2  hover:bg-zinc-50 dark:hover:bg-zinc-800/80 group">
                    <span className="w-9 h-9 shrink-0">
                      <CutoutToolIcon id={t.id} className="w-full h-full" tone={textAccent(hueFor(t.category))} />
                    </span>
                    <span className="flex-1 text-[13.5px] font-medium truncate group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {cat && (
            <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400 mb-2.5">All sections</h4>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.slice(0, 8).map((c) => (
                  <Link key={c.slug} to={`/tools/${c.slug}`}
                    className="px-3 h-8  text-[12px] font-medium bg-white dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 grid place-items-center hover:ring-zinc-300 dark:hover:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
