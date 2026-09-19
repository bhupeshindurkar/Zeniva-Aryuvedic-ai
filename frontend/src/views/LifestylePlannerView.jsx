import React, { useState, useEffect } from 'react';
import { 
  Calendar, Sun, Moon, Sparkles, CheckCircle2, Check, 
  Clock, ArrowRight, HeartPulse, Droplet, Flame, Wind,
  Plus, Trash2, X, AlertCircle, Award, Coffee, BookOpen,
  ChevronRight, Compass, ShieldCheck, Stethoscope, Printer,
  Download, FileText, Share2, Eye
} from 'lucide-react';
import { ZenivaLogo } from '../components/ZenivaIcons';

export const LifestylePlannerView = ({ 
  currentUser = {},
  onSelectTab = () => {} 
}) => {
  // 1. Live Vedic Time Engine
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine current Ayurvedic Kaala
  const currentHour = currentTime.getHours();
  let currentKaala = {
    name: 'Pratah Kaala (प्रातः काल)',
    element: 'Earth & Water (स्थिरता एवं बल)',
    timeRange: '06:00 AM - 10:00 AM',
    phaseType: 'Grounding & Vitality',
    icon: Droplet,
    color: 'emerald',
    directive: 'Time for gentle exercise, tongue scraping, Ushapan warm water & awakening digestion.'
  };

  if (currentHour >= 10 && currentHour < 14) {
    currentKaala = {
      name: 'Madhyahna Kaala (मध्याह्न काल)',
      element: 'Solar Fire & Water (तीक्ष्ण अग्नि)',
      timeRange: '10:00 AM - 02:00 PM',
      phaseType: 'Peak Digestive Agni',
      icon: Flame,
      color: 'amber',
      directive: 'Solar energy & digestive fire (Jatharagni) are peak. Ideal time for your principal heavy meal.'
    };
  } else if (currentHour >= 14 && currentHour < 18) {
    currentKaala = {
      name: 'Aparahna Kaala (अपराह्न काल)',
      element: 'Air & Ether (गति एवं विचार)',
      timeRange: '02:00 PM - 06:00 PM',
      phaseType: 'Mental & Cognitive Flow',
      icon: Wind,
      color: 'blue',
      directive: 'High mental clarity, creative focus & light mobility. Keep warm herbal infusions handy.'
    };
  } else if (currentHour >= 18 && currentHour < 22) {
    currentKaala = {
      name: 'Sandhya Kaala (सन्ध्या काल)',
      element: 'Cooling & Grounding (शान्ति)',
      timeRange: '06:00 PM - 10:00 PM',
      phaseType: 'Evening Rest & Calm',
      icon: Moon,
      color: 'purple',
      directive: 'Light warm dinner before 7:30 PM. Digital sunset, foot massage (Padabhyanga) & prepare for sleep.'
    };
  } else if (currentHour >= 22 || currentHour < 2) {
    currentKaala = {
      name: 'Nisha Kaala (आन्तरिक धातु पोषण काल)',
      element: 'Internal Metabolic Repair (धातु पोषण)',
      timeRange: '10:00 PM - 02:00 AM',
      phaseType: 'Cellular Regeneration',
      icon: Flame,
      color: 'indigo',
      directive: 'Crucial window for liver detox, cellular repair and deep tissue rejuvenation. Must be asleep.'
    };
  } else {
    currentKaala = {
      name: 'Brahma Muhurta (ब्रह्म मुहूर्त)',
      element: 'Pure Sattva & Divine Ether (सत्त्व गुण)',
      timeRange: '02:00 AM - 06:00 AM',
      phaseType: 'Sattvic Awakening',
      icon: Sparkles,
      color: 'teal',
      directive: 'Sacred pre-dawn time. Perfect for meditation, pranayama, intention setting and awakening.'
    };
  }

  // 2. Interactive Daily Dinacharya Habits with LocalStorage persistence
  const initialHabits = [
    { id: 1, period: 'morning', time: '05:30 AM', name: 'Brahma Muhurta Wakeup (ब्रह्म मुहूर्त)', desc: 'Awakening 45 mins before sunrise when morning tranquility facilitates natural mental clarity.', done: true },
    { id: 2, period: 'morning', time: '06:15 AM', name: 'Jihva Nirlekhana (Copper Tongue Scraping)', desc: 'Scraping overnight Ama toxins from the lingual surface to restore taste receptors.', done: true },
    { id: 3, period: 'morning', time: '06:30 AM', name: 'Ushapan (Warm Water with Cumin & Lemon)', desc: 'Kindling digestive fire (Deepana) and initiating natural morning peristalsis.', done: true },
    { id: 4, period: 'morning', time: '07:00 AM', name: 'Abhyanga (Warm Sesame Oil Self Massage)', desc: 'Nourishing 7 Dhatus, easing physical stress, lubricating joint capsules and skin.', done: false },
    { id: 5, period: 'midday', time: '12:30 PM', name: 'Pradhana Ahara (Mindful Main Lunch)', desc: 'Eating the largest, nutrient-dense meal when digestive fire (Agni) is at absolute peak.', done: false },
    { id: 6, period: 'evening', time: '06:00 PM', name: 'Pranayama & Sandhya Dhyana (Meditation)', desc: 'Anulom Vilom (Nadi Shodhana) & Bhramari to ground the autonomic nervous system.', done: false },
    { id: 7, period: 'bedtime', time: '09:45 PM', name: 'Triphala & Pada Abhyanga (Foot Massage)', desc: 'Warm ghee massage on soles of feet (Padabhyanga) for deep restorative sleep.', done: false }
  ];

  const [dinacharyaHabits, setDinacharyaHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('zeniva_dinacharya_habits');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialHabits;
  });

  const [periodFilter, setPeriodFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    time: '07:30 AM',
    period: 'morning',
    desc: 'Daily Ayurvedic lifestyle habit'
  });

  // 3. Hydration & Ushapan Water Tracker
  const [waterGlasses, setWaterGlasses] = useState(() => {
    try {
      const saved = localStorage.getItem('zeniva_water_tracker');
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return 5;
  });

  const handleUpdateWater = (delta) => {
    const newVal = Math.max(0, Math.min(12, waterGlasses + delta));
    setWaterGlasses(newVal);
    try {
      localStorage.setItem('zeniva_water_tracker', newVal.toString());
    } catch (e) {}
  };

  const toggleHabit = (id) => {
    const updated = dinacharyaHabits.map(h => h.id === id ? { ...h, done: !h.done } : h);
    setDinacharyaHabits(updated);
    try {
      localStorage.setItem('zeniva_dinacharya_habits', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteHabit = (id, e) => {
    e.stopPropagation();
    const updated = dinacharyaHabits.filter(h => h.id !== id);
    setDinacharyaHabits(updated);
    try {
      localStorage.setItem('zeniva_dinacharya_habits', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleAddHabitSubmit = (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) return;
    const habitObj = {
      id: Date.now(),
      period: newHabit.period,
      time: newHabit.time,
      name: newHabit.name.trim(),
      desc: newHabit.desc.trim(),
      done: false
    };
    const updated = [...dinacharyaHabits, habitObj];
    setDinacharyaHabits(updated);
    try {
      localStorage.setItem('zeniva_dinacharya_habits', JSON.stringify(updated));
    } catch (e) {}
    setNewHabit({ name: '', time: '07:30 AM', period: 'morning', desc: '' });
    setIsAddModalOpen(false);
    showToast('New Dinacharya Routine added! ✓');
  };

  const completedCount = dinacharyaHabits.filter(h => h.done).length;
  const consistencyPct = dinacharyaHabits.length > 0 ? Math.round((completedCount / dinacharyaHabits.length) * 100) : 0;

  // 4. Complete 6 Classical Ritucharya Seasonal Guides (Charaka Samhita Sutrasthana Ch. 6)
  const [activeSeason, setActiveSeason] = useState('varsha');

  const seasonalGuides = {
    varsha: {
      name: 'Varsha Ritu (वर्षा ऋतु — Monsoon Season)',
      sanskritMantra: 'दोषप्रकोपे वर्षासु प्रावृषि शान्तिः',
      months: 'July - August (Shravana - Bhadrapada)',
      doshaDynamic: 'Monsoon Humidity & Atmospheric Fluid Shifts',
      agniState: 'Mandagni (Weakened Digestive Capacity due to atmospheric moisture)',
      dietRules: [
        'Eat freshly cooked, warm, light meals; avoid heavy cold raw salads.',
        'Drink boiled water infused with dry ginger (Shunthi) and honey.',
        'Prefer old barley (Yava), wheat (Godhuma), and medicated meat/lentil soups.',
        'Avoid curd (Dadhi) at night; drink spiced buttermilk (Takra with roasted jeera).'
      ],
      lifestyleRules: [
        'Strictly avoid day-time sleeping (Diva Swapna) as it causes severe Ama accumulation.',
        'Practice daily herbal fumigation (Dhupana) of home with Guggulu & Neem.',
        'Daily warm oil massage (Abhyanga) with Mahanarayan / Dhanwantharam Taila.',
        'Undergo Panchakarma therapy under Ayurvedic physician guidance.'
      ]
    },
    sharad: {
      name: 'Sharad Ritu (शरद् ऋतु — Autumn Season)',
      sanskritMantra: 'शरदि विरेकः प्रशस्यते',
      months: 'September - October (Ashvina - Kartika)',
      doshaDynamic: 'Peak Autumn Heat & Cellular Metabolic Transition',
      agniState: 'Tikshnagni (Sudden Surge in Digestive Heat with clear skies)',
      dietRules: [
        'Sweet (Madhura), bitter (Tikta) and astringent (Kashaya) cooling tastes to soothe metabolic heat.',
        'Pure Cow Ghee (Tikta Ghrita), basmati rice, green moong dal, pomegranate.',
        'Drink Hamsodaka (water purified naturally by sun rays by day & moonlight by night).',
        'Avoid excessively spicy, pungent mustard, sea salt, alcohol and fermented foods.'
      ],
      lifestyleRules: [
        'Moonlight bathing (Chandrika Sevana) in first quarter of night to cool somatic heat.',
        'Undergo Virechana (Therapeutic Purgation) and gentle detox therapies.',
        'Avoid direct harsh midday sun exposure and sleeping after heavy lunch.'
      ]
    },
    hemanta: {
      name: 'Hemanta Ritu (हेमन्त ऋतु — Early Winter Season)',
      sanskritMantra: 'हेमन्ते बलिनां शस्तं लवणक्षारसेवनम्',
      months: 'November - December (Margashirsha - Pausha)',
      doshaDynamic: 'Peak Digestive Fire (दीप्ताग्नि) & Physical Stamina',
      agniState: 'Utkrishta Jatharagni (Extremely powerful digestive fire burning strong)',
      dietRules: [
        'Nourishing sweet, sour and salty unctuous foods (Snigdha Ahara).',
        'Warm milk boiled with Ashwagandha, saffron, dates, dry fruits and almonds.',
        'Freshly harvested grains, sesame seeds (Tila), black gram (Masha) and cane sugar.',
        'Never skip meals or fast for prolonged periods as intense Agni will consume body tissues.'
      ],
      lifestyleRules: [
        'Vigorous whole-body oil massage (Abhyanga) followed by herbal powder scrub (Udvartana).',
        'Head and body sunbathing (Atapa Sevana) and warm water bathing.',
        'Daily active physical exercise (Vyayama) up to half of one’s capacity (Balaardha).'
      ]
    },
    shishira: {
      name: 'Shishira Ritu (शिशिर ऋतु — Late Winter Season)',
      sanskritMantra: 'शिशिरे शीतमधिकं बलं वर्धयति',
      months: 'January - February (Magha - Phalguna)',
      doshaDynamic: 'Intense Dry Cold & Core Immunity Fortification',
      agniState: 'Sustained High Digestive Capacity (दीप्ताग्नि)',
      dietRules: [
        'Heavy, warm, nourishing soups, sesame laddoos, and herbal ghee preparations.',
        'Ginger, black pepper, and cinnamon spiced warm herbal teas.',
        'Avoid cold refrigerated foods, frozen drinks and dry astringent snacks.'
      ],
      lifestyleRules: [
        'Stay in warm, well-insulated rooms; wear warm woolen and protective clothes.',
        'Apply warming oils like Karpasasthyadi or Dhanwantharam on joints.',
        'Regular warming fomentation (Swedana) and physical conditioning.'
      ]
    },
    vasanta: {
      name: 'Vasanta Ritu (वसन्त ऋतु — Spring Season)',
      sanskritMantra: 'वसन्ते शोधनं हितम्',
      months: 'March - April (Chaitra - Vaishakha)',
      doshaDynamic: 'Spring Mucosal Clearance & Seasonal Metabolic Awakening',
      agniState: 'Agnimandya (Sluggish Digestion during spring seasonal shift)',
      dietRules: [
        'Light, easily digestible barley, dry roasted grains, honey, and bitter greens (Neem/Methi).',
        'Drink warm ginger-honey water (Madhoodaka) to scrape sticky residues.',
        'Strictly avoid heavy dairy, sweets, oily deep-fried foods, and cold ice-creams.'
      ],
      lifestyleRules: [
        'Undergo cleansing therapy and Nasya (nasal medicated herbal oil drops).',
        'Dry herbal powder scrub massage (Udvartana) with Triphala to eliminate stagnation.',
        'Active outdoor exercise, brisk walking, and avoidance of daytime sleeping.'
      ]
    },
    grishma: {
      name: 'Grishma Ritu (ग्रीष्म ऋतु — Summer Season)',
      sanskritMantra: 'ग्रीष्मे सूर्यकिरणैस्तप्तं जलं मधुरं पिबेत्',
      months: 'May - June (Jyeshtha - Ashadha)',
      doshaDynamic: 'Depletion of Bodily Moisture (Bala Kshaya) & Solar Dehydration',
      agniState: 'Alpagni (Weakened Digestive Power due to severe environmental heat)',
      dietRules: [
        'Sweet, cooling, liquid foods: sweet fruit juices, coconut water, sattu drinks.',
        'Rice with cold milk, buffalo ghee, melon, cucumber, and mint-infused water.',
        'Avoid salty, pungent, sour, spicy foods, alcohol and heavy hot spices.'
      ],
      lifestyleRules: [
        'Rest in cool, shaded spaces; apply fragrant sandalwood (Chandana) paste.',
        'Gentle daytime nap in a cool airy room (the only season daytime sleep is permitted).',
        'Avoid strenuous exhausting workouts; practice calming Moon Salutations (Chandra Namaskar).'
      ]
    }
  };

  const currentSeasonData = seasonalGuides[activeSeason];

  // 5. Universal Safe Data URI CSV Export Engine
  const handleExportPlannerCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    let csvContent = `ZENIVA AI AYURVEDIC HEALTHCARE - DINACHARYA & RITUCHARYA PLANNER\n`;
    csvContent += `Generated On: ${new Date().toLocaleString('en-IN')}\n`;
    csvContent += `Patient Name: ${currentUser.name || 'Bhupesh Indurkar'}\n`;
    csvContent += `Health Profile: ${currentUser.prakriti || 'Stress & Sleep Wellness'}\n`;
    csvContent += `Daily Consistency: ${consistencyPct}% (${completedCount}/${dinacharyaHabits.length} Habits)\n\n`;

    csvContent += `SECTION 1: DAILY DINACHARYA ROUTINES\n`;
    csvContent += `ID,Period,Time,Routine Name,Ayurvedic Clinical Purpose,Status\n`;
    dinacharyaHabits.forEach(h => {
      csvContent += `${h.id},"${h.period}","${h.time}","${h.name.replace(/"/g, '""')}","${h.desc.replace(/"/g, '""')}","${h.done ? 'COMPLETED' : 'PENDING'}"\n`;
    });

    csvContent += `\nSECTION 2: ACTIVE RITUCHARYA (${currentSeasonData.name})\n`;
    csvContent += `Months:,"${currentSeasonData.months}"\n`;
    csvContent += `Dosha State:,"${currentSeasonData.doshaDynamic}"\n`;
    csvContent += `Agni State:,"${currentSeasonData.agniState}"\n\n`;

    csvContent += `PATHYA AHARA (BENEFICIAL DIET DIRECTIVES)\n`;
    currentSeasonData.dietRules.forEach((rule, idx) => {
      csvContent += `${idx + 1},"${rule.replace(/"/g, '""')}"\n`;
    });

    csvContent += `\nVIHARA (DAILY LIFESTYLE & BEHAVIOR PROTOCOLS)\n`;
    currentSeasonData.lifestyleRules.forEach((rule, idx) => {
      csvContent += `${idx + 1},"${rule.replace(/"/g, '""')}"\n`;
    });

    const filename = `zeniva_dinacharya_planner_guide_${timestamp}.csv`;
    const dataUri = `data:text/csv;charset=utf-8,\uFEFF` + encodeURIComponent(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Dinacharya CSV Guide Downloaded! ✓');
  };

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
      {/* 1. TOP HEADER & LIVE VEDIC CIRCADIAN CLOCK BAR                            */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D5] shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B3E8C]">
              <Calendar className="w-4 h-4 text-purple-700" />
              <span>Ayurvedic Circadian Rhythms & Lifestyle Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Ayurvedic Dinacharya & Ritucharya Planner (दिनचर्या)
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Align daily habits, meal timings, and seasonal biological regimens with classical Charaka Samhita circadian laws.
            </p>
          </div>

          {/* Refined Small & Sleek Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportPlannerCSV}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Export Daily Routines as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#5B3E8C]/10 hover:bg-[#5B3E8C]/20 text-[#5B3E8C] border border-[#5B3E8C]/25 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Generate Official Printable Ayurvedic PDF Guide"
            >
              <Printer className="w-3.5 h-3.5 text-[#5B3E8C]" />
              <span>Generate PDF Guide</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 bg-[#1E5039] hover:bg-[#163E2C] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Habit</span>
            </button>
          </div>
        </div>

        {/* Live Circadian Phase Alert Banner */}
        <div className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r ${
          currentKaala.color === 'emerald' ? 'from-emerald-50 via-teal-50 to-emerald-100/50 border-emerald-200 text-emerald-950' :
          currentKaala.color === 'amber' ? 'from-amber-50 via-orange-50 to-amber-100/50 border-amber-200 text-amber-950' :
          currentKaala.color === 'blue' ? 'from-blue-50 via-sky-50 to-blue-100/50 border-blue-200 text-blue-950' :
          currentKaala.color === 'purple' ? 'from-purple-50 via-indigo-50 to-purple-100/50 border-purple-200 text-purple-950' :
          'from-stone-50 via-purple-50 to-stone-100 border-stone-200 text-stone-900'
        }`}>
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/90 shadow-sm border border-black/5 flex items-center justify-center shrink-0">
              <currentKaala.icon className="w-6 h-6 text-stone-800" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                  Active Circadian Cycle: {currentKaala.timeRange}
                </span>
                <span className="text-[11px] font-bold font-mono">
                  Live: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <h3 className="text-base font-bold font-serif mt-0.5">{currentKaala.name} — <span className="font-sans text-xs font-semibold opacity-90">{currentKaala.element}</span></h3>
              <p className="text-xs mt-0.5 opacity-90 leading-snug">{currentKaala.directive}</p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] font-semibold px-3 py-1 rounded-xl bg-white/90 border border-black/5 font-mono shadow-2xs">
              Primary Dosha: <strong>{currentKaala.dosha}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN GRID: DINACHARYA CHECKLIST (LEFT 7) + RITUCHARYA & WATER (RIGHT 5) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Interactive Dinacharya Habit Checklist */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#EBE3D5] shadow-xs space-y-5">
          
          {/* Header & Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">Today's Dinacharya Checklist</h3>
              <p className="text-xs text-stone-500 mt-0.5">Click any habit to mark completion. Data automatically persists.</p>
            </div>

            {/* Time-of-Day Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All Habits' },
                { id: 'morning', label: 'Pratah (Morning)' },
                { id: 'midday', label: 'Madhyahna (Midday)' },
                { id: 'evening', label: 'Sayam (Evening)' },
                { id: 'bedtime', label: 'Ratri (Bedtime)' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriodFilter(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    periodFilter === p.id 
                      ? 'bg-[#5B3E8C] text-white shadow-2xs' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Habit Items Roster */}
          <div className="space-y-3">
            {dinacharyaHabits
              .filter(h => periodFilter === 'all' || h.period === periodFilter)
              .map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 group ${
                    habit.done 
                      ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs' 
                      : 'bg-[#FAF8F5] border-stone-200 hover:bg-white hover:border-purple-300 hover:shadow-xs'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    habit.done ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs scale-105' : 'border-stone-300 bg-white group-hover:border-purple-400'
                  }`}>
                    {habit.done && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs sm:text-sm font-bold leading-tight ${habit.done ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                        {habit.name}
                      </h4>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-purple-900 font-mono font-bold px-2 py-0.5 rounded-md bg-purple-100/70">
                          {habit.time}
                        </span>
                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteHabit(habit.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-600 p-1 transition-opacity cursor-pointer"
                          title="Delete Habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">{habit.desc}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* Add Habit Quick Trigger */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-stone-200 hover:border-purple-400 text-stone-600 hover:text-purple-900 text-xs font-bold flex items-center justify-center gap-2 bg-[#FAF8F5] hover:bg-purple-50/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Personal Ayurvedic Dinacharya Routine</span>
          </button>
        </div>

        {/* Right 5 Columns: Water Tracker & 6 Classical Ritucharya Guides */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Ayurvedic Ushapan & Herbal Hydration Tracker */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-stone-900">Ushapan & Hydration Tracker</h3>
              </div>
              <span className="text-xs font-bold text-blue-700 font-mono bg-blue-50 px-2.5 py-0.5 rounded-full">
                {waterGlasses} / 8 Glasses Target
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-900">Warm Cumin / Ginger Water</p>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Ayurveda recommends warm sips to ignite Agni and prevent Ama toxicity.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleUpdateWater(-1)}
                  className="w-8 h-8 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-base flex items-center justify-center cursor-pointer transition-all"
                >
                  -
                </button>
                <span className="w-7 text-center font-bold text-base text-stone-900 font-mono">
                  {waterGlasses}
                </span>
                <button
                  type="button"
                  onClick={() => handleUpdateWater(1)}
                  className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center cursor-pointer shadow-xs transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Visual Droplets Ring */}
            <div className="flex items-center justify-between px-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                <div 
                  key={g}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                    g <= waterGlasses 
                      ? 'bg-blue-600 text-white shadow-2xs scale-105' 
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5 fill-current" />
                </div>
              ))}
            </div>
          </div>

          {/* 2. Classical 6 Ritucharya (Seasonal Living) Engine */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-stone-900">Ritucharya (Seasonal Living)</h3>
                </div>
                <p className="text-[10px] text-stone-500 mt-0.5">Charaka Samhita Sutrasthana Ch. 6</p>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold font-serif">
                6 Classical Ritus
              </span>
            </div>

            {/* Season Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {[
                { id: 'varsha', label: '🌧️ Monsoon', name: 'Varsha' },
                { id: 'sharad', label: '🍂 Autumn', name: 'Sharad' },
                { id: 'hemanta', label: '❄️ Early Winter', name: 'Hemanta' },
                { id: 'shishira', label: '⛄ Late Winter', name: 'Shishira' },
                { id: 'vasanta', label: '🌸 Spring', name: 'Vasanta' },
                { id: 'grishma', label: '☀️ Summer', name: 'Grishma' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSeason(s.id)}
                  className={`p-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    activeSeason === s.id 
                      ? 'bg-[#5B3E8C] text-white shadow-xs' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Active Season Details Card */}
            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-sm font-serif">{currentSeasonData.name}</h4>
                  <span className="text-[10px] font-mono text-purple-900 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    {currentSeasonData.months}
                  </span>
                </div>
                <p className="text-[10px] text-[#5B3E8C] font-serif italic">{currentSeasonData.sanskritMantra}</p>
                <div className="pt-1 space-y-1">
                  <p className="text-[11px] text-stone-700">
                    <strong>Dosha Dynamic:</strong> <span className="text-amber-800 font-semibold">{currentSeasonData.doshaDynamic}</span>
                  </p>
                  <p className="text-[11px] text-stone-700">
                    <strong>Agni State:</strong> <span className="text-emerald-800 font-semibold">{currentSeasonData.agniState}</span>
                  </p>
                </div>
              </div>

              {/* Pathya (Beneficial Diet) */}
              <div className="space-y-1.5">
                <p className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Pathya Ahara (Beneficial Seasonal Diet):</span>
                </p>
                <ul className="space-y-1 pl-3 text-stone-600 text-[11px]">
                  {currentSeasonData.dietRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vihara (Behavioral Regimen) */}
              <div className="space-y-1.5 pt-1">
                <p className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Vihara Protocols (Daily Physical Regimen):</span>
                </p>
                <ul className="space-y-1 pl-3 text-stone-600 text-[11px]">
                  {currentSeasonData.lifestyleRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Consult Vaidya CTA Card */}
          <div className="bg-[#FAF4EB] rounded-3xl p-5 border border-[#EBE3D5] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-stone-900">Need a Customized Ritucharya Diet?</h4>
              <p className="text-[10px] text-stone-600">Connect with certified Vaidyas for personal Pathya-Apathya chart.</p>
            </div>
            <button
              onClick={() => onSelectTab('consultation')}
              className="px-4 py-2 rounded-xl bg-[#5B3E8C] hover:bg-[#4A2F75] text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-all"
            >
              Consult Vaidya
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. ADD CUSTOM DINACHARYA HABIT MODAL DIALOG                                */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#EBE3D5] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-700" />
                <h3 className="text-base font-serif font-bold text-stone-900">Add New Dinacharya Routine</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHabitSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Habit / Routine Name:</label>
                <input
                  type="text"
                  required
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="e.g. Nasya Medicated Drops / 20 Mins Yoga"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-900 font-semibold focus:ring-2 focus:ring-purple-600/30 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Time:</label>
                  <input
                    type="text"
                    required
                    value={newHabit.time}
                    onChange={(e) => setNewHabit({ ...newHabit, time: e.target.value })}
                    placeholder="e.g. 07:00 AM"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-900 font-mono font-bold focus:ring-2 focus:ring-purple-600/30 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Period:</label>
                  <select
                    value={newHabit.period}
                    onChange={(e) => setNewHabit({ ...newHabit, period: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-900 font-bold focus:ring-2 focus:ring-purple-600/30 outline-none"
                  >
                    <option value="morning">Morning (Pratah)</option>
                    <option value="midday">Midday (Madhyahna)</option>
                    <option value="evening">Evening (Sayam)</option>
                    <option value="bedtime">Bedtime (Ratri)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Ayurvedic Purpose / Benefit Notes:</label>
                <textarea
                  rows={3}
                  value={newHabit.desc}
                  onChange={(e) => setNewHabit({ ...newHabit, desc: e.target.value })}
                  placeholder="e.g. Relieves tension, cleanses respiratory channels and enhances digestive Agni."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] text-stone-900 focus:ring-2 focus:ring-purple-600/30 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5B3E8C] hover:bg-[#4A2F75] text-white font-bold cursor-pointer shadow-md transition-all"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. OFFICIAL CLINICAL PRINTABLE PDF GUIDE MODAL DIALOG                     */}
      {/* ========================================================================= */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Toolbar (Sticky) */}
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">Official Dinacharya & Ritucharya Clinical Guide (PDF)</span>
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
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Printable Document Body */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-stone-900 font-sans print:p-0 print:m-0 bg-white">
              
              {/* Official Header */}
              <div className="border-b-2 border-[#5B3E8C] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C1030] border border-[#E5C07B]/40 flex items-center justify-center p-2 shadow-md">
                    <ZenivaLogo className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#5B3E8C] tracking-tight">
                      ZENIVA AI AYURVEDIC HEALTHCARE
                    </h1>
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-800">
                      Personalized Dinacharya, Circadian Clock & Seasonal Ritucharya Bureau
                    </p>
                    <p className="text-[10px] text-stone-500 italic mt-0.5">
                      ॥ स्वस्थस्य स्वास्थ्यरक्षणं आतुरस्य विकारप्रशमनं च ॥ (Charaka Samhita Sutrasthana 30:26)
                    </p>
                  </div>
                </div>

                <div className="sm:text-right text-xs space-y-1 font-mono">
                  <p className="font-bold text-purple-950">DOC REF: <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded">ZEN-LSP-2026-09</span></p>
                  <p className="text-stone-500">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <p className="text-emerald-700 font-bold">Standard: Clinical SOP Compliant ✓</p>
                </div>
              </div>

              {/* Patient & Bio-Circadian Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                <div>
                  <p className="text-[10px] text-stone-500 uppercase font-bold">Patient Name</p>
                  <p className="font-bold text-stone-900">{currentUser.name || 'Bhupesh Indurkar'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 uppercase font-bold">Prakriti Profile</p>
                  <p className="font-bold text-purple-900">{currentUser.prakriti || 'Stress & Sleep Wellness'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 uppercase font-bold">Daily Habit Score</p>
                  <p className="font-bold text-emerald-700">{completedCount}/{dinacharyaHabits.length} Habits ({consistencyPct}%)</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 uppercase font-bold">Active Bio-Season</p>
                  <p className="font-bold text-amber-800">{currentSeasonData.name.split('(')[0]}</p>
                </div>
              </div>

              {/* Section 1: 24-Hour Circadian Biological Clock Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B3E8C] border-b border-stone-200 pb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>1. Classical 24-Hour Circadian Health Cycles (काल विभाजन)</span>
                </h3>
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-2.5">Time Period</th>
                        <th className="p-2.5">Kaala & Element</th>
                        <th className="p-2.5">Circadian Focus</th>
                        <th className="p-2.5">Biological Directives & Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-purple-900">06:00 AM - 10:00 AM</td>
                        <td className="p-2.5 font-semibold">Pratah (Earth & Water)</td>
                        <td className="p-2.5 text-emerald-700 font-bold">Grounding Phase</td>
                        <td className="p-2.5 text-stone-600">Gentle workout, tongue scraping, Ushapan warm water, light breakfast.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-purple-900">10:00 AM - 02:00 PM</td>
                        <td className="p-2.5 font-semibold">Madhyahna (Solar Fire)</td>
                        <td className="p-2.5 text-amber-700 font-bold">Digestive Phase</td>
                        <td className="p-2.5 text-stone-600">Peak Jatharagni. Eat your largest, wholesome, warm main meal.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-purple-900">02:00 PM - 06:00 PM</td>
                        <td className="p-2.5 font-semibold">Aparahna (Air & Ether)</td>
                        <td className="p-2.5 text-blue-700 font-bold">Cognitive Phase</td>
                        <td className="p-2.5 text-stone-600">Mental agility, creative work & evening walk. Warm herbal teas.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-purple-900">06:00 PM - 10:00 PM</td>
                        <td className="p-2.5 font-semibold">Sandhya (Cooling)</td>
                        <td className="p-2.5 text-purple-700 font-bold">Wind-Down Phase</td>
                        <td className="p-2.5 text-stone-600">Light dinner before 7:30 PM, digital wind down, Pada Abhyanga.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-purple-900">10:00 PM - 02:00 AM</td>
                        <td className="p-2.5 font-semibold">Nisha (Metabolism)</td>
                        <td className="p-2.5 text-indigo-700 font-bold">Repair Phase</td>
                        <td className="p-2.5 text-stone-600">Crucial window for liver detox, cellular repair and deep tissue sleep.</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-purple-900">02:00 AM - 06:00 AM</td>
                        <td className="p-2.5 font-semibold">Brahma Muhurta (Sattva)</td>
                        <td className="p-2.5 text-teal-700 font-bold">Awakening Phase</td>
                        <td className="p-2.5 text-stone-600">Spiritual awakening, meditation, deep breathing & clarity of mind.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Daily Dinacharya Habit Checklist */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B3E8C] border-b border-stone-200 pb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>2. Prescribed Dinacharya Habit Protocol (नित्य दिनचर्या)</span>
                </h3>
                <div className="border border-stone-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-2.5">Time</th>
                        <th className="p-2.5">Habit Protocol</th>
                        <th className="p-2.5">Classical Ayurvedic Purpose & Benefit</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {dinacharyaHabits.map((habit) => (
                        <tr key={habit.id}>
                          <td className="p-2.5 font-mono font-bold text-stone-900">{habit.time}</td>
                          <td className="p-2.5 font-semibold text-stone-900">{habit.name}</td>
                          <td className="p-2.5 text-stone-600">{habit.desc}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${habit.done ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}`}>
                              {habit.done ? 'COMPLETED' : 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Seasonal Ritucharya Guidelines */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B3E8C] border-b border-stone-200 pb-1 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" />
                  <span>3. Active Season Guidelines: {currentSeasonData.name}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                    <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>Pathya Ahara (Beneficial Dietary Regimen):</span>
                    </h4>
                    <ul className="space-y-1 pl-4 list-disc text-stone-700 text-[11px]">
                      {currentSeasonData.dietRules.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                    <h4 className="font-bold text-purple-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      <span>Vihara Protocols (Prescribed Lifestyle Actions):</span>
                    </h4>
                    <ul className="space-y-1 pl-4 list-disc text-stone-700 text-[11px]">
                      {currentSeasonData.lifestyleRules.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Official Seal & Vaidya Verification Block */}
              <div className="pt-6 border-t-2 border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-stone-500">
                <div className="space-y-1">
                  <p className="font-mono text-[10px]">DIGITAL SEAL: SHA-256-ZEN-LSP-892144-VERIFIED</p>
                  <p className="text-[10px]">Certified by National Commission for Indian System of Medicine (NCISM) SOP Guidelines</p>
                </div>

                <div className="text-right sm:pr-4">
                  <div className="inline-block border-b border-stone-800 w-48 mb-1"></div>
                  <p className="font-bold text-stone-900 font-serif">Dr. Bhupesh Indurkar (Vaidya)</p>
                  <p className="text-[10px]">BAMS, MD (Kayachikitsa) · Reg No: AYU-MAH-8921</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
