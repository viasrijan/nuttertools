import { useState } from 'react'

export default function PalindromeChecker() {
  const [input, setInput] = useState('')

  const clean = input.toLowerCase().replace(/[^a-z0-9]/g, '')
  const reversed = [...clean].reverse().join('')
  const isPal = clean.length > 0 && clean === reversed
  const letters = clean.length

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} spellCheck={false}
        placeholder="Type or paste any text…"
        className="w-full border bg-transparent p-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-indigo-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500" />
      {clean.length > 0 && (
        <div className={`border p-6 text-center ${isPal ? 'border-green-500' : ''}`}>
          <div className={`text-3xl font-black tracking-tight ${isPal ? 'text-green-600 dark:text-green-400' : 'text-zinc-900 dark:text-white'}`}>
            {isPal ? 'Palindrome' : 'Not a palindrome'}
          </div>
          <div className="mt-3 space-y-1 text-sm font-mono text-zinc-500 dark:text-zinc-400">
            <div>Ignoring case, spaces and punctuation: <span className="font-bold text-zinc-900 dark:text-white">{clean || '(empty)'}</span></div>
            <div>Reversed: <span className="font-bold text-zinc-900 dark:text-white">{reversed || '(empty)'}</span></div>
            <div>{letters} letter{letters === 1 ? '' : 's'} compared</div>
          </div>
        </div>
      )}
      {clean.length === 0 && input.length > 0 && (
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No letters found (only numbers and punctuation).</p>
      )}
    </div>
  )
}
