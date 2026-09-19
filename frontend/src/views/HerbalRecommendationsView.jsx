import React, { useState } from 'react';
import { 
  Sparkles, Leaf, Search, BookOpen, ArrowRight, 
  CheckCircle2, Info, Flame, Droplet, Wind, ShieldCheck
} from 'lucide-react';

export const HerbalRecommendationsView = ({ onSelectTab = () => {} }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const herbalMateriaMedica = [
    {
      id: 'triphala',
      name: 'Triphala Churna (त्रिफला चूर्ण)',
      botanical: 'Amalaki + Haritaki + Bibhitaki',
      category: 'Rasayana & Agni Deepana',
      dosha: 'Holistic (Balances All Bodily Systems)',
      rasa: '5 Tastes (All except Salty / Lavana)',
      virya: 'Anushna (Neutral / Balanced Energy)',
      vipaka: 'Madhura (Sweet post-digestive)',
      indications: 'Gentle colon detox, Agni stimulation, ocular health, antioxidant.',
      dosage: '3g to 5g at night with warm water or cow ghee.',
      contraindications: 'Acute diarrhea, pregnancy without doctor advice.',
      image: '/assets/triphala.jpg'
    },
    {
      id: 'ashwagandha',
      name: 'Ashwagandha Rasayana (अश्वगंधा)',
      botanical: 'Withania somnifera (Indian Ginseng)',
      category: 'Balya & Medhya Rasayana',
      dosha: 'Deep Calming & Stress Relief',
      rasa: 'Tikta (Bitter), Kashaya (Astringent), Madhura (Sweet)',
      virya: 'Ushna (Warm / Heating)',
      vipaka: 'Madhura (Sweet post-digestive)',
      indications: 'Stress, nervous exhaustion, insomnia, joint vitality, muscle strength.',
      dosage: '1 tsp (3g) twice daily with warm milk and a pinch of cardamom.',
      contraindications: 'Acute gastric inflammation / active ulcers.',
      image: '/assets/panchakarma.jpg'
    },
    {
      id: 'brahmi',
      name: 'Brahmi Vati / Ghrita (ब्राह्मी)',
      botanical: 'Bacopa monnieri',
      category: 'Medhya Rasayana (Nootropic)',
      dosha: 'Calms Cranial Nerves & Mind',
      rasa: 'Tikta (Bitter), Kashaya (Astringent)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura (Sweet)',
      indications: 'Cognitive enhancement, memory retention, nervous calm, focus.',
      dosage: '1 tablet twice daily after meals with water.',
      contraindications: 'None reported at standard classical dosages.',
      image: '/assets/panchakarma.jpg'
    },
    {
      id: 'kumkumadi',
      name: 'Kumkumadi Tailam (कुंकुमादि तैलम्)',
      botanical: 'Saffron (Keshara) + Sandalwood + Lotus Stamen + 24 Herbs',
      category: 'Varnya (Complexion & Skin Luster)',
      dosha: 'Soothes Dryness & Complexion Redness',
      rasa: 'Madhura, Tikta',
      virya: 'Sheeta & Snigdha',
      vipaka: 'Madhura',
      indications: 'Facial micro-circulation, skin glow (Tejas), dark spots, acne scars.',
      dosage: 'Apply 3-4 drops on clean damp face at night with gentle upward strokes.',
      contraindications: 'Extremely oily cystic skin during humid summer.',
      image: '/assets/lotus.jpg'
    },
    {
      id: 'shatavari',
      name: 'Shatavari Gulam / Granules (शतावरी)',
      botanical: 'Asparagus racemosus',
      category: 'Cooling Tonic & Stanya Janana',
      dosha: 'Cooling & Rejuvenating',
      rasa: 'Madhura (Sweet), Tikta (Bitter)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura',
      indications: 'Hyper-acidity, stomach ulcers, female hormone balance, vitality.',
      dosage: '5g morning with milk or warm water on empty stomach.',
      contraindications: 'Severe chest congestion.',
      image: '/assets/panchakarma.jpg'
    },
    {
      id: 'guggulu',
      name: 'Yograj Guggulu (योगराज गुग्गुलु)',
      botanical: 'Commiphora mukul + 26 Deepana herbs',
      category: 'Joint Mobility & Sandhi Shoola',
      dosha: 'Powerful Joint & Mobility Support',
      rasa: 'Tikta, Katu, Kashaya',
      virya: 'Ushna (Warm)',
      vipaka: 'Katu',
      indications: 'Joint stiffness, osteoarthritis, sciatica, back ache, Ama accumulation.',
      dosage: '2 tablets twice daily after meals with warm water.',
      contraindications: 'Pregnancy and severe acute kidney disease.',
      image: '/assets/panchakarma.jpg'
    }
  ];

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto space-y-6 bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE3D5] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B3E8C]">
            <Leaf className="w-4 h-4" />
            <span>Classical Dravyaguna Materia Medica</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917] mt-1">
            Herbal Recommendations & Formulations (द्रव्यगुण शास्त्र)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Peer-reviewed classical formulations with authentic Rasa, Virya, Vipaka, and therapeutic dosage
          </p>
        </div>

        <button
          onClick={() => onSelectTab('consultation')}
          className="px-5 py-2.5 rounded-full bg-[#1E5039] hover:bg-[#163E2C] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Consult Doctor for Prescription</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Herbs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {herbalMateriaMedica.map((herb) => (
          <div key={herb.id} className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
            
            <div className="space-y-3">
              {/* Herb Image & Name */}
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-stone-200 shrink-0 shadow-2xs">
                  <img
                    src={herb.image}
                    alt={herb.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#1C1917] leading-tight">{herb.name}</h3>
                  <p className="text-[11px] text-[#5B3E8C] italic">{herb.botanical}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-900 border border-green-200 rounded-md text-[9px] font-bold">
                    {herb.category}
                  </span>
                </div>
              </div>

              {/* Therapeutic Action */}
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-100 space-y-1 text-xs">
                <p className="text-[10px] text-stone-500 font-bold uppercase">Therapeutic Action (कर्म):</p>
                <p className="text-stone-800 font-semibold">{herb.dosha}</p>
                
                <div className="grid grid-cols-3 gap-1 pt-1.5 text-[9px] border-t border-stone-200/60 mt-1">
                  <div><strong>Rasa:</strong> {herb.rasa.split(',')[0]}</div>
                  <div><strong>Virya:</strong> {herb.virya.split(' ')[0]}</div>
                  <div><strong>Vipaka:</strong> {herb.vipaka.split(' ')[0]}</div>
                </div>
              </div>

              {/* Therapeutic Indications & Dosage */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <p className="text-[11px] leading-snug"><strong>Indications:</strong> {herb.indications}</p>
                <p className="text-[10px] text-purple-950 bg-purple-50 p-2 rounded-xl border border-purple-100 font-medium">
                  <strong>Dosage:</strong> {herb.dosage}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100">
              <button
                onClick={() => onSelectTab('consultation')}
                className="w-full py-2.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5B3E8C] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-[#E9D5FF] cursor-pointer"
              >
                <span>Consult Vaidya to Prescribe</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
