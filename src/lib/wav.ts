export function encodeWav(channels: Float32Array[], sampleRate: number): Blob {
  const numCh = channels.length
  const numSamples = channels[0].length
  const bytesPerSample = 2
  const dataSize = numSamples * numCh * bytesPerSample
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i))
  }
  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numCh, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numCh * bytesPerSample, true)
  view.setUint16(32, numCh * bytesPerSample, true)
  view.setUint16(34, 16, true)
  writeStr(36, 'data')
  view.setUint32(40, dataSize, true)
  let off = 44
  const interleaved = new Float32Array(numSamples * numCh)
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numCh; c++) interleaved[i * numCh + c] = channels[c][i]
  }
  for (let i = 0; i < interleaved.length; i++) {
    const s = Math.max(-1, Math.min(1, interleaved[i]))
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    off += 2
  }
  return new Blob([buffer], { type: 'audio/wav' })
}
