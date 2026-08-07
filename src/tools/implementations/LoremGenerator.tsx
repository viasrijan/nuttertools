import { useState } from 'react'

const WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum']
const rand = (n: number) => Math.floor(Math.random() * n)

export default function LoremGenerator() {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [count, setCount] = useState(3)
  const [out, setOut] = useState('')

  const gen = () => {
    const sentence = () => {
      const n = 6 + rand(7)
      const words: string[] = []
      for (let i = 0; i < n; i++) words.push(WORDS[rand(WORDS.length)])
      return words[0][0].toUpperCase() + words[0].slice(1) + ' ' + words.slice(1).join(' ') + '.'
    }
    const para = () => {
      const n = 3 + rand(4)
      return Array.from({ length: n }, sentence).join(' ')
    }
    let res = ''
    if (type === 'words') res = Array.from({ length: count }, () => WORDS[rand(WORDS.length)]).join(' ')
    if (type === 'sentences') res = Array.from({ length: count }, sentence).join(' ')
    if (type === 'paragraphs') res = Array.from({ length: count }, para).join('\n\n')
    setOut(res)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={type} onChange={e => setType(e.target.value as any)} className="border px-3 h-9 text-sm bg-transparent">
          <option value="words">Words</option><option value="sentences">Sentences</option><option value="paragraphs">Paragraphs</option>
        </select>
        <input type="number" min={1} max={100} value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} className="border px-3 h-9 text-sm w-24" />
        <button onClick={gen} className="px-4 h-9 bg-zinc-900 text-white text-sm">Generate</button>
        <button onClick={() => navigator.clipboard.writeText(out)} className="px-4 h-9 border text-sm">Copy</button>
      </div>
      <textarea value={out} readOnly className="w-full h-64 border p-3 text-sm" placeholder="Generated text appears here" />
    </div>
  )
}
