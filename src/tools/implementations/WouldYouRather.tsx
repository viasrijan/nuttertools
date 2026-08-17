import { useState } from 'react'

import { Button } from '../../components/ui/Button'

const QUESTIONS: [string, string][] = [
  ['Have the ability to fly', 'Be invisible'],
  ['Always be 10 minutes early', 'Always be 10 minutes late'],
  ['Live without the internet', 'Live without coffee'],
  ['Get $1,000,000 now', 'Get $10,000 every month for life'],
  ['Only eat sweet food forever', 'Only eat salty food forever'],
  ['Be able to talk to animals', 'Speak every human language'],
  ['Have unlimited free travel', 'Have unlimited free food'],
  ['Be famous but broke', 'Be unknown but rich'],
  ['Never have to sleep', 'Never have to eat'],
  ['Ride a dragon', 'Drive a time machine'],
  ['Master every instrument', 'Master every sport'],
  ['Have super strength', 'Have super speed'],
  ['Live on the beach', 'Live in the mountains'],
  ['Read minds', 'See the future'],
  ['Be a morning person', 'Be a night owl'],
  ['Lose your sense of smell', 'Lose your sense of taste'],
  ['Always win at board games', 'Always win at video games'],
  ['Be able to redo one day', 'Skip any one day'],
  ['Know the ending of every movie', 'Know the ending of every book'],
  ['Swim with dolphins', 'Hike with pandas'],
  ['Never get lost again', 'Never get stuck in traffic again'],
  ['Have a personal chef', 'Have a personal trainer'],
  ['Be 5 cm taller', 'Be 5 cm shorter'],
  ['Perfect memory', 'Perfect focus'],
  ['Live near your family', 'Live far from everyone you know'],
  ['Be great at cooking', 'Be great at dancing'],
  ['Have a robot maid', 'Have a robot driver'],
  ['Pet every dog you meet', 'Have every dog love you'],
]

export default function WouldYouRather() {
  const [pair, setPair] = useState<[string, string]>(QUESTIONS[0])
  const [count, setCount] = useState(0)
  const [picked, setPicked] = useState('')

  const next = () => {
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]
    setPair(q)
    setPicked('')
  }

  const choose = (a: string) => {
    setPicked(a)
    setCount((c) => c + 1)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pair.map((opt, i) => (
          <button key={i} onClick={() => choose(opt)}
            className={`border p-6 text-left text-base font-semibold leading-snug transition ${picked === opt ? 'ring-2 ring-green-500 bg-green-600/10' : 'hover:border-green-500'}`}>
            <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-green-600 dark:text-green-400 mb-2">{i === 0 ? 'Option A' : 'Option B'}</span>
            {opt}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" onClick={next}>Next question</Button>
        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{count} answered · {QUESTIONS.length} questions</span>
      </div>
      {picked && (
        <div className="border p-4 text-sm text-center font-medium bg-green-600/5">
          Nice choice! <span className="font-bold">{picked}</span>
        </div>
      )}
    </div>
  )
}
