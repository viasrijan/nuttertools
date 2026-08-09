import { useMemo, useState } from 'react'

export default function EmailSignature() {
  const [name, setName] = useState('Nutter Dev')
  const [title, setTitle] = useState('Web Developer')
  const [company, setCompany] = useState('NutterTools')
  const [email, setEmail] = useState('dev@nutter.tools')
  const [phone, setPhone] = useState('+1 555 0100')
  const [website, setWebsite] = useState('nutter.tools')
  const [color, setColor] = useState('#4f46e5')

  const sig = useMemo(() => {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    return `<table cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333;border-collapse:collapse">
  <tr>
    <td style="padding-right:16px;border-right:1px solid #ddd" valign="top">
      <table cellpadding="0" cellspacing="0">
        <tr><td style="font-size:16px;font-weight:bold;color:${color}">${esc(name)}</td></tr>
        <tr><td style="font-size:13px;color:#666">${esc(title)} · ${esc(company)}</td></tr>
        <tr><td style="padding-top:8px;font-size:12px;color:#888">✉ <a href="mailto:${esc(email)}" style="color:#666;text-decoration:none">${esc(email)}</a><br/>☎ ${esc(phone)}<br/>🌐 <a href="https://${esc(website)}" style="color:#666;text-decoration:none">${esc(website)}</a></td></tr>
      </table>
    </td>
  </tr>
</table>`
  }, [name, title, company, email, phone, website, color])

  const field = (label: string, v: string, set: (s: string) => void) => (
    <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">{label}</label><input value={v} onChange={e => set(e.target.value)} className="w-full border px-2 py-2 text-sm mt-1" /></div>
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {field('Name', name, setName)}
        {field('Job title', title, setTitle)}
        {field('Company', company, setCompany)}
        {field('Email', email, setEmail)}
        {field('Phone', phone, setPhone)}
        <div><label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">Website</label><div className="flex items-center gap-1 mt-1"><span className="text-sm">https://</span><input value={website} onChange={e => setWebsite(e.target.value)} className="flex-1 border px-2 py-2 text-sm" /></div></div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Accent</label>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 border" />
      </div>
      <div className="border p-4 overflow-x-auto" dangerouslySetInnerHTML={{ __html: sig }} />
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(sig)} className="px-5 h-10 bg-zinc-900 text-white text-sm">Copy HTML signature</button>
        <a href={`data:text/html;charset=utf-8,${encodeURIComponent(sig)}`} download="signature.html" className="px-5 h-10 border text-sm inline-flex items-center">Download .html</a>
      </div>
      <p className="text-[11px] text-zinc-500">In Gmail: Settings → Signature → paste with formatting. In Outlook: insert signature as HTML file.</p>
    </div>
  )
}
