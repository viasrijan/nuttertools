import { useState } from 'react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

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
    <div className="space-y-5">
      <div className="flex gap-2.5">
        <Button variant="secondary" size="sm" onClick={format}>Format</Button>
        <Button variant="outline" size="sm" onClick={minify}>Minify</Button>
        <CopyButton value={output} />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="grid md:grid-cols-2 gap-3">
        <textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full h-[400px] border p-3 font-mono text-xs" placeholder="Paste JSON"/>
        <textarea value={output} readOnly className="w-full h-[400px] border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" placeholder="Formatted JSON"/>
      </div>
    </div>
  )
}
