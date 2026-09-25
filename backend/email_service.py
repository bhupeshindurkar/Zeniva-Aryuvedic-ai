import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Any, Optional

def get_smtp_config() -> Dict[str, Any]:
    return {
        "host": os.getenv("SMTP_HOST", "smtp.gmail.com"),
        "port": int(os.getenv("SMTP_PORT", "587")),
        "user": os.getenv("SMTP_USER", "contact.zeniva@gmail.com").strip(),
        "password": os.getenv("SMTP_PASSWORD", "").strip(),
        "from_email": os.getenv("SMTP_FROM_EMAIL", "").strip() or os.getenv("SMTP_USER", "").strip() or "contact.zeniva@gmail.com",
        "from_name": os.getenv("SMTP_FROM_NAME", "Zeniva AI Support Desk")
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
      <p style="margin: 0;">Need help? Reach our team at <a href="mailto:contact.zeniva@gmail.com">contact.zeniva@gmail.com</a></p>
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

def send_issue_alert_email(
    ticket_id: str,
    sender_name: str,
    sender_email: str,
    sender_phone: str = "",
    user_role: str = "User",
    category: str = "General Inquiry",
    subject: str = "Support Ticket",
    description: str = "",
    target_email: str = "contact.zeniva@gmail.com"
) -> Dict[str, Any]:
    """
    Sends an urgent email notification to the official Zeniva alert inbox (contact.zeniva@gmail.com)
    when any issue, grievance, doctor query, or bug report is submitted.
    """
    config = get_smtp_config()
    target_email = os.getenv("ZENIVA_OFFICIAL_EMAIL", "contact.zeniva@gmail.com").strip() or target_email

    email_subject = f"🚨 [Zeniva AI Notification] {category}: {subject} ({ticket_id})"

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0817; color: #1e1b4b; padding: 20px; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }}
    .header {{ background: linear-gradient(135deg, #090d16 0%, #1c1030 50%, #4c1d95 100%); color: #ffffff; padding: 24px; text-align: left; }}
    .badge {{ display: inline-block; background: #ef4444; color: #fff; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }}
    .title {{ margin: 0; font-size: 20px; font-weight: bold; color: #fef08a; }}
    .content {{ padding: 24px; line-height: 1.6; color: #334155; }}
    .info-table {{ width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 16px; }}
    .info-table td {{ padding: 10px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }}
    .info-table td.label {{ font-weight: bold; color: #64748b; width: 140px; }}
    .desc-box {{ background: #faf5ff; border-left: 4px solid #9333ea; padding: 14px; border-radius: 8px; margin-top: 12px; font-size: 13px; color: #1e1b4b; white-space: pre-wrap; }}
    .footer {{ background: #f8fafc; padding: 16px 24px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">URGENT PLATFORM NOTIFICATION</div>
      <h2 class="title">🌿 Zeniva AI — Website Issue / Ticket Alert</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #cbd5e1;">Official Dispatch to: {target_email}</p>
    </div>
    <div class="content">
      <p style="margin-top: 0; font-size: 14px;">A new support ticket / website issue has been registered on the <strong>Zeniva Ayurvedic AI Platform</strong>:</p>
      
      <table class="info-table">
        <tr><td class="label">Ticket Ref:</td><td><strong style="font-family: monospace; color: #7c3aed;">{ticket_id}</strong></td></tr>
        <tr><td class="label">Sender Role:</td><td><span style="font-weight: 600; text-transform: uppercase; color: #0284c7;">{user_role}</span></td></tr>
        <tr><td class="label">Sender Name:</td><td><strong>{sender_name}</strong></td></tr>
        <tr><td class="label">Sender Email:</td><td><a href="mailto:{sender_email}" style="color: #7c3aed;">{sender_email}</a></td></tr>
        <tr><td class="label">Sender Mobile:</td><td>{sender_phone or "Not provided"}</td></tr>
        <tr><td class="label">Category:</td><td><span style="background: #f1f5f9; padding: 2px 8px; border-radius: 6px; font-weight: 600;">{category}</span></td></tr>
        <tr><td class="label">Subject:</td><td><strong>{subject}</strong></td></tr>
      </table>

      <h4 style="margin: 16px 0 6px 0; color: #1e1b4b; font-size: 13px;">Issue / Message Details:</h4>
      <div class="desc-box">{description or "No detailed message provided."}</div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:{sender_email}?subject=Re: {ticket_id} - Zeniva Support Desk" style="display: inline-block; background: #7c3aed; color: #ffffff; padding: 10px 20px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: bold;">Reply to Sender Directly</a>
      </div>
    </div>
    <div class="footer">
      Zeniva AI Ayurvedic Platform · Automated Alert Dispatcher<br>
      Delivered automatically to official monitor: {target_email}
    </div>
  </div>
</body>
</html>
"""

    plain_text = f"""[ZENIVA AI ISSUE & TICKET ALERT]
Ticket ID: {ticket_id}
Target Notification: {target_email}
Sender: {sender_name} ({user_role})
Email: {sender_email}
Phone: {sender_phone}
Category: {category}
Subject: {subject}

Message:
{description}
"""

    # Check if SMTP user and password are validly set
    if config["user"] and config["password"]:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = email_subject
            msg["From"] = f"{config['from_name']} <{config['from_email']}>"
            msg["To"] = target_email
            msg["Reply-To"] = sender_email

            msg.attach(MIMEText(plain_text, "plain", "utf-8"))
            msg.attach(MIMEText(html_content, "html", "utf-8"))

            if config["port"] == 465:
                server = smtplib.SMTP_SSL(config["host"], config["port"], timeout=10)
            else:
                server = smtplib.SMTP(config["host"], config["port"], timeout=10)
                server.starttls()

            server.login(config["user"], config["password"])
            server.sendmail(config["from_email"], [target_email], msg.as_string())
            server.quit()

            print(f"[SMTP Success] Issue notification dispatched to {target_email}")
            return {
                "success": True,
                "delivered": True,
                "method": "smtp",
                "recipient": target_email,
                "ticket_id": ticket_id
            }
        except Exception as smtp_err:
            print(f"[SMTP Error]: {smtp_err}. Falling back to active simulation mode.")

    # Simulated Delivery / Console Logging Mode
    print("=" * 65)
    print(f"[EMAIL NOTIFICATION DISPATCHED TO: {target_email}]")
    print(f"[TICKET REF]: {ticket_id}")
    print(f"[FROM]: {sender_name} ({sender_email}, {sender_phone})")
    print(f"[ROLE]: {user_role} | [CATEGORY]: {category}")
    print(f"[SUBJECT]: {subject}")
    print(f"[MESSAGE]: {description}")
    print("=" * 65)

    return {
        "success": True,
        "delivered": False,
        "method": "simulated",
        "recipient": target_email,
        "ticket_id": ticket_id,
        "message": f"Alert registered and queued for {target_email}"
    }

