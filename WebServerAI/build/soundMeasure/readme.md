# SoundMeasure

This is an extension to **WebServerAI** which will allow you to display your mic volume onto your page.
***

### How to enable

Use this JS code to the WebServerAI _extension_ line
```js
"soundMeasure":{
    active: true,
    startup:{
        styles:[
            '/WebServerAI/build/soundMeasure/soundMeasure.css'
        ],
        scripts:[
            '/WebServerAI/build/soundMeasure/soundMeasure.js'
        ]
    }
}
```

To use this type:

`build "soundmeasure"`

To change the direction of the bar use:
```
set sound ?measure;? "{Element}" to "(width|height)"
```