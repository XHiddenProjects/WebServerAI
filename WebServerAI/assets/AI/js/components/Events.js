var responce;
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
     * Returns the output of a certain command
     * @param {RegExp} eventPattern Check what to 
     * @param {String} str String to check
     * @returns {RegExpMatchArray|null}
     */
    cmdLine(eventPattern, str){
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
}
export default Events;