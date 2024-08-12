"use strict"
class Logic{
    #num;
    #expr;
    #toggleState;
    #toggleSetted=false;
    constructor(){
        this.#num = {Number:0};
        this.#expr = {Expr:{}};
    }
    /**
     * Sets a condition based on values
     * @param {*} value1 Value 1 to compare
     * @param {*} value2 Value 2 to compare
     * @param {String} logic Logic to use: _and|or|nand|nor|xor|xnor_
     * @returns {Boolean} Results of the comparison
     */
    Cond(value1, value2, logic='and'){
        let finalize=false;
        switch(logic.toLocaleUpperCase()){
            case 'AND':
                finalize = (value1&&value2);
            break;
            case 'OR':
                finalize = (value1||value2);
            break;
            case 'NAND':
                finalize = !(value1&&value2);
            break;
            case 'NOR':
                finalize = !(value1||value2);
            break;
            case 'XOR':
                finalize = (value1^value2);
            break;
            case 'XNOR':
                finalize = !(value1^value2);
            break;
        }
        return finalize;
    }
    /**
     * Rounds the number
     * @param {Number} num Value to round
     * @param {String} type Dictates on rounding method. _noRound|roundInt|roundUp|roundDown_
     * @returns {Number} Returns the rounded number
     */
    Rounding(num, type='noRound'){
        let returnVal;
        switch(type.toLocaleLowerCase()){
            case 'noround':
                returnVal = num;
            break;
            case 'roundint':
                returnVal = Math.round(num);
            break;
            case 'roundup':
                returnVal = Math.ceil(num);
            break;
            case 'rounddown':
                returnVal = Math.floor(num);
            break;
            default:
                returnVal = num;
            break
        }
        return returnVal;
    }
    /**
     * Takes action to number values
     * 
     * @param {String} method Gets the method to perform an action. _set|get|+_
     * @param {String} label Label your value
     * @param {Number} value Value to set
     * @param {string} [rounding='noRound'] Rounds the number. _noRound|roundInt|roundUp|roundDown_
     * @returns 
     */
    Number(method='set', label='Number', value=0, rounding='noRound'){
        let returnVal=null;
        if(this.#num.hasOwnProperty(label)){
            switch(method.toLocaleLowerCase()){
                case 'set':
                    this.#num[label] = this.Rounding(value,rounding);
                break;
                case 'get':
                    returnVal = this.#num[label];
                break;
                case '+':
                    this.#num[label] += this.Rounding(value,rounding);
                break;
            }
            if(returnVal!==null)
                return returnVal;
        }else{
            switch(method.toLocaleLowerCase()){
                case 'set':
                    this.#num['Number'] = this.Rounding(value,rounding);
                break;
                case 'get':
                    returnVal = this.#num['Number'];
                break;
                case '+':
                    this.#num['Number'] += this.Rounding(value,rounding);
                break;
            }
            if(returnVal!==null)
                return returnVal;
        }
    }
    #convertExpression(values, expr){
        Object.keys(values).forEach((e)=>{
            expr = expr.replaceAll(e,values[e]);
        });
        return expr;
    }
    /**
     * Calculates the following values
     * @param {JSON} values Sets the values for the equation. Ex: {A:2, B:2}
     * @param {String} expr Equation to calculate^. Ex: A+B=4
     * @param {String} label Label your calculations
     * @returns {Number} The calculated results
     */
    Expression(values, expr, label=''){
        let output;
        if(Object.keys(values).length>1&&expr){
            if(this.#expr.hasOwnProperty(label)){
                this.#expr[label] = values;
                output = this.#convertExpression(this.#expr[label],expr);
            }else{
                this.#expr['Expr'] = values;
                output = this.#convertExpression(this.#expr['Expr'],expr);
            }
            return eval(output);
        }else
            return 0;
    }
    /**
     * Save data in a global variable
     * 
     * @param {String} mode Gets the method of what you want to do. _set|get|+_
     * @param {String} label Variable to store globally
     * @param {*} value Value that you want to save globally
     * @returns {*} The value of the global variable
     */
    Global(mode='set', label='', value=''){
        let output = 0;
        switch(mode.toLocaleLowerCase()){
            case 'set':
                window[label] = value;
            break;
            case 'get':
                output = window[label];
            break;
            case '+':
                window[label] += value;
            break;
        }
        return output;
    }
    /**
     * Generates a random number
     * @param {Number} min Min number
     * @param {Number} max Max amount
     * @param {Boolean} [inclusive=true] Include all numbers if TRUE
     * @returns {Number} The random number
     */
    Random(min,max,inclusive=true){
        if(inclusive)
            return Math.floor(Math.random() * (max - min + 1)) + min
        else
            return Math.floor(Math.random() * (max - min)) + min;
    }
    /**
     * Checks for value comparison
     * @param {Number|String} input Value you are inputting
     * @param {Number|String} value Value 
     * @param {String} [compare='<'] How are they being compared. < | > | == | != | <= | >=
     * @returns {Boolean} Returns pass/fail from the the condition
     */
    Filter(input, value, compare='<'){
        let pass=false;
        switch(compare.toLocaleLowerCase()){
            case '<':
            case 'less than':
                pass = (input<value);
            break;
            case '>':
            case 'greater than':
                pass = (input>value);
            break;
            case '==':
            case 'equal to':
                pass = (input==value);
            break;
            case '!=':
            case 'not equal to':
                pass = (input!=value);
            break;
            case '<=':
            case 'less than or equal to':
                pass = (input<=value);
            break;
            case '>=':
            case 'greater than or equal to':
                pass = (input>=value);
            break;
            default:
                pass = (input<value);
            break;
        }
        return pass;
    }
    /**
     * 
     * @param {Function} on Condition to turn on
     * @param {Function} off Condition to turn off
     * @param {Boolean} [currentState=false] Set the current state True/False
     * @returns {Boolean|undefined} If state is TRUE it will return
     */
    Switch(on=()=>{}, off=()=>{}, currentState=false){
        const stateOn = on(),
        stateOff = off();

        currentState = stateOn ? true : currentState;
        currentState = stateOff ? false : currentState;

        if(currentState)
            return currentState;
    }
    /**
     * 
     * @param {Function} out1 Set function for out1
     * @param {Function} out2 Set function for out2
     * @param {1|2} state Set the current state for the toggle
     * @returns {Function} Returns the function of the correct toggled state
     */
    Toggle(out1, out2, state=1){
        if(!this.#toggleSetted){
            this.#toggleState=state;
            this.#toggleSetted=true;
        }

        if(this.#toggleState==1){
            this.#toggleState = 2;
            return out2();
        }else{
            this.#toggleState = 1;
            return out1();
        }
    }
}

export default Logic;