import Events from '/WebServerAI/assets/AI/js/components/Events.js';
//validate filters
const FILTER_VALIDATE_INT = 257,
FILTER_VALDATE_BOOLEAN = 258,
FILTER_VALIDATE_FLOAT = 259,
FILTER_VALIDATE_REGEXP = 260,
FILTER_VALIDATE_DOMAIN = 277,
FILTER_VALIDATE_URL = 273,
FILTER_VALIDATE_EMAIL = 274,
FILTER_VALIDATE_IP = 275,
FILTER_VALIDATE_MAC = 276,
//sanitize
FILTER_SANITIZE_ADD_SLASHES = 523,
FILTER_SANITIZE_EMAIL = 517,
FILTER_SANITIZE_ENCODED = 514,
FILTER_SANITIZE_NUMBER_FLOAT = 520,
FILTER_SANITIZE_NUMBER_INT = 519,
FILTER_SANITIZE_SPECIAL_CHARS = 515,
FILTER_SANITIZE_URL = 518,
//flags
FILTER_FLAG_ALLOW_FRACTION = 4096,
FILTER_FLAG_ALLOW_THOUSAND = 8192,
FILTER_FLAG_ALLOW_SCIENTIFIC = 16384,
FILTER_FLAG_STRIP_LOW = 4,
FILTER_FLAG_STRIP_HIGH = 8,
FILTER_FLAG_ENCODE_HIGH = 32,
FILTER_FLAG_IPV4 = 1048576,
FILTER_FLAG_IPV6 = 2097152,
FILTER_FLAG_NO_PRIV_RANGE = 8388608,
FILTER_FLAG_NO_RES_RANGE = 4194304;

var floatExtend='',
    specialChars = /[\x20-\x7F]/g,
    ip = /((?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])))|((\w{1,4}:?){8})/g,
    blockIPs = null,
    args = [],
    out = [],
    validateList = {
        257: {
            name: 'int',
            exp: /([\d]+)/
        },
        258: {
            name: 'boolean',
            exp: /(true|false)/
        },
        259: {
            name: 'float',
            exp: /([\d]+\.[\d]+)/
        },
        260: {
            name: 'validate_regexp',
            exp: /(\/.+\/[gimsuy]*)/
        },
        275:{
            name: 'validate_ip', 
            exp: ip
        },
        277:{
            name: 'validate_domain',
            exp: /([a-z0-9A-Z]\.)*[a-z0-9-]+\.([a-z0-9]{2,24})+(\.co\.([a-z0-9]{2,24})|\.([a-z0-9]{2,24}))*/
        },
        273:{
            name: 'validate_url',
            exp: /([(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/
        },
        274:{
            name: 'validate_email',
            exp: /(\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b)/
        },
        276:{
            name: 'validate_mac',
            exp: /(([0-9A-Fa-f]{2}[-:]){5}[0-9A-Fa-f]{2})|(([0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})/
        },
        513:{
            name: 'string',
            exp: /(([0-9A-Fa-f]{2}[-:]){5}[0-9A-Fa-f]{2})|(([0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})/
        }
    },
    sanitizeList = {
        523:{
            name: 'sanitize_add_slashes',
            exp: /[\!\@\#\$\%\^\&\*\(\)\+\=\-\[\]\\\'\;\,\.\/\{\}\|\"\:\<\>\?\~\_]/g
        },
        517:{
            name: 'sanitize_email',
            exp: /[^a-zA-Z0-9._%+@]/g
        },
        514:{
            name: 'sanitize_encode',
            exp: null
        },
        520:{
            name: 'sanitize_number_float',
            exp: '[^0-9+\\-'
        },
        519: {
            name: 'sanitize_number_int',
            exp: /[^0-9+\-]/g
        },
        515: {
            name: 'sanitize_special_chars',
            exp: specialChars
        },
        518: {
            name: 'sanitize_url',
            exp: /[^0-9a-zA-Z$\-_.+!*'(),{}|\\^~\[\]`"><#%;\/\?:@&=]/g
        },
        600:{
            name: 'sanitize_domain',
            exp: /([a-z0-9A-Z]\.)*[a-z0-9-]+\.([a-z0-9]{2,24})+(\.co\.([a-z0-9]{2,24})|\.([a-z0-9]{2,24}))*/
        }
    },
    flagsList = {
        4096: {
            name: 'flag_allow_fraction',
            return: '.'
        },
        8192: {
            name: 'flag_allow_thousand',
            return: ','
        },
        16384: {
            name: 'flag_allow_scientific',
            return: 'eE'
        },
        4: {
            name: 'flag_strip_low',
            return: /[\x00-\x1F]/g
        },
        8: {
            name: 'flag_strip_high',
            return: /[\u0080-\uffff\u1000-\ufffd\u1000-\u10ff]/g
        },
        32: {
            name: 'flag_encode_high',
            return: /[\u0080-\uffff\u1000-\ufffd\u1000-\u10ff]/g
        },
        1048576:{
            name: 'flag_ipv4',
            return: /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/
        },
        2097152:{
            name: 'flag_ipv6',
            return: /(\w{1,4}:?){8}/
        },
        8388608:{
            name: 'flag_no_priv_range',
            return: /1(?:[79]2|0)\.(1?68|0)\.\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){1}(?:(?:2([0-4][0-9]|5[0-4])|[0-1]?[0-9]?[0-9]))\b/
        },
        4194304:{
            name: 'flag_no_res_range',
            return: /(10\.|172\.1[6-9]{1}\.|172\.2[0-9]{1}\.|172\.3[0-1]{1}\.|192\.168\.|127\.0\.0\.1)|(::1|fec0::\/10|2001:0db8::\/32|2002::\/16|3ffe::\/16|::ffff:0:0\/96|100::\/64|2001:0:5ef::\/48)/
        }
        
    },
 /**
    * Returns a filtered match
    * @param {String} str String to filter
    * @param {Number|Number[]} filterID Search for filtered
    * @returns {String|false} Returns filtered string
*/
validate=(str, filterID)=>{
        args.push(str);
        if(Array.isArray(filterID)){
            filterID = filterID.sort((a,b)=>{return b-a});
            let isFlag = false,
                noPrivIP=false;
            filterID.forEach((num)=>{
                if(validateList[num]||flagsList[num]){
                    switch(num){
                        case FILTER_FLAG_IPV4:
                            ip = flagsList[num]['return'];
                            isFlag = true;
                        break;
                        case FILTER_FLAG_IPV6:
                            ip = flagsList[num]['return'];
                            isFlag = true;
                        break;
                        case FILTER_FLAG_NO_PRIV_RANGE:
                            blockIPs = flagsList[num]['return'];
                            isFlag = true;
                            noPrivIP=true;
                        break;
                        case FILTER_FLAG_NO_RES_RANGE:
                            blockIPs = flagsList[num]['return'];
                            isFlag = true;
                            noPrivIP=true;
                        break;
                        default:
                            isFlag = false;
                        break;
                    }
                    if(!isFlag){
                    out = args.filter((val)=>{
                        val = val.toString();
                        if(noPrivIP)
                            val = val.replace(blockIPs,'');
                        if(num===FILTER_VALIDATE_IP)
                            validateList[num]['exp'] = ip;
                        return val.match(validateList[num]['exp']);
                    });
                    out = (out.toString().match(validateList[num]['exp']) ? out.toString().match(validateList[num]['exp'])[0] : false);
                    }
                }else
                    return false;
            });
            
            return (out ? out : false);
        }else{
            if(validateList[filterID]){
                out = args.filter((val)=>{
                    val = val.toString();
                    return val.match(validateList[filterID]['exp']);
                });
                out = (out.toString().match(validateList[filterID]['exp']) ? out.toString().match(validateList[filterID]['exp'])[0] : false);
                return (out ? out : false);
            }else
                return false;
        }
    args = [];
},
/**
 * Sanitizes the string
 * @param {String} str String to sanitize
 * @param {Number|Number[]} sanitizeID Sanitize id
 * @returns {*} Sanitized item
 */
sanitize=(str,sanitizeID)=>{
    if(Array.isArray(sanitizeID)){
        sanitizeID = sanitizeID.sort((a,b)=>{return b-a});
        sanitizeID.forEach((num)=>{
            if(sanitizeList[num]||flagsList[num]){
                out = out.toString();
                switch(num){
                    case FILTER_SANITIZE_ADD_SLASHES:
                        out = str.replace(sanitizeList[num]['exp'],(v)=>{
                            return '\\'+v;
                        });
                    break;
                    case FILTER_SANITIZE_EMAIL:
                        out = str.replace(sanitizeList[num]['exp'],(v)=>{
                            return '';
                        });
                    break;
                    case FILTER_SANITIZE_ENCODED:
                        out = encodeURIComponent(str);
                    break;
                    case FILTER_SANITIZE_NUMBER_FLOAT:
                        out = str.replace(new RegExp(sanitizeList[num]['exp']+floatExtend+']','g'),(v)=>{
                            return '';
                        });
                    break;
                    case FILTER_SANITIZE_NUMBER_INT:
                        out = str.replace(sanitizeList[num]['exp'],(v)=>{
                            return '';
                        });
                    break;
                    case FILTER_SANITIZE_SPECIAL_CHARS:
                        out = str.replace(sanitizeList[num]['exp'],(v)=>{
                            return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                        });
                    break;
                    case FILTER_SANITIZE_URL:
                        out = str.replace(sanitizeList[num]['exp'],(v)=>{
                            return '';
                        });
                    break;
                    case FILTER_FLAG_ALLOW_FRACTION:
                        floatExtend += flagsList[num]['return'];
                    break;
                    case FILTER_FLAG_ALLOW_THOUSAND:
                        floatExtend += flagsList[num]['return'];
                    break;
                    case FILTER_FLAG_ALLOW_SCIENTIFIC:
                        floatExtend += flagsList[num]['return'];
                    break;
                    case FILTER_FLAG_STRIP_LOW:
                        specialChars = flagsList[num]['return'];
                    break;
                    case FILTER_FLAG_STRIP_HIGH:
                        specialChars = flagsList[num]['return'];
                    break;
                    case FILTER_FLAG_ENCODE_HIGH:
                        specialChars = flagsList[num]['return'];
                    break;
                }
            }else
                return false;
        });
        floatExtend='';
        return out ? out : false;
    }else{
        if(sanitizeList[sanitizeID]){
            out = out.toString();
            switch(sanitizeID){
                case FILTER_SANITIZE_ADD_SLASHES:
                    out = str.replace(sanitizeList[sanitizeID]['exp'],(v)=>{
                        return '\\'+v;
                    });
                break;
                case FILTER_SANITIZE_EMAIL:
                    out = str.replace(sanitizeList[sanitizeID]['exp'],(v)=>{
                        return '';
                    });
                break;
                case FILTER_SANITIZE_ENCODED:
                    out = encodeURIComponent(str);
                break;
                case FILTER_SANITIZE_NUMBER_FLOAT:
                    out = str.replace(sanitizeList[sanitizeID]['exp'],(v)=>{
                        return '';
                    });
                break;
                case FILTER_SANITIZE_NUMBER_INT:
                    out = str.replace(sanitizeList[sanitizeID]['exp'],(v)=>{
                        return '';
                    });
                break;
                case FILTER_SANITIZE_SPECIAL_CHARS:
                    out = str.replace(sanitizeList[sanitizeID]['exp'],(v)=>{
                        return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                    });
                break;
                case FILTER_SANITIZE_URL:
                    out = str.replace(sanitizeList[sanitizeID]['exp'],(v)=>{
                        return '';
                    });
                break;
            }
            return out ? out : false;
        }else
            return false;
    }  
},
/**
 * Filters out certain words from the string
 * @param {string} str String to filter out
 * @param {string[]} removeWords List of words to remove
 * @returns {string} Filtered string
 */
filter=(str, removeWords)=>{
    removeWords.forEach((words)=>{
        if(validate(words,FILTER_VALIDATE_DOMAIN)){
            if(validate(words,FILTER_VALIDATE_DOMAIN)){
                const removeWWW = validate(words,FILTER_VALIDATE_DOMAIN).replace('www.','');
                const domain = new RegExp('((http(s)?):\/\/)?(www\.)?'+removeWWW+'([-a-zA-Z0-9@:%_\+.~#?&//=]*)','g');
                str = str.replaceAll(domain,'');
            }
        }else{
            str = str.replaceAll(words,'');
        }
    });
    return str;
},
caches={
    /**
     * Registers a new cache
     * @returns {void}
     */
    register: ()=>{
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('./service-worker.js', {
                    scope: './'
                  });
            } 
    },
    /**
     * Clears out the cache
     * @returns {void}
     */
    clear: ()=>{
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations()
                  .then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister();
                    }
                  });
              }
    },
    /**
     * Adds a URL to the cache file
     * @param {String} url URL format to add to cache
     * @param {Boolean} [includeMsg=false] Return status and the message 
     * @returns {Boolean|Array<Boolean, String>} Boolean or an Array with a boolean/message
     */
    add:(url, includeMsg=false)=>{
        const e = new Events();
        const r = e.request(window.location.origin+'/WebServerAI/libs/ai_sender.php?addCache='+url, true);
       if(r.status){
            if(includeMsg)
                return [true, r.msg];
            else
                return true;
       }else{
        if(includeMsg)
            return [false, r.msg];
        else
            return false;
       }
        
    }
};

export {validate,
    sanitize, 
    filter,
    caches,
    FILTER_VALIDATE_INT, 
    FILTER_VALDATE_BOOLEAN, 
    FILTER_VALIDATE_FLOAT, 
    FILTER_VALIDATE_REGEXP, 
    FILTER_VALIDATE_DOMAIN, 
    FILTER_VALIDATE_URL, 
    FILTER_VALIDATE_EMAIL, 
    FILTER_VALIDATE_IP, 
    FILTER_VALIDATE_MAC,
    FILTER_SANITIZE_ADD_SLASHES,
    FILTER_SANITIZE_EMAIL,
    FILTER_SANITIZE_ENCODED,
    FILTER_SANITIZE_NUMBER_FLOAT,
    FILTER_SANITIZE_NUMBER_INT,
    FILTER_SANITIZE_SPECIAL_CHARS,
    FILTER_SANITIZE_URL,
    FILTER_FLAG_ALLOW_FRACTION,
    FILTER_FLAG_ALLOW_THOUSAND,
    FILTER_FLAG_ALLOW_SCIENTIFIC,
    FILTER_FLAG_STRIP_LOW,
    FILTER_FLAG_STRIP_HIGH, 
    FILTER_FLAG_ENCODE_HIGH,
    FILTER_FLAG_IPV4,
    FILTER_FLAG_IPV6,
    FILTER_FLAG_NO_PRIV_RANGE,
    FILTER_FLAG_NO_RES_RANGE
};