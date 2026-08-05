import { useRef } from 'react'
export default function DropZone({onFiles, accept, multiple=true, label="Drop files here or click to browse"}:{onFiles:(files:FileList)=>void, accept?:string, multiple?:boolean, label?:string}){
  const ref=useRef<HTMLInputElement>(null)
  return (
    <div onClick={()=>ref.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault(); if(e.dataTransfer.files) onFiles(e.dataTransfer.files)}} className="border-2 border-dashed border-zinc-300 dark:border-zinc-700  p-8 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
      <div className="text-3xl mb-2">📁</div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs font-medium text-zinc-900 dark:text-white mt-1">Files never leave your browser</p>
      <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={e=>e.target.files && onFiles(e.target.files)}/>
    </div>
  )
}
