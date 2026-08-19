export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = reject
    r.readAsDataURL(file)
  })

export const ocrText = async (file: File): Promise<string | null> => {
  try {
    const image = await fileToBase64(file)
    const res = await fetch('/api/proxy?service=ocrspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, mime: file.type }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const text = (data?.ParsedResults?.map((r: { ParsedText?: string }) => r.ParsedText || '').join(' ') || '').trim()
    return text || null
  } catch {
    return null
  }
}

export const topWords = (text: string, max = 4, stop = new Set<string>()): string[] => {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !stop.has(w))
  return [...new Set(words)].slice(0, max)
}

export const stem = (name: string): string =>
  name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim().slice(0, 24)
