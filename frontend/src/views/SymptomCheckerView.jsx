import React, { useState } from 'react';
import { 
  HeartPulse, Sparkles, AlertCircle, ArrowRight, ShieldCheck, 
  Search, CheckCircle2, ChevronRight, Stethoscope, BookOpen
} from 'lucide-react';

export const SymptomCheckerView = ({ onSelectTab = () => {} }) => {
  const [selectedCategory, setSelectedCategory] = useState('digestion');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Bloating & Gas after meals', 'Acidity & Burning Sensation']);

  const symptomCategories = [
    { id: 'digestion', label: 'Digestive & Agni (अग्नि)', count: 6 },
    { id: 'sleep', label: 'Mind, Stress & Sleep (निद्रा)', count: 4 },
    { id: 'skin', label: 'Skin & Complexion (त्वचा)', count: 5 },
    { id: 'joints', label: 'Joints & Mobility (संधि)', count: 4 },
    { id: 'respiratory', label: 'Breathing & Immunity (प्राण)', count: 4 },
  ];

  const symptomDatabase = {
    digestion: [
      { name: 'Bloating & Gas after meals', category: 'Gut Motility & Gas', herb: 'Hingwashtak Churna, Cumin-Ajwain decoction' },
      { name: 'Acidity & Burning Sensation', category: 'Excess Gastric Acidity', herb: 'Avipattikar Churna, Amla juice, Cold milk' },
      { name: 'Heaviness & Slow Digestion (Manda Agni)', category: 'Sluggish Metabolism', herb: 'Trikatu Churna with honey, Ginger tea' },
      { name: 'Morning Bitter / Sour Taste in mouth', category: 'Gastric Acidity & Ama', herb: 'Triphala decoction, Coriander water' },
      { name: 'Constipation & Hard Stools', category: 'Intestinal Dryness', herb: 'Triphala Churna (3-5g at bedtime with warm water)' },
      { name: 'Loose, burning stools with foul odor', category: 'Digestive Inflammation', herb: 'Kutaja Ghanavati, Bilwadi Leha' }
    ],
    sleep: [
      { name: 'Difficulty falling asleep (Insomnia)', category: 'High Cortisol & Stress', herb: 'Ashwagandha with warm milk, Brahmi Taila head massage' },
      { name: 'Waking up between 2:00 AM - 4:00 AM', category: 'Sleep Rhythm Disruption', herb: 'Warm cow ghee foot massage (Pada Abhyanga)' },
      { name: 'Excessive dreaming & mental chatter', category: 'Nervous Agitation', herb: 'Brahmi Vati, Shankhapushpi syrup' },
      { name: 'Excessive daytime sleepiness & lethargy', category: 'Metabolic Lethargy', herb: 'Daily morning Sun salutations (Surya Namaskar)' }
    ],
    skin: [
      { name: 'Dry, rough & itchy skin patches', category: 'Moisture Depletion', herb: 'Kumkumadi Tailam, Sesame oil massage' },
      { name: 'Red rashes, acne & heat breakouts', category: 'Skin Heat & Redness', herb: 'Neem tablets, Manjistha Churna, Sandalwood paste' },
      { name: 'Oily skin with whiteheads & cystic acne', category: 'Sebum Excess', herb: 'Lodhra & Multani clay mask with rose water' }
    ],
    joints: [
      { name: 'Cracking joints & morning stiffness', category: 'Joint Cartilage Friction', herb: 'Yograj Guggulu, Mahanarayan Oil massage' },
      { name: 'Inflamed, warm, red & swollen joints', category: 'Joint Inflammation', herb: 'Kaishore Guggulu, Castor oil compress' }
    ],
    respiratory: [
      { name: 'Dry persistent throat cough', category: 'Respiratory Dryness', herb: 'Yashtimadhu (Licorice) tea with honey' },
      { name: 'Heavy chest mucus & morning congestion', category: 'Congestion & Mucus Excess', herb: 'Sitopaladi Churna with honey & ginger' }
    ]
  };

  const toggleSymptom = (name) => {
    setSelectedSymptoms(prev => 
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto space-y-6 bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE3D5] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B3E8C]">
            <HeartPulse className="w-4 h-4" />
            <span>Nidana Sthana Clinical Assessment</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917] mt-1">
            Ayurvedic Symptom Evaluator (लक्षण परीक्षण)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Identify Doshic root cause and classical herbs according to Charaka Samhita Nidana Sthana
          </p>
        </div>

        <button
          onClick={() => onSelectTab('consultation')}
          className="px-5 py-2.5 rounded-full bg-[#1E5039] hover:bg-[#163E2C] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Stethoscope className="w-4 h-4" />
          <span>Consult Certified Doctor</span>
        </button>
      </div>

      {/* Main Grid: Categories & Symptom Checkboxes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 4 Columns: Body System Categories */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-[#EBE3D5] shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
            Organ & Body Systems (स्रोतांसि)
          </h3>

          {symptomCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-[#5B3E8C] text-white border-[#5B3E8C] shadow-xs' 
                    : 'bg-[#FAF8F5] text-stone-800 border-stone-200/80 hover:bg-stone-100'
                }`}
              >
                <span className="text-xs font-bold">{cat.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right 8 Columns: Symptom Selection & Doshic Analysis Output */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Checkboxes List */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Select Current Experienced Symptoms:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(symptomDatabase[selectedCategory] || []).map((sym, idx) => {
                const isChecked = selectedSymptoms.includes(sym.name);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleSymptom(sym.name)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isChecked 
                        ? 'bg-[#EFF6FF] border-[#3B82F6] text-blue-950 shadow-2xs' 
                        : 'bg-[#FAF8F5] border-stone-200/80 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                      isChecked ? 'bg-[#3B82F6] border-[#3B82F6] text-white' : 'border-stone-300'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-snug">{sym.name}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Focus: <strong className="text-purple-700">{sym.category}</strong></p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulation Synthesis Findings Box */}
          <div className="bg-gradient-to-br from-purple-50 via-white to-green-50 rounded-3xl p-6 border border-[#EBE3D5] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span>Classical Formulation Protocol:</span>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              Based on your selected symptoms, the primary clinical focus is gastro-intestinal acidity, nervous tension, and digestive sluggishness.
            </p>

            <div className="p-3.5 rounded-2xl bg-white border border-[#EBE3D5] space-y-1.5 text-xs">
              <p className="font-bold text-stone-900">Recommended Classical Protocol:</p>
              <ul className="list-disc list-inside space-y-1 text-stone-600 text-[11px]">
                <li><strong>Morning:</strong> 1 glass warm water with 1 pinch roasted Jeera (Cumin) powder.</li>
                <li><strong>Before Meals:</strong> 1 tsp Hingwashtak Churna with first morsel of food in cow ghee.</li>
                <li><strong>Bedtime:</strong> 1 tsp Triphala Churna with warm water.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onSelectTab('herbs')}
                className="flex-1 py-2.5 rounded-2xl bg-[#5B3E8C] hover:bg-[#4A3273] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>View Full Materia Medica Recommendations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
