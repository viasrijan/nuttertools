import { useRef, useState } from 'react'
import { saveBlob } from '../../lib/download'

const NOTES = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

function noteFreq(base: number, semis: number) { return base * Math.pow(2, semis / 12) }
function midiToFreq(m: number) { return 440 * Math.pow(2, (m - 69) / 12) }
function nameToMidi(name: string): number | null {
  const m = name.match(/^([A-Ga-g])(#?)(\d)$/)
  if (!m) return null
  const base = [0, 2, 4, 5, 7, 9, 11]['ABCDEFG'.indexOf(m[1].toUpperCase())]
  return (parseInt(m[3]) + 1) * 12 + base + (m[2] === '#' ? 1 : 0)
}

function wavFromFloat(data: Float32Array, rate: number): Blob {
  const buf = new ArrayBuffer(44 + data.length * 2)
  const v = new DataView(buf)
  const writeStr = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)) }
  writeStr(0, 'RIFF'); v.setUint32(4, 36 + data.length * 2, true); writeStr(8, 'WAVE')
  writeStr(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  writeStr(36, 'data'); v.setUint32(40, data.length * 2, true)
  for (let i = 0; i < data.length; i++) { v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, data[i])) * 32767, true) }
  return new Blob([buf], { type: 'audio/wav' })
}

export default function ToneGenerator() {
  const [note, setNote] = useState('A4')
  const [wave, setWave] = useState<OscillatorType>('sine')
  const [dur, setDur] = useState(1.5)
  const [volume, setVolume] = useState(0.5)
  const [playing, setPlaying] = useState(false)
  const [exporting, setExporting] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)

  const freq = nameToMidi(note) != null ? midiToFreq(nameToMidi(note)!) : 440

  const play = () => {
    const ctx = ctxRef.current ?? new AudioContext()
    ctxRef.current = ctx
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = wave
    osc.frequency.value = freq
    gain.gain.value = volume
    osc.connect(gain).connect(ctx.destination)
    const t = ctx.currentTime
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.02)
    gain.gain.setValueAtTime(volume, t + Math.max(0.02, dur - 0.05))
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    osc.start(t); osc.stop(t + dur + 0.05)
  }

  const stop = () => { ctxRef.current?.close(); ctxRef.current = null; setPlaying(false) }

  const exportWav = async () => {
    setExporting(true)
    const ctx = new OfflineAudioContext(1, Math.round(44100 * dur), 44100)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = wave; osc.frequency.value = freq
    gain.gain.value = volume
    osc.connect(gain).connect(ctx.destination)
    osc.start(0); osc.stop(dur)
    const rendered = await ctx.startRendering()
    const data = rendered.getChannelData(0)
    saveBlob(wavFromFloat(data, 44100), `${note}-${wave}.wav`)
    setExporting(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex flex-wrap gap-2">
        {NOTES.flatMap(n => [n + '3', n + '4', n + '5']).map(n => (
          <button key={n} onClick={() => setNote(n)} className={`px-2.5 h-8 text-xs border rounded ${note === n ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{n}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {['sine', 'square', 'triangle', 'sawtooth'].map(w => (
          <button key={w} onClick={() => setWave(w as OscillatorType)} className={`px-3 h-9 text-sm capitalize border rounded ${wave === w ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{w}</button>
        ))}
      </div>
      <p className="text-2xl font-bold">{freq.toFixed(1)} Hz</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm font-semibold">Duration ({dur}s)<input type="range" min={0.2} max={5} step={0.1} value={dur} onChange={e => setDur(parseFloat(e.target.value))} className="w-full mt-2" /></label>
        <label className="text-sm font-semibold">Volume ({Math.round(volume * 100)}%)<input type="range" min={0} max={1} step={0.05} value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-full mt-2" /></label>
      </div>
      <div className="flex gap-2">
        <button onClick={play} className="px-6 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Play</button>
        <button onClick={stop} className="px-6 h-10 border text-sm">Stop</button>
        <button onClick={exportWav} disabled={exporting} className="px-6 h-10 border text-sm">{exporting ? 'Rendering…' : 'Download WAV'}</button>
      </div>
    </div>
  )
}
