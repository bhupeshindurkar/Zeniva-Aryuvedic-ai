import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Leaf, Moon, Zap, Activity } from 'lucide-react';
import { ZenivaLogo } from './ZenivaIcons';

export const SplashScreen = ({ onFinish, duration = 3200 }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const loadingSteps = [
    {
      sanskrit: "आयुर्वेदोऽमृतानाम्",
      step: "Initializing Clinical Knowledge Base",
      detail: "Loading Classical Charaka & Sushruta Samhita Clinical Knowledge Base"
    },
    {
      sanskrit: "शरीरमाद्यं खलु धर्मसाधनम्",
      step: "Calibrating Clinical Health AI Engine",
      detail: "Harmonizing Stress, Joint Mobility, Digestion & Immunity Health Protocols"
    },
    {
      sanskrit: "प्रकृतिं विद्धि मे पराम्",
      step: "Synthesizing Personalized Health Profiler",
      detail: "Structuring AI-Driven Pulse, Vitals & Clinical Symptom Diagnostics"
    },
    {
      sanskrit: "सर्वे सन्तु निरामयाः",
      step: "Ready to Elevate Your Wellness",
      detail: "Welcome to Zeniva AI Care — Ancient Vedic Wisdom meets Modern Clinical Intelligence"
    }
  ];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 25) {
        setPhaseIndex(0);
      } else if (pct < 55) {
        setPhaseIndex(1);
      } else if (pct < 85) {
        setPhaseIndex(2);
      } else {
        setPhaseIndex(3);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 600);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [duration, onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #20103A 0%, #120924 45%, #080411 100%)'
      }}
    >
      {/* Background Sacred Geometric Mandala (Slow Rotation) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg
          viewBox="0 0 800 800"
          className="w-[800px] h-[800px] sm:w-[1000px] sm:h-[1000px] animate-spin-ultra-slow"
        >
          <circle cx="400" cy="400" r="380" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 8" fill="none" />
          <circle cx="400" cy="400" r="320" stroke="#E5C07B" strokeWidth="1.5" strokeDasharray="6 6" fill="none" />
          <circle cx="400" cy="400" r="260" stroke="#9333EA" strokeWidth="1" strokeDasharray="2 4" fill="none" />
          <circle cx="400" cy="400" r="200" stroke="#D4AF37" strokeWidth="1" fill="none" />
          <circle cx="400" cy="400" r="140" stroke="#E5C07B" strokeWidth="1.2" strokeDasharray="3 6" fill="none" />
          {/* Sacred 12 Petal Lotus Array */}
          {[...Array(12)].map((_, i) => (
            <g key={i} transform={`rotate(${i * 30} 400 400)`}>
              <path
                d="M400 80 Q425 240 400 400 Q375 240 400 80 Z"
                fill="none"
                stroke="#E5C07B"
                strokeWidth="0.8"
                opacity="0.4"
              />
              <circle cx="400" cy="140" r="4" fill="#D4AF37" opacity="0.6" />
            </g>
          ))}
          {/* Sacred 8 Diagonal Rays */}
          {[...Array(8)].map((_, i) => (
            <line
              key={`ray-${i}`}
              x1="400"
              y1="400"
              x2={400 + 380 * Math.cos((i * 45 * Math.PI) / 180)}
              y2={400 + 380 * Math.sin((i * 45 * Math.PI) / 180)}
              stroke="#D4AF37"
              strokeWidth="0.5"
              strokeDasharray="4 8"
              opacity="0.3"
            />
          ))}
        </svg>
      </div>

      {/* Floating Prana / Bio-Energy Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl" />
      </div>

      {/* Top Bar: Brand Pill & Skip Button */}
      <div className="w-full max-w-5xl flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-amber-400/20 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-medium tracking-wider text-amber-200 uppercase">
            Ayurvedic AI Clinical Suite
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-stone-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer group"
        >
          <span>Enter Sanctuary</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Center Core: Sacred Golden Emblem & Identity */}
      <div className="flex flex-col items-center text-center relative z-10 max-w-xl mx-auto my-auto space-y-6">
        
        {/* Sacred Golden Lotus & Rotating Clinical Intelligence Aura */}
        <div className="relative flex items-center justify-center">
          {/* Multi-layered Pulsing Halo */}
          <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-600/20 to-emerald-500/20 blur-xl animate-pulse" />
          <div className="absolute w-40 h-40 rounded-full border border-amber-400/30 animate-spin-slow" />
          <div className="absolute w-52 h-52 rounded-full border border-dashed border-amber-400/20 animate-spin-reverse-slower" />

          {/* Orbiting Professional Clinical Health Emblems */}
          <div className="absolute inset-0 w-56 h-56 -m-8 animate-spin-slower pointer-events-none">
            {/* Top Node: Stress & Cognitive Calm */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#241242] to-[#120724] border border-purple-400/80 flex items-center justify-center text-purple-300 shadow-xl shadow-purple-950/70 backdrop-blur-md">
                <Moon className="w-4 h-4 text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
              </div>
            </div>

            {/* Bottom Left Node: Joint Mobility & Vitality */}
            <div className="absolute bottom-2 left-0 flex flex-col items-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#0B2138] to-[#04101C] border border-sky-400/80 flex items-center justify-center text-sky-300 shadow-xl shadow-sky-950/70 backdrop-blur-md">
                <Activity className="w-4 h-4 text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              </div>
            </div>

            {/* Bottom Right Node: Immunity & Digestive Wellness */}
            <div className="absolute bottom-2 right-0 flex flex-col items-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#092B1B] to-[#03150C] border border-emerald-400/80 flex items-center justify-center text-emerald-300 shadow-xl shadow-emerald-950/70 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
            </div>
          </div>

          {/* Central Golden Lotus Brand Icon */}
          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-[#2A1747]/90 to-[#150926]/95 border-2 border-amber-400/60 p-4 flex items-center justify-center shadow-2xl shadow-purple-950/80 backdrop-blur-xl">
            <ZenivaLogo className="w-full h-full drop-shadow-[0_0_15px_rgba(229,192,123,0.6)]" />
          </div>
        </div>

        {/* Brand Typography */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-400/60" />
            <span className="text-xs font-serif tracking-[0.3em] uppercase text-amber-300/80">
              Prana · Prakriti · Panchakarma
            </span>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5DC] via-[#E5C07B] to-[#D4AF37] tracking-wider drop-shadow-md">
            ZENIVA
          </h1>
          <p className="text-sm sm:text-base font-sans font-medium text-purple-200/90 tracking-widest uppercase">
            AI Ayurvedic Healthcare Assistant
          </p>
        </div>

        {/* Vedic Shloka Ribbon */}
        <div className="px-5 py-3 rounded-2xl bg-white/[0.04] border border-amber-400/25 backdrop-blur-lg shadow-inner max-w-md w-full">
          <p className="text-sm font-serif italic text-amber-200/95 tracking-wide">
            "{loadingSteps[phaseIndex].sanskrit}"
          </p>
          <p className="text-[11px] text-stone-300 font-sans mt-1">
            {loadingSteps[phaseIndex].step}
          </p>
        </div>

      </div>

      {/* Bottom Progress Section */}
      <div className="w-full max-w-md mx-auto space-y-3 relative z-10 pb-4">
        
        {/* Step Detail & Percentage */}
        <div className="flex items-center justify-between text-xs font-medium px-1">
          <div className="flex items-center gap-2 text-stone-300 truncate mr-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-spin-slow" />
            <span className="truncate text-[11px] text-stone-300">
              {loadingSteps[phaseIndex].detail}
            </span>
          </div>
          <span className="font-mono text-amber-300 font-bold shrink-0">
            {progress}%
          </span>
        </div>

        {/* Modern Ayurvedic Shimmer Progress Bar */}
        <div className="w-full h-2 rounded-full bg-white/10 p-0.5 overflow-hidden border border-amber-400/20 backdrop-blur-sm">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-300 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(229,192,123,0.8)] relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-shimmer" />
          </div>
        </div>

        {/* Footer Clinical Trust Badges */}
        <div className="flex items-center justify-center gap-6 pt-2 text-[10px] text-stone-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            Authentic Classical Ayurveda
          </span>
          <span className="flex items-center gap-1">
            <Leaf className="w-3 h-3 text-emerald-400" />
            RAG-Augmented Clinical AI
          </span>
        </div>
      </div>
    </div>
  );
};
