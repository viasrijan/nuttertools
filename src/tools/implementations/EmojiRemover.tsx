import { useMemo, useState } from 'react'

import { Button } from '../../components/ui/Button'

const EMOJI_RE = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\u{200D}\u{FE0F}\u{20E3}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu

export default function EmojiRemover() {
  const [text, setText] = useState('Hello 👋 world! I ❤️ NutterTools 🚀✨ Keep the smile 😊')
  const clean = useMemo(() => text.replace(EMOJI_RE, ''), [text])
  const emojis = useMemo(() => Array.from(new Set(text.match(EMOJI_RE) || [])), [text])
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(clean)}>Copy cleaned</Button>
        <span className="text-sm font-medium text-zinc-500">{emojis.length} emoji found</span>
        {emojis.length > 0 && <div className="text-lg">{emojis.join(' ')}</div>}
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-32 border p-3 text-sm" />
      <textarea value={clean} readOnly className="w-full h-32 border p-3 text-sm bg-zinc-50 dark:bg-zinc-800" placeholder="Emoji-free text" />
    </div>
  )
}
