import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import { PDFDocument } from 'pdf-lib'

export default function ImagesToPDF() {
  const [files, setFiles] = useState<File[]>([])
  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)

  const dropFiles: DropFile[] = files.map((f) => ({ name: f.name, size: f.size }))

  const onFiles = (fl: FileList) => {
    setFiles([...files, ...Array.from(fl).filter((f) => f.type.startsWith('image/'))])
    setOut('')
  }

  const convert = async () => {
    setBusy(true)
    try {
      const pdf = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        let img: any
        if (file.type.includes('png')) img = await pdf.embedPng(bytes)
        else img = await pdf.embedJpg(bytes)
        const page = pdf.addPage([img.width, img.height])
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      }
      const blob = new Blob([await pdf.save() as BlobPart], { type: 'application/pdf' })
      setOut(URL.createObjectURL(blob))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <DropZone
        onFiles={onFiles}
        accept="image/*"
        files={dropFiles}
        onClear={() => { setFiles([]); setOut('') }}
        label="Drop images to make PDF"
      />
      {files.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            <button onClick={convert} disabled={!files.length || busy} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-colors">
              {busy ? 'Converting…' : `Convert ${files.length} image${files.length > 1 ? 's' : ''} to PDF`}
            </button>
            {out && <a href={out} download="images.pdf" className="inline-block px-5 h-10 leading-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Download PDF</a>}
          </div>
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1.5">
                <span className="text-[12px] font-bold max-w-[180px] truncate">{f.name}</span>
                <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-rose-600 dark:text-rose-400 font-bold text-[12px] hover:underline">✕</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}