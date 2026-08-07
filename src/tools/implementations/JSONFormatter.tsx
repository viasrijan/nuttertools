import { useState } from 'react'

export default function JSONFormatter(){
  const [input,setInput]=useState('{\"name\":\"NutterTools\",\"tools\":95}')
  const [output,setOutput]=useState("")
  const [error,setError]=useState("")

  const format = ()=>{
    try{
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj, null, 2))
      setError("")
    }catch(e:any){ setError(e.message) }
  }
  const minify = ()=>{
    try{ setOutput(JSON.stringify(JSON.parse(input))); setError("") }catch(e:any){ setError(e.message)}
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={format} className="px-4 h-8 bg-zinc-900 text-white text-sm">Format</button>
        <button onClick={minify} className="px-4 h-8 border text-sm">Minify</button>
        <button onClick={()=>navigator.clipboard.writeText(output)} className="px-4 h-8 border text-sm">Copy</button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="grid md:grid-cols-2 gap-3">
        <textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full h-[400px] border p-3 font-mono text-xs" placeholder="Paste JSON"/>
        <textarea value={output} readOnly className="w-full h-[400px] border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" placeholder="Formatted JSON"/>
      </div>
    </div>
  )
}
