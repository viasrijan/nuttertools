import { useState } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

interface Line { desc: string, qty: number, rate: number }

export default function InvoiceGenerator() {
  const [from, setFrom] = useState('Acme Studio\n123 Main St, New York')
  const [to, setTo] = useState('Client Corp\n456 Market Ave')
  const [number, setNumber] = useState('INV-001')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [due, setDue] = useState('')
  const [lines, setLines] = useState<Line[]>([{ desc: 'Web design', qty: 1, rate: 500 }, { desc: 'Hosting (year)', qty: 1, rate: 120 }])
  const [note, setNote] = useState('Thank you for your business!')

  const total = lines.reduce((s, l) => s + l.qty * l.rate, 0)

  const gen = async () => {
    const pdf = await PDFDocument.create()
    const font = await pdf.embedFont(StandardFonts.Helvetica)
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
    let page = pdf.addPage([595, 842])
    const draw = (s: string, x: number, y: number, size: number, f: any, color = rgb(0.15, 0.15, 0.15)) => page.drawText(s, { x, y, size, font: f, color })
    draw('INVOICE', 50, 780, 26, bold, rgb(0.1, 0.4, 0.9))
    draw(`#${number}`, 470, 786, 13, bold)
    draw(`Date: ${date}`, 470, 770, 11, font)
    if (due) draw(`Due: ${due}`, 470, 755, 11, font)
    from.split('\n').forEach((s, i) => draw(s, 50, 720 - i * 15, 11, font))
    draw('BILL TO', 50, 660, 10, bold, rgb(0.4, 0.4, 0.4))
    to.split('\n').forEach((s, i) => draw(s, 50, 644 - i * 15, 11, font))
    let y = 560
    draw('Description', 50, y, 11, bold); draw('Qty', 350, y, 11, bold); draw('Rate', 420, y, 11, bold); draw('Amount', 490, y, 11, bold)
    y -= 14
    page.drawLine({ start: { x: 50, y: y + 6 }, end: { x: 545, y: y + 6 }, thickness: 0.6, color: rgb(0.8, 0.8, 0.8) })
    for (const l of lines) {
      if (y < 60) { page = pdf.addPage([595, 842]); y = 780 }
      draw(l.desc.slice(0, 60), 50, y, 11, font)
      draw(String(l.qty), 350, y, 11, font)
      draw(`$${l.rate.toFixed(2)}`, 420, y, 11, font)
      draw(`$${(l.qty * l.rate).toFixed(2)}`, 490, y, 11, font)
      y -= 18
    }
    draw(`Total: $${total.toFixed(2)}`, 420, Math.min(y, 500) - 20, 16, bold)
    if (note) note.split('\n').forEach((s, i) => draw(s, 50, 120 - i * 14, 10, font, rgb(0.4, 0.4, 0.4)))
    saveBlob(bytesToBlob(await pdf.save(), 'application/pdf'), `${number}.pdf`)
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="block text-sm"><span className="font-semibold">From</span><textarea value={from} onChange={e => setFrom(e.target.value)} className="w-full border p-2 mt-1 h-20 text-sm" /></label>
        <label className="block text-sm"><span className="font-semibold">Bill to</span><textarea value={to} onChange={e => setTo(e.target.value)} className="w-full border p-2 mt-1 h-20 text-sm" /></label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <input value={number} onChange={e => setNumber(e.target.value)} className="border px-3 h-9 text-sm" placeholder="Invoice #" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border px-3 h-9 text-sm" />
        <input type="date" value={due} onChange={e => setDue(e.target.value)} className="border px-3 h-9 text-sm" placeholder="Due" />
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_80px_90px_90px_36px] gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <span>Description</span><span>Qty</span><span>Rate</span><span>Amount</span><span></span>
        </div>
        {lines.map((l, i) => (
          <div key={i} className="grid grid-cols-[1fr_80px_90px_90px_36px] gap-2">
            <input value={l.desc} onChange={e => { const n = [...lines]; n[i] = { ...l, desc: e.target.value }; setLines(n) }} className="border px-2 h-9 text-sm" />
            <input type="number" value={l.qty} onChange={e => { const n = [...lines]; n[i] = { ...l, qty: parseFloat(e.target.value) || 0 }; setLines(n) }} className="border px-2 h-9 text-sm" />
            <input type="number" value={l.rate} onChange={e => { const n = [...lines]; n[i] = { ...l, rate: parseFloat(e.target.value) || 0 }; setLines(n) }} className="border px-2 h-9 text-sm" />
            <div className="h-9 grid items-center text-sm font-semibold">${(l.qty * l.rate).toFixed(2)}</div>
            <button onClick={() => setLines(lines.filter((_, x) => x !== i))} className="h-9 border text-xs">✕</button>
          </div>
        ))}
        <button onClick={() => setLines([...lines, { desc: '', qty: 1, rate: 0 }])} className="px-3 h-8 border text-sm">+ Add line</button>
      </div>
      <label className="block text-sm"><span className="font-semibold">Notes</span><input value={note} onChange={e => setNote(e.target.value)} className="w-full border px-3 h-9 mt-1 text-sm" /></label>
      <div className="flex items-center gap-3">
        <button onClick={gen} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Download PDF</button>
        <span className="text-lg font-bold">Total: ${total.toFixed(2)}</span>
      </div>
    </div>
  )
}
