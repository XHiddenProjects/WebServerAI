var session = {
    /**
     * Saves data as a session storage
     * @param {String} name Sessions name
     * @param {*} data Data to save
     */
    save: (name, data)=>{
        sessionStorage.setItem(name, data);
    },
    /**
     * Returns data from a Session storage
     * @param {String} name Sessions name
     * @returns {*} Data from the session
     */
    load: (name)=>{
        return sessionStorage.getItem(name);
    },
    /**
     * Checks if session storage exists
     * @param {String} name Name of the session storage
     * @returns {Boolean} TRUE if session storage exists, else FALSE
     */
    check: (name)=>{
        return sessionStorage.getItem(name) ? true : false;
    },
    /**
     * Delete item from the Session storage
     * @param {String} name Item from Session storage
     */
    delete: (name)=>{
        sessionStorage.removeItem(name)
    }
},
local = {
    /**
     * Saves data as a Local storage
     * @param {String} name Local name
     * @param {*} data Data to save
     */
    save: (name, data)=>{
        localStorage.setItem(name, data);
    },
    /**
     * Returns data from a Local storage
     * @param {String} name Local name
     * @returns {*} Data from the Local
     */
    load: (name)=>{
        return localStorage.getItem(name);
    },
    /**
     * Checks if local storage exists
     * @param {String} name Name of the local storage
     * @returns {Boolean} TRUE if local storage exists, else FALSE
     */
    check: (name)=>{
        return localStorage.getItem(name) ? true : false;
    },
    /**
     * Delete item from the Local storage
     * @param {String} name Item from Local storage
     */
    delete: (name)=>{
        localStorage.removeItem(name)
    }
},
cookie = {
    /**
     * Sets a cookie to the browser
     * @param {String} name Cookies name
     * @param {*} value Value to the cookie
     * @param {Number} expire Expire day; Ex: (86400 * 30); // 86400 = 1 day
     * @param {String} [path="/"] [Optional] Path to store the cookie
     */
    set: (name, value, expire, path='/')=>{
        const d = new Date();
        d.setTime(d.getTime()+expire);
        const expires = "expires="+d.toUTCString();
        document.cookie = name+'='+value+';'+expires+';path='+path+';';
    },
    /**
     * Returns the cookies value
     * @param {String} cname Cookies name
     * @returns {*|Null} Cookies value
     */
    get: (cname)=>{
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return null;
    },
    /**
     * Checks if the cookie exists
     * @param {String} cname Cookie to check for
     * @returns {Boolean} If TRUE, the cookie exists, else FALSE
     */
    check: (cname)=>{
        let username = getCookie(cname);
        if (username != "") return true;
        else return false; 
    },
    /**
     * Removes the cookie from thew browser
     * @param {String} cname  Cookies name
     * @param {String} [cpath="/"] Cookies path 
     */
    delete: (cname, cpath='/')=>{
        const d = new Date();
        d.setTime(d.getTime() - 3600);
        document.cookie = cname+'='+';expires='+d.toUTCString()+';path='+cpath+';';
    }
}

export {session, local, cookie};