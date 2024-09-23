#! C:\xampp\htdocs\WebServerAI\.venv\Scripts\python.exe
import json, os, requests, urllib, html, re
from bs4 import BeautifulSoup

def removeSVG(url):
    svg_url_pattern = r'^https?://.*\.svg$'
    return not re.match(svg_url_pattern, url)

def checkValidURL(url):
    try:
        response = urllib.request.urlopen(url)
        return response.getcode() == 200
    except urllib.error.URLError:
        return False  # Error
currentPath = os.getcwd()+"/data/srcCapture.json"
with open(currentPath) as json_file:
	data=json.load(json_file)
search_term = data['searched'].replace(' ','+')
srcType = data['src_type']
if(srcType.lower()=='img'):
    url = f'https://google.com/search?q={search_term}&udm=2'

    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser',from_encoding='utf-8')

    images = soup.select('img')
    if(search_term!=''):
        image_urls = [img.get('src') for img in images]
        image_urls.pop(0)
    else:
        image_urls = []
    image_urls = list(filter(removeSVG,image_urls))
    image_urls = list(filter(checkValidURL,image_urls))
    print("Content-Type: application/json\n")
    print(json.dumps({'img_urls':image_urls}))