"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 192;
const FRAME_URL_PREFIX = "/new-hero-frames/ezgif-frame-";
const FRAME_URL_SUFFIX = ".png";

// Helper to pad numbers (e.g., 1 -> 001)
const pad = (num: number) => num.toString().padStart(3, "0");

export default function ImageSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  // 1. Preload Images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `${FRAME_URL_PREFIX}${pad(i)}${FRAME_URL_SUFFIX}`;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      loadedImages.push(img);
    }
    
    setImages(loadedImages);
  }, []);

  // 2. Play Sequence
  useEffect(() => {
    // Start instantly as soon as the very first frame loads to guarantee dimensions
    if (images.length === 0 || !images[0].complete || images[0].width === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use the natural dimensions of the first frame safely
    canvas.width = images[0].width;
    canvas.height = images[0].height;

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
  }, [images, loadedCount]);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {(!images[0] || !images[0].complete) && (
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
