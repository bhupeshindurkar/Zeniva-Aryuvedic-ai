import datetime
import subprocess
import webbrowser
import urllib.parse

def handle_command(text):
    t = text.lower().strip()

    if t in {"exit", "quit", "stop", "shutdown"}:
        return "EXIT"

    if "time" in t:
        return f"The time is {datetime.datetime.now().strftime('%I:%M %p')}."

    if "date" in t or "today" in t:
        return f"Today is {datetime.datetime.now().strftime('%A, %d %B %Y')}."

    if "chrome" in t and "open" in t:
        subprocess.Popen(["cmd", "/c", "start", "", "chrome"])
        return "Opening Chrome."

    if "notepad" in t and "open" in t:
        subprocess.Popen(["notepad.exe"])
        return "Opening Notepad."

    if ("calculator" in t or "calc" in t) and "open" in t:
        subprocess.Popen(["calc.exe"])
        return "Opening Calculator."

    if "youtube" in t and "open" in t:
        webbrowser.open("https://www.youtube.com")
        return "Opening YouTube."

    if t.startswith("search "):
        query = text[7:].strip()
        if query:
            webbrowser.open("https://www.google.com/search?q=" + urllib.parse.quote(query))
            return f"Searching Google for {query}."

    if t.startswith("youtube search "):
        query = text[len("youtube search "):].strip()
        if query:
            webbrowser.open("https://www.youtube.com/results?search_query=" + urllib.parse.quote(query))
            return f"Searching YouTube for {query}."

    return None
