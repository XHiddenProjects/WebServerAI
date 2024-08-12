#! C:\xampp\htdocs\WebServerAI\.venv\Scripts\python.exe
import webcolors, json, os

currentPath = os.getcwd()+"/data/colorData.json"
with open(currentPath) as json_file:
	data=json.load(json_file)

colorVal = data['colorValue']
convertFrom = data['from']
convertTo = data['to']
finalize = {}

if(colorVal!='' and convertFrom!='' and convertTo!=''):
        if(convertFrom.lower()=='name' and (convertTo.lower()=='hex' or convertTo.lower()=='hexdecimal')):
            try:
                finalize['color'] = webcolors.name_to_hex(colorVal)
            except ValueError:
                finalize['error'] = {}
                finalize['error']['code'] = 1
                finalize['error']['reason'] = 'No Such color'
        elif(convertFrom.lower()=='name' and convertTo.lower()=='rgb'):
            try:
                finalize['color'] = webcolors.name_to_rgb(colorVal)
            except ValueError:
                finalize['error'] = {}
                finalize['error']['code'] = 1
                finalize['error']['reason'] = 'No Such color'
        elif((convertFrom.lower()=='hex' or convertFrom.lower()=='hexdecimal') and  convertTo.lower()=='rgb'):
            try:
                finalize['color'] = webcolors.hex_to_rgb(colorVal)
            except ValueError:
                finalize['error'] = {}
                finalize['error']['code'] = 1
                finalize['error']['reason'] = 'No Such color'
        elif((convertFrom.lower()=='hex' or convertFrom.lower()=='hexdecimal') and  convertTo.lower()=='name'):
            try:
                finalize['color'] = webcolors.hex_to_name(colorVal)
            except ValueError:
                finalize['error'] = {}
                finalize['error']['code'] = 1
                finalize['error']['reason'] = 'No Such color'
        elif(convertFrom.lower()=='rgb' and (convertTo.lower()=='hex' or convertTo.lower()=='hexdecimal')):
            try:
                finalize['color'] = webcolors.rgb_to_hex(colorVal)
            except ValueError:
                finalize['error'] = {}
                finalize['error']['code'] = 1
                finalize['error']['reason'] = 'No Such color'
        elif(convertFrom.lower()=='rgb' and convertTo.lower()=='name'):
            try:
                finalize['color'] = webcolors.rgb_to_name(colorVal)
            except ValueError:
                finalize['error'] = {}
                finalize['error']['code'] = 1
                finalize['error']['reason'] = 'No Such color'
        else:
            try:
                finalize['color'] = colorVal
            except ValueError:
                finalize['error'] = {}
                finalize['error']['code'] = 1
                finalize['error']['reason'] = 'No Such color'
else:
    finalize['error'] = {}
    finalize['error']['code'] = 1
    finalize['error']['reason'] = 'Missing values'
print("Content-Type: application/json\n")
print(json.dumps(finalize))