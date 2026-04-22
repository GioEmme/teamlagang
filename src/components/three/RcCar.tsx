"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  color?: string;
  accent?: string;
  speedRef?: React.MutableRefObject<number>;
};

export function RcCar({
  color = "#ffd500",
  accent = "#e63946",
  speedRef,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const bob = useRef(0);

  const wheelGeo = useMemo(() => new THREE.CylinderGeometry(0.38, 0.38, 0.3, 24), []);
  const wheelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.9, metalness: 0.1 }),
    [],
  );
  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f5f5f5",
        roughness: 0.3,
        metalness: 0.9,
      }),
    [],
  );

  useFrame((_, dt) => {
    const speed = speedRef?.current ?? 1;
    bob.current += dt * speed * 10;
    if (group.current) {
      group.current.position.y = Math.sin(bob.current) * 0.04;
      group.current.rotation.z = Math.sin(bob.current * 0.6) * 0.01;
    }
    wheelRefs.current.forEach((w) => {
      if (w) w.rotation.x -= dt * speed * 25;
    });
  });

  return (
    <group ref={group} position={[0, 0.4, 0]}>
      {/* Chassis - main body */}
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[2.4, 0.12, 1.1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Upper body / shell */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[2.1, 0.5, 1.05]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.5}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Front nose (angled) */}
      <mesh castShadow position={[1.05, 0.35, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.6, 0.25, 1.05]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.5} />
      </mesh>

      {/* Windshield */}
      <mesh castShadow position={[0.1, 0.68, 0]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[1.2, 0.35, 0.95]} />
        <meshStandardMaterial
          color="#050505"
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Accent stripe */}
      <mesh position={[0, 0.25, 0.56]}>
        <boxGeometry args={[2.2, 0.08, 0.02]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh position={[0, 0.25, -0.56]}>
        <boxGeometry args={[2.2, 0.08, 0.02]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Rear wing */}
      <mesh castShadow position={[-1.05, 0.85, 0]}>
        <boxGeometry args={[0.2, 0.04, 1.3]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[-1.05, 0.7, 0.6]}>
        <boxGeometry args={[0.05, 0.3, 0.04]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[-1.05, 0.7, -0.6]}>
        <boxGeometry args={[0.05, 0.3, 0.04]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Headlights (emissive) */}
      <mesh position={[1.32, 0.4, 0.35]}>
        <boxGeometry args={[0.04, 0.12, 0.18]} />
        <meshStandardMaterial
          color="#fff"
          emissive="#fff"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[1.32, 0.4, -0.35]}>
        <boxGeometry args={[0.04, 0.12, 0.18]} />
        <meshStandardMaterial
          color="#fff"
          emissive="#fff"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-1.18, 0.5, 0.4]}>
        <boxGeometry args={[0.03, 0.08, 0.2]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[-1.18, 0.5, -0.4]}>
        <boxGeometry args={[0.03, 0.08, 0.2]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={3}
        />
      </mesh>

      {/* Wheels */}
      {[
        [0.85, 0, 0.65],
        [0.85, 0, -0.65],
        [-0.85, 0, 0.65],
        [-0.85, 0, -0.65],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x as number, y as number, z as number]}>
          <mesh
            ref={(el) => {
              if (el) wheelRefs.current[i] = el;
            }}
            geometry={wheelGeo}
            material={wheelMat}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          />
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.32, 6]} />
            <primitive object={rimMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Antenna */}
      <mesh position={[-0.8, 1.1, 0.3]}>
        <cylinderGeometry args={[0.01, 0.01, 0.8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.8, 1.55, 0.3]}>
        <sphereGeometry args={[0.04]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}
