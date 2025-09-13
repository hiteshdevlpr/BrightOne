'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface VirtualStagingSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
}

export default function VirtualStagingSlider({ 
  beforeImage, 
  afterImage, 
  beforeAlt, 
  afterAlt 
}: VirtualStagingSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setSliderPosition(percentage);
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  }, [updateSliderPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    updateSliderPosition(e.clientX);
  }, [isDragging, updateSliderPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  }, [updateSliderPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (e.touches[0]) {
      updateSliderPosition(e.touches[0].clientX);
    }
  }, [isDragging, updateSliderPosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global event listeners for smooth dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      updateSliderPosition(e.clientX);
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      if (e.touches[0]) {
        updateSliderPosition(e.touches[0].clientX);
      }
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, updateSliderPosition]);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-2xl select-none">
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-col-resize touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ userSelect: 'none' }}
      >
        {/* Before Image (Background) */}
        <div className="absolute inset-0">
          <Image
            src={beforeImage}
            alt={beforeAlt}
            fill
            className="object-cover pointer-events-none"
            priority
            draggable={false}
          />
        </div>

        {/* After Image (Clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            transition: isDragging ? 'none' : 'clip-path 0.1s ease-out'
          }}
        >
          <Image
            src={afterImage}
            alt={afterAlt}
            fill
            className="object-cover pointer-events-none"
            priority
            draggable={false}
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 md:w-1 bg-white shadow-lg z-10 pointer-events-none"
          style={{ 
            left: `${sliderPosition}%`,
            transition: isDragging ? 'none' : 'left 0.1s ease-out'
          }}
        >
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-col-resize pointer-events-auto">
            <div className="flex space-x-0.5 md:space-x-1">
              <div className="w-0.5 h-2 md:w-1 md:h-3 bg-gray-400"></div>
              <div className="w-0.5 h-2 md:w-1 md:h-3 bg-gray-400"></div>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/70 text-white px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm font-semibold pointer-events-none">
          BEFORE
        </div>
        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/70 text-white px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm font-semibold pointer-events-none">
          AFTER
        </div>
      </div>
    </div>
  );
}
