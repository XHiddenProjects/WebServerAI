# Tables

This is an extension to **WebServerAI** which will allow you to customize your tables to be place

***

### How to enable

Use this JS code to the WebServerAI _extension_ line
```js
"tables":{
    active: true,
    startup:{
        styles:[
            '/WebServerAI/build/tables/tables.css'
        ],
        scripts:[
            '/WebServerAI/build/tables/tables.js'
        ]
    }
}
```

To use this type:

`build "tables"`

### Regular tables

To activate regular tables use this setup

```
...create "data tables" (labels|headers) "{TH_LABELS,TH_LABELS,TH_LABELS}" and cells "item 1, item 2, item 3". Make it hoverable and stripped
```
