"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Trophy, Sparkles, Star } from "lucide-react";
import { useSound } from "@/hooks/useSound";

interface TitleAchievement {
  title: string;
  badge: string;
  rank: string;
  rankColor: string;
  event: string;
  description: string;
  effects: string[];
}

export default function Achievements() {
  const { play } = useSound();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 3D Scroll Perspective
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateXScroll = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [10, 0, 0, -10]);
  const translateZScroll = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [-60, 0, 0, -60]);
  const opacityScroll = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  const achievements: TitleAchievement[] = [
    {
      title: "ADAPTIQ CONQUEROR",
      badge: "National",
      rank: "S-Rank Title",
      rankColor: "#9d4edd",
      event: "AI Impact for All 2026 - National Technology Day Hackathon",
      description: "Spearheaded AdaptIQ, an AI-powered adaptive learning system that structures curriculum velocity and study paths dynamically for B.Tech students.",
      effects: ["AI modeling precision increased by +50%", "Curriculum velocity adaptation maxed out"]
    },
    {
      title: "MEDHPERIA SYMPOSIAST",
      badge: "Winner",
      rank: "A-Rank Title",
      rankColor: "#00f0ff",
      event: "MedHperia National Level Symposium (3rd Prize 🥉)",
      description: "Secured 3rd Prize for engineering a Real-Time Blood Bank Inventory AI System, resolving critical supply-chain delays in healthcare logistics.",
      effects: ["System query response rate +35%", "Healthcare UI design capability +40%"]
    },
    {
      title: "COLD CHAIN GUARDIAN",
      badge: "Winner",
      rank: "A-Rank Title",
      rankColor: "#ffb703",
      event: "Synergia 0.1 National Level Hackathon (3rd Prize 🥉)",
      description: "Awarded 3rd Prize for the Vaccine Cold Chain Monitoring Box, capturing real-time telemetry metrics using Raspberry Pi controllers.",
      effects: ["Hardware telemetry precision +40%", "Sensor calibration speed +60%"]
    }
  ];

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="relative py-24 md:py-32 bg-transparent border-t border-monarch-purple/5 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(157,78,221,0.02),transparent_60%)] pointer-events-none" />

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
            ACHIEVEMENTS SYSTEM
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold tracking-widest text-glow-blue text-monarch-blue">
            UNLOCKED TITLES
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-monarch-blue to-transparent mx-auto mt-4" />
        </div>

        {/* Titles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((ach, idx) => (
            <TitleCard key={idx} ach={ach} play={play} />
          ))}
        </div>

        {/* Certifications & Workshops Section */}
        <div className="mt-20 border border-monarch-blue/20 bg-[#120e1e]/60 rounded-lg p-6 md:p-8 relative shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
          <div className="corner-decor corner-decor-tl" />
          <div className="corner-decor corner-decor-tr" />
          <div className="corner-decor corner-decor-bl" />
          <div className="corner-decor corner-decor-br" />

          <h3 className="font-orbitron text-glow-blue text-monarch-blue font-bold tracking-widest text-base mb-6 border-b border-monarch-blue/10 pb-3 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-monarch-blue animate-pulse" />
            UNLOCKED BUFFS & CERTIFICATIONS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300 font-mono text-xs leading-relaxed">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold shrink-0">[CERT]</span>
                <div>
                  <span className="text-slate-100 font-semibold block">Data Analytics with Python</span>
                  <span className="text-[10px] text-slate-500">IIT Roorkee (Coursera)</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold shrink-0">[CERT]</span>
                <div>
                  <span className="text-slate-100 font-semibold block">AI Tools & ChatGPT Workshop</span>
                  <span className="text-[10px] text-slate-500">be10x (2026)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold shrink-0">[BUFF]</span>
                <div>
                  <span className="text-slate-100 font-semibold block">Self Presentation & Communication</span>
                  <span className="text-[10px] text-slate-500">Wadhwani Foundation</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold shrink-0">[BUFF]</span>
                <div>
                  <span className="text-slate-100 font-semibold block">Mathematical Modelling Jam Winner</span>
                  <span className="text-[10px] text-slate-500">DSU (Dhanalakshmi Srinivasan University)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Local 3D Hover Tilt TitleCard Sub-component
function TitleCard({ ach, play }: { ach: TitleAchievement; play: any }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const isRecruiter = document.documentElement.classList.contains("recruiter-mode");
    if (isRecruiter) return;

    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    const rX = ((centerY - y) / centerY) * 10;
    const rY = ((x - centerX) / centerX) * 10;

    setTiltX(rX);
    setTiltY(rY);
  };

  const handleMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tiltX,
        rotateY: tiltY,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
      onMouseEnter={() => play("hover")}
      className="cyber-border-blue rounded-lg p-6 flex flex-col justify-between relative group hover:-translate-y-2 duration-300 transform-style-3d shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
    >
      <div className="corner-decor corner-decor-tl" />
      <div className="corner-decor corner-decor-tr" />
      <div className="corner-decor corner-decor-bl" />
      <div className="corner-decor corner-decor-br" />

      {/* Title Header */}
      <div>
        <div 
          className="flex items-center justify-between mb-6"
          style={{ transform: "translateZ(25px)" }}
        >
          {/* Glowing Trophy Badge */}
          <div className="relative h-12 w-12 rounded border border-monarch-blue/20 bg-monarch-blue/5 flex items-center justify-center text-monarch-blue group-hover:scale-110 transition-transform duration-300">
            <Trophy className="h-6 w-6 drop-shadow-[0_0_8px_#00f0ff]" />
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-glow-blue animate-pulse" />
          </div>

          <span
            className="px-2 py-0.5 rounded text-[9px] font-orbitron font-bold tracking-wider"
            style={{
              backgroundColor: `${ach.rankColor}15`,
              color: ach.rankColor,
              border: `1px solid ${ach.rankColor}30`,
              textShadow: `0 0 6px ${ach.rankColor}40`
            }}
          >
            {ach.rank}
          </span>
        </div>

        <span 
          className="font-mono text-[9px] text-monarch-blue tracking-widest block mb-1"
          style={{ transform: "translateZ(10px)" }}
        >
          TITLE ACQUIRED
        </span>
        <h3 
          className="font-orbitron font-black text-slate-100 group-hover:text-monarch-blue transition-colors text-base tracking-widest mb-3"
          style={{ transform: "translateZ(20px)" }}
        >
          {ach.title}
        </h3>
        
        {/* Event Name */}
        <h4 
          className="font-mono text-[10px] text-yellow-500/80 tracking-wider mb-4 font-semibold"
          style={{ transform: "translateZ(15px)" }}
        >
          [{ach.event}]
        </h4>

        <p 
          className="text-xs text-slate-400 font-sans leading-relaxed mb-6"
          style={{ transform: "translateZ(12px)" }}
        >
          {ach.description}
        </p>
      </div>

      {/* Title Effects Buff Section */}
      <div 
        className="border-t border-monarch-blue/10 pt-4 mt-auto"
        style={{ transform: "translateZ(15px)" }}
      >
        <span className="font-mono text-[9px] text-slate-500 tracking-widest block mb-2 uppercase">
          ACTIVE TITLE BUFFS:
        </span>
        <ul className="space-y-1">
          {ach.effects.map((eff, index) => (
            <li key={index} className="flex items-start gap-1.5 font-mono text-[10px] text-green-400">
              <Star className="h-3 w-3 fill-green-400/20 text-green-400 mt-0.5 shrink-0" />
              <span>{eff}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
