import { saveAs } from 'file-saver'

export function saveBlob(blob: Blob, name: string) {
  saveAs(blob, name)
}

export function saveDataUrl(dataUrl: string, name: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = name
  a.click()
}

export function bytesToBlob(bytes: Uint8Array, type?: string) {
  return new Blob([bytes.slice()], { type })
}

export function fileNameBase(name: string) {
  const i = name.lastIndexOf('.')
  return i > 0 ? name.slice(0, i) : name
}
