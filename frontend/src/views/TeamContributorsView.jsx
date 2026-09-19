import React, { useState, useEffect } from 'react';
import {
  Users, Award, Sparkles, ShieldCheck, HeartPulse, Stethoscope,
  Code, Database, Brain, Cpu, Layout, CheckCircle2, ArrowLeft,
  Mail, ExternalLink, Compass, BookOpen, Layers, Star, Zap, Shield,
  Camera, UploadCloud
} from 'lucide-react';
import { ZenivaLogo, MeditatingYogi } from '../components/ZenivaIcons';
import { getTeamData } from '../data/teamData';

const LinkedinIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export const TeamContributorsView = ({ onBackToOverview = () => { } }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const defaultPlaceholders = {
    founder: '/team/bhupesh.jpg',
    vivek: '/team/vivek.jpg',
    dhrup: '/team/dhrup.jpg',
    momita: '/team/momita.jpg',
    shreya: '/team/shreya.jpg',
    sachin: '/team/sachin.jpg',
  };

  // Live synchronized Team Data from central store
  const [teamConfig, setTeamConfig] = useState(getTeamData);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) {
        setTeamConfig(e.detail);
      } else {
        setTeamConfig(getTeamData());
      }
    };
    window.addEventListener('zeniva_team_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('zeniva_team_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Founder Profile
  const founder = teamConfig.founder || getTeamData().founder;

  // Core Team Members
  const teamMembers = teamConfig.members || getTeamData().members;

  const filteredMembers = activeCategory === 'all'
    ? teamMembers
    : teamMembers.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#ECE6DD] text-[#1C1917] font-sans selection:bg-amber-100 selection:text-amber-900 pb-20">

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EBE3D5] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToOverview}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700 transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#B45309]" />
              <span>Back to Overview</span>
            </button>
            <div className="h-5 w-px bg-stone-300 mx-1"></div>
            <div className="flex items-center gap-2">
              <ZenivaLogo className="w-8 h-8" />
              <div>
                <span className="font-serif font-bold text-sm tracking-wider text-[#1C1917]">ZENIVA GROUP</span>
                <p className="text-[9px] uppercase font-bold text-[#B45309] tracking-widest -mt-0.5">Founders & Engineering Team</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100/80 text-amber-900 border border-amber-300/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Academic & Clinical Innovation</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-amber-200/30 via-purple-100/20 to-transparent blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#1C1030] text-amber-300 shadow-md">
            <MeditatingYogi className="w-4 h-4" />
            <span>Zeniva Group Core Creators</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1917] tracking-tight leading-tight">
            The Minds Behind <span className="text-[#5B3E8C]">Zeniva AI</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Meet the multidisciplinary engineering team from TGPCET Nagpur who conceptualized, engineered, and deployed <strong>Zeniva — AI Ayurvedic Care</strong>: a production-grade full-stack healthcare ecosystem integrating authentic Charaka Samhita clinical databases with multimodal neural AI.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/80 border border-[#EBE3D5] shadow-xs text-center">
              <p className="text-2xl font-serif font-bold text-[#1C1030]">6</p>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">Core Engineers (TGPCET)</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 border border-[#EBE3D5] shadow-xs text-center">
              <p className="text-2xl font-serif font-bold text-[#5B3E8C]">3 Portals</p>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">Patient · Doctor · Admin</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 border border-[#EBE3D5] shadow-xs text-center">
              <p className="text-2xl font-serif font-bold text-[#B45309]">1,200+</p>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">Clinical RAG Datasets</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 border border-[#EBE3D5] shadow-xs text-center">
              <p className="text-2xl font-serif font-bold text-emerald-700">100%</p>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">Custom Full-Stack Code</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: FOUNDER & LEAD SYSTEM ARCHITECT */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase font-bold text-amber-700 tracking-widest px-3 py-1 bg-amber-100 rounded-full">
            Project Leadership & Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
            Founder & Lead System Architect
          </h2>
        </div>

        <div className="relative rounded-3xl bg-gradient-to-br from-[#1C1030] via-[#2A1747] to-[#1C1030] text-white p-6 sm:p-10 shadow-xl border border-amber-500/30 overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar & Badges */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative">
                <img
                  src={founder.avatar}
                  alt={founder.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultPlaceholders.founder;
                  }}
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover border-4 border-amber-400/60 shadow-lg"
                />
                <div className="absolute -bottom-3 -right-2 bg-amber-500 text-stone-950 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-stone-950" />
                  <span>Founder</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <a
                  href={`mailto:${founder.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-200 border border-amber-400/30 transition-all cursor-pointer shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{founder.email}</span>
                </a>

                {founder.linkedin && (
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A66C2]/80 hover:bg-[#0A66C2] text-xs font-bold text-white border border-blue-400/40 transition-all cursor-pointer shadow-xs"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5 fill-current" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </a>
                )}
              </div>
            </div>

            {/* Content & Contributions */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>{founder.roleTag}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
                  {founder.name}
                </h3>
                <p className="text-xs sm:text-sm text-purple-200 font-medium mt-0.5">
                  {founder.title}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                {founder.bio}
              </p>

              {/* Core Deliverables List */}
              <div className="pt-2 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center justify-center md:justify-start gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Architectural Leadership & Key Deliverables:</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-200">
                  {founder.keyResponsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills badges */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {founder.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-purple-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CORE TEAM & GROUP CONTRIBUTORS */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-700 tracking-widest px-3 py-1 bg-purple-100 rounded-full">
              Engineering & Domain Specialists
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
              Core Engineering & Clinical Contributors
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Detailed roles and specific functional contributions for every team member in the Zeniva platform.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white rounded-2xl border border-stone-200 shadow-2xs text-xs font-bold">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeCategory === 'all' ? 'bg-[#5B3E8C] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
            >
              All Members (5)
            </button>
            <button
              onClick={() => setActiveCategory('ai')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeCategory === 'ai' ? 'bg-[#5B3E8C] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
            >
              AI & LLM
            </button>
            <button
              onClick={() => setActiveCategory('frontend')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeCategory === 'frontend' ? 'bg-[#5B3E8C] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
            >
              Frontend UI/UX
            </button>
            <button
              onClick={() => setActiveCategory('database')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeCategory === 'database' ? 'bg-[#5B3E8C] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
            >
              Database Systems
            </button>
            <button
              onClick={() => setActiveCategory('qa')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeCategory === 'qa' ? 'bg-[#5B3E8C] text-white shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
            >
              Testing & QA
            </button>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                {/* Header Profile Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultPlaceholders[member.id] || defaultPlaceholders.vivek;
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-stone-200 shadow-2xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#5B3E8C] border border-purple-200 mb-1">
                      {member.badge}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-stone-900 truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#B45309]">
                      {member.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1.5 text-[11px] text-stone-600 hover:text-[#5B3E8C] bg-stone-100/90 hover:bg-purple-50 px-2.5 py-1 rounded-lg border border-stone-200 transition-all font-medium"
                        title={member.email}
                      >
                        <Mail className="w-3 h-3 text-[#5B3E8C]" />
                        <span className="truncate max-w-[140px] sm:max-w-[190px]">{member.email}</span>
                      </a>

                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] text-[#0A66C2] hover:text-white bg-blue-50/80 hover:bg-[#0A66C2] px-2.5 py-1 rounded-lg border border-blue-200 hover:border-[#0A66C2] transition-all font-semibold shadow-2xs"
                        >
                          <LinkedinIcon className="w-3.5 h-3.5 fill-current" />
                          <span>LinkedIn</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mt-4 leading-relaxed italic">
                  "{member.bio}"
                </p>

                {/* Specific Functional Contributions */}
                <div className="mt-4 pt-4 border-t border-stone-100">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-800 mb-2 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-[#5B3E8C]" />
                    <span>Key Engineering & Clinical Deliverables:</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {member.contributions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills and Domain Tags */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-stone-100">
                {member.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-[10px] font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SYSTEM ARCHITECTURE & ENGINEERING BREAKDOWN */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="bg-white rounded-3xl p-8 border border-[#EBE3D5] shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-widest px-3 py-1 bg-emerald-50 rounded-full">
              Full Stack System Architecture
            </span>
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              How the Zeniva Engine Was Built
            </h3>
            <p className="text-xs text-stone-500">
              The collaborative technological pillars connecting ancient Vedic principles to high-speed digital delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-stone-900">1. AI & RAG Engine</h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                70B LLM integration, multimodal vision diagnostics, and Charaka Samhita RAG retrieval with clinical safety guardrails.
              </p>
              <p className="text-[10px] font-bold text-amber-800">Lead: Dhrup Sonkar</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Layout className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-stone-900">2. Vedic UI/UX System</h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Golden visual theme, glassmorphic cards, fluid role-based sidebar navigation, and seamless mobile responsiveness.
              </p>
              <p className="text-[10px] font-bold text-purple-800">Lead: Momita Lande</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-stone-900">3. Database & EHR Storage</h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                SQLite relational schemas, electronic health records (EHR) models, consultation logs, and dynamic schema migrations.
              </p>
              <p className="text-[10px] font-bold text-blue-800">Lead: Shreya Satpute</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-stone-900">4. Software QA & Web Testing</h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Automated regression testing, cross-browser audits, web security barrier verification, and zero-crash QA.
              </p>
              <p className="text-[10px] font-bold text-emerald-800">Leads: Vivek Rathod & Sachin Limbule</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TECHNOLOGIES UTILIZED */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="rounded-3xl bg-[#FAF7F2] p-6 border border-[#EBE3D5] text-center space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Powered by Modern Technologies
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-stone-700">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">React 18 & Vite</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">Python FastAPI</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">SQLite Clinical Persistence</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">Tailwind CSS</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">RAG Knowledge Retrieval</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">Lucide Icons</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-2xs">Clinical Healthcare Standards</span>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <footer className="text-center pt-6 text-xs text-stone-500 space-y-1.5">
        <p className="font-serif font-bold text-stone-800 tracking-wide text-sm">
          ZENIVA GROUP — ACADEMIC & CLINICAL INNOVATION PROJECT
        </p>
        <p className="text-[10px] text-stone-400">
          © 2026 Zeniva Group. All Rights Reserved. Verified Ayurvedic Knowledge System.
        </p>
      </footer>

    </div>
  );
};
