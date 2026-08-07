export async function aiText(prompt: string, opts?: { system?: string, json?: boolean }): Promise<string> {
  const url = new URL('https://text.pollinations.ai/')
  url.searchParams.set('prompt', prompt)
  if (opts?.system) url.searchParams.set('system', opts.system)
  if (opts?.json) url.searchParams.set('json', 'true')
  const res = await fetch(url.toString(), { headers: { accept: 'text/plain' } })
  if (!res.ok) throw new Error(`AI request failed (${res.status})`)
  const text = await res.text()
  if (opts?.json) {
    try { return JSON.stringify(JSON.parse(text)) } catch { /* keep raw */ }
  }
  return text.trim()
}

const G_TRANSLATE = 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t'

export async function translateText(text: string, from: string, to: string): Promise<string> {
  const url = `${G_TRANSLATE}&sl=${from}&tl=${to}&q=${encodeURIComponent(text)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Translate failed (${res.status})`)
  const data = await res.json()
  if (!Array.isArray(data[0])) throw new Error('Translate failed')
  return data[0].map((seg: any[]) => seg[0]).join('')
}
