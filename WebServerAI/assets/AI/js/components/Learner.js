var responce;
class Listener{
    constructor(){
        this.lineCode=[];
        this.location = document.querySelector('body');
        this.origin = window.location.origin;
        this.placeOver = 0;
        this.holder = -1;
        this.currentTarget=null;
        this.buildEvent=null;
    }
    /**
     * Gets file content
     * @param {String} url Location to get the file content
     * @param {Boolean} [isJSON=false] Converts string to JSON object
     * @param {Boolean} [async=false] Wait until page load
     * @returns {JSON|String}
     */
    #request(url, isJSON=false, async=false){   
        let req = new XMLHttpRequest();
        req.onreadystatechange = ()=>{
            if(req.readyState==4&&req.status==200){
                if(isJSON){
                    responce = JSON.parse(req.responseText);
                }
                else{
                    responce = req.responseText;
                }
            }
        }
        req.open("GET", url, async);
        req.send();
        return responce;
    }

    /**
     * Checks for URL to convert to CSS format
     * @param {String} str String to check for URL
     * @returns {String} str || url(str)
     */
    #checkCSSURL(str){
        if(str.match(/^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/igm)){
            return 'url('+str+')';
        }else{
            return str;
        }
    }
    /**
     * Generates a random ID
     * @param {String} [prefix=''] Start your id with a prefix 
     * @param {Boolean} [more_entropy=false] Generate 23 characters instend of 13 
     * @returns 
     */
    #uniqid(prefix='', more_entropy=false){
        return prefix+(Date.now().toString(36) + Math.random().toString(36).substr(2)).substr(0,(more_entropy ? 23 : 13));
    }
    /**
     * Finds target
     * @param {String} str String to check
     * @returns {String} Link target
     */
    #selectATarget(str){
        if(str.match(/new window|new tab|blank/i)){
            return '_blank';
        }else if(str.match(/same page|same window|self/i)){
            return '_self';
        }else if(str.match(/parent|parent frame/i)){
            return '_parent';
        }else if(str.match(/top|full body/i)){
            return '_top';
        }else{
            return str;
        }
    }
    /**
     * Returns directions
     * @param {String} str Checks for specific direction
     * @param {String} 
     */
    #dirName(str){
        if(str.match(/left-to-right|left to right/i)){
            return 'ltr';
        }else if(str.match(/right-to-left|right to left/i)){
            return 'rtl';
        }else{
            return 'ltr';
        }
    }
    /**
     * Returns fixated carets
     * @param {*} str String to check
     * @returns {String} Fixed carets
     */
    #replaceCaret(str){
        return str.replaceAll('&lt;','<').replaceAll('&gt;','>');
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
    /**
     * Executes command
     * @param {String} AICode 
     * @returns {Array<boolean,string>|Boolean} Returns information on success
     */
    render(AICode){
        this.lineCode = [];
        this.holder = -1;
        let success=true;
        AICode = AICode.split(/(?<=})\|\|/g).map((x)=>{return x.replace(/^{|}$/g, '')}).filter((x)=>{return x!==''});
        if(AICode.length>0){
            for(let i=0;i<AICode.length;i++){
                const action = AICode[i].split('_')[0].toLocaleLowerCase(),
                    value = AICode[i].split('_')[1];
                switch(action){
                    case 'add':
                        switch(value.toLocaleLowerCase()){
                            case 'abbr':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'abbr',styles:{},scripts:{}});
                            break;
                            case 'address':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'address',styles:{},scripts:{}});
                            break;
                            case 'area':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'area',styles:{},scripts:{}});
                            break;
                            case 'article':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'article',styles:{},scripts:{}});
                            break;
                            case 'aside':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'aside',styles:{},scripts:{}});
                            break;
                            case 'audio':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'audio',styles:{},scripts:{}});
                            break;
                            case 'base':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'base',styles:{},scripts:{}});
                            break;
                            case 'bdi':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'bdi',styles:{},scripts:{}});
                            break;
                            case 'bdo':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'bdo',styles:{},scripts:{}});
                            break;
                            case 'br':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'br',styles:{},scripts:{}});
                            break;
                            case 'canvas':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'canvas',styles:{},scripts:{}});
                            break;
                            case 'caption':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'caption',styles:{},scripts:{}});
                            break;
                            case 'codeinline':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'code',styles:{},scripts:{}});
                            break;
                            case 'codeblock':
                                const targetClass = this.#uniqid();
                                this.holder+=1;
                                this.lineCode.push({tagName: 'pre',classes: 'line-numbers '+targetClass, styles:{},scripts:{}});
                                this.holder+=1;
                                this.lineCode.push({tagName: 'code',location: 'pre.'+targetClass,styles:{},scripts:{}});
                            break;
                            case 'col':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'col',styles:{},scripts:{}});
                            break;
                            case 'colgroup':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'colgroup',styles:{},scripts:{}});
                            break;
                            case 'datablock':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'data',styles:{},scripts:{}});
                            break;
                            case 'datalist':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'datalist',styles:{},scripts:{}});
                            break;
                            case 'dd':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'dd',styles:{},scripts:{}});
                            break;
                            case 'del':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'del',styles:{},scripts:{}});
                            break;
                            case 'details':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'details',styles:{},scripts:{}});
                            break;
                            case 'dfn':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'dfn',styles:{},scripts:{}});
                            break;
                            case 'dialog':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'dialog',styles:{},scripts:{}});
                            break;
                            case 'div':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'div',styles:{},scripts:{}});
                            break;
                            case 'dl':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'dl',styles:{},scripts:{}});
                            break;
                            case 'dt':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'dt',styles:{},scripts:{}});
                            break;
                            case 'embed':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'embed',styles:{},scripts:{}});
                            break;
                            case 'fieldset':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'fieldset',styles:{},scripts:{}});
                            break;
                            case 'legend':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'legend',styles:{},scripts:{}});
                            break;
                            case 'figcaption':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'figcaption',styles:{},scripts:{}});
                            break;
                            case 'figure':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'figure',styles:{},scripts:{}});
                            break;
                            case 'footer':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'footer',styles:{},scripts:{}});
                            break;
                            case 'iframe':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'iframe',styles:{},scripts:{}});
                            break;
                            case 'hgroup':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'hgroup',styles:{},scripts:{}});
                            break;
                            case 'hr':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'hr',styles:{},scripts:{}});
                            break;
                            case 'ul':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'ul',styles:{},scripts:{}});
                            break;
                            case 'ol':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'ol',styles:{},scripts:{}});
                            break;
                            case 'li':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'li',styles:{},scripts:{}});
                            break;
                            case 'icon':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'link',type: 'icon',styles:{},scripts:{}});
                            break;
                            case 'shortcuticon':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'link',type: 'shortcut icon',styles:{},scripts:{}});
                            break;
                            case 'appletouchicon':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'link',type: 'apple-touch-icon',styles:{},scripts:{}});
                            break;
                            case 'main':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'main',styles:{},scripts:{}});
                            break;
                            case 'map':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'map',styles:{},scripts:{}});
                            break;
                            case 'mark':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'mark',styles:{},scripts:{}});
                            break;
                            case 'menu':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'menu',styles:{},scripts:{}});
                            break;
                            case 'meter':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'meter',styles:{},scripts:{}});
                            break;
                            case 'optgroup':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'optgroup',styles:{},scripts:{}});
                            break;
                            case 'option':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'option',styles:{},scripts:{}});
                            break;
                            case 'heading':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'h',styles:{},scripts:{}});
                            break;
                            case 'header':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'header',styles:{},scripts:{}});
                            break;
                            case 'image':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'img',styles:{},scripts:{}});
                            break;
                            case 'kbd':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'kbd',styles:{},scripts:{}});
                            break;
                            case 'paragraph':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'p',styles:{},scripts:{}});
                            break;
                            case 'hlink':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'a',styles:{},scripts:{}});
                            break;
                            case 'source':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'source',styles:{},scripts:{}});
                            break;
                            case 'nav':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'nav',styles:{},scripts:{}});
                            break;
                            case 'object':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'object',styles:{},scripts:{}});
                            break;
                            case 'titlepage':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'title',styles:{},scripts:{}});
                            break;
                            case 'blockquote':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'blockquote',styles:{},scripts:{}});
                            break;
                            //Form elements
                            case 'form':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'form',styles:{},scripts:{}});
                            break;
                            case 'labelblock':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'label',styles:{},scripts:{}});
                            break;
                            case 'inputtext':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'text',styles:{},scripts:{}});
                            break;
                            case 'inputtextbox':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'textarea',styles:{},scripts:{}});
                            break;
                            case 'button':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'button',type: 'button',styles:{},scripts:{}});
                            break;
                            case 'submit':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'button',type: 'submit',styles:{},scripts:{}});
                            break;
                            case 'reset':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'button',type: 'reset',styles:{},scripts:{}});
                            break;
                            case 'checkbox':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'checkbox',styles:{},scripts:{}});
                            break;
                            case 'radio':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'radio',styles:{},scripts:{}});
                            break;
                            case 'inputcolor':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'color',styles:{},scripts:{}});
                            break;
                            case 'inputdate':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'date',styles:{},scripts:{}});
                            break;
                            case 'inputdatetimelocal':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'datetime-local',styles:{},scripts:{}});
                            break;
                            case 'inputemail':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'email',styles:{},scripts:{}});
                            break;
                            case 'inputfile':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'file',styles:{},scripts:{}});
                            break;
                            case 'inputhidden':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'hidden',styles:{},scripts:{}});
                            break;
                            case 'inputimg':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'image',styles:{},scripts:{}});
                            break;
                            case 'inputmonth':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'month',styles:{},scripts:{}});
                            break;
                            case 'inputnumber':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'number',styles:{},scripts:{}});
                            break;
                            case 'inputpsw':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'password',styles:{},scripts:{}});
                            break;
                            case 'inputrange':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'range',styles:{},scripts:{}});
                            break;
                            case 'inputsearch':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'search',styles:{},scripts:{}});
                            break;
                            case 'inputtel':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'tel',styles:{},scripts:{}});
                            break;
                            case 'inputtime':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'time',styles:{},scripts:{}});
                            break;
                            case 'inputurl':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'url',styles:{},scripts:{}});
                            break;
                            case 'inputweek':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'week',styles:{},scripts:{}});
                            break;
                            case 'selectbox':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'select',styles:{},scripts:{}, wsaNoSelect:false});
                            break;
                        }
                    break;
                    case 'build':
                        this.lineCode.push({tagName: 'div', classes: "wpa-build-"+value ,html: JSON.parse(sessionStorage.getItem('wsa_extensions'))[value]['extension_temp'],styles:{},scripts:{}});
                        this.buildEvent = new CustomEvent("wsa-build",{detail: {type:value, input:document.querySelector('.wsa-userinput').value}});
                    break;
                    case 'remove':
                        switch(value.toLocaleLowerCase()){
                            case 'color':
                                if(this.currentTarget!==null){
                                    if(Array.isArray(this.currentTarget))
                                        this.currentTarget.forEach((el)=>{el.style.color = '';});
                                    else
                                        this.currentTarget.style.color = '';
                                }else
                                    this.lineCode[this.holder].style.color = delete this.lineCode[this.holder].styles.color;
                            break;
                            case 'background':
                            case 'bg':
                                if(this.currentTarget!==null){
                                    if(Array.isArray(this.currentTarget))
                                        this.currentTarget.forEach((el)=>{el.style.background = '';});
                                    else
                                        this.currentTarget.style.background = '';
                                }else
                                    this.lineCode[this.holder].style.bg = delete this.lineCode[this.holder].styles.bg;
                            break;
                            case 'align':

                                if(this.currentTarget!==null){
                                    if(Array.isArray(this.currentTarget))
                                        this.currentTarget.forEach((el)=>{el.style.textAlign = '';});
                                    else
                                        this.currentTarget.style.textAlign = '';
                                }else
                                    this.lineCode[this.holder].styles.align = delete this.lineCode[this.holder].styles.align;
                            break;
                            case 'underline':
                                if(this.currentTarget!==null){
                                    if(Array.isArray(this.currentTarget))
                                        this.currentTarget.forEach((el)=>{el.style.textDecoration = (el.style.textDecoration.replace('underline','') ? el.style.textDecoration.replace('underline','') : 'none');});
                                    else
                                    this.currentTarget.style.textDecoration = (this.currentTarget.style.textDecoration.replace('underline','')!=='' ? this.currentTarget.style.textDecoration.replace('underline','') : 'none');
                                }else
                                    this.lineCode[this.holder].styles.textDecoration = (this.lineCode[this.holder].styles.textDecoration&&this.lineCode[this.holder].styles.textDecoration!=='' ? this.lineCode[this.holder].styles.textDecoration.replace('underline','') :  'none');
                            break;
                            case 'strikethrough':
                                if(this.currentTarget!==null){
                                    if(Array.isArray(this.currentTarget))
                                        this.currentTarget.forEach((el)=>{el.style.textDecoration = (el.style.textDecoration.replace('strikethrough','') ? el.style.textDecoration.replace('strikethrough','') : 'none');});
                                    else
                                    this.currentTarget.style.textDecoration = (this.currentTarget.style.textDecoration.replace('strikethrough','')!=='' ? this.currentTarget.style.textDecoration.replace('strikethrough','') : 'none');
                                }else
                                    this.lineCode[this.holder].styles.textDecoration = (this.lineCode[this.holder].styles.textDecoration&&this.lineCode[this.holder].styles.textDecoration!=='' ? this.lineCode[this.holder].styles.textDecoration.replace('strikethrough','') :  'none');
                            break;
                        }
                    break;
                    case 'query':
                        this.currentTarget = (document.querySelector(value+':not(.wsa '+value+')')!==undefined ? document.querySelector(value+':not(.wsa '+value+')') : null);
                    break;
                    case 'list':
                        value.split(/(?<!\\),/).forEach((items)=>{
                            this.lineCode[this.holder].html = (this.lineCode[this.holder].html ?  this.lineCode[this.holder].html + '<li>'+items.replace(/\\,/g,',')+'</li>' : '<li>'+items.replace(/\\,/g,',')+'</li>');
                        });
                    break;
                    
                    case 'queryall':
                        this.currentTarget = (document.querySelectorAll(value+':not(.wsa '+value+')')!==undefined ? document.querySelectorAll(value+':not(.wsa '+value+')') : null);
                    break;
                    case 'size':
                        if( this.lineCode[this.holder].tagName==='h'){
                            this.lineCode[this.holder].tagName+=value;
                        }else{
                            this.lineCode[this.holder].styles.size = value;
                        }
                    break;
                    case 'location':
                        this.lineCode[this.holder].location = value;
                    break;
                    case 'text':
                        this.lineCode[this.holder].text = this.#replaceCaret(value);
                    break;
                    case 'class':
                        this.lineCode[this.holder].classes = value;
                    break;
                    case 'id':
                        this.lineCode[this.holder].id = value;
                    break;
                    case 'name':
                        this.lineCode[this.holder].name = value;
                    break;
                    case 'data':
                        this.lineCode[this.holder].data = value;
                    break;
                    case 'usemap':
                        this.lineCode[this.holder].usemap = value;
                    break;
                    case 'open':
                        this.lineCode[this.holder].open = true;
                    break;
                    case 'value':
                        this.lineCode[this.holder].value = value;
                    break;
                    case 'src':
                        this.lineCode[this.holder].src = value;
                    break;
                    case 'pxs':
                        this.lineCode[this.holder].pxs = value;
                    break;
                    case 'type':
                        this.lineCode[this.holder].type = value;
                    break;
                    case 'dir':
                        this.lineCode[this.holder].dir = value;
                    break;
                    case 'cite':
                        this.lineCode[this.holder].cite = value;
                    break;
                    case 'hurl':
                        this.lineCode[this.holder].href = value;
                    break;
                    case 'target':
                        this.lineCode[this.holder].target = value;
                    break;
                    case 'title':
                        this.lineCode[this.holder].title = value;
                    break;
                    case 'label':
                        this.lineCode[this.holder].label = value;
                    break;
                    case 'controls':
                        this.lineCode[this.holder].controls = true;
                    break;
                    case 'shape':
                        this.lineCode[this.holder].shape = value;
                    break;
                    case 'coords':
                        this.lineCode[this.holder].coords = value;
                    break;
                    case 'alt':
                        this.lineCode[this.holder].alt = value;
                    break;
                    //form
                    case 'required':
                        this.lineCode[this.holder].required = true;
                    break;
                    case 'placeholder':
                        this.lineCode[this.holder].placeholder = value;
                    break;
                    case 'min':
                        this.lineCode[this.holder].min = value;
                    break;
                    case 'max':
                        this.lineCode[this.holder].max = value;
                    break;
                    //css
                    case 'color':
                        this.lineCode[this.holder].styles.color = value;
                    break;
                    case 'bg':
                        this.lineCode[this.holder].styles.bg = value;
                    break;
                    case 'bold':
                        this.lineCode[this.holder].styles.fontWeight = 'bold';
                    break;
                    case 'italic':
                        this.lineCode[this.holder].styles.fontStyle += 'italic';
                    break;
                    case 'underline':
                        this.lineCode[this.holder].styles.textDecoration = (this.lineCode[this.holder].styles.textDecoration ? this.lineCode[this.holder].styles.textDecoration + 'underline ' : 'underline ');
                    break;
                    case 'strikethrough':
                        this.lineCode[this.holder].styles.textDecoration = (this.lineCode[this.holder].styles.textDecoration ? this.lineCode[this.holder].styles.textDecoration + 'line-through ' : 'line-through ');
                    break;
                    case 'align':
                        this.lineCode[this.holder].styles.align = value;
                    break;
                }
            }
            this.currentTarget = null;
            for(let i=0;i<this.lineCode.length;i++){
                const elem = document.createElement(this.lineCode[i].tagName);
                let txtderc='';
                (this.lineCode[i].text ? elem.innerText = this.lineCode[i].text : '');
                (this.lineCode[i].html ? elem.innerHTML = this.lineCode[i].html : '');
                (this.lineCode[i].classes ? elem.className = this.lineCode[i].classes : '');
                (this.lineCode[i].type ? elem.type = this.lineCode[i].type : '');
                (this.lineCode[i].id ? elem.id = this.lineCode[i].id : '');
                (this.lineCode[i].pxs ? elem.sizes = this.lineCode[i].pxs : '');
                (this.lineCode[i].open ? elem.open = this.lineCode[i].open : '');
                (this.lineCode[i].placeholder ? elem.placeholder = this.lineCode[i].placeholder : '');
                (this.lineCode[i].min ? elem.min = this.lineCode[i].min : '');
                (this.lineCode[i].max ? elem.max = this.lineCode[i].max : '');
                (this.lineCode[i].name ? elem.name = this.lineCode[i].name : '');
                (this.lineCode[i].data ? elem.data = this.lineCode[i].data : '');
                (this.lineCode[i].usemap ? elem.usemap = this.lineCode[i].usemap : '');
                (this.lineCode[i].required ? elem.required = this.lineCode[i].required : '');
                (this.lineCode[i].href ? elem.href = this.lineCode[i].href : '');
                (this.lineCode[i].dir ? elem.dir = this.#dirName(this.lineCode[i].dir) : '');
                (this.lineCode[i].cite ? elem.cite = this.lineCode[i].cite : '');
                (this.lineCode[i].value ? elem.value = this.lineCode[i].value : '');
                (this.lineCode[i].wsaNoSelect ? elem.setAttribute('wsa-noselect','') : '');
                (this.lineCode[i].src ? elem.src = this.lineCode[i].src : '');
                (this.lineCode[i].controls ? elem.controls = this.lineCode[i].controls : '');
                (this.lineCode[i].title ? elem.title = this.lineCode[i].title : '');
                (this.lineCode[i].label ? elem.label = this.lineCode[i].label : '');
                (this.lineCode[i].target ? elem.target = this.#selectATarget(this.lineCode[i].target) : '');
                (this.lineCode[i].shape ? elem.setAttribute('shape',this.lineCode[i].shape) : '');
                (this.lineCode[i].coords ? elem.setAttribute('coords',this.lineCode[i].coords) : '');
                (this.lineCode[i].alt ? elem.alt = this.lineCode[i].alt : '');
                (this.lineCode[i].styles.size ? elem.style.fontSize = this.lineCode[i].styles.size : '');
                (this.lineCode[i].styles.color ? elem.style.color = this.lineCode[i].styles.color : '');
                (this.lineCode[i].styles.bg ? elem.style.background = this.#checkCSSURL(this.lineCode[i].styles.bg) : '');
                (this.lineCode[i].styles.align ? elem.style.textAlign = this.lineCode[i].styles.align : '');
                elem.style.fontWeight = (this.lineCode[i].styles.fontWeight ? this.lineCode[i].styles.fontWeight : '');
                elem.style.fontStyle = (this.lineCode[i].styles.fontStyle ? this.lineCode[i].styles.fontStyle : '');
                elem.style.textDecoration = (this.lineCode[this.holder]&&this.lineCode[this.holder].styles.textDecoration ? this.lineCode[this.holder].styles.textDecoration : '');
                if(this.lineCode[i].location){
                    if(document.querySelector(this.lineCode[i].location).tagName.toLocaleLowerCase()==='body'){
                        document.body.insertBefore(elem,document.body.children[this.placeOver]);
                        this.placeOver+=1;
                    }else
                        document.querySelector(this.lineCode[i].location).appendChild(elem);
                }else{
                    if(elem.tagName.toLocaleLowerCase()==='link')
                        document.head.appendChild(elem,document.head);
                    else{
                        document.body.insertBefore(elem,document.body.children[this.placeOver]);
                        this.placeOver+=1;
                    }
                }   
            }
            (this.buildEvent!==null ? window.dispatchEvent(this.buildEvent) : ''); this.buildEvent=null;
            document.querySelectorAll('code').forEach((e)=>{
                e.innerHTML = e.innerHTML.replaceAll('<br>','\n');
            });
            Prism.highlightAll();
            return this.lineCode;
        }else{
            return false;
        }
    }
}
export default Listener;