"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 192;
const FRAME_URL_PREFIX = "/new-hero-frames/ezgif-frame-";
const FRAME_URL_SUFFIX = ".png";

// Helper to pad numbers (e.g., 1 -> 001)
const pad = (num: number) => num.toString().padStart(3, "0");

export default function ImageSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // FIX 1: Use a ref instead of React state to store 192 DOM elements, killing the memory leak
  const imagesRef = useRef<HTMLImageElement[]>(new Array(FRAME_COUNT).fill(null));
  const [loadedCount, setLoadedCount] = useState(0);

  // 1. Preload Images (Chunked)
  useEffect(() => {
    let loaded = 0;

    // FIX 2: Chunked Loading to prevent network bottlenecks
    const loadBatch = (start: number, end: number, callback?: () => void) => {
      let batchLoaded = 0;
      const total = end - start + 1;
      
      for (let i = start; i <= end; i++) {
        const img = new Image();
        img.src = `${FRAME_URL_PREFIX}${pad(i)}${FRAME_URL_SUFFIX}`;
        img.onload = () => {
          imagesRef.current[i - 1] = img;
          loaded++;
          setLoadedCount(loaded);
          batchLoaded++;
          if (batchLoaded === total && callback) callback();
        };
      }
    };

    // Load first 5 frames immediately for instant playback...
    loadBatch(1, 5, () => {
      // ...then load the remaining 187 frames in the background!
      loadBatch(6, FRAME_COUNT);
    });
  }, []);

  // 2. Play Sequence
  useEffect(() => {
    const images = imagesRef.current;
    
    // Start instantly as soon as the very first frame loads to guarantee dimensions
    if (loadedCount === 0 || !images[0] || !images[0].complete || images[0].naturalWidth === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // FIX 3: Safely lock in natural high-res dimensions
    canvas.width = images[0].naturalWidth;
    canvas.height = images[0].naturalHeight;

    let currentFrame = 0;
    let animationFrameId: number;

    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (images[currentFrame] && images[currentFrame].complete) {
        ctx.drawImage(images[currentFrame], 0, 0, canvas.width, canvas.height);
      }
      
      // Stream the animation: advance only if the next frame has finished downloading
      const nextFrame = (currentFrame + 1) % FRAME_COUNT;
      if (images[nextFrame] && images[nextFrame].complete) {
        currentFrame = nextFrame;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [loadedCount]); // Re-evaluate when loadedCount changes to ensure playback starts

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {(!imagesRef.current[0] || !imagesRef.current[0].complete) && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
          <div className="w-8 h-8 border-4 border-white/10 border-t-gold rounded-full animate-spin"></div>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover object-[80%_center] md:object-center"
        style={{ mixBlendMode: 'screen' }} 
      />
    </div>
  );
}
