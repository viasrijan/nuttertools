import { useRef, useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import { DownloadButton } from '../../components/ui/DownloadButton'
import { saveDataUrl } from '../../lib/download'

export default function ImageCropper() {
  const [img, setImg] = useState<{ url: string, w: number, h: number } | null>(null)
  const [box, setBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null)
  const [out, setOut] = useState<string>('')
  const stageRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startX: number, startY: number, mode: 'new' | 'move' | 'resize', orig: any } | null>(null)
  const aspectRef = useRef(0)

  const dropFiles: DropFile[] = img ? [{ name: 'Image', size: 0, url: img.url }] : []

  const onFiles = async (fl: FileList) => {
    const f = fl[0]
    if (!f || !f.type.startsWith('image/')) return
    const url = URL.createObjectURL(f)
    const im = new Image()
    im.src = url
    await new Promise(r => im.onload = r)
    setImg({ url, w: im.width, h: im.height })
    setBox({ x: Math.round(im.width * 0.1), y: Math.round(im.height * 0.1), w: Math.round(im.width * 0.8), h: Math.round(im.height * 0.8) })
    setOut('')
  }

  const toStage = (e: React.PointerEvent) => {
    const r = stageRef.current!.getBoundingClientRect()
    return { x: (e.clientX - r.left) * (img!.w / r.width), y: (e.clientY - r.top) * (img!.h / r.height) }
  }

  const down = (e: React.PointerEvent) => {
    if (!img || !box) return
    const p = toStage(e)
    const near = (a: number, b: number) => Math.abs(a - b) < 10
    const onEdge = near(p.x, box.x) || near(p.x, box.x + box.w) || near(p.y, box.y) || near(p.y, box.y + box.h)
    const inside = p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h
    drag.current = { startX: p.x, startY: p.y, mode: onEdge ? 'resize' : inside ? 'move' : 'new', orig: { ...box } }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const move = (e: React.PointerEvent) => {
    if (!img || !box || !drag.current) return
    const p = toStage(e)
    const d = drag.current
    let nx = box.x, ny = box.y, nw = box.w, nh = box.h
    if (d.mode === 'new') {
      nx = Math.min(p.x, d.startX); ny = Math.min(p.y, d.startY)
      nw = Math.abs(p.x - d.startX); nh = Math.abs(p.y - d.startY)
    } else if (d.mode === 'move') {
      nx = Math.max(0, Math.min(img.w - box.w, d.orig.x + (p.x - d.startX)))
      ny = Math.max(0, Math.min(img.h - box.h, d.orig.y + (p.y - d.startY)))
    } else {
      nx = Math.max(0, Math.min(d.orig.x + (p.x - d.startX), d.orig.x + d.orig.w - 10))
      ny = Math.max(0, Math.min(d.orig.y + (p.y - d.startY), d.orig.y + d.orig.h - 10))
      nw = d.orig.w + d.orig.x - nx
      nh = d.orig.h + d.orig.y - ny
    }
    if (aspectRef.current > 0 && nw > 0) {
      nh = nw / aspectRef.current
      if (nh > img.h - ny) { nh = img.h - ny; nw = nh * aspectRef.current }
    }
    setBox({ x: nx, y: ny, w: nw, h: nh })
  }

  const up = () => { drag.current = null }

  const apply = () => {
    if (!img || !box) return
    const c = document.createElement('canvas')
    c.width = Math.round(box.w); c.height = Math.round(box.h)
    const ctx = c.getContext('2d')!
    const im = new Image()
    im.onload = () => {
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(im, box.x, box.y, box.w, box.h, 0, 0, c.width, c.height)
      setOut(c.toDataURL('image/png'))
    }
    im.src = img.url
  }

  return (
    <div className="space-y-5">
      {!img ? (
        <DropZone onFiles={onFiles} accept="image/*" multiple={false} files={dropFiles} onClear={() => { setImg(null); setOut('') }} label="Drop an image to crop" />
      ) : (
        <>
          <DropZone onFiles={onFiles} accept="image/*" multiple={false} files={dropFiles} onClear={() => { setImg(null); setOut('') }} label="Drop a new image" />
          <div className="flex flex-wrap items-center gap-2">
            <select onChange={e => aspectRef.current = parseFloat(e.target.value) || 0} className="h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
              <option value="0">Free</option>
              <option value="1">Square 1:1</option>
              <option value="1.5">3:2</option>
              <option value="1.777">16:9</option>
              <option value="0.75">4:3</option>
              <option value="1.25">5:4</option>
            </select>
            <button onClick={apply} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-colors">Apply crop</button>
            {out && <DownloadButton onClick={() => saveDataUrl(out, 'cropped.png')}>Download PNG</DownloadButton>}
          </div>
          <div
            ref={stageRef}
            onPointerDown={down} onPointerMove={move} onPointerUp={up}
            className="relative select-none touch-none overflow-hidden"
            style={{ aspectRatio: `${img.w} / ${img.h}`, maxHeight: 480 }}
          >
            <img src={img.url} className="w-full h-full object-contain pointer-events-none" alt="Source" />
            {box && (
              <div className="absolute border-2 border-white ring-1 ring-black/30 bg-white/20"
                style={{ left: `${box.x / img.w * 100}%`, top: `${box.y / img.h * 100}%`, width: `${box.w / img.w * 100}%`, height: `${box.h / img.h * 100}%` }}>
                <div className="absolute w-2.5 h-2.5 -left-1 -top-1 bg-white border border-black/40" />
                <div className="absolute w-2.5 h-2.5 -right-1 -top-1 bg-white border border-black/40" />
                <div className="absolute w-2.5 h-2.5 -left-1 -bottom-1 bg-white border border-black/40" />
                <div className="absolute w-2.5 h-2.5 -right-1 -bottom-1 bg-white border border-black/40" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
