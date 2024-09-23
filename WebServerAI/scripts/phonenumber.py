#! C:\xampp\htdocs\WebServerAI\.venv\Scripts\python.exe
import phonenumbers
import json
import os
from phonenumbers import timezone, geocoder, carrier
from phonenumbers.phonenumberutil import number_type

currentPath = os.getcwd() + "/data/phonenumber.json"

with open(currentPath) as json_file:
    data = json.load(json_file)

phoneNumberResults = {}

try:
    number = phonenumbers.parse(data['phoneNumber'], None)
    if not phonenumbers.is_valid_number(number):
        phoneNumberResults['error'] = "Invalid phone number"
except phonenumbers.NumberParseException as e:
    phoneNumberResults["error"] = str(e)

def numTypeName(num: int) -> str:
    results = ''
    match num:
        case 0: results = 'FIXED_LINE'
        case 1: results = 'MOBILE'
        case 2: results = 'FIXED_LINE_OR_MOBILE'
        case 3: results = 'TOLL_FREE'
        case 4: results = 'PREMIUM_RATE'
        case 5: results = 'SHARED_COST'
        case 6: results = 'VOIP'
        case 7: results = 'PERSONAL_NUMBER'
        case 8: results = 'PAGER'
        case 9: results = 'UAN'
        case 10: results = 'VOICEMAIL'
        case _: results = 'UNKNOWN'
    return results

def numType(number: str, getName: bool = False) -> str | int:
    return (number_type(number) if not getName else numTypeName(number_type(number)))

if 'error' not in phoneNumberResults:
    # Only log non-sensitive information
    phoneNumberResults['possible_num'] = phonenumbers.is_possible_number(number)
    phoneNumberResults['is_valid'] = phonenumbers.is_valid_number(number)
    phoneNumberResults['country_code'] = number.country_code
    phoneNumberResults['extensions'] = (number.extension if number.extension is not None else "")
    phoneNumberResults['timezone'] = timezone.time_zones_for_number(number)
    phoneNumberResults['location'] = geocoder.description_for_number(number, 'en')
    phoneNumberResults['provider'] = carrier.name_for_number(number, 'en')
    phoneNumberResults['is_mobile'] = (True if numType(number) == 1 else False)
    phoneNumberResults['type'] = numType(number, True)

# Print only sanitized results to avoid logging sensitive information
print("Content-Type: application/json\n")
sanitizedResults = {key: phoneNumberResults[key] for key in phoneNumberResults if key not in ['phoneNumber', 'national_num']}
print(json.dumps(sanitizedResults))
