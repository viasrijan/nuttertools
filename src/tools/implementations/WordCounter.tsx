import { useState, useMemo } from 'react'
import StatTile from '../../components/ui/StatTile'

export default function WordCounter(){
  const [text,setText]=useState("Paste your text here to count words, characters, reading time. NutterTools is privacy-first.")
  const stats = useMemo(()=>{
    const words = text.trim()? text.trim().split(/\s+/).length : 0
    return {words, chars:text.length, charsNoSpace:text.replace(/\s/g,'').length, lines:text.split('\n').length, reading: Math.ceil(words/200)}
  },[text])
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatTile label="" value={stats.words} />
        <StatTile label="" value={stats.chars} />
        <StatTile label="" value={stats.charsNoSpace} />
        <StatTile label="" value={stats.lines} />
        <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 text-center transition-all duration-200"><div className="text-xl font-bold">{stats.reading}m</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Read time</div></div>
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-[300px] border p-3 text-sm"/>
    </div>
  )
}
