import { useState } from 'react'
import DropZone from '../../components/DropZone'

export default function BgRemover(){
  const [orig,setOrig]=useState<string>("")
  const [out,setOut]=useState<string>("")
  const [loading,setLoading]=useState(false)

  const onFiles = async (fl:FileList)=>{
    const file = fl[0]
    if(!file) return
    setOrig(URL.createObjectURL(file))
    setLoading(true)
    try{
      // Try to use @imgly/background-removal if available, else fallback to simple
      // @ts-ignore
      const mod = await import('@imgly/background-removal').catch(()=>null)
      if(mod){
        const blob = await mod.removeBackground(file)
        setOut(URL.createObjectURL(blob))
      } else {
        // Fallback: just show original and say install lib
        setOut("")
      }
    }catch(e){
      console.log(e)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <DropZone onFiles={onFiles} accept="image/*" multiple={false}/>
      {loading && <p className="text-sm animate-pulse">Removing background with local AI... first run downloads model (~30MB)</p>}
      {!loading && !out && orig && <p className="text-xs text-zinc-500">Install @imgly/background-removal for real AI removal: npm i @imgly/background-removal. For now showing original.</p>}
      <div className="grid grid-cols-2 gap-4">
        {orig && <div><p className="text-xs mb-1">Original</p><img src={orig} className="border"/></div>}
        {out && <div><p className="text-xs mb-1">No Background</p><div className="bg-[url('https://i.imgur.com/8Km9tLL.png')]"><img src={out} className="border"/></div><a href={out} download="no-bg.png" className="text-xs underline mt-2 block">Download PNG</a></div>}
      </div>
    </div>
  )
}
