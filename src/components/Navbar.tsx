"use client";

import { useEffect, useState } from "react";
import { Shield, Volume2, VolumeX, Briefcase, Eye } from "lucide-react";
import { useSound } from "@/hooks/useSound";

export default function Navbar() {
  const { muted, toggleMute, play } = useSound();
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  // Synchronize Recruiter Mode from HTML class on mount
  useEffect(() => {
    const storedRecruiter = localStorage.getItem("monarch-recruiter-mode");
    if (storedRecruiter === "true") {
      setRecruiterMode(true);
      document.documentElement.classList.add("recruiter-mode");
    }

    // Scroll spy to update active HUD tab
    const handleScroll = () => {
      const sections = ["hero", "about", "abilities", "dungeons", "achievements", "contact"];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleRecruiterMode = () => {
    const nextMode = !recruiterMode;
    setRecruiterMode(nextMode);
    play("click");

    if (nextMode) {
      document.documentElement.classList.add("recruiter-mode");
      localStorage.setItem("monarch-recruiter-mode", "true");
    } else {
      document.documentElement.classList.remove("recruiter-mode");
      localStorage.setItem("monarch-recruiter-mode", "false");
    }
  };

  const handleNavClick = (sectionId: string) => {
    play("click");
    // Dispatch a custom event caught by the Lenis smooth scroll handler
    window.dispatchEvent(new CustomEvent("monarch-scroll-to", { detail: sectionId }));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#05010a]/80 backdrop-blur-md border-b border-monarch-purple/10 px-4 md:px-8 py-3 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Monarch Status HUD Left */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <Shield className="h-6 w-6 text-monarch-blue group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_5px_#00f0ff]" />
            <div className="font-orbitron font-bold text-sm tracking-wider text-glow-blue text-monarch-blue">
              PRIYAN I <span className="text-slate-500 font-sans text-xs">LV.99</span>
            </div>
          </div>

          {/* HUD Status Bars */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono ml-4">
            {/* HP Bar */}
            <div className="flex flex-col w-20 md:w-28">
              <div className="flex justify-between text-[9px] mb-[2px]">
                <span className="text-red-400">HP</span>
                <span className="text-slate-300">100%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-sm overflow-hidden p-[1px]">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-sm" style={{ width: "100%" }} />
              </div>
            </div>

            {/* MP Bar */}
            <div className="flex flex-col w-20 md:w-28">
              <div className="flex justify-between text-[9px] mb-[2px]">
                <span className="text-monarch-blue">MP</span>
                <span className="text-slate-300">100%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-sm overflow-hidden p-[1px]">
                <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-sm" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* HUD Navigation Middle */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar font-rajdhani font-semibold text-xs tracking-wider">
          {[
            { id: "about", label: "STATUS" },
            { id: "abilities", label: "ABILITIES" },
            { id: "dungeons", label: "DUNGEONS" },
            { id: "achievements", label: "TITLES" },
            { id: "contact", label: "GUILD" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-1.5 rounded transition-all duration-300 border ${
                activeTab === item.id
                  ? "border-monarch-purple/40 bg-monarch-purple/10 text-monarch-purple text-glow-purple"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              [{item.label}]
            </button>
          ))}
        </div>

        {/* System Settings Right */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Audio controller */}
          <button
            onClick={toggleMute}
            onMouseEnter={() => play("hover")}
            className={`p-2 rounded border transition-all duration-300 ${
              !muted
                ? "border-monarch-blue/40 bg-monarch-blue/5 text-monarch-blue shadow-[0_0_8px_rgba(0,240,255,0.1)]"
                : "border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900/40"
            }`}
            title={muted ? "Enable Audio Feedback" : "Mute Sound"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Recruiter Mode Toggle */}
          <button
            onClick={toggleRecruiterMode}
            onMouseEnter={() => play("hover")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-all duration-300 ${
              recruiterMode
                ? "border-green-500/50 bg-green-500/10 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.15)]"
                : "border-monarch-purple/30 bg-monarch-purple/5 text-slate-300 hover:text-white hover:border-monarch-purple/50"
            }`}
            title={recruiterMode ? "Switch back to Shadow HUD" : "Switch to recruiter-friendly UI"}
          >
            {recruiterMode ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>[AURA MODE]</span>
              </>
            ) : (
              <>
                <Briefcase className="h-3.5 w-3.5" />
                <span>[RECRUITER MODE]</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
