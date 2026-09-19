# ZENIVA - सोप्या भाषेत प्रोजेक्ट माहिती

## ZENIVA म्हणजे काय?

ZENIVA हा आयुर्वेदासाठी बनवलेला AI Assistant आहे. यात user प्रश्न विचारू शकतो आणि AI उत्तर देऊ शकतो.

या project मध्ये खालील सुविधा आहेत:

- आयुर्वेदाविषयी प्रश्नांची उत्तरे
- मराठी, हिंदी आणि इंग्रजी भाषेचा वापर
- Patient profile पाहणे
- Doctor शोधणे
- Appointment booking चे demo
- PDF, TXT किंवा CSV file upload करून माहिती वापरणे
- Emergency प्रश्न आल्यास 108 किंवा 112 वर संपर्क करण्याचा संदेश
- Doctors, patients आणि Ayurveda knowledge base चा data

## Project कसे काम करते?

1. User website वर प्रश्न किंवा माहिती देतो.
2. Flask server तो प्रश्न घेतो.
3. Gemini AI आणि project मधील data वापरून उत्तर तयार होते.
4. उत्तर website वर दाखवले जाते.

हा project वैद्यकीय डॉक्टरचा पर्याय नाही. Emergency मध्ये लगेच रुग्णालयाशी संपर्क करा.

## Run करण्यासाठी काय लागेल?

- Windows computer
- Python 3.11 किंवा त्यापेक्षा नवीन version
- Gemini API key
- Internet connection

## Run करण्याची पद्धत

### पद्धत 1: सोपी पद्धत

Project folder मध्ये `run_zeniva.bat` file वर double-click करा.

नंतर browser मध्ये ही link उघडेल:

```text
http://127.0.0.1:5000
```

### पद्धत 2: Terminal मधून

Project folder मध्ये PowerShell उघडा आणि हे commands चालवा:

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

नंतर browser मध्ये `http://127.0.0.1:5000` उघडा.

## Gemini API key सेट करणे

Project folder मध्ये `.env` नावाची file तयार करा आणि त्यात हे लिहा:

```text
GEMINI_API_KEY=तुमची_gemini_api_key
ZENIVA_MODEL=gemini-3.5-flash
ZENIVA_PROVIDER=gemini
```

`तुमची_gemini_api_key` च्या जागी तुमची खरी API key लिहा. API key कोणालाही share करू नका.

API key नसेल तरी website उघडेल, पण AI chat चालणार नाही.

## महत्वाच्या files

- `app.py` - मुख्य Flask server आणि API
- `config.py` - API key आणि model ची settings
- `templates/index.html` - website चा page
- `static/` - website चे extra files
- `data/doctors.json` - doctors ची माहिती
- `data/patients.json` - patients ची माहिती
- `data/knowledge_base.json` - Ayurveda माहिती
- `requirements.txt` - Python packages
- `run_zeniva.bat` - project सुरू करण्यासाठी shortcut

## Project बंद कसा करायचा?

ज्या terminal मध्ये project चालू आहे तिथे `Ctrl + C` दाबा.
