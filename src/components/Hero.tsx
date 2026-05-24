"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Swords, ShieldAlert, Cpu, Award, Navigation } from "lucide-react";
import { useSound } from "@/hooks/useSound";

export default function Hero() {
  const { play } = useSound();
  
  // Typewriter effect
  const words = ["Web Developer", "AI & Data Science", "IoT Innovator", "System Master"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Fluctuating system load diagnostics for HUD aesthetics
  const [cpu, setCpu] = useState(74);
  const [ram, setRam] = useState(62);
  const [ping, setPing] = useState(12);

  useEffect(() => {
    const statsTimer = setInterval(() => {
      setCpu(Math.floor(Math.random() * 14) + 70); // 70-84%
      setRam(Math.floor(Math.random() * 5) + 60);  // 60-64%
      setPing(Math.floor(Math.random() * 6) + 9);   // 9-15ms
    }, 2000);
    return () => clearInterval(statsTimer);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && displayText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timer = setTimeout(() => {
        setDisplayText(
          isDeleting
            ? currentWord.substring(0, displayText.length - 1)
            : currentWord.substring(0, displayText.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex]);

  const handleNav = (id: string) => {
    play("portal");
    // Dispatch scroll event caught by Lenis smooth scroll provider
    window.dispatchEvent(new CustomEvent("monarch-scroll-to", { detail: id }));
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-transparent"
    >
      {/* Grid Overlay background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(157,78,221,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(157,78,221,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0" />

      {/* FLOATING LEFT DIAGNOSTIC HUD - Translucent Cybernetic Panel */}
      <div className="fixed left-8 top-1/3 z-20 hidden xl:flex flex-col gap-6 font-mono text-[10px] text-slate-500 border-l border-monarch-blue/20 pl-4 py-4 backdrop-blur-sm bg-slate-950/10 rounded-r pointer-events-none select-none max-w-[170px] transition-all duration-300">
        <div className="flex items-center gap-1.5 text-monarch-blue font-bold tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-monarch-blue animate-pulse" />
          <span>[DIAGNOSTICS]</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span>SYS_CORE:</span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>
          <div className="flex justify-between">
            <span>PING:</span>
            <span className="text-slate-300">{ping}ms</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <div className="flex justify-between text-[9px] mb-0.5">
              <span>CPU_LOAD:</span>
              <span className="text-monarch-blue">{cpu}%</span>
            </div>
            <div className="w-24 bg-slate-900 h-1 rounded-full overflow-hidden">
              <div className="bg-monarch-blue h-full transition-all duration-500" style={{ width: `${cpu}%` }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-[9px] mb-0.5">
              <span>RAM_USED:</span>
              <span className="text-monarch-purple">{ram}%</span>
            </div>
            <div className="w-24 bg-slate-900 h-1 rounded-full overflow-hidden">
              <div className="bg-monarch-purple h-full transition-all duration-500" style={{ width: `${ram}%` }} />
            </div>
          </div>
        </div>

        <div className="text-[9px] text-slate-600 flex flex-col gap-0.5">
          <span>LOC: 37°33'N 126°58'E</span>
          <span>NET: SECURE_CORE_S9</span>
          <span>NODE: MNCH_SRVR_99</span>
        </div>
      </div>

      {/* FLOATING RIGHT OBJECTIVES HUD - Translucent Quest Tracker */}
      <div className="fixed right-8 top-1/3 z-20 hidden xl:flex flex-col gap-6 font-mono text-[10px] text-slate-500 border-r border-monarch-purple/20 pr-4 py-4 text-right backdrop-blur-sm bg-slate-950/10 rounded-l pointer-events-none select-none max-w-[170px] transition-all duration-300">
        <div className="flex items-center justify-end gap-1.5 text-monarch-purple font-bold tracking-wider">
          <span>[MISSION_LOG]</span>
          <span className="h-1.5 w-1.5 rounded-full bg-monarch-purple animate-pulse" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between gap-4">
            <span>RANK:</span>
            <span className="text-yellow-500 font-bold">S-RANK</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>LEVEL:</span>
            <span className="text-slate-300">99 (MAX)</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-glow-purple text-monarch-purple font-semibold text-[9px]">ACTIVE QUESTS:</div>
          <div className="flex flex-col gap-1 text-[9px] text-slate-400">
            <div>• EXPLORE DUNGEONS</div>
            <div>• SCAN SKILL MATRIX</div>
            <div>• ENGAGE RECRUITER</div>
          </div>
        </div>

        <div className="text-[9px] text-slate-600 flex flex-col gap-0.5">
          <span>PARTY: SOLITARY_HUNTER</span>
          <span>SUB_CLASS: DATA_LORD</span>
          <span>STATE: MAX_AWAKENED</span>
        </div>
      </div>

      {/* Hero Content - pointer-events-auto enables user interactions */}
      <div className="relative max-w-5xl mx-auto px-4 z-10 text-center flex flex-col items-center pointer-events-auto">
        
        {/* Holographic Notification Crest */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded border border-monarch-blue/20 bg-monarch-blue/5 text-[10px] md:text-xs font-mono tracking-widest text-monarch-blue uppercase mb-8 shadow-[0_0_15px_rgba(0,240,255,0.08)] backdrop-blur-md relative overflow-hidden"
        >
          {/* Subtle scanning laser line inside target badge */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-monarch-blue/40 animate-pulse" />
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>[SYSTEM: SHADOW MONARCH ACTIVE STATUS]</span>
        </motion.div>

        {/* Cinematic Primary Title Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-4 relative px-8 py-4"
        >
          {/* Cyber layout brackets hugging the name */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-slate-600/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-slate-600/30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-slate-600/30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-slate-600/30" />

          <h1 className="font-orbitron text-6xl md:text-8xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 filter drop-shadow-[0_0_20px_rgba(157,78,221,0.25)]">
            PRIYAN I
          </h1>
        </motion.div>

        {/* Secondary Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-rajdhani text-glow-blue text-monarch-blue text-lg md:text-2xl font-bold tracking-[0.25em] uppercase mb-6"
        >
          AI & Data Science Engineer
        </motion.h2>

        {/* Dynamic Typewriter Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-8 md:h-12 flex items-center justify-center font-mono text-sm md:text-lg text-slate-400 mb-12"
        >
          <span className="text-white border-r-2 border-monarch-purple pr-1 animate-pulse">
            {displayText}
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
        >
          {/* Main Solid CTA */}
          <button
            onClick={() => handleNav("dungeons")}
            onMouseEnter={() => play("hover")}
            className="group relative w-full sm:w-48 px-6 py-3.5 font-orbitron font-bold text-xs tracking-widest text-[#05010a] rounded overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.55)] cursor-pointer"
          >
            {/* Base Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-monarch-blue to-cyan-400 group-hover:scale-105 transition-transform duration-300" />
            
            {/* Animated Laser shine sweep */}
            <div className="absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 animate-shine pointer-events-none" />

            <span className="relative z-10 flex items-center justify-center gap-2">
              <Swords className="h-4 w-4" />
              ENTER DUNGEON
            </span>
          </button>

          {/* Border Outline CTA */}
          <button
            onClick={() => handleNav("contact")}
            onMouseEnter={() => play("hover")}
            className="group relative w-full sm:w-48 px-6 py-3.5 font-orbitron font-bold text-xs tracking-widest text-monarch-purple border border-monarch-purple/45 rounded bg-monarch-purple/5 hover:bg-monarch-purple/15 transition-all duration-300 hover:shadow-[0_0_20px_rgba(157,78,221,0.25)] cursor-pointer overflow-hidden"
          >
            {/* Animated Laser shine sweep */}
            <div className="absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-monarch-purple/20 to-transparent skew-x-12 animate-shine pointer-events-none" />

            <span className="relative z-10 flex items-center justify-center gap-2">
              <Terminal className="h-4 w-4" />
              JOIN THE GUILD
            </span>
          </button>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity duration-300">
        <span className="font-mono text-[9px] tracking-widest text-slate-500">SCROLL DOWN</span>
        <div className="h-10 w-[1px] bg-gradient-to-b from-monarch-purple to-transparent animate-pulse" />
      </div>
    </section>
  );
}
