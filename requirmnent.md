# ZENIVA — AI Build Prompt (Fixed & Structured)

**Note before you send this:** Your original spec asked for an "AI camera scan of face/skin/eyes/tongue that detects real medical problems." I've replaced that with a **questionnaire-based Dosha/Symptom Assessment** powered by RAG + LLM. A camera-based diagnostic scanner is not something an LLM can do accurately or legally (it counts as medical diagnosis and needs regulated medical-device approval in India). Your own uploaded dashboard already shows "Symptom Checker" and "Dosha Analysis" as form-based flows — not a scanner — so this prompt matches your actual screens. Photo upload is still included, but it goes to the **doctor** to review, not to an AI diagnosis engine.

Everything else below follows your uploaded screenshots and your step-by-step structure exactly.

---

## 1. PROJECT OVERVIEW

Build **Zeniva — AI Ayurvedic Care**, a web platform with three portals:
1. **Patient Portal** — mobile OTP login, dosha/symptom assessment, AI+doctor recommendations, consultations
2. **Doctor Portal** — mobile OTP login, registration/verification, patient management, consultations
3. **Super Admin Portal** — full platform control, doctor verification, analytics

Core intelligence: a **RAG-Enhanced LLM system** that classifies patients by Ayurvedic dosha/prakriti and symptoms, retrieves relevant Ayurvedic text (Charaka Samhita, Ashtanga Hridaya, herbal formularies, etc.), and generates personalized, doctor-reviewable recommendations.

Visual identity (match uploaded screens exactly): deep indigo/navy sidebar (#1a1435-ish) with gold "ZENIVA" lotus logo, cream/beige main background, purple primary accent (#6B46C1-ish), rounded cards, meditating figure motif in sidebar footer, warm editorial photography (mortar & pestle, herbs) for hero/education panels.

---

## 2. TECH STACK

- **Frontend:** React + Tailwind CSS (component-based, matches card/sidebar layout in screenshots)
- **Backend:** Node.js (Express) or Python (FastAPI) — specify FastAPI if RAG/LLM work stays in Python
- **Database:** PostgreSQL (relational: users, doctors, appointments, assessments) + a vector store (pgvector / Pinecone / Chroma) for RAG embeddings
- **Auth:** Mobile number + OTP (SMS via Twilio/MSG91), JWT sessions, role-based access (patient / doctor / super_admin)
- **LLM/RAG:** Any LLM API (Claude/GPT) + embedding model, retrieval over a curated Ayurvedic knowledge base you supply as source documents
- **File storage:** S3-compatible bucket for profile photos, doctor verification docs, consultation photo uploads

---

## 3. AUTHENTICATION

### 3.1 Patient Login (OTP)
- Screen 1: enter mobile number
- Screen 2: **"Verify Your Identity"** — 6-digit OTP boxes, masked number shown (+91 98*** **567), "Resend OTP in 00:45" countdown, "Verify & Continue" button, lock icon + "Your data is secure and encrypted" footer text, leaf illustration corners — match uploaded OTP screen pixel-for-pixel in layout/copy.
- On success → redirect to Patient Dashboard.

### 3.2 Doctor Login (OTP)
- Same OTP box pattern, headline **"Doctor Verification"**, subtext "For your security, we've sent a 6-digit OTP to your registered mobile number", stethoscope icon avatar, trust strip at bottom (Secure & Private / Verified Doctors / Ayurvedic Care / Patient First) — match uploaded doctor OTP screen exactly.
- First-time doctors go through **Doctor Registration** before OTP verification is enabled on their account (see 3.3).

### 3.3 Doctor Registration Form
Collect and store:
- Full Name
- Email
- Mobile Number
- Password
- Medical/Ayurvedic Qualification
- Specialization
- Registration/License Number
- Years of Experience
- Clinic/Hospital Name
- Location
- Consultation Mode (In-person / Online / Both)
- Available Timings
- Profile Photo (upload)
- Verification Documents (upload — license, degree certificate)

Status flow: `pending_verification → verified → active` (verification handled by Super Admin, see Section 6).

### 3.4 Super Admin Login
- Separate secure login (email + password + optional 2FA), not public-facing signup.

---

## 4. PATIENT PORTAL — PAGES

Sidebar nav (from your screenshot): Home, My Profile, Dosha Analysis, Symptom Checker, Consultation, Herbal Recommendations, Lifestyle Planner, Knowledge Library, Reports & History, Settings.

**Critical rule (your Step 1):** Every page in this portal shows **only the logged-in patient's own data** — no cross-patient visibility, enforced at the API layer via JWT user_id, not just hidden in UI.

1. **Home Dashboard**
   - Greeting header ("Namaste, [Name]"), Quick Scan shortcut, notification bell, profile dropdown
   - Dosha circle diagram (Vata/Pitta/Kapha with %), AI Accuracy stat, Herbal Insights count
   - Health Dashboard cards: Dosha Balance, Wellness Score, Daily Routine consistency, Top Recommendation
   - Daily Panchakarma Tip, Upcoming Reminder (next consultation), Seasonal Guide, quote card
   - Quick-access tiles: Symptom Checker, Doctor Consultation, Herbal Recommendations, Lifestyle Planner, Knowledge Library

2. **My Profile** — personal details, health history, contact info, edit/update

3. **Dosha Analysis** — structured questionnaire (physical build, digestion, sleep, temperament, skin/hair type, energy patterns) → RAG+LLM engine computes Vata/Pitta/Kapha percentages → full report with explanation, sourced from retrieved Ayurvedic text

4. **Symptom Checker** — patient describes symptoms (structured form + free text) → RAG+LLM retrieves relevant classical references → returns probable imbalance + suggested next step ("consult a doctor" / "self-care tip"), always labeled as AI-assisted, not a diagnosis

5. **Consultation** — book/join consultation with a verified doctor, upload photos/reports for the doctor to review (photos go to doctor, not to an auto-diagnosis model), video/chat interface, past consultation history

6. **Herbal Recommendations** — AI-suggested herbs/formulations based on dosha + symptoms, each with RAG citation to source text, doctor-approval flag before shown as "confirmed"

7. **Lifestyle Planner** — diet, exercise, daily routine (dinacharya) generated per dosha profile, editable/trackable

8. **Knowledge Library** — searchable articles/therapies from Ayurvedic texts (RAG-searchable)

9. **Reports & History** — past assessments, recommendation history, consultation records, downloadable reports

10. **Settings** — notification prefs, privacy, language, logout

---

## 5. DOCTOR PORTAL — PAGES

Sidebar nav (from your screenshot): Dashboard, Personal Details, Doctor Qualification, Experience, Specialization, Successful Treatments, Location, Availability, Appointments, Patients, Consultations, Treatment Plans, Herbal Recommendations, Reports & Analytics, Reminders, Messages, Settings, Help & Support.

1. **Dashboard** — stat cards (Total Patients, Today's Appointments, Follow-ups Due, Treatment Success Rate), Today's Overview donut, Patient Flow weekly line chart, Top Health Concerns bar list, Today's Schedule panel, Quick Actions (Add Prescription, Upload Reports, Send Message, Share Guide), Practice Insights donut — match uploaded doctor dashboard layout exactly.

2. **Profile section** — Personal Details, Doctor Qualification, Experience, Specialization, Successful Treatments (editable versions of registration data)

3. **Practice section** — Location, Availability calendar

4. **Manage section**
   - Appointments (list/calendar, accept/reschedule/cancel)
   - Patients (only patients assigned/booked with this doctor — not platform-wide)
   - Consultations (active/upcoming/completed, chat/video)
   - Treatment Plans (create/edit per patient)
   - Herbal Recommendations (review/approve AI-suggested herbs before patient sees them as confirmed)
   - Reports & Analytics (own practice stats only)

5. **Other** — Reminders, Messages, Settings, Help & Support

---

## 6. SUPER ADMIN PORTAL — PAGES

Sidebar exactly as you specified:

```
🏠 Dashboard
👥 Patients
   ├── Patient Details
   ├── Assessment History
   └── Recommendation History
👨‍⚕️ Doctors
   ├── Doctor Details
   ├── Doctor Verification
   └── Doctor Availability
🌿 AI Recommendations
   ├── Symptom Assessments
   ├── Ayurvedic Remedies
   └── Doctor Review
📅 Appointments
   ├── Upcoming
   ├── Completed
   └── Cancelled
💬 Consultations
   ├── Active
   ├── Upcoming
   └── Completed
🔔 Notifications
📊 Reports
🔐 Security & Audit
⚙️ Settings
```

1. **Dashboard** — platform-wide stat cards (Total Patients, Total Doctors, Total Appointments, Active Consultations, System Uptime), Patient Overview donut, Appointments Overview line chart, Consultations Overview donut, Recent Activities feed, Recent Appointments table, Top Symptoms Assessed bar list, Quick Actions grid — match uploaded super admin screen exactly.

2. **Patients** — Patient Details (full records, admin view), Assessment History (all patients), Recommendation History (all patients)

3. **Doctors**
   - Doctor Details (full roster)
   - **Doctor Verification** — review submitted registration docs/license, approve/reject, this is what flips a doctor from `pending_verification` to `verified`
   - Doctor Availability (platform-wide scheduling overview)

4. **AI Recommendations** — Symptom Assessments (all, platform-wide), Ayurvedic Remedies (manage the RAG knowledge base content), Doctor Review (track which AI recommendations doctors approved/edited/rejected)

5. **Appointments** — Upcoming / Completed / Cancelled, platform-wide

6. **Consultations** — Active / Upcoming / Completed, platform-wide

7. **Notifications** — system-wide alert management

8. **Reports** — exportable platform analytics

9. **Security & Audit** — login logs, role changes, data access audit trail

10. **Settings** — platform config, roles/permissions, integrations (SMS/OTP provider, LLM API keys, storage)

---

## 7. RAG + LLM ARCHITECTURE

1. **Knowledge base ingestion:** classical Ayurvedic texts, herbal formularies, dosha-symptom mapping tables → chunk → embed → store in vector DB
2. **Retrieval:** on patient's Dosha Analysis or Symptom Checker submission, embed the patient's structured answers, retrieve top-k relevant chunks
3. **Generation:** LLM receives patient inputs + retrieved chunks → generates dosha classification / symptom explanation / herbal suggestion, with citations back to source text
4. **Doctor-in-the-loop:** every AI-generated recommendation is flagged `pending_doctor_review` until a doctor approves/edits it; only approved recommendations show as "confirmed" to the patient
5. **Guardrails:** every AI output includes a visible disclaimer ("AI-assisted insight — not a medical diagnosis, please consult your doctor"); no AI output ever claims to have analyzed an image for diagnosis

---

## 8. BACKEND STRUCTURE (suggested)

```
/auth        — OTP send/verify, JWT issue, doctor registration, role middleware
/patients    — profile, dosha analysis, symptom checker, reports (scoped to own user_id only)
/doctors     — profile, patients (scoped to own appointments), consultations, treatment plans
/admin       — platform-wide CRUD across patients/doctors/appointments, doctor verification, audit log
/rag         — knowledge base ingestion, embedding, retrieval endpoint
/llm         — recommendation generation endpoint (calls /rag internally)
/appointments, /consultations, /notifications, /reports — shared resources with role-based scoping
/uploads     — profile photos, doctor verification docs, consultation photos (S3-backed, signed URLs)
```

Every endpoint must enforce role + ownership checks server-side (patient can only ever query their own `user_id`; doctor can only query patients tied to their own appointments; only super_admin has unrestricted scope).

---

## 9. WHAT TO TELL THE AI BUILDING THIS

When you paste this prompt into your AI tool, add at the top:
> "Build this as a working full-stack app: React+Tailwind frontend, [Node/Express or FastAPI] backend, PostgreSQL + vector DB, OTP auth via [SMS provider], RAG pipeline over Ayurvedic source documents I will provide separately. Match the attached UI screenshots exactly for layout, colors, and copy. Do not implement any camera-based image diagnosis — photo uploads route to the doctor for manual review only."