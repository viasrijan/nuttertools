import { useState } from 'react'

export default function Base64Tool(){
  const [input,setInput]=useState("Hello OmniTools")
  const [output,setOutput]=useState("")
  const [fileOut,setFileOut]=useState("")

  const encode = ()=> setOutput(btoa(input))
  const decode = ()=>{ try{ setOutput(atob(input)) }catch{ setOutput("Invalid base64") } }

  const onFile = async (e:any)=>{
    const file = e.target.files[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = ()=> setFileOut(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-2">Text Base64</h4>
        <textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full h-24 border rounded-xl p-3 text-sm"/>
        <div className="flex gap-2 mt-2"><button onClick={encode} className="px-3 h-8 bg-zinc-900 text-white rounded-full text-xs">Encode</button><button onClick={decode} className="px-3 h-8 border rounded-full text-xs">Decode</button></div>
        <textarea value={output} readOnly className="w-full h-24 border rounded-xl p-3 text-sm mt-2 bg-zinc-50"/>
      </div>
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold mb-2">File to Base64</h4>
        <input type="file" onChange={onFile} className="text-sm"/>
        {fileOut && <textarea value={fileOut} readOnly className="w-full h-24 border rounded-xl p-2 text-[10px] mt-2"/>}
      </div>
    </div>
  )
}
