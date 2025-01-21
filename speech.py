import sys
import speech_recognition as sr

recognizer = sr.Recognizer()

with sr.AudioFile("../temp/"+sys.argv[1]+'.wav') as source:
    recorded_audio = recognizer.listen(source)

try:
    text = recognizer.recognize_google(
            recorded_audio, 
            language=sys.argv[2]
        )
    print(format(text))

except Exception as ex:
    print(ex)