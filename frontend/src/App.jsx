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
import { PatientAuthModal } from './components/PatientAuthModal';
import { AppointmentModal } from './components/AppointmentModal';
import { QuickScanModal } from './components/QuickScanModal';
import { NotificationPopover } from './components/NotificationPopover';
import { SplashScreen } from './components/SplashScreen';
import { ZenivaLLMWidget } from './components/ZenivaLLMWidget';
import { AyurvedicAIChatModal } from './components/AyurvedicAIChatModal';
import { supabase } from './lib/supabase';

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
        const savedDoc = localStorage.getItem('zeniva_doctor_user') || localStorage.getItem('zeniva_registered_doctor');
        if (savedDoc) {
          const parsed = JSON.parse(savedDoc);
          if (parsed && (parsed.role === 'doctor' || parsed.qualification)) return parsed;
        }
      } else if (initialState.role === 'patient') {
        const savedPat = localStorage.getItem('zeniva_patient_user');
        if (savedPat) {
          const parsed = JSON.parse(savedPat);
          if (parsed && parsed.role === 'patient') return parsed;
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
    // 1. Listen to Supabase Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const userRole = profile.role || currentRole;
            const updatedUser = {
              id: profile.id,
              name: profile.full_name || session.user.user_metadata?.full_name || 'Zeniva User',
              email: profile.email || session.user.email,
              phone: profile.phone || '',
              role: userRole,
              city: profile.city || 'India',
              prakriti: profile.prakriti || 'Stress & Sleep Wellness',
              dosha: profile.prakriti || 'Stress & Sleep Wellness',
              avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
              status: profile.status || 'active',
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
          if (parsed && parsed.name) {
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
          if (parsed && parsed.name) {
            setCurrentUser(prev => ({ ...prev, ...parsed, role: 'doctor' }));
            activeIdentifier = parsed.phone || parsed.email || '';
          }
        }
      } catch (e) {}
    }

    const rawPhone = currentUser?.phone ? currentUser.phone.replace(/\D/g, '') : '';
    const identifier = activeIdentifier || rawPhone || currentUser?.email || '';

    if (!identifier) return;

    fetch(`http://127.0.0.1:8000/api/user/profile/${encodeURIComponent(identifier)}?role=${currentRole}`)
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
              ? (dbRecord.name || prev.name || 'Bhupesh Indurkar').replace(/^Dr\.\s*/i, '')
              : (dbRecord.name?.startsWith('Dr.') ? dbRecord.name : `Dr. ${dbRecord.name || prev.name || 'Bhupesh Indurkar'}`);

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
      .catch(err => console.warn("Database profile sync notice:", err));
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
      
      {/* Dynamic Role-Based Sidebar */}
      <Sidebar
        currentRole={currentRole}
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
        }}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenConsultation={() => setActiveTab('consultation')}
        onOpenQuickScan={() => setIsQuickScanOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Dynamic Header (rendered for public, patient & admin; doctor dashboard has its own dedicated header) */}
        {currentRole !== 'doctor' && (
          <Header
            currentRole={currentRole}
            activeTab={activeTab}
            currentUser={currentUser}
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
    </div>
  );
}
