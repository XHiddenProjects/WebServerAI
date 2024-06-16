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
    statement(str){
        return str.match(/\"(.*?)\"/g).map((a)=>{
            return a.replace(/\"/g,'');
        });
    }
}
export default Events;