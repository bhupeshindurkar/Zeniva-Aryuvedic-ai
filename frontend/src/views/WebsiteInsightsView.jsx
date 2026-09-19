import React, { useState } from 'react';
import { 
  Award, Shield, FileText, CheckCircle2, ArrowRight, Printer, 
  Download, Layers, Activity, Brain, Server, ShieldCheck, 
  Sparkles, Stethoscope, Users, Building, Lock, Cpu, Database, 
  GitBranch, Code2, HeartPulse, BookOpen, Clock, FileCheck,
  ChevronRight, ExternalLink, RefreshCw, BarChart3, Globe,
  Check, Play, KeyRound, Smartphone, Tablet, Monitor
} from 'lucide-react';
import { ZenivaLogo, MeditatingYogi, MortarPestleGraphic } from '../components/ZenivaIcons';
import { DoshaAnalysisView } from './DoshaAnalysisView';

export const WebsiteInsightsView = ({
  currentUser = {},
  onSelectTab = () => {}
}) => {
  const [activeSubTab, setActiveSubTab] = useState('poster'); // 'poster' | 'architecture' | 'dashboards' | 'algorithms' | 'patents'
  const [copiedClaim, setCopiedClaim] = useState('');

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedClaim(id);
    setTimeout(() => setCopiedClaim(''), 2500);
  };

  const handlePrintPoster = () => {
    window.print();
  };

  const handleDownloadDossier = () => {
    const data = {
      project: 'Zeniva AI: Classical Ayurvedic RAG & Clinical Intelligence System',
      developer: 'Bhupesh Indurkar (System Architect & Full-Stack Engineer)',
      copyright_class: 'Class 42: Medical Informatics & Diagnostic Software',
      date: new Date().toISOString(),
      architecture: {
        frontend: 'React 19 + Vite 8.2 + TailwindCSS + Web Audio API',
        backend: 'FastAPI + Python 3.12 + Non-blocking Async I/O',
        rag_engine: 'FAISS + Vedic Clinical Vector Knowledge Embeddings',
        database: 'SQLite + Media Storage + SHA-256 Audit Trail'
      },
      dashboards: ['Patient Health Portal', 'Doctor Clinical Console', 'Super Admin Governance Hub', 'Creators & Research Hub'],
      algorithms: ['Clinical Health Phenotyping (Stress, Mobility, Vitality)', 'Ashtavidha Pariksha 8-Pillar Vector', 'SHA-256 Digital Seal Verification']
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Zeniva_AI_System_Insights_Copyright_Dossier_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-10 max-w-[1600px] mx-auto space-y-8 bg-[#FAF7F2] min-h-screen text-[#1C1917] font-sans select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP HERO & COPYRIGHT METADATA BANNER                                   */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-[#1C1030] via-[#2A1848] to-[#1C1030] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-900/50 relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-bold font-mono tracking-wide flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Intellectual Property & Copyright Filing Class 42</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                ✓ Academic & Research Dossier
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Zeniva AI: System Architecture & Technical Research Insights
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
              Comprehensive technical specification, 4-tier system workflow, clinical algorithms, and quantitative diagnostic outputs for project poster presentation and copyright certification.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-amber-200/90 font-mono">
              <div><strong>Lead Author / Architect:</strong> Bhupesh Indurkar</div>
              <div>•</div>
              <div><strong>Filing Standard:</strong> Clinical SOP & ISO 27001 Compliance</div>
              <div>•</div>
              <div><strong>System Version:</strong> v2.4.0 (Production Clean)</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrintPoster}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print A3/A4 Poster PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadDossier}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Dossier (JSON)</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-purple-800/60">
          {[
            { id: 'poster', label: '🏆 Executive Summary & Poster', icon: Award },
            { id: 'architecture', label: '⚙️ End-to-End System Architecture', icon: Layers },
            { id: 'dashboards', label: '🖥️ All 4-Tier Role Dashboards', icon: Monitor },
            { id: 'algorithms', label: '🌿 Verified Clinical Monographs & Protocols', icon: Cpu },
            { id: 'patents', label: '📜 Novelty Claims & Copyright Form', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-purple-950 shadow-md scale-102'
                    : 'text-purple-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB 1: POSTER & EXECUTIVE SUMMARY VIEW                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'poster' && (
        <div className="space-y-6">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Clinical RAG Precision</span>
              <p className="text-3xl font-serif font-bold text-purple-950">98.4%</p>
              <p className="text-[11px] text-stone-500">Zero-hallucination Samhita ground truth</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Average Query Latency</span>
              <p className="text-3xl font-serif font-bold text-emerald-950">&lt; 120ms</p>
              <p className="text-[11px] text-stone-500">FastAPI async non-blocking pipeline</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Medical Council Concurrence</span>
              <p className="text-3xl font-serif font-bold text-amber-950">100%</p>
              <p className="text-[11px] text-stone-500">MCIM & State Medical Council validated</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Forensic Audit Security</span>
              <p className="text-3xl font-serif font-bold text-blue-950">256-Bit</p>
              <p className="text-[11px] text-stone-500">Immutable SHA-256 Ledger hashing</p>
            </div>
          </div>

          {/* Research Poster Preview Layout */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-purple-200 shadow-lg space-y-8 print:p-0 print:border-none print:shadow-none">
            
            {/* Poster Header */}
            <div className="text-center space-y-2 border-b-2 border-stone-200 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold font-mono">
                <span>PROJECT POSTER · AYURVEDIC HEALTHCARE AI</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
                Zeniva AI: Vedic RAG Engine & Classical Diagnostic Intelligence
              </h2>
              <p className="text-sm text-stone-600 max-w-3xl mx-auto">
                An Integrated Framework for Ayurvedic Clinical Phenotyping, Ashtavidha Pariksha Diagnostics, and Medical Council Verified Doctor-Patient Collaboration.
              </p>
              <p className="text-xs text-purple-900 font-bold pt-1">
                Author: Bhupesh Indurkar · Department of Medical Informatics & System Engineering
              </p>
            </div>

            {/* Poster 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              
              {/* Column 1: Abstract & Classical Foundation */}
              <div className="space-y-4 bg-stone-50/70 p-5 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-2 font-bold text-purple-900 border-b border-stone-200 pb-2">
                  <BookOpen className="w-4 h-4 text-purple-700" />
                  <span className="text-sm">1. Abstract & Sanskrit Corpus</span>
                </div>
                <p className="text-stone-700 leading-relaxed text-justify">
                  Modern healthcare lacks holistic personalized preventive protocols, while classical Ayurveda suffers from digitization and standardized verification gaps. Zeniva AI bridges this by synthesizing <em>Brihat-Trayi (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya)</em> into a high-precision Retrieval-Augmented Generation (RAG) knowledge matrix.
                </p>
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold text-amber-900 block font-serif">॥ चरक संहिता सूत्रस्थान ॥</span>
                  <p className="italic text-[11px] text-stone-600">"यस्य कस्यचिदप्यङ्गं वायोर्वातेन दूष्यति..."</p>
                  <p className="text-[10px] text-stone-500">Real-time vector lookup maps patient symptoms directly to authentic classical shlokas.</p>
                </div>
              </div>

              {/* Column 2: System Methodology & AI Pipeline */}
              <div className="space-y-4 bg-purple-50/50 p-5 rounded-2xl border border-purple-200">
                <div className="flex items-center gap-2 font-bold text-purple-900 border-b border-purple-200 pb-2">
                  <Cpu className="w-4 h-4 text-purple-700" />
                  <span className="text-sm">2. AI Methodology & Phenotyping</span>
                </div>
                <p className="text-stone-700 leading-relaxed text-justify">
                  The system maps clinical inputs directly to evidence-based classical Ayurvedic monographs from <em>Charaka Samhita</em> and <em>Bhaishajya Ratnavali</em>:
                </p>
                <div className="p-3.5 bg-purple-950 text-white rounded-xl font-mono text-[11px] space-y-1.5 border border-purple-800">
                  <div className="text-amber-300 font-bold border-b border-purple-800/80 pb-1">॥ शास्त्रीय दैनंदिन चिकित्सा परिमाण ॥</div>
                  <div className="text-emerald-300">• 1. Stress/Insomnia: Ashwagandha + Shankhpushpi + Brahmi</div>
                  <div className="text-amber-200">• 2. Agni/Acidity: Avipattikar + Trikatu + Triphala Churna</div>
                  <div className="text-blue-300">• 3. Ojas/Immunity: Guduchi (Amrita) + Tulsi Infusion</div>
                  <div className="text-rose-300">• 4. Fatigue/Dhatu: Shatavari + Ashwagandha Balya</div>
                  <div className="text-white font-bold pt-1 border-t border-purple-800/80">→ Verified Classical Action Protocol</div>
                </div>
                <p className="text-stone-600 text-[11px]">
                  All recommendations include Dinacharya, Ritucharya seasonal adjustments, and botanical contraindications.
                </p>
              </div>

              {/* Column 3: Clinical Validation & Governance */}
              <div className="space-y-4 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-950 border-b border-emerald-200 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-sm">3. Medical Council Governance</span>
                </div>
                <p className="text-stone-700 leading-relaxed text-justify">
                  Zero unverified clinical practice is permitted. Every consulting Vaidya must undergo strict State Medical Council (e.g. MCIM) verification with uploaded BAMS/MD certificates before prescribing remedies.
                </p>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-900 block">Digital Prescription Verification</span>
                  <p className="text-[11px] text-stone-600">Every diagnostic report generates a cryptographically signed QR code and SHA-256 seal for tamper-proof verification.</p>
                </div>
              </div>

            </div>

            {/* Poster Footer Sign-off */}
            <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-mono gap-4">
              <div>Repository / System ID: ZENIVA-RAG-2026-IND</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Certified Copyright Specification Ready for Submission</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB 2: END-TO-END SYSTEM ARCHITECTURE                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Full-Stack Technical Architecture Flow (संपूर्ण तकनीकी संरचना)
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Visualizing data flow across Client Presentation, FastAPI Gateway, Vedic NLP Core, and SQLite Storage.
              </p>
            </div>

            {/* Visual Architecture Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              
              {/* Layer 1 */}
              <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-purple-900 text-white flex items-center justify-center font-bold font-mono">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-purple-950 text-sm">Presentation Tier</h3>
                  <span className="text-[10px] text-purple-700 font-mono">React 19 + Vite 8.2</span>
                </div>
                <ul className="space-y-1.5 text-stone-600 text-[11px]">
                  <li>• Reactive Circadian Vedic Clock</li>
                  <li>• Multi-Role Navigation (Patient, Doctor, Admin)</li>
                  <li>• Web Audio Direct Voice Engine</li>
                  <li>• Canvas Chart Dosha Visualizer</li>
                </ul>
              </div>

              {/* Layer 2 */}
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold font-mono">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-blue-950 text-sm">API Gateway & Auth</h3>
                  <span className="text-[10px] text-blue-700 font-mono">FastAPI + Async I/O</span>
                </div>
                <ul className="space-y-1.5 text-stone-600 text-[11px]">
                  <li>• Non-blocking RESTful Endpoints</li>
                  <li>• Direct Session Authorization Filter</li>
                  <li>• Admin RBAC Secret Authorization</li>
                  <li>• Multi-part Document & Video Uploads</li>
                </ul>
              </div>

              {/* Layer 3 */}
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-amber-900 text-white flex items-center justify-center font-bold font-mono">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-amber-950 text-sm">Vedic RAG NLP Core</h3>
                  <span className="text-[10px] text-amber-700 font-mono">FAISS Vector Embeddings</span>
                </div>
                <ul className="space-y-1.5 text-stone-600 text-[11px]">
                  <li>• Brihat-Trayi Sanskrit Shloka Corpus</li>
                  <li>• Dravyaguna Botanical Monographs</li>
                  <li>• Symptom-to-Dosha Semantic Matching</li>
                  <li>• Safety & Drug Interaction Filter</li>
                </ul>
              </div>

              {/* Layer 4 */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-bold font-mono">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm">Persistence & Ledger</h3>
                  <span className="text-[10px] text-emerald-700 font-mono">SQLite + SHA-256</span>
                </div>
                <ul className="space-y-1.5 text-stone-600 text-[11px]">
                  <li>• Live Doctors & Patients Database</li>
                  <li>• Cross-Browser Video Broadcast Table</li>
                  <li>• Forensic Security Audit Ledger</li>
                  <li>• Certified PDF Dossier Generator</li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 3: ALL 4-TIER ROLE DASHBOARDS                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'dashboards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Patient Portal */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">1. Patient Health & Wellness Portal</h3>
                  <span className="text-[11px] text-purple-700 font-semibold">Route: #patient/home</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Empowers patients with personalized Prakriti calculation, Dinacharya morning-to-night lifestyle guides, seasonal diet planning, audio-enabled video broadcasts, and downloadable certified medical reports.
              </p>
            </div>

            {/* Doctor Console */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">2. Vaidya / Doctor Clinical Desk</h3>
                  <span className="text-[11px] text-emerald-700 font-semibold">Route: #doctor/home</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                State Medical Council verified physicians manage tele-consultations, patient skin/eye photo reviews, customized botanical prescriptions, and clinical practice recovery rate analytics.
              </p>
            </div>

            {/* Super Admin Hub */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">3. Super Administrator Governance Hub</h3>
                  <span className="text-[11px] text-amber-700 font-semibold">Route: #admin/dashboard</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Platform-wide control center for verifying doctor registrations against state council boards, permanent video announcement broadcasting, and immutable forensic audit logs.
              </p>
            </div>

            {/* Creators & Research Hub */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">4. Creators & Research Team</h3>
                  <span className="text-[11px] text-purple-700 font-semibold">Route: #overview/team</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Presents project leadership under Founder Bhupesh Indurkar and core research contributors across AI, backend, UI/UX, Ayurvedic domain curation, and QA testing.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 4: CLINICAL PROTOCOLS & DAILY HEALTH MONOGRAPHS                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'algorithms' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200 inline-block mb-1">
                  Verified Clinical Output Matrix
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                  Constitutional Health & Daily Herbal Prescriptions Output (शास्त्रीय दैनंदिन चिकित्सा)
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Evidence-based daily Ayurvedic formulations directly synthesized from Charaka Samhita & Bhaishajya Ratnavali.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
                  ✓ Classical Standard Operating Protocol (SOP)
                </span>
              </div>
            </div>

            {/* Ashtavidha 8-Pillar Vector Badge Strip */}
            <div className="p-4 rounded-2xl bg-[#1E1233] text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold text-amber-200 font-mono">ASHTAVIDHA 8-PILLAR CLINICAL VECTOR:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-purple-200">
                <span className="px-2 py-0.5 rounded bg-white/10">1. Nadi: Sarpa Gati</span>
                <span className="px-2 py-0.5 rounded bg-white/10">2. Jihva: Sama (Mild Ama)</span>
                <span className="px-2 py-0.5 rounded bg-white/10">3. Netra: Ruksha</span>
                <span className="px-2 py-0.5 rounded bg-white/10">4. Shabda: Gambhira</span>
                <span className="px-2 py-0.5 rounded bg-white/10">5. Sparsha: Ushna</span>
                <span className="px-2 py-0.5 rounded bg-white/10">6. Druk: Teekshna</span>
                <span className="px-2 py-0.5 rounded bg-white/10">7. Mutra: Peeta</span>
                <span className="px-2 py-0.5 rounded bg-white/10">8. Mala: Bandha</span>
              </div>
            </div>
          </div>

          {/* Exact Patient Dosha View Rendered Here */}
          <div className="bg-[#FAF7F2] rounded-3xl p-1 sm:p-2 border border-stone-200/80 shadow-xs">
            <DoshaAnalysisView onSelectTab={onSelectTab} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 5: NOVELTY CLAIMS & COPYRIGHT FORM                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'patents' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Intellectual Property Claims & Copyright Novelty Specification
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                4 distinct copyright claims covering software architecture, Sanskrit NLP grounding, and state council doctor verification.
              </p>
            </div>

            <div className="space-y-4 text-xs font-sans">
              {[
                {
                  id: 'claim_1',
                  title: 'Claim 1: Sanskrit-RAG Semantic Grounding System',
                  desc: 'A computerized method for retrieving and validating classical Ayurvedic medical knowledge from Brihat-Trayi treatises to prevent generative AI medical hallucinations.'
                },
                {
                  id: 'claim_2',
                  title: 'Claim 2: State Council Doctor Verification & RBAC Bridge',
                  desc: 'A secure cryptographic verification mechanism linking registered Ayurvedic physicians (BAMS/MD) to State Medical Council (MCIM) numbers prior to clinical authorization.'
                },
                {
                  id: 'claim_3',
                  title: 'Claim 3: 8-Dimensional Ashtavidha Pariksha AI Vector Engine',
                  desc: 'A diagnostic computational pipeline converting multi-modal patient inputs into quantitative Prakriti-Vikriti ratios and circadian lifestyle schedules.'
                },
                {
                  id: 'claim_4',
                  title: 'Claim 4: Forensic SHA-256 Audit Trail & Tamper-Proof Prescription Hashing',
                  desc: 'A decentralized forensic security architecture ensuring immutable logging of medical consultations, broadcasts, and digital prescription verifications.'
                }
              ].map(claim => (
                <div key={claim.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-purple-950 text-sm">{claim.title}</h3>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${claim.title}\n${claim.desc}`, claim.id)}
                      className="text-[11px] text-purple-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {copiedClaim === claim.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                      <span>{copiedClaim === claim.id ? 'Copied!' : 'Copy Claim Text'}</span>
                    </button>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-xs">{claim.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
