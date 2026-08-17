import { useState } from 'react'
import DropZone from '../../components/DropZone'

export default function PaletteExtractor(){
  const [colors,setColors]=useState<string[]>([])
  const [img,setImg]=useState("")

  const onFiles = async (fl:FileList)=>{
    const file = fl[0]
    if(!file) return
    const url = URL.createObjectURL(file)
    setImg(url)
    const image = new Image()
    image.src=url
    await new Promise(r=>image.onload=r)
    const canvas = document.createElement('canvas')
    canvas.width=100; canvas.height=100
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(image,0,0,100,100)
    const data = ctx.getImageData(0,0,100,100).data
    const map: Record<string, number> = {}
    for(let i=0;i<data.length;i+=4*10){
      const key = `${Math.round(data[i]/10)*10},${Math.round(data[i+1]/10)*10},${Math.round(data[i+2]/10)*10}`
      map[key]=(map[key]||0)+1
    }
    const sorted = Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k])=>{
      const [r,g,b]=k.split(',').map(Number)
      return `rgb(${r},${g},${b})`
    })
    setColors(sorted)
  }

  return (
    <div className="space-y-5">
      <DropZone onFiles={onFiles} accept="image/*" multiple={false} label="Drop image to extract palette"/>
      {img && <img src={img} className="w-full max-h-[300px] object-contain border"/>}
      <div className="flex gap-2 flex-wrap">
        {colors.map((c,i)=><div key={i} className="flex items-center gap-2 border pl-1 pr-3 py-1"><div className="w-6 h-6 border" style={{background:c}}/><span className="text-xs font-mono">{c}</span></div>)}
      </div>
    </div>
  )
}
