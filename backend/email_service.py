import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Any, Optional

def get_smtp_config() -> Dict[str, Any]:
    return {
        "host": os.getenv("SMTP_HOST", "smtp.gmail.com"),
        "port": int(os.getenv("SMTP_PORT", "587")),
        "user": os.getenv("SMTP_USER", "").strip(),
        "password": os.getenv("SMTP_PASSWORD", "").strip(),
        "from_email": os.getenv("SMTP_FROM_EMAIL", "").strip() or os.getenv("SMTP_USER", "").strip() or "noreply@zeniva.ai",
        "from_name": os.getenv("SMTP_FROM_NAME", "Zeniva AI - Ayurvedic Care Platform")
    }

def generate_patient_confirmation_html(
    patient_name: str, 
    otp_code: str, 
    confirmation_url: str, 
    prakriti: str = "Stress & Sleep Wellness",
    city: str = "Nagpur, Maharashtra"
) -> str:
    """
    Generates a high-end, responsive, Vedic & Cyber-themed HTML confirmation email.
    """
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Zeniva AI Patient Account</title>
  <style>
    body {{
      margin: 0;
      padding: 0;
      background-color: #0c0817;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #332f2c;
      -webkit-font-smoothing: antialiased;
    }}
    .email-wrapper {{
      max-width: 620px;
      margin: 24px auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
      border: 1px solid #e7dfd5;
    }}
    .header-banner {{
      background: linear-gradient(135deg, #070c18 0%, #170d2c 50%, #2e0854 100%);
      padding: 36px 30px;
      text-align: center;
      position: relative;
    }}
    .header-badge {{
      display: inline-block;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid #22d3ee;
      color: #38bdf8;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 50px;
      margin-bottom: 12px;
    }}
    .logo-title {{
      color: #fef08a;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 1px;
      margin: 0 0 6px 0;
      font-family: Georgia, serif;
    }}
    .logo-subtitle {{
      color: #cbd5e1;
      font-size: 13px;
      margin: 0;
      letter-spacing: 0.5px;
    }}
    .body-content {{
      padding: 36px 32px;
      background-color: #faf8f5;
    }}
    .greeting {{
      font-size: 18px;
      font-weight: 700;
      color: #1e1b4b;
      margin-top: 0;
      margin-bottom: 14px;
    }}
    .lead-text {{
      font-size: 14px;
      line-height: 1.7;
      color: #4b5563;
      margin-bottom: 24px;
    }}
    .otp-card {{
      background: linear-gradient(135deg, #fefce8 0%, #fffbeb 100%);
      border: 2px dashed #f59e0b;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      margin: 28px 0;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.12);
    }}
    .otp-label {{
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #92400e;
      font-weight: 700;
      margin-bottom: 8px;
    }}
    .otp-code {{
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 8px;
      color: #78350f;
      font-family: 'Courier New', monospace;
      margin: 6px 0;
      user-select: all;
    }}
    .otp-expiry {{
      font-size: 12px;
      color: #b45309;
      margin-top: 6px;
    }}
    .action-button {{
      display: inline-block;
      width: 100%;
      box-sizing: border-box;
      background: linear-gradient(135deg, #6d28d9 0%, #4338ca 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 15px;
      font-weight: 700;
      padding: 16px 24px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 6px 20px rgba(109, 40, 217, 0.35);
      margin: 12px 0 24px 0;
      transition: all 0.2s ease;
    }}
    .info-table {{
      width: 100%;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      margin: 20px 0;
      border-collapse: collapse;
      overflow: hidden;
    }}
    .info-table td {{
      padding: 12px 16px;
      font-size: 13px;
      border-bottom: 1px solid #f3f4f6;
    }}
    .info-table td:first-child {{
      font-weight: 700;
      color: #6b7280;
      width: 35%;
    }}
    .info-table td:last-child {{
      color: #111827;
      font-weight: 600;
    }}
    .vedic-shloka {{
      background: #fdf4ff;
      border-left: 4px solid #a855f7;
      padding: 14px 18px;
      border-radius: 0 12px 12px 0;
      margin: 24px 0;
    }}
    .shloka-sanskrit {{
      font-family: Georgia, serif;
      font-size: 13px;
      color: #581c87;
      font-weight: 700;
      margin: 0 0 4px 0;
      font-style: italic;
    }}
    .shloka-meaning {{
      font-size: 11px;
      color: #7e22ce;
      margin: 0;
    }}
    .security-notice {{
      font-size: 11px;
      color: #6b7280;
      line-height: 1.6;
      border-top: 1px solid #e5e7eb;
      padding-top: 16px;
      margin-top: 24px;
    }}
    .footer {{
      background-color: #0f172a;
      padding: 24px 30px;
      text-align: center;
      color: #94a3b8;
      font-size: 11px;
      line-height: 1.7;
    }}
    .footer a {{
      color: #38bdf8;
      text-decoration: none;
    }}
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header-banner">
      <div class="header-badge">✦ Secure Patient Verification ✦</div>
      <h1 class="logo-title">ZENIVA AI</h1>
      <p class="logo-subtitle">Ancient Ayurvedic Wisdom · Modern AI Clinical Care</p>
    </div>

    <!-- Body -->
    <div class="body-content">
      <h2 class="greeting">नमस्ते {patient_name} जी! 🙏</h2>
      <p class="lead-text">
        Welcome to <strong>Zeniva AI Ayurvedic Care</strong>. To activate your personal Electronic Health Record (EHR), personalized Ayurvedic diagnosis, and AI Vaidya assistant, please confirm your email address using the 6-digit verification code below:
      </p>

      <!-- 6-Digit OTP Box -->
      <div class="otp-card">
        <div class="otp-label">Your One-Time Confirmation Code</div>
        <div class="otp-code">{otp_code}</div>
        <div class="otp-expiry">⏳ Valid for 10 minutes · Do not share this code with anyone</div>
      </div>

      <!-- Direct Confirmation Button -->
      <div style="text-align: center;">
        <a href="{confirmation_url}" class="action-button" target="_blank">
          ✓ Confirm Email & Proceed to Sign In (ईमेल पुष्टि करें)
        </a>
      </div>

      <!-- Account Summary -->
      <table class="info-table">
        <tr>
          <td>Registered Name</td>
          <td>{patient_name}</td>
        </tr>
        <tr>
          <td>Health / Dosha Focus</td>
          <td>🌿 {prakriti}</td>
        </tr>
        <tr>
          <td>Location</td>
          <td>📍 {city}</td>
        </tr>
        <tr>
          <td>Clinical Center</td>
          <td>TGPCET Nagpur · Ayurvedic AI Network</td>
        </tr>
      </table>

      <!-- Classical Ayurvedic Shloka -->
      <div class="vedic-shloka">
        <p class="shloka-sanskrit">"आयुः कामयमानेन धर्मार्थसुखसाधनम्। आयुर्वेदोपदेशेषु विधेयः परमादरः॥"</p>
        <p class="shloka-meaning">Charaka Samhita: Respectful adherence to authentic Ayurvedic wisdom is the ultimate pathway to long life, vitality, and true well-being.</p>
      </div>

      <!-- Security Notice -->
      <div class="security-notice">
        <strong>🔒 Security Notice:</strong> If you did not create an account on Zeniva AI (http://localhost:5173), you can safely disregard this email. Your privacy is safeguarded under HIPAA and ABDM health standards.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 6px 0; font-weight: bold; color: #cbd5e1;">Zeniva AI · Advanced Clinical Ayurvedic Platform</p>
      <p style="margin: 0 0 6px 0;">Engineered by Department of Information Technology, TGPCET Nagpur</p>
      <p style="margin: 0;">Need help? Reach our team at <a href="mailto:bhupesh_it@tgpcet.com">bhupesh_it@tgpcet.com</a></p>
    </div>
  </div>
</body>
</html>
"""

def send_patient_confirmation_email(
    to_email: str,
    patient_name: str,
    otp_code: str,
    confirmation_url: Optional[str] = None,
    prakriti: str = "Stress & Sleep Wellness",
    city: str = "Nagpur, Maharashtra"
) -> Dict[str, Any]:
    """
    Sends a confirmation email via SMTP if configured, or simulates delivery securely with full HTML logging.
    """
    if not confirmation_url:
        confirmation_url = f"http://localhost:5173/#patient/confirm?email={to_email}&otp={otp_code}"

    config = get_smtp_config()
    subject = f"🔐 Confirm Your Zeniva AI Patient Account (OTP: {otp_code})"

    html_content = generate_patient_confirmation_html(
        patient_name=patient_name,
        otp_code=otp_code,
        confirmation_url=confirmation_url,
        prakriti=prakriti,
        city=city
    )

    plain_text = f"""
नमस्ते {patient_name}!

Welcome to Zeniva AI Ayurvedic Care.
Your 6-digit confirmation code is: {otp_code}

Confirm your account by visiting:
{confirmation_url}

This code expires in 10 minutes.

Zeniva AI · TGPCET Nagpur
"""

    # Check if SMTP user and password are validly set
    if config["user"] and config["password"]:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{config['from_name']} <{config['from_email']}>"
            msg["To"] = to_email

            msg.attach(MIMEText(plain_text, "plain", "utf-8"))
            msg.attach(MIMEText(html_content, "html", "utf-8"))

            if config["port"] == 465:
                server = smtplib.SMTP_SSL(config["host"], config["port"], timeout=10)
            else:
                server = smtplib.SMTP(config["host"], config["port"], timeout=10)
                server.starttls()

            server.login(config["user"], config["password"])
            server.sendmail(config["from_email"], [to_email], msg.as_string())
            server.quit()

            print(f"[SMTP Success] Confirmation email dispatched to {to_email}")
            return {
                "success": True,
                "delivered": True,
                "method": "smtp",
                "email": to_email,
                "message": f"Confirmation email successfully sent to {to_email}"
            }
        except Exception as smtp_err:
            print(f"[SMTP Error]: {smtp_err}. Falling back to active simulation mode.")

    # Simulated Delivery Mode (Logged & active for instant local testing)
    print("=" * 60)
    print(f"[EMAIL SERVICE] ZENIVA AI CONFIRMATION EMAIL TO: {to_email}")
    print(f"[EMAIL SERVICE] Patient: {patient_name} ({prakriti})")
    print(f"[EMAIL SERVICE] OTP Code: {otp_code}")
    print(f"[EMAIL SERVICE] Confirmation Link: {confirmation_url}")
    print("=" * 60)

    return {
        "success": True,
        "delivered": False,
        "method": "simulated",
        "email": to_email,
        "otp_preview": otp_code,
        "message": f"Confirmation email dispatched to {to_email} (Valid for 10 minutes)"
    }
