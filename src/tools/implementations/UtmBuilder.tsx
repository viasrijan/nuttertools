import { useState } from 'react'

const SOURCES = ['Website', 'Newsletter', 'Social', 'QR Code', 'Email', 'Referral', 'Paid Ad']

export default function UtmBuilder() {
  const [url, setUrl] = useState('https://viasrijan.github.io/nuttertools/')
  const [source, setSource] = useState('newsletter')
  const [medium, setMedium] = useState('email')
  const [campaign, setCampaign] = useState('launch_2026')
  const [term, setTerm] = useState('')
  const [content, setContent] = useState('')

  const built = () => {
    const u = new URL(url.includes('://') ? url : 'https://' + url)
    u.searchParams.set('utm_source', source)
    u.searchParams.set('utm_medium', medium)
    u.searchParams.set('utm_campaign', campaign)
    if (term) u.searchParams.set('utm_term', term)
    if (content) u.searchParams.set('utm_content', content)
    return u.toString()
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <label className="block text-sm font-semibold">Landing page URL<input value={url} onChange={e => setUrl(e.target.value)} className="w-full border px-3 h-9 mt-1 text-sm" placeholder="https://example.com/page" /></label>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm font-semibold">Source
          <select value={source} onChange={e => setSource(e.target.value)} className="w-full border px-2 h-9 mt-1 bg-transparent">
            {SOURCES.map(s => <option key={s}>{s.toLowerCase()}</option>)}
          </select></label>
        <label className="text-sm font-semibold">Medium
          <select value={medium} onChange={e => setMedium(e.target.value)} className="w-full border px-2 h-9 mt-1 bg-transparent">
            <option>email</option><option>social</option><option>cpc</option><option>referral</option><option>qr</option><option>organic</option>
          </select></label>
      </div>
      <input value={campaign} onChange={e => setCampaign(e.target.value)} className="w-full border px-3 h-9 text-sm" placeholder="Campaign name" />
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={term} onChange={e => setTerm(e.target.value)} className="border px-3 h-9 text-sm" placeholder="Term (paid keywords, optional)" />
        <input value={content} onChange={e => setContent(e.target.value)} className="border px-3 h-9 text-sm" placeholder="Content (optional)" />
      </div>
      <label className="block text-sm font-semibold">Final link
        <input value={built()} readOnly className="w-full border px-3 h-10 mt-1 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
      </label>
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(built())} className="px-4 h-9 bg-zinc-900 text-white text-sm">Copy link</button>
        <a href={built()} target="_blank" rel="noreferrer" className="px-4 h-9 border text-sm inline-flex items-center">Open</a>
      </div>
      <div className="border p-3 text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800">
        <b>Params:</b> utm_source=<code className="font-mono">{source}</code> · utm_medium=<code className="font-mono">{medium}</code> · utm_campaign=<code className="font-mono">{campaign}</code>{term && ` · utm_term=${term}`}{content && ` · utm_content=${content}`}
      </div>
    </div>
  )
}
