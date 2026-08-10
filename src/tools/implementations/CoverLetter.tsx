import { useMemo, useState } from 'react'

export default function CoverLetter() {
  const [name, setName] = useState('Alex Doe')
  const [role, setRole] = useState('Frontend Developer')
  const [company, setCompany] = useState('Acme Corp')
  const [skills, setSkills] = useState('React, TypeScript, performance optimization, team leadership')
  const [highlight, setHighlight] = useState('I rebuilt our design system which cut development time by 30%')
  const [tone, setTone] = useState<'professional' | 'casual'>('professional')

  const letter = useMemo(() => {
    const body = tone === 'professional'
      ? `I am writing to express my strong interest in the ${role} position at ${company}. With experience in ${skills}, I believe I can contribute from day one.\n\nOne achievement I am especially proud of: ${highlight}.\n\nI would welcome the opportunity to discuss how my skills align with ${company}'s goals. Thank you for your time and consideration.`
      : `Hey ${company.split(' ')[0]} team — I saw the ${role} opening and it honestly feels like it was written for me. I work with ${skills} and love shipping things that matter.\n\nQuick brag: ${highlight}. Would love to chat about how I can help out. Cheers!`
    const closing = tone === 'professional' ? 'Sincerely,' : 'Thanks,'
    return `Dear Hiring Manager,\n\n${body}\n\n${closing}\n${name}\n${name.split(' ')[0].toLowerCase()}@example.com`
  }, [name, role, company, skills, highlight, tone])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Your name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full border px-2 py-2 mt-1" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Role</label><input value={role} onChange={e => setRole(e.target.value)} className="w-full border px-2 py-2 mt-1" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Company</label><input value={company} onChange={e => setCompany(e.target.value)} className="w-full border px-2 py-2 mt-1" /></div>
        <div className="col-span-2"><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Key skills</label><input value={skills} onChange={e => setSkills(e.target.value)} className="w-full border px-2 py-2 mt-1" /></div>
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Tone</label>
          <select value={tone} onChange={e => setTone(e.target.value as typeof tone)} className="w-full border px-2 py-2 mt-1">
            <option value="professional">Professional</option><option value="casual">Friendly</option>
          </select>
        </div>
      </div>
      <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Top achievement (sell yourself!)</label><input value={highlight} onChange={e => setHighlight(e.target.value)} className="w-full border px-2 py-2 text-sm mt-1" /></div>
      <pre className="border p-4 text-sm whitespace-pre-wrap leading-relaxed">{letter}</pre>
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(letter)} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Copy letter</button>
      </div>
      <p className="text-[11px] text-zinc-500">A template scaffold — replace the bold claims with your real numbers and proof before sending.</p>
    </div>
  )
}
