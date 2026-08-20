import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { DownloadButton } from '../../components/ui/DownloadButton'
import { saveDataUrl } from '../../lib/download'

export default function QRGenerator(){
  const [text,setText]=useState("https://nuttertools.example.com")
  const [url,setUrl]=useState("")
  const [fg,setFg]=useState("#000000")
  const [bg,setBg]=useState("#ffffff")

  useEffect(()=>{
    QRCode.toDataURL(text, {color:{dark:fg, light:bg}, width:400}).then(setUrl)
  },[text,fg,bg])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-5">
        <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-28 border p-3 text-sm" placeholder="Enter URL or text"/>
        <div className="flex gap-3">
          <label className="text-xs">FG <input type="color" value={fg} onChange={e=>setFg(e.target.value)}/></label>
          <label className="text-xs">BG <input type="color" value={bg} onChange={e=>setBg(e.target.value)}/></label>
        </div>
      </div>
      <div className="text-center border p-4 bg-white">
        {url && <img src={url} className="mx-auto w-[280px] h-[280px]"/>}
        {url && <DownloadButton onClick={() => saveDataUrl(url, 'qr.png')} className="mt-3">Download PNG</DownloadButton>}
      </div>
    </div>
  )
}
