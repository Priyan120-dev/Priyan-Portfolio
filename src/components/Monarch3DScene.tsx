"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, useTexture } from "@react-three/drei";
import * as THREE from "three";

// 1. Floating Holographic Terrain (Displacement mapped scrolling landscape grid)
function HolographicTerrain() {
  const terrainRef = useRef<THREE.Mesh | null>(null);

  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(45, 45, 50, 50);
    const pos = g.attributes.position;
    
    // Wave heights to simulate futuristic anime mountain grids
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.22) * Math.cos(y * 0.22) * 0.75 + 
                Math.sin(x * 0.08) * Math.cos(y * 0.08) * 0.35;
      pos.setZ(i, z);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (terrainRef.current) {
      terrainRef.current.position.y = -3.2 + Math.sin(time * 0.35) * 0.06;
    }
  });

  return (
    <mesh
      ref={terrainRef}
      rotation={[-Math.PI / 2, 0, 0]}
      geometry={geom}
      position={[0, -3.2, -4]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#00f0ff"
        emissive="#002638"
        wireframe
        transparent
        opacity={0.28}
        roughness={0.4}
        metalness={0.8}
      />
    </mesh>
  );
}

// 2. Concentric Neon Gate rings and spiral particles
function DungeonGate() {
  const portalRef = useRef<THREE.Group | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const ring3Ref = useRef<THREE.Mesh | null>(null);
  const satellitesRef = useRef<THREE.Group | null>(null);

  const [particlePositions, particleColors] = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 28;
      const radius = 2.4 * (1 - (i / count)) + Math.random() * 0.15;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 0.25 - (i / count) * 1.6;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const ratio = i / count;
      const r = ratio > 0.52 ? 0.65 : 0.0;
      const g = ratio > 0.52 ? 0.12 : 0.92;
      const b = 1.0;

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (portalRef.current) {
      portalRef.current.rotation.z = time * 0.12;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.3;
      ring1Ref.current.rotation.y = time * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.4;
      ring2Ref.current.rotation.z = time * 0.25;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -time * 0.2;
      ring3Ref.current.rotation.z = -time * 0.5;
    }

    if (satellitesRef.current) {
      satellitesRef.current.rotation.z = -time * 0.65;
    }
  });

  return (
    <group ref={portalRef} position={[0, 0, 0]}>
      {/* Concentric Neon Rings representing the Gate Portal */}
      <group>
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.0, 0.03, 8, 48]} />
          <meshBasicMaterial color="#9d4edd" wireframe transparent opacity={0.4} />
        </mesh>
        <points>
          <torusGeometry args={[2.0, 0.03, 8, 48]} />
          <pointsMaterial size={0.03} color="#9d4edd" transparent opacity={0.8} />
        </points>
      </group>

      <group>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.5, 0.02, 8, 48]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.4} />
        </mesh>
        <points>
          <torusGeometry args={[1.5, 0.02, 8, 48]} />
          <pointsMaterial size={0.03} color="#00f0ff" transparent opacity={0.8} />
        </points>
      </group>

      <group>
        <mesh ref={ring3Ref}>
          <torusGeometry args={[1.1, 0.015, 8, 48]} />
          <meshBasicMaterial color="#bd93f9" wireframe transparent opacity={0.5} />
        </mesh>
        <points>
          <torusGeometry args={[1.1, 0.015, 8, 48]} />
          <pointsMaterial size={0.03} color="#bd93f9" transparent opacity={0.7} />
        </points>
      </group>

      {/* Orbiting satellites */}
      <group ref={satellitesRef}>
        <mesh position={[Math.cos(0) * 2.0, Math.sin(0) * 2.0, 0]}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[Math.cos(Math.PI * 2 / 3) * 2.0, Math.sin(Math.PI * 2 / 3) * 2.0, 0]}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[Math.cos(Math.PI * 4 / 3) * 2.0, Math.sin(Math.PI * 4 / 3) * 2.0, 0]}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* Glowing core particle spiral */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Internal Portal Light */}
      <pointLight color="#9d4edd" intensity={12} distance={8} />
    </group>
  );
}

// 3. Cosmic Black Hole centered in the portal
function BlackHole() {
  const texture = useTexture("/assets/blackhole.png");
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Accretion disk rotation
      groupRef.current.rotation.z = -time * 0.08;
      // Pulse scale
      const scale = 1.0 + Math.sin(time * 1.2) * 0.03;
      groupRef.current.scale.set(scale, scale, 1.0);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -6.0]}>
      {/* Solid black circle mask behind to block grid lines/particles inside the singularity */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#030105" />
      </mesh>
      
      {/* Accretion disk image with additive blending */}
      <mesh>
        <planeGeometry args={[7.2, 7.2]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          opacity={0.98}
        />
      </mesh>
      
      {/* Ambient glow pointlight casting purple light onto the landscape */}
      <pointLight color="#9d4edd" intensity={8} distance={12} />
    </group>
  );
}

// 4. Cinematic Camera controller executing smooth spline easing, drone orbits, and mouse tilts
function CameraController() {
  useFrame((state) => {
    // Calculate scroll progress (0 to 1)
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    // Easing curve (easeInOutCubic) to smooth out scroll breaks
    const easeProgress = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const pointer = state.pointer; // Mouse coordinate (-1 to 1)

    // Setup target positions along segment tracks
    let targetX = 0;
    let targetY = 0;
    let targetZ = 6.2;
    let targetRotX = 0;
    let targetRotY = 0;

    if (easeProgress < 0.25) {
      // SECTION 1: Hero (Framed low looking slightly up)
      const t = easeProgress / 0.25;
      targetX = THREE.MathUtils.lerp(0.0, 0.0, t);
      targetY = THREE.MathUtils.lerp(-0.25, 0.35, t);
      targetZ = THREE.MathUtils.lerp(6.2, 4.5, t);
      targetRotX = THREE.MathUtils.lerp(0.04, -0.06, t);
      targetRotY = THREE.MathUtils.lerp(0.0, 0.0, t);
    } else if (easeProgress < 0.5) {
      // SECTION 2: About Me (Camera sweeps past portal)
      const t = (easeProgress - 0.25) / 0.25;
      targetX = THREE.MathUtils.lerp(0.0, -1.8, t);
      targetY = THREE.MathUtils.lerp(0.35, 0.75, t);
      targetZ = THREE.MathUtils.lerp(4.5, -4.8, t);
      targetRotX = THREE.MathUtils.lerp(-0.06, 0.08, t);
      targetRotY = THREE.MathUtils.lerp(0.0, 0.35, t);
    } else if (easeProgress < 0.75) {
      // SECTION 3: Abilities (Orbiting down over core)
      const t = (easeProgress - 0.5) / 0.25;
      targetX = THREE.MathUtils.lerp(-1.8, 0.0, t);
      targetY = THREE.MathUtils.lerp(0.75, -1.8, t);
      targetZ = THREE.MathUtils.lerp(-4.8, -8.2, t);
      targetRotX = THREE.MathUtils.lerp(0.08, -0.42, t);
      targetRotY = THREE.MathUtils.lerp(0.35, 0.0, t);
    } else {
      // SECTION 4: Contact/Guild (Profile framing)
      const t = (easeProgress - 0.75) / 0.25;
      targetX = THREE.MathUtils.lerp(0.0, 1.8, t);
      targetY = THREE.MathUtils.lerp(-1.8, 0.0, t);
      targetZ = THREE.MathUtils.lerp(-8.2, -7.0, t);
      targetRotX = THREE.MathUtils.lerp(-0.42, -0.05, t);
      targetRotY = THREE.MathUtils.lerp(0.0, -0.3, t);
    }

    // Drone Orbit / Breathing motion
    const time = state.clock.getElapsedTime();
    const orbitX = Math.sin(time * 0.42) * 0.22;
    const orbitY = Math.cos(time * 0.33) * 0.12;
    const orbitZ = Math.sin(time * 0.18) * 0.15;

    // Interactive Mouse Parallax tilt
    const parallaxX = pointer.x * 0.35;
    const parallaxY = -pointer.y * 0.22;

    // Combine targets and damp (lerp) for film-like ease
    const finalX = targetX + orbitX + parallaxX;
    const finalY = targetY + orbitY + parallaxY;
    const finalZ = targetZ + orbitZ;

    state.camera.position.x += (finalX - state.camera.position.x) * 0.05;
    state.camera.position.y += (finalY - state.camera.position.y) * 0.05;
    state.camera.position.z += (finalZ - state.camera.position.z) * 0.05;

    state.camera.rotation.x += (targetRotX - state.camera.rotation.x) * 0.05;
    state.camera.rotation.y += (targetRotY - state.camera.rotation.y) * 0.05;
  });

  return null;
}

export default function Monarch3DScene() {
  const isRecruiter = typeof document !== "undefined" && document.documentElement.classList.contains("recruiter-mode");
  if (isRecruiter) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none no-recruiter w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 60 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        shadows
      >
        <color attach="background" args={["#030105"]} />
        <fogExp2 attach="fog" args={["#030105", 0.07]} />

        <ambientLight intensity={0.45} />
        
        {/* Soft shadow casting directional lights */}
        <directionalLight
          position={[5, 6, 4]}
          intensity={1.6}
          color="#00f0ff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0015}
        />
        <directionalLight
          position={[-5, -4, 4]}
          intensity={1.0}
          color="#9d4edd"
        />

        {/* Floating holographic wave terrain grid */}
        <HolographicTerrain />

        {/* Concentric rings & core */}
        <DungeonGate />
        <Suspense fallback={null}>
          <BlackHole />
        </Suspense>

        {/* Depth Sparkles */}
        <Sparkles
          count={100}
          scale={10}
          size={2}
          color="#9d4edd"
          speed={0.8}
          noise={1.5}
        />
        <Sparkles
          count={70}
          scale={10}
          size={1.5}
          color="#00f0ff"
          speed={0.6}
          noise={1.0}
        />

        {/* Coordinate camera trajectory */}
        <CameraController />
      </Canvas>
    </div>
  );
}
