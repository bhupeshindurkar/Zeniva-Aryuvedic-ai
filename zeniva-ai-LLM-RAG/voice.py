import speech_recognition as sr
import pyttsx3


class Voice:

    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.engine = pyttsx3.init()

        self.engine.setProperty("rate", 170)
        self.engine.setProperty("volume", 1.0)
        
        # Set female voice if available
        try:
            voices = self.engine.getProperty("voices")
            female_voice = None
            for v in voices:
                name_lower = v.name.lower()
                if any(keyword in name_lower for keyword in ["zira", "female", "swara", "hazel", "kalpana", "heera", "woman", "samantha"]):
                    female_voice = v.id
                    break
            if not female_voice and len(voices) > 1:
                female_voice = voices[1].id
            if female_voice:
                self.engine.setProperty("voice", female_voice)
        except Exception:
            pass

    def listen(self):

        with sr.Microphone() as source:

            print("\nZENIVA is listening...")

            self.recognizer.adjust_for_ambient_noise(
                source,
                duration=0.5
            )

            try:
                audio = self.recognizer.listen(
                    source,
                    timeout=5,
                    phrase_time_limit=8
                )

            except sr.WaitTimeoutError:
                print("No voice detected.")
                return ""

        try:

            text = self.recognizer.recognize_google(audio)

            print("You:", text)

            return text

        except sr.UnknownValueError:

            print("I could not understand the voice.")

            return ""

        except sr.RequestError as e:

            print("Speech recognition error:", e)

            return ""

    def speak(self, text):

        print("ZENIVA:", text)

        self.engine.say(text)
        self.engine.runAndWait()