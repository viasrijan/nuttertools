import { useState } from 'react'

import CopyButton from '../../components/ui/CopyButton'

function htmlToJsx(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, (m, tag) => `{/* <${tag} removed */}`)
    .replace(/\sclass="/gi, ' className="')
    .replace(/\sfor="/gi, ' htmlFor="')
    .replace(/\s(colspan|rowspan|contenteditable|tabindex|maxlength|readonly|autofocus|novalidate|autocomplete)="/gi, ' $1=')
    .replace(/<(input|img|br|hr|meta|link|area|base|col|embed|source|track|wbr)([^>]*?)(\/?)>/gi, '<$1$2 />')
    .replace(/checked="checked"/gi, 'checked')
    .replace(/selected="selected"/gi, 'selected')
    .replace(/disabled="disabled"/gi, 'disabled')
}

export default function HtmlJsx() {
  const [html, setHtml] = useState(`<div class="card">
  <h2 class="title" for="x">Hello World</h2>
  <img src="logo.png" alt="logo">
  <input type="text" maxlength="10">
  <br>
  <a href="/home" target="_blank">Go</a>
</div>`)
  const jsx = htmlToJsx(html)
  return (
    <div className="space-y-5">
      <p className="text-xs font-medium text-zinc-500">Converts HTML attributes to JSX conventions: class→className, self-closing tags, boolean attributes, inline script/style stripped.</p>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <p className="text-sm font-semibold mb-1">HTML</p>
          <textarea value={html} onChange={e => setHtml(e.target.value)} className="w-full h-72 border p-3 font-mono text-xs" />
        </div>
        <div>
          <p className="text-sm font-semibold mb-1">JSX</p>
          <textarea value={jsx} readOnly className="w-full h-72 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
          <CopyButton value={jsx} />
        </div>
      </div>
    </div>
  )
}
