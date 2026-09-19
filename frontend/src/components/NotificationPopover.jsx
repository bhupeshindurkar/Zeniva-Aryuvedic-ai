import React from 'react';
import { 
  X, Bell, UserCheck, Stethoscope, Sparkles, 
  CheckCircle2, Clock, ShieldCheck, User
} from 'lucide-react';

export const NotificationPopover = ({ 
  isOpen, 
  onClose, 
  currentRole = 'patient',
  onOpenConsultation, 
  onOpenAIChat 
}) => {
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
      id: 1,
      title: 'Namaste! Welcome to Zeniva AI',
      message: 'Your holistic Ayurvedic health dashboard is active with Charaka Samhita RAG 2.0.',
      time: 'Just now',
      icon: Sparkles,
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 2,
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
                {currentRole === 'admin' ? 'Super Admin Login & Registration Stream' : 'Zeniva Wellness Notifications'}
              </h3>
              <p className="text-[10px] text-stone-500">
                {currentRole === 'admin' ? 'Real-time patient & doctor authentication feed' : 'Daily Ayurvedic reminders'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
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
            /* Standard Patient & Doctor View */
            standardNotifs.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1C1917]">{item.title}</h4>
                  <span className="text-[9px] text-stone-400">{item.time}</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">{item.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#F5EFEB] bg-[#FAF7F2] text-center text-[10px] text-[#A8A29E] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
          <span>Zeniva Ayurvedic Platform Active</span>
        </div>

      </div>
    </div>
  );
};
