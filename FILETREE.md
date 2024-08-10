game                   
├─ app                 
│  ├─ favicon.ico      
│  ├─ globals.css      
│  ├─ layout.tsx       
│  └─ page.tsx         
├─ components          
│  ├─ ui               
│  │  └─ button.tsx    
│  └─ Game.tsx         
├─ lib                 
│  └─ utils.ts         
├─ public              
│  ├─ next.svg         
│  └─ vercel.svg       
├─ README.md           
├─ next-env.d.ts       
├─ next.config.mjs     
├─ package-lock.json   
├─ package.json        
├─ postcss.config.mjs  
├─ tailwind.config.ts  
└─ tsconfig.json       


// game/app/page.tsx
import Game from '@/components/Game'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <Game />
    </main>
  )
}

// game/app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
 /* Add this to the end of the file */
html, body {
  height: 100%;
  overflow: hidden;
  background-color: black;
}

#__next {
  height: 100%;
}
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

// game/components/Game.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react';

const TILE_SIZE = 32;
const MOVE_DURATION = 200; // ms
const VIEWPORT_WIDTH = 15;
const VIEWPORT_HEIGHT = 10;

const OUTDOOR_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 2, 6, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const INDOOR_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1],
  [1, 7, 8, 8, 7, 7, 7, 7, 9, 9, 7, 1],
  [1, 7, 8, 8, 7, 7, 7, 7, 9, 9, 7, 1],
  [1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1],
  [1, 7, 7, 7, 7, 10, 10, 7, 7, 7, 7, 1],
  [1, 7, 7, 7, 7, 10, 10, 7, 7, 7, 7, 1],
  [1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1],
  [1, 7, 7, 7, 7, 7, 7, 7, 7, 6, 7, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const tileColors = {
  0: 'bg-green-200', // Grass
  1: 'bg-green-800', // Trees/Walls
  2: 'bg-red-500',   // Buildings
  6: 'bg-yellow-600', // Door
  7: 'bg-yellow-200', // Indoor floor
  8: 'bg-blue-300',  // Bed
  9: 'bg-gray-400',  // Cabinets
  10: 'bg-green-400', // Carpet
};

export default function Game() {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [isMoving, setIsMoving] = useState(false);
  const [currentMap, setCurrentMap] = useState(OUTDOOR_MAP);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (isMoving) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX >= 0 && newX < currentMap[0].length && newY >= 0 && newY < currentMap.length) {
      if (currentMap[newY][newX] === 0 || currentMap[newY][newX] === 6 || currentMap[newY][newX] === 7) {
        setIsMoving(true);
        setTimeout(() => {
          setPlayerPos({ x: newX, y: newY });
          setIsMoving(false);

          // Update camera offset
          setCameraOffset(prevOffset => ({
            x: Math.max(0, Math.min(newX - Math.floor(VIEWPORT_WIDTH / 2), currentMap[0].length - VIEWPORT_WIDTH)),
            y: Math.max(0, Math.min(newY - Math.floor(VIEWPORT_HEIGHT / 2), currentMap.length - VIEWPORT_HEIGHT))
          }));

          // Check if player is on a door tile
          if (currentMap[newY][newX] === 6) {
            handleDoorInteraction(newX, newY);
          }
        }, MOVE_DURATION);
      }
    }
  }, [playerPos, isMoving, currentMap]);

  const handleDoorInteraction = (x: number, y: number) => {
    if (currentMap === OUTDOOR_MAP) {
      setCurrentMap(INDOOR_MAP);
      setPlayerPos({ x: 9, y: 8 }); // Position near the indoor exit
      setCameraOffset({ x: 0, y: 0 });
    } else {
      setCurrentMap(OUTDOOR_MAP);
      setPlayerPos({ x: 4, y: 5 }); // Position in front of the house
      setCameraOffset({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w': movePlayer(0, -1); break;
        case 'arrowdown':
        case 's': movePlayer(0, 1); break;
        case 'arrowleft':
        case 'a': movePlayer(-1, 0); break;
        case 'arrowright':
        case 'd': movePlayer(1, 0); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="flex flex-col items-center justify-center text-white min-h-screen bg-black">
      <div 
        className="relative overflow-hidden"
        style={{
          width: `${VIEWPORT_WIDTH * TILE_SIZE}px`,
          height: `${VIEWPORT_HEIGHT * TILE_SIZE}px`,
        }}
      >
        <div
          className="absolute transition-all duration-200"
          style={{
            width: `${currentMap[0].length * TILE_SIZE}px`,
            height: `${currentMap.length * TILE_SIZE}px`,
            transform: `translate(${-cameraOffset.x * TILE_SIZE}px, ${-cameraOffset.y * TILE_SIZE}px)`,
          }}
        >
          {currentMap.map((row, y) => (
            row.map((tile, x) => (
              <div
                key={`${x}-${y}`}
                className={`absolute ${tileColors[tile as keyof typeof tileColors]}`}
                style={{
                  width: `${TILE_SIZE}px`,
                  height: `${TILE_SIZE}px`,
                  left: `${x * TILE_SIZE}px`,
                  top: `${y * TILE_SIZE}px`,
                }}
              />
            ))
          ))}
          <div
            className="absolute bg-red-600 transition-all duration-200"
            style={{
              width: `${TILE_SIZE}px`,
              height: `${TILE_SIZE}px`,
              left: `${playerPos.x * TILE_SIZE}px`,
              top: `${playerPos.y * TILE_SIZE}px`,
            }}
          />
        </div>
      </div>
      <div className="mt-4 text-center">
        <p>Current position: ({playerPos.x}, {playerPos.y})</p>
        <p>Current map: {currentMap === OUTDOOR_MAP ? 'Outdoor' : 'Indoor'}</p>
      </div>
    </div>
  );
}

// game/components/ui/button.tsx

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }