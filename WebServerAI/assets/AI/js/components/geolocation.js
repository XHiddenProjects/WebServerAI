var responce;
import { validate, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4, FILTER_FLAG_NO_PRIV_RANGE, FILTER_FLAG_NO_RES_RANGE, FILTER_VALIDATE_DOMAIN} from "/WebServerAI/assets/AI/js/components/security.js";
class GeoLocation{
    #ip = null;
    origin=null;
    #filterIP(ip){
        const filteredIPs = validate(ip,[FILTER_VALIDATE_IP,FILTER_FLAG_IPV4,FILTER_FLAG_NO_PRIV_RANGE,FILTER_FLAG_NO_RES_RANGE]);
        if(filteredIPs)
            return ip;
    }
    #filterDomain(domain){
        const filteredDomains = validate(domain,FILTER_VALIDATE_DOMAIN);
        if(filteredDomains){
            this.#request('/WebServerAI/libs/ipdetect.php?action=getDomainIP&domain='+domain.match(dmRegex)[0]);
            return responce;
        }
    }
    /**
     * Sets the IP address to a IP/Domain
     * @param {String} ip IP|Domain|"auto" to check
     */
    constructor(ip='auto'){
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
     * @param {String} ipClient Get an _"IP-API"_ key
     * @api [IP-API](https://members.ip-api.com/)
     * @param {String|Array<string>} [info='*'] Selects a certain information 
     * @returns 
     */
    displayRecords(ipapiKey,info='*'){
        const listObj = {};
        if(this.#ip!==null){
            this.#request(this.origin+'/WebServerAI/libs/ipdetect.php?action=getRecords&clienturl=https://api.ipapi.com/api/'+this.#ip+'/?access_key='+ipapiKey,true);
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