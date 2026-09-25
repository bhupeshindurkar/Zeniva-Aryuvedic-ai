import sqlite3
import json
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "zeniva.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table (Comprehensive Patient & User Profiles)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        phone TEXT UNIQUE,
        name TEXT,
        email TEXT,
        age TEXT,
        gender TEXT,
        role TEXT DEFAULT 'patient', -- 'patient', 'doctor', 'super_admin'
        title TEXT,
        prakriti TEXT,
        vikriti TEXT,
        specialization TEXT,
        location TEXT,
        city TEXT,
        blood_group TEXT,
        diet TEXT,
        agribalam TEXT,
        avatar TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Dynamic Column Migration (Safely adds any missing profile columns without data loss)
    for col, ctype in [
        ("email", "TEXT"),
        ("age", "TEXT"),
        ("gender", "TEXT"),
        ("prakriti", "TEXT"),
        ("vikriti", "TEXT"),
        ("location", "TEXT"),
        ("city", "TEXT"),
        ("blood_group", "TEXT"),
        ("diet", "TEXT"),
        ("agribalam", "TEXT"),
        ("password_hash", "TEXT")
    ]:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col} {ctype}")
        except Exception:
            pass

    # Admin Sessions / Tokens Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS admin_sessions (
        token TEXT PRIMARY KEY,
        username TEXT,
        role TEXT DEFAULT 'SUPER_ADMIN',
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Dedicated Registered Doctors Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY, -- Zeniva Doctor ID format: ZEN-DOC-XXXXXX
        phone TEXT UNIQUE,
        name TEXT,
        email TEXT,
        dob TEXT,
        gender TEXT,
        profession TEXT DEFAULT 'Ayurvedic Physician',
        role TEXT DEFAULT 'Consultant Vaidya',
        specialization TEXT,
        qualification TEXT,
        experience_years INTEGER DEFAULT 0,
        organization TEXT,
        city TEXT,
        council_name TEXT, -- e.g. Maharashtra Council of Indian Medicine
        council_reg_number TEXT, -- Official Government / State Council Reg No.
        documents_json TEXT, -- JSON holding uploaded certificate paths & names
        avatar TEXT,
        password_hash TEXT,
        status TEXT DEFAULT 'pending_verification', -- 'pending_verification', 'verified', 'rejected'
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified_at TIMESTAMP
    )
    """)

    # Dynamic Column Migration for Doctors Table
    for col, ctype in [
        ("email", "TEXT"),
        ("password_hash", "TEXT"),
        ("city", "TEXT"),
        ("organization", "TEXT"),
        ("specialization", "TEXT"),
        ("qualification", "TEXT"),
        ("avatar", "TEXT"),
        ("status", "TEXT")
    ]:
        try:
            cursor.execute(f"ALTER TABLE doctors ADD COLUMN {col} {ctype}")
        except Exception:
            pass

    # OTP Storage Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS otp_codes (
        phone TEXT PRIMARY KEY,
        otp_code TEXT,
        expires_at TIMESTAMP,
        verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Patient Email Confirmations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patient_confirmations (
        email TEXT PRIMARY KEY,
        name TEXT,
        phone TEXT,
        city TEXT,
        prakriti TEXT,
        password_hash TEXT,
        otp_code TEXT,
        token TEXT,
        expires_at TIMESTAMP,
        verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Appointments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patient_name TEXT,
        doctor_name TEXT,
        date_time TEXT,
        type TEXT, -- 'Consultation', 'Follow-up'
        status TEXT, -- 'Upcoming', 'Completed', 'Cancelled'
        dosha_imbalance TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Doctor Review (Manual Photo & Clinical Review Queue)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctor_reviews (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        patient_name TEXT,
        doctor_name TEXT,
        image_url TEXT,
        symptoms TEXT,
        review_notes TEXT,
        status TEXT DEFAULT 'pending_doctor_review',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Dosha Assessments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dosha_assessments (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        user_name TEXT,
        vata INTEGER,
        pitta INTEGER,
        kapha INTEGER,
        primary_dosha TEXT,
        wellness_score INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Classical Ayurvedic RAG Knowledge Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ayurvedic_corpus (
        id TEXT PRIMARY KEY,
        samhita TEXT,
        chapter TEXT,
        sutra_title TEXT,
        category TEXT,
        sanskrit_sloka TEXT,
        english_translation TEXT,
        indications TEXT,
        herbal_remedies TEXT,
        lifestyle_advice TEXT
    )
    """)

    # Real-Time Patient AI Chat Triage & Doctor Visibility Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patient_ai_chats (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        patient_name TEXT,
        phone TEXT,
        city TEXT,
        prakriti TEXT,
        primary_concern TEXT,
        dosha_imbalance TEXT,
        last_query TEXT,
        last_reply TEXT,
        messages_json TEXT,
        status TEXT DEFAULT 'pending_doctor_review',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Real-Time Targeted Doctor-to-Patient Notifications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS targeted_notifications (
        id TEXT PRIMARY KEY,
        patient_id TEXT,
        patient_phone TEXT,
        patient_name TEXT,
        doctor_name TEXT,
        doctor_avatar TEXT,
        doctor_specialization TEXT,
        title TEXT,
        message TEXT,
        type TEXT DEFAULT 'doctor_message',
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # System Broadcast Video Table (Universal Cross-Browser Persistence)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS system_broadcasts (
        key TEXT PRIMARY KEY,
        enabled INTEGER DEFAULT 0,
        title TEXT,
        sanskrit TEXT,
        duration TEXT,
        url TEXT,
        desc TEXT,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # System Issues, Patient Grievances, Doctor Queries & Support Tickets Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS system_issues_and_tickets (
        id TEXT PRIMARY KEY,
        ticket_id TEXT UNIQUE,
        user_role TEXT DEFAULT 'guest',
        sender_name TEXT,
        sender_email TEXT,
        sender_phone TEXT,
        issue_category TEXT,
        subject TEXT,
        description TEXT,
        status TEXT DEFAULT 'open',
        notification_target_email TEXT DEFAULT 'contact.zeniva@gmail.com',
        notification_dispatched INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Seed permanent default active broadcast if empty or missing
    cursor.execute("SELECT COUNT(*) FROM system_broadcasts WHERE key = 'active_broadcast'")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO system_broadcasts (key, enabled, title, sanskrit, duration, url, desc, published_at)
        VALUES (
            'active_broadcast', 
            1, 
            'Zeniva AI: Video Project Showcase', 
            '॥ आयुर्वेद एवं आधुनिक विज्ञान परिचय ॥', 
            '10:00 sec', 
            'http://127.0.0.1:8000/uploads/broadcast_db5be5d0.mp4', 
            'Welcome to Zeniva AI. Discover how authentic Charaka Samhita formulas and AI Clinical Health assessments work together with certified doctors.', 
            CURRENT_TIMESTAMP
        )
        """)

    # Ensure Super Admin exists by default
    cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'super_admin'")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO users (id, phone, name, role, title, specialization, avatar) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, ("usr_admin", "9800000000", "Super Admin", "super_admin", "Administrator", "System & Governance", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"))

    conn.commit()
    conn.close()

def reset_db_to_clean_slate():
    """Wipes all mock data so only live registered users exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM doctors")
    cursor.execute("DELETE FROM users WHERE role != 'super_admin'")
    cursor.execute("DELETE FROM appointments")
    cursor.execute("DELETE FROM doctor_reviews")
    cursor.execute("DELETE FROM dosha_assessments")
    conn.commit()
    conn.close()
    print("Database cleaned: All dummy doctors and patients removed.")

# Auto-initialize database tables and column migrations on import
try:
    init_db()
except Exception as e:
    print("[Database Init Warning]:", e)

if __name__ == "__main__":
    init_db()
    reset_db_to_clean_slate()
    print("Database initialized cleanly.")
