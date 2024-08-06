# Video Player

This is an extension to **WebServerAI** which will allow you to customize your video player and have very cool feedback

> **Note:** All videos/subtitles must be placed in the `/assets/AI/videos` and `/assets/AI/subtitles`

***

### How to enable

Use this JS code to the WebServerAI _extension_ line
```js
"video-player":{
    active: true,
    startup:{
        styles:[
            '/WebServerAI/build/video-player/video-player.css'
        ],
        scripts:[
            '/WebServerAI/build/video-player/video-player.js'
        ],
        assets:[{
            type: 'style',
            url: 'https://fonts.googleapis.com/css2?family=Material+Icons',
        }]
    }
}
```

To use this type:

``` 
build "video-player" new source "{source_goes_here}" 
```

***

to add it as a certain quality add this too this line

```
...and set quality to "{quality_240p}"
```

***

to add subtitles
```
...subtitles "{subtitle_file_name}" and label it as "{Language_Name}"
```

***

to change the progress bar use this line

```
update "{element}" progress bar color to "{color}"
```