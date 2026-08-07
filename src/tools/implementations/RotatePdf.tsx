import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { PDFDocument, degrees } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null)
  const [angle, setAngle] = useState(90)
  const [all, setAll] = useState(true)
  const [pages, setPages] = useState('1-3')
  const [busy, setBusy] = useState(false)

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer())
      const allPages = pdf.getPages()
      const apply = (p: any) => p.setRotation(degrees((p.getRotation().angle + angle) % 360))
      if (all) {
        allPages.forEach(apply)
      } else {
        const nums: number[] = []
        pages.split(',').forEach(p => {
          if (p.includes('-')) { const [a, b] = p.split('-').map(Number); for (let i = a; i <= b; i++) nums.push(i - 1) }
          else nums.push(parseInt(p) - 1)
        })
        nums.forEach(i => { if (allPages[i]) apply(allPages[i]) })
      }
      saveBlob(bytesToBlob(await pdf.save(), 'application/pdf'), 'rotated.pdf')
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="application/pdf" multiple={false} label="Drop a PDF to rotate" />
      <div className="flex flex-wrap gap-2">
        {[90, 180, 270].map(a => (
          <button key={a} onClick={() => setAngle(a)} className={`px-4 h-9 text-sm border ${angle === a ? 'bg-zinc-900 text-white' : ''}`}>{a}° clockwise</button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={all} onChange={e => setAll(e.target.checked)} />All pages</label>
      {!all && <input value={pages} onChange={e => setPages(e.target.value)} className="border px-3 h-9 text-sm" placeholder="1-3,5,7-9" />}
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Rotating…' : 'Rotate & download'}</button>
    </div>
  )
}
