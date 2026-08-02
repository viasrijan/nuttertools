import { useState } from 'react'
export default function PasswordGen(){
  const [len,setLen]=useState(16)
  const [upper,setUpper]=useState(true)
  const [numbers,setNumbers]=useState(true)
  const [symbols,setSymbols]=useState(true)
  const [pwd,setPwd]=useState("")

  const gen = ()=>{
    let chars="abcdefghijklmnopqrstuvwxyz"
    if(upper) chars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if(numbers) chars+="0123456789"
    if(symbols) chars+="!@#$%^&*"
    let out=""
    for(let i=0;i<len;i++) out+=chars[Math.floor(Math.random()*chars.length)]
    setPwd(out)
  }

  return (
    <div className="space-y-4 max-w-md">
      <div className="border rounded-xl p-4 flex items-center justify-between">
        <span className="font-mono text-lg">{pwd||"Click generate"}</span>
        <button onClick={()=>navigator.clipboard.writeText(pwd)} className="text-xs border px-3 py-1 rounded-full">Copy</button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between"><label className="text-sm">Length {len}</label><input type="range" min={6} max={64} value={len} onChange={e=>setLen(parseInt(e.target.value))}/></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={upper} onChange={e=>setUpper(e.target.checked)}/>Uppercase</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={numbers} onChange={e=>setNumbers(e.target.checked)}/>Numbers</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={symbols} onChange={e=>setSymbols(e.target.checked)}/>Symbols</label>
        <button onClick={gen} className="w-full h-10 bg-zinc-900 text-white rounded-full text-sm">Generate Password</button>
      </div>
    </div>
  )
}
