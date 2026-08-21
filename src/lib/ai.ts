async function geminiText(prompt: string, opts?: { system?: string, json?: boolean }): Promise<string> {
  const res = await fetch('/api/proxy?service=gemini', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt, system: opts?.system, json: opts?.json }),
  })
  if (!res.ok) throw new Error(`Gemini unavailable (${res.status})`)
  const data = await res.json()
  const text = data?.text
  if (typeof text !== 'string' || !text.trim()) throw new Error('Empty Gemini response')
  return opts?.json ? JSON.stringify(JSON.parse(text)) : text.trim()
}

async function pollinationsText(prompt: string, opts?: { system?: string, json?: boolean }): Promise<string> {
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

// Google Gemini first (fast + efficient) — falls back to the free keyless model when
// GEMINI_API_KEY is not configured on the server.
export async function aiText(prompt: string, opts?: { system?: string, json?: boolean }): Promise<string> {
  try {
    return await geminiText(prompt, opts)
  } catch {
    return await pollinationsText(prompt, opts)
  }
}

// Google Gemini image model (nano banana) — returns { data: base64, mime }.
export async function aiImage(prompt: string, imageBase64: string, mime = 'image/png'): Promise<{ data: string, mime: string }> {
  const res = await fetch('/api/proxy?service=gemini-image', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt, image: imageBase64, mime }),
  })
  if (!res.ok) {
    let msg = `AI image request failed (${res.status})`
    try { const j = await res.json(); if (j?.error) msg = j.error } catch { /* keep default */ }
    throw new Error(msg)
  }
  const out = await res.json()
  if (!out?.data) throw new Error('No image returned')
  return out
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
