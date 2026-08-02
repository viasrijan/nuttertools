import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GROUPS } from '../data/categories'
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 dark:bg-zinc-950/75 border-b border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMOpen(false)}>
          <Logo size={30} />
          <span className="font-bold text-[19px] tracking-[-0.02em]">OmniTools</span>
        </Link>

        <nav ref={navRef} className="hidden lg:flex items-center gap-1">
          {GROUPS.map((g) => (
            <div key={g.id} className="relative"
              onMouseEnter={() => setOpen(g.id)}
              onMouseLeave={() => setOpen((o) => (o === g.id ? null : o))}>
              <button onClick={() => setOpen(open === g.id ? null : g.id)}
                className={`flex items-center gap-1.5 text-[14px] font-medium px-3.5 py-2 rounded-full transition-colors ${open === g.id ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70'}`}>
                {g.label}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open === g.id ? 'rotate-180' : ''}`}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {open === g.id && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="w-[300px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-900/5 dark:shadow-black/30 p-2">
                    {g.categories.map((c) => (
                      <Link key={c.slug} to={`/tools/${c.slug}`} onClick={() => setOpen(null)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/80 group">
                        <span className="w-9 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 grid place-items-center text-[16px]">{c.icon}</span>
                        <span className="flex-1">
                          <span className="block text-[14px] font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{c.name}</span>
                          <span className="block text-[12px] text-zinc-500">{c.count} tools</span>
                        </span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-300 dark:text-zinc-600 group-hover:text-indigo-500">
                          <path d="M5 2.5L10 7L5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <a href="https://github.com/viasrijan/omnitools" target="_blank" rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-[14px] font-medium px-3.5 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
            GitHub
          </a>
          <button onClick={toggle} aria-label="Toggle theme"
            className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 grid place-items-center text-[15px] hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors">
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setMOpen(!mOpen)} aria-label="Menu" className="lg:hidden w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 grid place-items-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {mOpen ? <path d="M3 3L13 13M13 3L3 13" /> : <path d="M2 3.5h12M2 8h12M2 12.5h12" />}
            </svg>
          </button>
        </div>
      </div>

      {mOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 space-y-5">
            {GROUPS.map((g) => (
              <div key={g.id}>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 mb-2">{g.label}</p>
                <div className="grid grid-cols-1 gap-1">
                  {g.categories.map((c) => (
                    <button key={c.slug} onClick={() => go(`/tools/${c.slug}`)}
                      className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-left">
                      <span className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 grid place-items-center text-[15px]">{c.icon}</span>
                      <span className="flex-1 text-[14px] font-medium">{c.name}</span>
                      <span className="text-[12px] text-zinc-500">{c.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
