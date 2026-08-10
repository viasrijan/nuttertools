import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import * as pdfjs from 'pdfjs-dist'
import JSZip from 'jszip'
import { saveBlob } from '../../lib/download'

function esc(s: string) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<w:br/>') }

async function buildDocx(paragraphs: string[]): Promise<Blob> {
  const zip = new JSZip()
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`)
  zip.folder('_rels')!.file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`)
  const body = paragraphs.map(p => `<w:p><w:r><w:t xml:space="preserve">${esc(p)}</w:t></w:r></w:p>`).join('')
  zip.folder('word')!.file('document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}</w:body></w:document>`)
  return zip.generateAsync({ type: 'blob' })
}

export default function PdfToWord() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const convert = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setBusy(true); setError('')
    try {
      // @ts-ignore
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
      const paragraphs: string[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const tc = await page.getTextContent()
        const lines = tc.items.map((it: any) => it.str).join(' ')
        lines.split(/\s{2,}/).filter(Boolean).forEach(l => paragraphs.push(l))
      }
      if (!paragraphs.length) { setError('No extractable text found — this PDF is likely scanned images. This converter only handles digital text.'); setBusy(false); return }
      const blob = await buildDocx(paragraphs)
      saveBlob(blob, 'converted.docx')
    } catch (e: any) { setError(e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={convert} accept="application/pdf" multiple={false} label="Drop a PDF to convert to Word" />
      {busy && <Progress label="Converting PDF to Word…" />}
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-[11px] font-medium text-zinc-500">Extracts the text layer into a .docx file. Page layouts are not preserved.</p>
    </div>
  )
}
