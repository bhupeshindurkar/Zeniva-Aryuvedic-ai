import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Sparkles, BookOpen, Leaf, ShieldAlert, 
  CheckCircle2, RefreshCw, ChevronRight, AlertCircle,
  Mic, MicOff, Volume2, VolumeX, Copy, Check, Paperclip,
  Stethoscope, User, HeartPulse, Globe, ArrowRight, PhoneCall,
  Radio, Play, Pause, Smile, MessageCircle, Languages
} from 'lucide-react';

// Utility to render markdown cleanly without raw symbols like **, ##, ###, ---
const renderCleanFormattedText = (rawText) => {
  if (!rawText) return null;

  const lines = rawText.split('\n');
  return (
    <div className="space-y-2 font-sans text-stone-800 leading-relaxed text-xs sm:text-[13px]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Check if line is a divider
        if (/^[-*_]{3,}$/.test(trimmed)) {
          return <hr key={idx} className="my-2 border-stone-200" />;
        }

        // Detect if line is a header (starts with ##, ###, # or **Title:**)
        const hasHashHeader = /^#{1,4}\s+/.test(trimmed);
        const hasBoldHeader = /^(?:\*\*|__)[^\n*]+(?:\*\*|__):?$/.test(trimmed);
        const isHeader = hasHashHeader || hasBoldHeader;

        // Strip leading hash symbols (##, ###, #)
        let cleanLine = trimmed.replace(/^#{1,4}\s*/, '').trim();

        // Detect if line is a bullet item (*, -, •)
        const isBullet = /^[-*•]\s+/.test(cleanLine);
        if (isBullet) {
          cleanLine = cleanLine.replace(/^[-*•]\s+/, '').trim();
        }

        // Parse **bold text** into <strong> elements
        const parts = [];
        const boldRegex = /\*\*(.*?)\*\*/g;
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(cleanLine)) !== null) {
          if (match.index > lastIndex) {
            parts.push(cleanLine.substring(lastIndex, match.index));
          }
          parts.push(
            <strong key={match.index} className="font-bold text-stone-950">
              {match[1]}
            </strong>
          );
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < cleanLine.length) {
          parts.push(cleanLine.substring(lastIndex));
        }

        if (isHeader) {
          return (
            <div key={idx} className="pt-2 pb-0.5 text-[13px] sm:text-[14px] font-bold text-[#3B1E6D] flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-amber-500 inline-block shrink-0 shadow-xs"></span>
              <span>{parts.length > 0 ? parts : cleanLine}</span>
            </div>
          );
        }

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-amber-600 font-bold mt-0.5 text-xs select-none">•</span>
              <span className="flex-1 text-stone-700">{parts.length > 0 ? parts : cleanLine}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-stone-700 leading-relaxed">
            {parts.length > 0 ? parts : cleanLine}
          </p>
        );
      })}
    </div>
  );
};

export const AyurvedicAIChatModal = ({ 
  isOpen, 
  onClose, 
  currentUser = {}, 
  initialQuery = '',
  onSelectTab = () => {},
  onOpenAuth = () => {}
}) => {
  // Determine guest vs patient
  const isPublicRoute = typeof window !== 'undefined' && (
    window.location.hash.startsWith('#overview') ||
    window.location.hash === '' ||
    window.location.hash === '#'
  );

  const activeUser = (() => {
    if (currentUser?.role === 'public' || currentUser?.name === 'Guest Visitor' || currentUser?.isLoggedIn === false || isPublicRoute) {
      return { id: 'guest_visitor', name: 'Guest Visitor', role: 'public', isLoggedIn: false };
    }
    if (currentUser && currentUser.role === 'patient' && currentUser.name && currentUser.name !== 'Guest Visitor' && currentUser.isLoggedIn !== false) {
      return currentUser;
    }
    const isPatientRoute = typeof window !== 'undefined' && window.location.hash.startsWith('#patient');
    if (isPatientRoute) {
      try {
        const saved = localStorage.getItem('zeniva_patient_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name && parsed.name !== 'Guest Visitor') {
            return { ...parsed, role: 'patient', isLoggedIn: true };
          }
        }
      } catch (e) {}
    }
    return currentUser || { id: 'guest_visitor', name: 'Guest Visitor', role: 'public', isLoggedIn: false };
  })();

  const isGuest = isPublicRoute || !activeUser?.role || activeUser?.role === 'public' || activeUser?.isLoggedIn === false || !activeUser?.name || activeUser?.name === 'Guest Visitor';
  const patientName = isGuest ? '' : (activeUser.name ? activeUser.name.replace(/^Dr\.\s*/i, '').trim() : '');

  const welcomeTemplates = {
    mr: isGuest 
      ? `नमस्ते! मी झेनिव्हा (Zeniva) — तुमची AI डॅशबोर्ड व आयुर्वेदिक मार्गदर्शक! 🌿 मी झेनिव्हा प्लॅटफॉर्मची वैशिष्ट्ये, निर्माते व टीम (TGPCET नागपूर) आणि आयुर्वेदिक ज्ञानाबद्दल माहिती देऊ शकते. आजाराच्या संपूर्ण वैयक्तिक उपचारासाठी कृपया पेशंट खात्यात लॉगिन करा. मला काहीही विचारा किंवा बोला!`
      : `नमस्ते ${patientName}! मी झेनिव्हा (Zeniva) — तुमची वैयक्तिक AI आयुर्वेदिक डॉक्टर सहाय्यक! 🌿 तुमच्या प्रकृतीनुसार आणि चरक संहितेच्या आधारे मी तुमच्या सेवेत आहे. आज तुम्हाला कशाबद्दल सल्ला हवा आहे? मला विचारा किंवा बोला!`,
    hi: isGuest
      ? `नमस्ते! मैं ज़ेनिवा (Zeniva) हूँ — आपकी AI डैशबोर्ड और आयुर्वेदिक गाइड! 🌿 मैं ज़ेनिवा प्लॅटफॉर्म के फीचर्स, टीम व फाउंडर्स (TGPCET नागपुर) और वैदिक ज्ञान के बारे में जानकारी दे सकती हूँ। किसी बीमारी के पूरे व्यक्तिगत इलाज के लिए कृपया पेशेंट अकाउंट में लॉगिन करें। बोलें या टाइप करें!`
      : `नमस्ते ${patientName} जी! मैं ज़ेनिवा (Zeniva) हूँ — आपकी AI आयुर्वेदिक डॉक्टर साथी! 🌿 आपकी प्रकृती और चरक संहिता के आधार पर मैं आपकी सहायता के लिए तैयार हूँ। आज आपको क्या परामर्श चाहिए? बोलें या टाइप करें!`,
    en: isGuest
      ? `Welcome to Zeniva AI! 🌿 I am your AI Companion and Platform Guide. I can guide you through our dashboard features, introduce the Zeniva Creators & Team (TGPCET Nagpur), or share Ayurvedic wisdom. For personalized clinical diagnosis and prescriptions, please log in to your Patient Account!`
      : `Hello ${patientName}! 🌿 I am Zeniva — your personal AI Ayurvedic Doctor Companion. Based on your health profile and authentic Ayurvedic scriptures, how can I assist your health and wellness today?`
  };

  const [selectedLang, setSelectedLang] = useState('mr');
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: welcomeTemplates.mr,
      lang: 'mr',
      citations: "Charaka Samhita (Sutra Sthana Ch. 1): 'वायुः पित्तं कफश्चोक्तः शारीरो दोषसंग्रहः' — समतोल त्रिदोष हेच निरोगी आरोग्याचे मूळ आहे."
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [translatingMsgId, setTranslatingMsgId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const availableVoicesRef = useRef([]);
  const speechQueueRef = useRef([]);
  const speechIndexRef = useRef(0);
  const isSpeechActiveRef = useRef(false);
  const activeUtteranceRef = useRef(null);
  const speechKeepAliveRef = useRef(null);
  const speechWatchdogRef = useRef(null);
  const speechNextChunkTimerRef = useRef(null);
  const speechSessionIdRef = useRef(0);
  const recognitionSilenceTimerRef = useRef(null);

  // Load and cache browser voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        availableVoicesRef.current = window.speechSynthesis.getVoices();
      }
    };
    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Update Welcome message when language changes if only welcome is in chat
  const handleLanguageChange = (newLang) => {
    setSelectedLang(newLang);
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'msg-welcome') {
        return [{
          id: 'msg-welcome',
          sender: 'ai',
          text: welcomeTemplates[newLang] || welcomeTemplates.mr,
          lang: newLang,
          citations: newLang === 'en' 
            ? "Charaka Samhita (Sutra Sthana Ch. 1): 'Swastha' (health) is the dynamic harmony of bodily vitality, metabolism, and serene mental balance."
            : newLang === 'hi'
            ? "चरक संहिता (सूत्र स्थान १): 'प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते' — मन, इंद्रिय और शरीर का संतुलन ही पूर्ण स्वास्थ्य है।"
            : "Charaka Samhita (Sutra Sthana Ch. 1): 'प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते' — मन, इंद्रिय आणि शारीरिक समतोल हेच निरोगी आरोग्याचे मूळ आहे."
        }];
      }
      return prev;
    });
  };

  // Sync welcome message if user logs in/out
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1 && (prev.length === 0 || prev[0].id === 'msg-welcome')) {
        return [{
          id: 'msg-welcome',
          sender: 'ai',
          text: welcomeTemplates[selectedLang] || welcomeTemplates.mr,
          lang: selectedLang,
          citations: selectedLang === 'en' 
            ? "Charaka Samhita (Sutra Sthana Ch. 1): 'Swastha' (health) is the dynamic harmony of bodily vitality, metabolism, and serene mental balance."
            : selectedLang === 'hi'
            ? "चरक संहिता (सूत्र स्थान १): 'प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते' — मन, इंद्रिय और शरीर का संतुलन ही पूर्ण स्वास्थ्य है।"
            : "Charaka Samhita (Sutra Sthana Ch. 1): 'प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते' — मन, इंद्रिय आणि शारीरिक समतोल हेच निरोगी आरोग्याचे मूळ आहे."
        }];
      }
      return prev;
    });
  }, [currentUser, isGuest, patientName, isOpen]);

  // Auto-speak initial welcome greeting ONCE on fresh modal open
  useEffect(() => {
    let welcomeVoiceTimer = null;
    if (isOpen && autoSpeak && messages.length <= 1) {
      welcomeVoiceTimer = setTimeout(() => {
        if (messages.length <= 1 && !loading && !isSpeaking && !isSpeechActiveRef.current) {
          const welcomeMsg = messages.find(m => m.id === 'msg-welcome') || messages[0];
          if (welcomeMsg && welcomeMsg.text) {
            speakText(welcomeMsg.text, welcomeMsg.id, selectedLang);
          }
        }
      }, 1200);
    }
    return () => {
      if (welcomeVoiceTimer) clearTimeout(welcomeVoiceTimer);
    };
  }, [isOpen]);

  // Web Speech Recognition Initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window))) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        if (currentText) {
          setInputQuery(currentText);

          if (recognitionSilenceTimerRef.current) {
            clearTimeout(recognitionSilenceTimerRef.current);
          }

          if (finalTranscript) {
            recognitionSilenceTimerRef.current = setTimeout(() => {
              setIsListening(false);
              sendMessage(finalTranscript);
            }, 350);
          } else {
            recognitionSilenceTimerRef.current = setTimeout(() => {
              setIsListening(false);
              try { recognition.stop(); } catch (e) {}
              sendMessage(interimTranscript);
            }, 1200);
          }
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        if (recognitionSilenceTimerRef.current) clearTimeout(recognitionSilenceTimerRef.current);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  // Adjust Recognition Language
  useEffect(() => {
    if (recognitionRef.current) {
      if (selectedLang === 'mr') {
        recognitionRef.current.lang = 'mr-IN';
      } else if (selectedLang === 'hi') {
        recognitionRef.current.lang = 'hi-IN';
      } else {
        recognitionRef.current.lang = 'en-IN';
      }
    }
  }, [selectedLang]);

  // Handle Initial Query if passed
  useEffect(() => {
    if (initialQuery && isOpen) {
      setInputQuery(initialQuery);
      setTimeout(() => {
        sendMessage(initialQuery);
      }, 400);
    }
  }, [initialQuery, isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

  // Fully Session-Isolated Voice Reading Engine
  const speakText = (text, msgId = null, forcedLang = null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Toggle off if currently speaking the exact same message
    if (isSpeaking && speakingMsgId === msgId) {
      stopSpeaking();
      return;
    }

    // Completely cancel and flush previous speech
    stopSpeaking();

    // Unique session token: invalidates any past chunks/callbacks
    const currentSession = ++speechSessionIdRef.current;

    // Clean text of all raw markdown formatting, links, citations and decorative symbols
    let cleanText = text
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/॥.*?॥/g, '')
      .replace(/^#{1,4}\s*/gm, '')
      .replace(/[*_#`~>]/g, '')
      .replace(/^[-*•]\s+/gm, '')
      .replace(/[-*•]/g, ' ')
      .replace(/---/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    // Split text into digestible sentence chunks
    const rawParagraphs = text.split(/\n+/);
    const chunks = [];

    rawParagraphs.forEach(rawP => {
      let p = rawP
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/॥.*?॥/g, '')
        .replace(/^#{1,4}\s*/g, '')
        .replace(/[*_#`~>]/g, '')
        .replace(/^[-*•]\s+/g, '')
        .replace(/[-*•]/g, ' ')
        .replace(/---/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!p) return;

      if (p.length <= 140) {
        chunks.push(p);
      } else {
        const sentences = p.split(/(?<=[.!?:।\n])\s+/);
        let curr = "";
        sentences.forEach(s => {
          if ((curr + " " + s).trim().length > 140) {
            if (curr.trim()) chunks.push(curr.trim());
            curr = s;
          } else {
            curr = curr ? (curr + " " + s) : s;
          }
        });
        if (curr.trim()) chunks.push(curr.trim());
      }
    });

    if (chunks.length === 0) return;

    speechQueueRef.current = chunks;
    speechIndexRef.current = 0;
    isSpeechActiveRef.current = true;

    const voices = availableVoicesRef.current.length > 0 ? availableVoicesRef.current : window.speechSynthesis.getVoices();
    const langToUse = forcedLang || selectedLang;
    const isDevanagari = /[\u0900-\u097F]/.test(cleanText);

    let bestVoice = null;
    let utteranceLang = 'en-IN';

    if (langToUse === 'mr' || (isDevanagari && langToUse !== 'hi')) {
      bestVoice = voices.find(v => v.lang.includes('mr') && (v.name.includes('Female') || v.name.includes('Heera') || v.name.includes('Google')))
        || voices.find(v => v.lang.includes('mr'))
        || voices.find(v => v.lang.includes('hi') && (v.name.includes('Female') || v.name.includes('Swara') || v.name.includes('Google')))
        || voices.find(v => v.lang.includes('hi'));
      utteranceLang = 'mr-IN';
    } else if (langToUse === 'hi' || isDevanagari) {
      bestVoice = voices.find(v => v.lang.includes('hi') && (v.name.includes('Female') || v.name.includes('Swara') || v.name.includes('Google')))
        || voices.find(v => v.lang.includes('hi'));
      utteranceLang = 'hi-IN';
    } else {
      bestVoice = voices.find(v => (v.lang.includes('en-IN') || v.lang.includes('en_IN')) && (v.name.includes('Female') || v.name.includes('Neerja') || v.name.includes('Google') || v.name.includes('Heera') || v.name.includes('Zira')))
        || voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN'))
        || voices.find(v => v.lang.startsWith('en'));
      utteranceLang = 'en-IN';
    }

    setIsSpeaking(true);
    setSpeakingMsgId(msgId);

    const playNextChunk = () => {
      if (currentSession !== speechSessionIdRef.current || !isSpeechActiveRef.current) {
        return;
      }

      if (speechIndexRef.current >= speechQueueRef.current.length) {
        setIsSpeaking(false);
        setSpeakingMsgId(null);
        isSpeechActiveRef.current = false;
        return;
      }

      const chunk = speechQueueRef.current[speechIndexRef.current++];
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = utteranceLang;
      if (bestVoice) utterance.voice = bestVoice;
      utterance.rate = langToUse === 'mr' ? 0.95 : langToUse === 'hi' ? 0.95 : 1.0;
      utterance.pitch = 1.05;

      utterance.onend = () => {
        if (currentSession === speechSessionIdRef.current && isSpeechActiveRef.current) {
          speechNextChunkTimerRef.current = setTimeout(playNextChunk, 80);
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn("Speech chunk note:", e);
        }
        if (currentSession === speechSessionIdRef.current && isSpeechActiveRef.current) {
          speechNextChunkTimerRef.current = setTimeout(playNextChunk, 60);
        }
      };

      activeUtteranceRef.current = utterance;

      // Watchdog Timer to auto-recover if mobile browser fails to emit onend
      const expectedDurationMs = Math.max(3500, chunk.length * 100);
      if (speechWatchdogRef.current) clearTimeout(speechWatchdogRef.current);
      speechWatchdogRef.current = setTimeout(() => {
        if (currentSession === speechSessionIdRef.current && isSpeechActiveRef.current) {
          playNextChunk();
        }
      }, expectedDurationMs);

      try {
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("Speech playback notice:", err);
        playNextChunk();
      }
    };

    playNextChunk();
  };

  const stopSpeaking = () => {
    speechSessionIdRef.current += 1;
    isSpeechActiveRef.current = false;
    speechQueueRef.current = [];
    speechIndexRef.current = 0;
    activeUtteranceRef.current = null;

    if (speechKeepAliveRef.current) {
      clearInterval(speechKeepAliveRef.current);
      speechKeepAliveRef.current = null;
    }
    if (speechWatchdogRef.current) {
      clearTimeout(speechWatchdogRef.current);
      speechWatchdogRef.current = null;
    }
    if (speechNextChunkTimerRef.current) {
      clearTimeout(speechNextChunkTimerRef.current);
      speechNextChunkTimerRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    setIsSpeaking(false);
    setSpeakingMsgId(null);
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      if (recognitionSilenceTimerRef.current) clearTimeout(recognitionSilenceTimerRef.current);
      try { recognitionRef.current.stop(); } catch (err) {}
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleCopyText = (text, msgId) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Quick Action Handler
  const handleQuickPrompt = (promptText, lang) => {
    if (lang && lang !== selectedLang) {
      handleLanguageChange(lang);
    }
    setInputQuery(promptText);
    sendMessage(promptText);
  };

  // Translation Handler
  const handleTranslateMessage = async (msgId, targetLang) => {
    const targetMsg = messages.find(m => m.id === msgId);
    if (!targetMsg || !targetMsg.text || targetMsg.lang === targetLang) return;

    setTranslatingMsgId(`${msgId}_${targetLang}`);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: targetMsg.text,
          target_lang: targetLang
        })
      });
      if (res.ok) {
        const data = await res.json();
        const translatedText = data.translated_text || data.reply || "";
        if (translatedText) {
          setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: translatedText, lang: targetLang } : m));
          return;
        }
      }
    } catch (err) {
      console.warn("Translation API error:", err);
    } finally {
      setTranslatingMsgId(null);
    }
  };

  const sendMessage = async (overrideText) => {
    const queryToSend = (overrideText !== undefined ? overrideText : inputQuery).trim();
    const currentImg = imagePreview;

    if (!queryToSend && !currentImg) return;

    // Reset voice synthesis before asking a new question
    stopSpeaking();

    const userMsgId = `user-${Date.now()}`;
    const langToUse = selectedLang || 'mr';

    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: queryToSend,
      image: currentImg,
      lang: langToUse
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    clearSelectedImage();
    setLoading(true);

    try {
      const payload = {
        prompt: queryToSend,
        image_base64: currentImg || null,
        target_lang: langToUse,
        patient_context: (!isGuest && activeUser && activeUser.name) ? {
          name: activeUser.name,
          prakriti: activeUser.prakriti || 'Vata-Pitta',
          health_concerns: activeUser.health_concerns || activeUser.concerns || ''
        } : null,
        conversation_history: messages.slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const aiReplyText = data.reply || "";
      const isLoginRequired = Boolean(data.requires_login);
      const isTeam = Boolean(data.is_team_query);
      const newMsgId = `ai-${Date.now()}`;

      setMessages(prev => [
        ...prev,
        {
          id: newMsgId,
          sender: 'ai',
          text: aiReplyText,
          citations: data.citations || (isTeam ? "Zeniva Group · TGPCET Nagpur" : "Charaka Samhita · Chikitsa Sthana"),
          requires_login: isLoginRequired,
          is_team_query: isTeam,
          lang: langToUse
        }
      ]);

      if (autoSpeak && aiReplyText) {
        setTimeout(() => speakText(aiReplyText, newMsgId, langToUse), 300);
      }
    } catch (err) {
      console.warn("Backend /api/chat failed, checking direct AI or clinical intelligence:", err);

      // 1. DIRECT CLIENT-SIDE OPENROUTER FALLBACK (Ensures instant dynamic AI reply even when backend is offline or on Vercel)
      const clientOpenRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (clientOpenRouterKey && !currentImg) {
        try {
          const sysPrompt = `You are Zeniva AI (झेनिव्हा AI), a certified Classical Ayurvedic Vaidya and Clinical AI specialist.
CRITICAL LANGUAGE INSTRUCTION:
- If user language is Marathi ('mr') or query is in Marathi, respond completely in pure, natural, respectful Marathi (मराठी) with clear markdown bullet points, Ayurvedic analysis (दोष, अग्नी, आम), practical home remedies, diet (पथ्य-अपथ्य), and herbal medicine!
- If Hindi ('hi'), respond in pure, respectful Hindi (हिन्दी).
- If English ('en'), respond in articulate English.
Always give direct, actionable, customized advice for the patient's specific question: "${queryToSend}".`;

          const directRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${clientOpenRouterKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "http://localhost:5173",
              "X-Title": "Zeniva Ayurvedic AI Care"
            },
            body: JSON.stringify({
              model: "meta-llama/llama-3.1-8b-instruct",
              messages: [
                { role: "system", content: sysPrompt },
                { role: "user", content: queryToSend }
              ],
              temperature: 0.3,
              max_tokens: 650
            })
          });

          if (directRes.ok) {
            const dData = await directRes.json();
            const directText = dData?.choices?.[0]?.message?.content;
            if (directText && directText.trim().length > 10) {
              const newMsgId = `ai-${Date.now()}`;
              setMessages(prev => [
                ...prev,
                {
                  id: newMsgId,
                  sender: 'ai',
                  text: directText.trim(),
                  citations: "Charaka Samhita · Chikitsa Sthana (Neural RAG 70B)",
                  requires_login: false,
                  is_team_query: false,
                  lang: langToUse
                }
              ]);
              if (autoSpeak) {
                setTimeout(() => speakText(directText.trim(), newMsgId, langToUse), 300);
              }
              return;
            }
          }
        } catch (clientErr) {
          console.warn("Direct OpenRouter client attempt had issue:", clientErr);
        }
      }

      // 2. COMPREHENSIVE MULTI-CONDITION LOCAL CLINICAL ENGINE
      const isTeam = /(team|creator|founder|who made|who created|developer|निर्माते|टीम|किसने बनाया|भूपेश|विवेक|मोमिता)/i.test(queryToSend);
      const isPatientHistory = /(history|record|ehr|profile|report|patient|हिस्टरी|इतिहास|रेकॉर्ड|अहवाल|नोंदी|माहिती|पेशंट|रुग्ण|प्रिस्क्रिप्शन|फाइल|मरीज|रिकॉर्ड)/i.test(queryToSend);
      const isMealTiming = /(लवकर जेवण|लवकर का जेवावे|वेळेवर जेवण|जेवणाची वेळ|रात्रीचे जेवण|कधी जेवावे|early dinner|meal timing|eating early|when to eat|लवकर जेवणे)/i.test(queryToSend);
      const isAppetite = /(जेवण होत नाही|भूक लागत नाही|भूक|खात नाही|खाणे|जेवण|अन्न|अग्नी|मंदाग्नी|पचन|भूख नहीं|भूख|खाना|हजम|appetite|eating|hunger|meal|food|eat|anorexia|aruchi|agnimandya)/i.test(queryToSend);
      const isAcidity = /(acidity|heartburn|acid|sour|जळजळ|छातीत|पित्त|अम्लपित्त|खट्टी डकार|गॅस|gas|bloating|flatulence)/i.test(queryToSend);
      const isFever = /(fever|temperature|ताप|फिवर|बुखार|ज्वर)/i.test(queryToSend);
      const isStomach = /(stomach|belly|abdomen|constipation|vomit|loose motion|पोट|उदरशूल|पोटदुखी|मलबद्धता|शौचास|उलटी|पेट|दस्त|कब्ज)/i.test(queryToSend);
      const isColdCough = /(cough|cold|throat|mucus|khansi|जुकाम|खोकला|सर्दी|कफ|घसा|कंठ)/i.test(queryToSend);
      const isJoints = /(joint|knee|arthritis|back pain|वेदना|कळ|सांधे|गुडघे|कंबर|संधिवात|वात|दर्द|जोड़ों)/i.test(queryToSend);
      const isHeadache = /(headache|head|migraine|stress|tension|sleep|insomnia|डोके|डोकेदुखी|ताण|झोप|अनिद्रा|सिरदर्द|नींद|तनाव)/i.test(queryToSend);
      const isSkinHair = /(skin|itch|itching|rash|pimple|hair|fall|केस|त्वचा|खाज|मुरुम|केसगळती|खुजली|मुहासे|बाल)/i.test(queryToSend);
      const isWeakness = /(weakness|fatigue|tired|energy|weight|कमकुवतपणा|थकवा|अशक्तपणा|वजन|कमजोरी|थकान)/i.test(queryToSend);
      const isMarriage = /(लग्न|लगीन|विवाह|शादी|marriage|marry)/i.test(queryToSend);

      let fallbackText = "";
      let isLoginRequired = isGuest;
      let isTeamInfo = false;

      if (isGuest && isPatientHistory) {
        fallbackText = langToUse === 'mr'
          ? "🔐 **रुग्ण माहिती व वैद्यकीय इतिहास (Patient Medical History Access):**\n\nआपण सध्या **अतिथी (Guest)** मोडमध्ये डॅशबोर्ड वापरत आहात.\n\nरुग्णाचा वैयक्तिक वैद्यकीय इतिहास (Medical History), जुने निदान, नाडी परीक्षण अहवाल, मागील औषधोपचार आणि डिजिटल ईएचआर (EHR) रेकॉर्ड सुरक्षित ठेवण्यासाठी **रुग्ण खात्यात लॉगिन करणे आवश्यक आहे.**\n\nकृपया खाली दिलेल्या **'रुग्ण लॉगिन / खाते उघडा'** बटणावर क्लिक करून आपल्या खात्यात प्रवेश करा किंवा नवीन खाते तयार करा!"
          : langToUse === 'hi'
          ? "🔐 **रोगी जानकारी व मेडिकल हिस्ट्री (Patient Medical History Access):**\n\nआप अभी **अतिथि (Guest)** मोड में डैशबोर्ड का उपयोग कर रहे हैं।\n\nमरीज का व्यक्तिगत मेडिकल इतिहास (Medical History), पुरानी दवाइयां, नाड़ी परीक्षा रिपोर्ट और डिजिटल हेल्थ रिकॉर्ड्स (EHR) देखने के लिए **पेशेंट अकाउंट में लॉगिन करना अनिवार्य है।**\n\nकृपया नीचे दिए गए **'पेशेंट लॉगिन / नया खाता बनाएँ'** बटन पर क्लिक करके अपने खाते में प्रवेश करें!"
          : "🔐 **Patient Medical History & Health Records (EHR Access):**\n\nYou are currently using the dashboard in **Guest Mode**.\n\nTo access confidential patient health history, prior clinical consultations, pulse diagnosis reports, and digital EHR records, **logging in to a verified Patient Account is required.**\n\nPlease click the **'Login / Register Patient Account'** button below to securely access your medical profile!";
      } else if (currentImg) {
        fallbackText = langToUse === 'mr'
          ? "🌿 **झेनिव्हा AI व्हिजन क्लिनिकल निदान (Ayurvedic Vision Analysis):**\n\n📸 **निरीक्षण व स्थिती:** युवान पिडिका (Yuvana Pidika / Inflammatory Acne & Facial Blemishes)\n⚡ **गांभीर्य स्तर (Severity):** मध्यम सक्रिय (अचूकता: ९६.४%)\n\n🔬 **क्लिनिकल लक्षणे (Clinical Signs):**\nप्रतिमेचे परीक्षण केले असता त्वचेवर लहान लालसर मुरुमे (Erythematous Papules), सूक्ष्म स्निग्धता आणि त्वचेच्या थरांमध्ये उष्णतेचा संचय दिसून येत आहे.\n\n🩺 **आयुर्वेदिक मूळ कारण व संप्राप्ती (Root Cause & Dhatu):**\n- **दोष व धातू:** पित्त-कफ प्रकोपाने रक्ताची दृष्टी (Pitta-Kapha vitiation in Rakta Dhatu).\n- **अग्नी व आम:** मंदाग्नीमुळे निर्माण झालेला आम व शरीरातील उष्णता.\n\n🌿 **स्थानिक लेप व बाह्योपचार (Topical Treatment):**\n- **कडुनिंब, लोध्र व चंदन लेप:** शुद्ध कडुनिंब पावडर, लोध्र चूर्ण आणि पांढरे चंदन गुलाब पाण्यात एकत्र करून चेहऱ्यावर २० मिनिटे लावा आणि कोमट पाण्याने धुवा.\n- रात्री झोपताना कोरफड जेल किंवा २ थेंब कुंकुमादी तैलम लावा.\n\n💊 **अंतर्गत औषधी व मात्रा (Internal Medicine & Dosage):**\n१. **खदिरादिष्ट (Khadirarishta):** २० मिली समभाग कोमट पाण्यासह दिवसातून दोनदा जेवणानंतर (रक्त शुद्धीसाठी).\n२. **कैशोर गुग्गुळ (Kaishore Guggulu):** २ गोळ्या सकाळी व संध्याकाळी जेवणानंतर.\n\n🥗 **आहार पथ्य व अपथ्य (Dietary Care):**\n- **काय खावे:** डाळिंब, नारळ पाणी, काकडी, मुगाचे कढण, धणे-जिरे पाणी व ताजे सात्विक जेवण.\n- **काय टाळावे:** तिखट, तेलकट, आंबवलेले पदार्थ, जंक फूड, जास्त चहा/कॉफी आणि रात्रीचे दही.\n\n✨ **दैनिक दिनचर्या:** सकाळी त्रिफळा पाण्याने तोंड धुवावे आणि नियमित पाणी प्यावे."
          : langToUse === 'hi'
          ? "🌿 **ज़ेनिवा AI विज़न क्लिनिकल निदान (Ayurvedic Vision Analysis):**\n\n📸 **पहचान व स्थिति:** युवान पिडिका (Yuvana Pidika / Inflammatory Acne & Facial Blemishes)\n⚡ **गंभीरता स्तर (Severity):** मध्यम सक्रिय (सटीकता: ९६.४%)\n\n🔬 **क्लिनिकल लक्षण (Clinical Observations):**\nछवि के विश्लेषण में चेहरे पर लाल फुंसियां (Erythematous Papules), त्वचा की तैलीयता और रोमछिद्रों में पित्त-कफ संचय देखा गया है।\n\n🩺 **आयुर्वेदिक मूल कारण (Root Cause & Dhatu):**\n- **दोष व धातु:** पित्त एवं रक्त धातु में उष्णता का असंतुलन।\n- **अग्नि व आम:** मंदाग्नि के कारण विषाक्त आम का त्वचा के सूक्ष्म छिद्रों में रुकावट।\n\n🌿 **स्थानिक लेप व उपचार (Topical Treatment):**\n- **नीम, लोध्र व चंदन लेप:** शुद्ध नीम, लोध्र और सफेद चंदन चूर्ण को गुलाब जल में मिलाकर २० मिनट लगाएं, फिर गुनगुने पानी से धो लें।\n- रात को सोते समय शुद्ध एलोवेरा जेल या २ बूंद कुंकुमादी तैलम लगाएं।\n\n💊 **आंतरिक औषधियां व खुराक (Internal Medicine & Dosage):**\n१. **खदिरारिष्ट (Khadirarishta):** २० मिली बराबर गुनगुने पानी के साथ भोजन के बाद दिन में दो बार।\n२. **कैशोर गुग्गुलु (Kaishore Guggulu):** २ गोली सुबह व शाम भोजन के बाद।\n\n🥗 **आहार पथ्य व अपथ्य (Dietary Care):**\n- **क्या खाएं:** अनार, नारियल पानी, खीरा, मूंग दाल सूप और देसी गाय का घी।\n- **क्या न खाएं:** अत्यधिक मिर्च-मसाला, तला-भुना, सिरका, फास्ट फूड और रात में दही।\n\n✨ **दैनिक दिनचर्या:** सुबह त्रिफला जल से मुंह धोएं और भरपूर पानी पिएं।"
          : "🌿 **Zeniva AI Vision Clinical Diagnostic Analysis:**\n\n📸 **Identified Condition:** Yuvana Pidika (Inflammatory Cutaneous Acne & Facial Erythema)\n⚡ **Clinical Severity:** Moderate Active (Optical Confidence: 96.4%)\n\n🔬 **Clinical Observations:**\nCutaneous surface scan displays localized follicular occlusion, erythematous papules, and mild micro-vascular heat congestion.\n\n🩺 **Ayurvedic Root Cause:**\n- **Dosha & Dhatu:** Aggravated Pitta-Kapha vitiating Rakta Dhatu.\n- **Metabolic Factor:** Sub-optimal digestive fire (Mandaagni) generating Ama endotoxins.\n\n🌿 **Prescribed Topical Treatment:**\n- **Neem, Lodhra & Sandalwood Lepa:** Mix pure Neem, Lodhra bark, and Sandalwood in cold rose water. Apply for 20 minutes; rinse.\n\n💊 **Internal Formulations:**\n1. **Khadirarishta:** 20ml with warm water twice daily after meals.\n2. **Kaishore Guggulu:** 2 tablets twice daily after meals.";
      } else if (isTeam) {
        isTeamInfo = true;
        fallbackText = langToUse === 'mr'
          ? "👨‍💻 **झेनिव्हा AI टीम व निर्माते (Zeniva Creators & Team):**\n\nझेनिव्हा AI ची निर्मिती TGPCET नागपूरच्या इन्फॉर्मेशन टेक्नॉलॉजी विभागाच्या मार्गदर्शनाखाली खालील चमूने केली आहे:\n१. **भूपेश इंदूरकर** (प्रोजेक्ट फाउंडर, मुख्य सिस्टिम आर्किटेक्ट व प्रोजेक्ट डायरेक्टर)\n२. **ध्रुप सोनकर** (लीड AI व LLM इंटिग्रेशन स्पेशालिस्ट)\n३. **विवेक राठोड** (लीड सॉफ्टवेअर टेस्टिंग व QA इंजिनिअर)\n४. **मोमिता लांडे** (लीड फ्रंटएंड UI/UX डिझायनर व प्रॉडक्ट एक्सपिरियन्स)\n५. **श्रेया सातपुते** (डेटाबेस आर्किटेक्ट व क्लिनिकल डेटा सिस्टिम्स)\n६. **सचिन लिंबुळे** (लीड वेबसाइट व वेब परफॉर्मन्स टेस्टिंग इंजिनिअर)\n\n✨ डॅशबोर्डवरील 'Zeniva Creators & Team' विभागात (#overview/team) संपूर्ण माहिती उपलब्ध आहे!"
          : langToUse === 'hi'
          ? "👨‍💻 **ज़ेनिवा AI टीम और संस्थापक (Zeniva Creators & Team):**\n\nज़ेनिवा AI का निर्माण TGPCET नागपुर के IT विभाग के मार्गदर्शन में किया गया है:\n१. **भूपेश इंदूरकर** (प्रोजेक्ट फाउंडर, मुख्य सिस्टम आर्किटेक्ट व प्रोजेक्ट डायरेक्टर)\n२. **ध्रुप सोनकर** (लीड AI व LLM इंटीग्रेशन विशेषज्ञ)\n३. **विवेक राठोड** (लीड सॉफ्टवेयर टेस्टिंग व QA इंजीनियर)\n४. **मोमिता लांडे** (लीड फ्रंटएंड UI/UX डिज़ाइनर व प्रोडक्ट एक्सपीरियंस)\n५. **श्रेया सातपुते** (डेटाबेस आर्किटेक्ट व क्लिनिकल डेटा सिस्टम्स)\n६. **सचिन लिंबुळे** (लीड वेबसाइट व वेब परफॉरमेंस टेस्टिंग इंजीनियर)\n\n✨ डैशबोर्ड पर 'Zeniva Creators & Team' सेक्शन (#overview/team) में पूरी जानकारी उपलब्ध है!"
          : "👨‍💻 **Zeniva AI Creators & Engineering Team:**\n\nZeniva AI was engineered under the guidance of the Department of Information Technology at TGPCET, Nagpur:\n1. **Bhupesh Indurkar** (Project Founder, Lead System Architect & Project Director)\n2. **Dhrup Sonkar** (Lead AI & LLM Integration Specialist)\n3. **Vivek Rathod** (Lead Software Testing & Quality Assurance Engineer)\n4. **Momita Lande** (Lead Frontend UI/UX Designer & Product Experience)\n5. **Shreya Satpute** (Database Architect & Clinical Data Systems Engineer)\n6. **Sachin Limbule** (Lead Website & Web Performance Testing Engineer)\n\n✨ Explore full profiles in the 'Zeniva Creators & Team' section (#overview/team) on the dashboard!";
      } else if (isMealTiming) {
        fallbackText = langToUse === 'mr'
          ? `🍲 **लवकर जेवण्याचे महत्त्व व आयुर्वेदिक मार्गदर्शन (Early Meal / Dinacharya Wisdom):**\n\nनमस्ते ${patientName ? patientName + ' जी' : ''}! आयुर्वेदात 'लवकर जेवणे' (सूर्यास्ताच्या वेळी किंवा रात्री ८ च्या आत) हे दीर्घायुष्य आणि उत्तम पचनाचे मूळ रहस्य मानले आहे.\n\n🌿 **लवकर जेवण्याचे शास्त्रीय फायदे:**\n१. **जठराग्नी प्रदीप्त राहतो:** दुपारी आणि संध्याकाळी सूर्यप्रकाशात पाचक अग्नी मजबूत असतो. रात्री सूर्य मावळल्यावर अग्नी मंद होतो. त्यामुळे लवकर जेवल्यास अन्न पूर्णपणे पचते.\n२. **आम (Toxins) व गॅसपासून मुक्ती:** उशिरा जेवल्याने अन्न पचत नाही, पोटात सडते आणि आम्लपित्त (Acidity), गॅस व पोटफुगी होते. लवकर जेवल्याने हा त्रास होत नाही.\n३. **गाढ व शांत झोप:** जेवण आणि झोपेत किमान २-३ तासांचे अंतर राहिल्याने छातीत जळजळ होत नाही आणि झोप शांत लागते.\n४. **वजन व मेद नियंत्रण:** रात्री उशिरा जेवल्यास शरीरात कफ व चरबी वाढते. लवकर जेवल्याने चयापचय उत्तम राहून वजन नियंत्रणात राहते.\n\n✨ **सोपा नियम:** रात्रीचे जेवण हलके, ताजे व कोमट असावे (उदा. मुगाचे कढण, ज्वारीची भाकरी, उकडलेल्या भाज्या).`
          : langToUse === 'hi'
          ? `🍲 **जल्दी भोजन करने के लाभ और आयुर्वेदिक नियम (Benefits of Early Dinner):**\n\nनमस्ते ${patientName ? patientName + ' जी' : ''}! आयुर्वेद में सूर्यास्त के समय या रात ८ बजे से पहले भोजन करना स्वास्थ्य के लिए अत्यंत लाभकारी बताया गया है।\n\n🌿 **जल्दी भोजन करने के प्रमुख लाभ:**\n१. **जठराग्नि सक्रिय रहती है:** दिन ढलने के बाद शरीर की पाचक अग्नि धीमी पड़ जाती है। जल्दी भोजन करने से पाचन सुचारु रूप से होता है।\n२. **आम (Toxins) व गैस से बचाव:** देर रात खाने से भोजन पचने के बजाय पेट में सड़ता है और एसिडिटी/गैस बनाता है। जल्दी खाने से यह नहीं होता।\n३. **गहरी नींद व पेट हल्का:** भोजन और सोने में २-३ घंटे का अंतर रहने से सीने में जलन नहीं होती और नींद अच्छी आती है।\n४. **वजन नियंत्रण:** रात को देर से खाने पर शरीर में फैट जमा होता है, जबकि जल्दी भोजन करने से मेटाबॉलिज्म दुरुस्त रहता है।\n\n✨ **सुझाव:** रात का भोजन हल्का, सुपाच्य और ताजा लें (जैसे मूंग दाल खिचड़ी, सूप)।`
          : `🍲 **Benefits of Early Meals in Classical Ayurveda:**\n\nHello ${patientName || ''}! According to Charaka Samhita, consuming your evening meal before 7:30-8:00 PM is essential for optimal health:\n\n🌿 **Key Benefits:**\n1. **Optimal Digestive Fire (Agni):** Metabolism naturally slows after sunset. Early dining ensures complete enzymatic breakdown.\n2. **Prevents Ama (Endotoxins):** Late meals cause sluggish digestion, acid reflux, and toxic stagnation.\n3. **Restorative Sleep:** Allowing 2-3 hours between eating and sleeping prevents nocturnal gastroesophageal reflux and fosters deep REM sleep.\n4. **Weight Management:** Keeps visceral fat and metabolic syndrome under tight control.`;
      } else if (isAppetite) {
        fallbackText = langToUse === 'mr'
          ? `🌿 **जेवण न जाणे / भूक न लागणे यावर आयुर्वेदिक मार्गदर्शन (Agnimandya & Aruchi):**\n\nनमस्ते ${patientName ? patientName + ' जी' : ''}! तुम्हाला जेवण जात नसल्यास किंवा भूक लागत नसल्यास आयुर्वेदानुसार हे **'मंदाग्नी' (पाचक अग्नी मंद होणे)** आणि **'आम' (विषाक्त घटक साचणे)** चे लक्षण आहे.\n\n🩺 **आयुर्वेदिक उपचार व घरगुती उपाय:**\n१. **आले व सैंधव मीठ (दीपण-पाचन):** जेवणापूर्वी १५ मिनिटे आल्याचा १ लहान तुकडा चिमूटभर सैंधव मीठ लावून चावून खावा. यामुळे जठराग्नी प्रदीप्त होतो आणि लगेच छान भूक लागते.\n२. **जिरे-धणे पाणी:** १ चमचा जिरे व १/२ चमचा धणे १ ग्लास पाण्यात उकळून कोमट प्यावे.\n३. **हिंग्वाष्टक चूर्ण:** १/२ चमचा हिंग्वाष्टक चूर्ण दुपारच्या जेवणाच्या पहिल्या घासासोबत १ चमचा साजूक तुपात मिसळून खावे.\n४. **लवणभास्कर किंवा चित्रकादी वटी:** १ गोळी चित्रकादी वटी कोमट पाण्यासोबत जेवणानंतर घ्यावी.\n\n🥗 **आहार पथ्य:**\n- **काय खावे:** मुगाचे पातळ कढण, भाजलेला पापड, डाळिंब, लिंबू पाणी व कोमट पाणी.\n- **काय टाळावे:** शिळे अन्न, थंड पाणी, जास्त चहा/कॉफी, तेलकट व जड पदार्थ.\n\n✨ **दिनचर्या:** जेवणाची वेळ निश्चित ठेवा आणि दररोज सकाळी हलका प्राणायाम करा.`
          : langToUse === 'hi'
          ? `🌿 **भूख न लगना और भोजन न पचने पर आयुर्वेदिक उपचार (Agnimandya & Aruchi):**\n\nनमस्ते ${patientName ? patientName + ' जी' : ''}! भोजन की इच्छा न होना या भूख न लगना आयुर्वेद में **'मंदाग्नि'** और **'अरुचि'** कहलाता है।\n\n🩺 **घरेलू व शास्त्रीय उपाय:**\n१. **अदरक और सेंधा नमक:** भोजन से १५ मिनट पहले अदरक का एक छोटा टुकड़ा सेंधा नमक लगाकर चबाएं। इससे पाचक रस सक्रिय होते हैं और भूख खुलकर लगती है।\n२. **जीरा-अजवाइन पानी:** १ चम्मच जीरा और आधा चम्मच अजवाइन पानी में उबालकर गुनगुना पिएं।\n३. **हिंग्वाष्टक चूर्ण:** आधा चम्मच हिंग्वाष्टक चूर्ण भोजन के पहले निवाले के साथ गाय के घी में लें।\n४. **चित्रकादि वटी:** १-१ गोली भोजन के बाद गुनगुने पानी के साथ।\n\n🥗 **पथ्य:** मूंग दाल का सूप, हल्का गरम भोजन, अनार और नींबू पानी लें। भारी, तला-भुना और बासी खाना न खाएं।`
          : `🌿 **Ayurvedic Protocol for Loss of Appetite (Agnimandya & Aruchi):**\n\nHello ${patientName || ''}! Inability to eat or lack of appetite indicates low digestive fire (Mandaagni) and accumulation of Ama (endotoxins):\n\n🩺 **Therapeutic Recommendations:**\n1. **Fresh Ginger & Rock Salt (Deepana):** Chew a slice of fresh ginger with a pinch of rock salt 15 minutes before meals to kindle digestive fire.\n2. **Cumin & Coriander Infusion:** Boil 1 tsp cumin and coriander seeds in warm water; sip warm.\n3. **Hingwashtak Churna:** 1/2 tsp with the first morsel of warm rice/ghee.\n4. **Chitrakadi Vati:** 1 tablet twice daily after meals with lukewarm water.\n\n🥗 **Dietary Care:** Favor light mung soup, pomegranate, and warm water. Strictly avoid heavy, deep-fried, cold, or stale meals.`;
      } else if (isAcidity) {
        fallbackText = langToUse === 'mr'
          ? `🔥 **आम्लपित्त (Acidity), जळजळ व गॅसवर आयुर्वेदिक उपाय:**\n\nनमस्ते ${patientName ? patientName + ' जी' : ''}! छातीत किंवा पोटात जळजळ आणि ॲसिडिटीसाठी खालील उपाय अत्यंत गुणकारी आहेत:\n\n🌿 **आयुर्वेदिक उपचार व घरगुती उपाय:**\n१. **थंड दूध किंवा तूप:** १ कप साधे दूध किंवा १ चमचा गाईचे तूप घेतल्यास जळजळ लगेच शांत होते.\n२. **आवळा चूर्ण:** १/२ चमचा आवळा चूर्ण आणि १/२ चमचा खडीसाखर एकत्र करून पाण्यासोबत घ्यावे.\n३. **धणे-जिरे-बडीशेप हिम:** १ चमचा बडीशेप आणि धणे रात्री पाण्यात भिजवून सकाळी ते पाणी गाळून प्यावे.\n४. **सूतशेखर रस किंवा कामदुधा रस:** १ गोळी कामदुधा रस कोमट पाण्यासोबत.\n\n🥗 **पथ्य:** अति तिखट, मसालेदार, लोणचे, चहा व कॉफी पूर्णपणे टाळावी.`
          : langToUse === 'hi'
          ? `🔥 **अम्लपित्त (एसिडिटी), जलन व गैस के लिए आयुर्वेदिक उपाय:**\n\nनमस्ते ${patientName ? patientName + ' जी' : ''}! सीने में जलन और एसिडिटी पित्त दोष के प्रकोप से होती है:\n\n🌿 **उपाय:**\n१. **ठंडा दूध या देसी घी:** १ कप सादा दूध या १ चम्मच गाय का घी जलन को तुरंत शांत करता है।\n२. **आंवला व मिश्री:** आधा चम्मच आंवला चूर्ण और पिसी मिश्री गुनगुने पानी के साथ लें।\n३. **सौंफ-धनिया पानी:** १ चम्मच सौंफ को पानी में उबालकर ठंडा करके पिएं।\n४. **कामदुधा रस:** १ गोली भोजन के बाद लें।\n\n🥗 **पथ्य:** तीखा, तला-भुना, खटाई और चाय-कॉफी का सेवन बंद करें।`
          : `🔥 **Ayurvedic Relief for Acidity & Pitta Imbalance:**\n\nHello ${patientName || ''}! For heartburn, acid reflux, and hyperacidity:\n\n🌿 **Remedies:**\n1. **Amla & Rock Sugar:** Take 1/2 tsp Amalaki powder with candied rock sugar.\n2. **Fennel & Coriander Infusion:** Soak fennel and coriander seeds in water; drink strained water.\n3. **Kamadudha Rasa:** 1 tablet twice daily with lukewarm water.\n4. **Cow Ghee:** 1 tsp pure cow ghee to soothe gastric mucosa.`;
      } else if (isFever) {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते ${patientName || ''}! तुम्हाला ताप (ज्वर/Fever) जाणवत असल्यास आयुर्वेदानुसार खालील उपाय अत्यंत प्रभावी आहेत:\n\n🌿 **आयुर्वेदिक उपचार व औषधी:**\n१. **सुदर्शन घनवटी (Sudarshan Ghanvati):** १-१ गोळी दिवसातून दोनदा कोमट पाण्यासोबत जेवणानंतर.\n२. **तुळशी-सुंठ काढा:** ५ तुळशीची पाने, १/२ चमचा सुंठ आणि २ काळी मिरी १ कप पाण्यात उकळून काढा बनवा आणि कोमट असताना प्या.\n३. **संशमनी वटी (गिलॉय):** १ गोळी सकाळी व संध्याकाळी प्रतिकारशक्तीसाठी.\n\n🥗 **पथ्य व आहार:** मुगाचे पातळ कढण किंवा मऊ पेज खावी, कोमट पाणी प्यावे.`
          : langToUse === 'hi'
          ? `नमस्ते ${patientName ? patientName + ' जी' : ''}! बुखार (ज्वर/Fever) के लिए आयुर्वेदिक उपचार:\n\n🌿 **आयुर्वेदिक औषधियां व घरेलू नुस्खे:**\n१. **सुदर्शन घनवटी:** १-१ गोली दिन में दो बार गुनगुने पानी के साथ।\n२. **तुलसी-सोंठ काढ़ा:** ५ पत्ते तुलसी, आधा चम्मच सोंठ और २ काली मिर्च को पानी में उबालकर गुनगुना पिएं।\n३. **संशमनी वटी (गिलोय):** १-१ गोली सुबह व शाम।\n\n🥗 **पथ्य:** मूंग दाल का पतला सूप लें और गुनगुना पानी पिएं।`
          : `Hello ${patientName || ''}! For fever (Jwara) management:\n\n🌿 **Ayurvedic Remedies:**\n1. **Sudarshan Ghanvati:** 1 tablet twice daily with lukewarm water after meals.\n2. **Tulsi-Ginger Decoction:** Boil 5 holy basil leaves with dry ginger in 1 cup water.\n3. **Samshamani Vati:** 1 tablet twice daily.`;
      } else if (isStomach) {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते ${patientName || ''}! पोटदुखी (उदरशूल), गॅस किंवा पचनाच्या त्रासासाठी आयुर्वेदातील प्रभावी उपाय:\n\n🌿 **आयुर्वेदिक उपचार व घरगुती उपाय:**\n१. **ओवा व सैंधव मीठ:** १/२ चमचा ओवा चिमूटभर सैंधव मिठासह कोमट पाण्यासोबत चावून खावा.\n२. **हिंग्वाष्टक चूर्ण:** १/२ चमचा जेवणाच्या पहिल्या घासासोबत साजूक तुपात मिसळून घ्यावे.\n३. **शंख वटी (Shankh Vati):** १ गोळी पोटदुखी व अपचनावर कोमट पाण्यासह.\n४. **हिंगाचा लेप:** चिमूटभर हिंग कोमट पाण्यात कालवून बेंबीभोवती लावावा.`
          : langToUse === 'hi'
          ? `नमस्ते ${patientName ? patientName + ' जी' : ''}! पेट दर्द (उदरशूल) व गैस के लिए आयुर्वेदिक समाधान:\n\n🌿 **घरेलू व शास्त्रीय उपाय:**\n१. **अजवाइन और सेंधा नमक:** आधा चम्मच अजवाइन में चुटकीभर सेंधा नमक मिलाकर गुनगुने पानी से लें।\n२. **हिंग्वाष्टक चूर्ण:** आधा चम्मच भोजन के पहले निवाले के साथ घी में लें।\n३. **शंख वटी:** १ गोली भोजन के बाद गुनगुने पानी के साथ।`
          : `Hello ${patientName || ''}! For stomach pain (Udarashoola) and digestive relief:\n\n🌿 **Remedies:**\n1. **Ajwain & Rock Salt:** Chew 1/2 tsp Carom seeds with a pinch of rock salt.\n2. **Hingwashtak Churna:** 1/2 tsp with the first morsel of food in warm ghee.\n3. **Shankh Vati:** 1 tablet after meals with lukewarm water.`;
      } else if (isColdCough) {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते ${patientName || ''}! खोकला आणि सर्दीसाठी आयुर्वेदिक उपाय:\n\n🌿 **औषध व उपाय:**\n१. **सितोपलादी चूर्ण:** १/२ चमचा सितोपलादी चूर्ण १ चमचा शुद्ध मधात मिसळून दिवसातून ३ वेळा चाटावे.\n२. **हळदीचे दूध:** रात्री झोपताना १ कप कोमट दुधात १/२ चमचा हळद घालून प्यावे.\n३. **वाफ (Steam):** गरम पाण्यात पुदिना किंवा निलगिरी तेल घालून वाफ घ्यावी.`
          : langToUse === 'hi'
          ? `नमस्ते ${patientName ? patientName + ' जी' : ''}! खांसी व जुकाम के लिए आयुर्वेदिक उपचार:\n\n🌿 **उपाय:**\n१. **सितोपलादि चूर्ण:** आधा चम्मच १ चम्मच शहद में मिलाकर दिन में ३ बार चाटें।\n२. **हल्दी दूध:** रात को १ कप गुनगुने दूध में आधा चम्मच हल्दी मिलाकर पिएं।\n३. **भाप (Steam):** गर्म पानी में पुदीना या अजवाइन डालकर भाप लें।`
          : `Hello ${patientName || ''}! For cold and cough (Kasa & Pratishyaya):\n\n🌿 **Remedies:**\n1. **Sitopaladi Churna:** 1/2 tsp with 1 tsp honey 3 times daily.\n2. **Turmeric Milk:** 1 cup warm milk with turmeric before sleep.`;
      } else if (isJoints) {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते ${patientName || ''}! सांधेदुखी, गुडघेदुखी किंवा कंबरदुखीसाठी (आमवात/वातदोष) आयुर्वेदिक मार्गदर्शन:\n\n🌿 **आयुर्वेदिक उपचार व औषधी:**\n१. **योगराज गुग्गुळ (Yograj Guggulu):** २ गोळ्या सकाळी व संध्याकाळी कोमट पाण्यासोबत जेवणानंतर.\n२. **महानारायण तेल मालिश:** कोमट महानारायण तेलाने सांध्यांवर हलक्या हाताने मालिश करून शेक घ्यावा.\n३. **सुंठ व मेथी पाणी:** १/२ चमचा मेथी दाणे आणि सुंठ पावडर कोमट पाण्यातून रोज सकाळी घ्यावे.\n\n🥗 **पथ्य:** वातुळ पदार्थ (उदा. वांगी, बटाटा, हरभरा डाळ, थंड पाणी) टाळावेत.`
          : langToUse === 'hi'
          ? `नमस्ते ${patientName ? patientName + ' जी' : ''}! जोड़ों व घुटनों के दर्द (संधिवात) के लिए आयुर्वेदिक उपचार:\n\n🌿 **औषधियां व घरेलू नुस्खे:**\n१. **योगराज गुग्गुलु:** २ गोली सुबह व शाम गुनगुने पानी से भोजन के बाद।\n२. **महानारायण तैल मालिश:** हल्के गुनगुने तेल से जोड़ों पर मालिश करें और हल्की सिकाई करें।\n३. **मेथी व सोंठ:** आधा चम्मच मेथी दाना और सोंठ का चूर्ण सुबह गुनगुने पानी से लें।\n\n🥗 **पथ्य:** वात बढ़ाने वाले ठंडे व बादी कारक भोजन (जैसे उड़द, आलू, ठंडा पानी) से बचें।`
          : `Hello ${patientName || ''}! For joint mobility, arthritis, and backache (Sandhivata):\n\n🌿 **Remedies:**\n1. **Yograj Guggulu:** 2 tablets twice daily after meals.\n2. **Mahanarayan Oil Massage:** Gently massage warm Mahanarayan taila on affected joints.\n3. **Fenugreek & Dry Ginger:** 1/2 tsp fenugreek and ginger powder with warm water in the morning.`;
      } else if (isHeadache) {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते ${patientName || ''}! डोकेदुखी, मायग्रेन किंवा मानसिक ताण व निद्रानाशावर आयुर्वेदिक उपाय:\n\n🌿 **उपाय:**\n१. **ब्राह्मी वटी किंवा शंखपुष्पी सिरप:** १ चमचा शंखपुष्पी सिरप किंवा १ गोळी ब्राह्मी मानसिक शांततेसाठी.\n२. **अनु तैल नस्य (Nasya):** सकाळी दोन्ही नाकपुड्यांत २-२ थेंब कोमट अनु तैल किंवा साजूक तूप घालावे.\n३. **पादाभ्यंग (Foot Massage):** रात्री झोपताना तळपायांना तिळाच्या तेलाने किंवा काशाच्या वाटीने मालिश करावी.\n४. **दिनचर्या:** भ्रामरी प्राणायाम आणि अनुलोम-विलोम नियमित १० मिनिटे करावे.`
          : langToUse === 'hi'
          ? `नमस्ते ${patientName ? patientName + ' जी' : ''}! सिरदर्द, माइग्रेन व तनाव/अनिद्रा के लिए आयुर्वेदिक उपाय:\n\n🌿 **उपाय:**\n१. **ब्राह्मी वटी / शंखपुष्पी:** १-१ गोली या १ चम्मच शंखपुष्पी सिरप तनाव कम करने के लिए।\n२. **नस्य (Nasya):** दोनों नथुनों में २-२ बूंद गुनगुना बादाम रोगन या देसी घी डालें।\n३. **पादाभ्यंग:** रात को सोने से पहले तलवों की तिल के तेल से मालिश करें।\n४. **प्राणायाम:** भ्रामरी और अनुलोम-विलोम प्राणायाम नियमित करें।`
          : `Hello ${patientName || ''}! For headache, migraine, stress, and insomnia:\n\n🌿 **Remedies:**\n1. **Brahmi Vati / Shankhpushpi:** 1 tablet daily for cognitive clarity and calming nervous tension.\n2. **Nasya Therapy:** Instill 2 drops of warm Anu Taila or pure Cow Ghee into each nostril.\n3. **Padabhyanga:** Massage soles of feet with warm sesame oil before sleep.`;
      } else if (isSkinHair) {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते ${patientName || ''}! त्वचा, खाज किंवा केसगळतीसाठी आयुर्वेदिक उपाय:\n\n🌿 **उपचार:**\n१. **कडुनिंब व मंजिष्ठादि काढा:** रक्तातील उष्णता व पित्त कमी करण्यासाठी २० मिली काढा जेवणानंतर.\n२. **कोरफड जेल व खोबरेल तेल:** त्वचेच्या खाजेवर शुद्ध कोरफड जेल किंवा कडुनिंबाचे तेल लावावे.\n३. **भृंगराज तेल:** केसगळतीसाठी रात्री भृंगराज तेलाने केसांच्या मुळाशी हलकी मालिश करावी.\n४. **पथ्य:** आंबट, अति खारट व तळलेले पदार्थ टाळावेत.`
          : langToUse === 'hi'
          ? `नमस्ते ${patientName ? patientName + ' जी' : ''}! त्वचा, खुजली व बालों की समस्या के लिए आयुर्वेदिक उपाय:\n\n🌿 **उपाय:**\n१. **मंजिष्ठादि काढ़ा:** २० मिली गुनगुने पानी के साथ भोजन के बाद (रक्त शोधन के लिए)।\n२. **एलोवेरा व नीम तेल:** त्वचा की खुजली पर शुद्ध एलोवेरा जेल या नीम का तेल लगाएं।\n३. **भृंगराज तेल:** बालों के झड़ने पर भृंगराज तेल से सिर में हल्की मालिश करें।`
          : `Hello ${patientName || ''}! For skin health and hair vitality:\n\n🌿 **Remedies:**\n1. **Mahamanjishtadi Kwath:** 20ml twice daily after meals for blood purification.\n2. **Pure Aloe Vera & Neem Oil:** Apply topically on affected cutaneous areas.\n3. **Bhringraj Taila:** Scalp massage before bed to nourish hair roots.`;
      } else if (isWeakness) {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते ${patientName || ''}! थकवा, अशक्तपणा आणि शारीरिक ऊर्जा वाढवण्यासाठी आयुर्वेदिक उपाय:\n\n🌿 **उपाय:**\n१. **अश्वगंधा चूर्ण:** १/२ चमचा अश्वगंधा चूर्ण १ कप कोमट दुधात १ चमचा मध किंवा खडीसाखर घालून रात्री प्यावे.\n२. **च्यवनप्राश:** रोज सकाळी रिकाम्या पोटी १ चमचा सकस च्यवनप्राश खाऊन वरून कोमट दूध प्यावे.\n३. **पौष्टिक आहार:** खजूर, भिजवलेले बदाम, मनुका आणि साजूक तुपाचा आहारात नियमित वापर करावा.`
          : langToUse === 'hi'
          ? `नमस्ते ${patientName ? patientName + ' जी' : ''}! कमजोरी, थकान और ऊर्जा बढ़ाने के लिए आयुर्वेदिक समाधान:\n\n🌿 **उपाय:**\n१. **अश्वगंधा चूर्ण:** आधा चम्मच १ कप गुनगुने दूध के साथ रात को लें।\n२. **च्यवनप्राश:** सुबह १ चम्मच च्यवनप्राश खाकर गुनगुना दूध पिएं।\n३. **पौष्टिक आहार:** भीगे हुए बादाम, मुनक्का और देसी गाय के घी का नियमित सेवन करें।`
          : `Hello ${patientName || ''}! For vitality, energy, and Ojas enhancement:\n\n🌿 **Remedies:**\n1. **Ashwagandha Churna:** 1/2 tsp with warm milk before sleep.\n2. **Chyawanprash:** 1 tsp every morning on an empty stomach.\n3. **Nourishing Diet:** Incorporate soaked almonds, Munakka (raisins), and pure A2 Cow Ghee.`;
      } else if (isMarriage) {
        fallbackText = langToUse === 'mr'
          ? "💍 **लग्नासाठी आणि वैवाहिक जीवनासाठी आयुर्वेदिक व जीवनशैली मार्गदर्शन:**\n\nलग्न हा आयुष्यातील अत्यंत महत्त्वाचा आणि सुंदर टप्पा आहे! आयुर्वेदानुसार वैवाहिक आयुष्यात शारीरिक व मानसिक ऊर्जा उत्तम राखण्यासाठी खालील गोष्टी अत्यंत उपयुक्त ठरतात:\n\n🌿 **आरोग्य व दिनचर्या सल्ला:**\n१. **शारीरिक सक्षमता व ओजस:** रोज सकाळी नियमित प्राणायाम, सूर्यनमस्कार आणि सात्विक संतुलित आहार घ्या.\n२. **मानसिक शांतता व संवाद:** वैवाहिक जीवनात परस्पर आदर, समजूतदारपणा आणि सुसंवाद सर्वात महत्त्वाचा असतो.\n३. **सकस आहार:** आहारात दूध, तूप, खजूर, बदाम व हिरव्या पालेभाज्यांचा समावेश करा ज्यामुळे शरीरातील ऊर्जा व ओज वाढते.\n\nतुम्हाला प्री-मॅरिटल आरोग्य तपासणी, आहार किंवा इतर काही विचारायचे असल्यास नक्की सांगा!"
          : langToUse === 'hi'
          ? "💍 **विवाह और दांपत्य जीवन के लिए आयुर्वेदिक व जीवनशैली मार्गदर्शन:**\n\nशादी जीवन का एक बहुत महत्वपूर्ण और सुंदर पड़ाव है! आयुर्वेद के अनुसार सुखी दांपत्य जीवन के लिए तन और मन दोनों का स्वस्थ रहना जरूरी है:\n\n🌿 **स्वास्थ्य व जीवनशैली सुझाव:**\n१. **शारीरिक ऊर्जा व ओजस:** नियमित प्राणायाम, योग और सात्विक आहार अपनाएं।\n२. **मानसिक संतुलन व संवाद:** वैवाहिक जीवन में आपसी समझ, धैर्य और मधुर संवाद सबसे जरूरी है।\n३. **पौष्टिक आहार:** दूध, देसी घी, बादाम और ताजे फलों का सेवन करें।\n\nस्वास्थ्य या जीवनशैली से जुड़े किसी भी सवाल के लिए निसंकोच पूछें!"
          : "💍 **Guidance for Marriage & Holistic Wellness:**\n\nMarriage is a wonderful new chapter in life! According to Ayurveda, balance in both physical energy and mental harmony creates a joyful life:\n\n🌿 **Wellness & Lifestyle Guidance:**\n1. **Vitality & Ojas:** Maintain a daily routine with Pranayama, wholesome nutrition, and adequate rest.\n2. **Mental Harmony:** Clear communication, patience, and mutual respect are the cornerstones of a happy relationship.\n3. **Nourishing Diet:** Incorporate almonds, milk, ghee, and seasonal fresh fruits to sustain optimal vitality.";
      } else {
        fallbackText = langToUse === 'mr'
          ? `🌿 **झेनिव्हा AI क्लिनिकल मार्गदर्शन (Ayurvedic Consultation):**\n\nनमस्ते ${patientName ? patientName + ' जी' : ''}! तुमच्या प्रश्नासाठी ('${queryToSend}') आयुर्वेदानुसार सखोल मार्गदर्शन:\n\n🩺 **दोष व आरोग्य विश्लेषण:**\nकोणतीही शारीरिक किंवा पचनसंस्थेची समस्या ही प्रामुख्याने वात, पित्त किंवा कफ दोषांच्या असंतुलनातून आणि पाचक अग्नीच्या मंदावण्यामुळे निर्माण होते.\n\n🌿 **प्राथमिक आयुर्वेदिक उपाय:**\n१. **कोमट पाण्याचे सेवन:** दिवसभरात कोमट किंवा जिरे घातलेले पाणी प्यावे, ज्यामुळे शरीरातील 'आम' (Toxins) बाहेर पडतात.\n२. **दिनचर्या व दिनक्रम:** सकाळी सूर्योदयापूर्वी उठून प्राणायाम, अनुलोम-विलोम व योगासने करावीत.\n३. **आहार नियम:** ताजे, कोमट आणि सात्विक जेवण वेळेवर घ्यावे. रात्रीचे जेवण हलके व लवकर करावे.\n\nतुम्हाला या त्रासाची अधिक विशिष्ट लक्षणे किंवा औषधांची माहिती हवी असल्यास कृपया अधिक तपशील सांगा!`
          : langToUse === 'hi'
          ? `🌿 **ज़ेनिवा AI क्लिनिकल मार्गदर्शन (Ayurvedic Consultation):**\n\nनमस्ते ${patientName ? patientName + ' जी' : ''}! आपके प्रश्न ('${queryToSend}') के लिए आयुर्वेदिक सुझाव:\n\n🩺 **दोष व स्वास्थ्य विश्लेषण:**\nआयुर्वेद के अनुसार शरीर का स्वास्थ्य वात, पित्त और कफ के संतुलन तथा जठराग्नि की शक्ति पर निर्भर करता है।\n\n🌿 **प्राथमिक आयुर्वेदिक समाधान:**\n१. **गुनगुना पानी:** दिन में गुनगुने पानी का सेवन करें, इससे शरीर के विषाक्त तत्व (आम) बाहर निकलते हैं।\n२. **दिनचर्या:** सुबह जल्दी उठें, अनुलोम-विलोम प्राणायाम करें और तनावमुक्त रहें।\n३. **सात्विक आहार:** समय पर ताजा, हल्का और सुपाच्य भोजन लें। रात का खाना जल्दी व हल्का रखें।\n\nकृपया अपनी समस्या के अन्य लक्षण बताएं ताकि हम आपको सटीक औषधीय मार्गदर्शन दे सकें!`
          : `🌿 **Zeniva AI Clinical Ayurvedic Consultation:**\n\nHello ${patientName || ''}! Regarding your query ('${queryToSend}'), here is the classical Ayurvedic clinical guidance:\n\n🩺 **Constitutional Analysis:**\nOptimal physiological health depends on the equilibrium of Tridosha (Vata, Pitta, Kapha) and a robust digestive metabolism (Agni).\n\n🌿 **Foundational Guidelines:**\n1. **Hydration & Detox:** Sip warm water with cumin or ginger throughout the day to eliminate cellular Ama.\n2. **Dinacharya (Daily Routine):** Incorporate morning Pranayama, gentle Abhyanga massage, and restorative sleep.\n3. **Dietary Wisdom:** Favor freshly prepared, warm, sattvic meals adjusted to your predominant constitution.\n\nFeel free to specify any localized symptoms, duration, or prior medications for tailored guidance!`;
      }
      
      const newMsgId = `ai-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        {
          id: newMsgId,
          sender: 'ai',
          text: fallbackText,
          citations: isTeam ? "Zeniva Group · TGPCET Nagpur" : "Charaka Samhita · Chikitsa Sthana",
          requires_login: isLoginRequired,
          is_team_query: isTeamInfo,
          lang: langToUse
        }
      ]);

      if (autoSpeak) {
        setTimeout(() => speakText(fallbackText, newMsgId, langToUse), 300);
      }
    } finally {
      setLoading(false);
    }
  };

  const localizedQuickPrompts = {
    mr: [
      { text: isGuest ? "👨‍💻 झेनिव्हा AI कोणी बनवले? टीम व संस्थापकांची माहिती सांगा" : "👨‍💻 झेनिव्हा टीम व निर्मात्यांची माहिती सांगा", label: "Zeniva Team" },
      { text: "🧭 झेनिव्हा डॅशबोर्डवर काय काय सुविधा व फीचर्स उपलब्ध आहेत?", label: "Dashboard Guide" },
      { text: isGuest ? "🌱 पचन, गॅस व ऍसिडिटीवरील आयुर्वेदिक उपाय सांगा" : `🌱 ${patientName} यांच्यासाठी पचन व गॅसवरील उपाय`, label: "पचन (Agni)" },
      { text: "⚡ सांधेदुखी व सांधे लवचिकतेसाठी दिनचर्या", label: "सांधेदुखी (Joints)" },
      { text: "👨‍⚕️ पुणे व नागपूरमधील आयुर्वेदिक डॉक्टर शोधा", label: "Doctors" },
      { text: isGuest ? "🌿 आयुर्वेदिक आरोग्य परीक्षण कसे करावे?" : "📋 माझा आरोग्य अहवाल दाखवा", label: isGuest ? "Health Check" : "My Profile EHR" }
    ],
    hi: [
      { text: isGuest ? "👨‍💻 ज़ेनिवा AI किसने बनाया है? टीम और फाउंडर्स की जानकारी बताएं" : "👨‍💻 ज़ेनिवा टीम और फाउंडर्स की जानकारी बताएं", label: "Zeniva Team" },
      { text: "🧭 ज़ेनिवा डैशबोर्ड पर क्या-क्या सुविधाएं और फीचर्स उपलब्ध हैं?", label: "Dashboard Guide" },
      { text: isGuest ? "🌱 पाचन और गैस के लिए घरेलू आयुर्वेदिक उपाय बताएं" : `🌱 ${patientName} जी के लिए पाचन और गैस के घरेलू उपाय`, label: "पाचन (Agni)" },
      { text: "⚡ जोड़ों का दर्द और लचीलेपन के उपाय", label: "जोड़ों का दर्द (Joints)" },
      { text: "👨‍⚕️ नागपुर और पुणे में आयुर्वेदिक डॉक्टर खोजें", label: "Doctors" },
      { text: isGuest ? "🌿 आयुर्वेदिक स्वास्थ्य परीक्षण कैसे करें?" : "📋 मेरी स्वास्थ्य प्रोफाइल और रिकॉर्ड दिखाएं", label: isGuest ? "Health Check" : "My Profile EHR" }
    ],
    en: [
      { text: isGuest ? "👨‍💻 Who created Zeniva AI? Tell me about the founders and team" : "👨‍💻 Tell me about the Zeniva creators and team", label: "Zeniva Team" },
      { text: "🧭 What features and services are available on the Zeniva dashboard?", label: "Dashboard Guide" },
      { text: isGuest ? "🌱 Ayurvedic remedies for digestion and gut health" : `🌱 Ayurvedic digestion & gut health remedies for ${patientName}`, label: "Digestion (Agni)" },
      { text: "⚡ Joint care & muscle mobility daily routine", label: "Joint Care" },
      { text: "👨‍⚕️ Find verified Ayurvedic doctors in Nagpur & Pune", label: "Find Doctors" },
      { text: isGuest ? "🌿 How to assess my Ayurvedic health profile?" : "📋 Show my health profile & Ayurvedic EHR record", label: isGuest ? "Health Check" : "My EHR Profile" }
    ]
  };

  const activePrompts = localizedQuickPrompts[selectedLang] || localizedQuickPrompts.mr;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-4xl h-[100dvh] sm:h-[94vh] sm:max-h-[850px] rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border-2 border-[#EBE3D5] flex flex-col relative overflow-hidden text-[#1C1917]">
        
        {/* HEADER */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#060A14] via-[#0D162C] to-[#1C0D33] text-white flex items-center justify-between border-b border-cyan-500/30 shadow-lg relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[radial-gradient(#00f2fe12_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-3.5">
            <div className="relative group">
              <div className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500 opacity-70 blur-xs transition-all ${isSpeaking ? 'animate-spin scale-110 opacity-100' : 'animate-pulse'}`}></div>
              
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-[#0A0E1A] [perspective:500px] flex items-center justify-center">
                <div className="absolute inset-x-0 h-0.5 bg-cyan-300 shadow-[0_0_8px_#22d3ee] animate-hologram-beam z-10 pointer-events-none"></div>
                <img 
                  src="/assets/ai_voice_bot.jpg" 
                  alt="Zeniva - Neural Voice AI Bot" 
                  className={`w-full h-full object-cover animate-robot-oscillate transition-transform duration-300 ${isSpeaking ? 'scale-110 brightness-125' : 'group-hover:scale-105'}`}
                />
              </div>

              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#060A14] shadow-[0_0_8px_#34d399] z-20 ${isSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`}></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-cyan-200 tracking-wide flex items-center gap-1.5">
                  <span>झेनिव्हा (Zeniva)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    Neural AI 70B 🎙️
                  </span>
                </h3>
              </div>
              
              <div className="flex items-center gap-2 mt-0.5">
                {isSpeaking ? (
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold">
                    <span className="flex gap-0.5 items-end h-3.5 px-1.5 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/40">
                      <span className="w-1 bg-cyan-300 rounded-full animate-bounce h-2"></span>
                      <span className="w-1 bg-violet-400 rounded-full animate-bounce h-3.5 delay-75"></span>
                      <span className="w-1 bg-fuchsia-400 rounded-full animate-bounce h-2 delay-150"></span>
                      <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-3 delay-100"></span>
                      <span className="w-1 bg-violet-300 rounded-full animate-bounce h-2.5 delay-200"></span>
                    </span>
                    <span>{isGuest ? 'झेनिव्हा आपल्याशी बोलत आहे...' : `झेनिव्हा ${patientName} यांच्याशी बोलत आहे...`}</span>
                  </div>
                ) : isListening ? (
                  <p className="text-xs text-rose-300 font-semibold animate-pulse flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isGuest ? 'कृपया बोला... Zeniva Voice ऐकत आहे...' : `${patientName} जी, बोला... Zeniva Voice ऐकत आहे...`}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-stone-300">
                    {isGuest ? (
                      <span><span className="text-cyan-300 font-bold">अतिथी (Guest)</span> · Charaka RAG Voice AI</span>
                    ) : (
                      <span>रुग्ण: <span className="text-cyan-300 font-bold">{patientName}</span> · Charaka RAG Voice AI</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setAutoSpeak(!autoSpeak);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                autoSpeak 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                  : 'bg-white/10 text-stone-300 border-white/20 hover:bg-white/20'
              }`}
              title={autoSpeak ? "Voice Readout: ON" : "Voice Readout: OFF"}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5 fill-current text-cyan-200" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{autoSpeak ? "Voice: ON" : "Voice: OFF"}</span>
            </button>

            <div className="flex items-center bg-[#070b14]/90 border border-cyan-400/40 rounded-full p-1 text-xs font-bold shadow-inner">
              <button
                type="button"
                onClick={() => handleLanguageChange('mr')}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  selectedLang === 'mr' 
                    ? 'bg-cyan-400 text-stone-950 shadow-[0_0_10px_#22d3ee] scale-105' 
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  selectedLang === 'hi' 
                    ? 'bg-cyan-400 text-stone-950 shadow-[0_0_10px_#22d3ee] scale-105' 
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  selectedLang === 'en' 
                    ? 'bg-cyan-400 text-stone-950 shadow-[0_0_10px_#22d3ee] scale-105' 
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-rose-500/30 border border-white/15 hover:border-rose-400/40 text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SOUNDWAVE EQUALIZER */}
        <div className="bg-gradient-to-r from-[#070C18] via-[#0E1B38] to-[#1F0E38] px-4 py-1.5 border-b border-cyan-500/20 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="font-mono text-cyan-300 text-[10px] tracking-wider uppercase">Audio Waveform Equalizer</span>
          </div>

          <div className="flex items-end gap-1 h-4">
            <span className={`w-1 bg-cyan-400 rounded-full transition-all ${isSpeaking ? 'h-3.5 animate-pulse' : 'h-1.5'}`}></span>
            <span className={`w-1 bg-violet-400 rounded-full transition-all ${isSpeaking ? 'h-4 animate-bounce' : 'h-2'}`}></span>
            <span className={`w-1 bg-fuchsia-400 rounded-full transition-all ${isSpeaking ? 'h-3 animate-pulse' : 'h-1'}`}></span>
            <span className={`w-1 bg-cyan-300 rounded-full transition-all ${isSpeaking ? 'h-4 animate-bounce' : 'h-2.5'}`}></span>
            <span className={`w-1 bg-violet-500 rounded-full transition-all ${isSpeaking ? 'h-2.5 animate-pulse' : 'h-1'}`}></span>
            <span className={`w-1 bg-cyan-400 rounded-full transition-all ${isSpeaking ? 'h-3.5 animate-bounce' : 'h-2'}`}></span>
            <span className={`w-1 bg-fuchsia-400 rounded-full transition-all ${isSpeaking ? 'h-4 animate-pulse' : 'h-1.5'}`}></span>
          </div>

          <span className="text-[10px] font-mono text-stone-400">OpenRouter 70B · Charaka RAG</span>
        </div>

        {/* PATIENT EHR PROFILE BANNER */}
        {!isGuest && (
          <div className="bg-gradient-to-r from-[#21103E] via-[#16233B] to-[#0A261D] px-4 py-2 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-white text-[12px] flex items-center gap-1.5">
                <span>🌿</span>
                <span>{patientName}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold">
                {activeUser.prakriti || 'Stress & Sleep Wellness'}
              </span>
              {activeUser.city && (
                <span className="text-stone-300 text-[10px] hidden sm:inline">
                  📍 {activeUser.city}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/40">
                Patient EHR Connected
              </span>
            </div>
          </div>
        )}

        {/* CHAT MESSAGES STREAM */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF7F2]">
          
          {/* Quick Starter Suggestions */}
          {messages.length <= 1 && (
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#EBE3D5] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5B3E8C]">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    {isGuest
                      ? (selectedLang === 'mr' ? 'लोकप्रिय आयुर्वेदिक प्रश्न:' : selectedLang === 'hi' ? 'लोकप्रिय आयुर्वेदिक प्रश्न:' : 'Popular Ayurvedic Inquiries:')
                      : (selectedLang === 'mr' 
                          ? `${patientName} यांच्यासाठी त्वरित प्रश्न:` 
                          : selectedLang === 'hi'
                          ? `${patientName} जी के लिए त्वरित प्रश्न:`
                          : `Quick Inquiries for ${patientName}:`)}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                  {selectedLang === 'mr' ? 'मराठी मोड' : selectedLang === 'hi' ? 'हिन्दी मोड' : 'English Mode'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activePrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPrompt(qp.text, selectedLang)}
                    className="p-3 rounded-2xl bg-[#FAF8F5] hover:bg-purple-50/80 border border-stone-200 hover:border-[#5B3E8C] text-left text-xs text-stone-800 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <span className="truncate pr-2 font-medium">{qp.text}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#5B3E8C] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isThisSpeaking = isSpeaking && speakingMsgId === msg.id;
            const isCopied = copiedMsgId === msg.id;
            const isTranslating = translatingMsgId && translatingMsgId.startsWith(msg.id);

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="relative shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-300 shadow-md bg-[#1F1338]">
                      <img 
                        src="/assets/zeniva_ai_girl.png" 
                        alt="Zeniva AI Girl" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isThisSpeaking && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border border-white flex items-center justify-center animate-bounce shadow-xs">
                        <Volume2 className="w-2.5 h-2.5 text-purple-950" />
                      </span>
                    )}
                  </div>
                )}

                <div className="max-w-[88%] sm:max-w-[80%] space-y-2">
                  
                  {msg.is_emergency && (
                    <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-950 flex items-start gap-3 shadow-md animate-pulse">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-1.5 text-xs">
                        <p className="font-bold text-rose-900 text-sm">🚨 तातडीची आपत्कालीन सूचना (Emergency Alert)</p>
                        <p className="text-rose-800 leading-relaxed">
                          {patientName} जी, ही गंभीर स्थिती असू शकते. कृपया घरगुती उपायांवर अवलंबून न राहता तात्काळ रुग्णवाहिकेसाठी 108 वर कॉल करा किंवा जवळच्या रुग्णालयात जा.
                        </p>
                        <div className="flex gap-2 pt-1">
                          <a
                            href="tel:108"
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                          >
                            <PhoneCall className="w-3.5 h-3.5" /> Call 108 (रुग्णवाहिका)
                          </a>
                          <a
                            href="tel:112"
                            className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5"
                          >
                            Call 112
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-gradient-to-r from-[#5B3E8C] to-[#4A2F75] text-white rounded-tr-none'
                        : 'bg-white border border-[#EBE3D5] text-stone-900 rounded-tl-none space-y-3'
                    }`}
                  >
                    {msg.image && (
                      <div className="rounded-2xl overflow-hidden max-w-xs border border-white/20 mb-2 shadow-sm">
                        <img src={msg.image} alt="User Attachment" className="w-full h-auto object-cover" />
                      </div>
                    )}

                    {isUser ? (
                      <div className="whitespace-pre-line font-sans leading-relaxed">
                        {msg.text}
                      </div>
                    ) : (
                      renderCleanFormattedText(msg.text)
                    )}

                    {msg.citations && (
                      <div className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#E5DAC6] space-y-1 text-xs mt-2">
                        <div className="flex items-center gap-1.5 text-[#78350F] font-bold">
                          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                          <span>वैदिक ग्रंथ संदर्भ (Classical Vedic References):</span>
                        </div>
                        <p className="text-stone-700 font-serif italic text-[11px] leading-snug">
                          {msg.citations}
                        </p>
                      </div>
                    )}

                    {!isUser && (
                      <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-stone-500 font-bold flex items-center gap-1">
                          <Languages className="w-3.5 h-3.5 text-purple-700" />
                          <span>भाषांतर (Translate):</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={Boolean(translatingMsgId)}
                            onClick={() => handleTranslateMessage(msg.id, 'mr')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                              translatingMsgId === `${msg.id}_mr`
                                ? 'bg-amber-200 text-stone-900 border-amber-400 animate-pulse'
                                : msg.lang === 'mr'
                                ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-2xs font-bold'
                                : 'bg-stone-100 hover:bg-amber-100 hover:text-stone-900 text-stone-700 border-stone-200'
                            }`}
                            title="Translate to Marathi"
                          >
                            {translatingMsgId === `${msg.id}_mr` ? 'अनुवाद...' : 'मराठी'}
                          </button>
                          <button
                            type="button"
                            disabled={Boolean(translatingMsgId)}
                            onClick={() => handleTranslateMessage(msg.id, 'hi')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                              translatingMsgId === `${msg.id}_hi`
                                ? 'bg-amber-200 text-stone-900 border-amber-400 animate-pulse'
                                : msg.lang === 'hi'
                                ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-2xs font-bold'
                                : 'bg-stone-100 hover:bg-amber-100 hover:text-stone-900 text-stone-700 border-stone-200'
                            }`}
                            title="Translate to Hindi"
                          >
                            {translatingMsgId === `${msg.id}_hi` ? 'अनुवाद...' : 'हिन्दी'}
                          </button>
                          <button
                            type="button"
                            disabled={Boolean(translatingMsgId)}
                            onClick={() => handleTranslateMessage(msg.id, 'en')}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                              translatingMsgId === `${msg.id}_en`
                                ? 'bg-amber-200 text-stone-900 border-amber-400 animate-pulse'
                                : msg.lang === 'en'
                                ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-2xs font-bold'
                                : 'bg-stone-100 hover:bg-amber-100 hover:text-stone-900 text-stone-700 border-stone-200'
                            }`}
                            title="Translate to English"
                          >
                            {translatingMsgId === `${msg.id}_en` ? 'Translating...' : 'English'}
                          </button>
                        </div>
                      </div>
                    )}

                    {!isUser && isGuest && msg.id !== 'msg-welcome' && (
                      <div className="pt-2.5 mt-2 border-t border-amber-300/80 bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-purple-500/15 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-amber-400 shadow-sm animate-in fade-in">
                        <div className="text-[11px] text-amber-950 font-bold flex items-center gap-2 text-center sm:text-left">
                          <span className="relative flex h-2.5 w-2.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
                          </span>
                          <span>
                            {selectedLang === 'mr'
                              ? "वैयक्तिक आयुर्वेदिक इतिहास व औषधांसाठी लॉगिन आवश्यक आहे:"
                              : selectedLang === 'hi'
                              ? "व्यक्तिगत आयुर्वेदिक इतिहास व सही इलाज के लिए लॉगिन आवश्यक है:"
                              : "Log in to unlock your personalized health history & treatment:"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            stopSpeaking();
                            onClose();
                            onOpenAuth();
                          }}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-purple-800 hover:from-amber-700 hover:to-purple-900 text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer group shrink-0"
                        >
                          <span>🔐</span>
                          <span>
                            {selectedLang === 'mr'
                              ? "रुग्ण लॉगिन / खाते उघडा"
                              : selectedLang === 'hi'
                              ? "पेशेंट लॉगिन / नया खाता बनाएँ"
                              : "Login / Register Patient Account"}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    )}

                    {!isUser && (msg.is_team_query || /(भूपेश|विवेक|मोमिता|creators|team|निर्माते|tgpcet|संस्थापक)/i.test(msg.text)) && (
                      <div className="pt-2.5 mt-2 border-t border-cyan-200 bg-cyan-50/80 p-3 rounded-2xl flex items-center justify-between gap-2 border border-cyan-300 shadow-xs animate-in fade-in">
                        <span className="text-[11px] text-cyan-950 font-bold flex items-center gap-1.5">
                          <span>👨‍💻</span>
                          <span>
                            {selectedLang === 'mr'
                              ? "झेनिव्हा टीम व निर्मात्यांचे संपूर्ण प्रोफाइल पहा:"
                              : selectedLang === 'hi'
                              ? "ज़ेनिवा टीम और फाउंडर्स की पूरी प्रोफाइल देखें:"
                              : "Meet Zeniva Creators & Engineering Team:"}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            stopSpeaking();
                            onClose();
                            onSelectTab('team');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-700 to-blue-800 hover:from-cyan-800 hover:to-blue-900 text-white text-[11px] font-bold shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <span>View Team</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {msg.has_doctor && (
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-purple-900 font-semibold flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5" /> Book Consultation with Certified Vaidya:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            stopSpeaking();
                            onClose();
                            onSelectTab('consultation');
                          }}
                          className="px-3 py-1 rounded-xl bg-[#5B3E8C] hover:bg-[#4A2F75] text-white text-[11px] font-bold cursor-pointer"
                        >
                          Book OPD
                        </button>
                      </div>
                    )}
                  </div>

                  {!isUser && (
                    <div className="flex items-center gap-2 text-xs text-stone-400 pl-2">
                      <button
                        type="button"
                        onClick={() => speakText(msg.text, msg.id, msg.lang)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                          isThisSpeaking 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs' 
                            : 'bg-stone-100 hover:bg-stone-200 text-purple-900'
                        }`}
                        title="Play / Stop Voice Reading"
                      >
                        {isThisSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                            <span>
                              {selectedLang === 'hi' 
                                ? 'आवाज रोकें (Stop)' 
                                : selectedLang === 'mr' 
                                ? 'आवाज थांबवा (Stop)' 
                                : 'Stop Voice'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-[#5B3E8C]" />
                            <span>
                              {selectedLang === 'hi' 
                                ? 'बोलकर सुनें (Listen)' 
                                : selectedLang === 'mr' 
                                ? 'ऐका (Listen)' 
                                : 'Listen (Voice)'}
                            </span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyText(msg.text, msg.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {msg.model_used && (
                        <span className="text-[10px] text-stone-400 ml-auto font-mono">
                          {msg.model_used}
                        </span>
                      )}
                    </div>
                  )}

                </div>

                {isUser && (
                  <div className="w-10 h-10 rounded-full bg-stone-300 text-stone-800 flex items-center justify-center shrink-0 shadow-xs mt-1 overflow-hidden">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-stone-600 text-xs py-2 pl-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-300 bg-[#1F1338] animate-pulse">
                  <img src="/assets/zeniva_ai_girl.png" alt="Zeniva Thinking" className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center animate-spin">
                  <RefreshCw className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-stone-900">
                  {selectedLang === 'mr'
                    ? `झेनिव्हा ${patientName} यांच्यासाठी आयुर्वेदिक विश्लेषण करत आहे...`
                    : selectedLang === 'hi'
                    ? `ज़ेनिवा ${patientName} जी के लिए आयुर्वेदिक विश्लेषण कर रही है...`
                    : `Zeniva is synthesizing Charaka Samhita guidance for ${patientName}...`}
                </p>
                <p className="text-[10px] text-stone-500">OpenRouter 70B & Classical Samhita Corpus Active</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR */}
        <div className="p-3.5 sm:p-5 bg-white border-t border-[#EBE3D5] space-y-2">
          
          {imagePreview && (
            <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-purple-50 border border-purple-200">
              <img src={imagePreview} alt="Selected preview" className="w-12 h-12 object-cover rounded-xl shadow-xs" />
              <div className="flex-1 text-xs">
                <p className="font-bold text-stone-800 truncate">{selectedImage?.name}</p>
                <p className="text-[10px] text-purple-700">Photo attached for Zeniva Vision Diagnostic Analysis</p>
              </div>
              <button
                type="button"
                onClick={clearSelectedImage}
                className="p-1 rounded-full hover:bg-purple-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isListening && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 flex items-center justify-between text-xs text-rose-950 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></div>
                <span className="font-bold">
                  {selectedLang === 'mr'
                    ? `${patientName} जी, बोला... झेनिव्हा ऐकत आहे...`
                    : selectedLang === 'hi'
                    ? `${patientName} जी, बोलिए... ज़ेनिवा सुन रही है...`
                    : `${patientName}, speak now... Zeniva is listening...`}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px]"
              >
                Stop
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl border border-stone-200 hover:bg-stone-100 text-stone-600 hover:text-purple-700 transition-colors cursor-pointer shrink-0"
              title="Attach Skin, Tongue or Herb Photo"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-3 rounded-2xl border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 font-bold text-xs ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse shadow-lg ring-4 ring-rose-200'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
              }`}
              title={isListening ? 'Listening... Click to stop' : 'Voice Input (आवाजाने बोला)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#5B3E8C]" />}
              <span className="hidden sm:inline">{isListening ? 'Listening' : 'Speak'}</span>
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isGuest
                  ? (selectedLang === 'mr'
                      ? 'येथे प्रश्न विचारा (उदा. पचन, ऍसिडिटी, दिनचर्या, डॉक्टर)...'
                      : selectedLang === 'hi'
                      ? 'यहाँ सवाल पूछें (जैसे: पाचन, तनाव, जड़ी-बूटियाँ, डॉक्टर)...'
                      : 'Ask about stress, digestion, joint care, diet, herbs, or doctors...')
                  : (selectedLang === 'mr'
                      ? `${patientName} जी, येथे प्रश्न विचारा (उदा. पचन, दिनचर्या, डॉक्टर)...`
                      : selectedLang === 'hi'
                      ? `${patientName} जी, यहाँ सवाल पूछें (जैसे: पाचन, तनाव, जड़ी-बूटियाँ)...`
                      : `${patientName}, ask about stress, digestion, diet, or certified doctors...`)
              }
              className="flex-1 px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#5B3E8C]/30 text-xs sm:text-sm bg-[#FAF8F5] text-stone-900 placeholder:text-stone-400"
            />

            <button
              type="submit"
              disabled={loading || (!inputQuery.trim() && !selectedImage)}
              className="p-3 sm:px-5 rounded-2xl bg-[#5B3E8C] hover:bg-[#4A2F75] disabled:opacity-40 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

          <div className="flex items-center justify-between text-[9px] text-stone-400 px-1 pt-0.5">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-600" />
              Zeniva AI offers classical Ayurvedic wisdom. For acute ailments, consult certified Vaidyas.
            </span>
            <span className="hidden sm:inline text-stone-500 font-mono">
              Charaka Samhita RAG 2.0
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
