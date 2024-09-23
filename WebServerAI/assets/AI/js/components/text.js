import Events from "./Events.js";
import { getLangCode } from "./utils.js";
import MathML from "../extras/mathml.js";
import Currency from "../extras/currency.js";
import Matches from "../extras/matches.js";
import { cookie } from '../components/storage.js';
class Text{
    #str='';
    constructor(str){
        this.#str = str;
    }
    /**
     * Summarizes the string
     * @param {Float} length The length of the summary
     * @returns {String} The Summarized paragraph.
     */
    summarize(length=1){
        const e = new Events(),
        strify = JSON.stringify({'text':this.#str,'length':length});
        e.request(window.location.origin+'/WebServerAI/libs/ai_script_data.php?'+encodeURIComponent('dataname=txttosummary&datasets='+strify));
        const summarize = e.request(window.location.origin+'/WebServerAI/scripts/text-summerizer.py',true);
        return summarize['summary'];
    }
    /**
     * Looks up any word
     * @param {String} word The word the lookup
     * @returns {Array<string>} Array of matched words
     */
    lookup(word){
        return [...this.#str.matchAll(word)];
    }
    /**
     * Replaces a string with replacement
     * @param {RegExp|String} search The string to search for 
     * @param {string} [replaceWith=''] The replacement for that targeted string
     * @param {Boolean} [replaceAll=false] Replaces all targeted search
     * @param {Boolean} [caseInsensitive=false] Replaces all targeted search with no case sensative
     * @returns {String} The replaced string in the input
     */
    replace(search, replaceWith='', replaceAll=false, caseInsensitive=false){
        if(!(search instanceof RegExp)){
            let flags='';
            if(replaceAll)
                flags+='g';
            if(caseInsensitive)
                flags+='i';
            return this.#str.replace(new RegExp(search,flags),replaceWith);
        }else{
            return this.#str.replace(search,replaceWith);
        }
    }
    /**
     * Translates your entire text
     * @param {String} [translateTo='en'] The language that you would like to return as
     * @param {String} [translateFrom='auto'] The original language, use **"auto"** to _autodetect_
     * @returns {JSON} Returns the translated object
     */
    translate(translateTo='en',translateFrom='auto'){
        translateTo = (getLangCode(translateTo) ? getLangCode(translateTo)['langCode'] : 'en')
        translateFrom = (translateFrom!=='auto' ? (getLangCode(translateFrom) ? getLangCode(translateFrom)['langCode'] : 'auto') : 'auto');
        const e = new Events(),
        strify = JSON.stringify({'textToTranslate':this.#str, 'translateFrom':translateFrom ,'translateTo': translateTo});
        e.request(window.location.origin+'/WebServerAI/libs/ai_script_data.php?'+encodeURIComponent('dataname=translateTxt&datasets='+strify))
        const translate = e.request(window.location.origin+'/WebServerAI/scripts/text-translate.py',true);
        return translate;
    }
    /**
     * Converts currency 
     * @param {String|null} from Currency that you are converting to
     * @param {String|null} to Conversion currenty
     * @param {boolean} [label=true] Labels with the currency value
     */
    currenyConverter(from,to,label=true){
        return (new Currency(this.#str)).convert(from, to,label);
    }
    /**
     * Check for a pattern
     * @param {RegExp|String} $pattern A pattern or a direct check of a text
     * @param {{ success: () => void; error: () => void; }} [results={}] 
     * @returns {Function}
     */
    matches($pattern, results={}){
        const e = new Events(),
        dictionary = e.request(window.location.origin+'/WebServerAI/data/languages.json',true)['languages'][cookie.get('lang')];
        const m = new Matches(this.#str);
        let success = false,
        validate = '';
        if($pattern instanceof RegExp){
            if(m.custom($pattern))
                success = true;
            else
                success = false;
        }else{
            if(m.checkValid($pattern)){
                $pattern = m.fix($pattern);
                switch($pattern.toLocaleLowerCase()){
                    case 'ssn':
                        if(validate = m.valid_SSN())
                            success=true;
                        else
                            success = false;
                    break;
                    case 'phone_number':
                        if(validate = m.valid_PHONE_NUMBER())
                            success=true;
                        else
                            success = false;
                    break;
                    case 'email_address':
                        if(validate = m.valid_EMAIL_ADDRESS())
                            success=true;
                        else
                            success = false;
                    break;
                    case 'domain':
                        if(validate = m.valid_DOMAIN())
                            success=true;
                        else
                            success = false;
                    break;
                }
            }else
                success = false;
        }
        if(!success)
            return results.error(dictionary['dictionary']['console']['TextMatchesValidationError']+$pattern);
        else
            return results.success(validate);
    }
    /**
     * Converts string to MathML format
     * @returns {JSON} Will return an XMLDocument on success, Error if failed
     */
    toMathML() {
        const math = new MathML();
        return math.str2xml(this.#str);
    }
}

export default Text;