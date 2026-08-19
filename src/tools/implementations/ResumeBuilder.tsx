import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function ResumeBuilder() {
  const [data, setData] = useState({
    name: 'Jane Doe', title: 'Software Engineer', email: 'jane@example.com',
    phone: '+1 555 000 1234', website: 'janedoe.dev', location: 'San Francisco',
    summary: 'Engineer with 5 years of experience building web products.',
    skills: 'React, TypeScript, Node.js, Python, AWS',
    jobs: [{ role: 'Senior Engineer', company: 'TechCorp', years: '2021 – Now', points: 'Led a team of 4; shipped features used by 2M users.' }],
    edu: 'B.Sc. Computer Science, State University',
  })
  const set = (k: string, v: any) => setData({ ...data, [k]: v })

  const gen = async () => {
    const pdf = await PDFDocument.create()
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
    const page = pdf.addPage([595, 842])
    const draw = (s: string, y: number, size: number, f: any, color = rgb(0.2, 0.2, 0.2)) => { if (s) page.drawText(s, { x: 50, y, size, font: f, color }) }
    draw(data.name, 780, 26, bold, rgb(0.08, 0.08, 0.1))
    draw(data.title, 752, 13, font, rgb(0.3, 0.3, 0.35))
    const contact = [data.email, data.phone, data.website, data.location].filter(Boolean).join('  ·  ')
    draw(contact, 736, 10, font, rgb(0.35, 0.35, 0.4))
    if (data.summary) { draw('SUMMARY', 700, 11, bold, rgb(0.1, 0.4, 0.9)); draw(data.summary.slice(0, 200), 682, 11, font) }
    if (data.skills) { draw('SKILLS', 640, 11, bold, rgb(0.1, 0.4, 0.9)); draw(data.skills.slice(0, 120), 622, 11, font) }
    draw('EXPERIENCE', 580, 11, bold, rgb(0.1, 0.4, 0.9))
    let y = 562
    for (const j of data.jobs) {
      draw(`${j.role} — ${j.company}  (${j.years})`, y, 11, bold); y -= 14
      draw(j.points.slice(0, 180), y, 10, font); y -= 18
    }
    if (data.edu) { draw('EDUCATION', y - 6, 11, bold, rgb(0.1, 0.4, 0.9)); draw(data.edu.slice(0, 120), y - 24, 11, font) }
    saveBlob(bytesToBlob(await pdf.save(), 'application/pdf'), `${data.name.replace(/\s+/g, '-')}-resume.pdf`)
  }

  return (
    <div className="space-y-5 max-w-3xl omni-rise">
      <input value={data.name} onChange={e => set('name', e.target.value)} className="w-full border px-3 h-9 text-sm" placeholder="Full name" />
      <input value={data.title} onChange={e => set('title', e.target.value)} className="w-full border px-3 h-9 text-sm" placeholder="Job title" />
      <div className="grid md:grid-cols-2 gap-3">
        <input value={data.email} onChange={e => set('email', e.target.value)} className="border px-3 h-9 text-sm" placeholder="Email" />
        <input value={data.phone} onChange={e => set('phone', e.target.value)} className="border px-3 h-9 text-sm" placeholder="Phone" />
        <input value={data.website} onChange={e => set('website', e.target.value)} className="border px-3 h-9 text-sm" placeholder="Website" />
        <input value={data.location} onChange={e => set('location', e.target.value)} className="border px-3 h-9 text-sm" placeholder="Location" />
      </div>
      <textarea value={data.summary} onChange={e => set('summary', e.target.value)} className="w-full border p-3 h-20 text-sm" placeholder="Summary" />
      <input value={data.skills} onChange={e => set('skills', e.target.value)} className="w-full border px-3 h-9 text-sm" placeholder="Skills (comma separated)" />
      <div className="border p-3 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Experience</p>
        {data.jobs.map((j, i) => (
          <div key={i} className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <input value={j.role} onChange={e => { const n = [...data.jobs]; n[i] = { ...j, role: e.target.value }; set('jobs', n) }} className="border px-2 h-9 text-sm" placeholder="Role" />
              <input value={j.company} onChange={e => { const n = [...data.jobs]; n[i] = { ...j, company: e.target.value }; set('jobs', n) }} className="border px-2 h-9 text-sm" placeholder="Company" />
              <input value={j.years} onChange={e => { const n = [...data.jobs]; n[i] = { ...j, years: e.target.value }; set('jobs', n) }} className="border px-2 h-9 text-sm" placeholder="Years" />
            </div>
            <textarea value={j.points} onChange={e => { const n = [...data.jobs]; n[i] = { ...j, points: e.target.value }; set('jobs', n) }} className="w-full border p-2 h-16 text-sm" placeholder="Achievements" />
          </div>
        ))}
        <button onClick={() => set('jobs', [...data.jobs, { role: '', company: '', years: '', points: '' }])} className="px-4 h-9 text-sm font-bold text-white bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-[0_1px_2px_rgba(0,0,0,0.15),0_6px_16px_-6px_rgba(5,150,105,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95">+ Add job</button>
      </div>
      <input value={data.edu} onChange={e => set('edu', e.target.value)} className="w-full border px-3 h-9 text-sm" placeholder="Education" />
      <Button variant="secondary" onClick={gen}>Download PDF</Button>
    </div>
  )
}
