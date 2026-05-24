"use client";

import { useRef, useState, MouseEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { User, MapPin, GraduationCap, Code2, Cpu } from "lucide-react";
import { useSound } from "@/hooks/useSound";

export default function AboutMe() {
  const { play } = useSound();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 3D Scroll Perspective
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [12, 0, 0, -12]);
  const translateZ = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [-80, 0, 0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  // 3D Card Hover Tilt State (Notice Card)
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

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

    // Rotate up to 8 degrees
    const rX = ((centerY - y) / centerY) * 8;
    const rY = ((x - centerX) / centerX) * 8;

    setTiltX(rX);
    setTiltY(rY);
  };

  const handleMouseLeave = () => {
    setTiltX(0);
    setTiltY(0);
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative py-24 md:py-32 bg-transparent border-t border-monarch-purple/5 overflow-hidden style-3d-perspective"
      style={{ perspective: "1200px" }}
    >
      {/* Decorative cyber grid mask */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(157,78,221,0.05),transparent_40%)] pointer-events-none" />

      <motion.div
        style={{
          rotateX,
          translateZ,
          opacity,
          transformStyle: "preserve-3d",
        }}
        className="max-w-6xl mx-auto px-4 relative z-10 pointer-events-auto"
      >
        {/* Section Heading */}
        <div className="mb-12 md:mb-16 text-center">
          <span className="font-mono text-xs text-monarch-purple tracking-[0.3em] uppercase block mb-2">
            HUNTER LOGS
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold tracking-widest text-glow-purple text-monarch-purple">
            AWAKENED STATUS
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-monarch-purple to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Solo Leveling System Notice Popup Box - Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* System Window Card with 3D Tilt */}
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
              className="cyber-border-purple rounded-lg overflow-hidden p-6 md:p-8 flex flex-col relative transform-style-3d shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
            >
              {/* Header Tab */}
              <div 
                className="absolute top-0 right-8 bg-monarch-purple/10 border-b border-x border-monarch-purple/40 px-3 py-1 font-mono text-[9px] tracking-widest text-monarch-purple"
                style={{ transform: "translateZ(30px)" }}
              >
                NOTICE
              </div>

              {/* Holographic grid lines inside */}
              <div className="corner-decor corner-decor-tl" />
              <div className="corner-decor corner-decor-tr" />
              <div className="corner-decor corner-decor-bl" />
              <div className="corner-decor corner-decor-br" />

              <h3 
                className="font-orbitron text-glow-purple text-monarch-purple font-bold tracking-wider text-lg mb-6 flex items-center gap-2"
                style={{ transform: "translateZ(20px)" }}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-monarch-purple animate-pulse" />
                SYSTEM NOTIFICATION
              </h3>

              <div 
                className="font-rajdhani text-lg md:text-xl text-slate-200 leading-relaxed tracking-wide font-medium space-y-4 mb-6"
                style={{ transform: "translateZ(15px)" }}
              >
                <p>
                  &ldquo;B.Tech Artificial Intelligence &amp; Data Science undergraduate passionate about building futuristic AI systems, immersive web experiences, and intelligent IoT solutions.&rdquo;
                </p>
                <p className="text-slate-400 text-sm md:text-base font-sans font-normal leading-relaxed">
                  Experienced in developing AI-powered projects, browser-based applications, and hardware-integrated solutions using Python, HTML/CSS, JavaScript, Arduino, and Raspberry Pi. National-level hackathon award winner with strong presentation, problem-solving, and innovation skills.
                </p>
              </div>

              {/* Status footer detail */}
              <div 
                className="mt-auto border-t border-monarch-purple/10 pt-4 flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-slate-500"
                style={{ transform: "translateZ(10px)" }}
              >
                <span>[GATE TYPE: DEVELOPMENT DECREE]</span>
                <span>STATUS: LEVELING IN PROGRESS</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Recruiter-friendly Stat/Affiliation Panel - Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
              {[
                {
                  icon: <User className="h-5 w-5 text-monarch-blue" />,
                  title: "CODENAME",
                  value: "Priyan I",
                  desc: "AI & Web Developer",
                },
                {
                  icon: <MapPin className="h-5 w-5 text-monarch-blue" />,
                  title: "AFFILIATION",
                  value: "DSU Guild",
                  desc: "Dhanalakshmi Srinivasan Univ",
                },
                {
                  icon: <GraduationCap className="h-5 w-5 text-monarch-blue" />,
                  title: "EDUCATION",
                  value: "B.Tech (2025 - 2029)",
                  desc: "CGPA: 8.29 / 10.0 (AI & DS)",
                },
                {
                  icon: <Code2 className="h-5 w-5 text-monarch-blue" />,
                  title: "EXPERIENCE",
                  value: "System Innovator",
                  desc: "IoT, AI & Full-stack",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  onMouseEnter={() => play("hover")}
                  whileHover={{ scale: 1.03, translateZ: 15 }}
                  className="cyber-border-blue rounded-lg p-5 flex flex-col justify-between group transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded bg-monarch-blue/5 border border-monarch-blue/20">
                      {stat.icon}
                    </div>
                    <span className="font-mono text-[9px] tracking-widest text-slate-500 group-hover:text-monarch-blue transition-colors">
                      STAT_0{i + 1}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 tracking-wider block mb-1">
                      {stat.title}
                    </span>
                    <h4 className="font-orbitron font-bold text-slate-200 tracking-wide group-hover:text-monarch-blue transition-colors text-sm">
                      {stat.value}
                    </h4>
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      {stat.desc}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Special Monarch Buff box */}
              <motion.div
                onMouseEnter={() => play("hover")}
                whileHover={{ scale: 1.02 }}
                className="col-span-1 sm:col-span-2 border border-monarch-purple/10 bg-[#120e1e]/40 rounded-lg p-5 flex items-center gap-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(157,78,221,0.02)_50%,transparent_75%)] bg-[length:250px_250px] animate-auraflow pointer-events-none" />
                <div className="p-3 rounded bg-monarch-purple/10 border border-monarch-purple/30">
                  <Cpu className="h-6 w-6 text-monarch-purple drop-shadow-[0_0_8px_#9d4edd]" />
                </div>
                <div>
                  <h4 className="font-orbitron font-bold text-glow-purple text-monarch-purple text-xs tracking-wider mb-1">
                    ACTIVE BUFF: MONARCH SYSTEM ENGINE
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    Increases learning efficiency by 200%. Enhances full-stack coding agility and grants extreme precision in Prompt Engineering tasks.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
