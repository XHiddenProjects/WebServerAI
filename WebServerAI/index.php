<html>
    <head>
        <title>WebServerAI - AI powered Web building software</title>
        <meta name="description" content="WebServerChat is a sophisticated JavaScript AI chatbot designed to enhance user interactions within a web server environment. This intelligent chatbot seamlessly integrates with web applications to provide real-time assistance, answer queries, offer recommendations, and engage users in interactive conversations. With advanced natural language processing capabilities, WebServerChat delivers personalized and efficient support, making it an invaluable tool for enhancing user experience and facilitating communication on web servers." />
        <meta name="keywords" content="WebServerChat, JavaScript, AI, chatbot, web server, user interactions, web applications, real-time assistance, natural language processing, personalized support, user experience, communication" />
        <meta name="author" content="XHiddenProjects">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    </head>
    <body>
    <script type="module">
        import WebServerAI from '//localhost/WebServerAI/assets/AI/js/webserverai.min.js';
        if(window.WebServerAI!==undefined){
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
                    clock:{
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
                    }
                }
            });
            wsc.load();
            wsc.submit(($input)=>{
                if($input){
                    wsc.addCmd($input);
                    wsc.send($input, true);
                }
            });
        }
    </script>
    </body>
</html>