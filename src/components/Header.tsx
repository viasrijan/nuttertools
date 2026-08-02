import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GROUPS } from '../data/categories'
import { tile } from '../lib/style'
import Logo from './Logo'

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
    <header className="sticky top-0 z-50 pt-2 sm:pt-3 px-2 sm:px-4">
      <div className="mx-auto max-w-[1180px]">
        <div className={`rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl shadow-lg shadow-zinc-900/[0.04] dark:shadow-black/30 ${mOpen ? 'rounded-b-2xl' : ''}`}>
          <div className="px-3 sm:px-4 h-14 flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMOpen(false)}>
              <Logo size={30} />
              <span className="font-bold text-[18px] tracking-[-0.02em] hidden sm:block">OmniTools</span>
            </Link>

            <nav ref={navRef} className="hidden lg:flex items-center gap-0.5">
              {GROUPS.map((g) => (
                <div key={g.id} className="relative"
                  onMouseEnter={() => setOpen(g.id)}
                  onMouseLeave={() => setOpen((o) => (o === g.id ? null : o))}>
                  <button onClick={() => setOpen(open === g.id ? null : g.id)}
                    className={`flex items-center gap-1.5 text-[13.5px] font-medium px-3.5 py-2 rounded-full transition-colors ${open === g.id ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70'}`}>
                    {g.label}
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open === g.id ? 'rotate-180' : ''}`}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {open === g.id && (
                    <div className="absolute left-0 top-full pt-2">
                      <div className="w-[400px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/10 dark:shadow-black/50 p-1.5">
                        <div className="grid grid-cols-2 gap-1">
                          {g.categories.map((c) => (
                            <Link key={c.slug} to={`/tools/${c.slug}`} onClick={() => setOpen(null)}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/80 group">
                              <span className={`w-8 h-8 rounded-lg grid place-items-center text-[14px] ${tile(c.hue)}`}>{c.icon}</span>
                              <span className="flex-1 min-w-0">
                                <span className="block text-[13px] font-semibold leading-tight truncate">{c.name}</span>
                                <span className="block text-[11px] text-zinc-500">{c.count} tools</span>
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
              <button onClick={toggle} aria-label="Toggle theme"
                className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 grid place-items-center text-[15px] hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:scale-105 active:scale-95 transition-all">
                {dark ? '☀️' : '🌙'}
              </button>
              <button onClick={() => setMOpen(!mOpen)} aria-label="Menu" className="lg:hidden w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 grid place-items-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  {mOpen ? <path d="M3 3L13 13M13 3L3 13" /> : <path d="M2 3.5h12M2 8h12M2 12.5h12" />}
                </svg>
              </button>
            </div>
          </div>

          {mOpen && (
            <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 max-h-[calc(100dvh-90px)] overflow-y-auto rounded-b-2xl">
              <div className="px-3 sm:px-4 py-3 space-y-4">
                {GROUPS.map((g) => (
                  <div key={g.id}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400 mb-1.5 px-1">{g.label}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {g.categories.map((c) => (
                        <button key={c.slug} onClick={() => go(`/tools/${c.slug}`)}
                          className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-left active:scale-[0.98] transition-transform">
                          <span className={`w-8 h-8 rounded-lg grid place-items-center text-[14px] shrink-0 ${tile(c.hue)}`}>{c.icon}</span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[13px] font-medium leading-tight truncate">{c.name}</span>
                            <span className="block text-[11px] text-zinc-500">{c.count}</span>
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
