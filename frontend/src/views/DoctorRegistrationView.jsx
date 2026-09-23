import React, { useState } from 'react';
import { 
  Stethoscope, Shield, CheckCircle2, UploadCloud, FileText, 
  User, Calendar, MapPin, Building, Award, Check, AlertCircle, 
  ArrowRight, ShieldCheck, Clock, FileCheck, Camera, Info, X
} from 'lucide-react';
import { ZenivaLogo } from '../components/ZenivaIcons';

export const DoctorRegistrationView = ({
  verifiedPhone = '',
  initialName = '',
  initialQualification = '',
  initialSpecialization = '',
  onRegistrationSubmitted = () => {},
  onCancel = () => {}
}) => {
  // Form State with automatic Dr. prefix
  const formattedInitial = initialName && initialName.trim() 
    ? (initialName.trim().startsWith('Dr.') ? initialName.trim() : `Dr. ${initialName.trim()}`) 
    : 'Dr. ';
  const [name, setName] = useState(formattedInitial);
  const [contact, setContact] = useState(verifiedPhone || '');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [profession, setProfession] = useState('Ayurvedic Physician (Vaidya)');
  const [role, setRole] = useState('Consultant Ayurvedic Vaidya');
  const [qualification, setQualification] = useState(initialQualification || 'BAMS, MD (Kayachikitsa)');
  const [specialization, setSpecialization] = useState(initialSpecialization || 'Kayachikitsa & Panchakarma');
  const [experienceYears, setExperienceYears] = useState('');
  const [organization, setOrganization] = useState('');
  const [city, setCity] = useState('');
  
  // Handler to enforce Dr. prefix on typing
  const handleNameInput = (val) => {
    if (!val || val === 'Dr' || val === 'D') {
      setName('Dr. ');
      return;
    }
    if (!val.startsWith('Dr.') && !val.startsWith('Dr ')) {
      setName(`Dr. ${val.replace(/^dr\.?\s*/i, '')}`);
    } else {
      setName(val);
    }
  };

  // Handler to auto-prefix Dr. on clicking Male/Female/Other
  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    if (!name || name.trim() === '' || name === 'Dr.' || name === 'Dr. ') {
      setName('Dr. ');
    } else if (!name.startsWith('Dr.')) {
      setName(`Dr. ${name.replace(/^dr\.?\s*/i, '')}`);
    }
  };
  
  // Strict Medical Council State
  const [councilName, setCouncilName] = useState('Maharashtra Council of Indian Medicine (MCIM)');
  const [councilRegNumber, setCouncilRegNumber] = useState('');
  
  // Document Uploads State: Initially completely empty (NO pre-uploaded dummy badges!)
  const [documents, setDocuments] = useState({
    degree_cert: null,
    council_cert: null,
    national_cert: null,
    internship_cert: null,
    id_proof: null,
    other_cert: null
  });

  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Real Document File Selection
  const handleFileUpload = (docKey, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [docKey]: {
          name: file.name,
          uploaded: true,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        }
      }));
      setErrorMsg('');
    }
  };

  const handleRemoveFile = (docKey) => {
    setDocuments(prev => ({
      ...prev,
      [docKey]: null
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter doctor full name');
      return;
    }
    if (!councilRegNumber.trim()) {
      setErrorMsg('Please enter your official Medical Council Registration Number');
      return;
    }

    // Require at least Degree and Council certificates
    if (!documents.degree_cert) {
      setErrorMsg('Please upload your Degree Certificate (BAMS / MD).');
      return;
    }
    if (!documents.council_cert) {
      setErrorMsg('Please upload your Council Registration Certificate.');
      return;
    }

    setIsSubmitting(true);

    try {
      const registerUrl = (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
        ? '/api/doctor/register'
        : 'http://127.0.0.1:8000/api/doctor/register';
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: contact || verifiedPhone,
          email: contact.includes('@') ? contact : '',
          name,
          dob,
          gender,
          profession,
          role,
          qualification,
          specialization,
          experience_years: Number(experienceYears),
          organization,
          city,
          council_name: councilName,
          council_reg_number: councilRegNumber,
          documents: {
            degree_cert: documents.degree_cert?.name || '',
            council_cert: documents.council_cert?.name || '',
            national_cert: documents.national_cert?.name || '',
            internship_cert: documents.internship_cert?.name || '',
            id_proof: documents.id_proof?.name || '',
            other_cert: documents.other_cert?.name || ''
          },
          avatar
        })
      });

      let submittedDoc = null;
      if (response.ok) {
        try {
          const data = await response.json();
          if (data.success && data.doctor) {
            submittedDoc = {
              ...data.doctor,
              avatar: avatar || data.doctor.avatar,
              documents: data.doctor.documents || documents
            };
          }
        } catch (parseErr) {}
      }
      
      if (!submittedDoc) {
        // Fallback offline simulation
        const fakeDocId = `ZEN-DOC-${Math.floor(100000 + Math.random() * 900000)}`;
        submittedDoc = {
          id: fakeDocId,
          phone: contact || verifiedPhone,
          email: contact.includes('@') ? contact : '',
          name,
          dob,
          gender,
          profession,
          role,
          qualification,
          specialization,
          experience_years: Number(experienceYears),
          organization,
          city,
          council_name: councilName,
          council_reg_number: councilRegNumber,
          documents,
          documents_json: JSON.stringify(documents),
          avatar,
          status: 'pending_verification',
          created_at: new Date().toISOString()
        };
      }

      if (submittedDoc) {
        try {
          localStorage.setItem('zeniva_registered_doctor', JSON.stringify(submittedDoc));
          localStorage.setItem('zeniva_doctor_user', JSON.stringify(submittedDoc));
          localStorage.setItem('zeniva_current_user', JSON.stringify({ ...submittedDoc, role: 'doctor' }));

          // Un-blacklist phone if previously blacklisted
          const delRaw = localStorage.getItem('zeniva_deleted_doctor_ids');
          if (delRaw) {
            let delList = JSON.parse(delRaw);
            const cleanP = submittedDoc.phone ? String(submittedDoc.phone).replace(/\D/g, '').slice(-10) : '';
            delList = delList.filter(x => x !== submittedDoc.phone && x !== cleanP && x !== submittedDoc.id);
            localStorage.setItem('zeniva_deleted_doctor_ids', JSON.stringify(delList));
          }

          const existingListStr = localStorage.getItem('zeniva_registered_doctors_list');
          let existingList = existingListStr ? JSON.parse(existingListStr) : [];
          existingList = existingList.filter(d => d.id !== 'ZEN-DOC-242834' && d.id !== 'ZEN-DOC-644980' && !((!d.phone || d.phone === '+91') && d.name?.toLowerCase().includes('bhupesh')));
          existingList = [submittedDoc, ...existingList.filter(d => d.phone !== submittedDoc.phone && d.id !== submittedDoc.id)];
          localStorage.setItem('zeniva_registered_doctors_list', JSON.stringify(existingList));
          window.dispatchEvent(new CustomEvent('zeniva_doctor_registered', { detail: submittedDoc }));
        } catch (e) {}
        onRegistrationSubmitted(submittedDoc);
      }
    } catch (err) {
      const fakeDocId = `ZEN-DOC-${Math.floor(100000 + Math.random() * 900000)}`;
      const localDoc = {
        id: fakeDocId,
        phone: contact || verifiedPhone,
        email: contact.includes('@') ? contact : '',
        name,
        dob,
        gender,
        profession,
        role,
        qualification,
        specialization,
        experience_years: Number(experienceYears),
        organization,
        city,
        council_name: councilName,
        council_reg_number: councilRegNumber,
        documents,
        documents_json: JSON.stringify(documents),
        avatar,
        status: 'pending_verification',
        created_at: new Date().toISOString()
      };
      try {
        localStorage.setItem('zeniva_registered_doctor', JSON.stringify(localDoc));
        localStorage.setItem('zeniva_doctor_user', JSON.stringify(localDoc));
        localStorage.setItem('zeniva_current_user', JSON.stringify({ ...localDoc, role: 'doctor' }));

        const delRaw = localStorage.getItem('zeniva_deleted_doctor_ids');
        if (delRaw) {
          let delList = JSON.parse(delRaw);
          const cleanP = localDoc.phone ? String(localDoc.phone).replace(/\D/g, '').slice(-10) : '';
          delList = delList.filter(x => x !== localDoc.phone && x !== cleanP && x !== localDoc.id);
          localStorage.setItem('zeniva_deleted_doctor_ids', JSON.stringify(delList));
        }

        const existingListStr = localStorage.getItem('zeniva_registered_doctors_list');
        let existingList = existingListStr ? JSON.parse(existingListStr) : [];
        existingList = existingList.filter(d => d.id !== 'ZEN-DOC-242834' && d.id !== 'ZEN-DOC-644980' && !((!d.phone || d.phone === '+91') && d.name?.toLowerCase().includes('bhupesh')));
        existingList = [localDoc, ...existingList.filter(d => d.phone !== localDoc.phone && d.id !== localDoc.id)];
        localStorage.setItem('zeniva_registered_doctors_list', JSON.stringify(existingList));
        window.dispatchEvent(new CustomEvent('zeniva_doctor_registered', { detail: localDoc }));
      } catch (e) {}
      onRegistrationSubmitted(localDoc);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4 sm:px-6 lg:px-8 font-sans text-stone-800 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Branding */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1C1030] flex items-center justify-center shrink-0 shadow-md">
              <ZenivaLogo className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase tracking-wider">
                  Doctor Onboarding Portal
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-purple-700" />
                  {contact ? (contact.includes('@') ? `Email: ${contact}` : `Contact: ${contact}`) : 'Doctor Credential Verification'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
                Doctor Profile & Professional Credentials (वैद्य पंजीकरण)
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Complete your Ayurvedic clinical registry. Verified by Medical Council standards.
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-xs text-stone-400 hover:text-stone-700 font-bold px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-all cursor-pointer"
          >
            ← Back to Login
          </button>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-800 text-xs font-bold flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ========================================================================= */}
          {/* SECTION 1: PERSONAL & CLINICAL DETAILS                                    */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D5] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-stone-900">1. Personal & Practice Profile</h2>
              </div>
              <span className="text-[10px] text-stone-400 uppercase font-bold">No password required</span>
            </div>

            {/* Avatar & Basic Info Grid */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt="Doctor Avatar"
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-purple-200 shadow-sm"
                />
                <label className="absolute inset-0 bg-stone-900/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer">
                  <Camera className="w-5 h-5 mb-1" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Doctor Full Name (with Title) *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameInput(e.target.value)}
                    placeholder="e.g. Dr. Full Name"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => handleGenderChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Doctor Contact (Email / Mobile) *</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. dr.ramesh@gmail.com or 9876543210"
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Professional Role & Qualification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs pt-2 border-t border-stone-100">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Profession *</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Clinical Designation / Role *</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Kayachikitsa Expert"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Ayurvedic Qualification *</label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                >
                  <option>BAMS (Bachelor of Ayurvedic Medicine & Surgery)</option>
                  <option>BAMS, MD (Ayurveda - Kayachikitsa)</option>
                  <option>BAMS, MD (Ayurveda - Panchakarma)</option>
                  <option>BAMS, MS (Ayurveda - Prasuti Tantra)</option>
                  <option>BAMS, MS (Ayurveda - Shalya Tantra)</option>
                  <option>BAMS, MD (Dravyaguna Vigyana)</option>
                  <option>BAMS, PhD (Ayurveda)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Specialization Focus *</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Panchakarma & Nadi Pariksha"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Years of Clinical Experience *</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Clinic / Hospital / Organization *</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Zeniva Ayurvedic Health Institute"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="block font-bold text-stone-700 mb-1">Practice Location (City, State) *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Shivajinagar, Pune, Maharashtra"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: OFFICIAL MEDICAL COUNCIL REGISTRATION (STRICT SEPARATION)      */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-green-100 text-green-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">2. Official Medical Council Credentials</h2>
                  <p className="text-[11px] text-stone-500">Official Government/State License strictly separated from Zeniva Doctor ID</p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Info className="w-3 h-3 text-amber-700" />
                <span>Statutory Medical Verification</span>
              </span>
            </div>

            {/* Notice Alert */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-600 space-y-1">
              <p className="font-bold text-stone-800">📌 Important Distinction Note:</p>
              <p className="text-[11px] leading-relaxed">
                Your <strong>Council Registration Number</strong> is your legal license issued by the State/National Ayurvedic Board (e.g. MCIM, CCIM, NCISM).
                Upon registration, Zeniva will issue an internal system identifier <strong>Zeniva Doctor ID (ZEN-DOC-XXXXXX)</strong> for platform routing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <label className="block font-bold text-stone-700 mb-1">State / National Medical Council Name *</label>
                <select
                  value={councilName}
                  onChange={(e) => setCouncilName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                >
                  <option>Maharashtra Council of Indian Medicine (MCIM)</option>
                  <option>National Commission for Indian System of Medicine (NCISM)</option>
                  <option>Central Council of Indian Medicine (CCIM)</option>
                  <option>Delhi Bharatiya Chikitsa Parishad (DBCP)</option>
                  <option>Gujarat State Board of Ayurvedic & Unani Systems</option>
                  <option>Karnataka Ayurvedic and Unani Practitioners Board</option>
                  <option>Travancore-Cochin Medical Council, Kerala</option>
                  <option>Other State Medical Council</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Actual Official Council Registration Number *</label>
                <input
                  type="text"
                  required
                  value={councilRegNumber}
                  onChange={(e) => setCouncilRegNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. AYU-MAH-8921 or I-14201-A"
                  className="w-full p-2.5 rounded-xl border-2 border-purple-200 bg-purple-50/30 font-mono font-bold text-purple-950 focus:bg-white focus:ring-2 focus:ring-purple-600/30 outline-none"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: CLEAN DOCUMENT UPLOADS (No Pre-Uploaded Dummy Badges!)        */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3D5] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900">3. Verification Documents & Certificates</h2>
                  <p className="text-[11px] text-stone-500">Upload high-resolution scans for Super Admin verification</p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                PDF, JPG, PNG (Max 5MB)
              </span>
            </div>

            {/* Document Upload Grid (Completely clean - only shows Uploaded when file selected) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* 1. Degree Certificate */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-700" />
                      Degree Certificate (BAMS/MD) <span className="text-red-500">*</span>
                    </span>
                    {documents.degree_cert && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[9px] font-bold rounded-full flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 truncate">
                    {documents.degree_cert ? `${documents.degree_cert.name} (${documents.degree_cert.size})` : 'Upload certified BAMS/MD degree copy'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-center font-bold text-[11px] cursor-pointer block transition-all shadow-2xs">
                    <span>{documents.degree_cert ? 'Replace Document' : 'Choose File'}</span>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload('degree_cert', e)} className="hidden" />
                  </label>
                  {documents.degree_cert && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('degree_cert')}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Council Registration Certificate */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                      Council Registration Certificate <span className="text-red-500">*</span>
                    </span>
                    {documents.council_cert && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[9px] font-bold rounded-full flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 truncate">
                    {documents.council_cert ? `${documents.council_cert.name} (${documents.council_cert.size})` : 'Upload State Council registration certificate'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-center font-bold text-[11px] cursor-pointer block transition-all shadow-2xs">
                    <span>{documents.council_cert ? 'Replace Document' : 'Choose File'}</span>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload('council_cert', e)} className="hidden" />
                  </label>
                  {documents.council_cert && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('council_cert')}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3. National / Professional Certificate */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-700" />
                      National / Professional Certificate
                    </span>
                    {documents.national_cert && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[9px] font-bold rounded-full flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 truncate">
                    {documents.national_cert ? `${documents.national_cert.name} (${documents.national_cert.size})` : 'Board / Speciality certification scan'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-center font-bold text-[11px] cursor-pointer block transition-all shadow-2xs">
                    <span>{documents.national_cert ? 'Replace Document' : 'Choose File'}</span>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload('national_cert', e)} className="hidden" />
                  </label>
                  {documents.national_cert && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('national_cert')}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Internship Certificate */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-amber-700" />
                      Internship Certificate <span className="text-red-500">*</span>
                    </span>
                    {documents.internship_cert && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[9px] font-bold rounded-full flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 truncate">
                    {documents.internship_cert ? `${documents.internship_cert.name} (${documents.internship_cert.size})` : 'Hospital internship completion certificate'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-center font-bold text-[11px] cursor-pointer block transition-all shadow-2xs">
                    <span>{documents.internship_cert ? 'Replace Document' : 'Choose File'}</span>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload('internship_cert', e)} className="hidden" />
                  </label>
                  {documents.internship_cert && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('internship_cert')}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 5. Govt ID Proof */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-red-700" />
                      Government ID Proof (Aadhaar/Passport) <span className="text-red-500">*</span>
                    </span>
                    {documents.id_proof && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[9px] font-bold rounded-full flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 truncate">
                    {documents.id_proof ? `${documents.id_proof.name} (${documents.id_proof.size})` : 'Aadhaar, Passport, or Driving License'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-center font-bold text-[11px] cursor-pointer block transition-all shadow-2xs">
                    <span>{documents.id_proof ? 'Replace Document' : 'Choose File'}</span>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload('id_proof', e)} className="hidden" />
                  </label>
                  {documents.id_proof && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('id_proof')}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 6. Other Relevant Certificates */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-stone-600" />
                      Other Relevant Certificates (Optional)
                    </span>
                    {documents.other_cert && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[9px] font-bold rounded-full flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 truncate">
                    {documents.other_cert ? `${documents.other_cert.name} (${documents.other_cert.size})` : 'Fellowships, research, or clinical training'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-center font-bold text-[11px] cursor-pointer block transition-all shadow-2xs">
                    <span>{documents.other_cert ? 'Replace Document' : 'Choose File'}</span>
                    <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload('other_cert', e)} className="hidden" />
                  </label>
                  {documents.other_cert && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile('other_cert')}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 4: SUBMIT FOR SUPER ADMIN VERIFICATION                            */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl p-6 border border-[#EBE3D5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-600 space-y-0.5">
              <p className="font-bold text-stone-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Declaration of Truthfulness
              </p>
              <p className="text-[11px] text-stone-500">
                I hereby declare that all submitted medical credentials and council license details are authentic and valid.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#5B3E8C] hover:bg-[#4A2F75] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Credentials...</span>
              ) : (
                <>
                  <span>Submit for Super Admin Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
