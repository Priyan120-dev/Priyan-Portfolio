"use client";

import { useState, useRef, MouseEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { BrainCircuit, LayoutTemplate, MessageSquareCode, RadioReceiver, ShieldAlert, Award } from "lucide-react";
import { useSound } from "@/hooks/useSound";

interface Ability {
  name: string;
  statName: string;
  score: number;
  rank: string;
  rankTitle: string;
  color: string;
  icon: React.ReactNode;
  skills: string[];
  description: string;
}

export default function Abilities() {
  const { play } = useSound();
  const [selectedAbility, setSelectedAbility] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 3D Scroll Perspective
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateXScroll = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [12, 0, 0, -12]);
  const translateZScroll = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [-80, 0, 0, -80]);
  const opacityScroll = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  // 3D Card Hover Tilt State (Status Window - Left)
  const [leftTiltX, setLeftTiltX] = useState(0);
  const [leftTiltY, setLeftTiltY] = useState(0);
  const leftCardRef = useRef<HTMLDivElement | null>(null);

  const handleLeftMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = leftCardRef.current;
    if (!card) return;

    const isRecruiter = document.documentElement.classList.contains("recruiter-mode");
    if (isRecruiter) return;

    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    const rX = ((centerY - y) / centerY) * 8;
    const rY = ((x - centerX) / centerX) * 8;

    setLeftTiltX(rX);
    setLeftTiltY(rY);
  };

  const handleLeftMouseLeave = () => {
    setLeftTiltX(0);
    setLeftTiltY(0);
  };

  // 3D Card Hover Tilt State (Detail Card - Right)
  const [rightTiltX, setRightTiltX] = useState(0);
  const [rightTiltY, setRightTiltY] = useState(0);
  const rightCardRef = useRef<HTMLDivElement | null>(null);

  const handleRightMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = rightCardRef.current;
    if (!card) return;

    const isRecruiter = document.documentElement.classList.contains("recruiter-mode");
    if (isRecruiter) return;

    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    const rX = ((centerY - y) / centerY) * 8;
    const rY = ((x - centerX) / centerX) * 8;

    setRightTiltX(rX);
    setRightTiltY(rY);
  };

  const handleRightMouseLeave = () => {
    setRightTiltX(0);
    setRightTiltY(0);
  };

  const abilities: Ability[] = [
    {
      name: "AI & Data Tools",
      statName: "STR (Strength)",
      score: 98,
      rank: "S-Rank",
      rankTitle: "Elite Hunter",
      color: "#9d4edd",
      icon: <BrainCircuit className="h-6 w-6" />,
      skills: ["Python", "ChatGPT", "Generative AI Tools", "Data Analysis (Basic)", "Scikit-Learn"],
      description: "Harnessing the power of intelligent computation and generative architectures. Specializes in building AI-powered projects, prompt optimizations, and data analysis algorithms."
    },
    {
      name: "Web Development",
      statName: "AGI (Agility)",
      score: 95,
      rank: "A-Rank",
      rankTitle: "Shadow Runner",
      color: "#00f0ff",
      icon: <LayoutTemplate className="h-6 w-6" />,
      skills: ["HTML5 / CSS3", "JavaScript", "Responsive Design", "Browser APIs", "Figma / Canva"],
      description: "Executing swift, interactive user interfaces and responsive browser experiences. Crafting retro arcade games and sleek front-end designs from scratch."
    },
    {
      name: "IoT & Hardware",
      statName: "INT (Intelligence)",
      score: 94,
      rank: "S-Rank",
      rankTitle: "System Master",
      color: "#ffb703",
      icon: <RadioReceiver className="h-6 w-6" />,
      skills: ["Arduino", "Raspberry Pi", "Sensor Integration", "Real-time Systems", "Hardware Pipelines"],
      description: "Bridging hardware-software boundaries. Experienced in building temperature cold-chain monitoring boxes, safety alerting bands, and sensor arrays."
    },
    {
      name: "Cybersecurity",
      statName: "SEN (Sense)",
      score: 92,
      rank: "S-Rank",
      rankTitle: "Void Watcher",
      color: "#e63946",
      icon: <ShieldAlert className="h-6 w-6" />,
      skills: ["Cybersecurity Fundamentals", "Phishing Defense", "URL Pattern Matching", "Heuristic Scanning", "Chrome DevTools"],
      description: "Securing communication vectors. Engineered custom heuristic URL scanners in Python to identify malicious structures and lower false-negative detection rates."
    },
    {
      name: "Prompt Engineering",
      statName: "VIT (Vitality)",
      score: 96,
      rank: "S-Rank",
      rankTitle: "Mana Channeler",
      color: "#2a9d8f",
      icon: <MessageSquareCode className="h-6 w-6" />,
      skills: ["System Instructions", "Agentic Orchestration", "Few-Shot Engineering", "Context Optimization", "VS Code / Git"],
      description: "Authoring precise prompt directives and context-optimized instructions to program autonomous behaviors and leverage Generative AI tools."
    }
  ];

  const handleAbilityClick = (index: number) => {
    play("click");
    setSelectedAbility(index);
  };

  return (
    <section
      id="abilities"
      ref={containerRef}
      className="relative py-24 md:py-32 bg-transparent border-t border-monarch-purple/5 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Visual background details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(0,240,255,0.02)_100%)] pointer-events-none" />

      <motion.div
        style={{
          rotateX: rotateXScroll,
          translateZ: translateZScroll,
          opacity: opacityScroll,
          transformStyle: "preserve-3d",
        }}
        className="max-w-6xl mx-auto px-4 relative z-10 pointer-events-auto"
      >
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="font-mono text-xs text-monarch-blue tracking-[0.3em] uppercase block mb-2">
            HUNTER MATRIX
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold tracking-widest text-glow-blue text-monarch-blue">
            SYSTEM ABILITIES
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-monarch-blue to-transparent mx-auto mt-4" />
        </div>

        {/* Ability Window Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Status Window - Left Column */}
          <motion.div
            ref={leftCardRef}
            onMouseMove={handleLeftMouseMove}
            onMouseLeave={handleLeftMouseLeave}
            animate={{
              rotateX: leftTiltX,
              rotateY: leftTiltY,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
            className="lg:col-span-5 border border-monarch-purple/20 bg-[#120e1e]/60 rounded-lg p-6 relative shadow-[0_15px_35px_rgba(0,0,0,0.4)] transform-style-3d"
          >
            <div className="corner-decor corner-decor-tl" />
            <div className="corner-decor corner-decor-tr" />
            <div className="corner-decor corner-decor-bl" />
            <div className="corner-decor corner-decor-br" />

            <div 
              className="border-b border-monarch-purple/10 pb-4 mb-6"
              style={{ transform: "translateZ(25px)" }}
            >
              <span className="font-mono text-[10px] text-slate-500 block mb-1">HUNTER MATRIX HUD</span>
              <h3 className="font-orbitron text-glow-purple text-monarch-purple font-bold tracking-widest text-base">
                MONARCH STATUS WINDOW
              </h3>
            </div>

            {/* List of Stats */}
            <div 
              className="space-y-4"
              style={{ transform: "translateZ(15px)" }}
            >
              {abilities.map((ability, index) => (
                <div
                  key={index}
                  onClick={() => handleAbilityClick(index)}
                  onMouseEnter={() => play("hover")}
                  className={`p-3 rounded border cursor-pointer transition-all duration-300 ${
                    selectedAbility === index
                      ? "border-monarch-blue/50 bg-monarch-blue/10 shadow-[0_0_15px_rgba(0,240,255,0.08)]"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-1.5 rounded"
                        style={{
                          backgroundColor: `${ability.color}15`,
                          color: ability.color,
                          border: `1px solid ${ability.color}30`
                        }}
                      >
                        {ability.icon}
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-slate-500 block">{ability.statName}</span>
                        <span className="font-orbitron font-semibold text-xs tracking-wider text-slate-200">
                          {ability.name}
                        </span>
                      </div>
                    </div>
                    {/* Rank Badge */}
                    <div
                      className="px-2 py-0.5 rounded text-[10px] font-orbitron font-bold tracking-wider"
                      style={{
                        backgroundColor: `${ability.color}20`,
                        color: ability.color,
                        border: `1px solid ${ability.color}40`,
                        textShadow: `0 0 6px ${ability.color}60`
                      }}
                    >
                      {ability.rank}
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-950 border border-slate-900 h-2 rounded-full overflow-hidden p-[1px]">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${ability.score}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        style={{
                          backgroundColor: ability.color,
                          boxShadow: `0 0 8px ${ability.color}`
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-400 w-8 text-right">
                      {ability.score}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Detail Subwindow - Right Column */}
          <div className="lg:col-span-7 h-full">
            <AnimatePresence mode="wait">
              {selectedAbility !== null && (
                <motion.div
                  key={selectedAbility}
                  ref={rightCardRef}
                  onMouseMove={handleRightMouseMove}
                  onMouseLeave={handleRightMouseLeave}
                  animate={{
                    rotateX: rightTiltX,
                    rotateY: rightTiltY,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
                  initial={{ opacity: 0, y: 15 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="border border-monarch-purple/20 bg-[#120e1e]/60 rounded-lg p-6 md:p-8 relative shadow-[0_15px_35px_rgba(0,0,0,0.4)] min-h-[350px] flex flex-col justify-between transform-style-3d"
                >
                  <div className="corner-decor corner-decor-tl" />
                  <div className="corner-decor corner-decor-tr" />
                  <div className="corner-decor corner-decor-bl" />
                  <div className="corner-decor corner-decor-br" />

                  {/* Top Description Grid */}
                  <div>
                    <div 
                      className="flex items-center justify-between flex-wrap gap-4 border-b border-monarch-purple/10 pb-4 mb-6"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-3 rounded-lg border"
                          style={{
                            backgroundColor: `${abilities[selectedAbility].color}15`,
                            color: abilities[selectedAbility].color,
                            borderColor: `${abilities[selectedAbility].color}30`
                          }}
                        >
                          {abilities[selectedAbility].icon}
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-slate-500 block">CAPABILITY FILE</span>
                          <h4 className="font-orbitron font-bold text-slate-200 tracking-wider text-lg">
                            {abilities[selectedAbility].name}
                          </h4>
                        </div>
                      </div>

                      {/* Rank Card Badge */}
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded border font-orbitron font-black text-xs tracking-widest uppercase shadow-md animate-pulse"
                        style={{
                          backgroundColor: `${abilities[selectedAbility].color}15`,
                          color: abilities[selectedAbility].color,
                          borderColor: `${abilities[selectedAbility].color}40`,
                          boxShadow: `0 0 15px ${abilities[selectedAbility].color}10`
                        }}
                      >
                        <Award className="h-4 w-4" />
                        <span>{abilities[selectedAbility].rankTitle}</span>
                      </div>
                    </div>

                    <p 
                      className="font-sans text-slate-300 leading-relaxed mb-8"
                      style={{ transform: "translateZ(15px)" }}
                    >
                      {abilities[selectedAbility].description}
                    </p>
                  </div>

                  {/* Skills Grid */}
                  <div style={{ transform: "translateZ(20px)" }}>
                    <h5 className="font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-3">
                      UNLOCKED CAPABILITY NODES
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {abilities[selectedAbility].skills.map((skill, index) => (
                        <div
                          key={index}
                          onMouseEnter={() => play("hover")}
                          className="px-3 py-1.5 font-mono text-xs rounded border border-monarch-purple/15 bg-monarch-purple/5 text-slate-300 cursor-default hover:text-white hover:border-monarch-purple/40 hover:bg-monarch-purple/10 transition-colors"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
