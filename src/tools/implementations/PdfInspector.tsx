import { useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib'

type Info = { label: string, value: string }

function fmtDate(d: Date | undefined): string {
  return d ? d.toISOString() : '(none)'
}

export default function PdfInspector() {
  const [info, setInfo] = useState<Info[]>([])
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async (file: File) => {
    setError('')
    setWorking(true)
    setInfo([])
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer())
      const rows: Info[] = [
        ['File name', file.name],
        ['File size', `${(file.size / 1024).toFixed(1)} KB`],
        ['PDF version', doc.getVersion()],
        ['Encrypted', doc.isEncrypted ? 'Yes' : 'No'],
        ['Page count', String(doc.getPageCount())],
        ['Title', doc.getTitle() ?? '(none)'],
        ['Author', doc.getAuthor() ?? '(none)'],
        ['Subject', doc.getSubject() ?? '(none)'],
        ['Keywords', doc.getKeywords() ?? '(none)'],
        ['Creator', doc.getCreator() ?? '(none)'],
        ['Producer', doc.getProducer() ?? '(none)'],
        ['Created', fmtDate(doc.getCreationDate())],
        ['Modified', fmtDate(doc.getModificationDate())],
      ]
      const pages = doc.getPages().map((p, i) => {
        const s = p.getSize()
        return [`Page ${i + 1} size`, `${s.width.toFixed(1)} × ${s.height.toFixed(1)} pt (${(s.width / 72).toFixed(2)} × ${(s.height / 72).toFixed(2)} in)`]
      })
      setInfo([...rows, ...pages])
    } catch (e) {
      setError(e instanceof Error && /password|encrypted/i.test(e.message)
        ? 'This PDF is password-protected and cannot be inspected here.'
        : 'Could not open that PDF. It may be corrupted.')
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) load(f) }}
        className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center cursor-pointer hover:border-indigo-600 transition">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">Drop a PDF here or click to browse</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{working ? 'Reading metadata…' : 'See version, metadata, page sizes and more'}</p>
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f) }} />
      </div>
      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      {info.length > 0 && (
        <div className="border divide-y divide-zinc-200 dark:divide-zinc-800 text-[13px]">
          {info.map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-3 px-3 py-2">
              <span className="text-zinc-500 dark:text-zinc-400 shrink-0">{label}</span>
              <span className="font-semibold text-zinc-900 dark:text-white text-right break-all">{value}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Inspection runs entirely in your browser. For privacy, only the metadata stored inside the file is shown.</p>
    </div>
  )
}
