import os
import json
import numpy as np
from flask import Flask, request, jsonify, render_template, send_file
from google import genai
from google.genai import types
from pypdf import PdfReader
from sklearn.metrics.pairwise import cosine_similarity
from config import GEMINI_API_KEY, MODEL

app = Flask(__name__, template_folder="templates", static_folder="static")

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

FALLBACK_MODELS = [
    "gemini-3.6-flash",
    "gemini-flash-latest",
    "gemini-3.5-flash-lite"
]

# Load Clinical Databases
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

DOCTORS = []
PATIENTS = {}
KNOWLEDGE_BASE = []
KB_TEXTS = []
KB_EMBEDDINGS = []

def load_data():
    global DOCTORS, PATIENTS, KNOWLEDGE_BASE, KB_TEXTS
    try:
        doc_path = os.path.join(DATA_DIR, "doctors.json")
        if os.path.exists(doc_path):
            with open(doc_path, "r", encoding="utf-8") as f:
                DOCTORS = json.load(f)
        
        pat_path = os.path.join(DATA_DIR, "patients.json")
        if os.path.exists(pat_path):
            with open(pat_path, "r", encoding="utf-8") as f:
                pat_list = json.load(f)
                PATIENTS = {p["Patient_ID"].upper(): p for p in pat_list}
                
        kb_path = os.path.join(DATA_DIR, "knowledge_base.json")
        if os.path.exists(kb_path):
            with open(kb_path, "r", encoding="utf-8") as f:
                KNOWLEDGE_BASE = json.load(f)
                KB_TEXTS = [f"{k.get('title', '')} ({k.get('source', '')}):\n{k.get('content', '')}" for k in KNOWLEDGE_BASE]
    except Exception as e:
        print("Data loading error:", e)

load_data()

UPLOADED_CHUNKS = []

def get_embedding(text):
    if not client or not text.strip():
        return None
    try:
        res = client.models.embed_content(
            model="gemini-embedding-001",
            contents=text.strip()
        )
        if res and res.embeddings and len(res.embeddings) > 0:
            return res.embeddings[0].values
        return None
    except Exception as e:
        print("Embedding error:", e)
        return None

def retrieve_knowledge_context(query, top_k=2):
    query_lower = query.lower()
    matched_sections = []
    
    # Keyword based extraction
    for doc in KNOWLEDGE_BASE:
        content = doc.get("content", "")
        if any(term in query_lower for term in ["dosha", "दोष", "vata", "वात", "pitta", "पित्त", "kapha", "कफ", "tridosha"]) and "dosha" in doc.get("source", ""):
            matched_sections.append(content)
        elif any(term in query_lower for term in ["prakriti", "प्रकृती", "nature", "constitution"]) and "prakriti" in doc.get("source", ""):
            matched_sections.append(content)
        elif any(term in query_lower for term in ["vikriti", "विकृती", "imbalance"]) and "vikriti" in doc.get("source", ""):
            matched_sections.append(content)
        elif any(term in query_lower for term in ["agni", "अग्नी", "digestion", "metabolism", "पाचक"]) and "agni" in doc.get("source", ""):
            matched_sections.append(content)
        elif any(term in query_lower for term in ["ama", "आम", "toxin", "कचरा", "toxic"]) and "ama" in doc.get("source", ""):
            matched_sections.append(content)
        elif any(term in query_lower for term in ["diet", "आहार", "food", "जेवण", "nutrition"]) and "diet" in doc.get("source", ""):
            matched_sections.append(content)
        elif any(term in query_lower for term in ["emergency", "आपत्कालीन", "hospital", "urgent"]) and "emergency" in doc.get("source", ""):
            matched_sections.append(content)

    for chunk in UPLOADED_CHUNKS:
        matched_sections.append(chunk)

    return "\n\n".join(matched_sections[:top_k]) if matched_sections else ""

def find_doctors(query_text):
    query_lower = query_text.lower()
    results = []
    for doc in DOCTORS:
        score = 0
        loc = doc.get("Location", "").lower()
        spec = doc.get("Specialization", "").lower()
        
        if loc in query_lower: score += 3
        if spec in query_lower: score += 3
        if any(w in query_lower for w in ["diet", "आहार"]) and "diet" in spec: score += 2
        if any(w in query_lower for w in ["panchakarma", "पंचकर्म"]) and "panchakarma" in spec: score += 2
        if any(w in query_lower for w in ["yoga", "lifestyle", "योग"]) and "yoga" in spec: score += 2
        if any(w in query_lower for w in ["digestive", "पचन", "stomach"]) and "digestive" in spec: score += 2
        if any(w in query_lower for w in ["pune", "पुणे"]) and "pune" in loc: score += 3
        if any(w in query_lower for w in ["mumbai", "मुंबई"]) and "mumbai" in loc: score += 3
        if any(w in query_lower for w in ["nashik", "नाशिक"]) and "nashik" in loc: score += 3
        if any(w in query_lower for w in ["nagpur", "नागपूर"]) and "nagpur" in loc: score += 3
        
        if score > 0 or len(results) < 3:
            results.append((score, doc))
            
    results.sort(key=lambda x: x[0], reverse=True)
    return [d[1] for d in results[:4]]

def find_patient_profile(query_text):
    import re
    match = re.search(r'\b(P\d{4})\b', query_text.upper())
    if match:
        pid = match.group(1)
        return PATIENTS.get(pid)
    
    for pid, p in PATIENTS.items():
        if p["Patient_Name"].lower() in query_text.lower():
            return p
    return None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/download")
def download_zip():
    zip_path = os.path.join(os.path.dirname(__file__), "ZENIVA_Project.zip")
    if os.path.exists(zip_path):
        return send_file(zip_path, as_attachment=True, download_name="ZENIVA_Project.zip")
    return jsonify({"error": "ZIP file not found."}), 404

@app.route("/download_report")
def download_report_pdf():
    pdf_path = os.path.join(os.path.dirname(__file__), "ZENIVA_Project_Report.pdf")
    if os.path.exists(pdf_path):
        return send_file(pdf_path, as_attachment=True, download_name="ZENIVA_Project_Report.pdf")
    return jsonify({"error": "PDF report not found."}), 404

@app.route("/api/stats", methods=["GET"])
def api_stats():
    return jsonify({
        "total_patients": len(PATIENTS) or 2000,
        "total_doctors": len(DOCTORS) or 200,
        "total_knowledge_articles": len(KNOWLEDGE_BASE) or 11,
        "dosha_distribution": {"Vata": 670, "Pitta": 665, "Kapha": 665},
        "available_specializations": ["Kayachikitsa", "Panchakarma", "Ayurvedic Dietetics", "Yoga & Lifestyle", "Digestive Health"],
        "top_cities": ["Nashik", "Pune", "Mumbai", "Nagpur", "Aurangabad", "Bengaluru", "Delhi", "Hyderabad"]
    })

@app.route("/api/doctors", methods=["GET"])
def api_doctors():
    city = request.args.get("city", "").strip().lower()
    spec = request.args.get("spec", "").strip().lower()
    lang = request.args.get("lang", "").strip().lower()
    mode = request.args.get("mode", "").strip().lower()
    
    res = []
    for d in DOCTORS:
        if city and city not in d.get("Location", "").lower(): continue
        if spec and spec not in d.get("Specialization", "").lower(): continue
        if lang and lang not in d.get("Languages", "").lower(): continue
        if mode and mode not in d.get("Consultation_Mode", "").lower(): continue
        res.append(d)
        if len(res) >= 20: break
    return jsonify({"doctors": res if res else DOCTORS[:12], "count": len(DOCTORS)})

@app.route("/api/patient/<pid>", methods=["GET"])
def api_patient(pid):
    patient = PATIENTS.get(pid.upper())
    if patient:
        return jsonify({"success": True, "patient": patient})
    return jsonify({"success": False, "message": f"रुग्ण ID '{pid}' सापडला नाही. कृपया P0001 ते P2000 दरम्यान ID तपासा."}), 404

@app.route("/api/book_appointment", methods=["POST"])
def api_book():
    data = request.get_json() or {}
    doctor_id = data.get("doctor_id", "DOC001")
    doctor_name = data.get("doctor_name", "Dr. Diya Joshi")
    patient_name = data.get("patient_name", "Patient")
    date_slot = data.get("time_slot", "Tomorrow 14:00 - 18:00")
    
    return jsonify({
        "success": True,
        "message": f"🎉 अपॉइंटमेंट यशस्वीरीत्या बुक झाली!\n\n🩺 वैद्य: {doctor_name} ({doctor_id})\n👤 रुग्ण: {patient_name}\n⏰ वेळ: {date_slot}\n📍 प्रकार: Online/Offline Consultation",
        "appointment_id": f"APT-{np.random.randint(1000, 9999)}"
    })

@app.route("/upload_doc", methods=["POST"])
def upload_doc():
    files = request.files.getlist("doc")
    if not files or all(f.filename == "" for f in files):
        return jsonify({"message": "कोणतीही फाईल निवडलेली नाही."}), 400

    uploaded_names = []
    total_new_chunks = 0
    errors = []

    for file in files:
        if not file or not file.filename:
            continue
        filename = file.filename.lower()
        text = ""

        try:
            if filename.endswith(".pdf"):
                reader = PdfReader(file)
                for page in reader.pages:
                    text += page.extract_text() or ""
            elif filename.endswith(".txt") or filename.endswith(".csv"):
                text = file.read().decode("utf-8", errors="ignore")
            else:
                errors.append(f"'{file.filename}' (असमर्थित फॉरमॅट)")
                continue

            if text.strip():
                chunks = [text[i:i+500] for i in range(0, len(text), 450)]
                for ch in chunks:
                    UPLOADED_CHUNKS.append(ch.strip())
                uploaded_names.append(file.filename)
                total_new_chunks += len(chunks)
            else:
                errors.append(f"'{file.filename}' (मजकूर वाचता आला नाही)")
        except Exception as ex:
            errors.append(f"'{file.filename}' ({str(ex)})")

    if uploaded_names:
        files_str = ", ".join([f"'{n}'" for n in uploaded_names])
        msg = f"✅ {len(uploaded_names)} फाईल्स ({files_str}) मधील एकूण {total_new_chunks} परिच्छेद Knowledge Base (RAG) मध्ये यशस्वीरीत्या जोडले गेले!"
        if errors:
            msg += f"\n⚠️ त्रुटी: {', '.join(errors)}"
        return jsonify({
            "message": msg,
            "total_chunks": len(UPLOADED_CHUNKS),
            "files_count": len(uploaded_names)
        })
    else:
        err_detail = f": {', '.join(errors)}" if errors else ""
        return jsonify({"message": f"⚠️ फाईल्स जोडता आल्या नाहीत{err_detail}"}), 400

@app.route("/chat", methods=["POST"])
def chat():
    if not client:
        return jsonify({
            "reply": "⚠️ API Key सापडली नाही!\n\n.env फाइल उघडा आणि GEMINI_API_KEY सेट करा.",
            "error": True
        }), 200

    prompt = request.form.get("prompt", "").strip()
    image_files = request.files.getlist("image")
    valid_images = [f for f in image_files if f and f.filename]

    if not prompt and not valid_images:
        return jsonify({"reply": "कृपया काहीतरी विचारा, बोला किंवा फोटो अपलोड करा."})

    if not prompt and valid_images:
        prompt = "कृपया या वैद्यकीय फोटोचे (उदा. जीभ, त्वचा, डोळे, किंवा लक्षणे) आयुर्वेदानुसार सखोल क्लिनिकल परीक्षण करा आणि त्रिदोष (Vata, Pitta, Kapha), अग्नी, प्रकृती व योग्य आयुर्वेदिक उपाय व आहार सविस्तर सांगा."

    target_lang = request.form.get("target_lang", "auto").strip()

    # Emergency Guardrail
    emergency_keywords = [
        "emergency", "severe emergency", "chest pain", "heart attack", "accidental",
        "आपत्कालीन", "गंभीर दुखणे", "गंभीर", "कळ येत", "hospital", "108", "112", "stroke", "accident"
    ]
    if any(k in prompt.lower() for k in emergency_keywords):
        emergency_reply = (
            "🚨 **तातडीची आपत्कालीन सूचना (Medical Emergency Alert):**\n\n"
            "ZENIVA AI आपत्कालीन सूचना देऊन त्वरित 108 / 112 वर संपर्क साधण्याचा योग्य वैद्यकीय सल्ला देत आहे.\n\n"
            "ही गंभीर स्थिती असू शकते. कृपया घरगुती उपाय किंवा AI वर अवलंबून न राहता तात्काळ जवळच्या रुग्णालयात जा किंवा रुग्णवाहिकेसाठी 108 / 112 वर त्वरित संपर्क साधा."
        )
        return jsonify({"reply": emergency_reply, "intent": "emergency", "is_emergency": True})

    try:
        parts = []
        extra_context = []

        # 1. Patient Profile Context Injection
        patient = find_patient_profile(prompt)
        if patient or any(w in prompt.lower() for w in ["profile", "माहिती", "रुग्ण", "माझा प्रोफाइल", "patient"]):
            target_p = patient or PATIENTS.get("P0001")
            if target_p:
                p_info = (
                    f"### Patient Health Record ({target_p['Patient_ID']}):\n"
                    f"- Name: {target_p['Patient_Name']}, Age: {target_p['Age']}, Gender: {target_p['Gender']}, City: {target_p['City']}\n"
                    f"- Dominant Dosha: {target_p['Dosha']} (Prakriti: {target_p['Prakriti']}, Vikriti: {target_p['Vikriti']})\n"
                    f"- Agni Status: {target_p['Agni']} | Ama Accumulation: {target_p['Ama']}\n"
                    f"- Symptoms: {target_p['Symptoms']}\n"
                    f"- Recommended Diet: {target_p['Diet']}\n"
                    f"- Lifestyle Factors: Sleep: {target_p['Sleep']}, Stress: {target_p['Stress']}, Exercise: {target_p['Exercise']}\n"
                    f"- Medical History: {target_p['Medical_History']}"
                )
                extra_context.append(p_info)

        # 2. Doctor Finder Integration
        if any(w in prompt.lower() for w in ["doctor", "appointment", "डॉक्टर", "अपॉइंटमेंट", "वैद्य", "सल्ला", "consult"]):
            matched_docs = find_doctors(prompt)
            if matched_docs:
                docs_info = "### Available Recommended Ayurvedic Doctors:\n"
                for d in matched_docs:
                    docs_info += f"- {d['Doctor_Name']} ({d['Doctor_ID']}) | {d['Qualification']} | {d['Specialization']} | Exp: {d['Experience_Years']} yrs | {d['Location']} | Available: {d['Availability']} | Mode: {d['Consultation_Mode']}\n"
                extra_context.append(docs_info)

        # 3. RAG Knowledge Context
        kb_context = retrieve_knowledge_context(prompt)
        if kb_context:
            extra_context.append(f"### Ayurvedic Knowledge Base (RAG):\n{kb_context}")

        for img_f in image_files:
            if img_f and img_f.filename:
                img_bytes = img_f.read()
                mime_type = img_f.mimetype or "image/jpeg"
                parts.append(types.Part.from_bytes(data=img_bytes, mime_type=mime_type))

        combined_context = "\n\n".join(extra_context)
        if combined_context:
            full_prompt = f"{combined_context}\n\n### User Question:\n{prompt}"
        else:
            full_prompt = prompt

        parts.append(types.Part.from_text(text=full_prompt))

        system_instruction = (
            "You are ZENIVA, an expert Ayurvedic AI Clinical Assistant.\n"
            "Core Guidelines:\n"
            "1. Clinical Excellence: Personalize Ayurvedic advice using Tridosha (Vata, Pitta, Kapha), Prakriti, Vikriti, Agni, and Ama.\n"
            "2. Doctor & Patient Lookup: Accurately reference doctors or patient EHR data if asked.\n"
            "3. Emergency: For severe emergencies, urge immediate 108/112 contact.\n"
            "4. Speech Friendly: Write clean, pleasant, punctuated sentences without cluttered markdown or complex symbols so Text-to-Speech sounds natural and uninterrupted."
        )

        if target_lang == "mr":
            system_instruction += "\nCRITICAL LANGUAGE DIRECTIVE: The user selected MARATHI. You MUST respond 100% strictly in pure, natural Marathi (मराठी) only!"
        elif target_lang == "hi":
            system_instruction += "\nCRITICAL LANGUAGE DIRECTIVE: The user selected HINDI. You MUST respond 100% strictly in pure, natural Hindi (हिन्दी) only!"
        elif target_lang == "en":
            system_instruction += "\nCRITICAL LANGUAGE DIRECTIVE: The user selected ENGLISH. You MUST respond 100% strictly in fluent, professional English only!"
        elif target_lang == "mr_to_en":
            system_instruction += "\nCRITICAL TRANSLATION DIRECTIVE: Translate and explain the user's Marathi query completely into clear, professional ENGLISH."
        elif target_lang == "en_to_mr":
            system_instruction += "\nCRITICAL TRANSLATION DIRECTIVE: Translate and explain the user's English query completely into authentic, pure MARATHI (मराठी)."
        elif target_lang == "hi_to_mr":
            system_instruction += "\nCRITICAL TRANSLATION DIRECTIVE: Translate and explain the user's Hindi query completely into authentic, pure MARATHI (मराठी)."
        else:
            system_instruction += "\nRespond naturally in the same language as the user's query (prefer clear Marathi when asked in Marathi or Devanagari)."

        reply_text = None
        last_err = None

        for model_cand in [MODEL] + [m for m in FALLBACK_MODELS if m != MODEL]:
            try:
                response = client.models.generate_content(
                    model=model_cand,
                    contents=[types.Content(role="user", parts=parts)],
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.4
                    )
                )
                if response and response.text:
                    reply_text = response.text.strip()
                    break
            except Exception as model_err:
                last_err = str(model_err)
                continue

        if reply_text:
            return jsonify({
                "reply": reply_text,
                "has_patient": bool(patient),
                "has_doctor": any(w in prompt.lower() for w in ["doctor", "appointment", "डॉक्टर", "अपॉइंटमेंट"])
            })
        else:
            return jsonify({"reply": f"एरर: {last_err or 'उत्तर देण्यात अडचण आली.'}", "error": True}), 200

    except Exception as e:
        return jsonify({"reply": f"एरर: {str(e)}", "error": True}), 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)
