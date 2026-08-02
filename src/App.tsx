import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ToolPage from './pages/ToolPage'
import Header from './components/Header'
import { useEffect, useState } from 'react'

export default function App(){
  const [dark,setDark]=useState(false)
  useEffect(()=>{
    const d = localStorage.getItem('dark')==='1'
    setDark(d)
    if(d) document.documentElement.classList.add('dark')
  },[])
  const toggle=()=>{
    const nd=!dark
    setDark(nd)
    localStorage.setItem('dark', nd?'1':'0')
    document.documentElement.classList.toggle('dark', nd)
  }
  return (
    <div className="min-h-screen">
      <Header dark={dark} toggle={toggle}/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/tool/:id" element={<ToolPage/>}/>
      </Routes>
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-sm text-zinc-500">
        <p>OmniTools • 100% Offline • Files never leave your device • Built for GitHub Pages</p>
      </footer>
    </div>
  )
}
