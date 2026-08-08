import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Lightbulb, Search } from 'lucide-react'
import { CATEGORIES, GROUPS } from '../data/categories'
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
    <header className="sticky top-0 z-50 pt-5 sm:pt-8 px-1.5 sm:px-3.5">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-full border border-transparent bg-white soft-shadow">
          <div className="px-2.5 sm:px-6 h-[56px] sm:h-[68px] flex items-center gap-2 sm:gap-3">
            <button onClick={() => setMOpen(!mOpen)} aria-label="Menu"
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 shrink-0 grid place-items-center text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 3.5h12M2 8h12M2 12.5h12" />
              </svg>
            </button>

            <Link to="/" onClick={() => setMOpen(false)}
              className={`flex items-center gap-2.5 sm:gap-3 shrink-0 flex-1 justify-center lg:flex-none lg:justify-start ${mOpen ? 'invisible' : ''}`}>
              <Logo size={32} className="w-8 h-8 sm:w-9 sm:h-9" />
              <span className="text-[21px] sm:text-[25px] font-extrabold tracking-[-0.03em] text-[#4454c9]">
                NutterTools
              </span>
            </Link>

            <nav ref={navRef} className="hidden lg:flex items-center gap-0.5 flex-1 justify-center min-w-0">
              {POPULAR_CATS.map((c) => {
                const tools = catTools(c.name)
                return (
                  <div key={c.slug} className="relative shrink-0"
                    onMouseEnter={() => setOpen(c.slug)}
                    onMouseLeave={() => setOpen((o) => (o === c.slug ? null : o))}>
                    <button onClick={() => setOpen(open === c.slug ? null : c.slug)}
                      className="flex items-center gap-1 whitespace-nowrap text-[13px] font-semibold px-2 py-2 text-zinc-900">
                      {NAV_LABELS[c.slug] || c.name}
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open === c.slug ? 'rotate-180' : ''}`}>
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
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
            </nav>

            <div ref={searchRef} className="relative shrink-0 w-[150px] sm:w-[210px] md:w-[250px] xl:w-[300px]">
              <div className="flex items-center h-9 sm:h-10 border border-[#4454c9] bg-white dark:bg-white rounded-full overflow-hidden">
                <Search className="w-4 h-4 ml-3 shrink-0 text-[#4454c9]" strokeWidth={2.2} />
                <input
                  value={sq}
                  onChange={(e) => setSq(e.target.value)}
                  onFocus={() => setFocus(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(`/tool/${results[0].id}`) }}
                  placeholder="Search any tool..."
                  className="flex-1 h-full bg-white dark:bg-white border-none outline-none focus:outline-none focus:!shadow-none px-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:placeholder:text-zinc-400"
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
              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-yellow-400 text-white border border-zinc-300 dark:bg-black dark:text-white dark:border-transparent grid place-items-center transition-colors">
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>

      {mOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-[#f5f5f5] dark:bg-[#1a1a1a] overflow-y-auto animate-[omni-drop_0.2s_ease-out]">
          <div className="px-4 sm:px-6 pt-5 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.5">
              <Logo size={30} />
              <span className="text-[23px] font-extrabold tracking-[-0.03em] text-[#4454c9]">NutterTools</span>
            </span>
            <button onClick={() => setMOpen(false)} aria-label="Close menu"
              className="w-10 h-10 shrink-0 rounded-full bg-black dark:bg-white text-white dark:text-black grid place-items-center transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 3L13 13M13 3L3 13" />
              </svg>
            </button>
          </div>

          <div className="px-4 sm:px-6 pt-5">
            <div className="flex items-center h-11 border border-[#4454c9] bg-white dark:bg-white rounded-full overflow-hidden">
              <Search className="w-4 h-4 ml-3 shrink-0 text-[#4454c9]" strokeWidth={2.2} />
              <input
                value={sq}
                onChange={(e) => setSq(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(`/tool/${results[0].id}`) }}
                placeholder="Search any tool..."
                className="flex-1 h-full bg-white dark:bg-white border-none outline-none focus:outline-none focus:!shadow-none px-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:placeholder:text-zinc-400"
              />
            </div>
            {results.length > 0 && (
              <div className="mt-2 flex flex-col">
                {results.map((t) => (
                  <button key={t.id} onClick={() => go(`/tool/${t.id}`)}
                    className="flex items-center gap-3 px-2 py-2.5 text-left hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80">
                    <span className="w-8 h-8 shrink-0">
                      <CutoutToolIcon id={t.id} className="w-full h-full" tone={textAccent(hueFor(t.category))} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[14px] font-semibold leading-tight text-zinc-900 dark:text-white">{t.name}</span>
                      <span className="block text-[12px] font-medium text-zinc-900/70 dark:text-zinc-100/70">{t.category}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 sm:px-6 py-6 space-y-8">
            {GROUPS.map((g) => (
              <div key={g.id}>
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-green-600 dark:text-green-400 mb-2 px-1">{g.label}</p>
                <div className="flex flex-col">
                  {g.categories.map((c) => (
                    <button key={c.slug} onClick={() => go(`/tools/${c.slug}`)}
                      className="flex items-center gap-3 px-2 py-3 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 text-left transition-colors">
                      <span className="w-10 h-10 shrink-0">
                        <CutoutCategoryIcon slug={c.slug} className="w-full h-full" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-semibold leading-tight text-zinc-900 dark:text-white">{c.name}</span>
                        <span className="block text-[12px] font-medium text-zinc-900/70 dark:text-zinc-100/70 mt-0.5">{c.count} tools</span>
                      </span>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-zinc-900/50 dark:text-zinc-100/50 shrink-0">
                        <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 sm:px-6 pb-10 flex items-center gap-3">
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
    </header>
  )
}
