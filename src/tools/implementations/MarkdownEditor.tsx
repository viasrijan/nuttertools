import { useState } from 'react'
import { marked } from 'marked'

export default function MarkdownEditor() {
  const [text, setText] = useState(`# Hello 👋

This is **live** markdown preview.

- Edit the text on the left
- See the preview on the right
- [NutterTools](https://viasrijan.github.io/nuttertools/)

\`\`\`js
console.log('hi')
\`\`\`
`)
  const [html, setHtml] = useState('')
  const render = () => setHtml(marked.parse(text) as string)

  return (
    <div className="space-y-3">
      <button onClick={render} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Preview</button>
      <div className="grid md:grid-cols-2 gap-3">
        <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-[420px] border p-3 font-mono text-xs" />
        <iframe title="markdown-preview" sandbox="" srcDoc={`<style>body{font-family:system-ui,sans-serif;padding:12px;line-height:1.6}pre{background:#f4f4f5;padding:10px;border-radius:6px;overflow:auto}code{font-family:monospace}</style>${html || '<p style="color:#999">Preview appears here</p>'}`} className="w-full h-[420px] border bg-white" />
      </div>
    </div>
  )
}
