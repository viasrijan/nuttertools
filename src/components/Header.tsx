import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutGrid, Lightbulb, Search } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { textAccent, hueFor } from '../lib/style'
import Logo from './Logo'
import { CutoutCategoryIcon, CutoutToolIcon } from './Icon'
import toolsData from '../data/tools.json'
import Fuse from 'fuse.js'

const TOOLS = toolsData as any[]

const NAV_ORDER = ['developer-tools', 'pdf-tools', 'text-writing', 'image-tools', 'color-design', 'video-tools']

const NAV_LABELS: Record<string, string> = {
  'image-tools': 'Images',
  'pdf-tools': 'PDFs',
  'developer-tools': 'Dev',
  'text-writing': 'Text',
  'color-design': 'Design',
  'video-tools': 'Video',
}

const VIEW_ALL_LABELS: Record<string, string> = {
  'developer-tools': 'dev',
  'pdf-tools': 'pdf',
  'text-writing': 'text',
  'image-tools': 'image',
  'color-design': 'design',
  'video-tools': 'video',
}

const POPULAR_CATS = CATEGORIES
  .filter((c) => NAV_ORDER.includes(c.slug))
  .sort((a, b) => NAV_ORDER.indexOf(a.slug) - NAV_ORDER.indexOf(b.slug))

export default function Header({ dark, toggle }: { dark: boolean, toggle: () => void }) {
  const [open, setOpen] = useState<string | null>(null)
  const [mOpen, setMOpen] = useState(false)
  const [sq, setSq] = useState('')
  const [focus, setFocus] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const fuse = useMemo(() => new Fuse(TOOLS, { keys: ['name', 'desc', 'category'], threshold: 0.3 }), [])
  const results = sq.trim() ? fuse.search(sq.trim()).map((r) => r.item).slice(0, 8) : []

  useEffect(() => {
    setOpen(null)
    setMOpen(false)
    setSq('')
    setFocus(false)
  }, [location.pathname])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const t = e.target as Node
      if (navRef.current && !navRef.current.contains(t)) setOpen(null)
      if (searchRef.current && !searchRef.current.contains(t)) setFocus(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mOpen])

  const go = (path: string) => {
    setOpen(null)
    setMOpen(false)
    setSq('')
    setFocus(false)
    navigate(path)
  }

  const catTools = (name: string) => TOOLS.filter((t) => t.category === name)

  return (
    <header className="sticky top-0 z-50 pt-0 sm:pt-8 px-0 sm:px-3.5">
      <div className="mx-auto max-w-[1200px] relative">
        <div className="rounded-none sm:rounded-full border border-transparent bg-white soft-shadow">
          <div className="px-4 sm:px-6 pt-5 lg:pt-0 lg:h-[68px] lg:flex lg:items-center lg:gap-3">
            <div className="flex items-center justify-between gap-3 lg:contents">
              <Link to="/" onClick={() => setMOpen(false)}
                className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                <Logo size={30} className="w-[30px] h-[30px] lg:w-8 lg:h-8" />
                <span className="text-[23px] sm:text-[25px] font-extrabold tracking-[-0.03em] text-[#4454c9]">
                  NutterTools
                </span>
              </Link>
              <button onClick={() => setMOpen(!mOpen)} aria-label="Menu"
                className="lg:hidden w-10 h-10 shrink-0 rounded-full bg-black dark:bg-white text-white dark:text-black grid place-items-center transition-colors">
                {mOpen ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M3 3L13 13M13 3L3 13" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M2 3.5h12M2 8h12M2 12.5h12" />
                  </svg>
                )}
              </button>
            </div>

            <nav ref={navRef} className="hidden lg:flex items-center gap-1 flex-1 justify-center min-w-0">
              {POPULAR_CATS.map((c) => {
                const tools = catTools(c.name)
                return (
                  <div key={c.slug} className="relative shrink-0"
                    onMouseEnter={() => setOpen(c.slug)}
                    onMouseLeave={() => setOpen((o) => (o === c.slug ? null : o))}>
                    <button onClick={() => setOpen(open === c.slug ? null : c.slug)}
                      className="flex items-center whitespace-nowrap text-[13px] font-semibold px-3.5 py-2 text-zinc-900">
                      {NAV_LABELS[c.slug] || c.name}
                    </button>
                    {open === c.slug && (
                      <div className="absolute left-0 top-full pt-2">
                        <div className="w-[320px] origin-top rounded-3xl border border-transparent bg-white dark:bg-zinc-900 soft-shadow p-2 animate-[omni-drop_0.15s_ease-out]">
                          <div className="flex flex-col gap-0.5">
                            {tools.slice(0, 8).map((t) => (
                              <Link key={t.id} to={`/tool/${t.id}`} onClick={() => go(`/tool/${t.id}`)}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 group">
                                <span className="w-[18px] h-[18px] shrink-0">
                                  <CutoutToolIcon id={t.id} className="w-full h-full" tone={textAccent(hueFor(t.category))} />
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className="block text-[13px] font-semibold leading-tight truncate text-zinc-900 dark:text-white">{t.name}</span>
                                </span>
                              </Link>
                            ))}
                            <Link to={`/tools/${c.slug}`} onClick={() => go(`/tools/${c.slug}`)}
                              className="mt-1 px-3 py-2 text-[12.5px] font-bold text-green-700 dark:text-green-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/80">
                              View all {VIEW_ALL_LABELS[c.slug] || c.name.toLowerCase()} tools →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                  )
                })}
              <Link to="/tools" onClick={() => go('/tools')}
                className="flex items-center whitespace-nowrap text-[13px] font-semibold px-3.5 py-2 text-zinc-900">
                All Tools
              </Link>
            </nav>

            <div className="lg:hidden relative mt-5 pb-5">
              <div className="flex items-center h-11 border border-zinc-200 bg-zinc-100 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <Search className="w-4 h-4 ml-3 shrink-0 text-[#4454c9]" strokeWidth={2.2} />
                <input
                  value={sq}
                  onChange={(e) => setSq(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(`/tool/${results[0].id}`) }}
                  placeholder="Search any tool..."
                  className="search-input-keep-light flex-1 h-full bg-zinc-100 border-none outline-none focus:outline-none focus:!shadow-none px-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:!bg-zinc-100 dark:!text-zinc-900 dark:placeholder:!text-zinc-400"
                />
              </div>
              {sq.trim() && (
                <div className="absolute left-0 right-0 top-full mt-2 z-[70] rounded-3xl border border-zinc-200 bg-white dark:bg-white soft-shadow p-2 animate-[omni-drop_0.15s_ease-out]">
                  {results.length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                      {results.map((t) => (
                        <Link key={t.id} to={`/tool/${t.id}`} onClick={() => go(`/tool/${t.id}`)}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 group">
                          <span className="w-[18px] h-[18px] shrink-0">
                            <CutoutToolIcon id={t.id} className="w-full h-full" tone={textAccent(hueFor(t.category))} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[13px] font-semibold leading-tight truncate text-zinc-900">{t.name}</span>
                            <span className="block text-[11px] font-medium text-zinc-500 truncate">{t.category}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-3 py-4 text-center text-[13px] font-medium text-zinc-500">No tools match “{sq}”</p>
                  )}
                </div>
              )}
            </div>

            <div ref={searchRef} className="relative shrink-0 hidden lg:block w-[150px] sm:w-[210px] md:w-[250px] xl:w-[300px]">
              <div className="flex items-center h-9 sm:h-10 border border-zinc-200 bg-zinc-100 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <Search className="w-4 h-4 ml-3 shrink-0 text-[#4454c9]" strokeWidth={2.2} />
                <input
                  value={sq}
                  onChange={(e) => setSq(e.target.value)}
                  onFocus={() => setFocus(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(`/tool/${results[0].id}`) }}
                  placeholder="Search any tool..."
                  className="search-input-keep-light flex-1 h-full bg-zinc-100 border-none outline-none focus:outline-none focus:!shadow-none px-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:!bg-zinc-100 dark:!text-zinc-900 dark:placeholder:!text-zinc-400"
                />
              </div>
              {focus && sq.trim() && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-3xl border border-zinc-200 bg-white dark:bg-white soft-shadow p-2 animate-[omni-drop_0.15s_ease-out]">
                  {results.length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                      {results.map((t) => (
                        <Link key={t.id} to={`/tool/${t.id}`} onClick={() => go(`/tool/${t.id}`)}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 group">
                          <span className="w-[18px] h-[18px] shrink-0">
                            <CutoutToolIcon id={t.id} className="w-full h-full" tone={textAccent(hueFor(t.category))} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[13px] font-semibold leading-tight truncate text-zinc-900">{t.name}</span>
                            <span className="block text-[11px] font-medium text-zinc-500 truncate">{t.category}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-3 py-4 text-center text-[13px] font-medium text-zinc-500">No tools match “{sq}”</p>
                  )}
                </div>
              )}
            </div>

            <button onClick={toggle} aria-label="Toggle theme" aria-pressed={dark}
              className="hidden lg:grid w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-yellow-400 text-white dark:bg-black dark:text-white place-items-center transition-colors">
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.4} />
            </button>
          </div>

          </div>

        {mOpen && (
          <div className="lg:hidden absolute inset-x-0 top-full mt-2 z-[60] rounded-3xl bg-[#f5f5f5] dark:bg-[#1a1a1a] soft-shadow overflow-y-auto max-h-[calc(100dvh-170px)] animate-[omni-drop_0.2s_ease-out]">
            <div className="px-4 sm:px-6 pt-3 pb-1 flex flex-col">
              {POPULAR_CATS.map((c) => (
                <button key={c.slug} onClick={() => go(`/tools/${c.slug}`)}
                  className="flex items-center gap-3 px-2 py-3.5 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 text-left transition-colors">
                  <span className="w-10 h-10 shrink-0">
                    <CutoutCategoryIcon slug={c.slug} className="w-full h-full" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-semibold leading-tight text-zinc-900 dark:text-white">{NAV_LABELS[c.slug] || c.name}</span>
                    <span className="block text-[12px] font-medium text-zinc-900/70 dark:text-zinc-100/70 mt-0.5">{c.count} tools</span>
                  </span>
                </button>
              ))}
              <button onClick={() => go('/tools')}
                className="flex items-center gap-3 px-2 py-3.5 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 text-left transition-colors">
                <span className="w-10 h-10 shrink-0 grid place-items-center bg-black dark:bg-white text-white dark:text-black rounded-full">
                  <LayoutGrid className="w-5 h-5" strokeWidth={2.2} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-semibold leading-tight text-zinc-900 dark:text-white">All Tools</span>
                  <span className="block text-[12px] font-medium text-zinc-900/70 dark:text-zinc-100/70 mt-0.5">Everything at once</span>
                </span>
              </button>
            </div>

            <div className="px-4 sm:px-6 pb-5 pt-3 flex items-center gap-3">
              <a href="https://www.paypal.me/iSrijan" target="_blank" rel="noreferrer"
                className="flex-1 h-11 grid place-items-center bg-red-600 text-white text-[14px] font-bold hover:opacity-90 transition-opacity">
                Donate
              </a>
              <a href="https://github.com/viasrijan/nuttertools" target="_blank" rel="noreferrer"
                className="h-11 px-6 grid place-items-center border border-zinc-300 dark:border-zinc-700 text-[14px] font-semibold text-zinc-900 dark:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
)
}
