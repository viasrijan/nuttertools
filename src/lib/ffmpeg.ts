import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

let instance: FFmpeg | null = null
let loading: Promise<FFmpeg> | null = null

export function getFFmpeg(): Promise<FFmpeg> {
  if (instance) return Promise.resolve(instance)
  if (loading) return loading
  loading = (async () => {
    const ffmpeg = new FFmpeg()
    const base = new URL(import.meta.env.BASE_URL, window.location.href).toString()
    await ffmpeg.load({
      coreURL: await toBlobURL(`${base}ffmpeg/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${base}ffmpeg/ffmpeg-core.wasm`, 'application/wasm'),
    })
    instance = ffmpeg
    return ffmpeg
  })()
  return loading
}

export async function ffmpegRun(
  input: File,
  args: string[],
  outputName: string,
  mime: string,
): Promise<Blob> {
  const ffmpeg = await getFFmpeg()
  const ext = (outputName.match(/\.[^.]+$/) || ['.out'])[0]
  const inName = `input${ext}`
  await ffmpeg.writeFile(inName, new Uint8Array(await input.arrayBuffer()))
  await ffmpeg.exec(['-i', inName, '-y', ...args, outputName])
  const data = await ffmpeg.readFile(outputName)
  const u8 = data instanceof Uint8Array ? data : new TextEncoder().encode(data as string)
  await ffmpeg.deleteFile(inName)
  await ffmpeg.deleteFile(outputName)
  return new Blob([u8.slice().buffer as ArrayBuffer], { type: mime })
}
