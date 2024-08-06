import WebServerAI from '../assets/AI/js/webserverai.min.js';
import Events from '../assets/AI/js/components/Events.js';

if(window.WebServerAI!==undefined){
        let wsaEvent = new Events();
        let wsc = new WebServerAI({
            enabled: true,
            theme: 'dark',
            codeTheme: 'default',
            status: 'opened',
            position: 'bottom right',
            history:{
                save: 'session'
            },
            cte: true,
            extensions:{
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
                },
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
                },
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
                },
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
            }
        });
        wsc.load();
        wsc.submit(($input)=>{
            if($input){
                wsc.addCmd($input);
                wsc.send($input, true);
            }
            setTimeout(()=>{
                wsc.clearTextbox();
            },500);
        });   
        
}