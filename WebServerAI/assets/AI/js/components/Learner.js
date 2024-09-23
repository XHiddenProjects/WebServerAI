import Logic from "./logic.js";
import Events from "./Events.js";
import Trainee from "../trinee/trainee.js";
var responce;
class Listener extends Trainee{
    constructor(){
        super();
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
     * Searches the internet for an image
     * @param {String} url URL/String to search
     * @param {String} tag Tag name as an identifier
     * @returns 
     */
    #search(url, tag,type){
        if(url.match(/^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/igm)){
            return url;
        }else{
            const strify = {
                searched: url,
                src_type: type
            };
            if(tag.toLocaleLowerCase()==='img'){
                this.#request(window.location.origin+'/WebServerAI/libs/ai_script_data.php?'+encodeURIComponent('dataname=srcCapture&datasets='+JSON.stringify(strify)));
                const elem = this.#request(window.location.origin+'/WebServerAI/scripts/srcCapture.py',true),
                rand = Math.floor(Math.random()*elem['img_urls'].length);
                return elem['img_urls'][rand];
            }
        }
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
     * Parses to human-readable text
     * @param {String} action 
     */
    #parseAction(action){
        let reformed;
        switch(action.toLocaleLowerCase()){
            case 'add':
                reformed = 'added';
            break;
            case 'text':
                reformed = 'written';
            break;
            default:
                reformed = action;
            break;
        }
        return reformed;
    }
    /**
     * Executes command
     * @param {String} AICode 
     * @param {Element|null} [previewContainer=null] Renders inside the preview container
     * @returns {Array<boolean,string>|Boolean} Returns information on success
     */
    render(AICode, previewContainer=null){
        this.lineCode = [];
        this.endedElem = [];
        this.holder = -1;
        let success=true;
        AICode = AICode.split(/(?<=})\|\|/g).map((x)=>{return x.replace(/^{|}$/g, '')}).filter((x)=>{return x!==''});
        if(AICode.length>0){
            for(let i=0;i<AICode.length;i++){
                const action = AICode[i].split('_')[0].toLocaleLowerCase().replace(/^{/,''),
                    value = AICode[i].split('_')[1];
                   
                switch(action){
                    case 'add':
                        switch(value.toLocaleLowerCase()){
                            case 'abbr':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'abbr',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'address':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'address',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'area':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'area',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'article':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'article',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'aside':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'aside',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'audio':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'audio',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'base':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'base',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'bdi':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'bdi',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'bdo':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'bdo',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'br':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'br',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'canvas':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'canvas',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'caption':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'caption',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'codeinline':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'code',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'codeblock':
                                const targetClass = this.#uniqid();
                                this.holder+=1;
                                this.lineCode.push({tagName: 'pre',classes: 'line-numbers '+targetClass, styles:{},scripts:{},task_info:[]});
                                this.holder+=1;
                                this.lineCode.push({tagName: 'code',location: 'pre.'+targetClass,styles:{},scripts:{},task_info:[]});
                            break;
                            case 'col':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'col',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'colgroup':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'colgroup',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'datablock':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'data',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'datalist':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'datalist',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'dd':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'dd',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'del':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'del',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'details':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'details',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'dfn':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'dfn',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'dialog':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'dialog',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'div':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'div',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'dl':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'dl',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'dt':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'dt',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'embed':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'embed',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'fieldset':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'fieldset',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'legend':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'legend',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'figcaption':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'figcaption',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'figure':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'figure',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'footer':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'footer',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'iframe':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'iframe',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'hgroup':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'hgroup',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'hr':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'hr',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'ul':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'ul',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'ol':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'ol',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'li':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'li',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'icon':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'link',type: 'icon',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'shortcuticon':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'link',type: 'shortcut icon',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'appletouchicon':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'link',type: 'apple-touch-icon',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'main':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'main',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'map':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'map',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'mark':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'mark',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'menu':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'menu',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'meter':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'meter',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'optgroup':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'optgroup',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'option':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'option',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'heading':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'h',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'header':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'header',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'image':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'img',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'ruby':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'ruby',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'rp':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'rp',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'rt':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'rt',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'samp':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'samp',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'section':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'section',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'span':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'span',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'sub':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'sub',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'sup':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'sup',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'summary':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'summary',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'tblrow':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'tr',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'tblhead':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'th',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'tblcell':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'td',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'table':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'table',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'kbd':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'kbd',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'paragraph':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'p',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'hlink':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'a',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'source':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'source',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'picture':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'picture',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'nav':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'nav',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'object':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'object',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'titlepage':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'title',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'blockquote':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'blockquote',styles:{},scripts:{},task_info:[]});
                            break;
                            //Form elements
                            case 'form':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'form',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'progress':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'progress',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'labelblock':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'label',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputtext':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'text',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputtextbox':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'textarea',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'button':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'button',type: 'button',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'submit':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'button',type: 'submit',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'reset':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'button',type: 'reset',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'checkbox':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'checkbox',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'radio':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'radio',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputcolor':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'color',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputdate':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'date',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputdatetimelocal':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'datetime-local',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputemail':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'email',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputfile':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'file',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputhidden':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'hidden',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputimg':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'image',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputmonth':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'month',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputnumber':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'number',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputpsw':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'password',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputrange':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'range',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputsearch':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'search',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputtel':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'tel',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputtime':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'time',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputurl':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'url',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'inputweek':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'week',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'selectbox':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'select',styles:{},scripts:{},task_info:[]});
                            break;
                            case 'output':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'output',styles:{},scripts:{},task_info:[]});
                            break;
                            default:
                                this.holder+=1;
                                this.lineCode.push(this.listAddedElement(value.toLocaleLowerCase()));
                            break;
                        }
                    break;
                    case 'build':
                        this.lineCode.push({tagName: 'div', classes: "wpa-build-"+value ,html: JSON.parse(sessionStorage.getItem('wsa_extensions'))[value]['extension_temp'],styles:{},scripts:{},task_info:[]});
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
                            case 'family':
                                if(this.currentTarget!==null){
                                    if(Array.isArray(this.currentTarget))
                                        this.currentTarget.forEach((el)=>{el.style.fontFamily = '';});
                                    else
                                        this.currentTarget.style.fontFamily = '';
                                }else
                                    this.lineCode[this.holder].styles.family = delete this.lineCode[this.holder].styles.family;
                            break;
                            default:
                                if(this.currentTarget!==null){
                                    if(Array.isArray(this.currentTarget))
                                        this.currentTarget.forEach((el)=>{el.remove();});
                                    else
                                        this.currentTarget.remove();
                                }else{
                                    delete this.lineCode[this.holder];
                                }
                            break;
                        }
                    break;
                    case 'calculate':
                        const logic = new Logic();
                        let elem = document.querySelector(value);
                        elem.innerText = logic.Solve(elem.innerText);
                    break;
                    case 'query':
                        this.currentTarget = (document.querySelector(value+':not(.wsa '+value+')')!==undefined ? document.querySelector(value+':not(.wsa '+value+')') : null);
                    break;
                    case 'list':
                        value.split(/(?<!\\),/).forEach((items)=>{
                            this.lineCode[this.holder].html = (this.lineCode[this.holder].html ?  this.lineCode[this.holder].html + '<li>'+items.replace(/\\,/g,',').replace(/^ /g,'')+'</li>' : '<li>'+items.replace(/\\,/g,',').replace(/^ /g,'')+'</li>');
                        });
                    break;
                    
                    case 'queryall':
                        this.currentTarget = (document.querySelectorAll(value+':not(.wsa '+value+')')!==undefined ? document.querySelectorAll(value+':not(.wsa '+value+')') : null);
                    break;
                    case 'size':
                        if(this.lineCode[this.holder].tagName==='h'){
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
                    case 'html':
                        (this.lineCode[this.holder].html ? this.lineCode[this.holder].html += value.replaceAll('&lt;','<').replaceAll('&gt;','>') : this.lineCode[this.holder].html = value.replaceAll('&lt;','<').replaceAll('&gt;','>'));
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
                    case 'contenteditable':
                        this.lineCode[this.holder].contenteditable = true;
                    break;
                    case 'for':
                        this.lineCode[this.holder].for = value;
                    break;
                    case 'src':
                        this.lineCode[this.holder].src = value;
                    break;
                    case 'srcset':
                        this.lineCode[this.holder].srcset = value;
                    break;
                    case 'media':
                        this.lineCode[this.holder].media = value;
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
                    case 'animation':
                        this.lineCode[this.holder].styles.animation = value;
                    break;
                    case 'width':
                        this.lineCode[this.holder].styles.width = value;
                    break;
                    case 'height':
                        this.lineCode[this.holder].styles.height = value;
                    break;
                    case 'family':
                        this.lineCode[this.holder].styles.family = value;
                    break;
                }
                let parseAction = this.#parseAction(action);
                this.lineCode[this.holder].task_info.push({task_id:parseAction,task_name:value});
            }
            this.currentTarget = null;
            let e = new Events(),
            tagName='';
            for(let i=0;i<this.lineCode.length;i++){
                tagName = this.lineCode[i].tagName = (this.lineCode[i].tagName==='h' ? this.lineCode[i].tagName+'1' : this.lineCode[i].tagName);
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
                (this.lineCode[i].for ? elem.setAttribute('for',this.lineCode[i].for) : '');
                (this.lineCode[i].contenteditable ? elem.contentEditable = true : '');
                (this.lineCode[i].src ? elem.src = this.#search(this.lineCode[i].src, tagName, tagName) : '');
                (this.lineCode[i].srcset ? elem.srcset = this.lineCode[i].srcset : '');
                (this.lineCode[i].media ? elem.media = this.lineCode[i].media : '');
                (this.lineCode[i].controls ? elem.controls = this.lineCode[i].controls : '');
                (this.lineCode[i].title ? elem.title = this.lineCode[i].title : '');
                (this.lineCode[i].label ? elem.label = this.lineCode[i].label : '');
                (this.lineCode[i].target ? elem.target = this.#selectATarget(this.lineCode[i].target) : '');
                (this.lineCode[i].shape ? elem.setAttribute('shape',this.lineCode[i].shape) : '');
                (this.lineCode[i].coords ? elem.setAttribute('coords',this.lineCode[i].coords) : '');
                (this.lineCode[i].alt ? elem.alt = this.lineCode[i].alt : '');
                (this.lineCode[i].styles.size ? elem.style.fontSize = this.lineCode[i].styles.size : '');
                if(this.lineCode[i].styles.color){ 
                    let strify = {
                        colorValue: this.lineCode[i].styles.color,
                        from: 'name',
                        to: 'hex'
                    };
                    e.request(window.location.origin+'/WebServerAI/libs/ai_script_data.php?'+encodeURIComponent('dataname=colorData&datasets='+JSON.stringify(strify)));
                };
                (this.lineCode[i].styles.color ? elem.style.color = e.request(window.location.origin+'/WebServerAI/scripts/coloridentifier.py',true)['color'] : '');
                (this.lineCode[i].styles.bg ? elem.style.background = this.#checkCSSURL(this.lineCode[i].styles.bg) : '');
                (this.lineCode[i].styles.align ? elem.style.textAlign = this.lineCode[i].styles.align : '');
                (this.lineCode[i].styles.animation ? elem.style.animation = this.lineCode[i].styles.animation : '');
                (this.lineCode[i].styles.width ? elem.style.width = this.lineCode[i].styles.width : '');
                (this.lineCode[i].styles.height ? elem.style.height = this.lineCode[i].styles.height : '');
                (this.lineCode[i].styles.family ? elem.style.fontFamily = this.lineCode[i].styles.family : '');
                elem.style.fontWeight = (this.lineCode[i].styles.fontWeight ? this.lineCode[i].styles.fontWeight : '');
                elem.style.fontStyle = (this.lineCode[i].styles.fontStyle ? this.lineCode[i].styles.fontStyle : '');
                elem.style.textDecoration = (this.lineCode[this.holder]&&this.lineCode[this.holder].styles.textDecoration ? this.lineCode[this.holder].styles.textDecoration : '');
                if(this.lineCode[i].location){
                    if(document.querySelector(this.lineCode[i].location).tagName.toLocaleLowerCase()==='body'){
                        if(previewContainer){
                            const preview = document.querySelector(this.preview),
                        previewEditable = (preview.contentWindow||preview.contentDocument);
                        preview.src = this.origin+'/WebServerAI/data/preview.html';
                        preview.addEventListener('load',()=>{
                            previewEditable.document.body.insertBefore(elem, previewEditable.document.body.children[this.placeOver]);
                        });
                        }else
                            document.body.insertBefore(elem,document.body.children[this.placeOver]);
                        this.placeOver+=1;
                    }else{
                        if(previewContainer){
                            const preview = document.querySelector(previewContainer),
                            previewEditable = (preview.contentWindow||preview.contentDocument);
                            preview.src = this.origin+'/WebServerAI/data/preview.html';
                            preview.addEventListener('load',()=>{
                                previewEditable.document.querySelector(this.lineCode[i].location).appendChild(elem);
                            });
                        }else
                            document.querySelector(this.lineCode[i].location).appendChild(elem);
                        }
                    }else{
                        if(elem.tagName.toLocaleLowerCase()==='link'){
                            if(previewContainer){
                                const preview = document.querySelector(previewContainer),
                                previewEditable = (preview.contentWindow||preview.contentDocument);
                                preview.src = this.origin+'/WebServerAI/data/preview.html';
                                preview.addEventListener('load',()=>{
                                    previewEditable.document.head.appendChild(elem, previewEditable.document.head)
                                });
                            }else
                                document.head.appendChild(elem,document.head);
                        }else{
                            if(previewContainer){
                                const preview = document.querySelector(previewContainer),
                                previewEditable = (preview.contentWindow||preview.contentDocument);
                                preview.src = this.origin+'/WebServerAI/data/preview.html';
                                preview.addEventListener('load',()=>{
                                    previewEditable.document.body.insertBefore(elem, previewEditable.document.body.children[this.placeOver]);
                                });
                            }else
                                document.body.insertBefore(elem, document.body.children[this.placeOver]);
                            this.placeOver+=1;
                        }
                    }   
            }
            (this.buildEvent!==null ? window.dispatchEvent(this.buildEvent) : ''); this.buildEvent=null;
            if(previewContainer){
                const preview = document.querySelector(previewContainer),
                    previewEditable = (preview.contentWindow||preview.contentDocument);
                    preview.src = this.origin+'/WebServerAI/data/preview.html';
                previewEditable.document.querySelectorAll('code').forEach((e)=>{
                    e.innerHTML = e.innerHTML.replaceAll('<br>','\n');
                });
            }else{
                document.querySelectorAll('code').forEach((e)=>{
                    e.innerHTML = e.innerHTML.replaceAll('<br>','\n');
                });
            }
            Prism.highlightAll();
            return (this.endedElem.length>0 ? this.endedElem : this.lineCode);
        }else{
            return false;
        }
    }
}
export default Listener;