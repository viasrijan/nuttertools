export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const key = process.env.GEMINI_API_KEY
  if (!key) {
    return res.status(500).json({ error: 'NO_KEY' })
  }

  const { image, mimeType } = req.body ?? {}
  if (!image || typeof image !== 'string') {
    return res.status(400).json({ error: 'Missing image' })
  }

  const model = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'Describe this image in one detailed, accurate sentence. Focus on the actual content (objects, people, scene, colors, text, mood). If it is a photograph or artwork, mention that.',
          },
          {
            inline_data: {
              mime_type: mimeType || 'image/jpeg',
              data: image,
            },
          },
        ],
      },
    ],
    generationConfig: { maxOutputTokens: 120, temperature: 0.4 },
  }

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!r.ok) {
      const detail = (await r.text().catch(() => '')).slice(0, 500)
      return res.status(502).json({ error: 'GEMINI_ERROR', detail })
    }

    const j = await r.json()
    const text =
      j?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') ?? ''
    if (!text) {
      return res.status(502).json({ error: 'Gemini returned an empty response' })
    }
    return res.status(200).json({ caption: text.trim() })
  } catch (e: any) {
    return res.status(502).json({ error: 'Gemini request failed: ' + e.message })
  }
}