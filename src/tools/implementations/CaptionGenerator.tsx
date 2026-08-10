import { useState } from 'react'

const OPENER = ['Here\'s a', 'Check out this', 'Nothing beats a', 'Weekend mood:', 'You need to see this', 'Throwing it back to', 'PSA:', 'Obsessed with this', 'Mood:']

export default function CaptionGenerator() {
  const [subject, setSubject] = useState('sunset at the beach')
  const [vibe, setVibe] = useState('chill')
  const [emojis, setEmojis] = useState(true)
  const [variants, setVariants] = useState<string[]>([])

  const generate = () => {
    const e = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const emoji = emojis ? [' 🌅', ' ✨', ' 🏖️', ' 💫', ' 🎬'][Math.floor(Math.random() * 5)] : ''
    const caps: Record<string, string[]> = {
      chill: [`${e(OPENER)} ${subject}${emoji}`, `slow moments, best moments. ${subject}${emoji}`, `${subject} — no caption needed${emoji}`, `posting ${subject} because why not${emoji}`, `${subject} hits different today${emoji}`],
      funny: [`my therapist told me to post ${subject} more often`, `${subject} or I'll scream`, `warning: ${subject} content ahead${emoji}`, `no thoughts, just ${subject}${emoji}`, `I came, I saw, I posted ${subject}`],
      aesthetic: [`chasing light — ${subject}${emoji}`, `${subject} in 4k memories`, `golden hour thoughts. ${subject}${emoji}`, `soft light, ${subject}, good day${emoji}`, `a little ${subject} for your feed${emoji}`],
      motivational: [`one step at a time. ${subject}${emoji}`, `even ${subject} starts somewhere`, `growth looks like ${subject}${emoji}`, `keep going — ${subject} proves it${emoji}`, `future you thanks you for ${subject}${emoji}`],
    }
    const list = caps[vibe] || caps.chill
    const out = new Set<string>()
    while (out.size < Math.min(5, list.length)) out.add(list[Math.floor(Math.random() * list.length)])
    return [...out]
  }

  const shown = variants.length ? variants : generate()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="What's in the post?" className="flex-1 border px-3 py-2" />
        <select value={vibe} onChange={e => setVibe(e.target.value)} className="border px-2 py-2">
          {['chill', 'funny', 'aesthetic', 'motivational'].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={emojis} onChange={e => setEmojis(e.target.checked)} /> Emojis</label>
      </div>
      <div className="space-y-2">
        {shown.map((v, i) => (
          <div key={i} className="border p-3 flex justify-between gap-2 items-start">
            <p className="text-sm">{v}</p>
            <button onClick={() => navigator.clipboard.writeText(v)} className="px-3 h-8 border text-xs shrink-0">Copy</button>
          </div>
        ))}
      </div>
      <button onClick={() => setVariants(generate())} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Shuffle again</button>
    </div>
  )
}
