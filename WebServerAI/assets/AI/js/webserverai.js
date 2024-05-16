import Listener from '/WebServerAI/assets/AI/js/Learner.js';
var responce;
class WebServerAI{
    /**
     * Create the WebServerAI library
     * @param {Object} settings Settings to the UI
     */
    constructor(settings={}){
        document.head.innerHTML+='<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tkbviet/font-awesome-6.5.2-pro-full@main/css/all.css"/>';
        this.theme = settings.hasOwnProperty('theme') ? settings.theme : 'light';
        this.pos = settings.hasOwnProperty('position') ? settings.position : 'bottom right';
        this.status = settings.hasOwnProperty('status') ? settings.status : 'opened';
        this.historyList = {
            save: (settings.hasOwnProperty('history') ? (settings.history.hasOwnProperty('save') ? settings.history.save : 'session') : 'session')
        }
        this.enabled = (settings.hasOwnProperty('enabled') ? settings.enabled : true);
        this.origin = window.location.origin;
        this.cmdID = 0;
        this.botName='';
        this.botInfo;
        this.getHistory = sessionStorage.getItem('wsa-history')||localStorage.getItem('wsa-history');
        this.history=(this.getHistory ? this.getHistory.split(',') : []);
        this.listen = new Listener();
        this.checked=false;
    }
    /**
     * Generates a random ID
     * @param {String} [prefix=''] Start your id with a prefix 
     * @param {Boolean} [more_entropy=false] Generate 23 characters instend of 13 
     * @returns 
     */
    uniqid(prefix='', more_entropy=false){
        return prefix+(Date.now().toString(36) + Math.random().toString(36).substr(2)).substr(0,(more_entropy ? 23 : 13));
    }
    /**
     * Gets file content
     * @param {String} url Location to get the file content
     * @param {Boolean} [isJSON=false] Converts string to JSON object
     * @param {Boolean} [async=false] Wait until page load
     * @param {Boolean} [retReq=false] Return as a XMLHttpRequest object
     * @returns {JSON|String}
     */
    request(url, isJSON=false, async=false, retReq=false){   
        let req = new XMLHttpRequest();
        req.onreadystatechange = ()=>{
            if(req.readyState==4&&req.status==200){
                if(!retReq){
                    if(isJSON){
                        responce = JSON.parse(req.responseText);
                    }
                    else{
                        responce = req.responseText;
                    }
                }else{
                    responce = req;
                }
            }
        }
        req.open("GET", url, async);
        req.send();
        return responce;
    }
    #getSel(txtarea) // JavaScript
    {
        // Obtain the index of the first selected character
        let start = txtarea.selectionStart;
    
        // Obtain the index of the last selected character
        let finish = txtarea.selectionEnd;
    
        // Obtain the selected text
        let sel = txtarea.value.substring(start, finish);
        return sel;
    }    
    #replaceSelection(textarea, replacementText) {
        let len = textarea.value.length,
         start = textarea.selectionStart,
         end = textarea.selectionEnd,
         sel = textarea.value.substring(start, end);
        textarea.value =  textarea.value.substring(0,start) + replacementText + textarea.value.substring(end,len);
    }
    #getApps(){
        let lng='';
        const x = JSON.parse(this.request(this.origin+'/WebServerAI/libs/ai_appInstaller.php?apptype=get')),
            keys = Object.keys(x),
            values = Object.values(x);
        for(let i=0;i<keys.length;i++){
            lng+='<li wsa-app-installed="'+values[i].installed+'" app-name="'+keys[i]+'" class="wsa-app-list-item">'+keys[i]+(values[i].installed ? '<em>(installed)</em>' : '')+'</li>';
        }
        return lng;
    }
    #getFolders(){
        const path = this.request(this.origin+'/WebServerAI/libs/ai_scanner.php');
        return path;
    }
    /**
     * Loads up the AI chatbox
     */
    load(){
        if(this.enabled){
            document.querySelector('html').setAttribute('wsa-active','');
            let chatBox = document.createElement('div');
            chatBox.setAttribute('wsa-theme',this.theme);
            chatBox.setAttribute('wsa-position',this.pos);
            chatBox.setAttribute('wsa-stat',this.status);
            chatBox.classList.add('wsa');
            chatBox.draggable = true;
            chatBox.setAttribute('ondragstart', 'dragBlock(event)');
            chatBox.setAttribute('ondragend', 'endDragBlock(event)');
            chatBox.innerHTML = `<div class="wsa-toggle-btn wsa-opened"></div>`;
            const container = document.createElement('div');
            container.classList.add('wsa-container');
            container.innerHTML = `<h2 class="wsa-title">WebServerAI - XHiddenProjects <span class="wsa-version">v`+this.request(this.origin+'/WebServerAI/data/settings.json?u='+this.uniqid(),true)['AI']['Version']+`</span></h2>
                <div class="wsa-ui">
                    <div class="wsa-history"></div>
                    <div class="wsa-editor">
                        <textarea class="wsa-userinput" tab-index="1"></textarea>
                        <div class="wsa-controllers">
                            <div class="wsa-btn-group">
                                <button class="wsa-btn wsa-history-up" title="Latest History"><i class="fa-solid fa-clock-rotate-left fa-flip-horizontal"></i></button>
                                <button class="wsa-btn wsa-history-down" title="Past History"><i class="fa-solid fa-clock-rotate-left"></i></button>
                                <button class="wsa-btn wsa-history-clear" title="Clear History"><i class="fa-solid fa-broom-wide"></i></button>
                            </div>
                            <div class="wsa-btn-group">
                                <button class="wsa-btn wsa-theme-change" wsa-current-theme="`+this.theme+`" title="Change theme">`+(this.theme==='light' ?  '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon-stars"></i>')+`</button>
                                <button class="wsa-btn wsa-clearBox" title="Clear"><i class="fa-solid fa-eraser"></i></button>
                            </div>
                            <div class="wsa-btn-group">
                                <button class="wsa-btn wsa-dbq" title="Insert in-text Double quotes"><i class="fa-solid fa-quotes"></i></button>
                                <button class="wsa-btn wsa-sgq" title="Insert in-text Single quotes"><i class="fa-solid fa-quote-left"></i></button>
                                <button class="wsa-btn wsa-apt" title="Insert in-text Apostrophe"><i class="fa-solid fa-apostrophe"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            chatBox.appendChild(container);
            document.body.appendChild(chatBox);
            this.botInfo = this.request(this.origin+'/WebServerAI/data/settings.json?u='+this.uniqid(),true)['AI'];
            this.botName = this.botInfo['Name'];
        
            window.addEventListener('keydown',(e)=>{
                    let key = e.keyCode || e.which;
                    if(e.ctrlKey&&key==79){
                        e.preventDefault();
                        const elem = document.querySelector('.wsa');
                        if( elem.getAttribute('wsa-stat')==='opened')
                            elem.setAttribute('wsa-stat','closed');
                        else
                            elem.setAttribute('wsa-stat','opened');
                    }
            });
            window.addEventListener('scroll',(e)=>{
                    let offsetY = window.pageYOffset,
                        offsetX = window.pageXOffset,
                        elem = document.querySelector('.wsa'),
                        pos = elem.getAttribute('wsa-position').split(' ');
                    elem.removeAttribute('style');
                    if(pos[0]==='top')
                        elem.style.top = offsetY;
                    else
                        elem.style.bottom = -offsetY;

                    if(pos[1]==='left')
                            elem.style.left = offsetX;
                    else
                        elem.style.right = -offsetX;
                    
            });
            document.querySelector('.wsa').addEventListener('mousedown',function(event){
                if(!event.target.classList.contains('wsa-userinput')&&event.target.tagName.toLowerCase()!=='i'){
                    this.classList.add('dragging');
                    const pos = ['top left', 'top center' ,'top right', 'center left', 'center right' ,'bottom left', 'bottom center' ,'bottom right'];
                    if(!document.querySelector('.wsa-drop-bubble')){
                        for(let i=0;i<pos.length;i++){
                            let x = document.createElement('div');
                            x.className = 'wsa-drop-bubble';
                            x.setAttribute('landing-pos',pos[i]);
                            x.setAttribute('ondrop','DropBlock(event)');
                            x.setAttribute('ondragover','AllowDropBlock(event)');
                            document.body.appendChild(x);
                        }
                    }
                }
            },false);
            document.querySelector('.wsa').addEventListener('touchstart',function(event){
                if(!event.target.classList.contains('wsa-userinput')&&event.target.tagName.toLowerCase()!=='i'){
                    this.classList.add('dragging');
                    const pos = ['top left', 'top center' ,'top right', 'center left', 'center right' ,'bottom left', 'bottom center' ,'bottom right'];
                    if(!document.querySelector('.wsa-drop-bubble')){
                        for(let i=0;i<pos.length;i++){
                            let x = document.createElement('div');
                            x.className = 'wsa-drop-bubble';
                            x.setAttribute('landing-pos',pos[i]);
                            x.addEventListener('click',(e)=>{
                                this.setAttribute('wsa-position',e.target.getAttribute('landing-pos'));
                                this.classList.remove('dragging');
                                const bubbles = document.querySelectorAll('.wsa-drop-bubble');
                                for(let i=0;i<bubbles.length;i++){
                                    bubbles[i].remove();
                                }
                            });
                            document.body.appendChild(x);
                        }
                    }
                }
            },false);
            document.querySelector('.wsa').addEventListener('touchmove',function(event){
                if(!event.target.classList.contains('wsa-userinput')&&event.target.tagName.toLowerCase()!=='i'){
                    this.classList.add('dragging');
                    const pos = ['top left', 'top center' ,'top right', 'center left', 'center right' ,'bottom left', 'bottom center' ,'bottom right'];
                    if(!document.querySelector('.wsa-drop-bubble')){
                        for(let i=0;i<pos.length;i++){
                            let x = document.createElement('div');
                            x.className = 'wsa-drop-bubble';
                            x.setAttribute('landing-pos',pos[i]);
                            x.addEventListener('click',(e)=>{
                                this.setAttribute('wsa-position',e.target.getAttribute('landing-pos'));
                                this.classList.remove('dragging');
                                const bubbles = document.querySelectorAll('.wsa-drop-bubble');
                                for(let i=0;i<bubbles.length;i++){
                                    bubbles[i].remove();
                                }
                            });
                            document.body.appendChild(x);
                        }
                    }
                }
            },false);


            document.querySelector('.wsa').addEventListener('mouseup',function(){
                this.classList.remove('dragging');
                const bubbles = document.querySelectorAll('.wsa-drop-bubble');
                for(let i=0;i<bubbles.length;i++){
                    bubbles[i].remove();
                }
            });
                document.querySelector('.wsa-theme-change').addEventListener('click',function(){
                    if(this.getAttribute('wsa-current-theme')==='light'){
                        this.setAttribute('wsa-current-theme', 'dark');
                        this.querySelector('i').className = 'fa-solid fa-moon-stars';
                    }else{
                        this.setAttribute('wsa-current-theme', 'light');
                        this.querySelector('i').className = 'fa-solid fa-sun';
                    }
                    document.querySelector('.wsa').setAttribute('wsa-theme',this.getAttribute('wsa-current-theme'));
                });
                document.querySelector('.wsa-clearBox').addEventListener('click',()=>{
                    document.querySelector('.wsa-userinput').value = '';
                });
                document.querySelector('.wsa-history-clear').addEventListener('click',()=>{
                        document.querySelector('.wsa-ui .wsa-history').innerHTML = '';
                        this.history = [];
                        (this.historyList.save==='local' ? localStorage.setItem('wsa-history',this.history) : sessionStorage.setItem('wsa-history',this.history));
                        console.clear();
                        this.cmdID = 0;
                });
                document.querySelector('.wsa-dbq').addEventListener('click',()=>{
                    const txtarea = document.querySelector('.wsa-userinput');
                    this.#replaceSelection(txtarea, '\\\"'+this.#getSel(txtarea)+'\\\"');
                });
                document.querySelector('.wsa-sgq').addEventListener('click',()=>{
                    const txtarea = document.querySelector('.wsa-userinput');
                    this.#replaceSelection(txtarea, '\\\''+this.#getSel(txtarea)+'\\\'');
                });
                document.querySelector('.wsa-apt').addEventListener('click',()=>{
                    const txtarea = document.querySelector('.wsa-userinput');
                    this.#replaceSelection(txtarea, this.#getSel(txtarea)+'\\\`');
                });
            const txtarea = document.querySelector('.wsa-userinput'),
                    historyUp = document.querySelector('.wsa-history-up'),
                    historyDown = document.querySelector('.wsa-history-down');
            var inc=0;
            txtarea.addEventListener('keydown',(e)=>{
                    let k = e.keyCode || e.which;
                    //38 = up; 40 = down
                    if(k==38){
                        e.preventDefault();
                        inc+=1;
                        if(inc > this.history.length-1){
                            inc = inc-1;
                        }
                        txtarea.value = (this.history[inc] ? this.history[inc] : '');
                    }else if(k==40){
                        e.preventDefault();
                        inc-=1;
                        if(inc < 0){
                            inc = 0;
                        }
                        txtarea.value = (this.history[inc] ? this.history[inc] : '');
                    }
            });
            historyUp.addEventListener('click',()=>{
                inc+=1;
                        if(inc > this.history.length-1){
                            inc = inc-1;
                        }
                        txtarea.value = (this.history[inc] ? this.history[inc] : '');
            });
            historyDown.addEventListener('click',()=>{
                inc-=1;
                        if(inc < 0){
                            inc = 0;
                        }
                        txtarea.value = (this.history[inc] ? this.history[inc] : '');
            });
            window.addEventListener('load',()=>{
                    const sc = document.createElement('script');
                    sc.src = this.origin+'/WebServerAI/assets/AI/js/dragdrop.min.js';
                    sc.type = 'text/javascript';
                    document.body.appendChild(sc);
            });
            //hover selected element
            document.querySelector('html[wsa-active]').addEventListener('mouseover',(e)=>{
                if(!e.target.matches('.wsa, .wsa *')){
                    e.target.classList.add('wsa-elemfocus');
                    e.target.addEventListener('mouseout',(o)=>{
                        e.target.classList.remove('wsa-elemfocus');
                        if(e.target.parentElement.querySelector('.wsa-targetName'))
                            e.target.parentElement.querySelector('.wsa-targetName').remove();
                        e.target.parentElement.removeAttribute('wsa-target-container');
                    });
                    const elem = document.createElement('div');
                    elem.classList.add('wsa-targetName');
                    elem.innerHTML = '<span class="wsa-target-tag">'+e.target.tagName+'</span><span class="wsa-target-attr">'+ (e.target.id ? '#'+e.target.id : '') + (e.target.classList.length > 0 ? '.'+e.target.className.replace(' ','.') : '')+'</span>';
                    e.target.parentElement.appendChild(elem);
                    e.target.parentElement.setAttribute('wsa-target-container','');
                }
            });
        }
    }
    /**
     * Triggers on users input from textarea
     * @param {Function} callback The function that will activate on submit
     * @returns {String} The Users input
     */
    submit(callback){
        if(this.enabled){
            const txt = document.querySelector('.wsa-ui textarea');
            txt.addEventListener('keydown', (e)=>{
                let key = e.keyCode || e.which;
                if(key===13){
                    e.preventDefault();
                    callback(this.#filter(txt.value));
                    txt.value = '';
                }
            });
        }
    }
    /**
     * Filters out special characters
     * @param {String} str String to filter
     * @returns {String} Filtered string
     */
    #filter(str){
        var lt = /</g, 
            gt = />/g, 
            ap = /'/g, 
            ic = /"/g;
        return str.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");
    }
    #cmds(str){
        let canReturn = true,
            lastID=0;
        if(str.match(/^wsa --clear(:[123456789]+)?$/)){
            let matches = str.match(/^wsa --clear(:[123456789]+)?$/);
            if(matches[1]){
                if(document.querySelector('.wsa-ui .wsa-history [wsa-cmdid="'+matches[1].replace(':','')+'"]')){
                    document.querySelector('.wsa-ui .wsa-history [wsa-cmdid="'+matches[1].replace(':','')+'"]').remove();
                    let reNum = document.querySelectorAll('.wsa-ui .wsa-history [wsa-cmdid]');
                    this.history.splice(parseInt(matches[1].replace(':',''))-1, 1);
                    (this.historyList.save==='local' ? localStorage.setItem('wsa-history',this.history) : sessionStorage.setItem('wsa-history',this.history));
                    for(let i=0;i<reNum.length;i++){
                        if(parseInt(reNum[i].getAttribute('wsa-cmdid'))>parseInt(matches[1].replace(':',''))){
                            
                            reNum[i].setAttribute('wsa-cmdid', parseInt(reNum[i].getAttribute('wsa-cmdid'))-1);
                        }
                        lastID = (lastID<parseInt(reNum[i].getAttribute('wsa-cmdid')) ? parseInt(reNum[i].getAttribute('wsa-cmdid')) : lastID);
                    }
                    this.cmdID = lastID;
                }else{
                    setTimeout(()=>{
                        this.createCmd(this.botName, 'Message not found', 'danger');
                        document.querySelector('.wsa-userinput').disabled = false;
                    },this.botInfo['ResponceTime']); 
                }
            }else{
                document.querySelector('.wsa-ui .wsa-history').innerHTML = '';
                this.history = [];
                (this.historyList.save==='local' ? localStorage.setItem('wsa-history',this.history) : sessionStorage.setItem('wsa-history',this.history));
                this.cmdID = 0;
            }
            document.querySelector('.wsa-userinput').disabled = false;
            console.clear();
            canReturn = false;
        }
        if(str.match(/^wsa --info$/)){
            setTimeout(()=>{
            this.createCmd(this.botName, 'Name: '+this.botName+'<br/>Version: '+this.botInfo['Version']+'<br/>Updated: '+
            this.botInfo['Updated'], 'info');
            document.querySelector('.wsa-userinput').disabled = false;
            },this.botInfo['ResponceTime']);
            canReturn = false;
        }
        if(str.match(/^wsa --connect (.*?)$/)){
            const matches = str.match(/^wsa --connect (.*?)$/);
            window.open(matches[1],'_self');
            document.querySelector('.wsa-userinput').disabled = false;
            canReturn = false;
        }
        if(str.match(/^wsa --help$/)){
            setTimeout(()=>{
                this.createCmd(this.botName, `
                <b>help</b> - Gives the list of commands<br/>
                <b>clear{:int?}</b> - Clears out the entire history or a certain index<br/>
                <b>info</b> - Returns the AI information<br/>
                <b>connect {url}</b> - Connects you to another page<br/>
            `,'info');
            document.querySelector('.wsa-userinput').disabled = false;
        },this.botInfo['ResponceTime']);
            canReturn = false;
        }

        return canReturn;
    }
    createCmd(user,msg, type="normal"){
        const ui = document.querySelector('.wsa-ui .wsa-history'),
                        addElem = document.createElement('div');
                    addElem.setAttribute('wsa-cmdID',(this.cmdID+=1));
                    addElem.setAttribute('wsa-cmdType',type);
                    addElem.innerHTML = `<p class="wsa-user">`+user+`:</p>`;
                    addElem.innerHTML += `<p class="wsa-cmd"><span class="wsa-txt">`+msg+`</span> <button class="wsa-copymsg"><i class="fa-solid fa-copy"></i></button></p>`;
                    addElem.classList.add('wsa-history-item');
                    addElem.querySelector('button').addEventListener('click',function(){
                        navigator.clipboard.writeText(this.parentElement.querySelector('.wsa-txt').innerText)
                        .then(() => alert('Copied to clipboard'))
                        .catch((error) => alert('Error writing to clipboard:', error));
                    });
                    ui.appendChild(addElem);
    }
    addCmd(msg){
       let rsp = this.request(this.origin+'/WebServerAI/libs/ai_sender.php?wsaai='+encodeURIComponent(msg)),
           res = this.listen.render(rsp);
       console.log(res);
       if(res){
        setTimeout(()=>{
            this.createCmd(this.botName, 'Successfully executed', 'success');
                document.querySelector('.wsa-userinput').disabled = false;
            },this.botInfo['ResponceTime']);
       }else{
        setTimeout(()=>{
            this.createCmd(this.botName, 'There was an error with this statement', 'danger');
            document.querySelector('.wsa-userinput').disabled = false;
            },this.botInfo['ResponceTime']);
       }
    }
    /**
     * Sends the message to the bot
     * @param {String} msg Sent message from the user
     * @param {Boolean} [checkNull=false] Checks if the message is empty
     * @returns {void}
     */
    send(msg,checkNull=false){
        const user = this.request(this.origin+'/WebServerAI/data/settings.json?u='+this.uniqid(),true)['User'];
        document.querySelector('.wsa-userinput').disabled = true;
        if(checkNull){
            if(msg){
                if(this.#cmds(msg)){
                    this.history.push(msg);
                    (this.historyList.save==='local' ? localStorage.setItem('wsa-history',this.history) : sessionStorage.setItem('wsa-history',this.history));
                    this.createCmd(user,msg)
                    document.querySelector('.wsa-userinput').disabled = false;
                }
            }
        }else{
            this.history.push(msg);
            (this.historyList.save==='local' ? localStorage.setItem('wsa-history',this.history) : sessionStorage.setItem('wsa-history',this.history));
            this.createCmd(user,msg);
            document.querySelector('.wsa-userinput').disabled = false;
        }
    }
    copyToClip(e){
        navigator.clipboard.writeText(e.parentElement.querySelector('.wsa-txt').innerText)
        .then(() => alert('Copied to clipboard'))
        .catch((error) => alert('Error writing to clipboard:', error));
    }
}

export default WebServerAI;