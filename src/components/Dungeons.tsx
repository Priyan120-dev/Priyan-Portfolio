"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FolderGit2, ExternalLink, ShieldCheck, CheckCircle2, RotateCcw } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import confetti from "canvas-confetti";

interface Project {
  title: string;
  rank: string;
  rankColor: string;
  description: string;
  tech: string[];
  link: string;
  difficulty: string;
  rewards: string[];
}

export default function Dungeons() {
  const { play } = useSound();
  const [activeTab, setActiveTab] = useState<"projects" | "quest">("projects");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 3D Scroll Perspective
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateXScroll = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [10, 0, 0, -10]);
  const translateZScroll = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [-60, 0, 0, -60]);
  const opacityScroll = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  const projects: Project[] = [
    {
      title: "AdaptIQ",
      rank: "S-Rank",
      rankColor: "#9d4edd",
      description: "An AI-powered adaptive learning system for B.Tech students that customizes curriculum flow and difficulty based on user performance profiles to maximize retention.",
      tech: ["Python", "Generative AI", "NLP", "Adaptive Systems"],
      link: "https://github.com/Priyan-I",
      difficulty: "Hard (Level 80 Dungeon)",
      rewards: ["Intelligent Persona Engine", "Syllabus Shape Customizer"]
    },
    {
      title: "PhishSight",
      rank: "S-Rank",
      rankColor: "#e63946",
      description: "A Python-based URL security scanner that detects phishing attempts using regex pattern matching and heuristics, drastically reducing false-negative detection rates.",
      tech: ["Python", "Pattern Matching", "Heuristics", "Cybersecurity"],
      link: "https://github.com/Priyan-I",
      difficulty: "Elite (Level 90 Dungeon)",
      rewards: ["Heuristics Scanner Model", "Malicious URL Interceptor"]
    },
    {
      title: "Smart Child Safety Monitoring",
      rank: "A-Rank",
      rankColor: "#ffb703",
      description: "A child safety tracking system built on Arduino and Raspberry Pi sensor pipelines that detects danger triggers and sends automated SMS alerts to parents.",
      tech: ["Arduino", "Raspberry Pi", "Sensor Integration", "SMS Alerts"],
      link: "https://github.com/Priyan-I",
      difficulty: "Hard (Level 75 Dungeon)",
      rewards: ["Real-time Tracking Pipeline", "Automated SMS Broadcast"]
    },
    {
      title: "Vaccine Cold Chain Monitoring",
      rank: "A-Rank",
      rankColor: "#ffb703",
      description: "An IoT box developed with Raspberry Pi that monitors temperature in real time to secure vaccine cold-chain integrity and prevent spoilage with automated warnings.",
      tech: ["Raspberry Pi", "Sensor Integration", "Real-time Systems", "Python"],
      link: "https://github.com/Priyan-I",
      difficulty: "Hard (Level 78 Dungeon)",
      rewards: ["Thermal Telemetry Monitor", "Low-latency Alarm Engine"]
    },
    {
      title: "Mini Browser Games Suite",
      rank: "B-Rank",
      rankColor: "#00f0ff",
      description: "A responsive portal containing 3+ retro web games built from scratch using pure vanilla HTML, CSS, and JS, featuring score tracking and responsive mobile sizing.",
      tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
      link: "https://creative-showcase--priyaniyappan12.replit.app",
      difficulty: "Normal (Level 45 Dungeon)",
      rewards: ["Vanilla DOM Game State Engine", "Cross-device Responsiveness"]
    }
  ];

  // Daily Quest Minigame State
  const initialCards = [
    { id: 1, type: "shadow", symbol: "⚔️", matched: false, flipped: false },
    { id: 2, type: "shadow", symbol: "⚔️", matched: false, flipped: false },
    { id: 3, type: "monarch", symbol: "👑", matched: false, flipped: false },
    { id: 4, type: "monarch", symbol: "👑", matched: false, flipped: false },
    { id: 5, type: "portal", symbol: "🌀", matched: false, flipped: false },
    { id: 6, type: "portal", symbol: "🌀", matched: false, flipped: false },
    { id: 7, type: "hunter", symbol: "🏹", matched: false, flipped: false },
    { id: 8, type: "hunter", symbol: "🏹", matched: false, flipped: false },
    { id: 9, type: "crest", symbol: "🛡️", matched: false, flipped: false },
    { id: 10, type: "crest", symbol: "🛡️", matched: false, flipped: false },
    { id: 11, type: "magic", symbol: "🔮", matched: false, flipped: false },
    { id: 12, type: "magic", symbol: "🔮", matched: false, flipped: false },
  ];

  const [cards, setCards] = useState(initialCards);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [questCleared, setQuestCleared] = useState(false);
  const [moves, setMoves] = useState(0);

  const shuffleCards = () => {
    play("portal");
    const shuffled = [...initialCards]
      .sort(() => Math.random() - 0.5)
      .map((card, idx) => ({ ...card, id: idx }));
    setCards(shuffled);
    setSelectedCards([]);
    setQuestCleared(false);
    setMoves(0);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  const handleCardClick = (id: number) => {
    if (
      cards[id].matched ||
      cards[id].flipped ||
      selectedCards.length >= 2 ||
      questCleared
    )
      return;

    play("click");
    const updatedCards = [...cards];
    updatedCards[id].flipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = newSelected;

      if (cards[firstIdx].type === cards[secondIdx].type) {
        setTimeout(() => {
          const matchedCards = updatedCards.map((c, i) => {
            if (i === firstIdx || i === secondIdx) {
              return { ...c, matched: true };
            }
            return c;
          });
          setCards(matchedCards);
          setSelectedCards([]);
          play("success");

          if (matchedCards.every((c) => c.matched)) {
            triggerQuestClear();
          }
        }, 400);
      } else {
        setTimeout(() => {
          const revertedCards = updatedCards.map((c, i) => {
            if (i === firstIdx || i === secondIdx) {
              return { ...c, flipped: false };
            }
            return c;
          });
          setCards(revertedCards);
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const triggerQuestClear = () => {
    setQuestCleared(true);
    play("levelUp");

    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#9d4edd", "#00f0ff"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#9d4edd", "#00f0ff"],
      });
    }, 250);
  };

  const handleTabChange = (tab: "projects" | "quest") => {
    play("click");
    setActiveTab(tab);
    if (tab === "quest") {
      shuffleCards();
    }
  };

  return (
    <section
      id="dungeons"
      ref={containerRef}
      className="relative py-24 md:py-32 bg-transparent border-t border-monarch-purple/5 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,240,255,0.03),transparent_40%)] pointer-events-none" />

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
        <div className="mb-12 text-center">
          <span className="font-mono text-xs text-monarch-purple tracking-[0.3em] uppercase block mb-2">
            DUNGEONS EXPLORED
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold tracking-widest text-glow-purple text-monarch-purple">
            DUNGEONS CLEARED
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-monarch-purple to-transparent mx-auto mt-4" />
        </div>

        {/* HUD Subtabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded border border-monarch-purple/20 bg-slate-900/40 p-1 font-rajdhani text-sm font-semibold tracking-wider">
            <button
              onClick={() => handleTabChange("projects")}
              className={`px-6 py-2 rounded transition-colors ${
                activeTab === "projects"
                  ? "bg-monarch-purple text-slate-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              [CLEAR RECORDS]
            </button>
            <button
              onClick={() => handleTabChange("quest")}
              className={`px-6 py-2 rounded transition-colors ${
                activeTab === "quest"
                  ? "bg-monarch-blue text-slate-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              [DAILY QUEST]
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "projects" ? (
            // Projects Grid with 3D Tilt Cards
            <motion.div
              key="projects-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, i) => (
                <ProjectCard key={i} project={project} play={play} />
              ))}
            </motion.div>
          ) : (
            // Daily Quest Minigame Widget
            <motion.div
              key="quest-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto border border-monarch-blue/20 bg-[#120e1e]/60 rounded-lg p-6 relative shadow-[0_15px_35px_rgba(0,0,0,0.4)] transform-style-3d"
            >
              <div className="corner-decor corner-decor-tl" />
              <div className="corner-decor corner-decor-tr" />
              <div className="corner-decor corner-decor-bl" />
              <div className="corner-decor corner-decor-br" />

              {/* Game HUD Header */}
              <div className="flex items-center justify-between border-b border-monarch-blue/10 pb-4 mb-6 flex-wrap gap-4">
                <div>
                  <span className="font-mono text-[9px] text-slate-500 block">DAILY SYSTEM QUEST</span>
                  <h3 className="font-orbitron text-glow-blue text-monarch-blue font-bold tracking-widest text-base">
                    QUEST: MEMORY GATE OVERLOAD
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs text-slate-400">
                    STATUS:{" "}
                    {questCleared ? (
                      <span className="text-green-400 font-bold animate-pulse text-glow-green">[CLEARED]</span>
                    ) : (
                      <span className="text-yellow-500 font-bold animate-pulse">[IN PROGRESS]</span>
                    )}
                  </div>
                  {questCleared && <ShieldCheck className="h-4 w-4 text-green-400" />}
                </div>
              </div>

              <p className="text-xs font-mono text-slate-400 leading-relaxed mb-6">
                Objective: Match the memory runes in minimal operations to restore system parameters.
                <br />
                System Moves Logged: <span className="text-monarch-blue font-bold">{moves}</span>
              </p>

              {/* Card Grid */}
              <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto mb-6">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="relative aspect-square cursor-pointer select-none"
                  >
                    <div
                      className="absolute inset-0 w-full h-full transition-transform duration-500 transform-style-3d rounded border"
                      style={{
                        transform: card.flipped || card.matched ? "rotateY(180deg)" : "rotateY(0deg)",
                        borderColor: card.matched
                          ? "rgba(34, 197, 94, 0.4)"
                          : card.flipped
                          ? "rgba(0, 240, 255, 0.4)"
                          : "rgba(157, 78, 221, 0.2)",
                        backgroundColor: card.matched
                          ? "rgba(34, 197, 94, 0.05)"
                          : card.flipped
                          ? "rgba(0, 240, 255, 0.05)"
                          : "rgba(10, 5, 20, 0.8)",
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center backface-hidden font-orbitron text-monarch-purple text-glow-purple font-black text-xl">
                        ?
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center backface-hidden transform rotateY(180deg) text-2xl">
                        {card.symbol}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Game status button */}
              <div className="flex flex-col items-center justify-center mt-6">
                {questCleared ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center p-4 border border-green-500/20 bg-green-500/5 rounded-md max-w-sm w-full"
                  >
                    <CheckCircle2 className="h-8 w-8 text-green-400 mb-2 drop-shadow-[0_0_6px_#4ade80]" />
                    <h4 className="font-orbitron font-bold text-green-400 text-sm tracking-wider mb-1">
                      DAILY QUEST COMPLETED!
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mb-4">
                      Rewards: +500 Mana, Dev Stamina Restored, Recruiter Admiration Unlocked.
                    </p>
                    <button
                      onClick={shuffleCards}
                      className="flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] text-slate-950 font-bold bg-green-400 hover:bg-green-300 rounded transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      PLAY AGAIN
                    </button>
                  </motion.div>
                ) : (
                  <button
                    onClick={shuffleCards}
                    className="flex items-center gap-1.5 px-4 py-2 border border-slate-700 bg-slate-900/40 hover:bg-slate-900 text-slate-300 rounded font-mono text-[10px] tracking-wider transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    REINITIALIZE GRID
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

// Local 3D Hover Tilt ProjectCard Sub-component
function ProjectCard({ project, play }: { project: Project; play: any }) {
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
      className="cyber-border-purple rounded-lg p-6 flex flex-col justify-between h-full group transform-style-3d shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
    >
      <div className="corner-decor corner-decor-tl" />
      <div className="corner-decor corner-decor-tr" />
      <div className="corner-decor corner-decor-bl" />
      <div className="corner-decor corner-decor-br" />

      {/* Header info */}
      <div>
        <div 
          className="flex items-center justify-between mb-4"
          style={{ transform: "translateZ(25px)" }}
        >
          <div className="p-2 rounded bg-monarch-purple/10 border border-monarch-purple/30 text-monarch-purple">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-orbitron font-bold tracking-wider"
            style={{
              backgroundColor: `${project.rankColor}15`,
              color: project.rankColor,
              border: `1px solid ${project.rankColor}30`,
            }}
          >
            {project.rank}
          </span>
        </div>

        <h3 
          className="font-orbitron font-bold text-slate-100 group-hover:text-monarch-purple transition-colors text-base tracking-wide mb-2"
          style={{ transform: "translateZ(20px)" }}
        >
          {project.title}
        </h3>
        <p 
          className="text-xs text-slate-400 font-sans leading-relaxed min-h-[72px]"
          style={{ transform: "translateZ(10px)" }}
        >
          {project.description}
        </p>
      </div>

      {/* Additional HUD Details */}
      <div 
        className="border-t border-monarch-purple/10 pt-4 mt-auto"
        style={{ transform: "translateZ(15px)" }}
      >
        <div className="mb-3 text-[10px] font-mono text-slate-500">
          <div className="flex justify-between mb-1">
            <span>DIFFICULTY:</span>
            <span className="text-slate-300">{project.difficulty}</span>
          </div>
          <div>
            <span>REWARDS:</span>
            <ul className="list-disc pl-3 text-slate-400 mt-0.5 space-y-0.5">
              {project.rewards.map((rew, idx) => (
                <li key={idx}>{rew}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-900 text-slate-400 border border-slate-800"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Live Preview */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => play("click")}
          className="inline-flex items-center gap-1.5 font-rajdhani font-semibold text-xs tracking-wider text-monarch-purple hover:text-white transition-colors"
        >
          <span>[ENTER GATEWAY]</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
