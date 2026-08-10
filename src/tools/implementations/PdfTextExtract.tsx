import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import * as pdfjs from 'pdfjs-dist'

export default function PdfTextExtract() {
  const [pages, setPages] = useState<{ text: string, page: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const all = pages.map(p => p.text).join('\n\n')

  const extract = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setLoading(true); setError('')
    try {
      // @ts-ignore
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
      const res: { text: string, page: number }[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const tc = await page.getTextContent()
        res.push({ page: i, text: tc.items.map((it: any) => it.str).join(' ') })
      }
      setPages(res)
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <DropZone onFiles={extract} accept="application/pdf" multiple={false} label="Drop a PDF to extract its text" />
      {loading && <Progress label="Extracting text…" />}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {pages.length > 0 && (
        <>
          <div className="flex gap-2">
            <button onClick={() => navigator.clipboard.writeText(all)} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Copy all</button>
            <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(all)}`} download="extracted.txt" className="px-4 h-9 border text-sm inline-flex items-center">Download .txt</a>
          </div>
          <p className="text-sm font-medium text-zinc-500">{pages.length} pages · {all.split(/\s+/).filter(Boolean).length} words</p>
          <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
            {pages.map(p => (
              <div key={p.page} className="border p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Page {p.page}</p>
                <p className="text-sm whitespace-pre-wrap">{p.text || '(no text found on this page)'}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
