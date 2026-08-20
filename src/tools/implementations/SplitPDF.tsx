import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import { PDFDocument } from 'pdf-lib'
import { DownloadButton } from '../../components/ui/DownloadButton'
import { saveDataUrl } from '../../lib/download'

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [range, setRange] = useState('1-2')
  const [out, setOut] = useState<string>('')

  const dropFiles: DropFile[] = file ? [{ name: file.name, size: file.size }] : []

  const onFiles = (fl: FileList) => { setFile(fl[0]); setOut('') }

  const split = async () => {
    if (!file) return
    const bytes = await file.arrayBuffer()
    const src = await PDFDocument.load(bytes)
    const dest = await PDFDocument.create()
    const parts = range.split(',').flatMap((r) => {
      if (r.includes('-')) { const [a, b] = r.split('-').map(Number); return Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i) }
      return [Number(r) - 1]
    })
    const pages = await dest.copyPages(src, parts)
    pages.forEach((p) => dest.addPage(p))
    const blob = new Blob([await dest.save() as BlobPart], { type: 'application/pdf' })
    setOut(URL.createObjectURL(blob))
  }

  return (
    <div className="space-y-5">
      <DropZone
        onFiles={onFiles}
        accept="application/pdf"
        multiple={false}
        files={dropFiles}
        onClear={() => { setFile(null); setOut('') }}
        label="Drop a PDF to split"
      />
      {file && (
        <>
          <div className="flex flex-wrap gap-2 items-center">
            <input value={range} onChange={(e) => setRange(e.target.value)} placeholder="1-2,4,6-8" className="w-40 h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
            <button onClick={split} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Split</button>
          </div>
          <p className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">Pages are 1-indexed. Example: 1-3,5,8-10</p>
          {out && <DownloadButton onClick={() => saveDataUrl(out, 'split.pdf')}>Download Split PDF</DownloadButton>}
        </>
      )}
    </div>
  )
}