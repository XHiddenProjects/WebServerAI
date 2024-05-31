# WebServerAI
An AI that develops and Designs website from any work folder and very little coding experience. This AI will be able to remember what your latest history, clear and etc.

**(STILL IN DEVELOPMENT)**
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
        let wsc = new WebServerAI({
            enabled: true, // Activate the AI
            theme: 'dark', // Light/Dark theme
            status: 'opened', // Opened/Closed status of the UI
            position: 'bottom right', // Position of the UI: top left, top center, top right, center left, center right, bottom left, bottom center, bottom right
            history:{
                save: 'session' // Save history as a session/local
            },
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
```
***
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


This also comes with a _cursor-targeting element (CTE)_ where you can hover over elements and click to quick insert the correct elements` tagName, class names, and IDs in the correct format.

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

_`/WebServerAI/build/clock/clock.html`_
```html
<!--HTML template-->
<span class="clock">
    <span class="datetime"></span>
</span>
```

_`/WebServerAI/build/clock/clock.js`_
```js
// Import "Extensions" from extension.js to allow usages
import Extensions from "/WebServerAI/assets/AI/js/extenstions.js";
// START LOAD-UP (Required)
const url = new URL(import.meta.url),
ext = new Extensions(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url),
config = ext.configSearch(url,['options'],[{}]);
ext.saveTemplate(buildName,ext.parse(buildName));
// END LOAD-UP
//USE "wsa-build" to trigger on build-submit
window.addEventListener('wsa-build',(e)=>{
    // Your code goes in here
    const lang = navigator.language,
        timezone = Intl.DateTimeFormat(lang).resolvedOptions().timeZone;
    config.options.timeZone = timezone;
    setInterval(()=>{
        document.querySelectorAll('.clock').forEach((clock)=>{
            clock.querySelector('.datetime').innerText = new Intl.DateTimeFormat(lang,config.options).format(new Date()); 
        }); 
    },1000);
    // Give elements based on your build name a unique ID
    ext.update(buildName);
});
```



