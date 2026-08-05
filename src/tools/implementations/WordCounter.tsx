import { useState, useMemo } from 'react'
export default function WordCounter(){
  const [text,setText]=useState("Paste your text here to count words, characters, reading time. OmniTools is privacy-first.")
  const stats = useMemo(()=>{
    const words = text.trim()? text.trim().split(/\s+/).length : 0
    return {words, chars:text.length, charsNoSpace:text.replace(/\s/g,'').length, lines:text.split('\n').length, reading: Math.ceil(words/200)}
  },[text])
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.words}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Words</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.chars}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Characters</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.charsNoSpace}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">No spaces</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.lines}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Lines</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.reading}m</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Read time</div></div>
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-[300px] border p-3 text-sm"/>
    </div>
  )
}
