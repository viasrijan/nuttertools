export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const service = req.query.service || ''

  if (service === 'removebg') {
    const key = process.env.REMOVE_BG_KEY
    if (!key) {
      res.status(503).send('REMOVE_BG_KEY is not configured on the server.')
      return
    }
    const payload = req.body || {}
    if (!payload.image) {
      res.status(400).send('Missing "image" (base64).')
      return
    }

    const form = new URLSearchParams()
    form.append('image_file_b64', payload.image)
    form.append('size', payload.size || 'auto')

    const upstream = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': key },
      body: form,
    })
    const buf = Buffer.from(await upstream.arrayBuffer())
    if (!upstream.ok) {
      res.status(upstream.status).send(buf)
      return
    }
    res.setHeader('content-type', 'image/png')
    res.status(200).send(buf)
    return
  }

  if (service === 'ocrspace') {
    const key = process.env.OCR_SPACE_KEY
    if (!key) {
      res.status(503).send('OCR_SPACE_KEY is not configured on the server.')
      return
    }
    const payload = req.body || {}
    if (!payload.image) {
      res.status(400).send('Missing "image" (base64).')
      return
    }

    const form = new FormData()
    form.append('apikey', key)
    form.append('language', payload.language || 'eng')
    form.append('isOverlayRequired', 'false')
    const mime = payload.mime || 'image/png'
    form.append('filetype', mime.split('/')[1].toUpperCase().replace('JPEG', 'JPG'))
    form.append('file', new Blob([Buffer.from(payload.image, 'base64')], { type: mime }), 'image.png')

    const upstream = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: form,
    })
    const data = await upstream.json()
    if (data?.IsErroredOnProcessing) {
      const msg = data.ErrorMessage?.[0]?.Message || 'OCR failed'
      res.status(502).json({ error: msg })
      return
    }
    res.status(200).json({ ParsedResults: data.ParsedResults })
    return
  }

  if (service === 'gemini') {
    const key = process.env.GEMINI_API_KEY
    if (!key) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' })
      return
    }
    const payload = req.body || {}
    const body = {
      contents: [{ role: 'user', parts: [{ text: payload.prompt || '' }] }],
      generationConfig: {},
    }
    if (payload.system) body.systemInstruction = { parts: [{ text: payload.system }] }
    if (payload.json) body.generationConfig.responseMimeType = 'application/json'
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await upstream.json().catch(() => null)
    if (!upstream.ok || !data) {
      res.status(502).json({ error: data?.error?.message || 'Gemini request failed' })
      return
    }
    const text = (data?.candidates?.[0]?.content?.parts || []).map(p => p.text).filter(Boolean).join('')
    res.status(200).json({ text })
    return
  }

  if (service === 'gemini-image') {
    const key = process.env.GEMINI_API_KEY
    if (!key) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' })
      return
    }
    const payload = req.body || {}
    if (!payload.image) {
      res.status(400).send('Missing "image" (base64).')
      return
    }
    const body = {
      contents: [{
        role: 'user',
        parts: [
          { text: payload.prompt || 'Enhance this image.' },
          { inline_data: { mime_type: payload.mime || 'image/png', data: payload.image } },
        ],
      }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await upstream.json().catch(() => null)
    if (!upstream.ok || !data) {
      res.status(502).json({ error: data?.error?.message || 'Gemini image request failed' })
      return
    }
    const parts = data?.candidates?.[0]?.content?.parts || []
    const imgPart = parts.find(p => p.inlineData || p.inline_data)
    if (!imgPart) {
      res.status(502).json({ error: 'Gemini returned no image' })
      return
    }
    const inline = imgPart.inlineData || imgPart.inline_data
    res.status(200).json({ data: inline.data, mime: inline.mimeType || inline.mime_type || 'image/png' })
    return
  }

  res.status(400).send('Unknown service. Use ?service=removebg, ?service=ocrspace, ?service=gemini or ?service=gemini-image')
}
