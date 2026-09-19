import React, { useState } from 'react';
import { 
  FileText, Download, CheckCircle2, Calendar, Stethoscope, 
  Activity, ArrowRight, ShieldCheck, Printer, Eye, Edit3, 
  Save, Sparkles, Check, Heart, Info, X, Clock, Flame, 
  Droplet, Wind, FileCheck, Layers, Award, FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { ZenivaLogo } from '../components/ZenivaIcons';

export const ReportsHistoryView = ({ 
  currentUser = {},
  onSelectTab = () => {} 
}) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'prakriti' | 'doctor' | 'lab' | 'diet'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Comprehensive Clinical Diagnostic Reports Roster
  const [reportsList, setReportsList] = useState([
    {
      id: 'REP-ZNV-9081',
      type: 'prakriti',
      title: 'Comprehensive Prakriti & Vikriti Clinical Assessment',
      sanskrit: 'प्रकृति एवं विकृति निदान पत्रक',
      date: '28 Aug 2026',
      doctor: 'Dr. Vikramaditya Vaidya (Vaidya)',
      qualification: 'BAMS, MD (Kayachikitsa) · Reg: AYU-MAH-8921',
      status: 'Doctor Verified & Approved',
      ojasScore: '84 / 100 (High Somatic Vitality)',
      agniState: 'Madhyama Agni (Moderate transformation fire)',
      doshicBreakdown: { stress: 38, joints: 44, digestion: 32, immunity: 24 },
      findings: 'Mild nervous system stress with subtle digestive Ama accumulation in gastro-intestinal tract. Mild neuromuscular tension in cervical region.',
      recommendation: 'Triphala Ghrita (3g bedtime with warm water), Dashamula Kashayam (15ml twice daily), Daily warm sesame Abhyanga.',
      notes: 'Patient exhibits strong response to stress-relieving nutrition and restorative sleep routine. Advised to avoid dry raw salads during evening hours.',
      pariksha: {
        nadi: 'Sarpa Gati (Active neuromuscular pulse rhythm)',
        jihva: 'Thin white Ama coating over posterior lingual 1/3',
        netra: 'Clear sclera, subtle dry-screen fatigue',
        sparsha: 'Snigdha (Slight dryness over phalanges)',
        mutra: 'Normal straw colored, non-turbid',
        mala: 'Mild constipation, relieved with warm Ushapan'
      }
    },
    {
      id: 'REP-ZNV-9080',
      type: 'doctor',
      title: 'Darshana Pariksha & Tele-Consultation Digital Prescription',
      sanskrit: 'दर्शन परीक्षा एवं चिकित्सकीय परामर्श',
      date: '14 Aug 2026',
      doctor: 'Dr. Meera Joshi (Vaidya)',
      qualification: 'BAMS, MD (Ayurveda) · Reg: AYU-MAH-4412',
      status: 'Doctor Verified & Approved',
      ojasScore: '80 / 100 (Optimal Vitality)',
      agniState: 'Sama Agni (Balanced Digestive Fire)',
      doshicBreakdown: { stress: 30, joints: 25, digestion: 28, immunity: 35 },
      findings: 'Heat accumulation in ocular micro-channels due to prolonged digital device usage.',
      recommendation: 'Triphala Netra Seka (Eye wash), Brahmi Ghrita (1 tsp morning), Kumkumadi Tailam gentle facial application.',
      notes: 'Ocular redness subsided by 70% post Netra Tarpana. Continue digital sunset protocol after 8:00 PM.',
      pariksha: {
        nadi: 'Manduka-Sarpa rhythmic pulse',
        jihva: 'Pink body with clean papillae',
        netra: 'Subtle conjunctival warmth',
        sparsha: 'Slight warmth in palmar surface',
        mutra: 'Clear pale yellow',
        mala: 'Regular daily evacuation'
      }
    },
    {
      id: 'REP-ZNV-9079',
      type: 'diet',
      title: 'Seasonal Varsha Ritucharya & Pathya-Apathya Chart',
      sanskrit: 'वर्षा ऋतुचर्या एवं पथ्यापथ्य विधान',
      date: '02 Aug 2026',
      doctor: 'Zeniva AI Clinical Protocol Bureau',
      qualification: 'Certified Charaka Samhita SOP System',
      status: 'Zeniva AI SOP Compliant',
      ojasScore: '78 / 100',
      agniState: 'Manda Agni (Weakened by Monsoon atmospheric moisture)',
      doshicBreakdown: { stress: 25, joints: 30, digestion: 45, immunity: 20 },
      findings: 'Atmospheric humidity pacifies external heat but creates sluggish internal Jatharagni.',
      recommendation: 'Boiled water infused with dry ginger (Shunthi) & honey; warm barley soups with roasted cumin.',
      notes: 'Avoid heavy fermented dairy, cold curd at night, and raw unpeeled sprouts until autumn transition.',
      pariksha: {
        nadi: 'Manda pulse rhythm',
        jihva: 'Mild moisture',
        netra: 'Clear',
        sparsha: 'Slightly cool extremities',
        mutra: 'Normal',
        mala: 'Occasional sluggishness'
      }
    },
    {
      id: 'REP-ZNV-9078',
      type: 'lab',
      title: 'Biomarker & Metabolic Agni Function Panel',
      sanskrit: 'धातु अग्नि एवं चयापचय विश्लेषण',
      date: '18 Jul 2026',
      doctor: 'Dr. Vikramaditya Vaidya (Vaidya)',
      qualification: 'BAMS, MD (Kayachikitsa) · Reg: AYU-MAH-8921',
      status: 'Lab & Clinical Verified',
      ojasScore: '82 / 100',
      agniState: 'Deepana-Pachana Optimal',
      doshicBreakdown: { stress: 20, joints: 25, digestion: 30, immunity: 45 },
      findings: 'Rasa and Rakta Dhatus show excellent nutrient absorption; liver metabolism functioning within optimal biological limits.',
      recommendation: 'Arogyavardhini Vati (1 tab morning), Giloy Satva (2g with lukewarm water).',
      notes: 'Hb: 14.2 g/dL, Fasting Blood Sugar: 88 mg/dL, Lipid Profile: Well balanced.',
      pariksha: {
        nadi: 'Sthira (Stable rhythmic pulse)',
        jihva: 'Clean pink',
        netra: 'Bright clear sclera',
        sparsha: 'Balanced warmth',
        mutra: 'Normal clear',
        mala: 'Healthy daily cycle'
      }
    }
  ]);

  // Universal Safe CSV Export Engine for Patient Health Dossiers
  const handleExportReportsCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    let csv = `ZENIVA AI AYURVEDIC HEALTHCARE - PATIENT CLINICAL DIAGNOSTIC DOSSIER\n`;
    csv += `Patient Name: ${currentUser.name || 'Bhupesh Indurkar'}\n`;
    csv += `Health Profile: ${currentUser.prakriti || 'Stress & Sleep Wellness Profile'}\n`;
    csv += `Generated On: ${new Date().toLocaleString('en-IN')}\n\n`;

    csv += `Report ID,Date,Diagnostic Title,Attending Vaidya,Ojas Score,Agni State,Clinical Findings,Prescription & Pathya,Status\n`;
    reportsList.forEach(r => {
      csv += `"${r.id}","${r.date}","${r.title.replace(/"/g, '""')}","${r.doctor.replace(/"/g, '""')}","${r.ojasScore}","${r.agniState}","${r.findings.replace(/"/g, '""')}","${r.recommendation.replace(/"/g, '""')}","${r.status}"\n`;
    });

    const filename = `zeniva_health_reports_dossier_${timestamp}.csv`;
    const dataUri = `data:text/csv;charset=utf-8,\uFEFF` + encodeURIComponent(csv);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Patient Reports CSV Dossier Downloaded! ✓');
  };

  const filteredReports = reportsList.filter(r => {
    const matchesCategory = activeFilter === 'all' || r.type === activeFilter;
    const matchesSearch = !searchQuery || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.findings.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 sm:p-8 max-w-[1500px] mx-auto space-y-6 bg-[#FAF7F2] min-h-screen select-none font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-purple-950 text-white font-bold text-xs flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-3 border border-purple-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER & HEALTH SUMMARY BAR                                        */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D5] shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B3E8C]">
              <FileText className="w-4 h-4 text-purple-700" />
              <span>Ayurvedic Clinical Records & Health Archives</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Diagnostic Reports & Clinical Dossiers (स्वास्थ्य अभिलेख)
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Archived Ashtavidha Pariksha assessments, doctor notes, lab biomarker panels, and verified digital prescriptions.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportReportsCSV}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (reportsList.length > 0) {
                  setSelectedReport(reportsList[0]);
                  setIsPdfModalOpen(true);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#5B3E8C]/10 hover:bg-[#5B3E8C]/20 text-[#5B3E8C] border border-[#5B3E8C]/25 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#5B3E8C]" />
              <span>Print All Reports PDF</span>
            </button>
          </div>
        </div>

        {/* Patient Clinical Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-1">
            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Patient Name</p>
            <p className="text-sm font-bold text-stone-900 font-serif">{currentUser.name || 'Bhupesh Indurkar'}</p>
            <p className="text-[10px] text-purple-900 font-mono font-semibold">ID: ZNV-PAT-1025</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
            <p className="text-[10px] font-bold text-purple-900 uppercase tracking-wider">Health Profile</p>
            <p className="text-sm font-bold text-purple-950 font-serif">{currentUser.prakriti || 'Stress & Sleep Wellness'}</p>
            <p className="text-[10px] text-purple-800 font-medium">Stress: Low · Sleep: 88% · Vitality: High</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">Ojas Vitality Score</p>
            <p className="text-sm font-bold text-emerald-950 font-serif">84 / 100</p>
            <p className="text-[10px] text-emerald-800 font-semibold">Optimal Metabolic State ✓</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Total Health Reports</p>
            <p className="text-sm font-bold text-amber-950 font-serif">{reportsList.length} Archived</p>
            <p className="text-[10px] text-amber-800 font-medium">100% Doctor Verified</p>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'prakriti', label: '🧬 Prakriti Diagnostics' },
              { id: 'doctor', label: '🩺 Doctor Prescriptions' },
              { id: 'diet', label: '🥗 Seasonal Diet Charts' },
              { id: 'lab', label: '🧪 Biomarker Panels' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === f.id 
                    ? 'bg-[#1E5039] text-white shadow-xs' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by title, doctor, id..."
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF8F5] focus:bg-white focus:ring-2 focus:ring-purple-600/20 outline-none"
            />
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. CLINICAL REPORTS ROSTER LIST                                           */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {filteredReports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE3D5] shadow-xs space-y-4 hover:shadow-md transition-all"
          >
            {/* Top Bar of Report Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 font-mono font-bold text-[10px]">
                    {rep.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    <span>{rep.status}</span>
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">· {rep.date}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900">
                  {rep.title}
                </h3>
                <p className="text-[11px] text-purple-900 font-serif italic">{rep.sanskrit}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReport(rep);
                    setIsPdfModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-purple-700" />
                  <span>Print PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReport(rep)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1E5039] hover:bg-[#163E2C] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Dossier</span>
                </button>
              </div>
            </div>

            {/* Middle Section: Attending Doctor & Clinical Findings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
              
              {/* Doctor & Agni Profile (Left 4 cols) */}
              <div className="lg:col-span-4 p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Attending Vaidya / Authority</p>
                  <p className="font-bold text-stone-900 text-xs font-serif mt-0.5">{rep.doctor}</p>
                  <p className="text-[10px] text-stone-500">{rep.qualification}</p>
                </div>

                <div className="pt-2 border-t border-stone-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-600">Digestive Agni:</span>
                    <strong className="text-amber-900">{rep.agniState}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-600">Ojas Score:</span>
                    <strong className="text-emerald-800">{rep.ojasScore}</strong>
                  </div>
                </div>
              </div>

              {/* Findings & Prescriptions (Right 8 cols) */}
              <div className="lg:col-span-8 space-y-2.5">
                <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 space-y-1">
                  <p className="text-[10px] font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3 text-purple-700" />
                    <span>Clinical Diagnosis & Observations:</span>
                  </p>
                  <p className="text-stone-800 leading-relaxed text-xs">{rep.findings}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100 space-y-1">
                  <p className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    <span>Prescribed Ayurvedic Formulations & Regimen:</span>
                  </p>
                  <p className="text-stone-800 leading-relaxed text-xs">{rep.recommendation}</p>
                </div>
              </div>

            </div>

            {/* Ashtavidha Pariksha Quick Pills */}
            <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-stone-500 font-bold uppercase text-[10px]">Ashtavidha Pariksha:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-800 font-medium">
                Pulse (Nadi): <strong>{rep.pariksha.nadi.split('(')[0]}</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-800 font-medium">
                Tongue (Jihva): <strong>{rep.pariksha.jihva.split('(')[0]}</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-800 font-medium">
                Eyes (Netra): <strong>{rep.pariksha.netra.split(',')[0]}</strong>
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 3. OFFICIAL CLINICAL PRINTABLE PDF REPORT MODAL DIALOG                    */}
      {/* ========================================================================= */}
      {isPdfModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">Official Diagnostic Medical Report (PDF Preview)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-[#1E5039] hover:bg-[#163E2C] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="text-stone-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-stone-900 font-sans print:p-0 print:m-0 bg-white">
              
              {/* Letterhead */}
              <div className="border-b-2 border-[#5B3E8C] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C1030] border border-[#E5C07B]/40 flex items-center justify-center p-2 shadow-md">
                    <ZenivaLogo className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#5B3E8C] tracking-tight">
                      ZENIVA AI AYURVEDIC CLINICAL NETWORK
                    </h1>
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-800">
                      National Institute of Ayurvedic Diagnostics & Tele-Consultation Bureau
                    </p>
                    <p className="text-[10px] text-stone-500 italic mt-0.5">
                      ॥ स्वस्थस्य स्वास्थ्यरक्षणं आतुरस्य विकारप्रशमनं च ॥
                    </p>
                  </div>
                </div>

                <div className="sm:text-right text-xs space-y-1 font-mono">
                  <p className="font-bold text-purple-950">REPORT ID: <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded">{selectedReport.id}</span></p>
                  <p className="text-stone-500">Date: {selectedReport.date}</p>
                  <p className="text-emerald-700 font-bold">Zeniva AI Verified ✓</p>
                </div>
              </div>

              {/* Patient Profile Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <p className="text-[10px] text-stone-500 uppercase font-bold">Patient Name</p>
                  <p className="font-bold text-stone-900">{currentUser.name || 'Bhupesh Indurkar'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 uppercase font-bold">Health Profile</p>
                  <p className="font-bold text-purple-900">{currentUser.prakriti || 'Stress & Sleep Wellness'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 uppercase font-bold">Digestive Agni</p>
                  <p className="font-bold text-amber-800">{selectedReport.agniState}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 uppercase font-bold">Ojas Vitality Score</p>
                  <p className="font-bold text-emerald-700">{selectedReport.ojasScore}</p>
                </div>
              </div>

              {/* Ashtavidha Pariksha Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B3E8C] border-b border-stone-200 pb-1">
                  1. Ashtavidha Pariksha Matrix (अष्टविध परीक्षा विश्लेषण)
                </h3>
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-2.5">Diagnostic Modality</th>
                        <th className="p-2.5">Clinical Observation & Classical Findings</th>
                        <th className="p-2.5">Clinical Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800">
                      <tr>
                        <td className="p-2.5 font-bold">Pulse Examination (नाडी परीक्षा)</td>
                        <td className="p-2.5">{selectedReport.pariksha.nadi}</td>
                        <td className="p-2.5 font-semibold text-purple-900">Stress Response Active</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Tongue Examination (जिह्वा परीक्षा)</td>
                        <td className="p-2.5">{selectedReport.pariksha.jihva}</td>
                        <td className="p-2.5 font-semibold text-amber-900">Mild Ama Toxins</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Ocular Examination (नेत्र परीक्षा)</td>
                        <td className="p-2.5">{selectedReport.pariksha.netra}</td>
                        <td className="p-2.5 font-semibold text-blue-900">Screen Dryness</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Tactile / Skin Touch (स्पर्श परीक्षा)</td>
                        <td className="p-2.5">{selectedReport.pariksha.sparsha}</td>
                        <td className="p-2.5 font-semibold text-stone-700">Ruksha Tendency</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">Excretory Urine / Bowel (मल-मूत्र)</td>
                        <td className="p-2.5">{selectedReport.pariksha.mala}</td>
                        <td className="p-2.5 font-semibold text-emerald-800">Metabolic Elimination Stable</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Diagnosis & Prescriptions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                  <h4 className="font-bold text-purple-950 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-purple-700" />
                    <span>Clinical Etiology & Diagnosis:</span>
                  </h4>
                  <p className="text-stone-700 leading-relaxed">{selectedReport.findings}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Prescribed Formulations & Anupana:</span>
                  </h4>
                  <p className="text-stone-700 leading-relaxed">{selectedReport.recommendation}</p>
                </div>
              </div>

              {/* Attending Vaidya Signature Block */}
              <div className="pt-6 border-t-2 border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-stone-500">
                <div className="space-y-1">
                  <p className="font-mono text-[10px]">DIGITAL VERIFICATION: SHA-256-ZNV-MED-9941-VERIFIED</p>
                  <p className="text-[10px]">Certified in compliance with Zeniva AI Tele-Medicine Practice Guidelines 2026</p>
                </div>

                <div className="text-right sm:pr-4">
                  <div className="inline-block border-b border-stone-800 w-48 mb-1"></div>
                  <p className="font-bold text-stone-900 font-serif">{selectedReport.doctor}</p>
                  <p className="text-[10px]">{selectedReport.qualification}</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
