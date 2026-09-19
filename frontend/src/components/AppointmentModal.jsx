import React, { useState } from 'react';
import { X, Calendar, Clock, Stethoscope, CheckCircle2 } from 'lucide-react';

export const AppointmentModal = ({ isOpen, onClose, onBooked }) => {
  const [doctor, setDoctor] = useState('Dr. Meera Joshi (BAMS, Panchakarma)');
  const [patientName, setPatientName] = useState('Aarav Patil');
  const [dateTime, setDateTime] = useState('Tomorrow, 11:00 AM');
  const [type, setType] = useState('Consultation');
  const [dosha, setDosha] = useState('Stress & Sleep Concern');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (onBooked) {
        onBooked({ doctor, patientName, dateTime, type, dosha, notes });
      }
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Book Ayurvedic Consultation</h3>
            <p className="text-xs text-stone-500">Connect with certified BAMS Ayurvedic physicians</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-serif font-bold text-stone-900">Appointment Confirmed!</h4>
            <p className="text-xs text-stone-500">
              Scheduled with {doctor} for {dateTime}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Select Doctor</label>
              <select
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30"
              >
                <option>Dr. Meera Joshi (BAMS, Panchakarma)</option>
                <option>Dr. Arjun Patil (Kayachikitsa)</option>
                <option>Dr. Neha Kulkarni (Dravyaguna)</option>
                <option>Dr. Priya Nair (Rasayana)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Preferred Time</label>
                <input
                  type="text"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Consultation Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                >
                  <option>Consultation</option>
                  <option>Follow-up</option>
                  <option>Panchakarma Assessment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Health Concern / Issue</label>
              <input
                type="text"
                value={dosha}
                onChange={(e) => setDosha(e.target.value)}
                placeholder="e.g. Stress, Anxiety, Acidity, Joint pain"
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Symptoms / Notes (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe current symptoms or questions for doctor..."
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600/30"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs shadow-md transition-colors"
              >
                Confirm Appointment Schedule
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
