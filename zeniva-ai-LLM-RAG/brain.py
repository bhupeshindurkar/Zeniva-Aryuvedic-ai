from google import genai
from google.genai import types

from config import GEMINI_API_KEY, MODEL


class ZenivaBrain:

    def __init__(self):
        self.history = []

        if not GEMINI_API_KEY:
            self.client = None
        else:
            self.client = genai.Client(
                api_key=GEMINI_API_KEY
            )

    def reply(self, text):

        if not self.client:
            return "Gemini API key is missing. Please check your .env file."

        try:
            self.history.append({
                "role": "user",
                "content": text
            })

            contents = []

            for item in self.history[-10:]:
                role = "model" if item["role"] == "assistant" else "user"

                contents.append(
                    types.Content(
                        role=role,
                        parts=[
                            types.Part.from_text(
                                text=item["content"]
                            )
                        ]
                    )
                )

            response = self.client.models.generate_content(
                model=MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=(
                        "You are ZENIVA, a helpful personal AI assistant. "
                        "Answer clearly, briefly and naturally."
                    ),
                    temperature=0.4
                )
            )

            answer = response.text.strip()

            self.history.append({
                "role": "assistant",
                "content": answer
            })

            return answer

        except Exception as e:
            print("Gemini Error:", e)
            return "Sorry, I could not process your request."