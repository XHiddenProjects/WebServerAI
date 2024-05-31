class Elements{
    constructor(){

    }
    /**
     * Select/selects any element based on target
     * @param {String} target Targets of element
     * @param {Boolean} selectAll Select all element(s)
     * @returns {Element|NodeListOf<Element>} Returns the elements of list of desendent nodes
     */
    selector(target, selectAll){
        return (selectAll ? document.querySelectorAll(target) : document.querySelector(target));
    }
    /**
     * Place the element inside the element
     * @param {Element} elem Target element
     * @param {Element} newElem New created Element
     * @param {String} [order='after'] First/Last position of the item
     * @param {Boolean} [start=true] Placement starts at beginning at TRUE, last at FALSE.
     */
    inside(elem, newElem, order='first', start=true){
        switch(order.toLowerCase()){
            case 'first':
                (start ? elem.insertAdjacentElement('afterbegin',newElem) : elem.insertAdjacentElement('afterend',newElem));
            break;
            case 'last':
                (start ? elem.insertAdjacentElement('beforebegin',newElem) : elem.insertAdjacentElement('beforeend',newElem));
            break;
        }
    }
}
export default Elements;