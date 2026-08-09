import { useEffect, useRef, useState } from 'react'
import { saveBlob } from '../../lib/download'

export default function MindmapGenerator() {
  const [text, setText] = useState('Ideas\n- AI tools\n  - Stem splitter\n  - Background remover\n- Marketing\n  - SEO\n  - Social media\n- Revenue\n  - Subscriptions\n  - Ads')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  type Node = { name: string, children: Node[], x?: number, y?: number, px?: number, py?: number }

  const parse = (t: string): Node => {
    const root: Node = { name: 'Root', children: [] }
    const stack: { node: Node, depth: number }[] = [{ node: root, depth: -1 }]
    for (const line of t.split('\n')) {
      const m = line.match(/^(\s*)[-*]?\s*(.+)$/)
      if (!m) continue
      const depth = Math.floor(m[1].replace(/\t/g, '  ').length / 2)
      const node: Node = { name: m[2].trim(), children: [] }
      if (!node.name) continue
      while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop()
      const parent = stack[stack.length - 1]?.node || root
      parent.children.push(node)
      stack.push({ node, depth })
    }
    return root
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const root = parse(text)
    const ctx = canvas.getContext('2d')!
    const cx = 180, cy = 300

    const layout = (node: Node, depth: number, yRange: [number, number]): number => {
      const height = node.children.length ? (() => {
        const per = 260 / Math.pow(2, Math.min(depth, 3))
        let cur = yRange[0]
        for (const c of node.children) {
          const h = Math.max(70, per)
          layout(c, depth + 1, [cur, cur + h])
          cur += h + 14
        }
        return cur - yRange[0]
      })() : 60
      node.y = yRange[0] + height / 2
      node.x = cx + depth * 170
      return height
    }

    layout(root, 0, [120, 480])

    const render = (node: Node) => {
      const x = node.x!, y = node.y!
      const isRoot = node === root
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(79,70,229,0.4)'
      ctx.lineWidth = 2
      ctx.moveTo(x, y)
      const parent = node.px as number
      if (parent !== undefined) {
        ctx.lineTo(parent, node.py as number)
        ctx.stroke()
      }
      const w = ctx.measureText(node.name).width + 28
      const h = 34
      const x0 = isRoot ? x - w / 2 : x
      ctx.beginPath()
      ctx.roundRect(x0, y - h / 2, w, h, 8)
      if (isRoot) {
        const grad = ctx.createLinearGradient(x0, y - h / 2, x0 + w, y + h / 2)
        grad.addColorStop(0, '#6366f1')
        grad.addColorStop(1, '#3730a3')
        ctx.fillStyle = grad
        ctx.fill()
        ctx.fillStyle = '#fff'
      } else {
        ctx.fillStyle = '#ffffff'
        ctx.fill()
        ctx.strokeStyle = '#4f46e5'
        ctx.stroke()
        ctx.fillStyle = '#1e293b'
      }
      ctx.font = '600 13px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.name.length > 26 ? node.name.slice(0, 25) + '…' : node.name, x0 + w / 2, y)
      for (const c of node.children) {
        c.px = x + w
        c.py = y
        render(c)
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    render(root)
  }

  useEffect(() => { draw() })

  const download = () => canvasRef.current?.toBlob(b => b && saveBlob(b, 'mindmap.png'))

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-semibold text-zinc-900 dark:text-white uppercase">Structure — indent with 2 spaces per level</label>
          <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-[380px] border p-3 text-sm font-mono mt-1" />
        </div>
        <div>
          <canvas ref={canvasRef} width={1100} height={600} className="border max-w-full" />
          <button onClick={download} className="px-5 h-10 bg-zinc-900 text-white text-sm mt-2">Download PNG</button>
        </div>
      </div>
    </div>
  )
}
