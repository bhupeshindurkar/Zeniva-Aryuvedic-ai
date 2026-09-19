import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
MODEL = os.getenv("ZENIVA_MODEL", "gemini-3.5-flash")
ZENIVA_PROVIDER = os.getenv("ZENIVA_PROVIDER", "gemini")
