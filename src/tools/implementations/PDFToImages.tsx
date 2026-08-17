import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import * as pdfjs from 'pdfjs-dist'

export default function PDFToImages(){
  const [imgs,setImgs]=useState<string[]>([])
  const [loading,setLoading]=useState(false)

  const onFiles = async (fl:FileList)=>{
    const file = fl[0]
    if(!file) return
    setLoading(true)
    try{
      // @ts-ignore
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      const data = await file.arrayBuffer()
      const pdf = await pdfjs.getDocument({data}).promise
      const out:string[]=[]
      for(let i=1;i<=pdf.numPages;i++){
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({scale:2})
        const canvas = document.createElement('canvas')
        canvas.width=viewport.width; canvas.height=viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({canvasContext:ctx, viewport}).promise
        out.push(canvas.toDataURL('image/jpeg',0.9))
      }
      setImgs(out)
    }catch(e:any){
      alert("Error: "+e.message)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      <DropZone onFiles={onFiles} accept="application/pdf" multiple={false} label="Drop PDF to convert to JPGs"/>
      {loading && <Progress label="Rendering PDF pages…" />}
      <div className="grid grid-cols-2 gap-3">
        {imgs.map((src,i)=><div key={i} className="border p-2"><img src={src} className="w-full "/><a href={src} download={`page-${i+1}.jpg`} className="text-xs underline">Download page {i+1}</a></div>)}
      </div>
    </div>
  )
}
