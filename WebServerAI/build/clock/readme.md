# Clock

This is an extension to **WebServerAI** which will display the correct format of time
***

### How to enable

Use this JS code to the WebServerAI _extension_ line
```js
"clock":{
    active: true,
    config:{
        options:{
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "numeric",
            second: "numeric",
            hour12: true
        }
    },
    startup:{
        styles:[],
        scripts:[
            '/WebServerAI/build/clock/clock.js'
        ]
    }
}
```

To use this type:

`build "clock"`
