import React from 'react'
import { Download } from 'lucide-react'

export function DownloadButton({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`no-lift inline-flex items-center justify-center gap-2 px-4 h-10 text-sm font-bold text-white bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 transition-all duration-200 ${className}`}
    >
      <Download className="w-4 h-4 shrink-0" strokeWidth={2.6} />
      {children}
    </button>
  )
}