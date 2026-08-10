import { useState } from 'react'

const SAMPLE = `<h1 style="color:rebeccapurple">Hello, World!</h1>
<p>Edit this HTML and see the preview update live.</p>
<style>
  button { background: #4f46e5; color: white; border: 0; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
</style>
<button onclick="alert('It works!')">Click me</button>`

export default function HtmlPreview() {
  const [html, setHtml] = useState(SAMPLE)
  const [auto, setAuto] = useState(true)
  const [srcDoc, setSrcDoc] = useState(SAMPLE)
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setSrcDoc(html)} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Preview</button>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={auto} onChange={e => { setAuto(e.target.checked); if (e.target.checked) setSrcDoc(html) }} />Auto-refresh</label>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <textarea value={html} onChange={e => { setHtml(e.target.value); if (auto) setSrcDoc(e.target.value) }} className="w-full h-[420px] border p-3 font-mono text-xs" spellCheck={false} />
        <iframe title="html-preview" srcDoc={srcDoc} className="w-full h-[420px] border bg-white" />
      </div>
    </div>
  )
}
