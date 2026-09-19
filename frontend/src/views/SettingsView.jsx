import React, { useState, useEffect } from 'react';
import { 
  Settings, Bell, Globe, Shield, Moon, Check, 
  Smartphone, Volume2, Save, Lock, User, Heart, 
  Utensils, Sparkles, Download, Trash2, Sun, Eye
} from 'lucide-react';

export const SettingsView = ({ currentUser = {}, onUpdateUser = () => {} }) => {
  // Settings Form State
  const [profileName, setProfileName] = useState(currentUser.name || 'Aarav Patil');
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '9876543210');
  const [profileLocation, setProfileLocation] = useState(currentUser.location || 'Mumbai, Maharashtra');
  const [dietChoice, setDietChoice] = useState(currentUser.diet || 'Satvik Vegetarian (Low Spices)');
  const [language, setLanguage] = useState('en');
  
  // Alarms & Notifications
  const [brahmaMuhurtaAlarm, setBrahmaMuhurtaAlarm] = useState(true);
  const [ushapanAlert, setUshapanAlert] = useState(true);
  const [abhyangaAlert, setAbhyangaAlert] = useState(true);
  const [consultationAlerts, setConsultationAlerts] = useState(true);
  const [sanskritShlokasVisible, setSanskritShlokasVisible] = useState(true);
  const [smsDeliveryEnabled, setSmsDeliveryEnabled] = useState(true);
  
  // Security
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser.name) setProfileName(currentUser.name);
    if (currentUser.phone) setProfilePhone(currentUser.phone);
    if (currentUser.location) setProfileLocation(currentUser.location);
  }, [currentUser]);

  const handleSave = (e) => {
    e?.preventDefault();
    onUpdateUser({
      ...currentUser,
      name: profileName,
      phone: profilePhone.replace(/\D/g, '').slice(-10),
      location: profileLocation,
      diet: dietChoice
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto space-y-6 bg-[#FAF7F2] min-h-screen select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE3D5] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B3E8C]">
            <Settings className="w-4 h-4" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917] mt-1">
            Application Settings & Preferences (विन्यास)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Manage your personal biometrics, daily Dinacharya alarms, language, and clinical notifications
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-full bg-[#1E5039] hover:bg-[#163E2C] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save All Settings</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-green-100 text-green-900 text-xs font-bold flex items-center gap-2 border border-green-200 animate-in fade-in">
          <Check className="w-4 h-4 text-green-700 shrink-0" />
          <span>Application settings and user profile successfully updated across all pages!</span>
        </div>
      )}

      {/* 6 Rich Modular Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 6 Columns: Profile Biometrics & Diet Preferences */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 1. Profile & Real Contact Details */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">User Identity & Mobile Authentication</h3>
                <p className="text-[10px] text-stone-500">Syncs directly with your top header and health records</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-purple-600/30"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">10-Digit Mobile Number</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-stone-100 border border-r-0 border-stone-300 rounded-l-xl font-bold text-stone-600">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 rounded-r-xl border border-stone-300 bg-white font-mono font-bold tracking-wider focus:ring-2 focus:ring-purple-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">City & State</label>
                <input
                  type="text"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium focus:ring-2 focus:ring-purple-600/30"
                />
              </div>
            </div>
          </div>

          {/* 2. Ahara (Diet) & Ayurvedic Pathya Rules */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Ahara (Dietary) & Agni Regimen</h3>
                <p className="text-[10px] text-stone-500">Customizes food recommendations and seasonal charts</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Dietary Preference</label>
                <select
                  value={dietChoice}
                  onChange={(e) => setDietChoice(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                >
                  <option>Satvik Vegetarian (Low Spices & Fresh Ghee)</option>
                  <option>Rajasik (Moderate Spices, Onions & Garlic)</option>
                  <option>Vegan Whole Plant Foods</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <strong>Varsha Ritu Rule:</strong> Boiled warm water with dry ginger (Shunthi) is automatically highlighted to kindle your digestive Agni.
              </div>
            </div>
          </div>

        </div>

        {/* Right 6 Columns: Alarms, Language, and Security */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 3. Dinacharya Daily Alarms & Reminders */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Dinacharya & Consultation Alarms</h3>
                <p className="text-[10px] text-stone-500">Real-time daily Vedic clock reminders</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-purple-50/40 border border-stone-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-bold text-stone-900">Brahma Muhurta Wakeup Alert (05:30 AM)</p>
                  <p className="text-[10px] text-stone-500">Gentle sound chime for peaceful morning awakening</p>
                </div>
                <input
                  type="checkbox"
                  checked={brahmaMuhurtaAlarm}
                  onChange={(e) => setBrahmaMuhurtaAlarm(e.target.checked)}
                  className="w-4 h-4 text-purple-700 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-purple-50/40 border border-stone-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-bold text-stone-900">Ushapan Warm Water & Lemon Reminder</p>
                  <p className="text-[10px] text-stone-500">Morning Agni stimulation alert (06:30 AM)</p>
                </div>
                <input
                  type="checkbox"
                  checked={ushapanAlert}
                  onChange={(e) => setUshapanAlert(e.target.checked)}
                  className="w-4 h-4 text-purple-700 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-purple-50/40 border border-stone-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-bold text-stone-900">Doctor Consultation SMS & WhatsApp Alerts</p>
                  <p className="text-[10px] text-stone-500">Alerts 30 mins before scheduled video consultation</p>
                </div>
                <input
                  type="checkbox"
                  checked={consultationAlerts}
                  onChange={(e) => setConsultationAlerts(e.target.checked)}
                  className="w-4 h-4 text-purple-700 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 4. Language & Sanskrit Treatise Display */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Language & Shloka Glossaries</h3>
                <p className="text-[10px] text-stone-500">Bilingual Ayurvedic terminology preferences</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Platform Display Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
                >
                  <option value="en">English (with Classical Sanskrit Terms)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="sa">संस्कृतम् (Sanskrit Brihat Trayi)</option>
                </select>
              </div>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer">
                <div>
                  <p className="font-bold text-stone-900">Show Original Sanskrit Shlokas</p>
                  <p className="text-[10px] text-stone-500">Display verses alongside English interpretations</p>
                </div>
                <input
                  type="checkbox"
                  checked={sanskritShlokasVisible}
                  onChange={(e) => setSanskritShlokasVisible(e.target.checked)}
                  className="w-4 h-4 text-purple-700 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 5. Security & Data Protection */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Security & Privacy Governance</h3>
                <p className="text-[10px] text-stone-500">End-to-end encrypted health records</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs">
              <div>
                <p className="font-bold text-stone-900">Encrypted Session Protection</p>
                <p className="text-[10px] text-stone-500">Hardware-level session token security</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="w-4 h-4 text-purple-700 rounded cursor-pointer"
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
