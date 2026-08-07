import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lightbulb } from 'lucide-react'
import { GROUPS } from '../data/categories'
import { textAccent, hueFor } from '../lib/style'
import Logo from './Logo'
import { CutoutCategoryIcon, CutoutToolIcon } from './Icon'
import { popularToolsForGroup } from '../data/popular'

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

  useEffect(() => {
    document.body.style.overflow = mOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mOpen])

  const go = (path: string) => {
    setOpen(null)
    setMOpen(false)
    navigate(path)
  }

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
              <Logo size={28} className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[21px] sm:text-[25px] font-extrabold tracking-[-0.03em] text-[#4454c9]">
                NutterTools
              </span>
            </Link>

            <nav ref={navRef} className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {GROUPS.map((g) => {
                const popular = popularToolsForGroup(g.categories)
                return (
                <div key={g.id} className="relative"
                  onMouseEnter={() => setOpen(g.id)}
                  onMouseLeave={() => setOpen((o) => (o === g.id ? null : o))}>
                  <button onClick={() => setOpen(open === g.id ? null : g.id)}
                    className={`flex items-center gap-1.5 text-[14px] font-semibold px-3.5 py-2 transition-colors ${open === g.id ? 'bg-zinc-200/80 text-zinc-900' : 'text-zinc-900 hover:text-green-600 hover:bg-zinc-100'}`}>
                    {g.label}
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open === g.id ? 'rotate-180' : ''}`}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {open === g.id && (
                    <div className="absolute left-0 top-full pt-2">
                      <div className="w-[360px] origin-top rounded-3xl border border-transparent bg-white dark:bg-zinc-900 soft-shadow p-2 animate-[omni-drop_0.15s_ease-out]">
                        <div className="flex flex-col gap-0.5">
                          {popular.map((t) => (
                            <Link key={t.id} to={`/tool/${t.id}`} onClick={() => setOpen(null)}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 group">
                              <span className="w-[18px] h-[18px] shrink-0">
                                <CutoutToolIcon id={t.id} className="w-full h-full" tone={textAccent(hueFor(t.category))} />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block text-[13.5px] font-semibold leading-tight truncate text-zinc-900 dark:text-white">{t.name}</span>
                                <span className="block text-[11px] font-medium text-zinc-900 dark:text-zinc-100">{t.category}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                )
              })}
            </nav>

            <button onClick={toggle} aria-label="Toggle theme" aria-pressed={dark}
              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full bg-yellow-400 dark:bg-black text-white grid place-items-center hover:brightness-95 transition-colors">
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
              className="w-10 h-10 shrink-0 rounded-full bg-black dark:bg-white text-white dark:text-black grid place-items-center hover:scale-105 active:scale-95 transition-transform">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 3L13 13M13 3L3 13" />
              </svg>
            </button>
          </div>

          <div className="px-4 sm:px-6 py-6 space-y-8">
            {GROUPS.map((g) => (
              <div key={g.id}>
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-green-600 dark:text-green-400 mb-2 px-1">{g.label}</p>
                <div className="flex flex-col">
                  {g.categories.map((c) => (
                    <button key={c.slug} onClick={() => go(`/tools/${c.slug}`)}
                      className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 text-left active:scale-[0.99] transition-transform">
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
              className="flex-1 h-11 grid place-items-center rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white text-[14px] font-bold hover:opacity-90 active:scale-[0.99] transition-all">
              Donate
            </a>
            <a href="https://github.com/viasrijan/nuttertools" target="_blank" rel="noreferrer"
              className="h-11 px-6 grid place-items-center rounded-xl border border-zinc-300 dark:border-zinc-700 text-[14px] font-semibold text-zinc-900 dark:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
