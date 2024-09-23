#! C:\xampp\htdocs\WebServerAI\.venv\Scripts\python.exe
import latex2mathml.converter, json, os, re
from sympy import *

currentPath = os.path.join(os.getcwd(), "data", "mathML.json")
with open(currentPath) as json_file:
	data=json.load(json_file)
try:
	sympify_exp = parse_expr(data['equation'])
	latex_equ = latex(sympify_exp)
	mathml = latex2mathml.converter.convert(latex_equ)
	print("Content-Type: application/json\n")
	print(json.dumps({'mathml':mathml, 'latex':latex_equ}))
except Exception as e:
	print("Content-Type: application/json\n")
	print(json.dumps({'error':str(e)}))