import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PatientDashboard } from './views/PatientDashboard';
import { DoctorDashboard } from './views/DoctorDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { LoginPortal } from './views/LoginPortal';
import { DoctorRegistrationView } from './views/DoctorRegistrationView';
import { DoctorVerificationStatusView } from './views/DoctorVerificationStatusView';
import { MyProfileView } from './views/MyProfileView';
import { DoshaAnalysisView } from './views/DoshaAnalysisView';
import { SymptomCheckerView } from './views/SymptomCheckerView';
import { ConsultationView } from './views/ConsultationView';
import { HerbalRecommendationsView } from './views/HerbalRecommendationsView';
import { LifestylePlannerView } from './views/LifestylePlannerView';
import { KnowledgeLibraryView } from './views/KnowledgeLibraryView';
import { ReportsHistoryView } from './views/ReportsHistoryView';
import { SettingsView } from './views/SettingsView';
import { WebsiteInsightsView } from './views/WebsiteInsightsView';
import { PublicLandingView } from './views/PublicLandingView';
import { TeamContributorsView } from './views/TeamContributorsView';
import { OpportunitiesView } from './views/OpportunitiesView';
import { ContactUsView } from './views/ContactUsView';
import { PatientAuthModal } from './components/PatientAuthModal';
import { AppointmentModal } from './components/AppointmentModal';
import { QuickScanModal } from './components/QuickScanModal';
import { NotificationPopover } from './components/NotificationPopover';
import { SplashScreen } from './components/SplashScreen';
import { ZenivaLLMWidget } from './components/ZenivaLLMWidget';
import { AyurvedicAIChatModal } from './components/AyurvedicAIChatModal';
import { supabase } from './lib/supabase';
import { Home, Activity, Phone, Sparkles, User, Menu, Stethoscope, Briefcase } from 'lucide-react';

// Helper to inspect URL hash / tab-scoped state
const parseUrlState = () => {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  
  // Secure Admin URL verification: Direct typing of admin in URL requires verified token
  if (hash.startsWith('admin')) {
    const adminToken = sessionStorage.getItem('zeniva_admin_auth_token') || localStorage.getItem('zeniva_admin_auth_token');
    if (adminToken === 'zeniva_master_2027') {
      const parts = hash.split('/');
      return {
        role: 'admin',
        authView: 'authenticated',
        tab: parts[1] || 'admin_dashboard'
      };
    }
    try {
      window.history.replaceState(null, '', '#overview/home');
    } catch (e) {}
    window.location.hash = 'overview/home';
    return {
      role: 'public',
      authView: 'authenticated',
      tab: 'home'
    };
  }

  if (hash.startsWith('doctor')) {
    const parts = hash.split('/');
    const subRoute = parts[1] || 'home';
    if (subRoute === 'register') {
      return { role: 'doctor', authView: 'doctor_registration', tab: 'home' };
    }
    if (subRoute === 'status') {
      return { role: 'doctor', authView: 'doctor_status', tab: 'home' };
    }
    return { role: 'doctor', authView: 'authenticated', tab: subRoute };
  }

  if (hash.startsWith('patient')) {
    const parts = hash.split('/');
    return {
      role: 'patient',
      authView: 'authenticated',
      tab: parts[1] || 'home'
    };
  }

  if (hash.startsWith('overview')) {
    const parts = hash.split('/');
    return {
      role: 'public',
      authView: 'authenticated',
      tab: parts[1] || 'home'
    };
  }

  if (hash === 'login' || hash === 'login/doctor') {
    return {
      role: 'doctor',
      authView: 'login',
      tab: 'home',
      loginRoleTarget: 'doctor'
    };
  }

  if (hash === 'login/patient') {
    return {
      role: 'patient',
      authView: 'authenticated',
      tab: 'home',
      loginRoleTarget: 'patient',
      openAuthModal: true
    };
  }

  if (hash.startsWith('login/')) {
    const parts = hash.split('/');
    if (parts[1] === 'patient') {
      return {
        role: 'patient',
        authView: 'authenticated',
        tab: 'home',
        loginRoleTarget: 'patient',
        openAuthModal: true
      };
    }
    return {
      role: 'doctor',
      authView: 'login',
      tab: 'home',
      loginRoleTarget: 'doctor'
    };
  }

  if (hash === 'insights') {
    return {
      role: 'public',
      authView: 'authenticated',
      tab: 'insights'
    };
  }

  // Default: Zeniva Public Overview Dashboard
  return { role: 'public', authView: 'authenticated', tab: 'home' };
};

export default function App() {
  const initialState = parseUrlState();
  // Show the grand golden Vedic splash screen on initial visit to the Zeniva Overview Dashboard!
  // Patient dashboard, Doctor dashboard, and Admin dashboard do not show splash screen!
  const [showSplash, setShowSplash] = useState(() => {
    return initialState.role === 'public' && initialState.authView === 'authenticated';
  });
  
  const [currentRole, setCurrentRole] = useState(initialState.role);
  const [authView, setAuthView] = useState(initialState.authView);
  const [activeTab, setActiveTab] = useState(initialState.tab);
  const [loginRoleTarget, setLoginRoleTarget] = useState(() => initialState.loginRoleTarget || 'doctor');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isQuickScanOpen, setIsQuickScanOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => !!initialState.openAuthModal);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');

  // Authenticated User State (isolated per role so multi-tabs don't collide)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      if (initialState.role === 'doctor') {
        const savedDoc = localStorage.getItem('zeniva_doctor_user') || localStorage.getItem('zeniva_registered_doctor') || localStorage.getItem('zeniva_current_user');
        if (savedDoc) {
          const parsed = JSON.parse(savedDoc);
          if (parsed && (parsed.role === 'doctor' || parsed.qualification)) return parsed;
        }
      } else if (initialState.role === 'patient') {
        const savedPat = localStorage.getItem('zeniva_patient_user') || localStorage.getItem('zeniva_current_user');
        if (savedPat) {
          const parsed = JSON.parse(savedPat);
          if (parsed && (parsed.role === 'patient' || parsed.name || parsed.email)) {
            return {
              ...parsed,
              role: 'patient',
              isLoggedIn: parsed.isLoggedIn ?? true
            };
          }
        }
      } else if (initialState.role === 'admin') {
        return {
          id: 'usr_admin',
          name: 'Bhupesh Indurkar (Super Admin)',
          phone: '9800000000',
          role: 'admin',
          title: 'Super Administrator'
        };
      }
    } catch (e) {}
    return initialState.role === 'doctor' ? {
      id: 'doc_user',
      name: 'Doctor',
      phone: '',
      role: 'doctor',
      qualification: 'BAMS, MD (Ayurveda)',
      specialization: 'Kayachikitsa & Panchakarma',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
      location: '',
      city: ''
    } : initialState.role === 'admin' ? {
      id: 'usr_admin',
      name: 'Bhupesh Indurkar (Super Admin)',
      phone: '9800000000',
      role: 'admin',
      title: 'Super Administrator'
    } : initialState.role === 'public' ? {
      id: 'guest_visitor',
      name: 'Guest Visitor',
      role: 'public',
      isLoggedIn: false
    } : {
      id: 'usr_patient',
      name: 'Patient',
      phone: '',
      role: 'patient',
      prakriti: 'Stress & Sleep Wellness',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      location: '',
      city: '',
      isLoggedIn: true
    };
  });

  const [doctorTempAuth, setDoctorTempAuth] = useState({
    phone: '',
    email: '',
    name: '',
    qualification: '',
    specialization: ''
  });

  const [registeredDoctorProfile, setRegisteredDoctorProfile] = useState(null);

  // Sync state with URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      if (rawHash.startsWith('admin')) {
        const adminToken = sessionStorage.getItem('zeniva_admin_auth_token') || localStorage.getItem('zeniva_admin_auth_token');
        if (adminToken !== 'zeniva_master_2027') {
          try {
            window.history.replaceState(null, '', '#overview/home');
          } catch (e) {}
          window.location.hash = 'overview/home';
          setCurrentRole('public');
          setAuthView('authenticated');
          setActiveTab('home');
          return;
        }
      }

      const nextState = parseUrlState();
      setCurrentRole(nextState.role);
      setAuthView(nextState.authView);
      setActiveTab(nextState.tab);
      if (nextState.loginRoleTarget) {
        setLoginRoleTarget(nextState.loginRoleTarget);
      }
      if (nextState.openAuthModal) {
        setIsAuthModalOpen(true);
      }
      // Only public dashboard displays splash screen initially
      if (nextState.role !== 'public') {
        setShowSplash(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when activeTab, currentRole, or authView change
  useEffect(() => {
    if (authView === 'login') {
      window.location.hash = 'login/doctor';
    } else if (authView === 'doctor_registration') {
      window.location.hash = 'doctor/register';
    } else if (authView === 'doctor_status') {
      window.location.hash = 'doctor/status';
    } else if (currentRole === 'admin') {
      window.location.hash = `admin/${activeTab || 'admin_dashboard'}`;
    } else if (currentRole === 'doctor') {
      window.location.hash = `doctor/${activeTab}`;
    } else if (currentRole === 'public') {
      window.location.hash = `overview/${activeTab}`;
    } else {
      window.location.hash = `patient/${activeTab}`;
    }
  }, [currentRole, authView, activeTab, loginRoleTarget]);

  // Supabase Auth State & Profile Sync
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // Read local cache to retain custom fields, age, gender, custom avatar, etc.
          let localPat = {};
          try {
            const raw = localStorage.getItem('zeniva_patient_user') || localStorage.getItem('zeniva_current_user');
            if (raw) localPat = JSON.parse(raw);
          } catch (e) {}

          const userRole = profile?.role || localPat.role || currentRole || 'patient';
          const updatedUser = {
            ...localPat,
            id: session.user.id,
            name: profile?.full_name || session.user.user_metadata?.full_name || localPat.name || 'Zeniva Patient',
            email: profile?.email || session.user.email || localPat.email,
            phone: profile?.phone || session.user.user_metadata?.phone || localPat.phone || '',
            role: userRole,
            city: profile?.city || localPat.city || localPat.location || 'Nagpur, Maharashtra',
            location: profile?.city || localPat.location || localPat.city || 'Nagpur, Maharashtra',
            prakriti: profile?.prakriti || localPat.prakriti || 'Stress & Sleep Wellness Profile',
            dosha: profile?.prakriti || localPat.dosha || 'Stress & Sleep Wellness Profile',
            age: profile?.age || localPat.age || 25,
            gender: profile?.gender || localPat.gender || 'Female',
            bloodGroup: profile?.blood_group || localPat.bloodGroup || localPat.blood_group || 'B+',
            blood_group: profile?.blood_group || localPat.blood_group || localPat.bloodGroup || 'B+',
            diet: profile?.diet || localPat.diet || 'Vegan Whole Plant Foods',
            agribalam: profile?.agribalam || localPat.agribalam || 'Madhyama Agni (Moderate Digestion)',
            vikriti: profile?.vikriti || localPat.vikriti || '',
            avatar: localPat.avatar || profile?.avatar_url || session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
            status: profile?.status || localPat.status || 'active',
            isLoggedIn: true,
            isRegistered: true,
            auth_provider: 'supabase'
          };

          setCurrentUser(updatedUser);
          localStorage.setItem('zeniva_current_user', JSON.stringify(updatedUser));
          if (userRole === 'doctor') {
            localStorage.setItem('zeniva_doctor_user', JSON.stringify(updatedUser));
          } else if (userRole === 'patient') {
            localStorage.setItem('zeniva_patient_user', JSON.stringify(updatedUser));
          }
        } catch (e) {
          console.warn('Supabase auth state listener error:', e);
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sync persistent user profile on role change
  useEffect(() => {
    if (currentRole === 'public') {
      setCurrentUser({
        id: 'guest_visitor',
        name: 'Guest Visitor',
        role: 'public',
        isLoggedIn: false
      });
      return;
    }

    let activeIdentifier = '';

    if (currentRole === 'patient') {
      try {
        const savedPat = localStorage.getItem('zeniva_patient_user') || localStorage.getItem('zeniva_current_user');
        if (savedPat) {
          const parsed = JSON.parse(savedPat);
          if (parsed && (parsed.name || parsed.email)) {
            setCurrentUser(prev => ({ ...prev, ...parsed, role: 'patient' }));
            activeIdentifier = parsed.phone || parsed.email || '';
          }
        }
      } catch (e) {}
    } else if (currentRole === 'doctor') {
      try {
        const savedDoc = localStorage.getItem('zeniva_doctor_user') || localStorage.getItem('zeniva_registered_doctor') || localStorage.getItem('zeniva_current_user');
        if (savedDoc) {
          const parsed = JSON.parse(savedDoc);
          if (parsed && (parsed.name || parsed.qualification)) {
            setCurrentUser(prev => ({ ...prev, ...parsed, role: 'doctor' }));
            activeIdentifier = parsed.phone || parsed.email || '';
          }
        }
      } catch (e) {}
    }

    const rawPhone = currentUser?.phone ? currentUser.phone.replace(/\D/g, '') : '';
    const identifier = activeIdentifier || rawPhone || currentUser?.email || '';

    if (!identifier) return;

    const profileUrl = (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
      ? `/api/user/profile/${encodeURIComponent(identifier)}?role=${currentRole}`
      : `http://127.0.0.1:8000/api/user/profile/${encodeURIComponent(identifier)}?role=${currentRole}`;

    fetch(profileUrl)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) return;
        const dbRecord = currentRole === 'doctor' 
          ? (data.doctor || data.user)
          : (data.patient || data.user || data.doctor);

        if (dbRecord) {
          setCurrentUser(prev => {
            const effectiveAvatar = dbRecord.avatar || prev.avatar;
            const cleanName = currentRole === 'patient'
              ? (dbRecord.name || prev.name || 'Patient').replace(/^Dr\.\s*/i, '')
              : (dbRecord.name?.startsWith('Dr.') ? dbRecord.name : `Dr. ${dbRecord.name || prev.name || 'Doctor'}`);

            const merged = {
              ...prev,
              ...dbRecord,
              name: cleanName,
              avatar: effectiveAvatar,
              role: currentRole
            };

            try {
              localStorage.setItem('zeniva_current_user', JSON.stringify(merged));
              if (currentRole === 'doctor') {
                localStorage.setItem('zeniva_doctor_user', JSON.stringify(merged));
                localStorage.setItem('zeniva_registered_doctor', JSON.stringify(merged));
              } else if (currentRole === 'patient') {
                localStorage.setItem('zeniva_patient_user', JSON.stringify(merged));
              }
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(err => {
        // Silent catch for offline or static cloud deployments
      });
  }, [currentRole]);

  const handleUpdateUser = (updated) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('zeniva_current_user', JSON.stringify(updated));
      if (updated.role === 'doctor' || currentRole === 'doctor') {
        localStorage.setItem('zeniva_doctor_user', JSON.stringify(updated));
        localStorage.setItem('zeniva_registered_doctor', JSON.stringify(updated));
      } else if (updated.role === 'patient' || currentRole === 'patient') {
        localStorage.setItem('zeniva_patient_user', JSON.stringify(updated));
      }
    } catch (e) {}
  };

  const handleLoginSuccess = (userData) => {
    const role = userData.role || 'patient';
    if (role === 'admin') {
      try {
        sessionStorage.setItem('zeniva_admin_auth_token', 'zeniva_master_2027');
        localStorage.setItem('zeniva_admin_auth_token', 'zeniva_master_2027');
      } catch (e) {}
    }
    setCurrentRole(role);
    setCurrentUser(userData);
    setAuthView('authenticated');
    setActiveTab(role === 'admin' ? 'admin_dashboard' : 'home');
    try {
      localStorage.setItem('zeniva_current_user', JSON.stringify(userData));
    } catch (e) {}
  };

  const handleDoctorProceedToRegister = (docAuth) => {
    setDoctorTempAuth(docAuth);
    if (docAuth.isRegistered && docAuth.status === 'verified') {
      handleLoginSuccess({
        ...docAuth.user,
        role: 'doctor'
      });
    } else if (docAuth.isRegistered) {
      setRegisteredDoctorProfile(docAuth.user);
      setAuthView('doctor_status');
    } else {
      setAuthView('doctor_registration');
    }
  };

  const handleDoctorRegistrationSubmitted = (profile) => {
    setRegisteredDoctorProfile(profile);
    setAuthView('doctor_status');
  };

  // 1. Doctor Registration Form View (No splash screen)
  if (authView === 'doctor_registration') {
    return (
      <DoctorRegistrationView
        verifiedPhone={doctorTempAuth.phone || doctorTempAuth.email || ''}
        initialName={doctorTempAuth.name || ''}
        initialQualification={doctorTempAuth.qualification || ''}
        initialSpecialization={doctorTempAuth.specialization || ''}
        onRegistrationSubmitted={handleDoctorRegistrationSubmitted}
        onCancel={() => setAuthView('login')}
      />
    );
  }

  // 2. Doctor Verification Status View (Countdown & Secure Access - Uses its own clean verified badge / flash)
  if (authView === 'doctor_status') {
    return (
      <DoctorVerificationStatusView
        doctorProfile={registeredDoctorProfile || {
          id: `ZEN-DOC-${Math.floor(100000 + Math.random() * 900000)}`,
          name: doctorTempAuth.name || 'Dr. Vaidya',
          phone: doctorTempAuth.phone || doctorTempAuth.email || '',
          qualification: doctorTempAuth.qualification || 'BAMS, MD (Ayurveda)',
          organization: '',
          council_reg_number: '',
          council_name: 'Maharashtra Council of Indian Medicine (MCIM)',
          status: 'pending_verification',
          avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400'
        }}
        onOpenDoctorDashboard={(docData) => {
          const doc = docData || registeredDoctorProfile || {};
          handleLoginSuccess({
            role: 'doctor',
            id: doc.id || `ZEN-DOC-${Math.floor(100000 + Math.random() * 900000)}`,
            doctor_id: doc.doctor_id || doc.id || `ZEN-DOC-${Math.floor(100000 + Math.random() * 900000)}`,
            name: doc.name || doctorTempAuth.name || 'Doctor',
            phone: doc.phone || doctorTempAuth.phone || '',
            councilId: doc.council_reg_number || doc.councilId || '',
            council_reg_number: doc.council_reg_number || '',
            qualification: doc.qualification || doctorTempAuth.qualification || 'BAMS, MD (Ayurveda)',
            specialization: doc.specialization || doctorTempAuth.specialization || 'Kayachikitsa & Panchakarma',
            organization: doc.organization || '',
            city: doc.city || '',
            avatar: doc.avatar || currentUser.avatar,
            status: 'verified'
          });
        }}
        onReuploadDocuments={() => {
          setAuthView('doctor_registration');
        }}
        onAdminAuthenticated={() => {
          setCurrentRole('admin');
          setActiveTab('admin_doctor_verification');
          setAuthView('authenticated');
        }}
        onLogout={() => {
          setAuthView('login');
        }}
      />
    );
  }

  // 3. Login Portal View (No splash screen)
  if (authView === 'login') {
    return (
      <LoginPortal
        defaultRole={loginRoleTarget}
        onLoginSuccess={handleLoginSuccess}
        onDoctorProceedToRegister={handleDoctorProceedToRegister}
        onBackToDashboard={() => {
          setAuthView('authenticated');
        }}
      />
    );
  }

  // 4. Main Authenticated Application
  return (
    <div className="flex h-screen bg-[#ECE6DD] text-[#1C1917] font-sans antialiased overflow-hidden">
      
      {/* Dynamic Role-Based Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        currentRole={currentRole}
        activeTab={activeTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          setIsMobileMenuOpen(false);
        }}
        onOpenProfile={() => {
          setActiveTab('profile');
          setIsMobileMenuOpen(false);
        }}
        onOpenSettings={() => {
          setActiveTab('settings');
          setIsMobileMenuOpen(false);
        }}
        onOpenConsultation={() => {
          setActiveTab('consultation');
          setIsMobileMenuOpen(false);
        }}
        onOpenQuickScan={() => {
          setIsQuickScanOpen(true);
          setIsMobileMenuOpen(false);
        }}
        onOpenAuth={() => {
          setIsAuthModalOpen(true);
          setIsMobileMenuOpen(false);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Dynamic Header (rendered for public, patient & admin; doctor dashboard has its own dedicated header) */}
        {currentRole !== 'doctor' && (
          <Header
            currentRole={currentRole}
            activeTab={activeTab}
            currentUser={currentUser}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onOpenQuickScan={() => setIsQuickScanOpen(true)}
            onSelectRole={(role) => {
              setCurrentRole(role);
              setActiveTab('home');
            }}
            onOpenLogin={(role) => {
              if (role === 'patient') {
                setIsAuthModalOpen(true);
              } else {
                setLoginRoleTarget(role || 'doctor');
                setAuthView('login');
              }
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={() => {
              try {
                sessionStorage.removeItem('zeniva_admin_auth_token');
                localStorage.removeItem('zeniva_admin_auth_token');
                localStorage.removeItem('zeniva_patient_user');
                localStorage.removeItem('zeniva_current_user');
              } catch (e) {}
              setCurrentRole('public');
              setCurrentUser({
                id: 'guest_visitor',
                name: 'Guest Visitor',
                role: 'public',
                isLoggedIn: false
              });
              setAuthView('authenticated');
              setActiveTab('home');
              window.location.hash = 'overview/home';
            }}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            unreadCount={currentRole === 'admin' ? 5 : 2}
          />
        )}

        {/* Views Router */}
        <main className="flex-1">
          {currentRole === 'public' ? (
            activeTab === 'insights' ? (
              <WebsiteInsightsView
                currentUser={currentUser}
                onSelectTab={(tabId) => setActiveTab(tabId)}
              />
            ) : activeTab === 'opportunities' ? (
              <OpportunitiesView
                userProfile={currentUser}
                currentRole={currentRole}
              />
            ) : activeTab === 'consultation' ? (
              <ConsultationView
                onSelectTab={(tabId) => setActiveTab(tabId)}
              />
            ) : activeTab === 'library' ? (
              <KnowledgeLibraryView
                currentUser={currentUser}
                onSelectTab={(tabId) => setActiveTab(tabId)}
              />
            ) : activeTab === 'team' ? (
              <TeamContributorsView
                onBackToOverview={() => setActiveTab('home')}
              />
            ) : activeTab === 'contact' ? (
              <ContactUsView
                onSelectTab={(tabId) => setActiveTab(tabId)}
                onOpenAIChat={(prompt) => {
                  setChatInitialPrompt(prompt || '');
                  setIsAIChatOpen(true);
                }}
              />
            ) : (
              <PublicLandingView
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onOpenAIChat={(prompt) => {
                  setChatInitialPrompt(prompt || '');
                  setIsAIChatOpen(true);
                }}
                onSelectDoctorPortal={() => {
                  setLoginRoleTarget('doctor');
                  setAuthView('login');
                }}
                onOpenTeam={() => setActiveTab('team')}
                onOpenContact={() => setActiveTab('contact')}
                onSelectTab={(tabId) => setActiveTab(tabId)}
              />
            )
          ) : activeTab === 'insights' || activeTab === 'doc_insights' ? (
            <WebsiteInsightsView
              currentUser={currentUser}
              onSelectTab={(tabId) => {
                setActiveTab(tabId);
              }}
            />
          ) : currentRole === 'doctor' ? (
            <DoctorDashboard
              activeTab={activeTab}
              currentUser={currentUser}
              onSelectTab={(tabId) => {
                setActiveTab(tabId);
              }}
              onAddPrescription={() => setIsAppointmentOpen(true)}
              onOpenPhotoReview={() => setIsAppointmentOpen(true)}
              onViewSchedule={() => setIsAppointmentOpen(true)}
              onUpdateUser={handleUpdateUser}
              onOpenLogin={(role) => {
                setLoginRoleTarget(role || 'doctor');
                setAuthView('login');
              }}
              onLogout={() => {
                setLoginRoleTarget('doctor');
                setAuthView('login');
              }}
            />
          ) : currentRole === 'admin' ? (
            <AdminDashboard
              activeTab={activeTab}
              currentUser={currentUser}
              onSelectTab={(tabId) => {
                setActiveTab(tabId);
              }}
              onOpenQuickScan={() => setIsQuickScanOpen(true)}
              onScheduleAppointment={() => setIsAppointmentOpen(true)}
              onLockAdmin={() => {
                try {
                  sessionStorage.removeItem('zeniva_admin_auth_token');
                  localStorage.removeItem('zeniva_admin_auth_token');
                } catch (e) {}
                setCurrentRole('public');
                setAuthView('authenticated');
                setActiveTab('home');
                window.location.hash = 'overview/home';
              }}
            />
          ) : (
            /* Patient Direct Real-Data Pages */
            <>
              {activeTab === 'home' && (
                <PatientDashboard
                  currentUser={currentUser}
                  isSplashFinished={true}
                  onOpenQuickScan={() => setIsQuickScanOpen(true)}
                  onUpdateUser={handleUpdateUser}
                  onSelectTab={(tabId) => {
                    setActiveTab(tabId);
                  }}
                  onOpenAIChat={(prompt) => {
                    setChatInitialPrompt(prompt || '');
                    setIsAIChatOpen(true);
                  }}
                />
              )}

              {activeTab === 'profile' && (
                <MyProfileView
                  currentUser={currentUser}
                  onUpdateUser={handleUpdateUser}
                />
              )}

              {activeTab === 'dosha' && (
                <DoshaAnalysisView
                  onSelectTab={(tabId) => {
                    setActiveTab(tabId);
                  }}
                />
              )}

              {activeTab === 'symptoms' && (
                <SymptomCheckerView
                  onSelectTab={(tabId) => {
                    setActiveTab(tabId);
                  }}
                />
              )}

              {activeTab === 'opportunities' && (
                <OpportunitiesView
                  userProfile={currentUser}
                  currentRole={currentRole}
                />
              )}

              {activeTab === 'consultation' && (
                <ConsultationView
                  onSelectTab={(tabId) => {
                    setActiveTab(tabId);
                  }}
                />
              )}

              {activeTab === 'herbs' && (
                <HerbalRecommendationsView
                  onSelectTab={(tabId) => {
                    setActiveTab(tabId);
                  }}
                />
              )}

              {activeTab === 'planner' && (
                <LifestylePlannerView
                  currentUser={currentUser}
                  onSelectTab={(tabId) => {
                    setActiveTab(tabId);
                  }}
                />
              )}

              {activeTab === 'library' && (
                <KnowledgeLibraryView
                  currentUser={currentUser}
                  onSelectTab={(tabId) => {
                    setActiveTab(tabId);
                  }}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsHistoryView
                  currentUser={currentUser}
                  onSelectTab={(tabId) => {
                    setActiveTab(tabId);
                  }}
                />
              )}

              {activeTab === 'insights' && (
                <WebsiteInsightsView
                  currentUser={currentUser}
                  onSelectTab={(tabId) => {
                    setActiveTab(tabId);
                  }}
                />
              )}

              {activeTab === 'contact' && (
                <ContactUsView
                  onSelectTab={(tabId) => setActiveTab(tabId)}
                  onOpenAIChat={(prompt) => {
                    setChatInitialPrompt(prompt || '');
                    setIsAIChatOpen(true);
                  }}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  currentUser={currentUser}
                  onUpdateUser={handleUpdateUser}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Popovers & Modals */}
      <NotificationPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        currentRole={currentRole}
        onOpenConsultation={() => setActiveTab('consultation')}
        onOpenAIChat={() => setActiveTab('library')}
      />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        onBookSuccess={() => {
          setIsAppointmentOpen(false);
        }}
      />

      <QuickScanModal
        isOpen={isQuickScanOpen}
        onClose={() => setIsQuickScanOpen(false)}
        patientName={currentUser?.name || 'Aarav Patil'}
      />

      {/* Direct Instant Patient Auth Modal (Create Account & Fast Login) */}
      <PatientAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(userData) => {
          handleLoginSuccess(userData);
          setIsAuthModalOpen(false);
        }}
      />

      {showSplash && currentRole === 'public' && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Global Floating Vertical "KHADA WALA" ZENIVA LLM Assistant for Patient Portal & Public */}
      {(currentRole === 'patient' || currentRole === 'public') && authView === 'authenticated' && !showSplash && (
        <ZenivaLLMWidget
          onClick={() => {
            setChatInitialPrompt('');
            setIsAIChatOpen(true);
          }}
          currentUser={currentUser}
        />
      )}

      {/* Global Ayurvedic AI RAG Chat Dialog Modal */}
      <AyurvedicAIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        currentUser={currentUser}
        initialQuery={chatInitialPrompt}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Modern Floating Mobile Bottom Navigation Bar (Patient & Public) */}
      {(currentRole === 'patient' || currentRole === 'public') && authView === 'authenticated' && !showSplash && (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#160B28]/95 backdrop-blur-lg border-t border-[#311E54] py-1.5 px-3 flex items-center justify-around z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-amber-300 font-bold' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px]">Home</span>
          </button>

          {currentRole === 'public' ? (
            <>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'opportunities' ? 'text-amber-300 font-bold' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="text-[10px]">Opportunities</span>
              </button>

              <button
                onClick={() => {
                  setChatInitialPrompt('');
                  setIsAIChatOpen(true);
                }}
                className="flex flex-col items-center justify-center -mt-5 w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)] border-2 border-cyan-300 cursor-pointer transition-transform hover:scale-110"
                title="Open AI Vaidya Chat"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'contact' ? 'text-amber-300 font-bold' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span className="text-[10px]">Contact</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <Menu className="w-4 h-4" />
                <span className="text-[10px]">Menu</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('dosha')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'dosha' ? 'text-amber-300 font-bold' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span className="text-[10px]">Assessment</span>
              </button>

              <button
                onClick={() => {
                  setChatInitialPrompt('');
                  setIsAIChatOpen(true);
                }}
                className="flex flex-col items-center justify-center -mt-5 w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] border-2 border-amber-300 cursor-pointer transition-transform hover:scale-110"
                title="Open AI Vaidya Chat"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'profile' ? 'text-amber-300 font-bold' : 'text-stone-300 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-[10px]">Profile</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <Menu className="w-4 h-4" />
                <span className="text-[10px]">Menu</span>
              </button>
            </>
          )}
        </nav>
      )}
    </div>
  );
}
