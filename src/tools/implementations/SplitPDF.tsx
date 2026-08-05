import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { PDFDocument } from 'pdf-lib'

export default function SplitPDF(){
  const [file,setFile]=useState<File|null>(null)
  const [range,setRange]=useState("1-2")
  const [out,setOut]=useState<string>("")

  const onFiles = (fl:FileList)=> setFile(fl[0])

  const split = async ()=>{
    if(!file) return
    const bytes = await file.arrayBuffer()
    const src = await PDFDocument.load(bytes)
    const dest = await PDFDocument.create()
    const parts = range.split(',').flatMap(r=>{
      if(r.includes('-')){ const [a,b]=r.split('-').map(Number); return Array.from({length:b-a+1},(_,i)=>a-1+i) }
      return [Number(r)-1]
    })
    const pages = await dest.copyPages(src, parts)
    pages.forEach(p=>dest.addPage(p))
    const blob = new Blob([await dest.save() as BlobPart], {type:'application/pdf'})
    setOut(URL.createObjectURL(blob))
  }

  return (
    <div className="space-y-4">
      <DropZone onFiles={onFiles} accept="application/pdf" multiple={false}/>
      <div className="flex gap-2 items-center">
        <input value={range} onChange={e=>setRange(e.target.value)} placeholder="1-2,4,6-8" className="border px-3 h-9 text-sm w-40"/>
        <button onClick={split} className="px-4 h-9 bg-zinc-900 text-white text-sm">Split</button>
      </div>
      {out && <a href={out} download="split.pdf" className="text-sm underline">Download Split PDF</a>}
    </div>
  )
}
