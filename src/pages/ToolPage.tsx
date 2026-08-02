import { useParams, Link } from 'react-router-dom'
import toolsData from '../data/tools.json'
import { useEffect } from 'react'
import registry from '../tools/registry'

export default function ToolPage(){
  const {id}=useParams()
  const tool = (toolsData as any[]).find(t=>t.id===id)
  useEffect(()=>{
    const rec = JSON.parse(localStorage.getItem('recent')||'[]')
    const n = [id, ...rec.filter((x:string)=>x!==id)].slice(0,6)
    localStorage.setItem('recent', JSON.stringify(n))
  },[id])

  if(!tool) return <div className="p-10">Tool not found <Link to="/" className="underline">Home</Link></div>

  const Comp = registry[tool.id]

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <Link to="/" className="text-sm text-zinc-500 hover:underline">← All tools</Link>
      <div className="mt-4 flex items-start gap-4">
        <div className="w-14 h-14 rounded-[14px] bg-zinc-900 text-white dark:bg-white dark:text-black grid place-items-center text-2xl">{tool.icon}</div>
        <div>
          <h1 className="text-[28px] font-bold tracking-tight leading-none">{tool.name}</h1>
          <p className="text-zinc-500 mt-1 text-sm">{tool.desc}</p>
          <div className="mt-2 flex gap-2">
            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">🔒 Offline • Private</span>
            <span className="text-[11px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{tool.category}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[20px] p-5 min-h-[400px]">
          {Comp ? <Comp/> : (
            <div className="py-20 text-center">
              <div className="text-4xl">🚧</div>
              <h3 className="font-semibold mt-3">Coming Soon</h3>
              <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">This tool UI is ready. Logic will be added next. You can copy this page structure to add any tool in minutes.</p>
              <p className="text-xs text-zinc-400 mt-4">ID: {tool.id}</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-[14px] p-4">
            <h4 className="font-semibold text-sm">Why offline?</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">Your files never leave your device. No server costs, no tracking, no limits. Perfect for sensitive PDFs and personal photos. Works on GitHub Pages.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[14px] p-4">
            <h4 className="font-semibold text-sm">How to deploy</h4>
            <code className="text-xs block mt-2 bg-zinc-50 dark:bg-zinc-800 p-2 rounded">npm run build<br/>npx gh-pages -d dist</code>
          </div>
        </div>
      </div>
    </div>
  )
}
