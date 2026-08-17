import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import JSZip from 'jszip'
import { saveBlob } from '../../lib/download'

export default function ZipTool() {
  const [mode, setMode] = useState<'zip' | 'unzip'>('zip')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [entries, setEntries] = useState<{ name: string, size: number }[]>([])
  const [loadedZip, setLoadedZip] = useState<JSZip | null>(null)
  const [zipSize, setZipSize] = useState(0)

  const makeZip = async (fl: FileList) => {
    const files = Array.from(fl)
    if (!files.length) return
    setBusy(true); setError('')
    try {
      const zip = new JSZip()
      files.forEach(f => zip.file(f.name, f))
      const blob = await zip.generateAsync({ type: 'blob' })
      saveBlob(blob, 'archive.zip')
    } catch (e: any) { setError(e.message) }
    setBusy(false)
  }

  const openZip = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setBusy(true); setError('')
    try {
      const zip = await JSZip.loadAsync(await file.arrayBuffer())
      setLoadedZip(zip)
      setZipSize(file.size)
      const list: { name: string, size: number }[] = []
      zip.forEach((name, entry) => { if (!entry.dir) list.push({ name, size: (entry as any)._data?.uncompressedSize ?? 0 }) })
      setEntries(list)
    } catch (e: any) { setError('Not a valid zip file') }
    setBusy(false)
  }

  const extractAll = async () => {
    if (!loadedZip) return
    setBusy(true); setError('')
    try {
      const renames: Record<string, string> = {}
      let i = 0
      loadedZip.forEach((name, entry) => { if (!entry.dir && !name) { renames[name] = `unnamed_${i++}` } })
      loadedZip.forEach(async (name, entry) => {
        if (entry.dir) return
        const blob = await entry.async('blob')
        saveBlob(blob, renames[name] || name)
      })
    } catch (e: any) { setError(e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex gap-2.5">
        <Button variant="outline" onClick={() => setMode('zip')} className={`px-4 h-9 text-sm border ${mode === 'zip' ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>Create zip</Button>
        <Button variant="outline" onClick={() => setMode('unzip')} className={`px-4 h-9 text-sm border ${mode === 'unzip' ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>Extract zip</Button>
      </div>
      {mode === 'zip' ? (
        <>
          <DropZone onFiles={makeZip} multiple label="Drop files to add to a zip" />
          {busy && <Progress label="Zipping files…" />}
        </>
      ) : (
        <>
          <DropZone onFiles={openZip} accept=".zip,application/zip" multiple={false} label="Drop a zip to extract" />
          {busy && <Progress label="Reading zip…" />}
          {entries.length > 0 && (
            <>
              <p className="text-sm font-medium">{entries.length} files in zip ({(zipSize / 1024).toFixed(0)} KB)</p>
              <div className="border max-h-64 overflow-auto divide-y">
                {entries.map((e, i) => <div key={i} className="px-3 py-1.5 text-sm flex justify-between"><span className="truncate">{e.name}</span><span className="text-zinc-400 text-xs">{(e.size / 1024).toFixed(1)} KB</span></div>)}
              </div>
              <Button variant="secondary" onClick={extractAll}>Extract all</Button>
            </>
          )}
        </>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
