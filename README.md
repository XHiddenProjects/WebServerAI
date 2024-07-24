# WebServerAI
WebServerAI is an innovative project that integrates advanced tools such as CTE (Cursor-Targeting Elements) to enhance the website development experience. By leveraging sophisticated algorithms, natural language processing, and innovative technologies like CTE, this AI-powered tool enables users to create visually stunning and user-friendly websites with ease. With WebServerAI, individuals and businesses can streamline the design process, eliminating the need for extensive coding knowledge and technical expertise. This project represents a significant advancement in web development, offering a seamless and efficient solution for those looking to establish a professional online presence. Experience the future of web design with WebServerAI and unlock the potential of AI-driven website development.

**(STILL IN DEVELOPMENT)**

***

[![GitHub Release](https://img.shields.io/github/v/release/XHiddenProjects/WebServerAI?include_prereleases&style=plastic&label=Version&color=%2323aedc)](https://github.com/XHiddenProjects/WebServerAI/releases)
[![NPM Downloads](https://img.shields.io/npm/dw/webserverai?style=plastic&label=Downloads&color=%2354a778)](https://www.npmjs.com/package/webserverai)
![GitHub top language](https://img.shields.io/github/languages/top/XHiddenProjects/WebServerAI?style=plastic)
[![GitHub forks](https://img.shields.io/github/forks/XHiddenProjects/WebServerAI?style=plastic)](https://github.com/XHiddenProjects/WebServerAI/forks?include=active&page=1&period=&sort_by=stargazer_counts)
[![GitHub Repo stars](https://img.shields.io/github/stars/XHiddenProjects/WebServerAI?style=plastic&label=Stars&color=%23e9ee4e)](https://github.com/XHiddenProjects/WebServerAI/stargazers)
![GitHub repo size](https://img.shields.io/github/repo-size/XHiddenProjects/WebServerAI?style=plastic&label=Size)


***

### Table of Contents
   * [What the AI has](#what-the-ai-has)
     * [CTE - Cursor-Targeting Element](#cte)
     * [WSA Commands](#webserverai-commands)
   * [Languages](#languages)
      * [Available Languages](#available-languages)
      * [Adding Languages](#adding-languages)
   * [Installation](#installation)
      * [How to enable the AI](#how-to-enable-the-ai)
      * [Configuration](#configuration)
      * [Using the AI](#using-the-ai)
      * [Previewing Content](#previewing-content)
   * [Functions](#functions)
     * [Loading](#loading)
     * [Submitting Data](#submitting-data-required)
     * [Adding Commands](#adding-commands-required)
     * [Sending Data](#sending-data-required)
     * [Getting Results](#getting-results)
   * [Extensions](#extensions)
      * [Creating the Extensions](#creating-an-extensions)
   * [Components](#components)
      * [GeoLocation](#geolocation)
      * [Security](#security)
      * [Events](#events)
      * [Utils](#utils)
***

## What the AI has
* _Cursor-Targeting Element (CTE)_ where you can hover over elements and click to quick insert the correct elements` tagName, class names, and IDs in the correct format.
* Drag-Drop method (works for both PC/Mobile devices)
* Light/Dark mode toggle
* History Storage(session/local)
* Flexable and moves on page scroll
* Easy to use configuration to name and change the repsonce timeout.
* Extensions that be used to make the AI more efficient.
* Multi-language software - Allows translates based browser language.

### CTE
CTE (_Cursor-Targeting Element_) Allows you to hover and select a specific target and gets the full element path.

For example:
```html
<html>
  <head>
  <title>Test</title>
  </head>
  <body>
    <p id="para">This is a paragraph</p>
  </body>
</html>
```
On hover you will get something like this:

![CTE-Hover](https://github.com/XHiddenProjects/WebServerAI/blob/master/extras/cte-hover.png?raw=true)

If you hold `CTRL+Click` you'll get something like this:

![CTE-Click](https://github.com/XHiddenProjects/WebServerAI/blob/master/extras/cte-click.png?raw=true)

### WebServerAI commands

Here are some commands you can enter inside the AI, but must always start with `wsa`

* Clear - _Clears the history number of the panel or all history_
  
  `wsa --clear` or `wsa --clear:{number}`
* Preview - _Previews the page in a new window_

  `wsa --preview`
* Info - Returns the AI information

  `wsa --info`
* Connect - Connect to a different URL/path

  `wsa --connect {url/path}`
* help - Returns all commands and parameters

  `wsa --help`

## Languages

### Available languages
* English (United States)
* Deutsch (Deutschland)
* Francaise (France)

### Adding Languages
To add your own or share your own interpeded language please do the following:

1. Start a new file called `{language_name}-{language_country}.json` example `fr-FR = french-France`
2. Copy this code:
```json
   "en-US":{
            "name":"English",
            "dictionary":{
                "title": "WebServerAI - XHiddenProjects",
                "name":"Name",
                "version":"Version",
                "updated":"Updated",
                "nav":{
                    "send": "Send (Enter)",
                    "lastestHistory": "Latest History",
                    "pastHistory": "Past History",
                    "clearHistory": "Clear History",
                    "clear":"Clear",
                    "help": "Extra information",
                    "changeTheme":"Change theme",
                    "intxtdbl":"Insert In-Text Double quotes",
                    "intxtsgl":"Insert In-Text Single quotes",
                    "intxtaps":"Insert In-Text Apostrophe",
                    "intxtnl": "Insert In-Text New Line",
                    "mic": "Toggle Mic"
                },
                "cmd":{
                    "help":"Gives the list of commands",
                    "clear":"Clears out the entire history or a certain index",
                    "info":"Returns the AI information",
                    "connect":"Connects you to another page",
                    "preview": "Previews the page"
                },
                "clipboard":{
                    "success":"Copied to clipboard",
                    "error":"Error writing to clipboard"
                },
                "ai":{
                    "success": "Successfully executed",
                    "error": "There was an error with this statement"
                },
                "console":{
                    "previewNotFound":"Preview box not found!",
                    "previewBtnNotFound":"Preview button cannot be found",
                    "chatBoxNotFound":"Chat box not found!",
                    "voiceTypeToggleNotFound":"[VoiceType] - Toggle button not found",
                    "voiceTypeResultsNotFound": "[VoiceType] - Results not found",
                    "voiceTypeSpeechError": "[VoiceType] - An error has occurred",
                    "voiceTypeSpeechNotEnabled": "[VoiceType] - SpeechRecognition is not supported",
                    "elementNotFound": "Element not found"
                }
            }
        }
```
3. Translate it
4. **To share** go to `issues > "New Issue"`
5.
```
      Title: _your_language_name_
      Message: whatever you want to write
      Label: "Language"
      Upload: Your translated file
```

***

## Installation
1. NPM installation
   To use thew NPM installation type
   ```js
   npm i webserverai
   ```

   or

   ```js
   npm install webserverai
   ```
2. Regular download
   1. Download and take out the **WebServerAI** folder from the _WebServerAI_Master_ folder.
   2. Place the folder in the **ROOT** directory to allow all folders to be accessed.
   3. Go to an project to work with and enter the following instructions to enable it.
   
### How to enable the AI
In your _INIT (Inital)_ `HTML` \ `PHP` file. Example: **index.php** or **index.html**

_Note: "wsa-exclude" is required for preview reasons and space saving!_


```html
<script src=".../file.js" type="module" wsa-exclude></script>
```

**OR**

```html
<script type="module" wsa-exclude>
import WebServerAI from '../assets/AI/js/webserverai.min.js'; // Get WebServerAI from assets
import Events from '../assets/AI/js/components/Events.js'; // Get Events from the components [Optional]

if(window.WebServerAI!==undefined){ // Check if WebServerAI is active
        let wsaEvent = new Events(); // Load the events library
        let wsc = new WebServerAI({ //Create a new WebServerAI object
            enabled: true, // Enable the software
            theme: 'dark', // Change the theme light/dark [Optional]
            codeTheme: 'default', // Change the theme for prismJS [Optional]
            status: 'opened', // Set the UI collapse status [Optional]
            position: 'bottom right', // Sets the position of the UI [Optional]
            history:{
                save: 'session' // Saves history as a sessionStorage [Optional]
            },
            cte: true, // Enables Click-targeting element
            extensions:{} // Load build extensions here
        });
        wsc.load(); // Load the UI
        wsc.submit(($input)=>{
            if($input){
                wsc.addCmd($input);
                wsc.send($input, true);
            }
        }); // Trigger events on submit
        wsc.clearTextbox(); // Clears the textbox after submitting
}
</script>
```

### Configuration

|  Name   |   Type    |  Default  |   Allowed values   |        Description         |
| ------- | --------- | --------- | ------------------ | -------------------------- |
| enabled | _Boolean_ | `True`    |  `True` / `False`    |  Enables the software      |
| theme   | _String_  | `"light"` | `"light"` / `"dark"` | Sets the theme for the UI. |
| codeTheme | _String_| `"default"` | **PrismJS available themes** | Sets the code blocks to the correct PrismJS themes |
| status | _String_   | `"opened"` | `"Opened"` / `"Closed"` | Sets the UI collapse status |
| position | _String_ | `"bottom right"` | `"top left"` /` "top center"` / `"top right"` / `"center left"` / `"center right"` / `"bottom left"` / `"bottom center"` / `"bottom right"` | Sets the position of the UI |
| history.save | _String_ | `"session"` | `"session"` / `"local"` | Saves the users history |
| ui.preview | _String_ | `null` | `<Element:IFrame>` | Previews your updated page while removing all non-important elements |
| ui.previewBtn | _String_ | `null` | `<Element:Button>` | A button to update the IFrame with the page update |
| ui.chatbox | _Stirng_ | `null` | `<Element:Textarea>` / `<Element:Input[type="text"]>` | Uses a custom textbox, except for the UI |
| ui.submit | _String_ | `null` | `<Element:Button>` | Uses a custom button for submission of users input |
| ui.history | _String_ | `null` | `<Element:Div>` | Uses a custom container as a history viewer |
| ui.language | _String_ | `Browsers language` | [`Available language support`](#available-languages) | Sets the UI to a specified language |
| cte | _Boolean_ | `True` | `True` / `False` | Allows Cursor-Targeting Element | 
| extensions | _Object_ | `{}` | [**Allowed extensions**](#extensions) | Add _build_ extensions here |

### Using the AI
This AI uses _direct quotations_. 

Examples:
```
Example 1:
"Hello World" is the example of a statment to print
> Insert a heading of a size of 1 that says "Hello World"

Example 2:
"div" is the location where the paragraph should be placed
> Insert paragraph and place it inside of "div"

Example 3:
"div" is the element to look for. "32px" is the size to update
> Update "div" to size "32px"
```

Using in-text special character must be escaped.

| Escaped Char.      | Return   |
| ------------------ | -------- |
| `\"`               |   "      |
| `\'`               |   '      |
| <code>\\`</code>   |   `      |
| `\n`               | new line |
| `\,`               |   ,      |


### Previewing Content

To preview content you can use the command line `wsa --preview` or `CTRL+P` shortcut

- `wsa --preview` will only preview as a open window dialog.
- `CTRL+P` will only preview on a IFrame. Use the `preview: ""` to the WebServerAI class

You can use the `wsa-exclude` attribute on a element to ignore the element from being published/previewed

***

## Functions
Functions that you can use to your script, some are **Required**, and makes this AI more efficient.

### Loading
Using this line of code will load the WebServerAI data
```js
{variableName}.load()
```

### Submitting Data (Required)
To submit the users text use this function
```js
/*
* Submits the users data
* $input is users information
*/
(...).submit(($input)=>{
  if($input){
    // Functions go here
  }
})
```

### Adding commands (Required)
To add a command to the AI. **This must be placed inside of the submit function!**
```js
(...).submit(($input)=>{
  if($input){
    (...).addCmd($input); // Add command here
  }
});
```

### Sending data (Required)
To send the command to the AI use this command. **This must be placed inside of the submit function!**
```js
(...).submit(($input)=>{
  if($input){
    (...)
    (...).send($input, true);
  }
});
```

### Getting results
To get the results you this command. **This must be placed inside of the submit function!**
```js
(...).submit(($input)=>{
  if($input){
    (...)
    (...).results(($o)=>{
      // Returns an array
      console.log($o);
    });
  }
});
```

***


![Live Demo](https://github.com/XHiddenProjects/WebServerAI/blob/main/extras/LiveDemo.gif)

***

## Extensions

### Adding Extensions
To add extensions place the following order:
```js
   // Make sure this is added inside of the WebServerAI object!
   extensions:{
      extension_name:{
         active: true, //true to activate
         config:{
            //configuration (optional, if extension doesn't require it)
         },
         startup:{
            styles:[], // Extensions style files
            scripts:[], // Extensions script files
            assets:[{
               type: "{style/script}", // "style" or "script"
               url: "{url}" // External URL
            }]
         }
      }
   }
```

### Creating an Extensions
Create your extension in the _/WebServerAI/build/`{your_extension_name}`_

**Note: Excepted rendered files**
* info.yaml **(Required)**
* HTML
* CSS
* JS
* Media files: _(Images, Videos, Audios, ...)_

> Extra codes can be placed, but will need to be requested from JS by using the _[Events.request()](#events)_

Now this is pretty simple part.

All you have to do is `import` the extensions file. For this I am going to use the _clock_ extension.

You do not need to have any templates, but this is if you are going to create a new object.

   _**FYI: ALL extensions use the `build` keyword**_
_`/WebServerAI/build/{extension_name}/info.yaml`_
```yaml
lang-country:
  name: project_name
  updated: date_format
  version: extension_version
  # Any text goes here
ai_version: "ai_version_support"
```
_`/WebServerAI/build/{extension_name}/{extension_name}.html`_
```html
<!--START HTML TEMPLATE-->
...
<!--END HTML TEMPLATE-->
```

_`/WebServerAI/build/{extension_name}/{extension_name}.css`_
```css
   /*START STYLESHEET CODE*/

   /*END STYLESHEET CODE*/
```

_`/WebServerAI/build/{extension_name}/{extension_name}.js`_
```js
/*
   * Import "Extensions" from extension.js to allow usages.
   * You can import more componetents under the import Extensions.
*/
import Extensions from "/WebServerAI/assets/AI/js/components/extenstions.js";

// START LOAD-UP (Required)
const url = new URL(import.meta.url),
//Load the "Extensions" class
ext = new Extensions(),
//Gets build name
buildName = ext.getBuildName(url),
//Gets build ID
buildID = ext.getBuildID(url),
//url, {configNames}, {configNullValues}
config = ext.configSearch(url,[],[]);
// Save the HTML template and parses the HTML to be executed to the page
ext.saveTemplate(buildName,ext.parse(buildName));

const info = getInfo(buildName); // All information will be stored here in a JSON object based on users language
// END LOAD-UP
//USE "wsa-build" to trigger on build-submit
if(ext.isAllowed(buildName)){

/**
  // Requires Events componement to be imported!
  // Gets data on submit and does not wait for build function to occur.
  events.submit((e)=>{
      console.log(e);
  });
*/

window.addEventListener('wsa-build',(e)=>{
    // Your code goes in here

    // Give elements based on your build name a unique ID
    ext.update(buildName);
   }else
      ext.noSupport(buildName);
});
```




***

## Components
These are extra `imports` that you can add to your extensions which allows more open-source and flexability.

### GeoLocation
GeoLocation can be loaded using this following code:

**Note: This does require an API key from [IPInfo](https://ipinfo.io)**
```js
import GeoLocation from '/WebServerAI/assets/AI/js/components/geolocation.js'
const location = new GeoLocation();// IPV4 or "auto"
/*
* @param {String} ipapiKey IP-API key goes here
* @param {String|String[]} [info='*'] Selections go in an array or use "*" for all selections
* @returns {JSON} JSON of IPA info 
*/
location.displayRecords(ipapiKey, info="*");
```

### Security
These are security to inputs which can _sanitize_ and _validate_ certain text
```js
import * as Security from '/WebServerAI/assets/AI/js/components/security.js';
console.log(Security.validate('127.0.0.1',Security.FILTER_VALIDATE_IP)); //Returns 127.0.0.1
```

**Functions:**

`validate` - Returns validated string/int/float/boolean

`sanitize` - Returns sanitized string/int/float/boolean

**Valdate Filters:**

| Filter Name | ID | Description |
| ----------- | -- | ----------- |
| FILTER_VALIDATE_INT | 257 | Make sure the value is a _intager_ |
| FILTER_VALDATE_BOOLEAN | 258 | Make sure the value is a _boolean_ |
| FILTER_VALIDATE_FLOAT | 259 | Make sure the value is a _float_ | 
| FILTER_VALIDATE_REGEXP | 260 | Make sure the value is a _RegExp_ |
| FILTER_VALIDATE_DOMAIN | 277 | Make sure the value is a _Domain_ |
| FILTER_VALIDATE_URL | 273 | Make sure the value is a _URL_ |
| FILTER_VALIDATE_EMAIL | 274 | Make sure the value is a _Email_ |
| FILTER_VALIDATE_IP | 275 | Make sure the value is a _IP_ |
| FILTER_VALIDATE_MAC | 276 | Make sure the value is a _MAC Address_ |

**Sanitize Filters:**

| Filter Name | ID | Description |
| ----------- | -- | ----------- |
| FILTER_SANITIZE_ADD_SLASHES | 523 | Adds slashes to special characters |
| FILTER_SANITIZE_EMAIL | 517 | Sanitizes string to a valid email address |
| FILTER_SANITIZE_ENCODED | 514 | Encodes the string |
| FILTER_SANITIZE_NUMBER_FLOAT | 520 | Removes all non-digit characters but keeps `+`,`-` |
| FILTER_SANITIZE_NUMBER_INT | 519 | Removes all non-digit characters |
| FILTER_SANITIZE_SPECIAL_CHARS | 515 | Converts special characters to _HTML Entities_ |
| FILTER_SANITIZE_URL | 518 | Sanitizes string to a valid URL |

**Flags:**
| Flag Name | ID | Description | Merge |
| --------- | -- | ----------- | ----- |
| FILTER_FLAG_ALLOW_FRACTION | 4096 | Allows `.` in floats | FILTER_SANITIZE_NUMBER_FLOAT |
| FILTER_FLAG_ALLOW_THOUSAND | 8192 | Allows `,` in floats | FILTER_SANITIZE_NUMBER_FLOAT |
| FILTER_FLAG_ALLOW_SCIENTIFIC | 16384 | Allows `e` or `E` in floats | FILTER_SANITIZE_NUMBER_FLOAT |
| FILTER_FLAG_STRIP_LOW | 4 | Adds slashes to special characters | FILTER_SANITIZE_SPECIAL_CHARS |
| FILTER_FLAG_STRIP_HIGH | 8 | Adds slashes to special characters | FILTER_SANITIZE_SPECIAL_CHARS |
| FILTER_FLAG_ENCODE_HIGH | 32 | Adds slashes to special characters | FILTER_SANITIZE_SPECIAL_CHARS |
| FILTER_FLAG_IPV4 | 1048576 | Checks if IP is a _IPV4_ | FILTER_VALIDATE_IP |
| FILTER_FLAG_IPV6 | 2097152 | Checks if IP is a _IPV6_ | FILTER_VALIDATE_IP |
| FILTER_FLAG_NO_PRIV_RANGE | 8388608 | Checks if IP is not in a private range | FILTER_VALIDATE_IP |
| FILTER_FLAG_NO_RES_RANGE | 4194304 | Checks if IP is not in a reserived range | FILTER_VALIDATE_IP |

### Events
Process the _wsa-build_ events
```js
import Events from '/WebServerAI/assets/AI/js/components/Events.js';
const e = new Events();
/*
   * @param CustomEvent event - CustomEvent List
   * @param String label - What you want to search
   * @return {*|undefined} Returns any value, UNDEFINED if not found
*/
e.get(event, label);
/**
     * Returns array of users statements
     * @param {String} str Users input
     * @returns {Array<String>} List of matching users dbl quotations
*/
e.statement(str);
/**
   * Gets file content
   * @param {String} url Location to get the file content
   * @param {Boolean} [isJSON=false] Converts string to JSON object
   * @param {Boolean} [async=false] Wait until page load
   * @returns {JSON|String}
   */
e.request(url, isJson=false, async=false);
/**
   * Looks up an array to see if value is in-place
   * @param {Array<*>} arr Array to lookup
   * @param {String|Number} index value to look at
   * @returns {Boolean}
   */
e.lookup(arr, index);
/**
   * Returns the output of a certain command from the AI
   * @param {RegExp} eventPattern Check what to 
   * @param {String} str String to check
   * @param {Function|null} [callback=null] Return as a function
   * @returns {RegExpMatchArray|null}
   */
e.cmdLine(eventPattern, str , callback=null);
```

### Utils
Uses the utilites of the AI
```js
import { rgbaToHex, 
    keyboardFocusable, 
    isDecimal, 
    version_compare,
    getInfo,
    isScrollable,
    getInfo,
    HTMLEncoder,
    HTMLDecoder,
    merge,
    uniqid,
    IS_ENABLED,
    //CONST
    VIDEO_PATH,
    AUDIO_PATH,
    IMAGE_PATH,
    SUBTITLE_PATH,
    DS,
    ORGIN} FROM "WebServerAI/assets/AI/js/components/utils.js";
```

RGBA: converts rgb(a)? to hexdecimal
```js
rgbaToHex(rgba);
```

keyboardFocusable: Checks if element is keyboard focusable
```js
keyboardFocusable(element);
```

isDecimal: Checks if number is a decimal
```js
isDecimal(number);
```

version_compare: Compares two versions either _TRUE/FALSE_ or _-1, 0, or 1_
```js
/*
* v1 - version 1
* v2 - version 2
* operator [OPTIONAL] - <, >, <=, >=, =, ==, !=, or <>
*/
version_compare(v1, v2, '=');
```

getInfo: Get extension information based on language
```js
/**
 * Recieves the extensions informations based on language
 * @param {String} name Extension Name
 * @returns {String} JSON format of the extension
 */
getInfo(name);
```

isScrollable: Checks if element is scrollable
```js
/**
 * Returns if element is scrollable
 * @param {Element} element Element to check
 * @returns {Number|Array<Number>} -1 if scrollbar is horizontal, 1 if scrollbar is vertical, 0 if no scrollabars are present
 */
isScrollable(elem);
```

getInfo: Gets information from _info.yaml_ based on extension name
```js
/**
 * Recieves the extensions informations based on language
 * @param {String} name Extension Name
 * @returns {String} JSon format of the extension
 */
getInfo(name);
```

HTMLEncoder: Encodes HTML to sanitized string
```js
/**
 * Decode HTML to encoded
 * @param {Array<String>|String} $items 
 * @returns {Array<String>|String} Returns the encoded HTML
 */
HTMLEncoder(name);
```

HTMLDecoder: Decodes sanitized string to HTML string
```js
/**
 * Encoded HTML to decoded
 * @param {Array<String>|String} $items 
 * @returns {Array<String>|String} Returns the decoded HTML
 */
HTMLDecoder($items);
```

merge: Join array items with a character
```js
/**
 * Merges array items with a certain character into 1 item array
 * @param {Array} Arr Array to merge
 * @param {String} mergeWith A character to merge items with
 * @returns {Array} Merges into 1 item array
 */
merge(Arr, mergeWith='');
```

uniqid: Generatates a uniqueID
```js
/**
  * Generate a unique id
  * @param {string} [prefix=''] Prefix to the start of the ID
  * @param {boolean} [more_entropy=false] add more to the list
  * @returns {string}
*/
uniqid(prefix='', more_entropy=false);
```

IS_ENABLED: Checks if the software is enabled
```js
IS_ENABLED();
```


| CONST | VALUE |
| ----- | ----- |
| VIDEO_PATH | `/WebServerAI/assets/AI/videos` |
| AUDIO_PATH | `/WebServerAI/assets/AI/audios` |
| IMAGE_PATH | `/WebServerAI/assets/AI/images` |
| SUBTITLE_PATH | `/WebServerAI/assets/AI/subtitles` |
| DS | `/` |
| ORGIN | `http(s)?//domain/` |
