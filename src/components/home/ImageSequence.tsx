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
  
  // Controls when the first frame is visible (instant)
  const [isReady, setIsReady] = useState(false);

  // 1. Preload Images (Aggressive Interpolative Chunking)
  useEffect(() => {
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
          if (i === 1) setIsReady(true); // Show first frame instantly
          
          batchLoaded++;
          if (batchLoaded === total) {
            loadBatchRecursively(start + batchSize, batchSize);
          }
        };

        img.onload = onComplete;
        img.onerror = onComplete;
      }
    };

    // Load aggressively in batches of 30 for much faster background saturation
    loadBatchRecursively(1, 30);
  }, []);

  // 2. Play Sequence
  useEffect(() => {
    if (!isReady) return;

    const images = imagesRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = images[0].naturalWidth;
    canvas.height = images[0].naturalHeight;

    let currentFrame = 0;
    let animationFrameId: number;

    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Interpolative Playback: Always advance the logical playhead at 60 FPS to prevent freezing!
      currentFrame = (currentFrame + 1) % FRAME_COUNT;
      
      // If the exact target frame hasn't downloaded yet, instantly scan backwards and draw 
      // the most recently downloaded frame. This creates a low-framerate animation at first 
      // that seamlessly upgrades to buttery 60 FPS as images download!
      let frameToDraw = currentFrame;
      let failsafe = 0;
      while ((!images[frameToDraw] || !images[frameToDraw].complete) && failsafe < FRAME_COUNT) {
        frameToDraw--;
        if (frameToDraw < 0) frameToDraw = FRAME_COUNT - 1;
        failsafe++;
      }

      if (images[frameToDraw] && images[frameToDraw].complete) {
        ctx.drawImage(images[frameToDraw], 0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReady]); 

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
