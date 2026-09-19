import React, { useState } from 'react';
import { 
  BookOpen, Search, Sparkles, Bookmark, Share2, 
  ExternalLink, ChevronRight, CheckCircle2, Feather, ArrowRight,
  Filter, Tag, Eye, Heart, Download, X, Layers, Award,
  Flame, Droplet, Wind, ShieldCheck
} from 'lucide-react';
import { ZenivaLogo } from '../components/ZenivaIcons';

export const KnowledgeLibraryView = ({ 
  currentUser = {},
  onSelectTab = () => {} 
}) => {
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'treatises' | 'herbs' | 'therapies'
  const [selectedText, setSelectedText] = useState('charaka');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemModal, setSelectedItemModal] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(['herb_01', 'sutra_01']);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(prev => prev.filter(b => b !== id));
      showToast('Removed from Bookmarks.');
    } else {
      setBookmarkedIds(prev => [...prev, id]);
      showToast('Saved to Personal Bookmarks! ✓');
    }
  };

  // 1. Classical Brihat Trayi & Laghu Trayi Treatises
  const libraryCorpus = {
    charaka: {
      id: 'treatise_charaka',
      title: 'Charaka Samhita (चरक संहिता)',
      author: 'Maharshi Charaka / Agnivesha',
      era: 'c. 300 BCE · Foundation of Internal Medicine (Kayachikitsa)',
      badge: 'Brihat Trayi Pillar',
      sections: [
        {
          id: 'sutra_01',
          sutra: 'Sutrasthana 1.41',
          verse: 'हिताहितं सुखं दुःखमायुस्तस्य हिताहितम्। मानं च तच्च यत्रोक्तमायुर्वेदः स उच्यते॥',
          translation: 'Ayurveda is that sacred science which elucidates what is wholesome and unwholesome, happy and sorrowful for life, as well as the measure of lifespan itself.',
          clinicalApplication: 'Fundamental definition of holistic well-being encompassing physical body (Sharira), senses (Indriya), mind (Sattva), and soul (Atma).',
          doshaRelevance: 'Holistic Mind-Body Balance'
        },
        {
          id: 'sutra_02',
          sutra: 'Sutrasthana 5.3',
          verse: 'नक्तं दिनेषु च सम्यक् प्रयुञ्जीत मात्रया। आहाराहारविधिं ज्ञात्वा स्वस्थवृत्तमवाप्नुयात्॥',
          translation: 'One who consumes food in proper measure according to time, biological constitution, and digestive capacity attains enduring health.',
          clinicalApplication: 'Agni-centric nutrition: eating only when previous meal is digested and maintaining regular Dinacharya meal schedules.',
          doshaRelevance: 'Digestive Agni Balance'
        },
        {
          id: 'sutra_03',
          sutra: 'Chikitsasthana 1.1.7',
          verse: 'दीर्घमायुः स्मृतं मेधां आरोग्यं तरुणं वपुः। प्रभावर्णस्वरोदार्यं देहेन्द्रियबलं परम्॥',
          translation: 'Through Rasayana (Rejuvenation therapy), one obtains longevity, retentive memory, sharp intellect, freedom from illness, youthfulness, and lustrous complexion.',
          clinicalApplication: 'Rasayana protocols utilizing Amalaki, Ashwagandha, and Triphala for cellular longevity and Ojas vitality.',
          doshaRelevance: 'Ojas & Dhatu Rejuvenation'
        },
        {
          id: 'sutra_04',
          sutra: 'Sutrasthana 11.35',
          verse: 'त्रयस्त्रयस्त्रय इति त्रयः स्तम्भाः शरीरस्य आहारः स्वप्नो ब्रह्मचर्यमिति।',
          translation: 'The three sub-pillars (Trayopastambha) supporting biological life are Wholesome Food (Ahara), Restorative Sleep (Nidra), and Mindful Living (Brahmacharya).',
          clinicalApplication: 'Tri-fold lifestyle foundation ensuring metabolic stability, mental equilibrium, and disease prevention.',
          doshaRelevance: 'All Doshas (Sattva)'
        }
      ]
    },
    sushruta: {
      id: 'treatise_sushruta',
      title: 'Sushruta Samhita (सुश्रुत संहिता)',
      author: 'Maharshi Sushruta (Father of Surgery)',
      era: 'c. 600 BCE · Surgical Principles (Shalya Tantra)',
      badge: 'Father of Surgery',
      sections: [
        {
          id: 'sutra_05',
          sutra: 'Sutrasthana 15.41',
          verse: 'समदोषः समाग्निश्च समधातुमलक्रियः। प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते॥',
          translation: 'One whose Doshas are in equilibrium, Agni is balanced, Dhatus and Malas function normally, and whose Soul, Senses, and Mind are serene, is termed healthy (Svastha).',
          clinicalApplication: 'The definitive classical Ayurvedic definition of total health, combining physical homeostasis with mental and spiritual bliss.',
          doshaRelevance: 'Universal Svastha Standard'
        },
        {
          id: 'sutra_06',
          sutra: 'Sutrasthana 24.8',
          verse: 'दोषधातुमलैर्मूलो देहस्तैरेव धार्यते। तेषां साम्यं च वृद्धिश्च क्षयश्चैव निरूप्यते॥',
          translation: 'The human body is rooted in and sustained by Doshas, Dhatus, and Malas. Their equilibrium is health, whereas their abnormal increase or decrease causes disease.',
          clinicalApplication: 'Etiological foundation: disease pathogenesis (Samprapti) begins when doshic equilibrium is disturbed.',
          doshaRelevance: 'Dhatu & Mala Equilibrium'
        }
      ]
    },
    ashtanga: {
      id: 'treatise_ashtanga',
      title: 'Ashtanga Hridaya (अष्टाङ्ग हृदयम्)',
      author: 'Acharya Vagbhata',
      era: 'c. 600 CE · Synthesis of Charaka & Sushruta',
      badge: 'Clinical Synthesis',
      sections: [
        {
          id: 'sutra_07',
          sutra: 'Sutrasthana 1.1',
          verse: 'रागादिरोगान् सततानुषक्तानशेषकायप्रसृतानशेषान्। औत्सुक्यमोहारतिदान् जघान योऽपूर्ववैद्याय नमोऽस्तु तस्मै॥',
          translation: 'Salutations to the Supreme Healer who eradicated all afflictions born of desire, confusion, and restlessness that pervade the body.',
          clinicalApplication: 'Psychosomatic healing: addressing mental Rajas/Tamas as root origins of physical ailments.',
          doshaRelevance: 'Manasa Dosha & Mental Peace'
        },
        {
          id: 'sutra_08',
          sutra: 'Sutrasthana 2.1',
          verse: 'ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः। शरीरचिन्तां निर्वर्त्य कृतशौचविधिस्ततः॥',
          translation: 'A healthy individual seeking preservation of life should awaken during Brahma Muhurta (pre-dawn), attend to bodily eliminations, and perform ablutions.',
          clinicalApplication: 'Circadian optimization: waking during pre-dawn sattvic hours primes neuroendocrine systems for high mental alertness.',
          doshaRelevance: 'Dinacharya Circadian Laws'
        }
      ]
    }
  };

  // 2. Classical Herbal Materia Medica (Dravyaguna Monograph Dossiers)
  const herbalDossiers = [
    {
      id: 'herb_01',
      name: 'Ashwagandha (अश्वगन्धा)',
      botanical: 'Withania somnifera (Indian Ginseng)',
      family: 'Solanaceae',
      rasa: 'Tikta (Bitter), Kashaya (Astringent), Madhura (Sweet)',
      virya: 'Ushna (Heating)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Grounds Stress & Relieves Joint Stiffness',
      dhatuEffect: 'Nourishes Majja (Nerves) & Shukra (Vitality)',
      clinicalUses: 'Chronic fatigue, adaptogenic stress resilience, neuro-protection, deep restorative sleep, Ojas nourishment.',
      dosage: '3 - 6 grams with warm milk and organic honey before sleep.',
      contraindications: 'Acute gastric inflammation, high fever, severe ulcers.',
      shloka: 'अश्वगन्धाऽनिलश्लेष्मश्वित्रशोथक्षयापहा। बल्या रसायनी तिक्ता कषायोष्णाऽतिशुक्रला॥ (Bhavaprakasha)'
    },
    {
      id: 'herb_02',
      name: 'Brahmi (ब्राह्मी)',
      botanical: 'Bacopa monnieri / Centella asiatica',
      family: 'Plantaginaceae',
      rasa: 'Tikta (Bitter), Kashaya (Astringent)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Calms Cranial Nerves & Neurological Stress',
      dhatuEffect: 'Medha Dhatu (Cognition, Memory, Nervous Tissue)',
      clinicalUses: 'Enhances retentive memory (Medhya), reduces mental agitation, calms ocular & cognitive tension.',
      dosage: '3 - 5 grams ghee formulation (Brahmi Ghrita) in morning.',
      contraindications: 'Excessive sluggish lethargy, acute cold congestion.',
      shloka: 'ब्राह्मी हिमा सरा तिक्ता मेध्या मेधास्मृतिप्रदा। स्वर्यायुष्या स्वादुपाका हृद्या चैव रसायनी॥ (Dhanvantari Nighantu)'
    },
    {
      id: 'herb_03',
      name: 'Triphala (त्रिफला — Haritaki, Bibhitaki, Amalaki)',
      botanical: 'Emblica officinalis + Terminalia chebula + Terminalia bellirica',
      family: 'Combretaceae / Phyllanthaceae',
      rasa: 'Pancharasa (5 Tastes, devoid of Lavana / Salt)',
      virya: 'Anushnasheeta (Balanced Thermal Energy)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Holistic Balancer (Balances All Tissues & Channels)',
      dhatuEffect: 'All 7 Dhatus + Deep Srotas Cleanser',
      clinicalUses: 'Mild bowel regulation, gentle Ama detoxification, ophthalmic rejuvenation (Chakshushya), metabolic harmony.',
      dosage: '3 - 5 grams with warm water at bedtime.',
      contraindications: 'Acute diarrhea, severe dehydration, pregnancy.',
      shloka: 'त्रिफला कफपित्तघ्नी मेहकुष्ठविनाशिनी। चक्षुष्या दीपनी रुच्या विषमज्वरनाशिनी॥ (Charaka Samhita)'
    },
    {
      id: 'herb_04',
      name: 'Guduchi / Giloy (गुडूची — अमृता)',
      botanical: 'Tinospora cordifolia (Amrita - Nectar of Life)',
      family: 'Menispermaceae',
      rasa: 'Tikta (Bitter), Kashaya (Astringent)',
      virya: 'Ushna (Slightly Heating / Balanced)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Supreme Immunomodulator (Soothes Inflammation & Blood Heat)',
      dhatuEffect: 'Rakta Dhatu (Blood) & Immune Ojas',
      clinicalUses: 'Immune modulation, chronic fever (Jwara), metabolic detox, liver protection, uric acid pacification.',
      dosage: '1 - 3 grams Satva / Decoction with warm water.',
      contraindications: 'Excessive hypoglycemia when taking allopathic insulin.',
      shloka: 'गुडूची कटुका तिक्ता स्वादुपाका रसायनी। सङ्ग्राहिणी कषायोष्णा लघ्वी बल्याऽग्निदीपनी॥ (Bhavaprakasha)'
    },
    {
      id: 'herb_05',
      name: 'Shatavari (शतावरी)',
      botanical: 'Asparagus racemosus',
      family: 'Asparagaceae',
      rasa: 'Madhura (Sweet), Tikta (Bitter)',
      virya: 'Sheeta (Cooling)',
      vipaka: 'Madhura (Sweet)',
      doshaKarma: 'Deeply Nourishing & Cooling Tonic',
      dhatuEffect: 'Rasa, Rakta, Shukra / Artava (Reproductive Tissue)',
      clinicalUses: 'Female and male hormonal balance, gastrointestinal soothing, hyperacidity pacification, Rasayana nourishment.',
      dosage: '3 - 6 grams with warm cow milk.',
      contraindications: 'Severe fluid retention, acute kidney edema.',
      shloka: 'शतावरी गुरुः शीता तिक्ता स्वाद्वी रसायनी। मेध्याऽग्निपुष्टिदा स्निग्धा नेत्र्या स्तन्यशुक्रदा॥ (Bhavaprakasha)'
    },
    {
      id: 'herb_06',
      name: 'Haridra / Turmeric (हरिद्रा)',
      botanical: 'Curcuma longa',
      family: 'Zingiberaceae',
      rasa: 'Tikta (Bitter), Katu (Pungent)',
      virya: 'Ushna (Heating)',
      vipaka: 'Katu (Pungent)',
      doshaKarma: 'Purifies Blood Channels & Soothes Inflammation',
      dhatuEffect: 'Rakta (Blood), Twak (Skin), Meda (Fat metabolism)',
      clinicalUses: 'Potent anti-inflammatory, wound healing (Vranaropana), complexion enhancer (Varnya), blood purification.',
      dosage: '1 - 3 grams with black pepper and warm ghee or milk.',
      contraindications: 'Acute bile duct obstruction, active severe bleeding.',
      shloka: 'हरिद्रा कटुतिक्तोष्णा व्रणदोषविशोधनी। कफवातहरी वर्ण्या मेहकुष्ठास्रपित्तनुत्॥ (Bhavaprakasha)'
    }
  ];

  // 3. Classical Panchakarma & Upakarma Therapies Dossiers
  const therapyDossiers = [
    {
      id: 'ther_01',
      name: 'Abhyanga (अभ्यङ्ग — Medicated Warm Oil Massage)',
      type: 'Purva Karma (Preparatory Snehana)',
      duration: '45 - 60 Minutes',
      oilUsed: 'Mahanarayan Taila / Dhanwantharam Taila / Sesame Oil',
      indications: 'Musculoskeletal stiffness, joint immobility, dry skin, insomnia, physical exhaustion, nervous exhaustion.',
      mechanism: 'Penetrates through 7 tissue layers, eases somatic tension, mobilizes deep cellular Ama into GI tract.'
    },
    {
      id: 'ther_02',
      name: 'Shirodhara (शिरोधारा — Medicated Head Oil Pouring)',
      type: 'Pradhana Upakarma (Neurological Regimen)',
      duration: '35 - 45 Minutes',
      oilUsed: 'Ksheerabala Taila / Brahmi Taila / Buttermilk (Takradhara)',
      indications: 'Anxiety, hypertension, insomnia, migraine, chronic stress, ocular eye strain.',
      mechanism: 'Continuous rhythmic rhythmic flow across Ajna Marma synchronizes alpha brainwave activity.'
    },
    {
      id: 'ther_03',
      name: 'Nasya Karma (नस्य कर्म — Medicated Nasal Oil Instillation)',
      type: 'Panchakarma Detox (Head & Respiratory Purification)',
      duration: '20 Minutes (Post facial steam)',
      oilUsed: 'Anu Taila / Shadbindu Taila / Cow Ghee',
      indications: 'Sinus congestion, cervical spondylosis, hair thinning, mental fog, seasonal allergies.',
      mechanism: 'Nose is the gateway to the head (नासा हि शिरसो द्वारम्). Cleanses Urdhwajatrugata micro-channels.'
    }
  ];

  // Filter items based on activeCategory and searchQuery
  const filteredTreatiseSections = libraryCorpus[selectedText]?.sections.filter(s => 
    !searchQuery || 
    s.sutra.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.clinicalApplication.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.verse.includes(searchQuery)
  ) || [];

  const filteredHerbs = herbalDossiers.filter(h => 
    !searchQuery ||
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.botanical.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.clinicalUses.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.doshaKarma.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTherapies = therapyDossiers.filter(t => 
    !searchQuery ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.indications.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 max-w-[1500px] mx-auto space-y-6 bg-[#FAF7F2] min-h-screen select-none font-sans">
      
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-purple-950 text-white font-bold text-xs flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-3 border border-purple-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER & SEARCH BANNER                                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D5] shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B3E8C]">
              <BookOpen className="w-4 h-4 text-purple-700" />
              <span>Classical Ayurvedic Brihat-Trayi & Dravyaguna Archives</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Ayurvedic Knowledge Library & Classical Treatises (संहिता एवं द्रव्यगुण)
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Authoritative Charaka, Sushruta & Vagbhata Sanskrit verses with verified clinical English translations and herbal monographs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onSelectTab('consultation')}
              className="px-4 py-2 rounded-xl bg-[#5B3E8C] hover:bg-[#4A2F75] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <span>Consult Certified Vaidya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: 'All Knowledge' },
              { id: 'treatises', label: '📜 Brihat Samhitas' },
              { id: 'herbs', label: '🌿 Herbal Monograph' },
              { id: 'therapies', label: '🪷 Panchakarma Therapies' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === tab.id 
                    ? 'bg-[#1E5039] text-white shadow-xs' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search herbs, shlokas, doshas..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-[#FAF8F5] focus:bg-white focus:ring-2 focus:ring-purple-600/20 outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECTION 1: CLASSICAL BRIHAT-TRAYI TREATISES (If selected)              */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'treatises') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D5] shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-purple-700" />
                <h2 className="text-lg font-serif font-bold text-stone-900">Classical Brihat Samhita Sutras</h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Select a classical medical text to explore original Sanskrit shlokas and clinical applications.</p>
            </div>

            {/* Samhita Selector Pills */}
            <div className="flex gap-1.5">
              {[
                { id: 'charaka', label: 'Charaka Samhita' },
                { id: 'sushruta', label: 'Sushruta Samhita' },
                { id: 'ashtanga', label: 'Ashtanga Hridaya' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedText(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedText === t.id 
                      ? 'bg-[#5B3E8C] text-white shadow-2xs' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Treatise Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-stone-50 to-amber-50 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold uppercase tracking-wider">
                {libraryCorpus[selectedText].badge}
              </span>
              <h3 className="text-lg font-bold font-serif text-stone-900">{libraryCorpus[selectedText].title}</h3>
              <p className="text-xs text-stone-600 font-semibold">{libraryCorpus[selectedText].author} · <span className="font-normal">{libraryCorpus[selectedText].era}</span></p>
            </div>
          </div>

          {/* Shloka Verses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTreatiseSections.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItemModal({ ...item, sourceTitle: libraryCorpus[selectedText].title, type: 'sutra' })}
                className="p-5 rounded-2xl border border-stone-200 bg-[#FAF8F5] hover:bg-white hover:border-purple-300 hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between border-b border-stone-200/70 pb-2">
                  <span className="text-xs font-mono font-bold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded-md">
                    {item.sutra}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {item.doshaRelevance}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(item.id, e)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        bookmarkedIds.includes(item.id) ? 'text-amber-600 bg-amber-50' : 'text-stone-400 hover:text-stone-700'
                      }`}
                      title="Bookmark this Shloka"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Sanskrit Verse */}
                <p className="text-xs font-serif font-bold text-stone-900 leading-relaxed text-purple-950/90 italic bg-white p-3 rounded-xl border border-stone-100">
                  {item.verse}
                </p>

                {/* English Meaning */}
                <div className="space-y-1 text-xs">
                  <p className="text-stone-700 leading-relaxed">
                    <strong>Translation:</strong> {item.translation}
                  </p>
                  <p className="text-stone-500 text-[11px] leading-relaxed pt-1">
                    <strong className="text-emerald-800">Clinical Takeaway:</strong> {item.clinicalApplication}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end text-[11px] font-bold text-purple-800 group-hover:translate-x-1 transition-transform">
                  <span>Read Full Commentary →</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SECTION 2: CLASSICAL HERBAL MATERIA MEDICA (DRAVYAGUNA)                */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'herbs') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D5] shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h2 className="text-lg font-serif font-bold text-stone-900">Classical Herbal Materia Medica (द्रव्यगुण विज्ञान)</h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Pharmacological profiles with Sanskrit Shlokas, Rasa, Virya, Vipaka, and therapeutic dosages.</p>
            </div>

            <span className="text-xs font-bold text-emerald-800 font-mono bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {filteredHerbs.length} Monograph Profiles
            </span>
          </div>

          {/* Herbs Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredHerbs.map((herb) => (
              <div
                key={herb.id}
                onClick={() => setSelectedItemModal({ ...herb, type: 'herb' })}
                className="p-5 rounded-2xl border border-stone-200 bg-[#FAF8F5] hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2 border-b border-stone-200/70 pb-2">
                    <div>
                      <h3 className="text-sm font-bold font-serif text-stone-900 group-hover:text-emerald-900 transition-colors">
                        {herb.name}
                      </h3>
                      <p className="text-[10px] text-stone-500 italic font-mono">{herb.botanical}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(herb.id, e)}
                      className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                        bookmarkedIds.includes(herb.id) ? 'text-amber-600 bg-amber-50' : 'text-stone-400 hover:text-stone-700'
                      }`}
                      title="Bookmark Herb"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Dosha & Thermal Action Pill */}
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {herb.doshaKarma}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                      {herb.virya}
                    </span>
                  </div>

                  {/* Rasa & Vipaka */}
                  <div className="text-[11px] text-stone-600 space-y-0.5">
                    <p><strong>Rasa:</strong> {herb.rasa}</p>
                    <p><strong>Dhatu:</strong> {herb.dhatuEffect}</p>
                  </div>

                  {/* Clinical Uses */}
                  <p className="text-[11px] text-stone-700 line-clamp-2 leading-snug">
                    <strong>Indications:</strong> {herb.clinicalUses}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 font-mono text-[10px]">Dose: {herb.dosage.split(' ')[0]} {herb.dosage.split(' ')[1]}</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    View Dossier →
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SECTION 3: CLASSICAL PANCHAKARMA & UPAKARMA REGIMEN                     */}
      {/* ========================================================================= */}
      {(activeCategory === 'all' || activeCategory === 'therapies') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D5] shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-700" />
                <h2 className="text-lg font-serif font-bold text-stone-900">Panchakarma & Clinical Therapies (शोधन एवं शमन चिकित्सा)</h2>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Classical procedures for systemic detoxification and deep cellular re-balancing.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredTherapies.map((ther) => (
              <div
                key={ther.id}
                onClick={() => setSelectedItemModal({ ...ther, type: 'therapy' })}
                className="p-5 rounded-2xl border border-stone-200 bg-[#FAF8F5] hover:bg-white hover:border-purple-300 hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="space-y-1 border-b border-stone-200/70 pb-2">
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold">
                    {ther.type}
                  </span>
                  <h3 className="text-sm font-bold font-serif text-stone-900 mt-1">{ther.name}</h3>
                  <p className="text-[10px] text-stone-500 font-mono">Duration: {ther.duration}</p>
                </div>

                <div className="text-[11px] text-stone-600 space-y-1">
                  <p><strong>Medicated Oils:</strong> {ther.oilUsed}</p>
                  <p className="text-stone-700 leading-snug"><strong>Indications:</strong> {ther.indications}</p>
                </div>

                <div className="pt-2 text-right text-[11px] font-bold text-purple-800 group-hover:translate-x-1 transition-transform">
                  <span>Therapy Protocol →</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE DETAIL MODAL READER                                        */}
      {/* ========================================================================= */}
      {selectedItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#EBE3D5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <span className="font-bold text-sm">
                  {selectedItemModal.type === 'herb' ? 'Herbal Monograph Dossier' : selectedItemModal.type === 'sutra' ? 'Samhita Classical Shloka Commentary' : 'Therapy Protocol Guide'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemModal(null)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs font-sans">
              
              {/* Herb Modal View */}
              {selectedItemModal.type === 'herb' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-200 pb-3">
                    <h2 className="text-xl font-bold font-serif text-stone-900">{selectedItemModal.name}</h2>
                    <p className="text-xs text-stone-500 italic font-mono">{selectedItemModal.botanical} · Family: {selectedItemModal.family}</p>
                  </div>

                  {/* Original Sanskrit Shloka */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1 text-center">
                    <span className="text-[10px] font-bold text-amber-900 uppercase">Classical Nighantu Shloka</span>
                    <p className="text-xs font-serif font-bold text-amber-950 leading-relaxed italic">
                      {selectedItemModal.shloka}
                    </p>
                  </div>

                  {/* Pharmacological Matrix */}
                  <div className="grid grid-cols-2 gap-2.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-stone-800">
                    <div><strong>Rasa (Taste):</strong> {selectedItemModal.rasa}</div>
                    <div><strong>Virya (Potency):</strong> {selectedItemModal.virya}</div>
                    <div><strong>Vipaka (Post-Digestive):</strong> {selectedItemModal.vipaka}</div>
                    <div><strong>Therapeutic Action:</strong> {selectedItemModal.doshaKarma}</div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-stone-800 leading-relaxed">
                      <strong>Therapeutic Indications & Action:</strong><br />
                      {selectedItemModal.clinicalUses}
                    </p>
                    <p className="text-stone-800 leading-relaxed">
                      <strong>Recommended Clinical Dosage:</strong><br />
                      {selectedItemModal.dosage}
                    </p>
                    <p className="text-red-700 leading-relaxed">
                      <strong>Contraindications:</strong> {selectedItemModal.contraindications}
                    </p>
                  </div>
                </div>
              )}

              {/* Shloka Modal View */}
              {selectedItemModal.type === 'sutra' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-200 pb-3">
                    <span className="text-xs font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                      {selectedItemModal.sutra}
                    </span>
                    <h2 className="text-lg font-bold font-serif text-stone-900 mt-1">{selectedItemModal.sourceTitle}</h2>
                  </div>

                  <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-2 text-center">
                    <p className="text-sm font-serif font-bold text-purple-950 leading-relaxed">
                      {selectedItemModal.verse}
                    </p>
                  </div>

                  <div className="space-y-3 text-stone-800">
                    <div>
                      <strong className="text-stone-900 text-xs block mb-0.5">Classical Translation (भावार्थ):</strong>
                      <p className="leading-relaxed text-stone-700">{selectedItemModal.translation}</p>
                    </div>
                    <div>
                      <strong className="text-emerald-900 text-xs block mb-0.5">Clinical Practice Application (चिकित्सा उपयोगिता):</strong>
                      <p className="leading-relaxed text-stone-700">{selectedItemModal.clinicalApplication}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Therapy Modal View */}
              {selectedItemModal.type === 'therapy' && (
                <div className="space-y-4">
                  <div className="border-b border-stone-200 pb-3">
                    <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                      {selectedItemModal.type}
                    </span>
                    <h2 className="text-xl font-bold font-serif text-stone-900 mt-1">{selectedItemModal.name}</h2>
                    <p className="text-xs text-stone-500 font-mono">Standard Clinical Duration: {selectedItemModal.duration}</p>
                  </div>

                  <div className="space-y-3 text-stone-800">
                    <div>
                      <strong className="text-stone-900 text-xs block mb-0.5">Classical Therapeutic Oils / Decoctions:</strong>
                      <p className="leading-relaxed text-stone-700">{selectedItemModal.oilUsed}</p>
                    </div>
                    <div>
                      <strong className="text-stone-900 text-xs block mb-0.5">Clinical Indications:</strong>
                      <p className="leading-relaxed text-stone-700">{selectedItemModal.indications}</p>
                    </div>
                    <div>
                      <strong className="text-purple-900 text-xs block mb-0.5">Physiological Mechanism of Action:</strong>
                      <p className="leading-relaxed text-stone-700">{selectedItemModal.mechanism}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    toggleBookmark(selectedItemModal.id, { stopPropagation: () => {} });
                  }}
                  className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{bookmarkedIds.includes(selectedItemModal.id) ? 'Bookmarked ✓' : 'Bookmark'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedItemModal(null);
                    onSelectTab('consultation');
                  }}
                  className="px-5 py-2 rounded-xl bg-[#5B3E8C] hover:bg-[#4A2F75] text-white font-bold cursor-pointer shadow-md transition-all"
                >
                  Ask Doctor About This
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
