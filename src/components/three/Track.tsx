"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  speedRef: React.MutableRefObject<number>;
};

export function Track({ speedRef }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  const stripes = useMemo(() => {
    const count = 24;
    return Array.from({ length: count }, (_, i) => i);
  }, []);

  const barriers = useMemo(() => {
    const count = 30;
    return Array.from({ length: count }, (_, i) => i);
  }, []);

  useFrame((_, dt) => {
    const speed = speedRef.current;
    if (groupRef.current) {
      groupRef.current.position.x += dt * speed * 10;
      if (groupRef.current.position.x > 4) {
        groupRef.current.position.x -= 4;
      }
    }
  });

  return (
    <>
      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <planeGeometry args={[200, 30]} />
        <meshStandardMaterial color="#0b0b0b" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Lane edges - yellow */}
      <mesh position={[0, 0.001, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 0.12]} />
        <meshStandardMaterial
          color="#ffd500"
          emissive="#ffd500"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, 0.001, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 0.12]} />
        <meshStandardMaterial
          color="#ffd500"
          emissive="#ffd500"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Center dashed line - animated via position shift */}
      <group ref={groupRef} position={[0, 0.002, 0]}>
        {stripes.map((i) => (
          <mesh
            key={i}
            position={[-40 + i * 4, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1.8, 0.1]} />
            <meshStandardMaterial
              color="#f5f5f5"
              emissive="#f5f5f5"
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Barriers with team colors */}
      {barriers.map((i) => {
        const x = -50 + (i / barriers.length) * 120;
        const colorN = i % 3;
        const color =
          colorN === 0 ? "#ffd500" : colorN === 1 ? "#e63946" : "#1e4d8b";
        return (
          <group key={i}>
            <mesh position={[x, 0.15, 3.2]} castShadow>
              <boxGeometry args={[2.5, 0.3, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[x, 0.15, -3.2]} castShadow>
              <boxGeometry args={[2.5, 0.3, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}
