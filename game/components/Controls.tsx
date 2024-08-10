// components/Controls.tsx
'use client'

import { useState, useEffect } from 'react'

export default function Controls() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  return (
    <button
      onClick={toggleFullscreen}
      className="absolute top-4 right-4 z-10 bg-gray-800 text-white p-2 rounded"
    >
      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
    </button>
  )
}