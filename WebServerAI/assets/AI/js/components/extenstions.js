var responce;
class Extensions{
    constructor(){
        this.base = window.location.origin+'/WebServerAI/build';
        this.ext = {};
    }
    #extensionID(){
        var dt = new Date().getTime(),
        // Replace the placeholders in the UUID template with random hexadecimal characters.
        uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            // Generate a random hexadecimal digit.
            const r = (dt + Math.random()*16)%16 | 0;
            // Update dt to simulate passage of time for the next random character.
            dt = Math.floor(dt/16);
            // Replace 'x' with a random digit and 'y' with a specific digit (4 for UUID version 4).
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    // Return the generated UUID.
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
     * @returns {void}
     */
    activate(name, config=null){
        this.ext[name] = {};
        this.ext[name]['extension_name'] = name;
        this.ext[name]['extension_path'] = this.base+'/'+name;
        this.ext[name]['extension_config'] = (config!==null ? config : {});
        this.ext[name]['extension_id'] = this.#extensionID();
        this.ext[name]['extension_parse'] = this.base+'/'+name+'/'+name+'.html';
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
    /**
     * Parses string to correct int/float/bool
     * @param {String} str 
     * @returns {Boolean|Number} Parsed object
     */
    #parseTo(str){
        if(JSON.parse(str)){
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
    parse(name){
        const ext = JSON.parse(sessionStorage.getItem('wsa_extensions')),
        parseBlock = this.#request(ext[name]['extension_parse']),
        dom = new DOMParser(),
        toHTML = dom.parseFromString(parseBlock, 'text/html'),
        html = toHTML.documentElement.querySelector('body').innerHTML;
        return html;
    }

    update(name){
        var u=1;
        document.querySelectorAll('.wpa-build-'+name).forEach((e)=>{
            e.id = u;
            u+=1;
        });
        u=1;
    }
}
export default Extensions;