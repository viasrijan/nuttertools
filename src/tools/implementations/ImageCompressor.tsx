import { useState } from 'react'
import DropZone from '../../components/DropZone'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default function ImageCompressor(){
  const [files,setFiles]=useState<{file:File, url:string, out?:string, size:number}[]>([])
  const [quality,setQuality]=useState(0.7)

  const onFiles = async (fl:FileList)=>{
    const arr = Array.from(fl).filter(f=>f.type.startsWith('image/'))
    const mapped = await Promise.all(arr.map(async f=>{
      const url = URL.createObjectURL(f)
      return {file:f, url, size:f.size}
    }))
    setFiles(mapped)
  }

  const compressAll = async ()=>{
    const out = await Promise.all(files.map(async item=>{
      const img = new Image()
      img.src = item.url
      await new Promise(r=>img.onload=r)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img,0,0)
      const blob = await new Promise<Blob|null>(r=>canvas.toBlob(b=>r(b), 'image/jpeg', quality))
      if(!blob) return item
      const url = URL.createObjectURL(blob)
      return {...item, out:url, size:blob.size}
    }))
    setFiles(out as any)
  }

  const downloadZip = async ()=>{
    const zip = new JSZip()
    for(let i=0;i<files.length;i++){
      const f = files[i]
      if(!f.out) continue
      const res = await fetch(f.out)
      const blob = await res.blob()
      zip.file(`compressed-${i}.jpg`, blob)
    }
    const content = await zip.generateAsync({type:'blob'})
    saveAs(content, 'compressed-images.zip')
  }

  return (
    <div className="space-y-4">
      <DropZone onFiles={onFiles} accept="image/*" label="Drop JPG/PNG/WebP images"/>
      <div className="flex items-center gap-3">
        <label className="text-sm">Quality {Math.round(quality*100)}%</label>
        <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={e=>setQuality(parseFloat(e.target.value))} className="flex-1"/>
        <button onClick={compressAll} className="px-4 py-2 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Compress</button>
        {files.some(f=>f.out) && <button onClick={downloadZip} className="px-4 py-2 border text-sm">Download ZIP</button>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {files.map((f,i)=><div key={i} className="border p-2">
          <img src={f.out||f.url} className="w-full h-28 object-cover"/>
          <p className="text-[11px] mt-1 truncate">{f.file.name}</p>
          <p className="text-[10px] font-medium text-zinc-900 dark:text-white">{(f.file.size/1024).toFixed(0)}KB → {f.size? (f.size/1024).toFixed(0)+'KB' : '...'}</p>
          {f.out && <a href={f.out} download={`compressed-${f.file.name}.jpg`} className="text-xs underline">Download</a>}
        </div>)}
      </div>
    </div>
  )
}
