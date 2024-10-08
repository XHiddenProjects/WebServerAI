var responce;
import { filterHTML, credits } from "./security.js";
import { session } from "./storage.js";
import { IS_ENABLED } from "./utils.js";

class Events{
    constructor(){

    }
    /**
     * Returns the item that your looking for
     * @param {CustomEvent} event Event list to collect
     * @param {String} label What you want to return
     * @returns {*|undefined} Returns value of the current event list, UNDEFINED if not reached 
     */
    get(event, label){
        return event.detail[label] ? event.detail[label] : undefined;
    }
    /**
     * Returns the output of a certain command from the AI
     * @param {RegExp} eventPattern Check what to 
     * @param {String} str String to check
     * @param {Function|null} [callback=null] Return as a function
     * @returns {RegExpMatchArray|null}
     */
    cmdLine(eventPattern, str , callback=null){
        if(callback)
            return callback(str.match(eventPattern));
        else
            return str.match(eventPattern);
    }
    /**
     * Returns array of users statements
     * @param {String} str Users input
     * @param {boolean} [sliceStart=true] Remove the first item on the list
     * @returns {Array<String>} List of matching users dbl quotations
     */
    statement(str,sliceStart=true){
        return (sliceStart ? str.match(/\"(.*?)\"/g).map(a=>a.replace(/\"/g,'')).splice(1) : str.match(/\"(.*?)\"/g).map(a=>a.replace(/\"/g,'')));
    }
    /**
     * Looks up an array to see if value is in-place
     * @param {Array<*>} arr Array to lookup
     * @param {String|Number} index value to look at
     * @returns {Boolean}
     */
    lookup(arr, index){
        return arr.indexOf(index)>=0 ? true : false;
    }
    /**
     * Gets file content
     * @param {String} url Location to get the file content
     * @param {Boolean} [isJSON=false] Converts string to JSON object
     * @param {Boolean} [async=false] Wait until page load
     * @returns {JSON|String|Boolean} Returns results, FALSE if nothing was successful
     */
    request(url, isJSON=false, async=false){  
        if(url){
            let req = new XMLHttpRequest();
            req.onreadystatechange = ()=>{
                if(req.readyState==4&&req.status==200){
                        if(isJSON){
                            responce = JSON.parse(req.responseText);
                        }
                        else{
                            responce = req.responseText;
                        }
                }else
                    responce = false;
            }
            req.open("GET", url, async);
            req.send();
        }else
            responce = false;
        return responce;
    }
    /**
     * Triggers on users input from textarea
     * @param {Function} callback The function that will activate on submit
     * @returns {String} The Users input
     */
    submit(callback){
        let isNull = session.load('wsa-isnull');
        if(IS_ENABLED()){
            if(credits.get()>0){
                const txt = document.querySelector('.wsa-userinput'),
                    submitbtn = document.querySelector('.wsa-editor-send');
                txt.addEventListener('keydown', (e)=>{
                    let key = e.keyCode || e.which;
                    if(key===13&&(!isNull&&txt.value!=='')||(key===13&&isNull)){
                        e.preventDefault();
                        callback(filterHTML(txt.value));
                    }
                });
                submitbtn.addEventListener('click',(e)=>{
                    if((!isNull&&txt.value!=='')||isNull){
                        e.preventDefault();
                        callback(filterHTML(txt.value));
                    }
                });
            }else
                return false;
        }
    }
}
export default Events;