#! <Enter Python Compiler Here>



# importing libraries 

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

import nltk, json
nltk.download("stopwords")
nltk.download("punkt")

import os

# Enter any text here
currentPath = os.getcwd()+"/data/txttosummary.json"
with open(currentPath) as json_file:
	data=json.load(json_file)

text = data['text']
summaryLen = data['length']



stopwords = set(stopwords.words("english"))
words = word_tokenize(text)

# Check for repeated words
freqTable = dict()
for word in words:
	word = word.lower()
	if word in stopwords:
		continue
	if word in freqTable:
		freqTable[word]+=1
	else:
		freqTable[word]=1
# Creating a dictionary to keep score of seach sentences here
sentences = sent_tokenize(text)

def getSentenceValue():
	sentenceValue = dict()
	for sentence in sentences:
		for word, freq in freqTable.items():
			if word in sentence.lower():
				if sentence in sentenceValue:
					sentenceValue[sentence] += freq
				else:
					sentenceValue[sentence] = freq
	return sentenceValue

sentenceValue = getSentenceValue()

def getSumValue():
	sumValues = 0
	for sentence in sentenceValue:
		sumValues += sentenceValue[sentence]
	# Average of sentences
	average = int(sumValues / len(sentenceValue)) if len(sentenceValue) > 0 else 0
	return average

average = getSumValue()

# Storing the summary. Greater the Number, the summary gets shorter
summary = ""
for sentence in sentences:
	if (sentence in sentenceValue) and (sentenceValue[sentence] > (summaryLen * average)):
		summary+=" "+sentence

print("Content-Type: application/json\n")
info = {'summary':summary.strip()}
print(json.dumps(info))