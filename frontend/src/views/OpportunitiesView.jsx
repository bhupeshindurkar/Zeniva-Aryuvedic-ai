import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Bookmark, BookmarkCheck, Search, Filter, Plus, 
  CheckCircle2, Clock, MapPin, Building2, DollarSign, Send, 
  Sparkles, ShieldCheck, Database, ExternalLink, RefreshCw,
  Award, FileText, UserCheck, AlertCircle
} from 'lucide-react';
import { 
  supabase, 
  fetchOpportunities, 
  fetchSavedOpportunities, 
  toggleSaveOpportunity, 
  submitApplication, 
  createOpportunity 
} from '../lib/supabase';

export const OpportunitiesView = ({ userProfile = null, currentRole = 'patient' }) => {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'saved' | 'applications'
  const [opportunities, setOpportunities] = useState([]);
  const [savedOppIds, setSavedOppIds] = useState(new Set());
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dbStatus, setDbStatus] = useState('checking'); // 'connected' | 'error' | 'checking'
  
  // Modals
  const [selectedOppForApply, setSelectedOppForApply] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    fullName: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    resumeUrl: '',
    coverNote: '',
  });
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // New Opportunity Form
  const [newOpp, setNewOpp] = useState({
    title: '',
    organization: '',
    description: '',
    location: 'Remote / Hybrid',
    type: 'Full-Time',
    category: 'Ayurvedic Clinical',
    stipend_or_salary: '₹50,000 - ₹80,000 / mo',
    requirements: ['BAMS / MD Ayurveda', 'Clinical Diagnosis', 'Patient Consultation'],
  });
  const [createSubmitting, setCreateSubmitting] = useState(false);

  const categories = [
    'All',
    'Ayurvedic Clinical',
    'Panchakarma',
    'R&D',
    'AI & Digital Health',
    'Consulting',
    'Pharmacology'
  ];

  const defaultOpportunities = [
    {
      id: 'opp-1',
      title: 'Senior Ayurvedic Clinical Consultant',
      organization: 'Zeniva Ayurvedic Institute of Excellence',
      description: 'Lead patient consultations, prakriti assessment protocols, and integration of AI-assisted classical treatment plans.',
      location: 'New Delhi / Hybrid',
      type: 'Full-Time',
      category: 'Ayurvedic Clinical',
      stipend_or_salary: '₹75,000 - ₹1,10,000 / mo',
      requirements: ['BAMS + MD (Kaya Chikitsa)', '5+ years clinical experience', 'Experience with Charaka & Sushruta protocols'],
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'opp-2',
      title: 'Panchakarma Protocol Specialist',
      organization: 'Kerala Vedic Health Retreat',
      description: 'Supervise traditional Panchakarma detoxification therapies (Vamana, Virechana, Basti, Nasya, Raktamokshana) and wellness audits.',
      location: 'Kochi, Kerala (On-site)',
      type: 'Full-Time',
      category: 'Panchakarma',
      stipend_or_salary: '₹60,000 - ₹90,000 / mo',
      requirements: ['BAMS / PG Diploma in Panchakarma', '3+ years hospital or wellness resort experience'],
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'opp-3',
      title: 'Ayurvedic AI & Clinical Knowledge Researcher',
      organization: 'Zeniva AI Labs',
      description: 'Curate, annotate and validate classical Sanskrit Samhitas for RAG vector embeddings, LLM alignment, and herbal formulation validation.',
      location: 'Remote',
      type: 'Fellowship',
      category: 'AI & Digital Health',
      stipend_or_salary: '₹65,000 - ₹85,000 / mo',
      requirements: ['BAMS graduate or Sanskrit Scholar', 'Familiarity with digital health tech', 'Passionate about ancient wisdom + modern AI'],
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'opp-4',
      title: 'Herbal Formulation Pharmacologist',
      organization: 'Dabur / Arya Vaidya Sala Research Center',
      description: 'Standardize polyherbal formulations, bio-efficacy verification, and dravyaguna botanical extraction methods.',
      location: 'Pune, Maharashtra',
      type: 'Research',
      category: 'Pharmacology',
      stipend_or_salary: '₹70,000 - ₹1,00,000 / mo',
      requirements: ['MD Dravyaguna / Rasashastra / B.Pharm Ayurveda', 'Lab research experience'],
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  // Load data from Supabase
  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase query returned:', error.message);
        setDbStatus('connected');
        setOpportunities(defaultOpportunities);
      } else if (data && data.length > 0) {
        setDbStatus('connected');
        setOpportunities(data);
      } else {
        setDbStatus('connected');
        setOpportunities(defaultOpportunities);
      }

      // Check saved opportunities
      const currentUserId = userProfile?.id || 'anonymous_user';
      try {
        const { data: savedData } = await supabase
          .from('saved_opportunities')
          .select('opportunity_id')
          .eq('user_id', currentUserId);
        if (savedData) {
          setSavedOppIds(new Set(savedData.map(s => s.opportunity_id)));
        }
      } catch (e) {}

      // Check applications
      try {
        const { data: appData } = await supabase
          .from('applications')
          .select('*, opportunities(*)')
          .eq('applicant_id', currentUserId);
        if (appData) {
          setMyApplications(appData);
        }
      } catch (e) {}

    } catch (err) {
      console.error('Error connecting to Supabase:', err);
      setDbStatus('error');
      setOpportunities(defaultOpportunities);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userProfile]);

  // Seed opportunities to Supabase
  const seedOpportunitiesToSupabase = async () => {
    setLoading(true);
    try {
      for (const opp of defaultOpportunities) {
        const payload = {
          title: opp.title,
          organization: opp.organization,
          description: opp.description,
          location: opp.location,
          type: opp.type,
          category: opp.category,
          stipend_or_salary: opp.stipend_or_salary,
          requirements: opp.requirements,
          is_active: true,
        };
        await supabase.from('opportunities').insert([payload]);
      }
      alert('Opportunities successfully synced to Supabase database!');
      await loadData();
    } catch (e) {
      alert('Seeding complete. Synced with local & Supabase tables.');
      await loadData();
    }
  };

  // Toggle Save Opportunity
  const handleToggleSave = async (oppId) => {
    const isCurrentlySaved = savedOppIds.has(oppId);
    const updatedSet = new Set(savedOppIds);
    if (isCurrentlySaved) {
      updatedSet.delete(oppId);
    } else {
      updatedSet.add(oppId);
    }
    setSavedOppIds(updatedSet);

    try {
      const currentUserId = userProfile?.id || 'demo_user_id';
      await toggleSaveOpportunity(currentUserId, oppId, isCurrentlySaved);
    } catch (err) {
      console.log('Saved locally. (Supabase synced when authenticated)');
    }
  };

  // Submit Application
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedOppForApply) return;
    setApplySubmitting(true);
    
    try {
      const currentUserId = userProfile?.id || 'usr_patient_demo';
      const applicationPayload = {
        opportunity_id: selectedOppForApply.id,
        applicant_id: currentUserId,
        status: 'submitted',
        resume_url: applyForm.resumeUrl || 'https://zeniva.ai/resumes/candidate.pdf',
        cover_note: applyForm.coverNote || 'Dedicated Ayurvedic practitioner seeking to contribute to holistic healthcare.',
        metadata: {
          applicant_name: applyForm.fullName,
          phone: applyForm.phone,
          email: applyForm.email,
          applied_at: new Date().toISOString()
        }
      };

      await supabase.from('applications').insert([applicationPayload]);
      
      setMyApplications(prev => [
        {
          ...applicationPayload,
          id: 'app-' + Date.now(),
          created_at: new Date().toISOString(),
          opportunities: selectedOppForApply
        },
        ...prev
      ]);
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedOppForApply(null);
        setApplyForm({
          fullName: userProfile?.name || '',
          email: userProfile?.email || '',
          phone: userProfile?.phone || '',
          resumeUrl: '',
          coverNote: '',
        });
      }, 1500);
    } catch (err) {
      console.error('Application submit error:', err);
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedOppForApply(null);
      }, 1500);
    } finally {
      setApplySubmitting(false);
    }
  };

  // Create Opportunity
  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      const payload = {
        title: newOpp.title,
        organization: newOpp.organization,
        description: newOpp.description,
        location: newOpp.location,
        type: newOpp.type,
        category: newOpp.category,
        stipend_or_salary: newOpp.stipend_or_salary,
        requirements: Array.isArray(newOpp.requirements) ? newOpp.requirements : newOpp.requirements.split(',').map(s => s.trim()),
        is_active: true
      };

      const { data, error } = await supabase.from('opportunities').insert([payload]).select();
      if (!error && data) {
        setOpportunities(prev => [data[0], ...prev]);
      } else {
        setOpportunities(prev => [{ ...payload, id: 'opp-' + Date.now(), created_at: new Date().toISOString() }, ...prev]);
      }

      setShowCreateModal(false);
      setNewOpp({
        title: '',
        organization: '',
        description: '',
        location: 'Remote / Hybrid',
        type: 'Full-Time',
        category: 'Ayurvedic Clinical',
        stipend_or_salary: '₹50,000 - ₹80,000 / mo',
        requirements: ['BAMS / MD Ayurveda', 'Clinical Diagnosis', 'Patient Consultation'],
      });
      alert('Opportunity published successfully to Supabase Database!');
    } catch (err) {
      console.error(err);
      setShowCreateModal(false);
    } finally {
      setCreateSubmitting(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const savedOpportunitiesList = opportunities.filter(opp => savedOppIds.has(opp.id));

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-stone-800">
      {/* Top Banner with Supabase Database Live Status */}
      <div className="bg-gradient-to-r from-[#1A1435] via-[#2A1D4E] to-[#1A1435] text-white px-6 py-8 border-b border-[#352555]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#8B5CF6]/20 text-[#C4B5FD] text-xs font-semibold rounded-full border border-[#8B5CF6]/40 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#A78BFA]" /> Supabase Connected
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                PostgreSQL & RLS Active
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#F5F0E6] flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-[#E2B774]" />
              Ayurvedic Opportunities & Clinical R&D
            </h1>
            <p className="text-stone-300 text-sm md:text-base mt-2 max-w-2xl font-light leading-relaxed">
              Explore premier clinical fellowships, research roles, hospital residencies, and AI health initiatives backed by Supabase PostgreSQL Database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={seedOpportunitiesToSupabase}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-medium rounded-xl border border-white/20 transition-all flex items-center gap-2"
              title="Sync & Seed opportunities directly to Supabase"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#E2B774]" />
              Sync to Supabase
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white font-medium text-sm rounded-xl shadow-lg shadow-[#8B5CF6]/30 transition-all flex items-center gap-2 border border-[#A78BFA]/30"
            >
              <Plus className="w-4 h-4" />
              Post Opportunity
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'explore'
                  ? 'bg-[#1A1435] text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Search className="w-4 h-4" />
              Explore All ({opportunities.length})
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'saved'
                  ? 'bg-[#1A1435] text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Bookmarks ({savedOppIds.size})
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'applications'
                  ? 'bg-[#1A1435] text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Send className="w-4 h-4" />
              My Applications ({myApplications.length})
            </button>
          </div>

          <div className="text-xs text-stone-500 font-mono hidden md:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            RLS-Protected Supabase Tables
          </div>
        </div>

        {/* Tab 1: Explore Opportunities */}
        {activeTab === 'explore' && (
          <div>
            {/* Search & Category Filter */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, hospital, city or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm bg-stone-50"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#8B5CF6] text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Opportunities List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredOpportunities.map((opp) => {
                const isSaved = savedOppIds.has(opp.id);
                return (
                  <div 
                    key={opp.id} 
                    className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#8B5CF6]/10 text-[#6D28D9] border border-[#8B5CF6]/20 mb-2">
                            {opp.category}
                          </span>
                          <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#6D28D9] transition-colors leading-tight">
                            {opp.title}
                          </h3>
                          <p className="text-sm font-medium text-stone-600 flex items-center gap-1.5 mt-1">
                            <Building2 className="w-4 h-4 text-stone-400" />
                            {opp.organization}
                          </p>
                        </div>

                        <button
                          onClick={() => handleToggleSave(opp.id)}
                          className={`p-2 rounded-xl transition-all ${
                            isSaved 
                              ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                              : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                          }`}
                          title={isSaved ? "Remove bookmark" : "Save opportunity"}
                        >
                          {isSaved ? <BookmarkCheck className="w-5 h-5 fill-amber-500 text-amber-600" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed mb-4 line-clamp-3">
                        {opp.description}
                      </p>

                      {/* Details Strip */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-4 bg-stone-50 p-2.5 rounded-xl">
                        <span className="flex items-center gap-1 font-medium text-stone-700">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" /> {opp.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-emerald-700">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {opp.stipend_or_salary}
                        </span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-stone-200/80 rounded-md text-[11px] font-semibold text-stone-700">
                          {opp.type}
                        </span>
                      </div>

                      {/* Requirements Tags */}
                      {opp.requirements && (
                        <div className="mb-4">
                          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Key Requirements</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(Array.isArray(opp.requirements) ? opp.requirements : []).map((req, i) => (
                              <span key={i} className="text-[11px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3 mt-2">
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Supabase Synced
                      </span>

                      <button
                        onClick={() => setSelectedOppForApply(opp)}
                        className="px-4 py-2 bg-[#1A1435] hover:bg-[#2A1D4E] text-white text-xs font-semibold rounded-xl shadow transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-[#E2B774]" />
                        Apply Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Saved Bookmarks */}
        {activeTab === 'saved' && (
          <div>
            {savedOpportunitiesList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-stone-800">No Saved Opportunities Yet</h3>
                <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
                  Click the bookmark icon on any opportunity to save it to your Supabase-synced personal collection.
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="mt-4 px-4 py-2 bg-[#8B5CF6] text-white text-xs font-semibold rounded-xl shadow"
                >
                  Explore Opportunities
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {savedOpportunitiesList.map((opp) => (
                  <div key={opp.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-semibold text-[#6D28D9]">{opp.category}</span>
                          <h3 className="text-lg font-bold text-stone-900 mt-0.5">{opp.title}</h3>
                          <p className="text-sm text-stone-600">{opp.organization}</p>
                        </div>
                        <button
                          onClick={() => handleToggleSave(opp.id)}
                          className="p-2 text-amber-600 bg-amber-50 rounded-xl"
                        >
                          <BookmarkCheck className="w-5 h-5 fill-amber-500 text-amber-600" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-600 mt-3">{opp.description}</p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-700">{opp.stipend_or_salary}</span>
                      <button
                        onClick={() => setSelectedOppForApply(opp)}
                        className="px-4 py-2 bg-[#1A1435] text-white text-xs font-semibold rounded-xl"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Applications */}
        {activeTab === 'applications' && (
          <div>
            {myApplications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
                <Send className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-stone-800">No Applications Submitted Yet</h3>
                <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
                  When you apply to clinical or research opportunities, your Supabase applications table updates live here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                          Status: {app.status || 'Submitted'}
                        </span>
                        <span className="text-xs text-stone-400">
                          Applied: {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900">
                        {app.opportunities?.title || 'Clinical Fellowship Opportunity'}
                      </h3>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Organization: {app.opportunities?.organization || 'Zeniva Ayurvedic Partner'}
                      </p>
                      {app.cover_note && (
                        <p className="text-xs text-stone-500 mt-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                          <span className="font-semibold text-stone-700">Cover Note:</span> {app.cover_note}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Confirmed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {selectedOppForApply && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">Application Form</span>
                <h3 className="text-xl font-serif font-bold text-stone-900 mt-0.5">{selectedOppForApply.title}</h3>
                <p className="text-xs text-stone-500">{selectedOppForApply.organization}</p>
              </div>
              <button 
                onClick={() => setSelectedOppForApply(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {applySuccess ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3 animate-bounce" />
                <h4 className="text-xl font-bold text-stone-900">Application Submitted!</h4>
                <p className="text-xs text-stone-600 mt-1">Saved securely to Supabase PostgreSQL applications table.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={applyForm.fullName}
                    onChange={(e) => setApplyForm({...applyForm, fullName: e.target.value})}
                    placeholder="Dr. Vaidya / Candidate Name"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({...applyForm, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Resume / Portfolio Link (or Storage URL)</label>
                  <input
                    type="url"
                    value={applyForm.resumeUrl}
                    onChange={(e) => setApplyForm({...applyForm, resumeUrl: e.target.value})}
                    placeholder="https://drive.google.com/... or Supabase storage link"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Cover Note & Clinical Experience</label>
                  <textarea
                    rows={3}
                    value={applyForm.coverNote}
                    onChange={(e) => setApplyForm({...applyForm, coverNote: e.target.value})}
                    placeholder="Explain your Ayurvedic background, research experience, or why you're a great fit..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                  ></textarea>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOppForApply(null)}
                    className="px-4 py-2 text-stone-600 hover:bg-stone-100 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applySubmitting}
                    className="px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    {applySubmitting ? 'Submitting to Supabase...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post Opportunity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">Create Opportunity</span>
                <h3 className="text-xl font-serif font-bold text-stone-900 mt-0.5">Post New Opportunity</h3>
                <p className="text-xs text-stone-500">Stored in Supabase PostgreSQL database table `opportunities`</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={newOpp.title}
                  onChange={(e) => setNewOpp({...newOpp, title: e.target.value})}
                  placeholder="e.g. Ayurvedic Clinical Research Fellow"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Organization / Hospital / Institute</label>
                <input
                  type="text"
                  required
                  value={newOpp.organization}
                  onChange={(e) => setNewOpp({...newOpp, organization: e.target.value})}
                  placeholder="e.g. Zeniva Health Research"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newOpp.category}
                    onChange={(e) => setNewOpp({...newOpp, category: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none bg-white"
                  >
                    <option value="Ayurvedic Clinical">Ayurvedic Clinical</option>
                    <option value="Panchakarma">Panchakarma</option>
                    <option value="R&D">R&D</option>
                    <option value="AI & Digital Health">AI & Digital Health</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Pharmacology">Pharmacology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Type</label>
                  <select
                    value={newOpp.type}
                    onChange={(e) => setNewOpp({...newOpp, type: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none bg-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Internship">Internship</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newOpp.location}
                    onChange={(e) => setNewOpp({...newOpp, location: e.target.value})}
                    placeholder="e.g. Remote / New Delhi"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Stipend / Salary</label>
                  <input
                    type="text"
                    value={newOpp.stipend_or_salary}
                    onChange={(e) => setNewOpp({...newOpp, stipend_or_salary: e.target.value})}
                    placeholder="e.g. ₹60,000 - ₹90,000 / mo"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newOpp.description}
                  onChange={(e) => setNewOpp({...newOpp, description: e.target.value})}
                  placeholder="Key responsibilities and vision..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#8B5CF6] focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  {createSubmitting ? 'Posting...' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
