import { useMemo, useState } from 'react'

const RULES: { id: string, label: string, test: RegExp, fix: (...m: string[]) => string }[] = [
  { id: 'i', label: 'Standalone "i" should be "I"', test: /\bi\b/g, fix: () => 'I' },
  { id: 'double-space', label: 'Double spaces', test: / {2,}/g, fix: () => ' ' },
  { id: 'space-punct', label: 'Space before punctuation', test: /\s+([.,!?;:])/g, fix: (_m, p) => p },
  { id: 'your-youre', label: '"your" vs "you\'re" (common mix-up)', test: /\byour\b(?=\s+(going|gonna|not|never|about|absolutely)\b)/gi, fix: m => m.replace(/your/gi, "you're") },
  { id: 'its-its', label: '"its" vs "it\'s" (common mix-up)', test: /\bit's\b(?=\s+(dog|cat|car|book|color|colour|name|value|size|house|phone)\b)/gi, fix: m => m.replace(/it's/gi, 'its') },
  { id: 'then-than', label: '"then" in comparisons should be "than"', test: /\bthen\b(?=\s+(the|a|an|before|any))/gi, fix: m => m.replace(/then/gi, 'than') },
  { id: 'alot', label: '"alot" should be "a lot"', test: /\balot\b/gi, fix: m => m.replace(/alot/gi, 'a lot') },
  { id: 'dont', label: 'Missing apostrophe (dont → don\'t)', test: /\b(dont|cant|wont|didnt|isnt|wasnt|shouldnt|wouldnt|couldnt|im|ive|youre|theyre|were|thats|its|hes|shes)\b/g, fix: m => {
    const map: Record<string, string> = { dont: "don't", cant: "can't", wont: "won't", didnt: "didn't", isnt: "isn't", wasnt: "wasn't", shouldnt: "shouldn't", wouldnt: "wouldn't", couldnt: "couldn't", im: "I'm", ive: "I've", youre: "you're", theyre: "they're", were: "we're", thats: "that's", its: "it's", hes: "he's", shes: "she's" }
    return map[m.toLowerCase()] ?? m
  } },
  { id: 'teh', label: 'Typo: "teh" → "the"', test: /\bteh\b/gi, fix: m => m.replace(/teh/gi, 'the') },
  { id: 'recieve', label: 'Typo: "recieve" → "receive"', test: /\brecieve\b/gi, fix: m => m.replace(/recieve/gi, 'receive') },
  { id: 'seperate', label: 'Typo: "seperate" → "separate"', test: /\bseperate\b/gi, fix: m => m.replace(/seperate/gi, 'separate') },
  { id: 'begining', label: 'Typo: "begining" → "beginning"', test: /\bbegining\b/gi, fix: m => m.replace(/begining/gi, 'beginning') },
  { id: 'occured', label: 'Typo: "occured" → "occurred"', test: /\boccured\b/gi, fix: m => m.replace(/occured/gi, 'occurred') },
  { id: 'definately', label: 'Typo: "definately" → "definitely"', test: /\bdefinately\b/gi, fix: m => m.replace(/definately/gi, 'definitely') },
]

export default function GrammarChecker() {
  const [text, setText] = useState('i have a alot of work to do, dont forget the meeting. teh report was definately recieved on time, then than ever before.')
  const [fixed, setFixed] = useState('')

  const issues = useMemo(() => {
    const out: { label: string, count: number, id: string }[] = []
    for (const r of RULES) {
      const count = (text.match(r.test) || []).length
      if (count) out.push({ label: r.label, count, id: r.id })
    }
    return out
  }, [text])

  const fixAll = () => {
    let t = text
    for (const r of RULES) t = t.replace(r.test, r.fix as any)
    setFixed(t)
  }

  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e => { setText(e.target.value); setFixed('') }} placeholder="Paste text to check grammar…" className="w-full h-[200px] border p-3 text-sm" />
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={fixAll} disabled={!issues.length} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Fix all ({issues.reduce((a, b) => a + b.count, 0)})</button>
        {fixed && <button onClick={() => navigator.clipboard.writeText(fixed)} className="px-4 h-9 border text-sm">Copy fixed</button>}
      </div>
      {issues.length === 0 && text.trim() && <p className="text-sm text-green-600">No common issues detected ✓ (this checker covers 15 common error patterns — not a full grammar engine).</p>}
      {issues.length > 0 && (
        <ul className="space-y-1 text-sm">
          {issues.map(i => <li key={i.id} className="text-zinc-900 dark:text-white">· <b>{i.count}×</b> {i.label}</li>)}
        </ul>
      )}
      {fixed && (
        <div>
          <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">Corrected text</label>
          <pre className="border p-3 text-sm whitespace-pre-wrap mt-1">{fixed}</pre>
        </div>
      )}
    </div>
  )
}
