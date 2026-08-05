import { useState } from 'react'
import DropZone from '../../components/DropZone'

export default function HeicToJpg(){
  const [items,setItems]=useState<any[]>([])
  const [status,setStatus]=useState("")
  const onFiles = async (fl:FileList)=>{
    const arr = Array.from(fl)
    setStatus("Converting... requires heic2any")
    try{
      const heic2any = (await import('heic2any')).default as any
      const out = await Promise.all(arr.map(async f=>{
        try{
          const blob = await heic2any({blob:f, toType:"image/jpeg", quality:0.8})
          const url = URL.createObjectURL(Array.isArray(blob)?blob[0]:blob)
          return {name:f.name.replace(/\.heic$/i,'.jpg'), url}
        }catch(e){
          return {name:f.name, error:String(e)}
        }
      }))
      setItems(out)
      setStatus("Done")
    }catch{
      setStatus("Install heic2any: npm i heic2any. In this demo, use JPG/PNG for now.")
    }
  }
  return (
    <div className="space-y-4">
      <DropZone onFiles={onFiles} accept=".heic,.heif,image/*" label="Drop HEIC files from iPhone"/>
      <p className="text-xs text-zinc-500">{status}</p>
      <div className="grid grid-cols-2 gap-3">
        {items.map((it,i)=><div key={i} className="border p-2">
          {it.url ? <><img src={it.url} className="w-full h-32 object-cover rounded"/><a href={it.url} download={it.name} className="text-xs underline mt-1 block">{it.name} Download</a></> : <p className="text-xs text-red-500">{it.name}: {it.error}</p>}
        </div>)}
      </div>
    </div>
  )
}
