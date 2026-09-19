from voice import Voice
from brain import ZenivaBrain
from commands import handle_command


def main():

    print("=" * 50)
    print("        ZENIVA - Personal AI Assistant")
    print("=" * 50)

    voice = Voice()
    brain = ZenivaBrain()

    voice.speak(
        "Hello. I am Zeniva. How can I help you?"
    )

    while True:

        text = voice.listen()

        if not text:
            continue

        command_result = handle_command(text)

        if command_result == "EXIT":

            voice.speak(
                "Goodbye. See you soon."
            )

            break

        if command_result:

            voice.speak(command_result)

            continue

        answer = brain.reply(text)

        voice.speak(answer)


if __name__ == "__main__":
    main()