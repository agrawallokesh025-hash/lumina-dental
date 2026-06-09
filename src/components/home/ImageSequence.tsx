"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 192;
const FRAME_URL_PREFIX = "/new-hero-frames/ezgif-frame-";
const FRAME_URL_SUFFIX = ".png";

// Helper to pad numbers (e.g., 1 -> 001)
const pad = (num: number) => num.toString().padStart(3, "0");

export default function ImageSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>(new Array(FRAME_COUNT).fill(null));
  
  // FIX: Track only a single boolean state instead of a number counting up to 192. 
  // This prevents React from forcing 192 rapid re-renders and crashing the thread.
  const [isReady, setIsReady] = useState(false);

  // 1. Preload Images (Strict Recursive Chunking)
  useEffect(() => {
    // FIX: Recursively load images in small batches of 10 to prevent the browser's 
    // network queue from locking up the main thread and freezing the page.
    const loadBatchRecursively = (start: number, batchSize: number) => {
      if (start > FRAME_COUNT) return;
      
      const end = Math.min(start + batchSize - 1, FRAME_COUNT);
      let batchLoaded = 0;
      const total = end - start + 1;
      
      for (let i = start; i <= end; i++) {
        const img = new Image();
        img.src = `${FRAME_URL_PREFIX}${pad(i)}${FRAME_URL_SUFFIX}`;
        
        const onComplete = () => {
          imagesRef.current[i - 1] = img;
          if (i === 1) setIsReady(true); // Trigger UI unblock on first frame
          
          batchLoaded++;
          if (batchLoaded === total) {
            // Once this tiny batch of 10 finishes, request the next 10!
            loadBatchRecursively(start + batchSize, batchSize);
          }
        };

        img.onload = onComplete;
        img.onerror = onComplete; // Ensure a missing frame doesn't permanently halt the sequence
      }
    };

    // Kick off the cascade with the first batch of 10
    loadBatchRecursively(1, 10);
  }, []);

  // 2. Play Sequence
  useEffect(() => {
    if (!isReady) return;

    const images = imagesRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Safely lock in natural high-res dimensions
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
  }, [isReady]); // Only runs ONCE when isReady becomes true, completely stopping the stutter loop!

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {!isReady && (
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
