import { Link } from 'react-router-dom'
export default function Header({dark, toggle}:{dark:boolean, toggle:()=>void}){
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-[1400px] mx-auto px-4 h-[60px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 grid place-items-center font-black">O</div>
          <span className="font-bold text-[18px] tracking-tight">OmniTools</span>
          <span className="text-xs bg-zinc-900 text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-full ml-1">95+</span>
        </Link>
        <div className="flex items-center gap-3">
          <a href="https://github.com" target="_blank" className="text-sm font-medium px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50">GitHub</a>
          <button onClick={toggle} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 grid place-items-center">{dark?'☀️':'🌙'}</button>
        </div>
      </div>
    </header>
  )
}
