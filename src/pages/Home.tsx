import { useState, useMemo } from 'react'
import toolsData from '../data/tools.json'
import ToolCard from '../components/ToolCard'
import Fuse from 'fuse.js'

const categories = [...new Set((toolsData as any[]).map(t=>t.category))]

export default function Home(){
  const [q,setQ]=useState("")
  const [cat,setCat]=useState("All")
  const fuse = useMemo(()=> new Fuse(toolsData as any[], {keys:['name','desc','category'], threshold:0.3}), [])
  const filtered = useMemo(()=>{
    let list = toolsData as any[]
    if(q) list = fuse.search(q).map(r=>r.item)
    if(cat!=="All") list = list.filter(t=>t.category===cat)
    return list
  },[q,cat,fuse])

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center py-10">
        <h1 className="text-[42px] md:text-[56px] font-[800] leading-[0.95] tracking-[-0.03em]">95+ tools that<br/>work <span className="bg-zinc-900 text-white dark:bg-white dark:text-black px-3 rounded-[10px]">offline</span></h1>
        <p className="text-zinc-500 mt-4 text-[16px]">No uploads. No tracking. All processing happens in your browser. Free forever.</p>
        <div className="mt-6 relative max-w-xl mx-auto">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tools, e.g. compress, pdf, qr..." className="w-full h-[52px] pl-12 pr-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[15px] focus:outline-none focus:ring-2 focus:ring-zinc-900"/>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <button onClick={()=>setCat("All")} className={`px-4 h-8 rounded-full text-sm border ${cat==="All" ? "bg-zinc-900 text-white border-zinc-900" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"}`}>All</button>
          {categories.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-4 h-8 rounded-full text-sm border ${cat===c ? "bg-zinc-900 text-white border-zinc-900" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"}`}>{c}</button>)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(t=><ToolCard key={t.id} tool={t}/>)}
      </div>
      {filtered.length===0 && <p className="text-center text-zinc-500 py-20">No tools found for "{q}"</p>}
    </div>
  )
}
