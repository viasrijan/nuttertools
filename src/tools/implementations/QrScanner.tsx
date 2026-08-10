import { useEffect, useRef, useState } from 'react'

type BarcodeValue = { format: string, rawValue: string }

export default function QrScanner() {
  const [mode, setMode] = useState<'camera' | 'image' | null>(null)
  const [results, setResults] = useState<BarcodeValue[]>([])
  const [error, setError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)

  const supported = typeof window !== 'undefined' && 'BarcodeDetector' in window
  const detector = supported ? new (window as any).BarcodeDetector({ formats: ['qr_code'] }) : null

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const scanLoop = async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanLoop)
      return
    }
    try {
      const codes = await detector.detect(videoRef.current)
      if (codes.length > 0) {
        const vs = codes.map((c: any) => ({ format: c.format, rawValue: c.rawValue }))
        setResults((prev) => [...vs.filter((v: BarcodeValue) => !prev.some((p) => p.rawValue === v.rawValue)), ...prev].slice(0, 20))
      }
    } catch { /* frame skipped */ }
    rafRef.current = requestAnimationFrame(scanLoop)
  }

  const startCamera = async () => {
    setError('')
    setResults([])
    setMode('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        scanLoop()
      }
    } catch (e) {
      setError('Camera access was denied or unavailable. Try the image upload instead.')
      setMode(null)
    }
  }

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setMode(null)
  }

  const scanImage = async (file: File) => {
    setError('')
    setResults([])
    try {
      const bitmap = await createImageBitmap(file)
      const codes = await detector.detect(bitmap)
      if (codes.length === 0) {
        setError('No QR code found in that image. Try a clearer photo.')
      } else {
        setResults(codes.map((c: any) => ({ format: c.format, rawValue: c.rawValue })))
      }
      bitmap.close()
    } catch {
      setError('Could not read that image.')
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      {!supported && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">Your browser doesn't support QR scanning (needs Chrome or Edge).</p>
      )}
      {supported && mode === null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={startCamera} className="border p-8 text-center hover:border-green-500 transition">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400 mb-2">Use camera</div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">Point at a QR code</div>
          </button>
          <label className="border p-8 text-center hover:border-green-500 transition cursor-pointer block">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400 mb-2">Upload image</div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">Scan a QR from a photo</div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) scanImage(f) }} />
          </label>
        </div>
      )}
      {mode === 'camera' && (
        <div className="space-y-3">
          <div className="relative border overflow-hidden bg-black">
            <video ref={videoRef} className="w-full h-64 object-cover" muted playsInline />
            <div className="absolute inset-0 pointer-events-none border-[3px] border-green-500/70 m-auto w-48 h-48" />
          </div>
          <button onClick={stopCamera} className="px-5 h-10 text-sm font-semibold ring-1 ring-zinc-200 dark:ring-zinc-800">Stop camera</button>
        </div>
      )}
      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      {results.length > 0 && (
        <div className="border divide-y divide-zinc-200 dark:divide-zinc-800">
          {results.map((r) => (
            <div key={r.rawValue} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase text-zinc-400">{r.format}</div>
                <div className="text-sm font-mono font-semibold break-all text-zinc-900 dark:text-white">{r.rawValue}</div>
              </div>
              <button onClick={() => navigator.clipboard.writeText(r.rawValue)}
                className="text-xs font-bold text-green-600 dark:text-green-400 shrink-0">Copy</button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Scanning happens entirely in your browser — the camera feed never leaves your device.</p>
    </div>
  )
}
