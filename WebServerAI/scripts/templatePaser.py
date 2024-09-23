#! C:\xampp\htdocs\WebServerAI\.venv\Scripts\python.exe
import os, json
from jinja2 import Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader(os.path.dirname(os.path.dirname(__file__))), autoescape=True)

currentPath = os.getcwd()+"/data/templateParser.json"
with open(currentPath) as json_file:
	data=json.load(json_file)

template = env.get_template(data['path'].replace('/WebServerAI',''))

setData = data['data']

render_str = template.render(setData)

with open(os.path.dirname(os.path.dirname(__file__))+(data['outputPath'].replace('/WebServerAI','')),'w') as f:
    f.write(render_str)
print("Content-Type: text/html\n")
with open(os.path.dirname(os.path.dirname(__file__))+(data['outputPath'].replace('/WebServerAI','')),'r') as f:
    print(f.read())