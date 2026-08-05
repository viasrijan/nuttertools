import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ToolPage from './pages/ToolPage'
import Header from './components/Header'
import Logo from './components/Logo'
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
      <Header dark={dark} toggle={toggle} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/:slug" element={<CategoryPage />} />
          <Route path="/tool/:id" element={<ToolPage />} />
        </Routes>
      </main>
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div>
              <div className="flex items-center gap-2.5">
                <Logo size={21} />
                <span className="font-extrabold text-[18px] tracking-[-0.03em] text-indigo-600 dark:text-indigo-400">OmniTools</span>
              </div>
              <p className="text-[13px] text-zinc-500 mt-3 max-w-xs leading-relaxed">A collection of useful free tools, all in one place.</p>
              <a href="https://www.paypal.me/iSrijan" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 h-9 text-[12.5px] font-semibold bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:opacity-90 transition-opacity">
                Donate with PayPal
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-2.5">
              {CATEGORIES.map((c) => (
                <LinkFooter key={c.slug} to={`/tools/${c.slug}`}>{c.name}</LinkFooter>
              ))}
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-zinc-400">© {new Date().getFullYear()} OmniTools</p>
            <a href="https://github.com/viasrijan/omnitools" target="_blank" rel="noreferrer" className="text-[12px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function LinkFooter({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <Link to={to} className="text-[13px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{children}</Link>
  )
}
