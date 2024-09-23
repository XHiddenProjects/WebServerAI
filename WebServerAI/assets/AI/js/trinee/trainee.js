class Trainee{
    #addElement;
    constructor(){
        this.#addElement = {};

    }
    /**
     * Adds a element to the Listener
     * @param {String} label Label the element you want to add
     * @param {JSON} added HTML Object add
     * @returns {JSON}
     */
    addElement(label,added = {}){
        this.#addElement[label] = added;
    }
    /**
     * Displays the added elements
     * @param {String} search What element to look up
     * @returns {JSON}
     */
    listAddedElement(search){
        return this.#addElement[search];
    }
   
}
export default Trainee;