import { useState } from 'react'

export default function ReadmeGenerator() {
  const [d, setD] = useState({
    name: 'My Awesome Project', desc: 'A short description of what this project does and why it exists.',
    badges: true, install: 'npm install', usage: 'npm run dev',
    contributing: false, license: 'MIT', features: true, todo: false,
  })
  const set = (k: string, v: any) => setD({ ...d, [k]: v })

  const gen = () => {
    const lines: string[] = []
    lines.push(`# ${d.name}`)
    if (d.badges) {
      lines.push('')
      lines.push(`[![License: ${d.license}](https://img.shields.io/badge/license-${d.license.replace(/[^a-zA-Z0-9-]/g, '')}-blue.svg)](LICENSE)`)
      lines.push('')
    }
    lines.push(d.desc)
    lines.push('')
    lines.push('## ✨ Features')
    lines.push('- Feature one')
    lines.push('- Feature two')
    lines.push('- Feature three')
    lines.push('')
    lines.push('## 🚀 Quick Start')
    lines.push('')
    lines.push('```bash')
    lines.push(d.install)
    lines.push('```')
    lines.push('')
    lines.push('```bash')
    lines.push(d.usage)
    lines.push('```')
    lines.push('')
    lines.push('## 📦 Tech Stack')
    lines.push('')
    lines.push('- React · Vite · TypeScript')
    lines.push('')
    if (d.contributing) {
      lines.push('## 🤝 Contributing')
      lines.push('Pull requests are welcome!')
      lines.push('')
    }
    lines.push(`## 📄 License`)
    lines.push('')
    lines.push(`Distributed under the ${d.license} License.`)
    return lines.join('\n')
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm"><span className="font-semibold">Project name</span><input value={d.name} onChange={e => set('name', e.target.value)} className="w-full border px-3 h-9 mt-1" /></label>
        <label className="text-sm"><span className="font-semibold">Install command</span><input value={d.install} onChange={e => set('install', e.target.value)} className="w-full border px-3 h-9 mt-1 font-mono text-xs" /></label>
        <label className="text-sm"><span className="font-semibold">Usage command</span><input value={d.usage} onChange={e => set('usage', e.target.value)} className="w-full border px-3 h-9 mt-1 font-mono text-xs" /></label>
        <label className="text-sm"><span className="font-semibold">License</span>
          <select value={d.license} onChange={e => set('license', e.target.value)} className="w-full border px-3 h-9 mt-1 bg-transparent">
            <option>MIT</option><option>Apache-2.0</option><option>GPL-3.0</option><option>BSD-3-Clause</option><option>ISC</option><option>UNLICENSED</option>
          </select></label>
      </div>
      <label className="text-sm"><span className="font-semibold">Description</span><textarea value={d.desc} onChange={e => set('desc', e.target.value)} className="w-full border p-3 h-20 mt-1" /></label>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={d.badges} onChange={e => set('badges', e.target.checked)} />Badges</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={d.contributing} onChange={e => set('contributing', e.target.checked)} />Contributing section</label>
      </div>
      <button onClick={() => navigator.clipboard.writeText(gen())} className="px-5 h-10 bg-zinc-900 text-white text-sm">Copy README</button>
      <textarea value={gen()} readOnly className="w-full h-80 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
    </div>
  )
}
