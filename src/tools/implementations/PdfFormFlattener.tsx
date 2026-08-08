import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { PDFDocument } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function PdfFormFlattener() {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const flatten = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setBusy(true)
    try {
      setStatus('Loading…')
      const doc = await PDFDocument.load(await file.arrayBuffer())
      const form = doc.getForm()
      const count = form.getFields().length
      if (!count) { setStatus('No form fields found in this PDF.'); return }
      form.flatten()
      const out = await doc.save()
      saveBlob(bytesToBlob(out, 'application/pdf'), file.name.replace(/\.[^.]+$/, '') + '-flattened.pdf')
      setStatus(`Flattened ${count} field${count === 1 ? '' : 's'} — check your downloads.`)
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={flatten} accept="application/pdf" multiple={false} label="Drop a fillable PDF form" />
      {busy && <p className="text-sm animate-pulse">{status}</p>}
      {!busy && status && <p className="text-sm text-zinc-600">{status}</p>}
      <p className="text-[11px] text-zinc-500">Bakes all filled values into the page so fields can&apos;t be edited afterwards — ideal before sending forms for signature or archiving.</p>
    </div>
  )
}
