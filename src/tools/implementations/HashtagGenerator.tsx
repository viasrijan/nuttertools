import { useMemo, useState } from 'react'

import { Button } from '../../components/ui/Button'

const RELATED: Record<string, string[]> = {
  food: ['foodie', 'foodlover', 'yum', 'delicious', 'homemade', 'cooking'],
  travel: ['travelgram', 'wanderlust', 'adventure', 'explore', 'vacation', 'passport'],
  tech: ['tech', 'technology', 'coding', 'developer', 'programming', 'innovation'],
  fitness: ['fitness', 'gym', 'workout', 'health', 'fitfam', 'training'],
  photo: ['photography', 'photooftheday', 'photographer', 'camera', 'instagood'],
  nature: ['nature', 'outdoors', 'landscape', 'wildlife', 'earthpics', 'mountains'],
  design: ['design', 'designinspo', 'graphicdesign', 'creativity', 'art'],
  coffee: ['coffee', 'coffeelover', 'caffeine', 'espresso', 'barista'],
}

export default function HashtagGenerator() {
  const [input, setInput] = useState('coffee photography')
  const [count, setCount] = useState(15)

  const tags = useMemo(() => {
    const words = input.toLowerCase().match(/[a-z0-9]+/g) || []
    const out = new Set<string>()
    for (const w of words) {
      out.add(w)
      out.add(w.replace(/\s/g, ''))
      const r = RELATED[w]
      if (r) r.forEach(x => out.add(x))
    }
    const base = [...out]
    const filler = ['today', 'instadaily', 'instamood', 'love', 'happy', 'life', 'daily', 'vibes', 'moment', 'share', 'follow', 'likes', 'trending', 'explorepage', 'toptags', 'newpost', 'photography', 'naturelovers', 'weekendvibes']
    const seen = new Set(base)
    for (const f of filler) { if (base.length >= count) break; if (!seen.has(f)) { base.push(f); seen.add(f) } }
    return base.slice(0, Math.max(count, words.length))
  }, [input, count])

  const text = tags.map(t => '#' + t.replace(/[^a-z0-9]/gi, '')).join(' ')

  return (
    <div className="space-y-5">
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Describe your post: e.g. coffee photography" className="w-full border px-3 py-2 text-sm" />
      <div className="flex items-center gap-2 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Count</label>
        <input type="range" min="5" max="30" value={count} onChange={e => setCount(+e.target.value)} className="w-40" />
        <span className="text-xs font-mono">{count}</span>
      </div>
      <div className="border p-3 flex flex-wrap gap-2">
        {tags.map((t, i) => (
          <button key={i} onClick={() => navigator.clipboard.writeText('#' + t)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">#{t.replace(/[^a-z0-9]/gi, '')}</button>
        ))}
      </div>
      <Button variant="secondary" onClick={() => navigator.clipboard.writeText(text)}>Copy all hashtags</Button>
      <p className="text-[11px] text-zinc-500">Mix of your keywords + a small built-in thesaurus. Click any tag to copy it alone.</p>
    </div>
  )
}
