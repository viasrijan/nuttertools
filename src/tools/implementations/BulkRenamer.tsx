import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { saveBlob } from '../../lib/download'

function stem(name: string) { return name.replace(/\.[^.]+$/, '') }
function ext(name: string) { return (name.match(/\.[^.]+$/) || '') }

export default function BulkRenamer() {
  const [files, setFiles] = useState<File[]>([])
  const [mode, setMode] = useState<'prefix' | 'number'>('prefix')
  const [prefix, setPrefix] = useState('file_')
  const [startNum, setStartNum] = useState(1)
  const [zeroPad, setZeroPad] = useState(2)

  const newName = (f: File, i: number) =>
    mode === 'prefix' ? `${prefix}${stem(f.name)}${ext(f.name)}`
      : `${prefix}${String(startNum + i).padStart(zeroPad, '0')}${ext(f.name)}`

  const downloadAll = () => {
    files.forEach((f, i) => saveBlob(f, newName(f, i)))
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFiles(Array.from(fl))} multiple label="Drop files to rename" />
      {files.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setMode('prefix')} className={`px-3 h-9 text-sm border ${mode === 'prefix' ? 'bg-zinc-900 text-white' : ''}`}>Prefix name</button>
            <button onClick={() => setMode('number')} className={`px-3 h-9 text-sm border ${mode === 'number' ? 'bg-zinc-900 text-white' : ''}`}>Numbered</button>
          </div>
          {mode === 'prefix' ? (
            <input value={prefix} onChange={e => setPrefix(e.target.value)} className="w-full border px-3 h-10 text-sm" placeholder="Prefix" />
          ) : (
            <div className="flex gap-3">
              <label className="text-sm">Start <input type="number" value={startNum} onChange={e => setStartNum(parseInt(e.target.value) || 1)} className="border px-2 h-9 w-20 text-sm" /></label>
              <label className="text-sm">Padding <input type="number" value={zeroPad} onChange={e => setZeroPad(parseInt(e.target.value) || 1)} className="border px-2 h-9 w-20 text-sm" /></label>
            </div>
          )}
          <div className="border divide-y max-h-72 overflow-auto">
            {files.map((f, i) => (
              <div key={i} className="flex justify-between items-center px-3 py-2 text-sm">
                <span className="truncate text-zinc-400 line-through decoration-zinc-500 max-w-[45%]">{f.name}</span>
                <span className="text-zinc-500">→</span>
                <span className="truncate max-w-[45%]">{newName(f, i)}</span>
              </div>
            ))}
          </div>
          <button onClick={downloadAll} className="px-5 h-10 bg-zinc-900 text-white text-sm">Download {files.length} renamed files</button>
          <p className="text-[11px] font-medium text-zinc-500">The browser will trigger one download per file.</p>
        </>
      )}
    </div>
  )
}
