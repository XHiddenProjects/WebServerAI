# WebServerAI
An AI that develops and Designs website from any work folder and very little coding experience. This AI will be able to remember what your latest history, clear and etc.

**(STILL IN DEVELOPMENT)**

***

### Utilities
* _Cursor-Targeting Element (CTE)_ where you can hover over elements and click to quick insert the correct elements` tagName, class names, and IDs in the correct format.
* Drag-Drop method (works for both PC/Mobile devices)
* Light/Dark mode toggle
* History Storage(session/local)
* Flexable and moves on page scroll
* Easy to use configuration to name and change the repsonce timeout.
* Extensions that be used to make the AI more efficient.
* Multi-language software - Allows translates based browser language.

### Available Languages
* English (United States)
* Deutsch (Deutschland)

### Installation
1. Download and take out the **WebServerAI** folder from the _WebServerAI_Master_ folder.
2. Place the folder in the **ROOT** directory to allow all folders to be accessed.
3. Go to an project to work with and enter the following instructions to enable it.
   
### How to enable to AI
In your _INIT (Inital)_ `JavaScript` file. You must enter enter this
```js
  // Import WebServerAI from the location of the WebServerAI folder
  import WebServerAI from '//WebServerAI/assets/AI/js/webserverai.js';
  // Access the class from WebServerAI
   if(window.WebServerAI!==undefined){
        let wsc = new WebServerAI({
            enabled: true, // Activate the AI
            theme: 'dark', // Light/Dark theme
            status: 'opened', // Opened/Closed status of the UI
            position: 'bottom right', // Position of the UI: top left, top center, top right, center left, center right, bottom left, bottom center, bottom right
            history:{
                save: 'session' // Save history as a session/local storage
            },
            cte: true, // Activates Cursor-Targeting Element
            extensions:{
               // Add extensions here
            }
        });
        wsc.load(); // Loads the UI and the necessary scripts
        wsc.submit(($input)=>{
            if($input){
               wsc.addCmd($input);
               wsc.send($input, true);
            }
        });
        /*
         * Waits until user press "enter" on the UI textbox.
         * Checks the commands and then sends it to the AI and to process then execute.
        */
      }
```
***
## Using the AI
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
            styles:[], // Extensions` style files
            scripts:[] // Extensions` script files
         }
      }
   }
```

### Creating an Extensions
Create your extension in the _/WebServerAI/build/`{your_extension_name}`_

**Note: Excepted Files**
* HTML/HTM
* CSS
* JS
* Media files: _(Images, Videos, Audios, ...)_

Now this is pretty simple part.

All you have to do is `import` the extensions file. For this I am going to use the _clock_ extension.

You do not need to have any templates, but this is if you are going to create a new object.

   _**FYI: ALL extensions use the `build` keyword**_

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
// END LOAD-UP
//USE "wsa-build" to trigger on build-submit
window.addEventListener('wsa-build',(e)=>{
    // Your code goes in here



    // Give elements based on your build name a unique ID
    ext.update(buildName);
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


