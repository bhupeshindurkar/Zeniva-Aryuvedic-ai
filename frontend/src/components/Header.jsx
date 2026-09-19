import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, ChevronDown, Check, Scan, LogOut,
  User, Stethoscope, Shield, ShieldCheck, KeyRound, Sun, Moon, Sunset, Sunrise
} from 'lucide-react';

export const Header = ({
  currentRole,
  currentUser = {},
  onSwitchRole,
  onOpenQuickScan,
  onOpenLogin,
  onOpenAdmin,
  onOpenNotifications,
  onOpenAuth = () => {},
  onLogout = () => {},
  unreadCount = 2
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeGreeting, setTimeGreeting] = useState('Good Day');
  const [greetingIcon, setGreetingIcon] = useState('☀️');

  // Dynamic Clock-based Greeting Calculation
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 12) {
        setTimeGreeting('Good Morning');
        setGreetingIcon('🌅');
      } else if (hour >= 12 && hour < 17) {
        setTimeGreeting('Good Afternoon');
        setGreetingIcon('☀️');
      } else if (hour >= 17 && hour < 21) {
        setTimeGreeting('Good Evening');
        setGreetingIcon('🌇');
      } else {
        setTimeGreeting('Good Night');
        setGreetingIcon('🌙');
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const getProfileInfo = () => {
    const defaultPatientAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
    const defaultDoctorAvatar = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150';
    const defaultAdminAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';

    switch (currentRole) {
      case 'public':
        return {
          greeting: `Welcome to Zeniva AI 🌿`,
          subtitle: 'Ancient Ayurveda meets Cutting-edge AI Care',
          name: 'Guest Visitor',
          roleTitle: 'Public Overview',
          avatar: null,
          showSearch: false
        };
      case 'patient':
        const cleanPatientName = (currentUser?.name && currentUser.name !== 'Guest Visitor' ? currentUser.name : 'Patient').replace(/^Dr\.\s*/i, '');
        return {
          greeting: `${timeGreeting}, ${cleanPatientName} ${greetingIcon}`,
          subtitle: 'Welcome back to Zeniva AI Care',
          name: cleanPatientName,
          roleTitle: 'Patient',
          avatar: currentUser.avatar || null,
          showSearch: false
        };
      case 'doctor':
        return {
          greeting: `${timeGreeting}, ${currentUser.name || 'Dr. Bhupesh Indurkar'} ${greetingIcon}`,
          subtitle: "Here's what's happening in your practice today.",
          name: currentUser.name || 'Dr. Bhupesh Indurkar',
          roleTitle: 'Ayurvedic Physician',
          avatar: currentUser.avatar || defaultDoctorAvatar,
          showSearch: true
        };
      case 'admin':
        return {
          greeting: `${timeGreeting}, Super Admin ${greetingIcon}`,
          subtitle: "Master Clinical Authority & System Control",
          name: 'Super Admin',
          roleTitle: 'Master Authority',
          avatar: null,
          isAdminIcon: true,
          showSearch: true
        };
      default:
        return {
          greeting: `Welcome to Zeniva AI 🌿`,
          subtitle: 'Ancient Ayurveda meets Cutting-edge AI Care',
          name: 'Guest Visitor',
          roleTitle: 'Public Overview',
          avatar: null,
          showSearch: false
        };
    }
  };

  const profile = getProfileInfo();

  return (
    <header className="px-5 sm:px-8 py-4 flex items-center justify-between border-b border-[#D8D1C3] bg-[#F4EFE7] sticky top-0 z-30 select-none shadow-2xs">
      {/* Dynamic Clock Greeting on Left */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] tracking-tight flex items-center gap-2">
          {profile.greeting}
        </h2>
        <p className="text-xs text-[#78716C] mt-0.5">{profile.subtitle}</p>
      </div>

      {/* Center Search Bar for Doctor / Admin */}
      {profile.showSearch && (
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={currentRole === 'doctor' ? "Search patients, appointments..." : "Search patients, doctors, appointments..."}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-full border border-[#EBE3D5] focus:outline-none focus:ring-2 focus:ring-purple-600/30 shadow-xs"
            />
          </div>
        </div>
      )}

      {/* Right Action Items */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* PUBLIC MODE: CLEAR DOCTOR & PATIENT LOGIN / SIGN UP */}
        {currentRole === 'public' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onSwitchRole) onSwitchRole('doctor');
                else onOpenLogin('doctor');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-purple-300 bg-white hover:bg-purple-50 text-purple-900 text-xs font-bold transition-all cursor-pointer shadow-xs hover:scale-105"
            >
              <Stethoscope className="w-3.5 h-3.5 text-purple-700" />
              <span>Doctor Login</span>
            </button>

            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer border border-emerald-300"
            >
              <User className="w-3.5 h-3.5 text-emerald-200" />
              <span>Patient Login / Sign Up</span>
            </button>
          </div>
        ) : (
          /* AUTHENTICATED ROLES: PATIENT / DOCTOR / ADMIN */
          <>
            {/* Dedicated Skin AI Diagnostic Scan Button */}
            <button
              onClick={onOpenQuickScan}
              title="Ayurvedic AI Skin Diagnostic Scanner (त्वक् परीक्षा)"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border border-purple-300/80 bg-purple-50/50 hover:bg-purple-100/70 text-purple-950 text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden xs:inline font-bold">Skin AI Scan</span>
            </button>

            {/* Responsive Notification Bell Button */}
            <button 
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full hover:bg-stone-200/60 text-[#57534E] transition-colors focus:outline-none cursor-pointer"
              title="Notifications & Clinical Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#9333EA] rounded-full ring-2 ring-[#FAF7F2]"></span>
              )}
            </button>

            {/* User Profile Pill */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white/80 hover:bg-white border border-[#EBE3D5] shadow-xs transition-all cursor-pointer"
              >
                {currentRole === 'admin' ? (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1C1030] text-[#E5C07B] flex items-center justify-center shrink-0 shadow-xs border border-amber-400/40">
                    <ShieldCheck className="w-4 h-4 text-[#E5C07B]" />
                  </div>
                ) : profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#D6CBB8]"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1E5039] text-white flex items-center justify-center font-bold text-xs border border-emerald-300 shadow-xs">
                    {(profile.name || 'P').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-[#1C1917] leading-tight">{profile.name}</p>
                  <p className="text-[10px] text-[#78716C] leading-none mt-0.5">{profile.roleTitle}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#78716C]" />
              </button>

              {/* Clean User & Role Login Dropdown with Strict Role Separation */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-[#EBE3D5] py-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-1.5 border-b border-[#F5EFEB] mb-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">Account & Profile</p>
                  </div>
                  
                  <div className="space-y-1 px-1.5">
                    {/* Patient Mode: Strictly Patient Card & Log Out */}
                    {currentRole === 'patient' ? (
                      <>
                        <div className="px-3.5 py-2.5 rounded-2xl bg-[#EDF0E6] flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <User className="w-4 h-4 text-[#1E5039]" />
                            <div className="min-w-0">
                              <p className="font-bold text-[#1C1917] text-xs truncate">{profile.name}</p>
                              <p className="text-[10px] font-semibold text-[#1E5039]">✓ Patient Portal Active</p>
                            </div>
                          </div>
                          <Check className="w-3.5 h-3.5 text-[#1E5039] shrink-0" />
                        </div>

                        {/* Direct Log Out Button for Patient */}
                        <div className="pt-1 mt-1 border-t border-stone-100">
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-rose-600" />
                            <span>Log Out (लॉग आउट)</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Doctor View */}
                        <div className="px-3.5 py-2.5 rounded-2xl bg-[#F3EFF9] flex items-center justify-between text-xs text-[#5B3E8C] font-bold">
                          <div className="flex items-center gap-2.5">
                            <Stethoscope className="w-4 h-4 text-[#5B3E8C]" />
                            <div>
                              <p className="font-bold text-[#1C1917]">{profile.name}</p>
                              <p className="text-[10px] text-[#78716C]">Practicing Vaidya Dashboard</p>
                            </div>
                          </div>
                          <Check className="w-3.5 h-3.5 text-[#5B3E8C]" />
                        </div>

                        {/* Sign Out to Public Overview */}
                        <div className="pt-1 mt-1 border-t border-stone-100">
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-rose-600" />
                            <span>Log Out (Exit to Overview)</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </header>
  );
};
