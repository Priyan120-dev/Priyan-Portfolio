"use client";

import { useEffect, useState } from "react";

let currentMutedState = true; // Sync for global status across hooks

export function useSound() {
  const [muted, setMuted] = useState<boolean>(true);

  // Initialize and synchronize state
  useEffect(() => {
    const storedMute = localStorage.getItem("monarch-sound-muted");
    const initialMuted = storedMute !== null ? storedMute === "true" : true;
    setMuted(initialMuted);
    currentMutedState = initialMuted;

    // Listen for global mute events dispatched by other hook instances
    const handleMuteChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setMuted(customEvent.detail);
      currentMutedState = customEvent.detail;
    };

    window.addEventListener("monarch-mute-change", handleMuteChange);
    return () => {
      window.removeEventListener("monarch-mute-change", handleMuteChange);
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    currentMutedState = nextMuted;
    localStorage.setItem("monarch-sound-muted", String(nextMuted));

    // Dispatch global event so all useSound hook instances synchronize state
    window.dispatchEvent(new CustomEvent("monarch-mute-change", { detail: nextMuted }));

    if (!nextMuted) {
      setTimeout(() => {
        playSynthSound("unmute");
      }, 50);
    }
  };

  const playSynthSound = (type: "hover" | "click" | "levelUp" | "unmute" | "portal" | "success") => {
    const isRecruiter = document.documentElement.classList.contains("recruiter-mode");
    if (currentMutedState || isRecruiter) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      if (type === "hover") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.setValueAtTime(800, ctx.currentTime + 0.01);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === "unmute") {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.06);
          gain.gain.setValueAtTime(0.03, ctx.currentTime + index * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.06 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + index * 0.06);
          osc.stop(ctx.currentTime + index * 0.06 + 0.15);
        });
      } else if (type === "levelUp") {
        const baseTime = ctx.currentTime;
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = "triangle";
        subOsc.frequency.setValueAtTime(150, baseTime);
        subOsc.frequency.exponentialRampToValueAtTime(50, baseTime + 0.6);
        subGain.gain.setValueAtTime(0.2, baseTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, baseTime + 0.6);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(baseTime);
        subOsc.stop(baseTime + 0.6);

        const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
        arpeggio.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, baseTime + idx * 0.05);
          gain.gain.setValueAtTime(0.05, baseTime + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, baseTime + idx * 0.05 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(baseTime + idx * 0.05);
          osc.stop(baseTime + idx * 0.05 + 0.25);
        });
      } else if (type === "portal") {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.8);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(185, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + 0.8);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 0.8);
        osc2.stop(ctx.currentTime + 0.8);
      } else if (type === "success") {
        const notes = [587.33, 739.99, 880.00, 1174.66];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.2);
        });
      }
    } catch (e) {
      console.warn("Sound play failed", e);
    }
  };

  return {
    muted,
    toggleMute,
    play: playSynthSound,
  };
}
