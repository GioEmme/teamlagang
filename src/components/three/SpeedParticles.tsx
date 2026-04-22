"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function SpeedParticles({
  count = 200,
  speedRef,
}: {
  count?: number;
  speedRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      vel[i] = 5 + Math.random() * 15;
    }
    return [pos, vel];
  }, [count]);

  useFrame((_, dt) => {
    const speed = speedRef.current;
    const geom = ref.current?.geometry;
    if (!geom) return;
    const arr = (geom.attributes.position as THREE.BufferAttribute)
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += dt * velocities[i] * speed;
      if (arr[i * 3] > 30) {
        arr[i * 3] = -30;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
      }
    }
    (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}
