#! C:\xampp\htdocs\WebServerAI\.venv\Scripts\python.exe
from summarizer import Summarizer

# importing libraries 
import os, json

# Enter any text here
currentPath = os.getcwd()+"/data/txttosummary.json"
with open(currentPath) as json_file:
	data=json.load(json_file)

text = data['text']
summaryLen = data['sentences']

summarizer = Summarizer()
summary = summarizer(text,num_sentences=summaryLen,use_first=False)

print("Content-Type: application/json\n")
info = {'text':text,'summary':summary}
print(json.dumps(info))