// components/Game.tsx
'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { OUTDOOR_MAP } from '@/maps/outdoorMap';
import { INDOOR_MAP } from '@/maps/indoorMap';

const TILE_SIZE = 16;
const SCALE = 2;
const VIEWPORT_WIDTH = 15;
const VIEWPORT_HEIGHT = 10;
const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 23;
const SPRITE_SHEET_WIDTH = 64;
const SPRITE_SHEET_HEIGHT = 92;

const WALK_SPEED = 3.5; // tiles per second
const RUN_SPEED = WALK_SPEED * 2; // tiles per second when running

type Location = 'outdoor' | 'indoor';
type Direction = 'down' | 'up' | 'left' | 'right';

const directionToSpriteRow: Record<Direction, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3
};

export default function Game() {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [isMoving, setIsMoving] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>('outdoor');
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [playerDirection, setPlayerDirection] = useState<Direction>('down');
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const lastMoveTime = useRef(0);
  const animationFrameRef = useRef(0);

  const getCurrentMap = useCallback(() => currentLocation === 'outdoor' ? OUTDOOR_MAP : INDOOR_MAP, [currentLocation]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    const currentTime = performance.now();
    const currentMap = getCurrentMap();
    const speed = isRunning ? RUN_SPEED : WALK_SPEED;
    const minTimeBetweenMoves = 1000 / speed;

    if (currentTime - lastMoveTime.current < minTimeBetweenMoves) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    const newDirection: Direction = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down';

    setPlayerDirection(newDirection);

    if (newX >= 0 && newX < currentMap[0].length && newY >= 0 && newY < currentMap.length &&
        [0, 6, 7].includes(currentMap[newY][newX])) {
      setPlayerPos({ x: newX, y: newY });
      lastMoveTime.current = currentTime;

      setCameraOffset(prev => ({
        x: Math.max(0, Math.min(newX - Math.floor(VIEWPORT_WIDTH / 2), currentMap[0].length - VIEWPORT_WIDTH)),
        y: Math.max(0, Math.min(newY - Math.floor(VIEWPORT_HEIGHT / 2), currentMap.length - VIEWPORT_HEIGHT))
      }));

      if (currentLocation === 'outdoor' && currentMap[newY][newX] === 6) {
        handleDoorInteraction('enter');
      } else if (currentLocation === 'indoor' && playerPos.x === 10 && playerPos.y === 7 && dy === 1) {
        handleDoorInteraction('exit');
      }
    }
  }, [playerPos, getCurrentMap, currentLocation, isRunning]);

  const handleDoorInteraction = (action: 'enter' | 'exit') => {
    setCurrentLocation(action === 'enter' ? 'indoor' : 'outdoor');
    setPlayerPos(action === 'enter' ? { x: 10, y: 7 } : { x: 4, y: 5 });
    setCameraOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const moves: Record<string, [number, number]> = {
        'arrowup': [0, -1], 'w': [0, -1],
        'arrowdown': [0, 1], 's': [0, 1],
        'arrowleft': [-1, 0], 'a': [-1, 0],
        'arrowright': [1, 0], 'd': [1, 0]
      };
      const [dx, dy] = moves[e.key.toLowerCase()] || [0, 0];
      movePlayer(dx, dy);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsRunning(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsRunning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keypress', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keypress', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [movePlayer]);

  useEffect(() => {
    const animateWalk = (timestamp: number) => {
      const frameInterval = isRunning ? 125 : 250; // 4 frames over 1 second for walking, 2 frames for running
      if (timestamp - animationFrameRef.current >= frameInterval) {
        setAnimationFrame(prev => (prev + 1) % 4);
        animationFrameRef.current = timestamp;
      }
      requestAnimationFrame(animateWalk);
    };

    const animationId = requestAnimationFrame(animateWalk);
    return () => cancelAnimationFrame(animationId);
  }, [isRunning]);

  const currentMap = getCurrentMap();

  return (
    <div className="flex flex-col items-center justify-center text-white min-h-screen bg-black">
      <div className="relative overflow-hidden" style={{
        width: `${VIEWPORT_WIDTH * TILE_SIZE * SCALE}px`,
        height: `${VIEWPORT_HEIGHT * TILE_SIZE * SCALE}px`,
      }}>
        <div className="absolute transition-all duration-200" style={{
          width: `${currentMap[0].length * TILE_SIZE * SCALE}px`,
          height: `${currentMap.length * TILE_SIZE * SCALE}px`,
          transform: `translate(${-cameraOffset.x * TILE_SIZE * SCALE}px, ${-cameraOffset.y * TILE_SIZE * SCALE}px)`,
          backgroundImage: `url(/${currentLocation}Map_sheet.png)`,
          backgroundSize: '100% 100%',
          imageRendering: 'pixelated',
        }} />
        <div className="absolute" style={{
          width: `${SPRITE_WIDTH * SCALE}px`,
          height: `${SPRITE_HEIGHT * SCALE}px`,
          left: `${(playerPos.x - cameraOffset.x) * TILE_SIZE * SCALE}px`,
          top: `${((playerPos.y - cameraOffset.y) * TILE_SIZE - (SPRITE_HEIGHT - TILE_SIZE)) * SCALE}px`,
          backgroundImage: 'url(/sprite/character_sprite_sheet.png)',
          backgroundPosition: `-${animationFrame * SPRITE_WIDTH * SCALE}px -${directionToSpriteRow[playerDirection] * SPRITE_HEIGHT * SCALE}px`,
          backgroundSize: `${SPRITE_SHEET_WIDTH * SCALE}px ${SPRITE_SHEET_HEIGHT * SCALE}px`,
          imageRendering: 'pixelated',
        }} />
      </div>
      <div className="mt-4">
        {isRunning ? "Running" : "Walking"} - Press Shift to run
      </div>
    </div>
  );
}