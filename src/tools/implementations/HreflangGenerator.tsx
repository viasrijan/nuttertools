import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result } from '../../components/ui/Result'

export default function HreflangGenerator() {
  const [url, setUrl] = useState('https://example.com/products')
  const [langs, setLangs] = useState('en,en-us,es,fr,de')
  const [xDefault, setXDefault] = useState('en')

  const list = langs.split(/[, ]+/).map((l) => l.trim().toLowerCase()).filter(Boolean)
  const tags = list.map((l) => `<link rel="alternate" hreflang="${l}" href="${url.replace(/\/$/, '')}/${l === xDefault.toLowerCase() ? (xDefault === l ? '' : l) : l}" />`)
  const full = `<link rel="alternate" hreflang="x-default" href="${url.replace(/\/$/, '')}" />\n` + tags.join('\n')

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Page URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Field label="Languages (comma-separated)" value={langs} onChange={(e) => setLangs(e.target.value)} />
        <Field label="x-default language" value={xDefault} onChange={(e) => setXDefault(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Generated hreflang tags</span>
          <button onClick={() => navigator.clipboard?.writeText(full)} className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline">Copy all</button>
        </div>
        <pre className="p-3 bg-zinc-100 dark:bg-zinc-800 font-mono text-[12px] leading-relaxed overflow-auto whitespace-pre-wrap">{full}</pre>
      </div>
      <div className="grid gap-2 max-w-md">
        <Result label="Tags generated" value={list.length + 1} />
      </div>
    </div>
  )
}