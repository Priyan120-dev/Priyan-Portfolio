"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Mail, Linkedin, Github, FileText, Send, CheckCircle2, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import emailjs from "@emailjs/browser";

function FloatingParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 12 }).map((_, i) => {
        const size = Math.random() * 3 + 1;
        const delay = Math.random() * 4;
        const duration = Math.random() * 8 + 8;
        const left = Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-monarch-blue/20"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: "-5%",
            }}
            animate={{
              y: ["0px", "-400px"],
              opacity: [0, 0.7, 0],
              x: ["0px", `${(Math.random() - 0.5) * 35}px`]
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
}

export default function JoinGuild() {
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

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { name: "", email: "", subject: "", message: "" };

    if (!formData.name.trim()) {
      errors.name = "Codename / Full Name is required.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Communication core email is required.";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please input a valid email coordinate.";
        isValid = false;
      }
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject coordinate is required.";
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = "Contract details / message are required.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      play("click"); // warning click
      return;
    }

    setIsSubmitting(true);
    play("click");

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_qe08p94";
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_9dytoec";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "jOE1wRzsvdhEyd7WT";

      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (response.status === 200) {
        setIsSubmitting(false);
        setSubmitted(true);
        play("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(`EmailJS responded with status: ${response.status}`);
      }
    } catch (error: any) {
      console.error("EmailJS Transmission Failure:", error);
      setIsSubmitting(false);
      setSubmitError(error.text || error.message || "Failed to transmit message.");
      play("click");
    }
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-24 md:py-32 bg-transparent border-t border-monarch-purple/5 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(157,78,221,0.03),transparent_40%)] pointer-events-none" />

      <motion.div
        style={{
          rotateX: rotateXScroll,
          translateZ: translateZScroll,
          opacity: opacityScroll,
          transformStyle: "preserve-3d",
        }}
        className="max-w-4xl mx-auto px-4 relative z-10 pointer-events-auto"
      >
        {/* Section Heading */}
        <div className="mb-16 text-center">
          <span className="font-mono text-xs text-monarch-purple tracking-[0.3em] uppercase block mb-2">
            GUILD RECRUITMENT
          </span>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold tracking-widest text-glow-purple text-monarch-purple">
            JOIN THE GUILD
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-monarch-purple to-transparent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Guild Credentials / Social Nodes */}
          <div className="md:col-span-4 flex flex-col justify-between gap-6">
            <div className="cyber-border-purple rounded-lg p-6 h-full flex flex-col justify-between">
              <div className="corner-decor corner-decor-tl" />
              <div className="corner-decor corner-decor-tr" />
              <div className="corner-decor corner-decor-bl" />
              <div className="corner-decor corner-decor-br" />

              <div>
                <span className="font-mono text-[9px] text-slate-500 block mb-1">GUILD DATABASE</span>
                <h3 className="font-orbitron font-bold text-slate-200 tracking-wider text-sm mb-4">
                  HUNTER CREDENTIALS
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6">
                  Initiate a secure channel node to invite Priyan I to your recruiter squad or establish collaborative alliances.
                </p>
              </div>

              {/* Social Buttons */}
              <div className="space-y-3 mt-auto">
                <a
                  href="https://github.com/Priyan-I"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => play("hover")}
                  onClick={() => play("click")}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded border border-slate-800 hover:border-monarch-purple bg-slate-900/20 hover:bg-monarch-purple/10 text-slate-300 hover:text-white transition-all duration-300"
                >
                  <Github className="h-4 w-4" />
                  <span className="font-mono text-xs tracking-wider">GITHUB</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/priyan-i-179a7038b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => play("hover")}
                  onClick={() => play("click")}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded border border-slate-800 hover:border-monarch-blue bg-slate-900/20 hover:bg-monarch-blue/10 text-slate-300 hover:text-white transition-all duration-300"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="font-mono text-xs tracking-wider">LINKEDIN</span>
                </a>

                <a
                  href="mailto:hariharanayappan120@gmail.com"
                  onMouseEnter={() => play("hover")}
                  onClick={() => play("click")}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded border border-slate-800 hover:border-monarch-purple bg-slate-900/20 hover:bg-monarch-purple/10 text-slate-300 hover:text-white transition-all duration-300"
                >
                  <Mail className="h-4 w-4" />
                  <span className="font-mono text-xs tracking-wider">EMAIL DIRECT</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Guild Contract Form / Dimensional Terminal */}
          <div className="md:col-span-8">
            <div className="cyber-border-purple rounded-lg p-6 md:p-8 h-full relative overflow-hidden bg-[#120e1e]/60 backdrop-blur-md border border-monarch-purple/20 shadow-[0_0_30px_rgba(157,78,221,0.15)] flex flex-col justify-between">
              
              {/* Decorative Scan lines & Particles */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none z-0 opacity-20" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(157,78,221,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(157,78,221,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
              <FloatingParticles />

              {/* Moving scanline laser */}
              <motion.div 
                className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-monarch-blue/30 to-transparent shadow-[0_0_6px_#00f0ff] pointer-events-none z-0"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />

              <div className="corner-decor corner-decor-tl" />
              <div className="corner-decor corner-decor-tr" />
              <div className="corner-decor corner-decor-bl" />
              <div className="corner-decor corner-decor-br" />

              <div className="absolute top-0 right-8 bg-monarch-purple/10 border-b border-x border-monarch-purple/40 px-3 py-1 font-mono text-[9px] tracking-widest text-monarch-purple z-10">
                TRANSMISSION GATE
              </div>

              {/* HUD Header Status */}
              <div className="flex items-center justify-between mb-6 z-10">
                <h3 className="font-orbitron text-glow-purple text-monarch-purple font-bold tracking-wider text-base flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  SIGN GUILD CONTRACT
                </h3>

                <div className="flex items-center gap-1.5 font-mono text-[9px]">
                  <span className={`h-1.5 w-1.5 rounded-full ${submitted ? "bg-green-400" : isSubmitting ? "bg-yellow-400" : "bg-monarch-blue animate-pulse"} shadow-[0_0_6px_currentColor]`} />
                  <span className={`${submitted ? "text-green-400" : isSubmitting ? "text-yellow-400" : "text-monarch-blue"}`}>
                    {submitted ? "[COMM_ESTABLISHED]" : isSubmitting ? "[SYNCING_LINK]" : "[LINK_ACTIVE]"}
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* Form Mode */}
                {!submitted && !submitError && (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5 z-10 flex-grow"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div>
                        <label className="font-mono text-[10px] text-slate-500 tracking-wider block mb-1">
                          CODENAME / FULL NAME *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full bg-[#05010a]/90 border ${formErrors.name ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-monarch-purple/60"} rounded px-3 py-2 text-sm text-slate-200 outline-none transition-all duration-300 font-sans focus:shadow-[0_0_10px_rgba(157,78,221,0.15)]`}
                            placeholder="e.g. Recruit Hunter"
                          />
                          {formErrors.name && (
                            <span className="font-mono text-[9px] text-red-500 mt-1 block tracking-tight">
                              {formErrors.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Email input */}
                      <div>
                        <label className="font-mono text-[10px] text-slate-500 tracking-wider block mb-1">
                          COMMUNICATION CORE EMAIL *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full bg-[#05010a]/90 border ${formErrors.email ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-monarch-purple/60"} rounded px-3 py-2 text-sm text-slate-200 outline-none transition-all duration-300 font-sans focus:shadow-[0_0_10px_rgba(157,78,221,0.15)]`}
                            placeholder="yourname@guild.com"
                          />
                          {formErrors.email && (
                            <span className="font-mono text-[9px] text-red-500 mt-1 block tracking-tight">
                              {formErrors.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subject input */}
                    <div>
                      <label className="font-mono text-[10px] text-slate-500 tracking-wider block mb-1">
                        MISSION SUBJECT *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className={`w-full bg-[#05010a]/90 border ${formErrors.subject ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-monarch-purple/60"} rounded px-3 py-2 text-sm text-slate-200 outline-none transition-all duration-300 font-sans focus:shadow-[0_0_10px_rgba(157,78,221,0.15)]`}
                          placeholder="e.g. S-Rank Gate Raid Proposal"
                        />
                        {formErrors.subject && (
                          <span className="font-mono text-[9px] text-red-500 mt-1 block tracking-tight">
                            {formErrors.subject}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message textarea */}
                    <div>
                      <label className="font-mono text-[10px] text-slate-500 tracking-wider block mb-1">
                        CONTRACT TERMS (MESSAGE) *
                      </label>
                      <div className="relative">
                        <textarea
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          className={`w-full bg-[#05010a]/90 border ${formErrors.message ? "border-red-500/60 focus:border-red-500" : "border-slate-800 focus:border-monarch-purple/60"} rounded px-3 py-2 text-sm text-slate-200 outline-none transition-all duration-300 resize-none font-sans focus:shadow-[0_0_10px_rgba(157,78,221,0.15)]`}
                          placeholder="State the terms of your quest proposal or contract..."
                        />
                        {formErrors.message && (
                          <span className="font-mono text-[9px] text-red-500 mt-1 block tracking-tight">
                            {formErrors.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onMouseEnter={() => play("hover")}
                      className="group relative w-full px-6 py-3 font-orbitron font-bold text-xs tracking-widest text-[#05010a] rounded overflow-hidden shadow-[0_0_15px_rgba(157,78,221,0.2)] hover:shadow-[0_0_25px_rgba(157,78,221,0.45)] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-monarch-purple to-purple-500 group-hover:scale-105 transition-transform duration-300" />
                      
                      {/* Laser sweep animation */}
                      <div className="absolute top-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine pointer-events-none" />

                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-[#05010a]" />
                            <span>TRANSMITTING MESSAGE...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>TRANSMIT CONTRACT</span>
                          </>
                        )}
                      </span>
                    </button>
                  </motion.form>
                )}

                {/* Sending state spinner overlay (if needed as a separate visual phase) */}
                {isSubmitting && (
                  <motion.div
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[#05010a]/90 flex flex-col items-center justify-center z-20 gap-4 pointer-events-auto"
                  >
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 border-2 border-dashed border-monarch-blue/40 rounded-full animate-spin-slow" />
                      <div className="absolute w-12 h-12 border-2 border-monarch-purple/50 border-t-transparent border-b-transparent rounded-full animate-spin" />
                      <div className="w-4 h-4 bg-monarch-blue rounded-full shadow-[0_0_12px_#00f0ff] animate-ping" />
                    </div>
                    <div className="font-mono text-[10px] text-monarch-blue tracking-[0.2em] uppercase animate-pulse">
                      [ESTABLISHING QUANTUM LINK...]
                    </div>
                  </motion.div>
                )}

                {/* Success Card */}
                {submitted && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-6 z-10 flex-grow"
                  >
                    <div className="relative mb-4 flex items-center justify-center">
                      <div className="absolute w-20 h-20 rounded-full border border-green-500/20 animate-ping opacity-25" />
                      <CheckCircle2 className="h-14 w-14 text-green-400 drop-shadow-[0_0_10px_#4ade80]" />
                    </div>

                    <h4 className="font-orbitron font-bold text-green-400 text-base tracking-widest mb-3 animate-pulse">
                      ⚡ GUILD CONNECTION ESTABLISHED ⚡
                    </h4>
                    
                    <div className="font-mono text-xs text-slate-400 border border-green-500/20 bg-green-500/5 p-4 rounded-md max-w-md mb-6 leading-relaxed flex flex-col gap-2">
                      <span className="text-glow-green text-green-400 font-bold tracking-wider">[TRANSMISSION STATUS: SUCCESSFUL]</span>
                      <span>Your contract details have been securely logged via the EmailJS gateway and forwarded directly to the Shadow Monarch's Gmail.</span>
                    </div>

                    <button
                      onClick={() => setSubmitted(false)}
                      onMouseEnter={() => play("hover")}
                      className="px-6 py-2.5 border border-green-500/40 bg-green-500/5 hover:bg-green-500/10 text-green-400 hover:text-white rounded font-mono text-xs tracking-wider transition-all duration-300 cursor-pointer"
                    >
                      [TRANSMIT ANOTHER MESSAGE]
                    </button>
                  </motion.div>
                )}

                {/* Error Card */}
                {submitError && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-6 z-10 flex-grow"
                  >
                    <div className="relative mb-4 flex items-center justify-center">
                      <div className="absolute w-20 h-20 rounded-full border border-red-500/20 animate-ping opacity-25" />
                      <AlertTriangle className="h-14 w-14 text-red-500 drop-shadow-[0_0_10px_#ef4444]" />
                    </div>

                    <h4 className="font-orbitron font-bold text-red-500 text-base tracking-widest mb-3">
                      ⚠ TRANSMISSION FAILED ⚠
                    </h4>

                    <div className="font-mono text-xs text-slate-400 border border-red-500/20 bg-red-500/5 p-4 rounded-md max-w-md mb-6 leading-relaxed flex flex-col gap-2">
                      <span className="text-red-400 font-bold tracking-wider">[ERROR CODE: GATEWAY_SYNC_FAIL]</span>
                      <span className="text-[11px] text-red-300/80 italic">{submitError}</span>
                      <span>The transmission gate encountered a temporal anomaly. Please verify your connection status and coordinates.</span>
                    </div>

                    <button
                      onClick={() => setSubmitError(null)}
                      onMouseEnter={() => play("hover")}
                      className="flex items-center gap-2 px-6 py-2.5 border border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-white rounded font-mono text-xs tracking-wider transition-all duration-300 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>[RETRY TRANSMISSION]</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
