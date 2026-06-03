"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Float, Line } from "@react-three/drei";
import * as THREE from "three";

export default function HeroEffects() {
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Smooth, slow rotation for the holographic rings
    if (ringsRef.current) {
      ringsRef.current.rotation.y = time * 0.1;
      ringsRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      // Cursor parallax for the rings
      ringsRef.current.position.x = THREE.MathUtils.lerp(
        ringsRef.current.position.x,
        (state.pointer.x * 2) + 3, // Offset to right side of screen
        0.05
      );
      ringsRef.current.position.y = THREE.MathUtils.lerp(
        ringsRef.current.position.y,
        (state.pointer.y * 2),
        0.05
      );
    }
  });

  return (
    <>
      {/* Soft medical dust/particles (floating ambient sparkles) */}
      <Stars 
        radius={20} 
        depth={50} 
        count={800} 
        factor={5} 
        saturation={0} 
        fade 
        speed={0.5} 
      />

      {/* Holographic Diagnostic Overlays (Right Side) */}
      <group ref={ringsRef} position={[3, 0, -2]}>
        
        {/* Outer scanning ring */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.5, 3.52, 64]} />
            <meshBasicMaterial color="#60A5FA" transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
          </mesh>
        </Float>

        {/* Inner vertical ring */}
        <Float speed={1.5} rotationIntensity={1} floatIntensity={0.2}>
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[4, 0.01, 16, 100]} />
            <meshBasicMaterial color="#CBB28D" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
          </mesh>
        </Float>

        {/* Precision Measurement Markers (Crosshairs) */}
        <group position={[2.5, 2, 0]}>
          <Line points={[[-0.2, 0, 0], [0.2, 0, 0]]} color="#60A5FA" lineWidth={1} transparent opacity={0.6} />
          <Line points={[[0, -0.2, 0], [0, 0.2, 0]]} color="#60A5FA" lineWidth={1} transparent opacity={0.6} />
        </group>
        
        <group position={[-3, -1.5, 1]}>
          <Line points={[[-0.2, 0, 0], [0.2, 0, 0]]} color="#CBB28D" lineWidth={1} transparent opacity={0.6} />
          <Line points={[[0, -0.2, 0], [0, 0.2, 0]]} color="#CBB28D" lineWidth={1} transparent opacity={0.6} />
        </group>

      </group>
      
      {/* Dynamic Lighting Response */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[3, 0, 2]} intensity={2} color="#60A5FA" distance={10} />
    </>
  );
}
