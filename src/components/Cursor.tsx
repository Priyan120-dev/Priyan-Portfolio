"use client";

import { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const requestRef = useRef<number | null>(null);
  const trailElementRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Detect mobile/touch device
    const checkDevice = () => {
      const mobile = window.matchMedia("(max-width: 768px)").matches || 
                     ("ontouchstart" in window) || 
                     (navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Track hovered elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".interactive-element") ||
        target.classList.contains("interactive")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [visible]);

  // Trail physics loop (runs on requestAnimationFrame)
  useEffect(() => {
    if (isMobile) return;

    // Initialize trail points
    const maxTrailPoints = 6;
    if (trailRef.current.length === 0) {
      for (let i = 0; i < maxTrailPoints; i++) {
        trailRef.current.push({ x: position.x, y: position.y });
      }
    }

    const animateTrail = () => {
      let currentX = position.x;
      let currentY = position.y;

      trailRef.current.forEach((point, index) => {
        // Linear interpolation towards preceding point
        const targetX = index === 0 ? currentX : trailRef.current[index - 1].x;
        const targetY = index === 0 ? currentY : trailRef.current[index - 1].y;

        point.x += (targetX - point.x) * 0.35;
        point.y += (targetY - point.y) * 0.35;

        // Apply style to elements
        const el = trailElementRefs.current[index];
        if (el) {
          el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) scale(${1 - index * 0.12})`;
          el.style.opacity = String((0.6 - index * 0.1) * (visible ? 1 : 0));
        }
      });

      requestRef.current = requestAnimationFrame(animateTrail);
    };

    requestRef.current = requestAnimationFrame(animateTrail);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position, isMobile, visible]);

  if (isMobile) return null;

  return (
    <div className="no-recruiter pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer Glow Ring */}
      <div
        className={`fixed top-0 left-0 -ml-4 -mt-4 h-8 width-8 rounded-full border border-monarch-blue/40 bg-monarch-blue/5 transition-all duration-150 ease-out`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${hovered ? 1.6 : 1})`,
          opacity: visible ? 0.8 : 0,
          width: "32px",
          height: "32px",
          boxShadow: hovered ? "0 0 15px rgba(0, 240, 255, 0.4)" : "none",
        }}
      />

      {/* Cyber Reticle Crosshair */}
      <div
        className="fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-monarch-purple transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${hovered ? 0.5 : 1})`,
          opacity: visible ? 1 : 0,
          boxShadow: "0 0 8px #9d4edd, 0 0 15px #9d4edd",
        }}
      />

      {/* Shadow Aura Trail Particles (floating purple ash) */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailElementRefs.current[i] = el;
          }}
          className="fixed top-0 left-0 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-monarch-purple/40 blur-[1px]"
          style={{
            transform: "translate3d(-100px, -100px, 0)",
            boxShadow: "0 0 8px rgba(157, 78, 221, 0.6)",
          }}
        />
      ))}
    </div>
  );
}
