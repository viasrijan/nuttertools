import { useState } from 'react'

export default function MetaGenerator() {
  const [d, setD] = useState({
    title: 'NutterTools — Every Useful Tool, All in One Place',
    desc: 'A collection of useful tools — images, PDFs, code, media, text and everyday utilities.',
    url: 'https://viasrijan.github.io/omnitools/',
    image: 'https://viasrijan.github.io/omnitools/og.png',
    theme: '#1f2937',
    robots: 'index, follow',
    twitterHandle: '@iSrijan',
    type: 'website',
    canonical: true, twitter: true, openGraph: true,
  })
  const set = (k: string, v: any) => setD({ ...d, [k]: v })

  const gen = () => {
    const l: string[] = []
    l.push(`<title>${d.title}</title>`)
    if (d.canonical) l.push(`<link rel="canonical" href="${d.url}" />`)
    if (d.openGraph) {
      l.push(`<meta property="og:title" content="${d.title}" />`)
      l.push(`<meta property="og:description" content="${d.desc}" />`)
      l.push(`<meta property="og:type" content="${d.type}" />`)
      l.push(`<meta property="og:url" content="${d.url}" />`)
      l.push(`<meta property="og:image" content="${d.image}" />`)
    }
    if (d.twitter) {
      l.push(`<meta name="twitter:card" content="summary_large_image" />`)
      l.push(`<meta name="twitter:title" content="${d.title}" />`)
      l.push(`<meta name="twitter:description" content="${d.desc}" />`)
      l.push(`<meta name="twitter:image" content="${d.image}" />`)
      if (d.twitterHandle) l.push(`<meta name="twitter:creator" content="${d.twitterHandle}" />`)
    }
    l.push(`<meta name="description" content="${d.desc}" />`)
    l.push(`<meta name="robots" content="${d.robots}" />`)
    l.push(`<meta name="theme-color" content="${d.theme}" />`)
    return l.join('\n')
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <input value={d.title} onChange={e => set('title', e.target.value)} className="w-full border px-3 h-9 text-sm" placeholder="Page title" />
      <textarea value={d.desc} onChange={e => set('desc', e.target.value)} className="w-full border p-3 h-20 text-sm" placeholder="Meta description" />
      <div className="grid md:grid-cols-2 gap-3">
        <input value={d.url} onChange={e => set('url', e.target.value)} className="border px-3 h-9 text-sm" placeholder="Page URL" />
        <input value={d.image} onChange={e => set('image', e.target.value)} className="border px-3 h-9 text-sm" placeholder="Share image URL" />
        <input value={d.theme} onChange={e => set('theme', e.target.value)} className="border px-3 h-9 text-sm" placeholder="Theme color" />
        <select value={d.type} onChange={e => set('type', e.target.value)} className="border px-3 h-9 text-sm bg-transparent">
          <option value="website">website</option><option value="article">article</option><option value="product">product</option><option value="profile">profile</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={d.openGraph} onChange={e => set('openGraph', e.target.checked)} />Open Graph</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={d.twitter} onChange={e => set('twitter', e.target.checked)} />Twitter card</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={d.canonical} onChange={e => set('canonical', e.target.checked)} />Canonical</label>
        <input value={d.twitterHandle} onChange={e => set('twitterHandle', e.target.value)} className="border px-3 h-9 text-sm flex-1 min-w-[140px]" placeholder="Twitter handle" />
      </div>
      <button onClick={() => navigator.clipboard.writeText(gen())} className="px-5 h-10 bg-zinc-900 text-white text-sm">Copy meta tags</button>
      <textarea value={gen()} readOnly className="w-full h-64 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
    </div>
  )
}
