import { useState } from 'react'
import DropZone from '../../components/DropZone'

export default function ImageOCR(){
  const [text,setText]=useState("")
  const [loading,setLoading]=useState(false)
  const onFiles = async (fl:FileList)=>{
    const file = fl[0]
    if(!file) return
    setLoading(true)
    try{
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('eng')
      const ret = await worker.recognize(file)
      setText(ret.data.text)
      await worker.terminate()
    }catch(e:any){
      setText("Error: "+e.message+" - Make sure tesseract.js is installed")
    }
    setLoading(false)
  }
  return (
    <div className="space-y-4">
      <DropZone onFiles={onFiles} accept="image/*" multiple={false} label="Drop image to extract text"/>
      {loading && <p className="text-sm animate-pulse">Reading text with AI... (first time downloads ~2MB model)</p>}
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Extracted text will appear here..." className="w-full h-[260px] border rounded-xl p-3 text-sm"/>
      <button onClick={()=>navigator.clipboard.writeText(text)} className="px-4 py-2 bg-zinc-900 text-white rounded-full text-sm">Copy Text</button>
    </div>
  )
}
