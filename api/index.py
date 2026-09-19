import sys
import os

# Insert backend folder into sys.path so all imports inside backend work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.main import app
