import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, 
  Sparkles, Stethoscope, ShieldCheck, Heart, ArrowRight, 
  HelpCircle, ChevronDown, ChevronUp, AlertCircle, Building, ExternalLink
} from 'lucide-react';

export const ContactUsView = ({ onSelectTab = () => {}, onOpenAIChat = () => {} }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'Clinical Consultation',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "झेनिव्हा (Zeniva) AI सल्ला कसा मिळवावा?",
      a: "तुम्ही थेट स्क्रीनवरील 'Zeniva AI Assistant' किंवा 'AI Vaidya Chat' वर क्लिक करून मराठी, हिंदी किंवा इंग्रजीत कोणताही आजार, लक्षणे किंवा आहाराबद्दल विनामूल्य सल्ला विचारू शकता."
    },
    {
      q: "नाडी परीक्षण आणि त्वचेचे AI स्कॅन (Skin Scan) कसे करावे?",
      a: "डॅशबोर्डवरील 'Skin AI Scan' किंवा 'Health Assessment' बटनावर क्लिक करा. तुमच्या त्वचेचा किंवा जीभेचा फोटो अपलोड करून काही सेकंदात ९६.४% अचूकतेसह आयुर्वेदिक निदान मिळवा."
    },
    {
      q: "तज्ज्ञ आयुर्वेदिक डॉक्टरांशी थेट सल्लामसलत कशी करावी?",
      a: "आमच्या 'Find Vaidyas & Clinics' किंवा 'Consultation' विभागात जाऊन तुम्ही महाराष्ट्रातील नामांकित BAMS / MD (Ayurveda) तज्ज्ञ डॉक्टरांची अपॉइंटमेंट बुक करू शकता."
    },
    {
      q: "माझा आरोग्य डेटा सुरक्षित आहे का?",
      a: "होय, झेनिव्हा प्लॅटफॉर्म संपूर्णपणे 256-bit HIPAA सुसंगत एन्क्रिप्शन वापरतो. तुमचा वैद्यकीय इतिहास आणि अहवाल फक्त तुमच्या आणि तुमच्या अधिकृत डॉक्टरांच्या परवानगीनेच पाहता येतो."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedTicket = `ZEN-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedTicket);
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        inquiryType: 'Clinical Consultation',
        subject: '',
        message: ''
      });
    }, 900);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 sm:space-y-8 bg-[#FAF7F2] min-h-screen select-none pb-24">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1030] via-[#2D1650] to-[#163628] text-white p-6 sm:p-10 shadow-xl border border-amber-500/20">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 Ayurvedic Clinical & Technical Helpdesk</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Get in Touch with Zeniva AI Care
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            आमच्याशी संपर्क साधा! आयुर्वेदिक निदान, तांत्रिक सहाय्यता, क्लिनिकल भागीदारी किंवा कॉलेज सहयोगासाठी आमची तज्ज्ञ चमू २४ तास आपल्या सेवेत उपलब्ध आहे.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="tel:+919800000000"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-transform hover:scale-105"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Helpline: +91 98000 00000</span>
            </a>
            <a
              href="https://wa.me/919800000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md transition-transform hover:scale-105"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
            <button
              onClick={() => onOpenAIChat('मला झेनिव्हा सहाय्यता व डॉक्टरांशी संपर्क साधायचा आहे.')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-transform hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Instant AI Vaidya</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Direct Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Helpline */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D5] shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1C1917]">Emergency Helpline</h3>
          <p className="text-xs text-[#78716C]">24x7 Ayurvedic clinical assistance</p>
          <div className="pt-1">
            <a href="tel:+919800000000" className="text-xs font-bold text-purple-700 hover:underline block">
              +91 98000 00000
            </a>
            <a href="tel:+917122801234" className="text-[11px] text-stone-500 hover:underline block">
              +91 712 2801234 (Office)
            </a>
          </div>
        </div>

        {/* Card 2: Email */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D5] shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1C1917]">Official Support Email</h3>
          <p className="text-xs text-[#78716C]">Inquiries & technical questions</p>
          <div className="pt-1">
            <a href="mailto:support@zeniva.ai" className="text-xs font-bold text-emerald-700 hover:underline block truncate">
              support@zeniva.ai
            </a>
            <a href="mailto:contact@zeniva.ai" className="text-[11px] text-stone-500 hover:underline block truncate">
              contact@zeniva.ai
            </a>
          </div>
        </div>

        {/* Card 3: Location */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D5] shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1C1917]">AI Research & Clinical Lab</h3>
          <p className="text-xs text-[#78716C]">Dept. of IT, TGPCET</p>
          <p className="text-xs font-medium text-stone-700 pt-1 leading-tight">
            Mohgaon, Wardha Road, Nagpur, Maharashtra 441108
          </p>
        </div>

        {/* Card 4: Timings */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D5] shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1C1917]">Operating Timings</h3>
          <p className="text-xs text-[#78716C]">Consultation availability</p>
          <div className="pt-1 text-xs text-stone-700 space-y-0.5">
            <p className="font-bold text-teal-800">AI Care: 24 Hours / 7 Days</p>
            <p className="text-[11px] text-stone-500">Live Vaidya: 8:00 AM – 8:00 PM</p>
          </div>
        </div>
      </div>

      {/* 3. Main Form & Interactive Locator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Direct Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B3E8C]">
              <MessageSquare className="w-4 h-4" />
              <span>Send Message & Clinical Query</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] mt-1">
              Direct Contact & Support Ticket
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              Fill out the form below. Our clinical and technical support desk will respond within 2 hours.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs space-y-1 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Message Received Successfully! (संदेश प्राप्त झाला)</span>
              </div>
              <p className="text-xs text-emerald-800">
                Your support ticket ID is <strong className="font-mono">{ticketId}</strong>. Our Vaidya & Technical team will reach out to you shortly.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Full Name (पूर्ण नाव) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhupesh Indurkar"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DAC6] focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DAC6] focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Mobile Number (मोबाईल क्रमांक)
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DAC6] focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Inquiry Category (चौकशी प्रकार)
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData(prev => ({ ...prev, inquiryType: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DAC6] focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm font-medium cursor-pointer"
                >
                  <option value="Clinical Consultation">🌿 Patient Clinical Consultation</option>
                  <option value="Doctor Registration">🩺 Doctor Registration & Verification</option>
                  <option value="AI Features & RAG">⚡ Ayurvedic AI Features & RAG</option>
                  <option value="Research Collaboration">🎓 College & Research Collaboration</option>
                  <option value="Technical Support">🛠️ Technical Support & Bug Report</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Subject / Topic
              </label>
              <input
                type="text"
                placeholder="Brief subject of your inquiry"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DAC6] focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Your Message / Health Query (संदेश) *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your health question, feedback, or inquiry in detail..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DAC6] focus:outline-none focus:ring-2 focus:ring-purple-600 text-xs sm:text-sm font-medium resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5B3E8C] to-[#2E1854] hover:from-[#6D49A6] hover:to-[#381D66] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting Query...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message (संदेश पाठवा)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Campus Clinical Lab & FAQs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Location Card with Map Preview */}
          <div className="bg-white p-6 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1917]">Zeniva AI Innovation Center</h3>
                <p className="text-[11px] text-[#78716C]">TGPCET Campus · Nagpur, Maharashtra</p>
              </div>
            </div>

            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#EBE3D5] bg-stone-100">
              <iframe
                title="TGPCET Nagpur Location"
                src="https://maps.google.com/maps?q=Tulsiramji+Gaikwad-Patil+College+of+Engineering+and+Technology+Nagpur&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Department of Information Technology</span>
              <a
                href="https://maps.google.com/?q=Tulsiramji+Gaikwad-Patil+College+of+Engineering+and+Technology+Nagpur"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-purple-700 hover:underline inline-flex items-center gap-1"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick FAQ Accordion */}
          <div className="bg-white p-6 rounded-3xl border border-[#EBE3D5] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E5039]">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked Questions (वारंवार विचारले जाणारे प्रश्न)</span>
            </div>

            <div className="space-y-2 pt-1">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-[#EBE3D5] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full p-3 text-left font-bold text-xs text-[#1C1917] flex items-center justify-between bg-[#FAF7F2] hover:bg-[#F3EED9] transition-colors cursor-pointer"
                    >
                      <span className="pr-2">{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-purple-700 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3 text-xs text-[#57534E] bg-white leading-relaxed border-t border-[#EBE3D5]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
