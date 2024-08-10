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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
        <p>Use arrow keys or WASD to move the player (red square)</p>
        <p>Current position: ({playerPos.x}, {playerPos.y})</p>
        <p>Current map: {currentMap === OUTDOOR_MAP ? 'Outdoor' : 'Indoor'}</p>
      </div>
    </div>
  );
}