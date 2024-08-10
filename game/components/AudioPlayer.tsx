// components/AudioPlayer.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'

const audioFiles = [
  '04_Dag 1.mp3',
  '05_Wikipedia.mp3',
  '06_Hvisking.mp3',
  '07_Lydkilden.mp3',
  '08_Samfunnstjeneste.mp3',
  '09_Thormøhlens gate 55.mp3',
  '10_Hjemme igjen.mp3',
  '11_Laptopen.mp3',
  '12_bitlocker.mp3',
  '13_Buskene.mp3',
  '14_Avhør 2.mp3',
  '15_Rommet visner.mp3',
  '16_Ferie.mp3',
]

export default function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('ended', handleEnded)
      return () => audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handleEnded = () => {
    setCurrentTrack((prev) => (prev + 1) % audioFiles.length)
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play().catch(error => console.error("Audio playback failed:", error))
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={`/audio/${audioFiles[currentTrack]}`}
      />
      <button
        onClick={togglePlay}
        className="absolute bottom-4 left-4 z-10 bg-gray-800 text-white p-2 rounded"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </>
  )
}