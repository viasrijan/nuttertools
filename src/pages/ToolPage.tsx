import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { CATEGORIES } from '../data/categories'
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
        <p className="text-zinc-500">Tool not found.</p>
        <Link to="/" className="inline-block mt-3 text-indigo-600 dark:text-indigo-400 font-medium underline">Back to home</Link>
      </div>
    )
  }

  const Comp = registry[tool.id]
  const cat = CATEGORIES.find((c) => c.name === tool.category)
  const related = (toolsData as any[])
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .slice(0, 6)

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
      <nav className="flex items-center gap-2 text-[13px] text-zinc-500 pt-6">
        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Home</Link>
        <span>/</span>
        {cat && <Link to={`/tools/${cat.slug}`} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{cat.name}</Link>}
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-100">{tool.name}</span>
      </nav>

      <div className="pt-8 pb-10 flex items-center gap-4">
        <span className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 grid place-items-center text-[26px]">{tool.icon}</span>
        <div>
          <h1 className="text-[30px] md:text-[34px] font-[800] tracking-[-0.03em] leading-none">{tool.name}</h1>
          <p className="text-zinc-500 mt-2 text-[15px]">{tool.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 pb-20">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 md:p-6 min-h-[400px]">
          {Comp ? <Comp /> : (
            <div className="py-20 text-center">
              <div className="text-4xl">🚧</div>
              <h3 className="font-semibold mt-3">Coming Soon</h3>
              <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">This tool is on its way. Check back soon.</p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          {related.length > 0 && (
            <div>
              <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-zinc-400 mb-3">More in {tool.category}</h4>
              <div className="space-y-1">
                {related.map((t) => (
                  <Link key={t.id} to={`/tool/${t.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/80 group">
                    <span className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 grid place-items-center text-[14px]">{t.icon}</span>
                    <span className="flex-1 text-[14px] font-medium truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {cat && (
            <div className="pt-5 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-zinc-400 mb-3">All sections</h4>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.slice(0, 8).map((c) => (
                  <Link key={c.slug} to={`/tools/${c.slug}`}
                    className="px-3 h-8 rounded-full text-[12px] font-medium border border-zinc-200 dark:border-zinc-800 grid place-items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors">
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
