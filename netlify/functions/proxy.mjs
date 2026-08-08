export default async (req) => {
  if (req.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const service = req.queryStringParameters?.service || ''

  if (service === 'removebg') {
    const key = process.env.REMOVE_BG_KEY
    if (!key) return { statusCode: 503, body: 'REMOVE_BG_KEY is not configured on the server.' }
    let payload
    try { payload = JSON.parse(req.body || '{}') } catch { return { statusCode: 400, body: 'Invalid JSON body.' } }
    if (!payload.image) return { statusCode: 400, body: 'Missing "image" (base64).' }

    const form = new URLSearchParams()
    form.append('image_file_b64', payload.image)
    form.append('size', payload.size || 'auto')

    const upstream = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': key },
      body: form,
    })
    const buf = Buffer.from(await upstream.arrayBuffer())
    if (!upstream.ok) return { statusCode: upstream.status, body: buf.toString() }
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: { 'content-type': 'image/png' },
      body: buf.toString('base64'),
    }
  }

  if (service === 'ocrspace') {
    const key = process.env.OCR_SPACE_KEY
    if (!key) return { statusCode: 503, body: 'OCR_SPACE_KEY is not configured on the server.' }
    let payload
    try { payload = JSON.parse(req.body || '{}') } catch { return { statusCode: 400, body: 'Invalid JSON body.' } }
    if (!payload.image) return { statusCode: 400, body: 'Missing "image" (base64).' }

    const form = new FormData()
    form.append('apikey', key)
    form.append('language', payload.language || 'eng')
    form.append('isOverlayRequired', 'false')
    form.append('file', new Blob([Buffer.from(payload.image, 'base64')], { type: payload.mime || 'image/png' }), 'image')

    const upstream = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: form,
    })
    const data = await upstream.json()
    if (data?.IsErroredOnProcessing) {
      const msg = data.ErrorMessage?.[0]?.Message || 'OCR failed'
      return { statusCode: 502, body: JSON.stringify({ error: msg }) }
    }
    return { statusCode: 200, body: JSON.stringify({ ParsedResults: data.ParsedResults }) }
  }

  return { statusCode: 400, body: 'Unknown service. Use ?service=removebg or ?service=ocrspace' }
}
