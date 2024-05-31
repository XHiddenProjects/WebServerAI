var responce;
class GeoLocation{
    #ip = null;
    origin=null;
    #filterIP(ip){
        const ipRegex = /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/;
        const filteredIPs = ipRegex.test(ip);
        if(filteredIPs)
            return ip;
    }
    #filterDomain(domain){
        const dmRegex = /([a-z0-9A-Z]\.)*[a-z0-9-]+\.([a-z0-9]{2,24})+(\.co\.([a-z0-9]{2,24})|\.([a-z0-9]{2,24}))*/;
        const filteredDomains = dmRegex.test(domain);
        if(filteredDomains){
            this.#request('/WebServerAI/libs/ipdetect.php?action=getDomainIP&domain='+domain.match(dmRegex)[0]);
            return responce;
        }
    }
    #getIP(){

    }
    /**
     * Sets the IP address to a IP/Domain
     * @param {String} ip IP|Domain|"auto" to check
     */
    constructor(ip){
        this.origin = window.location.origin;
        if(ip==='auto'){
            this.#request(this.origin+'/WebServerAI/libs/ipdetect.php?action=getClientIP');
            this.#ip = responce;
        }else if(this.#filterIP(ip)){
            this.#ip = ip;
        }else if(this.#filterDomain(ip)){
            this.#ip = responce;
        }else{
            console.error('Invalid Domain/IP');
            this.#ip = null;
        }
        
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
     * Returns all or certain attributes. 
     * 
     * **NOTE: 45 request/min**
     * @param {String|Array<string>} [info='*'] Selects a certain information 
     * @api https://ip-api.com/
     * @returns 
     */
    displayRecords(info='*'){
        const listObj = {};
        if(this.#ip!==null){
            this.#request(this.origin+'/WebServerAI/libs/ipdetect.php?action=getRecords&clienturl=https://api.findip.net/'+this.#ip+'/?token=fbedfac2305245dfa07c378b7274e33c',true);
            if(info==='*')
                return responce;
            else if(Array.isArray(info)){
                for(let i in responce){
                    if(info.indexOf(i)>=0)
                        listObj[i] = responce[i];
                }
                return listObj;
            }else
                return responce[info];
        }
    }
}
export default GeoLocation;