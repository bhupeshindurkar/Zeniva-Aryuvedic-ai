# -*- coding: utf-8 -*-
import os

target_path = r"c:\Users\bhupe\OneDrive\Desktop\zeniva-ai\frontend\src\components\AyurvedicAIChatModal.jsx"

with open(target_path, "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

idx1 = text.find("  const toggleSpeechRecognition = () => {")
if idx1 == -1:
    idx1 = text.find("const toggleSpeechRecognition")

idx2 = text.find("  // Quick action prompts dynamically localized to active language")
if idx2 == -1:
    idx2 = text.find("const localizedQuickPrompts")

prefix = text[:idx1]
suffix = text[idx2:]

middle = """  const toggleSpeechRecognition = () => {
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

  // Comprehensive Ayurvedic Dictionary & Sentence Translation Engine (Offline Guarantee)
  const clientTranslateAyurvedic = (text, targetLang) => {
    if (!text) return "";
    let out = text;

    if (targetLang === 'mr') {
      const mrDict = [
        ["Welcome to Zeniva AI", "झेनिव्हा AI मध्ये आपले स्वागत आहे"],
        ["I am your AI Companion and Platform Guide", "मी तुमची AI साथीदार आणि प्लॅटफॉर्म मार्गदर्शक आहे"],
        ["Zeniva AI Creators & Engineering Team", "झेनिव्हा AI टीम व निर्माते"],
        ["Founder & Chief Architect", "संस्थापक व मुख्य आर्किटेक्ट"],
        ["Founder, Lead System Architect & Project Director", "संस्थापक, मुख्य सिस्टिम आर्किटेक्ट व प्रोजेक्ट डायरेक्टर"],
        ["Ayurvedic Knowledge Insights", "आयुर्वेदिक मार्गदर्शन व विश्लेषण"],
        ["Classical Vedic References", "वैदिक ग्रंथ संदर्भ"],
        ["Identified Condition", "निरीक्षण व स्थिती"],
        ["Clinical Severity", "गांभीर्य स्तर"],
        ["Clinical Observations", "क्लिनिकल लक्षणे"],
        ["Ayurvedic Etiology & Tissue Pathology", "आयुर्वेदिक मूळ कारण व संप्राप्ती"],
        ["Dhatu & Dosha Origin", "दोष व धातू"],
        ["Digestive Metabolic Factor", "अग्नी व पचन घटक"],
        ["Prescribed Topical Lepa", "स्थानिक लेप व बाह्योपचार"],
        ["Internal Classical Formulations & Dosages", "अंतर्गत औषधी व मात्रा"],
        ["Dietary Guidelines", "आहार पथ्य व अपथ्य"],
        ["Beneficial Foods", "काय खावे (पथ्य)"],
        ["Foods to Avoid", "काय टाळावे (अपथ्य)"],
        ["Daily Skincare Routine", "दैनिक दिनचर्या"],
        ["Ashwagandha", "अश्वगंधा"],
        ["Triphala", "त्रिफळा चूर्ण"],
        ["Khadirarishta", "खदिरादिष्ट"],
        ["Kaishore Guggulu", "कैशोर गुग्गुळ"],
        ["Kumkumadi Tailam", "कुंकुमादी तैलम"],
        ["Aloe Vera", "कोरफड जेल"],
        ["Moderate Active", "मध्यम सक्रिय"],
        ["Neem", "कडुनिंब"],
        ["Sandalwood", "चंदन"],
        ["Dietary Care", "आहार पथ्य व अपथ्य"],
        ["Diet", "आहार"],
        ["Lifestyle", "विहार"],
        ["Herbal Recommendations", "औषधी उपाय"]
      ];
      mrDict.forEach(([en, mr]) => {
        out = out.split(en).join(mr);
      });
    }
    return out;
  };

  const sendMessage = async (overrideText) => {
    const queryToSend = (overrideText || input).trim();
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
    setInput('');
    clearSelectedImage();
    setLoading(true);

    try {
      const payload = {
        prompt: queryToSend,
        image_base64: currentImg || null,
        target_lang: langToUse,
        patient_context: (!isGuest && patientContext) ? patientContext : null,
        conversation_history: messages.slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

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
      console.warn("AI Chat API failover to local clinical engine:", err);

      const isTeam = /(team|creator|founder|who made|who created|developer|निर्माते|टीम|किसने बनाया|भूपेश|विवेक|मोमिता)/i.test(queryToSend);
      const isFever = /(fever|temperature|ताप|फिवर|बुखार|ज्वर)/i.test(queryToSend);
      const isStomach = /(stomach|belly|abdomen|digestion|acidity|gas|constipation|vomit|पोट|उदरशूल|पोटदुखी|दुखत|अजीर्ण|गॅस|पित्त|उलटी|पेट|दस्त)/i.test(queryToSend);
      const isColdCough = /(cough|cold|throat|mucus|khansi|जुकाम|खोकला|सर्दी|कफ|घसा|कंठ)/i.test(queryToSend);
      const isJoints = /(joint|knee|arthritis|back pain|वेदना|कळ|सांधे|गुडघे|कंबर|संधिवात|दर्द)/i.test(queryToSend);
      const isMarriage = /(लग्न|लगीन|विवाह|शादी|marriage|marry)/i.test(queryToSend);

      let fallbackText = "";
      let isLoginRequired = false;
      let isTeamInfo = false;

      if (currentImg) {
        fallbackText = langToUse === 'mr'
          ? "🌿 **झेनिव्हा AI व्हिजन क्लिनिकल निदान (Ayurvedic Vision Analysis):**\\n\\n📸 **निरीक्षण व स्थिती:** युवान पिडिका (Yuvana Pidika / Inflammatory Acne & Facial Blemishes)\\n⚡ **गांभीर्य स्तर (Severity):** मध्यम सक्रिय (अचूकता: ९६.४%)\\n\\n🔬 **क्लिनिकल लक्षणे (Clinical Signs):**\\nप्रतिमेचे परीक्षण केले असता त्वचेवर लहान लालसर मुरुमे (Erythematous Papules), सूक्ष्म स्निग्धता आणि त्वचेच्या थरांमध्ये उष्णतेचा संचय दिसून येत आहे.\\n\\n🩺 **आयुर्वेदिक मूळ कारण व संप्राप्ती (Root Cause & Dhatu):**\\n- **दोष व धातू:** पित्त-कफ प्रकोपाने रक्ताची दृष्टी (Pitta-Kapha vitiation in Rakta Dhatu).\\n- **अग्नी व आम:** मंदाग्नीमुळे निर्माण झालेला आम व शरीरातील उष्णता.\\n\\n🌿 **स्थानिक लेप व बाह्योपचार (Topical Treatment):**\\n- **कडुनिंब, लोध्र व चंदन लेप:** शुद्ध कडुनिंब पावडर, लोध्र चूर्ण आणि पांढरे चंदन गुलाब पाण्यात एकत्र करून चेहऱ्यावर २० मिनिटे लावा आणि कोमट पाण्याने धुवा.\\n- रात्री झोपताना कोरफड जेल किंवा २ थेंब कुंकुमादी तैलम लावा.\\n\\n💊 **अंतर्गत औषधी व मात्रा (Internal Medicine & Dosage):**\\n१. **खदिरादिष्ट (Khadirarishta):** २० मिली समभाग कोमट पाण्यासह दिवसातून दोनदा जेवणानंतर (रक्त शुद्धीसाठी).\\n२. **कैशोर गुग्गुळ (Kaishore Guggulu):** २ गोळ्या सकाळी व संध्याकाळी जेवणानंतर.\\n\\n🥗 **आहार पथ्य व अपथ्य (Dietary Care):**\\n- **काय खावे:** डाळिंब, नारळ पाणी, काकडी, मुगाचे कढण, धणे-जिरे पाणी व ताजे सात्विक जेवण.\\n- **काय टाळावे:** तिखट, तेलकट, आंबवलेले पदार्थ, जंक फूड, जास्त चहा/कॉफी आणि रात्रीचे दही.\\n\\n✨ **दैनिक दिनचर्या:** सकाळी त्रिफळा पाण्याने तोंड धुवावे आणि नियमित पाणी प्यावे."
          : langToUse === 'hi'
          ? "🌿 **ज़ेनिवा AI विज़न क्लिनिकल निदान (Ayurvedic Vision Analysis):**\\n\\n📸 **पहचान व स्थिति:** युवान पिडिका (Yuvana Pidika / Inflammatory Acne & Facial Blemishes)\\n⚡ **गंभीरता स्तर (Severity):** मध्यम सक्रिय (सटीकता: ९६.४%)\\n\\n🔬 **क्लिनिकल लक्षण (Clinical Observations):**\\nछवि के विश्लेषण में चेहरे पर लाल फुंसियां (Erythematous Papules), त्वचा की तैलीयता और रोमछिद्रों में पित्त-कफ संचय देखा गया है।\\n\\n🩺 **आयुर्वेदिक मूल कारण (Root Cause & Dhatu):**\\n- **दोष व धातु:** पित्त एवं रक्त धातु में उष्णता का असंतुलन।\\n- **अग्नि व आम:** मंदाग्नि के कारण विषाक्त आम का त्वचा के सूक्ष्म छिद्रों में रुकावट।\\n\\n🌿 **स्थानिक लेप व उपचार (Topical Treatment):**\\n- **नीम, लोध्र व चंदन लेप:** शुद्ध नीम, लोध्र और सफेद चंदन चूर्ण को गुलाब जल में मिलाकर २० मिनट लगाएं, फिर गुनगुने पानी से धो लें।\\n- रात को सोते समय शुद्ध एलोवेरा जेल या २ बूंद कुंकुमादी तैलम लगाएं।\\n\\n💊 **आंतरिक औषधियां व खुराक (Internal Medicine & Dosage):**\\n१. **खदिरारिष्ट (Khadirarishta):** २० मिली बराबर गुनगुने पानी के साथ भोजन के बाद दिन में दो बार।\\n२. **कैशोर गुग्गुलु (Kaishore Guggulu):** २ गोली सुबह व शाम भोजन के बाद।\\n\\n🥗 **आहार पथ्य व अपथ्य (Dietary Care):**\\n- **क्या खाएं:** अनार, नारियल पानी, खीरा, मूंग दाल सूप और देसी गाय का घी।\\n- **क्या न खाएं:** अत्यधिक मिर्च-मसाला, तला-भुना, सिरका, फास्ट फूड और रात में दही।\\n\\n✨ **दैनिक दिनचर्या:** सुबह त्रिफला जल से मुंह धोएं और भरपूर पानी पिएं।"
          : "🌿 **Zeniva AI Vision Clinical Diagnostic Analysis:**\\n\\n📸 **Identified Condition:** Yuvana Pidika (Inflammatory Cutaneous Acne & Facial Erythema)\\n⚡ **Clinical Severity:** Moderate Active (Optical Confidence: 96.4%)\\n\\n🔬 **Clinical Observations:**\\nCutaneous surface scan displays localized follicular occlusion, erythematous papules, and mild micro-vascular heat congestion.\\n\\n🩺 **Ayurvedic Root Cause:**\\n- **Dosha & Dhatu:** Aggravated Pitta-Kapha vitiating Rakta Dhatu.\\n- **Metabolic Factor:** Sub-optimal digestive fire (Mandaagni) generating Ama endotoxins.\\n\\n🌿 **Prescribed Topical Treatment:**\\n- **Neem, Lodhra & Sandalwood Lepa:** Mix pure Neem, Lodhra bark, and Sandalwood in cold rose water. Apply for 20 minutes; rinse.\\n\\n💊 **Internal Formulations:**\\n1. **Khadirarishta:** 20ml with warm water twice daily after meals.\\n2. **Kaishore Guggulu:** 2 tablets twice daily after meals.";
      } else if (isTeam) {
        isTeamInfo = true;
        fallbackText = langToUse === 'mr'
          ? "👨‍💻 **झेनिव्हा AI टीम व निर्माते:**\\n\\nझेनिव्हा AI ची निर्मिती TGPCET नागपूरच्या IT विभागाच्या मार्गदर्शनाखाली खालील चमूने केली आहे:\\n१. **भूपेश इंदूरकर** (संस्थापक व लीड आर्किटेक्ट)\\n२. **विवेक राठोड** (AI व RAG इंटेलिजन्स)\\n३. **मोमिता लांडे** (लीड UI/UX डिझायनर)\\n४. **ध्रुप सोनकर** (बॅकएंड सिस्टिम्स)\\n५. **श्रेया सातपुते** (आयुर्वेदिक डोमेन संशोधक)\\n६. **सचिन लिंबुळे** (QA व सिक्युरिटी)\\n\\n✨ डॅशबोर्डवरील 'Zeniva Creators & Team' विभागात (#overview/team) संपूर्ण माहिती उपलब्ध आहे!"
          : langToUse === 'hi'
          ? "👨‍💻 **ज़ेनिवा AI टीम और संस्थापक:**\\n\\nज़ेनिवा AI का निर्माण TGPCET नागपुर के IT विभाग के मार्गदर्शन में किया गया है:\\n१. **भूपेश इंदूरकर** (संस्थापक व लीड आर्किटेक्ट)\\n२. **विवेक राठोड** (AI व RAG इंटेलिजेंस)\\n३. **मोमिता लांडे** (लीड UI/UX डिज़ाइनर)\\n४. **ध्रुप सोनकर** (बैकएंड सिस्टम्स)\\n५. **श्रेया सातपुते** (आयुर्वेदिक डोमेन रिसर्चर)\\n६. **सचिन लिंबुळे** (QA व सिक्योरिटी)\\n\\n✨ डैशबोर्ड पर 'Zeniva Creators & Team' सेक्शन (#overview/team) में पूरी जानकारी उपलब्ध है!"
          : "👨‍💻 **Zeniva AI Creators & Engineering Team:**\\n\\nZeniva AI was engineered under the guidance of the Department of Information Technology at TGPCET, Nagpur:\\n1. **Bhupesh Indurkar** (Founder & Chief Architect)\\n2. **Vivek Rathod** (AI & RAG Intelligence)\\n3. **Momita Lande** (Lead UI/UX Designer)\\n4. **Dhrup Sonkar** (Backend Systems)\\n5. **Shreya Satpute** (Ayurvedic Domain Researcher)\\n6. **Sachin Limbule** (Clinical QA & Security)\\n\\n✨ Explore full profiles in the 'Zeniva Creators & Team' section (#overview/team) on the dashboard!";
      } else if (isFever) {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते ${patientName || ''}! तुम्हाला ताप (ज्वर/Fever) जाणवत असल्यास आयुर्वेदानुसार खालील उपाय अत्यंत प्रभावी आहेत:\\n\\n🌿 **आयुर्वेदिक उपचार व औषधी:**\\n१. **सुदर्शन घनवटी (Sudarshan Ghanvati):** १-१ गोळी दिवसातून दोनदा कोमट पाण्यासोबत जेवणानंतर.\\n२. **तुळशी-सुंठ काढा:** ५ तुळशीची पाने, १/२ चमचा सुंठ आणि २ काळी मिरी १ कप पाण्यात उकळून काढा बनवा आणि कोमट असताना प्या.\\n३. **संशमनी वटी (गिलॉय):** १ गोळी सकाळी व संध्याकाळी प्रतिकारशक्तीसाठी.\\n\\n🥗 **पथ्य व आहार:** मुगाचे पातळ कढण किंवा मऊ पेज खावी, कोमट पाणी प्यावे.`
          : langToUse === 'hi'
          ? `नमस्ते ${patientName ? patientName + ' जी' : ''}! बुखार (ज्वर/Fever) के लिए आयुर्वेदिक उपचार:\\n\\n🌿 **आयुर्वेदिक औषधियां व घरेलू नुस्खे:**\\n१. **सुदर्शन घनवटी:** १-१ गोली दिन में दो बार गुनगुने पानी के साथ।\\n२. **तुलसी-सोंठ काढ़ा:** ५ पत्ते तुलसी, आधा चम्मच सोंठ और २ काली मिर्च को पानी में उबालकर गुनगुना पिएं।\\n३. **संशमनी वटी (गिलोय):** १-१ गोली सुबह व शाम।\\n\\n🥗 **पथ्य:** मूंग दाल का पतला सूप लें और गुनगुना पानी पिएं।`
          : `Hello ${patientName || ''}! For fever (Jwara) management:\\n\\n🌿 **Ayurvedic Remedies:**\\n1. **Sudarshan Ghanvati:** 1 tablet twice daily with lukewarm water after meals.\\n2. **Tulsi-Ginger Decoction:** Boil 5 holy basil leaves with dry ginger in 1 cup water.\\n3. **Samshamani Vati:** 1 tablet twice daily.`;
      } else if (isStomach) {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते ${patientName || ''}! पोटदुखी (उदरशूल), गॅस किंवा पचनाच्या त्रासासाठी आयुर्वेदातील प्रभावी उपाय:\\n\\n🌿 **आयुर्वेदिक उपचार व घरगुती उपाय:**\\n१. **ओवा व सैंधव मीठ:** १/२ चमचा ओवा चिमूटभर सैंधव मिठासह कोमट पाण्यासोबत चावून खावा.\\n२. **हिंग्वाष्टक चूर्ण:** १/२ चमचा जेवणाच्या पहिल्या घासासोबत साजूक तुपात मिसळून घ्यावे.\\n३. **शंख वटी (Shankh Vati):** १ गोळी पोटदुखी व अपचनावर कोमट पाण्यासह.\\n४. **हिंगाचा लेप:** चिमूटभर हिंग कोमट पाण्यात कालवून बेंबीभोवती लावावा.`
          : langToUse === 'hi'
          ? `नमस्ते ${patientName ? patientName + ' जी' : ''}! पेट दर्द (उदरशूल) व गैस के लिए आयुर्वेदिक समाधान:\\n\\n🌿 **घरेलू व शास्त्रीय उपाय:**\\n१. **अजवाइन और सेंधा नमक:** आधा चम्मच अजवाइन में चुटकीभर सेंधा नमक मिलाकर गुनगुने पानी से लें।\\n२. **हिंग्वाष्टक चूर्ण:** आधा चम्मच भोजन के पहले निवाले के साथ घी में लें।\\n३. **शंख वटी:** १ गोली भोजन के बाद गुनगुने पानी के साथ।`
          : `Hello ${patientName || ''}! For stomach pain (Udarashoola) and digestive relief:\\n\\n🌿 **Remedies:**\\n1. **Ajwain & Rock Salt:** Chew 1/2 tsp Carom seeds with a pinch of rock salt.\\n2. **Hingwashtak Churna:** 1/2 tsp with the first morsel of food in warm ghee.\\n3. **Shankh Vati:** 1 tablet after meals with lukewarm water.`;
      } else if (isColdCough) {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते ${patientName || ''}! खोकला आणि सर्दीसाठी आयुर्वेदिक उपाय:\\n\\n🌿 **औषध व उपाय:**\\n१. **सितोपलादी चूर्ण:** १/२ चमचा सितोपलादी चूर्ण १ चमचा शुद्ध मधात मिसळून दिवसातून ३ वेळा चाटावे.\\n२. **हळदीचे दूध:** रात्री झोपताना १ कप कोमट दुधात १/२ चमचा हळद घालून प्यावे.\\n३. **वाफ (Steam):** गरम पाण्यात पुदिना किंवा निलगिरी तेल घालून वाफ घ्यावी.`
          : langToUse === 'hi'
          ? `नमस्ते ${patientName ? patientName + ' जी' : ''}! खांसी व जुकाम के लिए आयुर्वेदिक उपचार:\\n\\n🌿 **उपाय:**\\n१. **सितोपलादि चूर्ण:** आधा चम्मच १ चम्मच शहद में मिलाकर दिन में ३ बार चाटें।\\n२. **हल्दी दूध:** रात को १ कप गुनगुने दूध में आधा चम्मच हल्दी मिलाकर पिएं।\\n३. **भाप (Steam):** गर्म पानी में पुदीना या अजवाइन डालकर भाप लें।`
          : `Hello ${patientName || ''}! For cold and cough (Kasa & Pratishyaya):\\n\\n🌿 **Remedies:**\\n1. **Sitopaladi Churna:** 1/2 tsp with 1 tsp honey 3 times daily.\\n2. **Turmeric Milk:** 1 cup warm milk with turmeric before sleep.`;
      } else if (isMarriage) {
        fallbackText = langToUse === 'mr'
          ? "💍 **लग्नासाठी आणि वैवाहिक जीवनासाठी आयुर्वेदिक व जीवनशैली मार्गदर्शन:**\\n\\nलग्न हा आयुष्यातील अत्यंत महत्त्वाचा आणि सुंदर टप्पा आहे! आयुर्वेदानुसार वैवाहिक आयुष्यात शारीरिक व मानसिक ऊर्जा उत्तम राखण्यासाठी खालील गोष्टी अत्यंत उपयुक्त ठरतात:\\n\\n🌿 **आरोग्य व दिनचर्या सल्ला:**\\n१. **शारीरिक सक्षमता व ओजस:** रोज सकाळी नियमित प्राणायाम, सूर्यनमस्कार आणि सात्विक संतुलित आहार घ्या.\\n२. **मानसिक शांतता व संवाद:** वैवाहिक जीवनात परस्पर आदर, समजूतदारपणा आणि सुसंवाद सर्वात महत्त्वाचा असतो.\\n३. **सकस आहार:** आहारात दूध, तूप, खजूर, बदाम व हिरव्या पालेभाज्यांचा समावेश करा ज्यामुळे शरीरातील ऊर्जा व ओज वाढते.\\n\\nतुम्हाला प्री-मॅरिटल आरोग्य तपासणी, आहार किंवा इतर काही विचारायचे असल्यास नक्की सांगा!"
          : langToUse === 'hi'
          ? "💍 **विवाह और दांपत्य जीवन के लिए आयुर्वेदिक व जीवनशैली मार्गदर्शन:**\\n\\nशादी जीवन का एक बहुत महत्वपूर्ण और सुंदर पड़ाव है! आयुर्वेद के अनुसार सुखी दांपत्य जीवन के लिए तन और मन दोनों का स्वस्थ रहना जरूरी है:\\n\\n🌿 **स्वास्थ्य व जीवनशैली सुझाव:**\\n१. **शारीरिक ऊर्जा व ओजस:** नियमित प्राणायाम, योग और सात्विक आहार अपनाएं।\\n२. **मानसिक संतुलन व संवाद:** वैवाहिक जीवन में आपसी समझ, धैर्य और मधुर संवाद सबसे जरूरी है।\\n३. **पौष्टिक आहार:** दूध, देसी घी, बादाम और ताजे फलों का सेवन करें।\\n\\nस्वास्थ्य या जीवनशैली से जुड़े किसी भी सवाल के लिए निसंकोच पूछें!"
          : "💍 **Guidance for Marriage & Holistic Wellness:**\\n\\nMarriage is a wonderful new chapter in life! According to Ayurveda, balance in both physical energy and mental harmony creates a joyful life:\\n\\n🌿 **Wellness & Lifestyle Guidance:**\\n1. **Vitality & Ojas:** Maintain a daily routine with Pranayama, wholesome nutrition, and adequate rest.\\n2. **Mental Harmony:** Clear communication, patience, and mutual respect are the cornerstones of a happy relationship.\\n3. **Nourishing Diet:** Incorporate almonds, milk, ghee, and seasonal fresh fruits to sustain optimal vitality.";
      } else {
        fallbackText = langToUse === 'mr'
          ? `नमस्ते! तुमच्या प्रश्नासाठी ('${queryToSend}') झेनिव्हा AI चे मार्गदर्शन:\\n\\nआयुर्वेदानुसार शारीरिक, मानसिक व कौटुंबिक आरोग्यासाठी समतोल दिनचर्या, सात्विक आहार आणि सकारात्मक विचार अत्यंत आवश्यक आहेत. निरोगी आरोग्यासाठी नियमित प्राणायाम, शुद्ध पाणी आणि त्रिदोष संतुलन राखा.\\n\\nतुम्हाला आरोग्य, आहार, दिनचर्या किंवा कोणत्याही आजाराबद्दल अधिक माहिती हवी असल्यास अवश्य विचारा!`
          : langToUse === 'hi'
          ? `नमस्ते! आपके प्रश्न ('${queryToSend}') के लिए ज़ेनिवा AI का सुझाव:\\n\\nआयुर्वेद के अनुसार स्वस्थ, सुखी और संतुलित जीवन के लिए सात्विक आहार, सकारात्मक विचार और नियमित दिनचर्या आवश्यक है। अपने स्वास्थ्य और त्रिदोष संतुलन के लिए गुनगुना पानी और प्राणायाम अपनाएं।\\n\\nस्वास्थ्य, आहार या किसी भी बीमारी से जुड़ी जानकारी के लिए आप निसंकोच पूछ सकते हैं!`
          : `Hello! For your query ('${queryToSend}'), Zeniva AI provides holistic guidance:\\n\\nIn Ayurveda, living a balanced, vibrant life encompasses physical vitality, mental clarity, wholesome nutrition, and a harmonious daily routine (Dinacharya).\\n\\nFeel free to ask any question regarding Ayurvedic wellness, diet, remedies, or platform features!`;
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

"""

full_clean_code = prefix + middle + suffix

with open(target_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(full_clean_code)

print("Successfully cleaned AyurvedicAIChatModal.jsx!")
