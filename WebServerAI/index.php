<html>
    <head>
        <title>WebServerAI - AI powered Web building software</title>
        <meta name="description" content="WebServerChat is a sophisticated JavaScript AI chatbot designed to enhance user interactions within a web server environment. This intelligent chatbot seamlessly integrates with web applications to provide real-time assistance, answer queries, offer recommendations, and engage users in interactive conversations. With advanced natural language processing capabilities, WebServerChat delivers personalized and efficient support, making it an invaluable tool for enhancing user experience and facilitating communication on web servers." />
        <meta name="keywords" content="WebServerChat, JavaScript, AI, chatbot, web server, user interactions, web applications, real-time assistance, natural language processing, personalized support, user experience, communication" />
        <meta name="author" content="XHiddenProjects">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="./assets/AI/css/webserverai.css?v=<?php echo time();?>"/>
    </head>
    <body>
    <script type="module">
        import WebServerAI from './assets/AI/js/webserverai.js?v=<?php echo time();?>'
        let wsc = new WebServerAI({
            enabled: true,
            theme: 'dark',
            status: 'opened',
            position: 'bottom right',
            history:{
                save: 'session'
            }
        });
        wsc.load();
        wsc.submit(($input)=>{
            wsc.addCmd($input);
            wsc.send($input, true);
        });
    </script>
    </body>
</html>