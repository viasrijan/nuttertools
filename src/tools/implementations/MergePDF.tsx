import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { PDFDocument } from 'pdf-lib'

export default function MergePDF(){
  const [files,setFiles]=useState<File[]>([])
  const [out,setOut]=useState<string>("")
  const onFiles = (fl:FileList)=> setFiles([...files, ...Array.from(fl)])

  const merge = async ()=>{
    const merged = await PDFDocument.create()
    for(const file of files){
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const pages = await merged.copyPages(pdf, pdf.getPageIndices())
      pages.forEach(p=>merged.addPage(p))
    }
    const blob = new Blob([await merged.save() as BlobPart], {type:'application/pdf'})
    setOut(URL.createObjectURL(blob))
  }

  return (
    <div className="space-y-4">
      <DropZone onFiles={onFiles} accept="application/pdf" label="Drop PDFs to merge - order matters"/>
      <div className="text-xs font-medium text-zinc-900 dark:text-white">{files.map(f=>f.name).join(' + ')}</div>
      <button onClick={merge} disabled={files.length<2} className="px-4 py-2 bg-zinc-900 text-white text-sm disabled:opacity-30">Merge {files.length} PDFs</button>
      {out && <a href={out} download="merged.pdf" className="block mt-2 text-sm underline">Download Merged PDF</a>}
      <button onClick={()=>{setFiles([]); setOut("")}} className="text-xs underline">Clear</button>
    </div>
  )
}
