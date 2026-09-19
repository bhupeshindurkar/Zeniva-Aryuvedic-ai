import React, { useState } from 'react';
import { 
  Activity, Sparkles, Wind, Flame, Droplet, CheckCircle2, 
  ArrowRight, RotateCcw, Award, Info, Sliders, ShieldCheck, 
  BookOpen, ChevronRight, Moon, Zap, Shield, HeartPulse,
  Clock, Coffee, Sun, Search, Check, AlertCircle, Pill
} from 'lucide-react';

export const DoshaAnalysisView = ({ onSelectTab = () => {} }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubSystem, setSelectedSubSystem] = useState('prana_cognitive');

  // 4 Primary Daily Life Health Concerns & Herbal Monographs
  const dailyHealthMonographs = [
    {
      id: 'stress_sleep',
      category: 'mental_health',
      badge: 'Manovaha Srotas (मनोवह स्रोतस्)',
      title: '1. Stress, Anxiety & Insomnia',
      subtitle: 'Nervous Agitation, Overthinking, High Cortisol & Poor Sleep Quality',
      themeColor: 'purple',
      icon: '🌙',
      bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-200 hover:border-purple-400',
      tagColor: 'bg-purple-100 text-purple-900 border-purple-200',
      herbs: [
        {
          name: 'Ashwagandha',
          botanical: 'Withania somnifera (Winter Cherry)',
          dosage: '500mg - 1g • Bedtime with Warm Cow Milk',
          anupana: 'Warm Milk + pinch of Cardamom / Ghee',
          benefit: 'Significantly lowers systemic cortisol, eliminates nervous tremors, and induces restorative deep delta-wave sleep.',
          tags: ['Cortisol Reducer', 'Deep Sleep', 'Adaptogen']
        },
        {
          name: 'Shankhpushpi',
          botanical: 'Convolvulus pluricaulis',
          dosage: '2g - 3g Churna / 10ml Syrup • Twice Daily',
          anupana: 'Fresh Water or Cow Milk',
          benefit: 'Calms mental chatter, relieves exam/work tension, soothes cranial nerves, and prevents stress-induced headaches.',
          tags: ['Overthinking Relief', 'Memory Booster', 'Neuro-Calm']
        },
        {
          name: 'Brahmi',
          botanical: 'Bacopa monnieri',
          dosage: '250mg - 500mg Extract / 1 tsp Ghrita in Morning',
          anupana: 'Warm Water on Empty Stomach',
          benefit: 'Enhances cognitive clarity, sharpens focus, repairs synapses, and delivers serene mental calmness under pressure.',
          tags: ['Cognitive Focus', 'Synaptic Repair', 'Brain Tonic']
        }
      ]
    },
    {
      id: 'digestion_acidity',
      category: 'digestive_health',
      badge: 'Annavaha Srotas & Agni (अन्नवह स्रोतस्)',
      title: '2. Acidity, Gas & Digestive Impairment',
      subtitle: 'Mandagni, Acid Reflux, Bloating, Sour Belching & Sluggish Bowels',
      themeColor: 'amber',
      icon: '🔥',
      bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-200 hover:border-amber-400',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-200',
      herbs: [
        {
          name: 'Avipattikar Churna',
          botanical: 'Classical Formulation (Bhaishajya Ratnavali)',
          dosage: '3g - 5g • Immediately Post-Meals (Twice Daily)',
          anupana: 'Cool or Lukewarm Water / Coconut Water',
          benefit: 'Neutralizes excessive stomach acid, heals gastric mucosal lining, cures heartburn, and stops acid reflux.',
          tags: ['Acid Reflux Relief', 'Acidity Neutralizer', 'Heartburn Cure']
        },
        {
          name: 'Trikatu Churna',
          botanical: 'Sunthi (Ginger) + Maricha (Black Pepper) + Pippali (Long Pepper)',
          dosage: '500mg - 1g • 15 Mins Before Meals',
          anupana: '1 tsp Organic Honey or Warm Water',
          benefit: 'Kindles sluggish digestive fire (Deepana-Pachana), eliminates metabolic Ama toxins, and relieves chronic sinus/chest congestion.',
          tags: ['Ignites Agni', 'Ama Cleanser', 'Sinus Decongestant']
        },
        {
          name: 'Triphala Churna',
          botanical: 'Amalaki + Haritaki + Bibhitaki',
          dosage: '3g - 5g • 30 Mins Before Sleep at Night',
          anupana: 'Warm Water or Warm Milk',
          benefit: 'Gently cleanses the colon, relieves chronic constipation, detoxifies the GI tract, and restores healthy microbiome balance.',
          tags: ['Colon Detox', 'Constipation Relief', 'Holistic Balance']
        }
      ]
    },
    {
      id: 'immunity_respiratory',
      category: 'immunity_health',
      badge: 'Ojas & Rasavaha Srotas (ओजस् एवं रस)',
      title: '3. Low Immunity & Recurrent Illness',
      subtitle: 'Frequent Viral Infections, Seasonal Allergies, Cold & Sluggish Liver',
      themeColor: 'emerald',
      icon: '🍃',
      bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      herbs: [
        {
          name: 'Guduchi / Giloy (Amrita)',
          botanical: 'Tinospora cordifolia (Nectar of Immortality)',
          dosage: '500mg Extract / 15ml Juice • Morning on Empty Stomach',
          anupana: 'Warm Water or Honey',
          benefit: 'Supreme immunomodulator (Rasayana), activates macrophage defense, treats recurrent seasonal fevers, and purifies hepatic tissue.',
          tags: ['Immunity Booster', 'Liver Detox', 'Fever & Allergy Defense']
        },
        {
          name: 'Tulsi (Holy Basil)',
          botanical: 'Ocimum sanctum (Queen of Herbs)',
          dosage: '5 - 10 Fresh Leaves Infusion or 500mg Capsule Daily',
          anupana: 'Warm Water / Herbal Infusion with Ginger',
          benefit: 'Powerful antiviral and antimicrobial shield; expels accumulated phlegm and congestion, relieves sore throat, and fights environmental pollution.',
          tags: ['Cold & Cough Shield', 'Antiviral', 'Bronchodilator']
        }
      ]
    },
    {
      id: 'fatigue_energy',
      category: 'energy_health',
      badge: 'Dhatukshaya & Balya (धातुकषय एवं बल्य)',
      title: '4. Chronic Fatigue, Weakness & Low Energy',
      subtitle: 'Adrenal Burnout, Muscle Weakness, Low Stamina & Hormonal Fatigue',
      themeColor: 'rose',
      icon: '⚡',
      bgGradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-200 hover:border-rose-400',
      tagColor: 'bg-rose-100 text-rose-900 border-rose-200',
      herbs: [
        {
          name: 'Ashwagandha',
          botanical: 'Withania somnifera (Balya & Rasayana)',
          dosage: '500mg - 1g • Post-Meals with Ghee or Milk',
          anupana: 'Warm Cow Milk + Pure Desi Ghee',
          benefit: 'Rebuilds depleted muscular strength (Mamsa Dhatu), reverses chronic adrenal exhaustion, and restores physical vitality.',
          tags: ['Muscle Stamina', 'Burnout Reversal', 'Physical Strength']
        },
        {
          name: 'Shatavari',
          botanical: 'Asparagus racemosus (100 Roots of Vitality)',
          dosage: '500mg - 1g Churna / Tablet • Morning & Night',
          anupana: 'Warm Milk with Honey / Saffron',
          benefit: 'Replenishes deep cellular essence (Ojas), balances female endocrine hormones, combats chronic exhaustion, and deeply hydrates body tissues.',
          tags: ['Hormonal Balance', 'Ojas Enhancer', 'Women Vitality']
        }
      ]
    }
  ];

  const subBioSystems = {
    prana_cognitive: {
      name: 'Prāna Neuro-Cognitive System (प्राण संस्थान)',
      site: 'Head, Brain & Sense Organs',
      function: 'Governs inhalation, mental intake, sensory perception & nervous impulses.',
      imbalance: 'Mental restlessness, insomnia, anxiety, hyper-sensitivity.',
      pacification: 'Brahmi Ghrita, Shirodhara with warm sesame oil, Nasya drops.'
    },
    samana_metabolic: {
      name: 'Samāna Enteric Digestive Flow (समान संस्थान)',
      site: 'Stomach & Small Intestine',
      function: 'Kindles Agni (digestive fire), divides food into nutrients and waste.',
      imbalance: 'Irregular digestion, bloating, gas, variable appetite.',
      pacification: 'Hingwashtak Churna with first bite of warm food, cumin-fennel tea.'
    },
    pachaka_enzymatic: {
      name: 'Pāchaka Enzymatic Secretion (पाचक संस्थान)',
      site: 'Duodenum & Lower Stomach',
      function: 'Digestive secretions and enzymatic transformation of food.',
      imbalance: 'Hyper-acidity, acid reflux, burning sensation, loose stools.',
      pacification: 'Avipattikar Churna with cold water, Amla powder, coriander infusion.'
    },
    alochaka_ocular: {
      name: 'Ālochaka Vision & Ocular Health (आलोचक संस्थान)',
      site: 'Eyes & Vision (Netra)',
      function: 'Visual perception, ocular brightness, color discernment.',
      imbalance: 'Eye strain, photophobia, burning eyes, redness from screen time.',
      pacification: 'Triphala eye wash, cool pure cow ghee Netra Tarpana, rose water splash.'
    },
    avalambaka_thoracic: {
      name: 'Avalambaka Cardiorespiratory Core (अवलम्बक संस्थान)',
      site: 'Chest, Heart & Lungs',
      function: 'Lubrication of thoracic organs, physical strength, emotional fortitude.',
      imbalance: 'Chest congestion, lethargy, sluggish metabolism, excess mucus.',
      pacification: 'Sitopaladi Churna with honey, ginger-clove herbal tea, warming spices.'
    }
  };

  const filteredMonographs = dailyHealthMonographs.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.herbs.some(h => 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        h.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-8 bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Top Header & Triage Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE3D5] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B3E8C]">
            <Activity className="w-4 h-4" />
            <span>Classical Ayurvedic Triage & Daily Clinical Monographs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mt-1">
            Constitutional Health & Daily Herbal Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-2xl">
            Evidence-based daily Ayurvedic formulations synthesized from <em>Charaka Samhita</em> & <em>Bhaishajya Ratnavali</em> for modern lifestyle disorders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onSelectTab('library')}
            className="px-4 py-2.5 rounded-full bg-white border border-[#D6CBB8] text-xs font-bold text-[#1C1917] hover:bg-stone-50 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-purple-700" />
            <span>Knowledge Library</span>
          </button>
          <button
            onClick={() => onSelectTab('consultation')}
            className="px-5 py-2.5 rounded-full bg-[#1E5039] hover:bg-[#163E2C] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Consult Ayurvedic Doctor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#EBE3D5] shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'All Daily Concerns' },
            { id: 'stress_sleep', label: '🌙 Stress & Sleep' },
            { id: 'digestive_health', label: '🔥 Digestion & Acidity' },
            { id: 'immunity_health', label: '🍃 Immunity & Cold' },
            { id: 'energy_health', label: '⚡ Energy & Stamina' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#5B3E8C] text-white shadow-xs'
                  : 'bg-stone-100/70 hover:bg-stone-200/60 text-stone-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search herb, symptom, dosage..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 PRIMARY DAILY HEALTH MONOGRAPHS (RESPONSIVE CARDS)                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        {filteredMonographs.map((card) => (
          <div 
            key={card.id}
            className={`bg-white rounded-3xl p-6 sm:p-7 border-2 ${card.borderColor} shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 relative overflow-hidden bg-gradient-to-br ${card.bgGradient}`}
          >
            {/* Header of Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${card.tagColor} flex items-center gap-1.5 shadow-2xs`}>
                  <span className="text-base">{card.icon}</span>
                  <span>{card.badge}</span>
                </span>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Verified Classical Protocol
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 pt-1">
                {card.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                {card.subtitle}
              </p>
            </div>

            {/* List of Herbal Formulations */}
            <div className="space-y-3.5 flex-1">
              {card.herbs.map((herb, idx) => (
                <div 
                  key={idx}
                  className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-stone-200/90 hover:border-purple-300 shadow-2xs transition-all space-y-2.5 text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-100 pb-2">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                        <Pill className="w-4 h-4 text-purple-700 shrink-0" />
                        <span>{herb.name}</span>
                      </h3>
                      <p className="text-[11px] text-stone-500 italic">{herb.botanical}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                      {herb.tags.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dosage & Anupana Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-[#FAF8F5] p-2.5 rounded-xl border border-stone-200/60">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Dosage & Timing:</span>
                      <span className="font-bold text-[#5B3E8C]">{herb.dosage}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Anupana (Vehicle):</span>
                      <span className="font-semibold text-stone-800">{herb.anupana}</span>
                    </div>
                  </div>

                  {/* Mechanism & Benefit */}
                  <div className="text-xs text-stone-700 leading-relaxed pt-0.5">
                    <strong className="text-stone-900 font-semibold">Therapeutic Action:</strong> {herb.benefit}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Recommendation Action */}
            <div className="pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Non-Habit Forming • 100% Classical Botanical Extract</span>
              </div>

              <button
                onClick={() => onSelectTab('consultation')}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
              >
                <span>Prescribe in Consultation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Biological System Clinical Monograph Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
        
        {/* Left 5 Columns: Biological Systems Selector */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE3D5] shadow-xs space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Physiological System Vectors</span>
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              5 Core Biological Systems & Functions (शारीरिक संस्थान परीक्षा)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Select a biological system to inspect micro-physiology and restorative herbs:</p>
          </div>

          <div className="space-y-2 pt-1">
            {Object.keys(subBioSystems).map((key) => {
              const item = subBioSystems[key];
              const isSelected = selectedSubSystem === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedSubSystem(key)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected 
                      ? 'bg-[#FAF5FF] border-[#9333EA] shadow-xs ring-1 ring-[#9333EA]/20' 
                      : 'bg-[#FAF8F5] border-stone-200/80 hover:bg-white'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{item.name}</h4>
                    <p className="text-[10px] text-stone-500">{item.site}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#9333EA]' : 'text-stone-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 7 Columns: Active System Detail */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE3D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F5EFEB] pb-3.5 flex-wrap gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-700">Clinical System Monograph</span>
              <h3 className="text-xl font-serif font-bold text-stone-900">{subBioSystems[selectedSubSystem].name}</h3>
            </div>
            <span className="px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold rounded-full">
              Primary Seat: {subBioSystems[selectedSubSystem].site}
            </span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
              <p className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-700" />
                <span>Physiological Function (कर्म):</span>
              </p>
              <p className="text-blue-900">{subBioSystems[selectedSubSystem].function}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
              <p className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Signs of Imbalance / Stress (लक्षण):</span>
              </p>
              <p className="text-amber-900">{subBioSystems[selectedSubSystem].imbalance}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <p className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Prescribed Ayurvedic Therapy (शमन चिकित्सा):</span>
              </p>
              <p className="text-emerald-900">{subBioSystems[selectedSubSystem].pacification}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
