import { useRef, useState } from 'react'
import { PDFDocument, degrees } from 'pdf-lib'

type Page = { pdfIndex: number, rotate: number }

export default function PdfOrganizer() {
  const [srcDoc, setSrcDoc] = useState<PDFDocument | null>(null)
  const [pages, setPages] = useState<Page[]>([])
  const [thumbs, setThumbs] = useState<string[]>([])
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = async (file: File) => {
    setError('')
    setWorking(true)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      const count = doc.getPageCount()
      if (count === 0) throw new Error('This PDF has no pages')
      const arr = await loadThumbs(bytes, count)
      setThumbs(arr)
      setSrcDoc(doc)
      setPages(Array.from({ length: count }, (_, i) => ({ pdfIndex: i, rotate: 0 })))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open that PDF')
      setSrcDoc(null)
      setPages([])
      setThumbs([])
    } finally {
      setWorking(false)
    }
  }

  const loadThumbs = async (bytes: ArrayBuffer, count: number): Promise<string[]> => {
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    const pdf = await pdfjs.getDocument({ data: bytes }).promise
    const out: string[] = []
    for (let i = 0; i < count; i++) {
      const page = await pdf.getPage(i + 1)
      const viewport = page.getViewport({ scale: 0.4 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
      out.push(canvas.toDataURL('image/jpeg', 0.6))
    }
    return out
  }

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= pages.length) return
    setPages((p) => {
      const next = [...p]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  const rotate = (i: number) => setPages((p) => p.map((pg, idx) => idx === i ? { ...pg, rotate: pg.rotate + 90 } : pg))

  const remove = (i: number) => setPages((p) => p.filter((_, idx) => idx !== i))

  const save = async () => {
    if (!srcDoc || pages.length === 0) return
    setWorking(true)
    try {
      const out = await PDFDocument.create()
      for (const p of pages) {
        const [page] = await out.copyPages(srcDoc, [p.pdfIndex])
        if (p.rotate) page.setRotation(page.getRotation().add(degrees(p.rotate)))
        out.addPage(page)
      }
      const bytes = await out.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'organized.pdf'
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      setError('Could not save the PDF')
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      {!srcDoc && (
        <div onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) load(f) }}
          className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center cursor-pointer hover:border-indigo-600 transition">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Drop a PDF here or click to browse</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{working ? 'Opening PDF…' : 'Reorder, rotate and remove pages'}</p>
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) load(f) }} />
        </div>
      )}
      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      {srcDoc && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pages.map((p, i) => (
              <div key={i} className="border p-2">
                <div className="relative bg-white">
                  <img src={thumbs[p.pdfIndex]} alt={`Page ${p.pdfIndex + 1}`} className={`w-full object-contain ${p.rotate % 180 !== 0 ? 'rotate-90 my-auto' : ''}`} />
                  <span className="absolute top-1 left-1 bg-zinc-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{p.pdfIndex + 1}</span>
                  {p.rotate > 0 && <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{p.rotate}°</span>}
                </div>
                <div className="mt-2 flex gap-1 justify-center">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="px-2 h-7 text-xs border border-zinc-200 dark:border-zinc-800 disabled:opacity-30">Up</button>
                  <button onClick={() => move(i, 1)} disabled={i === pages.length - 1} className="px-2 h-7 text-xs border border-zinc-200 dark:border-zinc-800 disabled:opacity-30">Down</button>
                  <button onClick={() => rotate(i)} className="px-2 h-7 text-xs border border-zinc-200 dark:border-zinc-800">Rotate</button>
                  <button onClick={() => remove(i)} className="px-2 h-7 text-xs border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={save} disabled={working || pages.length === 0}
              className={`px-6 h-11 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm font-semibold ${working ? 'opacity-50' : ''}`}>
              {working ? 'Working…' : `Download PDF (${pages.length} pages)`}
            </button>
            <button onClick={() => { setSrcDoc(null); setPages([]); setThumbs([]); setError('') }}
              className="px-4 h-11 text-sm font-semibold ring-1 ring-zinc-200 dark:ring-zinc-800">Choose another file</button>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">All processing happens in your browser. Files are never uploaded.</p>
        </>
      )}
    </div>
  )
}
