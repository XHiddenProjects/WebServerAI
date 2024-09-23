#! C:\\xampp\\htdocs\\WebServerAI\\.venv\\Scripts\\python.exe

from googletrans import Translator
import os, json

currentPath = os.getcwd() + "/data/translateTxt.json"

with open(currentPath) as json_file:
    data = json.load(json_file)

translator = Translator()
inputText = str(data['textToTranslate'])
translateFrom = str(data['translateFrom'])
translateTo = str(data['translateTo'])
finalize = {}

if inputText != '' and translateTo:
    translated_text = translator.translate(inputText,dest=translateTo,src=translateFrom)
    finalize['translated'] = translated_text.text
else:
    finalize['error'] = {'code': 1, 'reason': 'No input/translate was made'}

print("Content-Type: application/json\n")
print(json.dumps(finalize))