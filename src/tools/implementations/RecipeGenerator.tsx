import { useState } from 'react'
import { aiText } from '../../lib/ai'

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState('')
  const [diet, setDiet] = useState('')
  const [res, setRes] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!ingredients.trim()) { setError('List some ingredients first.'); return }
    setBusy(true); setError('')
    try {
      const dietLine = diet.trim() ? ` Dietary constraint: ${diet.trim()}.` : ''
      setRes(await aiText(`Create a recipe using: ${ingredients}.${dietLine} Include: name, servings, cook time, ingredients with quantities, and step-by-step instructions.`, { system: 'You are a helpful chef.' }))
    } catch (e: any) { setError('AI offline: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} className="w-full border p-3 h-24 text-sm" placeholder="Ingredients, e.g. chicken, garlic, tomatoes, rice" />
      <input value={diet} onChange={e => setDiet(e.target.value)} className="w-full border px-3 h-10 text-sm" placeholder="Optional: dietary constraint (vegan, gluten-free…)" />
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Cooking…' : 'Generate recipe'}</button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {res && <p className="text-sm whitespace-pre-wrap border p-4 leading-6">{res}</p>}
    </div>
  )
}
