"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Abilities from "@/components/Abilities";
import Dungeons from "@/components/Dungeons";
import Achievements from "@/components/Achievements";
import JoinGuild from "@/components/JoinGuild";
import MusicPlayer from "@/components/MusicPlayer";
import SmoothScroll from "@/components/SmoothScroll";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import 3D Canvas Scene with SSR disabled to prevent server rendering crashes
const Monarch3DScene = dynamic(() => import("@/components/Monarch3DScene"), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Disable browser scroll while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative min-h-screen flex flex-col"
        >
          {/* Custom interactive cursor */}
          <Cursor />

          {/* Smooth scrolling physics */}
          <SmoothScroll />

          {/* Dynamic 3D WebGL background */}
          <Monarch3DScene />

          {/* Floating background theme controller */}
          <MusicPlayer />

          {/* Top HUD navigation status bar */}
          <Navbar />

          {/* Core system widgets */}
          {/* pointer-events-none lets scroll pass down to the Canvas layers easily */}
          <main className="flex-grow pointer-events-none relative z-10">
            <Hero />
            <AboutMe />
            <Abilities />
            <Dungeons />
            <Achievements />
            <JoinGuild />
          </main>

          {/* System Footer */}
          <footer className="bg-[#030105] border-t border-monarch-purple/10 py-8 text-center text-xs font-mono text-slate-500 relative z-10 select-none pointer-events-none">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
              <span>SYSTEM LEVEL: MAX (LV.99) • ACTIVE CORE MATRIX</span>
              <span>© {new Date().getFullYear()} PRIYAN I. ALL RIGHTS SECURED BY THE SHADOW MONARCH.</span>
            </div>
          </footer>
        </motion.div>
      )}
    </>
  );
}
