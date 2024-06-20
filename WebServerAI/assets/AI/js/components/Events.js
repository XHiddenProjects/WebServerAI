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
     * Returns array of users statements
     * @param {String} str Users input
     * @returns {Array<String>} List of matching users dbl quotations
     */
    statement(str){
        return str.match(/\"(.*?)\"/g).map(a=>a.replace(/\"/g,'')).splice(1);
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
}
export default Events;