import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'

export default function Base64Tool() {
  const [input, setInput] = useState('Hello NutterTools')
  const [output, setOutput] = useState('')
  const [fileOut, setFileOut] = useState('')
  const [file, setFile] = useState<{ name: string, size: number } | null>(null)

  const dropFiles: DropFile[] = file ? [{ name: file.name, size: file.size }] : []

  const encode = () => setOutput(btoa(input))
  const decode = () => { try { setOutput(atob(input)) } catch { setOutput('Invalid base64') } }

  const onFile = (files: FileList | null) => {
    const f = files?.[0]
    if (!f) return
    setFile({ name: f.name, size: f.size })
    const reader = new FileReader()
    reader.onload = () => setFileOut(reader.result as string)
    reader.readAsDataURL(f)
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-[13px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-2">Text Base64</h4>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-24 p-3 bg-zinc-100 dark:bg-zinc-800 text-sm font-semibold rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        <div className="flex gap-2 mt-2">
          <button onClick={encode} className="px-4 h-9 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Encode</button>
          <button onClick={decode} className="px-4 h-9 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold uppercase tracking-wider transition-colors">Decode</button>
        </div>
        <textarea value={output} readOnly className="w-full h-24 p-3 bg-zinc-100 dark:bg-zinc-800 text-sm font-mono rounded-none outline-none mt-2" />
      </div>
      <div>
        <h4 className="text-[13px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-2">File to Base64</h4>
        <DropZone
          onFiles={onFile}
          accept="*"
          multiple={false}
          files={dropFiles}
          onClear={() => { setFile(null); setFileOut('') }}
          label="Drop a file to encode as data URL"
        />
        {fileOut && <textarea value={fileOut} readOnly className="w-full h-24 p-2 text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none mt-2" />}
      </div>
    </div>
  )
}