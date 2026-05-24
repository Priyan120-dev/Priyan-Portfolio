"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useSound } from "@/hooks/useSound";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { play, muted, toggleMute } = useSound();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Interactive landing state to unlock Web Audio context
  const [isActivated, setIsActivated] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Accessing the Monarch System...");
  const [phase, setPhase] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  
  // High-tech alerts glitch overlays
  const [alertText, setAlertText] = useState<string | null>(null);
  
  // Keep progress & states in refs for synchronous Three.js render loop access
  const progressRef = useRef(0);
  const isWarpingRef = useRef(false);
  const isActivatedRef = useRef(false);

  // Audio nodes refs for dynamic pitch/gain sweeping
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humOscRef = useRef<OscillatorNode | null>(null);
  const humGainRef = useRef<GainNode | null>(null);
  const warpTimeoutRef = useRef<any>(null);

  // 1. Initial activation handler
  const handleAwaken = () => {
    setIsActivated(true);
    isActivatedRef.current = true;
    
    // Automatically unmute to enable full audio immersion
    if (muted) {
      toggleMute();
    }
    
    play("click");

    // Initialize Web Audio synthesizer hum
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Low frequency hum oscillator
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(45, ctx.currentTime); // Deep cosmic drone
        humOscRef.current = osc;

        // Lowpass filter to muffle hum
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(110, ctx.currentTime);

        // Gain node for volume control
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        humGainRef.current = gain;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        
        // Sweep hum volume up smoothly
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.5);
      }
    } catch (e) {
      console.warn("Synth initialization failed", e);
    }
  };

  // 2. Percentage counter simulation
  useEffect(() => {
    if (!isActivated) return;

    const totalDuration = 5200; // Expanded to 5.2 seconds for full cinematic progression
    const intervalTime = 30;
    const step = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        // Varying speed rates to represent scanning halts, overloads, and power spikes
        let speedMult = 1.0;
        if (prev > 15 && prev < 30) speedMult = 0.45; // scanning signature
        if (prev > 50 && prev < 68) speedMult = 0.35; // system boot check
        if (prev > 78 && prev < 90) speedMult = 0.25; // stabilizing S-rank energy
        if (prev > 90 && prev < 98) speedMult = 2.4;  // sudden singularity pull

        const next = Math.min(prev + step * (Math.random() * 1.6 + 0.3) * speedMult, 100);
        progressRef.current = next;

        if (next === 100) {
          clearInterval(timer);
          setIsWarping(true);
          isWarpingRef.current = true;

          // Sound trigger at portal burst
          play("portal");
          
          // Terminate synth hum cleanly
          if (humGainRef.current && audioCtxRef.current) {
            humGainRef.current.gain.linearRampToValueAtTime(0.0, audioCtxRef.current.currentTime + 0.2);
          }

          warpTimeoutRef.current = setTimeout(() => {
            if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
              audioCtxRef.current.close().catch((err) => {
                console.warn("Failed to close AudioContext on warp complete:", err);
              });
            }
            onComplete();
          }, 800); // Cinematic white flash duration
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
      if (warpTimeoutRef.current) {
        clearTimeout(warpTimeoutRef.current);
      }
    };
  }, [isActivated, onComplete, play]);

  // 3. Audio Context unmount safety cleanup
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch((err) => {
          console.warn("Failed to close AudioContext on unmount:", err);
        });
      }
    };
  }, []);

  // 3. Status and Alert message milestones
  useEffect(() => {
    if (!isActivated) return;

    if (progress < 15 && phase === 0) {
      setStatusText("[SYSTEM: INITIALIZING GATEWAY]");
      setAlertText(null);
      setPhase(1);
    } else if (progress >= 15 && progress < 35 && phase === 1) {
      setStatusText("[SYSTEM: SCANNING CODESPACE]");
      setAlertText("[ALERT: MANA SIGNATURE DETECTED]");
      setPhase(2);
    } else if (progress >= 35 && progress < 55 && phase === 2) {
      setStatusText("[SYSTEM: AUTHENTICATING ACCESS]");
      setAlertText("[ALERT: HUNTER DETECTED - S-RANK]");
      setPhase(3);
    } else if (progress >= 55 && progress < 78 && phase === 3) {
      setStatusText("[SYSTEM: COUPLING SHADOW CORE]");
      setAlertText("[SYSTEM: SHADOW SYSTEM ONLINE]");
      setPhase(4);
    } else if (progress >= 78 && progress < 92 && phase === 4) {
      setStatusText("[SYSTEM: STABILIZING MANA CORE]");
      setAlertText("[ALERT: MONARCH STATUS - AWAKENING]");
      setPhase(5);
    } else if (progress >= 92 && progress < 95 && phase === 5) {
      setStatusText("[WARNING: CRITICAL SINGULARITY FAILURE]");
      setAlertText("[WARNING: DIMENSIONAL BREACH - OVERLOAD]");
      setPhase(6);
    } else if (progress >= 95 && phase === 6) {
      setStatusText("[CRITICAL: SINGULARITY COLLAPSE - ENGAGING WARP]");
      setAlertText("[CRITICAL: SYSTEM OVERRIDE - WARP ACTIVE]");
      setPhase(7);
    }
  }, [progress, phase, isActivated]);

  // 4. WebGL Three.js Cinematic Scene inside the Loader
  useEffect(() => {
    if (!isActivated) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05010a, 0.08);

    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    // Camera starts offset at a dramatic angle
    camera.position.set(3.0, 1.5, 6.0);

    // Light sources
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 6, 15);
    cyanLight.position.set(2, 2, 2);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x9d4edd, 8, 15);
    purpleLight.position.set(-2, -2, 2);
    scene.add(purpleLight);

    const coreLight = new THREE.PointLight(0x9d4edd, 12, 10);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const portalGroup = new THREE.Group();
    scene.add(portalGroup);

    // 4.1 Accretion Disk (Cosmic Black Hole)
    const texture = new THREE.TextureLoader().load("/assets/blackhole.png");
    const blackholeGroup = new THREE.Group();
    portalGroup.add(blackholeGroup);

    // Black circle mask behind singularity center
    const circleGeom = new THREE.CircleGeometry(0.26, 32);
    const circleMat = new THREE.MeshBasicMaterial({ color: 0x05010a });
    const singularityMask = new THREE.Mesh(circleGeom, circleMat);
    singularityMask.position.z = -0.01;
    blackholeGroup.add(singularityMask);

    // Accretion disk plane mesh
    const diskGeom = new THREE.PlaneGeometry(2.5, 2.5);
    const diskMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0, // Starts invisible, fades in at 25%
    });
    const accretionDisk = new THREE.Mesh(diskGeom, diskMat);
    blackholeGroup.add(accretionDisk);

    // 4.2 Concentric Rings
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x9d4edd, wireframe: true, transparent: true, opacity: 0 });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0 });
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xbd93f9, wireframe: true, transparent: true, opacity: 0 });

    const ringGeom1 = new THREE.TorusGeometry(2.0, 0.03, 8, 48);
    const ringGeom2 = new THREE.TorusGeometry(1.5, 0.02, 8, 48);
    const ringGeom3 = new THREE.TorusGeometry(1.1, 0.015, 8, 48);

    const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    const ring3 = new THREE.Mesh(ringGeom3, ringMat3);

    const ringPointsMat = new THREE.PointsMaterial({ size: 0.035, color: 0x00f0ff, transparent: true, opacity: 0 });
    const ringPoints1 = new THREE.Points(ringGeom1, ringPointsMat.clone());
    ringPoints1.material.color.setHex(0x9d4edd);
    const ringPoints2 = new THREE.Points(ringGeom2, ringPointsMat.clone());
    ringPoints2.material.color.setHex(0x00f0ff);
    const ringPoints3 = new THREE.Points(ringGeom3, ringPointsMat.clone());
    ringPoints3.material.color.setHex(0xbd93f9);

    portalGroup.add(ring1, ringPoints1);
    portalGroup.add(ring2, ringPoints2);
    portalGroup.add(ring3, ringPoints3);

    // Orbiting navigation nodes
    const nodeGroup = new THREE.Group();
    portalGroup.add(nodeGroup);
    const nodeGeom = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const satelliteNodes: THREE.Mesh[] = [];
    const satelliteCount = 3;
    for (let i = 0; i < satelliteCount; i++) {
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      const angle = (i / satelliteCount) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 2.0, Math.sin(angle) * 2.0, 0);
      nodeGroup.add(node);
      satelliteNodes.push(node);
    }
    nodeGroup.position.z = 999; // Hides until ring 1 activates

    // 4.3 Inward-Spiraling Particle Vortex (Adaptive count based on performance)
    const isMobile = window.innerWidth < 768 || navigator.maxTouchPoints > 0;
    const particleCount = isMobile ? 800 : 2000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const zPositions = new Float32Array(particleCount);
    const rotationalSpeeds = new Float32Array(particleCount);
    const forwardSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = Math.random() * 2.4 + 0.25; // outer boundaries
      zPositions[i] = Math.random() * 10.0 - 5.0; // depth
      rotationalSpeeds[i] = Math.random() * 0.3 + 0.08;
      forwardSpeeds[i] = Math.random() * 0.4 + 0.25;

      const ratio = (zPositions[i] + 5.0) / 10.0;
      colors[i * 3] = ratio > 0.5 ? 0.65 : 0.0;
      colors[i * 3 + 1] = ratio > 0.5 ? 0.15 : 0.95;
      colors[i * 3 + 2] = 1.0;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0, // Fades in with progress
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const vortexParticles = new THREE.Points(particleGeom, particleMat);
    portalGroup.add(vortexParticles);

    // 4.4 Electric discharge energy arcs
    const arcCount = 4;
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const arcGeom = new THREE.BufferGeometry();
    const arcPositions = new Float32Array(arcCount * 2 * 3);
    arcGeom.setAttribute("position", new THREE.BufferAttribute(arcPositions, 3));
    const energyArcs = new THREE.LineSegments(arcGeom, arcMat);
    portalGroup.add(energyArcs);

    const updateEnergyArcs = () => {
      const posAttr = arcGeom.getAttribute("position") as THREE.BufferAttribute;
      const p = posAttr.array as Float32Array;
      
      for (let i = 0; i < arcCount; i++) {
        const sAngle = Math.random() * Math.PI * 2;
        const sRadius = 0.2 + Math.random() * 0.3;
        const sx = Math.cos(sAngle) * sRadius;
        const sy = Math.sin(sAngle) * sRadius;
        const sz = (Math.random() - 0.5) * 0.1;

        const tAngle = sAngle + (Math.random() - 0.5) * 0.6;
        const tRadius = 1.1 + Math.random() * 0.8;
        const tx = Math.cos(tAngle) * tRadius;
        const ty = Math.sin(tAngle) * tRadius;
        const tz = (Math.random() - 0.5) * 0.15;

        p[i * 6] = sx;
        p[i * 6 + 1] = sy;
        p[i * 6 + 2] = sz;
        
        p[i * 6 + 3] = tx;
        p[i * 6 + 4] = ty;
        p[i * 6 + 5] = tz;
      }
      posAttr.needsUpdate = true;
      arcMat.color.setHex(Math.random() > 0.5 ? 0x00f0ff : 0x9d4edd);
    };

    // 4.5 Shockwave ripple ring
    const shockGeom = new THREE.RingGeometry(0.1, 0.2, 32);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const shockMesh = new THREE.Mesh(shockGeom, shockMat);
    scene.add(shockMesh);

    let shockScale = 1.0;
    const triggerShockwave = () => {
      shockScale = 1.0;
      shockMesh.scale.set(1, 1, 1);
      shockMat.opacity = 0.95;
    };

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop Variables
    let animationFrameId: number;
    let warpSpeed = 0.02;
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();
      const currentProgress = progressRef.current;
      const speedMultiplier = 1.0 + (currentProgress / 100) * 3.5;

      // 1. Fade-in and scale elements based on milestones
      
      // Phase 1 (0% to 25%): Fade in particles slowly
      if (currentProgress < 25) {
        particleMat.opacity = (currentProgress / 25) * 0.75;
      } else {
        particleMat.opacity = 0.75;
      }

      // Phase 2 (25% to 50%): Fade in blackhole accretion disk
      if (currentProgress >= 25 && currentProgress < 50) {
        diskMat.opacity = ((currentProgress - 25) / 25) * 0.95;
      } else if (currentProgress >= 50) {
        diskMat.opacity = 0.95;
      }

      // Phase 3 (50% to 80%): Fade in concentric rings & beeps
      if (currentProgress >= 50 && currentProgress < 80) {
        const ringOpacity = ((currentProgress - 50) / 30) * 0.45;
        ringMat1.opacity = ringOpacity;
        ringMat2.opacity = ringOpacity;
        ringMat3.opacity = ringOpacity;
        ringPointsMat.opacity = ringOpacity * 2.0;

        // Position nodes on rings
        nodeGroup.position.z = 0;
        
        // Energy arcs
        arcMat.opacity = ((currentProgress - 50) / 30) * 0.85;
      } else if (currentProgress >= 80) {
        ringMat1.opacity = 0.45;
        ringMat2.opacity = 0.45;
        ringMat3.opacity = 0.45;
        ringPointsMat.opacity = 0.9;
        arcMat.opacity = 0.85;
      }

      // 2. Swirl rings, nodes and blackhole
      portalGroup.rotation.z = time * 0.12 * speedMultiplier;
      blackholeGroup.rotation.z = -time * 0.1 * speedMultiplier;

      ring1.rotation.x = time * 0.25 * speedMultiplier;
      ringPoints1.rotation.x = time * 0.25 * speedMultiplier;
      ring2.rotation.y = -time * 0.35 * speedMultiplier;
      ringPoints2.rotation.y = -time * 0.35 * speedMultiplier;
      ring3.rotation.x = -time * 0.15 * speedMultiplier;
      ringPoints3.rotation.z = -time * 0.5 * speedMultiplier;

      nodeGroup.rotation.z = -time * 0.7 * speedMultiplier;

      // Animate shockwave
      if (shockMat.opacity > 0) {
        shockScale += 0.22 * speedMultiplier;
        shockMesh.scale.set(shockScale, shockScale, 1.0);
        shockMat.opacity -= 0.045;
      }

      // Crackling arcs
      if (currentProgress >= 50 && Math.random() < 0.25) {
        updateEnergyArcs();
      }

      // 3. Synthesized sound drone frequency and volume sweeps
      if (audioCtxRef.current && humOscRef.current && humGainRef.current) {
        const ctx = audioCtxRef.current;
        
        // Hum Pitch sweeps from 45Hz to 75Hz
        const targetFreq = 45.0 + (currentProgress / 100) * 30.0;
        humOscRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.1);

        // Volume rises
        let targetVol = 0.05 + (currentProgress / 100) * 0.18;

        // SILENCE BEFORE IMPACT (95% to 99% progress)
        if (currentProgress >= 95 && currentProgress < 100) {
          targetVol = 0.0;
        }

        humGainRef.current.gain.setTargetAtTime(targetVol, ctx.currentTime, 0.05);
      }

      // 4. Inward-Spiraling Particle Vortex physics
      const posAttr = particleGeom.getAttribute("position") as THREE.BufferAttribute;
      const p = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        if (!isWarpingRef.current) {
          // Normal: spiral INWARD towards center singularity
          angles[i] += rotationalSpeeds[i] * 0.015 * speedMultiplier;
          radii[i] -= forwardSpeeds[i] * 0.004 * speedMultiplier;

          // Reset when sucked past event horizon
          if (radii[i] < 0.15) {
            radii[i] = 2.4;
            angles[i] = Math.random() * Math.PI * 2;
          }
          
          const normZ = (zPositions[i] + 5.0) / 10.0;
          const currentRadius = radii[i] * (0.55 + normZ * 2.3);

          p[i * 3] = Math.cos(angles[i]) * currentRadius;
          p[i * 3 + 1] = Math.sin(angles[i]) * currentRadius;
          p[i * 3 + 2] = zPositions[i];
        } else {
          // Warp Speed: Invert physics and EXPLODE particles outward
          radii[i] += forwardSpeeds[i] * 0.14 * speedMultiplier;
          zPositions[i] -= forwardSpeeds[i] * 0.5; // push past camera rapidly

          const currentRadius = radii[i] * 1.5;
          p[i * 3] = Math.cos(angles[i]) * currentRadius;
          p[i * 3 + 1] = Math.sin(angles[i]) * currentRadius;
          // Stretched warp streaks
          p[i * 3 + 2] = zPositions[i];
        }
      }
      posAttr.needsUpdate = true;

      // 5. Cinematic Camera Tracks
      if (currentProgress < 25) {
        // Phase 1 (0-25%): Subtle diagonal orbit drift
        const t = currentProgress / 25;
        camera.position.x = THREE.MathUtils.lerp(3.0, 1.2, t) + Math.sin(time * 0.5) * 0.08;
        camera.position.y = THREE.MathUtils.lerp(1.5, 0.6, t) + Math.cos(time * 0.5) * 0.04;
        camera.position.z = THREE.MathUtils.lerp(6.0, 5.2, t);
        camera.lookAt(0, 0, 0);
      } else if (currentProgress < 50) {
        // Phase 2 (25-50%): Align center and zoom in
        const t = (currentProgress - 25) / 25;
        camera.position.x = THREE.MathUtils.lerp(1.2, 0, t);
        camera.position.y = THREE.MathUtils.lerp(0.6, 0, t);
        camera.position.z = THREE.MathUtils.lerp(5.2, 4.4, t);
        camera.lookAt(0, 0, 0);
      } else if (currentProgress < 80) {
        // Phase 3 (50-80%): Forward push + Name Reveal subtle camera shakes
        const t = (currentProgress - 50) / 30;
        const shake = 0.015 + t * 0.015; // shake increases
        camera.position.x = (Math.random() - 0.5) * shake;
        camera.position.y = (Math.random() - 0.5) * shake;
        camera.position.z = 4.4 - t * 0.4 + (Math.random() - 0.5) * (shake * 0.4);
        camera.lookAt(0, 0, 0);
      } else if (currentProgress < 95) {
        // Phase 4 (80-95%): Instability heavy portal shaking
        const t = (currentProgress - 80) / 15;
        const shake = 0.03 + t * 0.06;
        camera.position.x = (Math.random() - 0.5) * shake;
        camera.position.y = (Math.random() - 0.5) * shake;
        camera.position.z = 4.0 - t * 0.4 + (Math.random() - 0.5) * (shake * 0.5);
        camera.lookAt(0, 0, 0);

        // Instantly flicker point light to mimic portal overload
        coreLight.intensity = 12.0 + Math.sin(time * 75.0) * 8.0 * t;
      } else {
        // Phase 5 (95-100%): Warp recoil (anticipation snap back), then warp rocket zoom
        if (!isWarpingRef.current) {
          const t = (currentProgress - 95) / 5;
          camera.position.x = 0;
          camera.position.y = 0;
          camera.position.z = 3.6 + t * 0.35; // pull back
          camera.lookAt(0, 0, 0);
        } else {
          // Rocket zoom through center singularity
          camera.position.z -= warpSpeed;
          warpSpeed += 0.045; // exponential warp acceleration
          camera.lookAt(0, 0, 0);

          // Force expand scales
          blackholeGroup.scale.addScalar(0.12);
          ring1.scale.addScalar(0.09);
          ring2.scale.addScalar(0.09);
          ring3.scale.addScalar(0.09);
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      circleGeom.dispose();
      circleMat.dispose();
      diskGeom.dispose();
      diskMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      ringMat3.dispose();
      ringGeom1.dispose();
      ringGeom2.dispose();
      ringGeom3.dispose();
      ringPointsMat.dispose();
      nodeGeom.dispose();
      nodeMat.dispose();
      arcGeom.dispose();
      arcMat.dispose();
      shockGeom.dispose();
      shockMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
    };
  }, [isActivated]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05010a] text-slate-100 select-none overflow-hidden">
      {/* 1. Silent Landing Activation Screen */}
      <AnimatePresence>
        {!isActivated && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#030105] flex flex-col items-center justify-center z-50 p-4"
          >
            {/* Subtle drifting stars in background of Void */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(1px_1px_at_20px_30px,#fff,transparent),radial-gradient(1px_1px_at_40px_70px,#fff,transparent),radial-gradient(2px_2px_at_50px_160px,#bd93f9,transparent),radial-gradient(1px_1px_at_80px_120px,#fff,transparent),radial-gradient(2.5px_2.5px_at_110px_220px,#00f0ff,transparent)] bg-[size:150px_150px] animate-pulse pointer-events-none" />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.2 }}
              className="flex flex-col items-center gap-4 relative z-10"
            >
              <div className="w-2 h-2 rounded-full bg-monarch-blue shadow-[0_0_12px_#00f0ff] animate-ping mb-3" />
              <button
                onClick={handleAwaken}
                className="group px-8 py-4 font-orbitron font-bold text-xs tracking-[0.25em] text-monarch-blue border border-monarch-blue/40 rounded bg-monarch-blue/5 hover:bg-monarch-blue/15 hover:border-monarch-blue hover:text-glow-blue transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] cursor-pointer overflow-hidden relative"
              >
                {/* Laser shine sweep inside activation button */}
                <div className="absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine pointer-events-none" />
                [SYSTEM AWAKENING: ACTIVATE INTERFACE]
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. WebGL 3D Canvas rendering Blackhole and concentric energy rings */}
      {isActivated && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-95" />
      )}

      {/* 3. Holographic White Warp Flash when entering */}
      <AnimatePresence>
        {isWarping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 bg-white z-50 pointer-events-none mix-blend-screen flex items-center justify-center"
          >
            {/* Holographic scanning laser overlay on flash */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent w-full h-1/2 animate-[bounce_1.5s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Foreground Holographic HUD UI */}
      {isActivated && (
        <div className="relative z-10 flex flex-col items-center px-4 text-center max-w-md w-full pointer-events-none select-none">
          {/* Top Spacing */}
          <div className="h-20" />

          {/* Chromatic Glitched Name Reveal: emerges between 50% and 80% */}
          <div className="h-16 flex items-center justify-center mb-1 overflow-hidden">
            <AnimatePresence>
              {progress >= 50 && (
                <motion.h1
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="font-orbitron text-2xl md:text-3xl font-black tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 filter drop-shadow-[0_0_15px_rgba(157,78,221,0.5)] animate-[pulse_3s_infinite]"
                  style={{ textShadow: "0 0 10px rgba(157,78,221,0.2)" }}
                >
                  PRIYAN I
                </motion.h1>
              )}
            </AnimatePresence>
          </div>

          <h2 className="font-rajdhani text-xs md:text-sm text-glow-blue text-monarch-blue font-bold tracking-[0.45em] uppercase mb-10 h-6">
            {progress >= 50 ? "AI & DATA SCIENCE ENGINEER" : "SHADOW SYSTEM ACTIVE"}
          </h2>

          {/* Cyber-styled Info Panel with neon borders */}
          <div className="w-full bg-[#120e1e]/85 border border-monarch-purple/40 rounded p-5 mb-8 shadow-[0_0_20px_rgba(157,78,221,0.15)] text-left font-mono text-[11px] leading-relaxed text-slate-300 backdrop-blur-md relative overflow-hidden">
            {/* Cyber corners */}
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-monarch-blue" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-monarch-blue" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-monarch-blue" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-monarch-blue" />
            
            {/* Scanning line */}
            <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-monarch-blue/40 to-transparent animate-[bounce_3s_infinite]" />

            <div className="flex justify-between mb-2">
              <span>HUNTER ID:</span>
              <span className="text-monarch-blue font-bold tracking-wider">#PRIYAN-99</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>SKILL MATRIX:</span>
              <span className="text-monarch-purple font-semibold tracking-wide">AI & WEB DEVELOPMENT</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS:</span>
              <span className="text-yellow-500 animate-pulse font-bold tracking-widest">[AWAKENING]</span>
            </div>
          </div>

          {/* Glitching Alert Texts Overlay */}
          <div className="font-mono text-[10px] md:text-xs text-glow-blue text-monarch-blue mb-5 h-6 tracking-wide flex items-center justify-center">
            <AnimatePresence mode="wait">
              {alertText && (
                <motion.div
                  key={alertText}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="font-bold border border-monarch-blue/20 bg-monarch-blue/5 px-2.5 py-1 rounded"
                >
                  {alertText}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* System status description */}
          <div className="font-mono text-[9px] text-slate-500 mb-3 h-5">
            {statusText}
          </div>

          {/* Loading Progress Bar Container */}
          <div className="w-full bg-slate-950 border border-slate-800 rounded-full h-2.5 overflow-hidden p-[2px] backdrop-blur-md relative">
            <motion.div
              className="h-full bg-gradient-to-r from-monarch-purple via-fuchsia-500 to-monarch-blue rounded-full shadow-[0_0_12px_rgba(0,240,255,0.85)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          {/* Percentage text */}
          <div className="font-orbitron font-black text-lg text-slate-100 mt-3 tracking-wider filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </div>
  );
}
