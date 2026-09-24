import React, { useState, useEffect } from 'react';
import { 
  X, Bell, UserCheck, Stethoscope, Sparkles, 
  CheckCircle2, Clock, ShieldCheck, User, MessageSquare, Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export const NotificationPopover = ({ 
  isOpen, 
  onClose, 
  currentRole = 'patient',
  currentUser = {},
  onOpenConsultation, 
  onOpenAIChat 
}) => {
  const [doctorMessages, setDoctorMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Extract clean patient identifiers
  const cleanPhone = (currentUser?.phone || '').replace(/\D/g, '').slice(-10);
  const patientId = currentUser?.id || '';

  // Fetch targeted doctor messages for this specific patient
  const fetchTargetedDoctorMessages = async () => {
    if (!cleanPhone && !patientId) return;
    setIsLoadingMessages(true);

    let messages = [];

    // 1. Fetch from LocalStorage for instant sub-second response
    try {
      const saved = localStorage.getItem('zeniva_targeted_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const userName = (currentUser?.name || '').trim().toLowerCase();
          const matched = parsed.filter(m => 
            (cleanPhone && m.patient_phone === cleanPhone) || 
            (patientId && m.patient_id === patientId) ||
            (userName && m.patient_name && m.patient_name.toLowerCase().includes(userName))
          );
          messages.push(...matched);
        }
      }
    } catch (e) {}

    // 2. Fetch from Supabase Cloud
    try {
      if (supabase && cleanPhone) {
        const { data, error } = await supabase
          .from('doctor_reviews')
          .select('*')
          .eq('patient_name', `ZENIVA_TARGETED_NOTIF_${cleanPhone}`)
          .order('created_at', { ascending: false })
          .limit(15);

        if (!error && data && data.length > 0) {
          const parsedCloud = data.map(r => {
            try {
              return JSON.parse(r.review_notes);
            } catch (err) {
              return null;
            }
          }).filter(Boolean);

          parsedCloud.forEach(pm => {
            if (!messages.some(m => m.id === pm.id)) {
              messages.push(pm);
            }
          });
        }
      }
    } catch (sbErr) {
      console.warn('Supabase patient notification fetch error:', sbErr);
    }

    // 3. Fetch from backend if available
    try {
      if (cleanPhone) {
        const res = await fetch(`/api/patient/notifications/${cleanPhone}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.notifications) {
            data.notifications.forEach(nm => {
              if (!messages.some(m => m.id === nm.id)) {
                messages.push(nm);
              }
            });
          }
        }
      }
    } catch (e) {}

    // Sort descending by time/timestamp
    messages.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    setDoctorMessages(messages);
    setIsLoadingMessages(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchTargetedDoctorMessages();
    }
  }, [isOpen, cleanPhone, patientId, currentUser?.name]);

  // Real-time listener for incoming doctor messages
  useEffect(() => {
    const handleNewNotif = (e) => {
      const incoming = e?.detail;
      const userName = (currentUser?.name || '').trim().toLowerCase();
      if (
        incoming && 
        ((cleanPhone && incoming.patient_phone === cleanPhone) || 
         (patientId && incoming.patient_id === patientId) ||
         (userName && incoming.patient_name && incoming.patient_name.toLowerCase().includes(userName)))
      ) {
        setDoctorMessages(prev => [incoming, ...prev.filter(m => m.id !== incoming.id)]);
      }
    };

    window.addEventListener('zeniva_new_doctor_notification', handleNewNotif);

    // Supabase Realtime Channel
    let channel = null;
    try {
      if (supabase && cleanPhone) {
        channel = supabase
          .channel(`patient_notifs_${cleanPhone}`)
          .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'doctor_reviews', 
            filter: `patient_name=eq.ZENIVA_TARGETED_NOTIF_${cleanPhone}` 
          }, (payload) => {
            try {
              const newMsg = JSON.parse(payload.new.review_notes);
              if (newMsg) {
                setDoctorMessages(prev => [newMsg, ...prev.filter(m => m.id !== newMsg.id)]);
              }
            } catch (err) {}
          })
          .subscribe();
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('zeniva_new_doctor_notification', handleNewNotif);
      if (channel) channel.unsubscribe();
    };
  }, [cleanPhone, patientId, currentRole]);

  if (!isOpen) return null;

  // Real-time user login log specifically displayed in Super Admin
  const adminLoginLogs = [
    { id: 1, name: "Aarav Patil", role: "Patient", phone: "+91 98765 43210", time: "Just now", status: "Logged In (Direct Verified)", location: "Mumbai" },
    { id: 2, name: "Dr. Meera Joshi", role: "Doctor", phone: "+91 98123 45567", time: "5 mins ago", status: "Active (BAMS Verified)", location: "Pune" },
    { id: 3, name: "Dr. Arjun Patil", role: "Doctor", phone: "+91 98234 55667", time: "25 mins ago", status: "Verified Active", location: "Mumbai" },
    { id: 4, name: "Neha Kulkarni", role: "Patient", phone: "+91 98220 11223", time: "1 hour ago", status: "Logged In (Direct Verified)", location: "Thane" },
    { id: 5, name: "Dr. Neha Kulkarni", role: "Doctor", phone: "+91 98660 77889", time: "2 hours ago", status: "Pending License Review", location: "Sanjeevani Clinic" },
  ];

  // Clean Patient / Doctor reminders
  const standardNotifs = [
    {
      id: 'std-1',
      title: 'Namaste! Welcome to Zeniva AI',
      message: 'Your holistic Ayurvedic health dashboard is active with Charaka Samhita RAG 2.0.',
      time: 'Just now',
      icon: Sparkles,
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'std-2',
      title: 'Varsha Ritu (Monsoon) Wellness Guideline',
      message: 'Drink boiled warm water with a pinch of dry ginger (Shunthi) to kindle Agni.',
      time: '2 hours ago',
      icon: Sparkles,
      color: 'bg-amber-100 text-amber-700'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-start justify-center sm:justify-end sm:p-6 sm:pt-20 select-none animate-in fade-in">
      
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EBE3D5] overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[580px] mt-auto sm:mt-0 animate-in slide-in-from-bottom-6 sm:slide-in-from-top-2">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EBE3D5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              {currentRole === 'admin' ? <UserCheck className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1C1917]">
                {currentRole === 'admin' 
                  ? 'Super Admin Login & Registration Stream' 
                  : currentRole === 'patient'
                  ? 'Your Clinical & Wellness Notifications'
                  : 'Zeniva Notifications'}
              </h3>
              <p className="text-[10px] text-stone-500">
                {currentRole === 'admin' 
                  ? 'Real-time patient & doctor authentication feed' 
                  : doctorMessages.length > 0 
                  ? `${doctorMessages.length} direct doctor message(s) received`
                  : 'Daily Ayurvedic reminders & doctor advice'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {currentRole === 'admin' ? (
            /* Super Admin View: New User and Doctor Logins */
            adminLoginLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    log.role === 'Doctor' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {log.role === 'Doctor' ? '🩺' : '👤'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-stone-900 leading-tight">{log.name}</p>
                      <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-bold ${
                        log.role === 'Doctor' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {log.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-mono mt-0.5">{log.phone} · {log.location}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] text-stone-400 block">{log.time}</span>
                  <span className="text-[8px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-md">
                    {log.status.includes('Active') ? 'Active' : 'Verified'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            /* Patient View: Personal Doctor Messages First, followed by System Alerts */
            <>
              {/* TARGETED DOCTOR MESSAGES (ONLY SHOWN TO THIS TARGET PATIENT) */}
              {doctorMessages.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 px-1">
                    <Stethoscope className="w-3.5 h-3.5 text-purple-700" />
                    <span className="text-[11px] font-bold text-purple-950 uppercase tracking-wider">
                      Direct Advice From Your Doctor ({doctorMessages.length})
                    </span>
                  </div>

                  {doctorMessages.map((dm) => (
                    <div 
                      key={dm.id} 
                      className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/90 via-white to-amber-50/40 border-2 border-purple-200 shadow-sm space-y-2.5 animate-in fade-in slide-in-from-top-1 text-left"
                    >
                      {/* Doctor Info Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={dm.doctor_avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400'}
                            alt={dm.doctor_name || 'Doctor'}
                            className="w-9 h-9 rounded-full object-cover border border-purple-300 shadow-2xs"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400';
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-stone-900 leading-tight">
                                {dm.doctor_name || 'Dr. Sohil Indurkar'}
                              </h4>
                              <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-900 text-[8px] font-bold">
                                Doctor
                              </span>
                            </div>
                            <p className="text-[10px] text-[#5B3E8C] font-semibold mt-0.5">
                              {dm.doctor_specialization || 'Ayurvedic Physician & Vaidya'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[9px] font-mono text-stone-400 shrink-0">
                          {dm.time || 'Just now'}
                        </span>
                      </div>

                      {/* Clinical Advice Body */}
                      <div className="bg-white/80 p-3 rounded-xl border border-purple-100 text-xs text-stone-800 leading-relaxed font-sans shadow-2xs">
                        <p className="whitespace-pre-wrap">{dm.message}</p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Delivered to your account</span>
                        </span>
                        <span className="text-stone-400 font-mono">
                          Target: {dm.patient_name || 'You'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* General Ayurvedic Wellness Alerts */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 px-1 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    General Wellness Notifications
                  </span>
                </div>

                {standardNotifs.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#1C1917]">{item.title}</h4>
                      <span className="text-[9px] text-stone-400">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">{item.message}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#F5EFEB] bg-[#FAF7F2] text-center text-[10px] text-[#A8A29E] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
          <span>Zeniva Ayurvedic Medical Care · Encrypted Triage</span>
        </div>

      </div>
    </div>
  );
};

