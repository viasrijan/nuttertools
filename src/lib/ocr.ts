export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = reject
    r.readAsDataURL(file)
  })

// Open-source Tesseract.js OCR — runs fully in the browser, no servers, keys or quotas.
export const ocrText = async (file: File): Promise<string | null> => {
  let worker: any = null
  try {
    const { createWorker } = await import('tesseract.js')
    worker = await createWorker('eng')
    const ret = await worker.recognize(file)
    const text = String(ret?.data?.text || '').trim()
    return text || null
  } catch {
    return null
  } finally {
    try { await worker?.terminate() } catch { /* ignore */ }
  }
}

export const topWords = (text: string, max = 4, stop = new Set<string>()): string[] => {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !stop.has(w))
  return [...new Set(words)].slice(0, max)
}

export const stem = (name: string): string =>
  name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim().slice(0, 24)
