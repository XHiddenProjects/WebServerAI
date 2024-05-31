# WebServerAI
An AI that develops and Designs website from any work folder and very little coding experience. This AI will be able to remember what your latest history, clear and etc.

**(STILL IN DEVELOPMENT)**
### Installation
1. Download and take out the **WebServerAI** folder from the _WebServerAI_Master_ folder.
2. Place the folder in the **ROOT** directory to allow all folders to be accessed.
3. Go to an project to work with and enter the following instructions to enable it.
   
### How to enable to AI
In your _MAIN_ global `JavaScript` file. You must enter enter this
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

This also comes with a _cursor-targeting element (CTE)_ where you can hover over elements and click to quick insert the correct elements` tagName, class names, and IDs in the correct format.

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


