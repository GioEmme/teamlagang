"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { RcCar } from "./three/RcCar";
import { Track } from "./three/Track";
import { SpeedParticles } from "./three/SpeedParticles";

export function Hero3D() {
  const speedRef = useRef(1);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lowCores =
      typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) < 4;
    setIsLowPower(reduceMotion || (coarse && lowCores));
  }, []);

  useEffect(() => {
    const onVis = () => {
      speedRef.current = document.hidden ? 0 : 1;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows={!isLowPower}
        camera={{ position: [4.5, 2.4, 4.2], fov: 42 }}
        dpr={[1, isLowPower ? 1.25 : 2]}
        gl={{ antialias: !isLowPower, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 12, 40]} />

        <ambientLight intensity={0.25} />
        <directionalLight
          position={[6, 8, 5]}
          intensity={1.2}
          color="#ffffff"
          castShadow={!isLowPower}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-4, 3, -3]} intensity={1.2} color="#ffd500" />
        <pointLight position={[4, 2, 3]} intensity={0.8} color="#e63946" />
        <spotLight
          position={[0, 6, 0]}
          angle={0.5}
          penumbra={0.6}
          intensity={0.6}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <Track speedRef={speedRef} />
          <RcCar speedRef={speedRef} />
          {!isLowPower && <SpeedParticles speedRef={speedRef} count={150} />}
          <ContactShadows
            position={[0, 0.02, 0]}
            opacity={0.6}
            scale={20}
            blur={2}
            far={4}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
