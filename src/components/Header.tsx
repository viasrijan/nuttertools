import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sun } from 'lucide-react'
import { GROUPS } from '../data/categories'
import Logo from './Logo'
import { CutoutCategoryIcon } from './Icon'

export default function Header({ dark, toggle }: { dark: boolean, toggle: () => void }) {
  const [open, setOpen] = useState<string | null>(null)
  const [mOpen, setMOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const go = (path: string) => {
    setOpen(null)
    setMOpen(false)
    navigate(path)
  }

  return (
    <header className="sticky top-0 z-50 pt-3 sm:pt-4 px-4 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-gradient-to-r from-white/95 via-white/90 to-sky-100/70 dark:from-zinc-950/95 dark:via-zinc-950/90 dark:to-indigo-950/70 backdrop-blur-xl shadow-lg shadow-zinc-900/[0.04] dark:shadow-black/30">
          <div className="px-2.5 sm:px-5 h-[52px] sm:h-[56px] flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMOpen(false)}>
              <Logo size={24} />
              <span className="text-[19px] font-extrabold tracking-[-0.03em] hidden sm:block text-sky-500 dark:text-sky-300">
                OmniTools
              </span>
            </Link>

            <nav ref={navRef} className="hidden lg:flex items-center gap-0.5">
              {GROUPS.map((g) => (
                <div key={g.id} className="relative"
                  onMouseEnter={() => setOpen(g.id)}
                  onMouseLeave={() => setOpen((o) => (o === g.id ? null : o))}>
                  <button onClick={() => setOpen(open === g.id ? null : g.id)}
                    className={`flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 transition-colors ${open === g.id ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-900 dark:text-white hover:text-sky-500 dark:hover:text-sky-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70'}`}>
                    {g.label}
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open === g.id ? 'rotate-180' : ''}`}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {open === g.id && (
                    <div className="absolute left-0 top-full pt-2">
                      <div className="w-[340px] origin-top rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/10 dark:shadow-black/50 p-2 animate-[omni-drop_0.15s_ease-out]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-500 dark:text-sky-300 px-3 pt-1 pb-1.5">{g.label}</p>
                        <div className="flex flex-col gap-0.5">
                          {g.categories.map((c) => (
                            <Link key={c.slug} to={`/tools/${c.slug}`} onClick={() => setOpen(null)}
                              className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 group">
                              <span className="w-9 h-9 shrink-0">
                                <CutoutCategoryIcon slug={c.slug} className="w-full h-full" />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block text-[13.5px] font-semibold leading-tight truncate text-zinc-900 dark:text-white">{c.name}</span>
                                <span className="block text-[11px] font-medium text-zinc-900 dark:text-zinc-100">{c.count} tools</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <Sun className="w-[15px] h-[15px] text-sky-500 dark:text-sky-300" strokeWidth={2.2} aria-hidden="true" />
              <button onClick={toggle} aria-label="Toggle theme" aria-pressed={dark}
                className={`w-9 h-5 shrink-0 rounded-full transition-colors duration-300 ${dark ? 'bg-sky-400' : 'bg-zinc-300'} ring-1 ring-inset ring-black/10 dark:ring-white/20 hover:scale-105 active:scale-90 transition-transform`} />
              <button onClick={() => setMOpen(!mOpen)} aria-label="Menu" className="lg:hidden w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 grid place-items-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  {mOpen ? <path d="M3 3L13 13M13 3L3 13" /> : <path d="M2 3.5h12M2 8h12M2 12.5h12" />}
                </svg>
              </button>
            </div>
          </div>

          {mOpen && (
            <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 max-h-[calc(100dvh-110px)] overflow-y-auto rounded-b-2xl animate-[omni-drop_0.2s_ease-out]">
              <div className="px-3 sm:px-5 py-3 space-y-4">
                {GROUPS.map((g) => (
                  <div key={g.id}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-500 dark:text-sky-300 mb-1.5 px-1">{g.label}</p>
                    <div className="flex flex-col gap-0.5">
                      {g.categories.map((c) => (
                        <button key={c.slug} onClick={() => go(`/tools/${c.slug}`)}
                          className="flex items-center gap-3 px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-left active:scale-[0.98] transition-transform">
                          <span className="w-9 h-9 shrink-0">
                            <CutoutCategoryIcon slug={c.slug} className="w-full h-full" />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[13px] font-medium leading-tight truncate text-zinc-900 dark:text-white">{c.name}</span>
                            <span className="block text-[11px] font-medium text-zinc-900 dark:text-zinc-100">{c.count}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
