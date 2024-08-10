// app/page.tsx
import Game from '@/components/Game'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <Game />
    </main>
  )
}