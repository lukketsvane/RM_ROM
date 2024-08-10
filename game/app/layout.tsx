// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AudioPlayer from "@/components/AudioPlayer"
import Controls from "@/components/Controls"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        <AudioPlayer />
        <Controls />
        {children}
      </body>
    </html>
  )
}