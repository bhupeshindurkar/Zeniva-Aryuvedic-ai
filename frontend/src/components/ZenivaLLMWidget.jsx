import React from 'react';
import { Volume2, Sparkles, Mic } from 'lucide-react';

export const ZenivaLLMWidget = ({ 
  onClick, 
  currentUser = {} 
}) => {
  const isGuest = !currentUser?.role || currentUser?.role === 'public' || currentUser?.isLoggedIn === false || !currentUser?.name || currentUser?.name === 'Guest Visitor';
  const patientName = isGuest ? '' : currentUser.name.replace(/^Dr\.\s*/i, '').trim();

  return (
    <>
      {/* 1. MOBILE FLOATING COMPACT AI BUTTON (< 1024px) - Non-intrusive floating pill above bottom nav */}
      <div className="lg:hidden fixed bottom-18 right-3.5 z-40 select-none animate-in fade-in duration-300">
        <button
          onClick={onClick}
          className="group relative flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#0E061D]/95 backdrop-blur-md border border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.45)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] active:scale-95 transition-all cursor-pointer"
          title="Open AI Ayurvedic Assistant"
        >
          {/* Mini Glowing Robot Avatar */}
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-cyan-300 shadow-xs bg-[#091124] shrink-0">
            <img 
              src="/assets/standing_ai_robot.jpg" 
              alt="Zeniva AI" 
              className="w-full h-full object-cover object-top"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#091124]"></span>
          </div>

          <div className="flex flex-col items-start text-left leading-tight">
            <span className="text-[10px] font-extrabold font-mono text-cyan-300 flex items-center gap-1">
              <span>ZENIVA AI</span>
              <span className="text-[8px] bg-cyan-950 text-cyan-200 px-1 py-0.2 rounded font-bold border border-cyan-400/40">70B</span>
            </span>
            <span className="text-[8px] text-stone-300 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
              <span>Voice / RAG</span>
            </span>
          </div>
        </button>
      </div>

      {/* 2. DESKTOP 3D STANDING HOLOGRAPHIC CARD (>= 1024px) */}
      <div className="hidden lg:block fixed bottom-5 right-5 z-40 select-none animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div
          onClick={onClick}
          className="group relative w-34 rounded-2xl p-2.5 bg-gradient-to-b from-[#060A16]/95 via-[#0A1329]/95 to-[#160B2A]/95 backdrop-blur-xl border border-cyan-400/70 hover:border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col items-center text-center overflow-hidden"
          title="Open ZENIVA LLM Voice & RAG Assistant"
        >
          {/* Holographic Glowing Ambient Backgrounds */}
          <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-cyan-500/20 blur-xl group-hover:bg-cyan-400/35 transition-all"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-purple-600/25 blur-xl group-hover:bg-purple-500/40 transition-all"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#00f2fe12_1px,transparent_1px)] [background-size:10px_10px] opacity-40 pointer-events-none"></div>

          {/* 1. TOP HEADER: COMPACT "ZENIVA LLM" BADGE */}
          <div className="relative z-10 w-full flex items-center justify-between pb-1 mb-1.5 border-b border-cyan-500/30">
            <div className="flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
              <span className="text-[10px] font-extrabold font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                ZENIVA LLM
              </span>
            </div>

            <span className="px-1 py-0.2 rounded-full text-[8px] font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-400/40">
              70B
            </span>
          </div>

          {/* 2. CENTER: STANDING ROBOT 3D HOLOGRAPHIC ROTATING STRUCTURE */}
          <div 
            className="relative z-10 w-full h-36 rounded-xl overflow-hidden border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.4)] bg-gradient-to-b from-[#070B16] via-[#091124] to-[#050811] mb-1.5 group-hover:border-cyan-300 transition-all flex flex-col items-center justify-center [perspective:800px]"
            style={{ perspective: '800px' }}
          >
            {/* Pulsing Aura & Sci-Fi Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500/30 via-violet-600/30 to-fuchsia-500/30 blur-xs group-hover:opacity-100 animate-pulse transition-all"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#00f2fe1a_1px,transparent_1px)] [background-size:8px_8px] opacity-60 pointer-events-none"></div>

            {/* 3D Hologram Projector Pedestal Base (Spinning Disc at Robot's Feet) */}
            <div className="absolute bottom-4 w-24 h-10 pointer-events-none flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-400/60 animate-pedestal-disc shadow-[0_0_15px_rgba(6,182,212,0.6)]"></div>
              <div className="absolute w-14 h-14 rounded-full border border-violet-400/50 animate-pedestal-disc [animation-direction:reverse]"></div>
              <div className="absolute w-8 h-8 rounded-full bg-cyan-400/20 blur-xs"></div>
            </div>

            {/* Holographic Laser Scan Line Beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#22d3ee] animate-hologram-beam z-20 pointer-events-none"></div>

            {/* 3D In-Place Rotating Robot */}
            <div className="relative z-10 w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
              <img 
                src="/assets/standing_ai_robot.jpg" 
                alt="ZENIVA LLM Standing Robot" 
                className="w-full h-full object-cover object-top animate-robot-360-spin transition-transform duration-700"
                style={{
                  transformOrigin: '50% 60%',
                  filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.5))'
                }}
              />
            </div>

            {/* Soundwave Equalizer Overlay directly on bottom pedestal */}
            <div className="absolute inset-x-0 bottom-0 py-1 px-1.5 bg-gradient-to-t from-[#060A16] via-[#060A16]/90 to-transparent flex items-center justify-between z-20 backdrop-blur-[2px]">
              <div className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 bg-cyan-400 rounded-full h-1.5 animate-pulse"></span>
                <span className="w-0.5 bg-violet-400 rounded-full h-2 animate-bounce delay-75"></span>
                <span className="w-0.5 bg-cyan-300 rounded-full h-2.5 animate-pulse delay-100"></span>
                <span className="w-0.5 bg-fuchsia-400 rounded-full h-1.5 delay-150"></span>
              </div>
              <span className="text-[8px] font-mono font-bold text-cyan-300 flex items-center gap-0.5">
                <Volume2 className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                <span>VOICE AI</span>
              </span>
            </div>
          </div>

          {/* 3. INTERACTIVE COMPACT ACTION: CLICK TO TALK */}
          <div className="relative z-10 w-full space-y-0.5">
            <div className="w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-[10px] shadow-[0_0_12px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center justify-center gap-1 border border-cyan-300/40 transition-all">
              <Mic className="w-3 h-3 text-cyan-200 animate-pulse" />
              <span>Talk to AI</span>
            </div>

            <p className="text-[8px] text-stone-300 font-mono flex items-center justify-center gap-0.5 pt-0.2">
              <Sparkles className="w-2 h-2 text-cyan-400" />
              <span>संस्कृत · हिन्दी · EN</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
