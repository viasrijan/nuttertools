import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import Progress from '../../components/Progress'
import * as pdfjs from 'pdfjs-dist'
import { DownloadButton } from '../../components/ui/DownloadButton'
import { saveDataUrl } from '../../lib/download'

export default function PDFToImages() {
  const [file, setFile] = useState<{ name: string, size: number } | null>(null)
  const [imgs, setImgs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const dropFiles: DropFile[] = file ? [{ name: file.name, size: file.size }] : []

  const onFiles = async (fl: FileList) => {
    const f = fl[0]
    if (!f) return
    setFile({ name: f.name, size: f.size })
    setLoading(true)
    setImgs([])
    try {
      // @ts-ignore
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      const data = await f.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data }).promise
      const out: string[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width; canvas.height = viewport.height
        const ctx = canvas.getContext('2d')!
        await page.render({ canvasContext: ctx, viewport }).promise
        out.push(canvas.toDataURL('image/jpeg', 0.9))
      }
      setImgs(out)
    } catch (e: any) {
      alert('Error: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      <DropZone
        onFiles={onFiles}
        accept="application/pdf"
        multiple={false}
        files={dropFiles}
        onClear={() => { setFile(null); setImgs([]) }}
        label="Drop PDF to convert to JPGs"
      />
      {loading && <Progress label="Rendering PDF pages…" />}
      {imgs.length > 0 && (
        <>
          <DownloadButton onClick={() => { imgs.forEach((src, i) => { const a = document.createElement('a'); a.href = src; a.download = `page-${i + 1}.jpg`; a.click() }) }}>
            Download all ({imgs.length})
          </DownloadButton>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {imgs.map((src, i) => (
              <div key={i} className="bg-zinc-100 dark:bg-zinc-800 p-2">
                <img src={src} className="w-full object-contain" alt="" />
                <DownloadButton onClick={() => saveDataUrl(src, `page-${i + 1}.jpg`)}>Download page {i + 1}</DownloadButton>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}