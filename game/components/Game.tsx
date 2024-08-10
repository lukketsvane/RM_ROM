// game/components/Game.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { OUTDOOR_MAP } from '@/maps/outdoorMap';
import { INDOOR_MAP } from '@/maps/indoorMap';

const TILE_SIZE = 16;
const SCALE = 2;
const MOVE_DURATION = 200;
const VIEWPORT_WIDTH = 15;
const VIEWPORT_HEIGHT = 10;

type Location = 'outdoor' | 'indoor';

export default function Game() {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [isMoving, setIsMoving] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>('outdoor');
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });

  const getCurrentMap = useCallback(() => {
    return currentLocation === 'outdoor' ? OUTDOOR_MAP : INDOOR_MAP;
  }, [currentLocation]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (isMoving) return;

    const currentMap = getCurrentMap();
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX >= 0 && newX < currentMap[0].length && newY >= 0 && newY < currentMap.length) {
      if (currentMap[newY][newX] === 0 || currentMap[newY][newX] === 6 || currentMap[newY][newX] === 7) {
        setIsMoving(true);
        setTimeout(() => {
          setPlayerPos({ x: newX, y: newY });
          setIsMoving(false);

          setCameraOffset(prevOffset => ({
            x: Math.max(0, Math.min(newX - Math.floor(VIEWPORT_WIDTH / 2), currentMap[0].length - VIEWPORT_WIDTH)),
            y: Math.max(0, Math.min(newY - Math.floor(VIEWPORT_HEIGHT / 2), currentMap.length - VIEWPORT_HEIGHT))
          }));

          // Check for door interaction
          if (currentLocation === 'outdoor' && currentMap[newY][newX] === 6) {
            handleDoorInteraction('enter');
          } else if (currentLocation === 'indoor' && playerPos.x === 10 && playerPos.y === 7 && dy === 1) {
            handleDoorInteraction('exit');
          }
        }, MOVE_DURATION);
      }
    }
  }, [playerPos, isMoving, getCurrentMap, currentLocation]);

  const handleDoorInteraction = (action: 'enter' | 'exit') => {
    if (action === 'enter') {
      setCurrentLocation('indoor');
      setPlayerPos({ x: 10, y: 7 }); // Place player just above the door
      setCameraOffset({ x: 0, y: 0 });
    } else {
      setCurrentLocation('outdoor');
      setPlayerPos({ x: 4, y: 5 }); // Adjust this to match your outdoor map
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

  const currentMap = getCurrentMap();

  return (
    <div className="flex flex-col items-center justify-center text-white min-h-screen bg-black">
      <div 
        className="relative overflow-hidden"
        style={{
          width: `${VIEWPORT_WIDTH * TILE_SIZE * SCALE}px`,
          height: `${VIEWPORT_HEIGHT * TILE_SIZE * SCALE}px`,
        }}
      >
        <div
          className="absolute transition-all duration-200"
          style={{
            width: `${currentMap[0].length * TILE_SIZE * SCALE}px`,
            height: `${currentMap.length * TILE_SIZE * SCALE}px`,
            transform: `translate(${-cameraOffset.x * TILE_SIZE * SCALE}px, ${-cameraOffset.y * TILE_SIZE * SCALE}px)`,
            backgroundImage: `url(/${currentLocation}Map_sheet.png)`,
            backgroundSize: '100% 100%',
            imageRendering: 'pixelated',
          }}
        />
        <div
          className="absolute bg-red-600 transition-all duration-200"
          style={{
            width: `${TILE_SIZE * SCALE}px`,
            height: `${TILE_SIZE * SCALE}px`,
            left: `${(playerPos.x - cameraOffset.x) * TILE_SIZE * SCALE}px`,
            top: `${(playerPos.y - cameraOffset.y) * TILE_SIZE * SCALE}px`,
          }}
        />
      </div>
      <div className="mt-4 text-center">
        <p>Current position: ({playerPos.x}, {playerPos.y})</p>
        <p>Current location: {currentLocation}</p>
      </div>
    </div>
  );
}