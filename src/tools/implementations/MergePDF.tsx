import { useState } from 'react'
import { Button } from '../../components/ui/Button'

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
    <div className="space-y-6 max-w-xl">
      <DropZone onFiles={onFiles} accept="application/pdf" label="Drop PDFs to merge — order matters"/>
      {files.length > 0 && (
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
          Selected: {files.map(f=>f.name).join(' + ')}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" size="lg" onClick={merge} disabled={files.length<2} className="w-full uppercase tracking-wider font-bold">Merge {files.length} PDFs</Button>
        {files.length > 0 && (
          <button onClick={()=>{setFiles([]); setOut("")}} className="px-4 h-12 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
            Clear all
          </button>
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
