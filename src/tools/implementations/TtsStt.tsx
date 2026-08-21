import { useEffect, useRef, useState } from 'react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

export default function TtsStt() {
  const [text, setText] = useState('Hello! I am your text to speech tool.')
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [lang, setLang] = useState('en-US')
  const [speaking, setSpeaking] = useState(false)
  const recRef = useRef<any>(null)
  const [recording, setRecording] = useState(false)
  const [heard, setHeard] = useState('')

  useEffect(() => {
    const load = () => setVoice(speechSynthesis.getVoices().find(v => v.lang === lang) || null)
    load()
    speechSynthesis.onvoiceschanged = load
  }, [lang])

  const speak = () => {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.voice = voice; u.rate = rate; u.pitch = pitch; u.lang = lang
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    speechSynthesis.speak(u)
  }

  const toggleRec = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { setHeard('Speech recognition is not supported in this browser. Try Chrome or Edge.'); return }
    if (recording) { recRef.current?.stop(); setRecording(false); return }
    const rec = new SR()
    rec.lang = lang
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e: any) => setHeard(Array.from(e.results).map((r: any) => r[0].transcript).join(''))
    rec.onend = () => setRecording(false)
    rec.start()
    recRef.current = rec
    setRecording(true)
  }

  return (
    <div className="space-y-5 max-w-3xl omni-rise">
      <div>
        <label className="text-sm font-semibold">Text to speak</label>
        <textarea value={text} onChange={e => setText(e.target.value)} className="w-full border p-3 h-28 text-sm mt-1" />
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <label className="text-sm">Voice</label>
          <select value={lang} onChange={e => setLang(e.target.value)} className="border px-2 h-9 text-sm bg-transparent">
            <option value="en-US">English (US)</option><option value="en-GB">English (UK)</option>
            <option value="hi-IN">Hindi</option><option value="es-ES">Spanish</option><option value="fr-FR">French</option>
            <option value="de-DE">German</option><option value="ja-JP">Japanese</option><option value="zh-CN">Chinese</option>
          </select>
          <label className="text-sm whitespace-nowrap">Rate <b className="inline-block w-8 tabular-nums">{rate}</b></label><input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(parseFloat(e.target.value))} />
          <label className="text-sm whitespace-nowrap">Pitch <b className="inline-block w-8 tabular-nums">{pitch}</b></label><input type="range" min={0} max={2} step={0.1} value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} />
          <Button variant="outline" onClick={speak} className={`px-5 h-10 text-sm ${speaking ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]'}`}>{speaking ? 'Stop' : 'Speak'}</Button>
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold">Speech to text</label>
        <Button variant="outline" onClick={toggleRec} className={`mt-2 px-5 h-10 text-sm ${recording ? 'bg-red-600 text-white animate-pulse' : 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]'}`}>
          {recording ? '● Listening…' : 'Start listening'}
        </Button>
        <textarea value={heard} onChange={e => setHeard(e.target.value)} className="w-full border p-3 h-28 text-sm mt-2" placeholder="Transcribed text appears here" />
        {heard && <CopyButton value={heard} />}
      </div>
    </div>
  )
}
