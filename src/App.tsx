import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ToolPage from './pages/ToolPage'
import Header from './components/Header'
import { useEffect, useState } from 'react'
import { CATEGORIES } from './data/categories'

export default function App() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const d = localStorage.getItem('dark') === '1'
    setDark(d)
    if (d) document.documentElement.classList.add('dark')
  }, [])
  const toggle = () => {
    const nd = !dark
    setDark(nd)
    localStorage.setItem('dark', nd ? '1' : '0')
    document.documentElement.classList.toggle('dark', nd)
  }
  return (
    <div className="min-h-screen flex flex-col">
      <div aria-hidden className="side-shadows fixed inset-0 -z-[5] pointer-events-none" />
      <div aria-hidden className="film-grain fixed inset-0 z-[90] pointer-events-none opacity-[0.09] mix-blend-overlay" />
      <Header dark={dark} toggle={toggle} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/:slug" element={<CategoryPage />} />
          <Route path="/tool/:id" element={<ToolPage />} />
        </Routes>
      </main>
      <footer className="bg-gradient-to-b from-neutral-300/60 to-neutral-300/90 dark:from-zinc-900/70 dark:to-zinc-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 md:pt-8 pb-5 sm:pb-8">
          <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-2.5">
              {CATEGORIES.map((c) => (
                <LinkFooter key={c.slug} to={`/tools/${c.slug}`}>{c.name}</LinkFooter>
              ))}
            </div>
            <div className="md:text-right flex flex-col items-center md:items-end gap-4">
              <div>
                <p className="text-[33px] font-extrabold tracking-[-0.03em] leading-none text-[#4abdb3]">NutterTools</p>
                <p className="text-[20px] font-medium text-zinc-900 dark:text-white mt-2">
                  by{' '}
                  <a href="https://github.com/viasrijan" target="_blank" rel="noreferrer" className="font-bold text-zinc-900 dark:text-white hover:text-green-600 dark:hover:text-green-400">ViaSrijan</a>
                </p>
              </div>
              <a href="https://www.paypal.me/iSrijan" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 h-[30px] text-[16px] font-bold bg-gradient-to-r from-red-600 to-pink-600 text-white hover:opacity-90 transition-opacity">
                Donate
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100">© {new Date().getFullYear()} NutterTools</p>
            <a href="https://github.com/viasrijan/nuttertools" target="_blank" rel="noreferrer" className="text-[12px] font-medium text-zinc-900 dark:text-zinc-100 hover:text-green-600 dark:hover:text-green-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function LinkFooter({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <Link to={to} className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 hover:text-green-600 dark:hover:text-green-400 transition-colors">{children}</Link>
  )
}
