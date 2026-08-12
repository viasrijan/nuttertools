import { useEffect, useMemo, useRef, useState, useId } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutGrid, Lightbulb } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import { textAccent, hueFor } from '../lib/style'
import Logo from './Logo'
import { CutoutCategoryIcon, CutoutToolIcon } from './Icon'
import toolsData from '../data/tools.json'
import Fuse from 'fuse.js'

const TOOLS = toolsData as any[]

const NAV_ORDER = ['text-writing', 'image-tools', 'video-tools', 'color-design', 'pdf-tools', 'ai-tools']

const NAV_LABELS: Record<string, string> = {
  'image-tools': 'Images',
  'pdf-tools': 'PDF',
  'ai-tools': 'AI',
  'text-writing': 'Text',
  'color-design': 'Design',
  'video-tools': 'Video',
}

const VIEW_ALL_LABELS: Record<string, string> = {
  'pdf-tools': 'PDF',
  'text-writing': 'Text',
  'image-tools': 'Image',
  'color-design': 'Design',
  'video-tools': 'Video',
  'ai-tools': 'AI',
}

const POPULAR_CATS = CATEGORIES
  .filter((c) => NAV_ORDER.includes(c.slug))
  .sort((a, b) => NAV_ORDER.indexOf(a.slug) - NAV_ORDER.indexOf(b.slug))

const TITLE_GRAD = 'bg-gradient-to-br from-indigo-500 to-indigo-800 bg-clip-text text-transparent'

function GradientSearchIcon({ className = '' }: { className?: string }) {
  const gid = useId()
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#3730a3" />
        </linearGradient>
      </defs>
      <circle cx="11" cy="11" r="8" stroke={`url(#${gid})`} />
      <path d="m21 21-4.3-4.3" stroke={`url(#${gid})`} />
    </svg>
  )
}

export default function Header({ dark, toggle }: { dark: boolean, toggle: () => void }) {
  const [open, setOpen] = useState<string | null>(null)
  const [mOpen, setMOpen] = useState(false)
  const [sq, setSq] = useState('')
  const [focus, setFocus] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const [menuTop, setMenuTop] = useState(0)
  const [dropTop, setDropTop] = useState(0)
  const [dropLeft, setDropLeft] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
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
      const inPanel = panelRef.current?.contains(t)
      if (navRef.current && !navRef.current.contains(t) && !inPanel) setOpen(null)
      if (searchRef.current && !searchRef.current.contains(t)) setFocus(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mOpen])

  useEffect(() => {
    if (!mOpen) return
    const measure = () => { if (headerRef.current) setMenuTop(headerRef.current.getBoundingClientRect().bottom) }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [mOpen])

  const go = (path: string) => {
    setOpen(null)
    setMOpen(false)
    setSq('')
    setFocus(false)
    navigate(path)
  }

  const catTools = (name: string) => TOOLS.filter((t) => t.category === name)

  const openDrop = (slug: string, e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const hb = headerRef.current?.getBoundingClientRect().bottom ?? 0
    setDropLeft(r.left)
    setDropTop(Math.max(0, hb - r.top))
    setOpen(slug)
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-50 pt-0 sm:pt-8 px-0 sm:px-3.5">
      <div className="mx-auto max-w-[1200px] relative">
        <div className="rounded-none sm:rounded-full border border-transparent bg-[#ececec] lg:bg-white soft-shadow max-lg:dark:bg-[#1a1a1a]">
          <div className="px-4 sm:px-6 pt-3 sm:pt-4 lg:pt-0 lg:h-[68px] lg:flex lg:items-center lg:gap-3">
            <div className="flex items-center justify-between gap-3 lg:contents">
              <Link to="/" onClick={() => setMOpen(false)}
                className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                <Logo size={30} className="w-[30px] h-[30px] lg:w-8 lg:h-8" />
                <span className={`text-[23px] sm:text-[25px] font-extrabold tracking-[-0.03em] ${TITLE_GRAD}`}>
                  NutterTools
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <button onClick={toggle} aria-label="Toggle theme" aria-pressed={dark}
                  className="lg:hidden w-[30px] h-[30px] shrink-0 rounded-full bg-yellow-400 text-white dark:bg-black dark:text-white grid place-items-center transition-colors">
                  <Lightbulb className="w-3.5 h-3.5" strokeWidth={2.4} />
                </button>
                <button onClick={() => setMOpen(!mOpen)} aria-label="Menu"
                  className="lg:hidden w-[30px] h-[30px] shrink-0 rounded-full bg-black dark:bg-white text-white dark:text-black grid place-items-center transition-colors">
                  {mOpen ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M3 3L13 13M13 3L3 13" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M2 3.5h12M2 8h12M2 12.5h12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <nav ref={navRef} className="hidden lg:flex items-center gap-1 flex-1 justify-center min-w-0">
              {POPULAR_CATS.map((c) => {
                const tools = catTools(c.name)
                return (
                  <div key={c.slug} className="relative shrink-0"
                    onMouseEnter={(e) => openDrop(c.slug, e)}
                    onMouseLeave={(e) => {
                      const rel = e.relatedTarget as Node | null
                      if (rel && panelRef.current && panelRef.current.contains(rel)) return
                      setOpen((o) => (o === c.slug ? null : o))
                    }}>
                    <button onClick={() => go(`/tools/${c.slug}`)}
                      className="flex items-center whitespace-nowrap text-[13px] font-semibold px-3.5 py-2 text-zinc-900">
                      {NAV_LABELS[c.slug] || c.name}
                    </button>
                    {open === c.slug && createPortal(
                      <div ref={panelRef} className="fixed z-40" style={{ top: dropTop, left: dropLeft }}>
                        <div className="w-[320px] origin-top border border-transparent bg-white dark:bg-zinc-900 soft-shadow-menu p-2 omni-menu-anim">
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
                              className="mt-1 px-3 py-2 text-[12.5px] font-bold text-[#f97316] hover:bg-zinc-50 dark:hover:bg-zinc-800/80">
                              View all {VIEW_ALL_LABELS[c.slug] || c.name.toLowerCase()} tools →
                            </Link>
                          </div>
                        </div>
                      </div>,
                      document.body
                    )}
                    </div>
                  )
                })}
              <Link to="/tools" onClick={() => go('/tools')}
                className="flex items-center whitespace-nowrap text-[13px] font-semibold px-3.5 py-2 text-[#f97316]">
                All Tools
              </Link>
            </nav>

            <div className="lg:hidden relative mt-2.5 pb-2.5">
              <div className="flex items-center h-9 border border-zinc-200 bg-white rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] max-lg:dark:bg-[#242424] max-lg:dark:border-zinc-800">
                <GradientSearchIcon className="w-3.5 h-3.5 ml-3 shrink-0" />
                <input
                  value={sq}
                  onChange={(e) => setSq(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && results[0]) go(`/tool/${results[0].id}`) }}
                  placeholder="Search any tool..."
                  className="search-input-keep-light flex-1 h-full bg-white border-none outline-none focus:outline-none focus:!shadow-none px-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:bg-[#242424] dark:text-white dark:placeholder:text-zinc-500"
                />
              </div>
              {sq.trim() && (
                <div className="absolute left-0 right-0 top-full mt-2 z-[70] rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#242424] soft-shadow p-2 animate-[omni-drop_0.15s_ease-out]">
                  {results.length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                      {results.map((t) => (
                        <Link key={t.id} to={`/tool/${t.id}`} onClick={() => go(`/tool/${t.id}`)}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 group">
                          <span className="w-[18px] h-[18px] shrink-0">
                            <CutoutToolIcon id={t.id} className="w-full h-full" tone={textAccent(hueFor(t.category))} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[13px] font-semibold leading-tight truncate text-zinc-900 dark:text-white">{t.name}</span>
                            <span className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">{t.category}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-3 py-4 text-center text-[13px] font-medium text-zinc-500 dark:text-zinc-400">No tools match “{sq}”</p>
                  )}
                </div>
              )}
            </div>

            <div ref={searchRef} className="relative shrink-0 hidden lg:block w-[150px] sm:w-[210px] md:w-[250px] xl:w-[300px]">
              <div className="flex items-center h-9 sm:h-10 border border-zinc-200 bg-zinc-100 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                <GradientSearchIcon className="w-4 h-4 ml-3 shrink-0" />
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
          <div className="lg:hidden fixed inset-0 z-[60] bg-[#ececec] dark:bg-[#1a1a1a] overflow-hidden animate-[omni-slide-down_0.2s_ease-out]" style={{ top: menuTop }}>
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-3 pb-4 flex flex-col h-full">
              <div className="flex flex-col flex-1 min-h-0 justify-center">
                {POPULAR_CATS.map((c) => (
                  <button key={c.slug} onClick={() => go(`/tools/${c.slug}`)}
                    className="flex items-center gap-3 px-2 py-2.5 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 text-left transition-colors">
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
                  className="flex items-center gap-3 px-2 py-2.5 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 text-left transition-colors">
                  <span className="w-10 h-10 shrink-0 grid place-items-center bg-black dark:bg-white text-white dark:text-black rounded-full">
                    <LayoutGrid className="w-5 h-5" strokeWidth={2.2} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-semibold leading-tight text-zinc-900 dark:text-white">All Tools</span>
                    <span className="block text-[12px] font-medium text-zinc-900/70 dark:text-zinc-100/70 mt-0.5">Everything at once</span>
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <a href="https://www.paypal.me/iSrijan" target="_blank" rel="noreferrer"
                  className="flex-1 h-11 grid place-items-center bg-gradient-to-r from-red-600 to-pink-600 text-white text-[14px] font-bold hover:opacity-90 transition-opacity">
                  Donate
                </a>
                <a href="https://github.com/viasrijan/nuttertools" target="_blank" rel="noreferrer"
                  className="flex-1 h-11 grid place-items-center border border-zinc-300 dark:border-zinc-700 text-[14px] font-semibold text-zinc-900 dark:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
)
}
