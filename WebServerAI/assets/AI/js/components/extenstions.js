var responce;
import {version_compare} from '/WebServerAI/assets/AI/js/components/utils.js';

class Extensions{
    constructor(){
        this.base = window.location.origin+'/WebServerAI/build';
        this.ext = {};
    }
    #extensionID(){
        const uuid = window.crypto.randomUUID();
        return uuid;
    }
    /**
     * Gets file content
     * @param {String} url Location to get the file content
     * @param {Boolean} [isJSON=false] Converts string to JSON object
     * @param {Boolean} [async=false] Wait until page load
     * @param {Boolean} [retReq=false] Return as a XMLHttpRequest object
     * @returns {JSON|String}
     */
    #request(url, isJSON=false, async=false, retReq=false){   
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
    /**
     * Activates an WebServerAI extension
     * @param {String} name Extension name
     * @param {null} [config=null] Configuration settings
     * @returns {void}
     */
    activate(name, config=null){
        this.ext[name] = {};
        this.ext[name]['extension_name'] = name;
        this.ext[name]['extension_path'] = this.base+'/'+name;
        this.ext[name]['extension_config'] = (config!==null ? config : {});
        this.ext[name]['extension_id'] = this.#extensionID();
        this.ext[name]['extension_parse'] =  this.base+'/'+name+'/'+name+'.html';
        this.ext[name]['extension_temp'] = '';
    }
    /**
     * Returns a config ID a lookup
     * @param {String} name Extension name
     * @param {String} type Extension type
     * @param {{}} [list={}] List to check
     * @returns {String} Extnsion informations
     */
    lookup(name, type, list={}){
        if(Object.keys(list)>0){
            return list[name]['extension_'+type];
        }else
            return this.ext[name]['extension_'+type];
    }
    #isJSON(json){
        try{
            JSON.parse(json);
            return true;
        }catch(e){
            return false;
        }
    }
    /**
     * Parses string to correct int/float/bool
     * @param {String} str 
     * @returns {Boolean|Number} Parsed object
     */
    #parseTo(str){
        if(this.#isJSON(str)){
            return JSON.parse(str);
        }else if(str==='true'){
            return true;
        }else if(str==='false'){
            return false;
        }else if(str.match(/[0-9]/)){
            return parseInt(str);
        }else if(str.match(/\d+(\.\d{1,2})?/)){
            return parseFloat(str);
        }else{
            return str;
        }
    }
    /**
     * Gets the configuration from URL
     * @param {URL} extensionURL The URL to look for
     * @param {String|Array<String>} lookup Find a key word to select
     * @param {null|Array<String>} [returnNull=null] Sets a default return if item is empty
     * @returns {String|JSON} The Configuration information
     */
    configSearch(extensionURL, lookup, returnNull=null){
        const url = new URL(extensionURL.href),
              config = {};
        if(Array.isArray(lookup)){
            for(let i=0;i<lookup.length;i++){
                config[lookup[i]] = (url.searchParams.get(lookup[i])!==null ? this.#parseTo(url.searchParams.get(lookup[i])) : this.#parseTo(returnNull[i]));
            }
            return config;
        }else
            return (url.searchParams.get(lookup)!==null ? this.#parseTo(url.searchParams.get(lookup)) : this.#parseTo(returnNull));
    }
    /**
     * Save HTML template
     * @param {String} name Extension name
     * @param {String} updated Updated template
     * @returns {void}
     */
    saveTemplate(name,updated){
        const ext = JSON.parse(sessionStorage.getItem('wsa_extensions'));
        ext[name]['extension_temp'] = updated;
        sessionStorage.setItem('wsa_extensions',JSON.stringify(ext));
    }
    /**
     * Loads template if it doesn't load Immediately
     * @param {String} name Name of extension
     * @return {void}
     */
    loadTemplate(name){
        document.querySelectorAll('.wpa-build-'+name).forEach((el)=>{
            if(el.innerHTML===''){
                el.innerHTML = JSON.parse(sessionStorage.getItem('wsa_extensions'))[name]['extension_temp'];
                return;
            }
        });
    }
    /**
     * Returns all loaded extensions
     * @returns {Object} List/Configuration of extensions
     */
    list(){
        return this.ext;
    }
    /**
     * Gets build ID
     * @param {URL} buildid Get the build from script
     * @returns {String} The build ID
     */
    getBuildID(buildid){
        return new URL(buildid.href).searchParams.get('buildid');
    }
    /**
     * Returns the project name
     * @param {URL} buildpath 
     * @returns {String} The projects name
     */
    getBuildName(buildpath){
        return buildpath.pathname.match(/\bbuild\/(.*?)\/\b/)[1];
    }
    /**
     * Returns the configuration for extension
     * @param {String} buildName 
     */
    getBuildConfig(buildName, list={}){
        if(Object.keys(list).length>0){
            const format = list[buildName]['extension_config'],
                  args = [];
            for(let i in format){
                args.push(i+'='+JSON.stringify(format[i]));
            }
            return args;
        }else{
            const format = this.ext[buildName]['extension_config'],
                  args = [];
            for(let i in format){
                args.push(format+'='+JSON.stringify(format[i]));
            }
            return args;
        }
    }
    /**
     * Returns parsed object
     * @param {String} name Name of extension
     * @returns {String} Parsed HTML object
     */
    parse(name, url=null){
        const ext = JSON.parse(sessionStorage.getItem('wsa_extensions'));
        const parseBlock = this.#request(ext[name]['extension_parse']),
        dom = new DOMParser(),
        toHTML = dom.parseFromString(parseBlock, 'text/html'),
        html = toHTML.documentElement.querySelector('body').innerHTML;
        return html;
    }
    /**
     * Returns parsed object
     * @param {String} name Name of extension
     * @param {String} url URL to parse
     * @returns {String} Parsed HTML object
     */
    parseURL(url){
        const parseBlock = this.#request(url),
        dom = new DOMParser(),
        toHTML = dom.parseFromString(parseBlock, 'text/html'),
        html = toHTML.documentElement.querySelector('body').innerHTML;
        return html;
    }
    /**
     * Updates all extension containers
     * @param {String} name Name of the extension
     * @returns {Int} The last container value
     */
    update(name){
        var u=1;
        document.querySelectorAll('.wpa-build-'+name).forEach((e)=>{
            e.id = name+'_'+u;
            u+=1;
        });
        return (u-1);
        u=1;
    }
    /**
     * Gets file content
     * @param {String} url Location to get the file content
     * @param {Boolean} [isJSON=false] Converts string to JSON object
     * @param {Boolean} [async=false] Wait until page load
     * @returns {JSON|String}
     */
    request(url, isJSON=false, async=false){   
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
    isAllowed(name){
        const elem = this.request(window.location.origin+'/WebServerAI/libs/ai_checker.php?name='+name, true);
        const settings = this.request(window.location.origin+'/WebServerAI/libs/usersInfo.php',true);
        if(version_compare(settings['AI']['Version'],elem['ai_version'],'=='))
            return true;
        else
            return false;
    }
    /**
     * Error message when extension is no longer supported
     * @param {String} str Error message when plugin is no longer supported 
     * @returns {void}
     */
    noSupport(name){
        throw new Error('[WebServerAI] - "'+name+'" is no longer supported!');
    }
}
export default Extensions;