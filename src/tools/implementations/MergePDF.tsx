import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import { PDFDocument } from 'pdf-lib'

export default function MergePDF(){
  const [files,setFiles]=useState<File[]>([])
  const [out,setOut]=useState<string>("")
  const onFiles = (fl:FileList)=> setFiles([...files, ...Array.from(fl)])

  const dropFiles: DropFile[] = files.map(f => ({ name: f.name, size: f.size }))

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
    <div className="space-y-6 max-w-xl">
      <DropZone onFiles={onFiles} accept="application/pdf" files={dropFiles} onClear={()=>{setFiles([]); setOut("")}} label="Drop PDFs to merge — order matters"/>
      {files.length > 0 && (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold">
          Selected: {files.map(f=>f.name).join(' + ')}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" size="lg" onClick={merge} disabled={files.length<2} className="w-full uppercase tracking-wider font-bold">Merge {files.length} PDFs</Button>
        {files.length > 0 && (
          <Button variant="danger" onClick={()=>{setFiles([]); setOut("")}} className="w-full uppercase tracking-wider font-bold">Clear all</Button>
        )}
      </div>
      {out && (
        <div className="pt-2">
          <a href={out} download="merged.pdf" className="inline-flex items-center justify-center px-6 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider  shadow-md transition-all">
            Download Merged PDF
          </a>
        </div>
      )}
    </div>
  )
}
