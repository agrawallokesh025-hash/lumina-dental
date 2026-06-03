"use client";

import { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function DentalModel() {
  const toothGroupRef = useRef<THREE.Group>(null);
  
  // Try to load a custom GLB if the user has added one to public/models/
  // Otherwise, we gracefully fall back to our advanced procedural model below.
  let gltf;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    gltf = useGLTF("/models/tooth.glb", true);
  } catch (e) {
    gltf = null;
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (toothGroupRef.current) {
      toothGroupRef.current.rotation.y = Math.sin(time * 0.5) * 0.2; // Very gentle rotation
      toothGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        toothGroupRef.current.rotation.x,
        (state.pointer.y * Math.PI) / 12,
        0.05
      );
      toothGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        toothGroupRef.current.rotation.z,
        (-state.pointer.x * Math.PI) / 12,
        0.05
      );
    }
  });

  return (
    <group ref={toothGroupRef} position={[3, 0, 0]} scale={1.2}>
      {gltf ? (
        <primitive object={gltf.scene} />
      ) : (
        // Advanced Procedural Fallback if no GLB is found
        <>
          {/* Crown */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.8, 1.5, 1.8, 32, 32, 32]} />
            <meshPhysicalMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.05}
              roughness={0.05}
              metalness={0.1}
              transmission={0.3} // Subtle translucency
              thickness={2}
              ior={1.6}
              clearcoat={1}
              clearcoatRoughness={0.05}
            />
          </mesh>
          
          {/* Roots */}
          <mesh position={[-0.4, -0.5, 0]}>
            <cylinderGeometry args={[0.5, 0.1, 1.5, 32]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.2} ior={1.5} />
          </mesh>
          <mesh position={[0.4, -0.5, 0]}>
            <cylinderGeometry args={[0.5, 0.1, 1.5, 32]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.2} ior={1.5} />
          </mesh>
        </>
      )}

      {/* Holographic Diagnostic Ring (Vertical like reference image) */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, -1]}>
        <torusGeometry args={[2.5, 0.02, 32, 100]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Outer faint glowing ring */}
      <mesh rotation={[0, 0, 0]} position={[0, 0, -1.2]}>
        <torusGeometry args={[2.7, 0.05, 32, 100]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Glowing Pedestal Base */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.8, 64]} />
        <meshBasicMaterial color="#CBB28D" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -2.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export default function Scene() {
  return (
    <>
      {/* Premium HDRI Environment Lighting */}
      <Environment preset="studio" environmentIntensity={1.5} />
      
      {/* Clean medical lighting setup */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={1.5} color="#eef2f6" />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Suspense fallback={null}>
          <DentalModel />
        </Suspense>
      </Float>

      {/* Realistic ground reflections / contact shadows */}
      <ContactShadows position={[3, -2.2, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#0F172A" />
    </>
  );
}
