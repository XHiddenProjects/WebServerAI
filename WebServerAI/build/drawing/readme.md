# Drawing

This is an extension to **WebServerAI** which will to draw SVG drawings using a processing **SVG**
***

### How to enable

Use this JS code to the WebServerAI _extension_ line
```js
"drawings":{
    active: true,
    startup:{
        scripts:[
        '/WebServerAI/build/drawing/drawing.js'
        ]
    }
}
```

### Input format

**style_format** Must be written like this: _**key:value;**_ use *;* to split properties

```
draw..."shape_name"...properties..."--property-list"
```

to render it into a containers
```
...Contain SVG..."{Target_Element}"
```