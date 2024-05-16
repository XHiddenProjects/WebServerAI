var responce;
class Listener{
    constructor(){
        this.lineCode=[];
        this.location = document.querySelector('body');
        this.origin = window.location.origin;
        this.placeOver = 0;
        this.holder = -1;
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
                            case 'heading':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'h',style:{}});
                               
                            break;
                            case 'header':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'header', style:{}});
                            break;
                            case 'paragraph':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'p',style:{}});
                            break;
                            case 'hlink':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'a',style:{}});
                            break;
                            case 'form':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'form',style:{}});
                            break;
                            case 'inputtext':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'input',type: 'text',style:{}});
                            break;
                            case 'inputtextbox':
                                this.holder+=1;
                                this.lineCode.push({tagName: 'textarea',style:{}});
                            break;
                        }
                    break;
                    case 'remove':
                        switch(value.toLocaleLowerCase()){
                            case 'underline':
                                this.lineCode[this.holder].style.textDecoration = (this.lineCode[this.holder].style.textDecoration&&this.lineCode[this.holder].style.textDecoration!=='' ? this.lineCode[this.holder].style.textDecoration.replace('underline','') :  'none');
                            break;
                            case 'strikethrough':
                                this.lineCode[this.holder].style.textDecoration = (this.lineCode[this.holder].style.textDecoration&&this.lineCode[this.holder].style.textDecoration!=='' ? this.lineCode[this.holder].style.textDecoration.replace('strikethrough','') :  'none');
                            break;
                        }
                    break;
                    case 'size':
                        if( this.lineCode[this.holder].tagName==='h'){
                            this.lineCode[this.holder].tagName+=value;
                        }else{
                            this.lineCode[this.holder].style.size = value;
                        }
                    break;
                    case 'location':
                        this.lineCode[this.holder].location = value;
                    break;
                    case 'text':
                        this.lineCode[this.holder].innerText = value;
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
                    case 'hurl':
                        this.lineCode[this.holder].href = value;
                    break;
                    case 'target':
                        this.lineCode[this.holder].target = value;
                    break;
                    case 'title':
                        this.lineCode[this.holder].title = value;
                    break;
                    //form
                    case 'required':
                        this.lineCode[this.holder].required = true;
                    break;
                    case 'placeholder':
                        this.lineCode[this.holder].placeholder = value;
                    break;
                    //css
                    case 'color':
                        this.lineCode[this.holder].style.color = value;
                    break;
                    case 'bg':
                        this.lineCode[this.holder].style.bg = value;
                    break;
                    case 'bold':
                        this.lineCode[this.holder].style.fontWeight = 'bold';
                    break;
                    case 'italic':
                        this.lineCode[this.holder].style.fontStyle += 'italic';
                    break;
                    case 'underline':
                        this.lineCode[this.holder].style.textDecoration = (this.lineCode[this.holder].style.textDecoration ? this.lineCode[this.holder].style.textDecoration + 'underline ' : 'underline ');
                    break;
                    case 'strikethrough':
                        this.lineCode[this.holder].style.textDecoration = (this.lineCode[this.holder].style.textDecoration ? this.lineCode[this.holder].style.textDecoration + 'line-through ' : 'line-through ');
                    break;
                }
            }
            for(let i=0;i<this.lineCode.length;i++){
                const elem = document.createElement(this.lineCode[i].tagName);
                let txtderc='';
                elem.innerText = (this.lineCode[i].innerText ? this.lineCode[i].innerText : '');
                (this.lineCode[i].classes ? elem.className = this.lineCode[i].classes : '');
                (this.lineCode[i].type ? elem.type = this.lineCode[i].type : '');
                (this.lineCode[i].id ? elem.id = this.lineCode[i].id : '');
                (this.lineCode[i].placeholder ? elem.placeholder = this.lineCode[i].placeholder : '');
                (this.lineCode[i].name ? elem.setAttribute('name',this.lineCode[i].name) : '');
                (this.lineCode[i].required ? elem.required = this.lineCode[i].required : '');
                (this.lineCode[i].href ? elem.href = this.lineCode[i].href : '');
                (this.lineCode[i].title ? elem.title = this.lineCode[i].title : '');
                (this.lineCode[i].target ? elem.target = this.#selectATarget(this.lineCode[i].target) : '');
                (this.lineCode[i].style.size ? elem.style.fontSize = this.lineCode[i].style.size : '');
                (this.lineCode[i].style.color ? elem.style.color = this.lineCode[i].style.color : '');
                (this.lineCode[i].style.bg ? elem.style.background = this.#checkCSSURL(this.lineCode[i].style.bg) : '');
                elem.style.fontWeight = (this.lineCode[i].style.fontWeight ? this.lineCode[i].style.fontWeight : '');
                elem.style.fontStyle = (this.lineCode[i].style.fontStyle ? this.lineCode[i].style.fontStyle : '');
                elem.style.textDecoration = (this.lineCode[this.holder].style.textDecoration ? this.lineCode[this.holder].style.textDecoration : '');
                if(this.lineCode[i].location){
                    if(document.querySelector(this.lineCode[i].location).tagName.toLocaleLowerCase()==='body'){
                        document.body.insertBefore(elem,document.body.children[this.placeOver]);
                        this.placeOver+=1;
                    }else
                        document.querySelector(this.lineCode[i].location).appendChild(elem);
                }else{
                    document.body.insertBefore(elem,document.body.children[this.placeOver]);
                    this.placeOver+=1;
                }   
            }
            return this.lineCode;
        }else{
            return false;
        }
    }
}
export default Listener;