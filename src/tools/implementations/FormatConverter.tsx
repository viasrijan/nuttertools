import { useState } from 'react'
import DropZone from '../../components/DropZone'

export default function FormatConverter(){
  const [format,setFormat]=useState<'image/jpeg'|'image/png'|'image/webp'>('image/webp')
  const [items,setItems]=useState<any[]>([])

  const onFiles = async (fl:FileList)=>{
    const arr = Array.from(fl)
    const out = await Promise.all(arr.map(async f=>{
      const img = new Image()
      const url = URL.createObjectURL(f)
      img.src=url
      await new Promise(r=>img.onload=r)
      const canvas=document.createElement('canvas')
      canvas.width=img.width; canvas.height=img.height
      const ctx=canvas.getContext('2d')!
      ctx.drawImage(img,0,0)
      const blob = await new Promise<Blob|null>(res=>canvas.toBlob(b=>res(b), format, 0.9))
      if(!blob) return null
      return {name:f.name.split('.')[0]+'.'+format.split('/')[1], url: URL.createObjectURL(blob)}
    }))
    setItems(out.filter(Boolean))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select value={format} onChange={e=>setFormat(e.target.value as any)} className="border px-4 h-9 text-sm">
          <option value="image/webp">WebP</option>
          <option value="image/jpeg">JPG</option>
          <option value="image/png">PNG</option>
        </select>
      </div>
      <DropZone onFiles={onFiles} accept="image/*" label={`Drop images to convert to ${format}`}/>
      <div className="grid grid-cols-2 gap-3">
        {items.map((it,i)=><div key={i} className="border p-2"><img src={it.url} className="h-28 w-full object-cover rounded"/><a href={it.url} download={it.name} className="text-xs underline">{it.name}</a></div>)}
      </div>
    </div>
  )
}
