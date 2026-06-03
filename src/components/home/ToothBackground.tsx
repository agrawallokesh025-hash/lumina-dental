"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import ImageSequence from "./ImageSequence";
import HeroEffects from "../canvas/HeroEffects";

export default function ToothBackground() {
  const { scrollY } = useScroll();

  // Use a physics spring to make the scroll tracking feel perfectly smooth and responsive without dropping frames
  const smoothY = useSpring(scrollY, { stiffness: 400, damping: 40, restDelta: 0.001 });
  
  // Speed up the parallax: Full zoom and fade achieved within 400px of scrolling for an instant reaction
  const scaleParallax = useTransform(smoothY, [0, 400], [1, 1.4]);
  const opacityFade = useTransform(smoothY, [0, 300, 800], [1, 0.4, 0.1]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden bg-[#060913]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#060913] to-[#060913]"></div>
      
      <motion.div 
        style={{ opacity: opacityFade }}
        className="absolute inset-0 w-full h-full overflow-hidden"
      >
        {/* WebGL Effects Layer - Hardware Accelerated & Optimized */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-auto opacity-70 md:opacity-100 transition-opacity duration-500">
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 45 }} 
            dpr={1} 
            gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          >
            <HeroEffects />
          </Canvas>
        </div>

        {/* Tooth Image Sequence - Full screen across all devices */}
        <motion.div 
          style={{ scale: scaleParallax }}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-80 md:opacity-100 flex items-center justify-center transition-all duration-500"
        >
          <ImageSequence />
        </motion.div>
      </motion.div>
    </div>
  );
}
