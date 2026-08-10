import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { PDFDocument } from 'pdf-lib'

export default function ImagesToPDF(){
  const [files,setFiles]=useState<File[]>([])
  const [out,setOut]=useState("")
  const onFiles = (fl:FileList)=> setFiles([...files, ...Array.from(fl).filter(f=>f.type.startsWith('image/'))])

  const convert = async ()=>{
    const pdf = await PDFDocument.create()
    for(const file of files){
      const bytes = await file.arrayBuffer()
      let img:any
      if(file.type.includes('png')) img = await pdf.embedPng(bytes)
      else img = await pdf.embedJpg(bytes)
      const page = pdf.addPage([img.width, img.height])
      page.drawImage(img, {x:0, y:0, width:img.width, height:img.height})
    }
    const blob = new Blob([await pdf.save() as BlobPart], {type:'application/pdf'})
    setOut(URL.createObjectURL(blob))
  }

  return (
    <div className="space-y-4">
      <DropZone onFiles={onFiles} accept="image/*" label="Drop images to make PDF"/>
      <button onClick={convert} disabled={!files.length} className="px-4 py-2 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm disabled:opacity-30">Convert {files.length} images to PDF</button>
      {out && <a href={out} download="images.pdf" className="text-sm underline">Download PDF</a>}
    </div>
  )
}
