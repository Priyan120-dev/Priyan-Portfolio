"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Music4 } from "lucide-react";
import { useSound } from "@/hooks/useSound";

export default function MusicPlayer() {
  const { muted, toggleMute } = useSound();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio element on mount
  useEffect(() => {
    const audio = new Audio("/assets/solo_leveling_theme.mp3");
    audio.loop = true;
    audio.volume = 0.12; // low, non-intrusive volume
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sync playback with global muted state and recruiter mode
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const isRecruiter = document.documentElement.classList.contains("recruiter-mode");

    const syncPlayState = async () => {
      if (muted || isRecruiter) {
        if (!audio.paused) {
          audio.pause();
          setIsPlaying(false);
        }
      } else {
        if (audio.paused) {
          try {
            await audio.play();
            setIsPlaying(true);
          } catch (err) {
            console.warn("Autoplay blocked or audio context suspended. Click button to unlock.", err);
            setIsPlaying(false);
          }
        }
      }
    };

    // Delay slightly to ensure browser events hook up
    const timer = setTimeout(syncPlayState, 100);

    // Watch for recruiter mode changes
    const observer = new MutationObserver(() => {
      syncPlayState();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [muted]);

  const handleToggle = () => {
    // Toggles the global sound engine mute state
    toggleMute();
  };

  const isRecruiter = typeof document !== "undefined" && document.documentElement.classList.contains("recruiter-mode");
  if (isRecruiter) return null; // Don't show music player HUD in recruiter mode

  return (
    <div className="fixed bottom-6 right-6 z-50 no-recruiter select-none">
      <button
        onClick={handleToggle}
        className={`group relative flex items-center justify-center h-12 w-12 rounded-full border transition-all duration-300 backdrop-blur-md cursor-pointer ${
          isPlaying
            ? "border-monarch-blue/40 bg-monarch-blue/5 shadow-[0_0_15px_rgba(0,240,255,0.2)] text-monarch-blue hover:border-monarch-blue/60"
            : "border-monarch-purple/30 bg-monarch-purple/5 shadow-[0_0_10px_rgba(157,78,221,0.05)] text-monarch-purple hover:border-monarch-purple/50"
        }`}
        title={isPlaying ? "Mute Background Theme" : "Play Background Theme"}
      >
        {/* Holographic borders */}
        <div className="absolute inset-0 rounded-full border border-dashed border-monarch-blue/10 animate-spin-slow" />

        {/* Animated Equalizer Waveform / Static Icon */}
        {isPlaying ? (
          <div className="flex items-end gap-[3px] h-4">
            <div className="w-[2px] bg-monarch-blue rounded-full equalizer-bar-1" style={{ height: "4px" }} />
            <div className="w-[2px] bg-monarch-blue rounded-full equalizer-bar-2" style={{ height: "8px" }} />
            <div className="w-[2px] bg-monarch-blue rounded-full equalizer-bar-3" style={{ height: "6px" }} />
            <div className="w-[2px] bg-monarch-blue rounded-full equalizer-bar-4" style={{ height: "10px" }} />
          </div>
        ) : (
          <Music className="h-5 w-5 transition-transform group-hover:scale-110" />
        )}

        {/* Animated Radar Pulse ring */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full border border-monarch-blue/30 animate-ping opacity-25" />
        )}
      </button>
    </div>
  );
}
