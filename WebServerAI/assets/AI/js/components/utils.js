
function ColorToHex(color) {
    var hexadecimal = color.toString(16);
    return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
}
/**
 * Converts RGB(a)? to Hexdecimal
 * @param {String} rgba RGB(a)? string
 * @returns {String} Hexdecimal format
 */
function rgbaToHex(rgba) {
    rgba = rgba.replace(/ /g,'');
    if(rgba.match(/rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),([01](\.\d{1,2})?)\)/)){
        const colors = rgba.replace(/rgba\(|\)/g,'').split(',');
        const r = parseInt(colors[0]), g = parseInt(colors[1]), b = parseInt(colors[2]), a = parseFloat(colors[3]);
        return '#' + ColorToHex(r) + ColorToHex(g) + ColorToHex(b)+ColorToHex(a);
    }else{
        const colors = rgba.replace(/rgb\(|\)/g,'').split(',');
        const r = parseInt(colors[0]), g = parseInt(colors[1]), b = parseInt(colors[2]);
        return '#' + ColorToHex(r) + ColorToHex(g) + ColorToHex(b);
    }
}
function rgbaToRgb(rgba) {
    rgba = rgba.replace(/ /g,'');
    if(rgba.match(/rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),([01](\.\d{1,2})?)\)/)){
        rgba = rgba.replace(/rgba?\(|\)| /g,'');
        const [red, green, blue, alpha] = rgba.split(',');
        const bgRed = 255; // Assuming the background color is RGB(255, 255, 255)
        const bgGreen = 255;
        const bgBlue = 255;
    
        const redComp = Math.round((alpha * (red / 255) + (1 - alpha) * (bgRed / 255)) * 255);
        const greenComp = Math.round((alpha * (green / 255) + (1 - alpha) * (bgGreen / 255)) * 255);
        const blueComp = Math.round((alpha * (blue / 255) + (1 - alpha) * (bgBlue / 255)) * 255);
    
        return `rgb(${redComp}, ${greenComp}, ${blueComp})`;
    }else
        return rgba;
    
}
/**
 * Checks if the number is a float or a integer
 * @param {Number} num Number to check
 */
function isDecimal(num){
    return (!isNaN(num)&&num%1!=0);
}
/*CONTRAST START*/
const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

/**
 * Calcutlate the Contrast Ratio
 * @param {Array<Int>} foregroundColor RGB(a?) for the forecolor
 * @param {Array<Int>} backgroundColor RGB(a?) for the background color
 * @param {Boolean} [toRatio=true] If TRUE, return the ratio, if FALSE return boolean of good ratio 
 * @returns {Number|Boolean} Boolean or Ratio number
 */
function calculateContrastRatio(foregroundColor, backgroundColor, toRatio=true) {
    const foregroundRGB = rgbToRGB(rgbaToRgb(foregroundColor));
    const backgroundColorRGB = rgbToRGB(rgbaToRgb(backgroundColor));
    var lum1 = luminance(...foregroundRGB);
    var lum2 = luminance(...backgroundColorRGB);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    const ratio = (brightest + 0.05) / (darkest + 0.05);
    if(toRatio)
        return (isDecimal(ratio) ? ratio.toFixed(1) : ratio);
    else
        return ratio>=4.5 ? true : false;
}

  // Helper function to convert color strings to RGB values
  function rgbToRGB( color ) {
    // Split the color string into R, G, and B components
    const [ r, g, b ] = color.match( /(\d{1,3})/g );
  
    return [r, g, b];
  }
  // Helper function to calculate luminance values
  function luminance(r,g,b) {
    var a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928
          ? v / 12.92
          : Math.pow((v + 0.055) / 1.055, GAMMA);
      });
      return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}
/*CONTRAST END*/
/**
 * Returns if element is keyboard-focusable
 * @param {Element} elem Element to check
 * @returns {Boolean} TRUE if element is focusable, FALSE if not
 */
function keyboardFocusable(elem){
    const validFocusedElement = ['input', 'textarea', 'a', 'select', 'button'];
    if(validFocusedElement.indexOf(elem.tagName.toLocaleLowerCase())>=0){
        if(elem.tagName.toLocaleLowerCase()==='a'&&elem.hasAttribute('href'))
            return true;
        else if(elem.tagName.toLocaleLowerCase()==='a'&&!elem.hasAttribute('href'))
            return false;
        else
            return true;
    }else
        return false;
    
}
const matches = {
    '>':'<',
    '<':'>',
    '>=':'<=',
    '<=':'>=',
    '==':'!=',
    '!=':'=='
}
/**
 * Compares two versions to match
 * @param {String} version1 Version 1 to compare
 * @param {String} version2 Version 2 to compare
 * @param {String|null} [operator=null] Expression to check: _>, <, >=, <=, ==,_ and _!=_
 * @returns {Number} -1 if version1 is less than version2, 0 if version1 is equal to version2, 1 if version1 is greater than version2
 */
function version_compare(v1, v2, operator){
    //       discuss at: https://locutus.io/php/version_compare/
    //      original by: Philippe Jausions (https://pear.php.net/user/jausions)
    //      original by: Aidan Lister (https://aidanlister.com/)
    // reimplemented by: Kankrelune (https://www.webfaktory.info/)
    //      improved by: Brett Zamir (https://brett-zamir.me)
    //      improved by: Scott Baker
    //      improved by: Theriault (https://github.com/Theriault)
    //        example 1: version_compare('8.2.5rc', '8.2.5a')
    //        returns 1: 1
    //        example 2: version_compare('8.2.50', '8.2.52', '<')
    //        returns 2: true
    //        example 3: version_compare('5.3.0-dev', '5.3.0')
    //        returns 3: -1
    //        example 4: version_compare('4.1.0.52','4.01.0.51')
    //        returns 4: 1
  
    // Important: compare must be initialized at 0.
    let i
    let x
    let compare = 0
  
    // vm maps textual PHP versions to negatives so they're less than 0.
    // PHP currently defines these as CASE-SENSITIVE. It is important to
    // leave these as negatives so that they can come before numerical versions
    // and as if no letters were there to begin with.
    // (1alpha is < 1 and < 1.1 but > 1dev1)
    // If a non-numerical value can't be mapped to this table, it receives
    // -7 as its value.
    const vm = {
      dev: -6,
      alpha: -5,
      a: -5,
      beta: -4,
      b: -4,
      RC: -3,
      rc: -3,
      '#': -2,
      p: 1,
      pl: 1,
    }
  
    // This function will be called to prepare each version argument.
    // It replaces every _, -, and + with a dot.
    // It surrounds any nonsequence of numbers/dots with dots.
    // It replaces sequences of dots with a single dot.
    //    version_compare('4..0', '4.0') === 0
    // Important: A string of 0 length needs to be converted into a value
    // even less than an unexisting value in vm (-7), hence [-8].
    // It's also important to not strip spaces because of this.
    //   version_compare('', ' ') === 1
    const _prepVersion = function (v) {
      v = ('' + v).replace(/[_\-+]/g, '.')
      v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.')
      return !v.length ? [-8] : v.split('.')
    }
    // This converts a version component to a number.
    // Empty component becomes 0.
    // Non-numerical component becomes a negative number.
    // Numerical component becomes itself as an integer.
    const _numVersion = function (v) {
      return !v ? 0 : isNaN(v) ? vm[v] || -7 : parseInt(v, 10)
    }
  
    v1 = _prepVersion(v1)
    v2 = _prepVersion(v2)
    x = Math.max(v1.length, v2.length)
    for (i = 0; i < x; i++) {
      if (v1[i] === v2[i]) {
        continue
      }
      v1[i] = _numVersion(v1[i])
      v2[i] = _numVersion(v2[i])
      if (v1[i] < v2[i]) {
        compare = -1
        break
      } else if (v1[i] > v2[i]) {
        compare = 1
        break
      }
    }
    if (!operator) {
      return compare
    }
    // Important: operator is CASE-SENSITIVE.
    // "No operator" seems to be treated as "<."
    // Any other values seem to make the function return null.
    switch (operator) {
        case '>':
        case 'gt':
            return compare > 0
        case '>=':
        case 'ge':
            return compare >= 0
        case '<=':
        case 'le':
            return compare <= 0
        case '==':
        case '=':
        case 'eq':
            return compare === 0
        case '<>':
        case '!==':
        case 'ne':
            return compare !== 0
        case '':
        case '<':
        case 'lt':
            return compare < 0
        default:
        return null
    }
}
const VIDEO_PATH = window.location.origin+'/WebServerAI/assets/AI/videos',
    AUDIO_PATH = window.location.origin+'/WebServerAI/assets/AI/audios',
    IMAGE_PATH = window.location.origin+'/WebServerAI/assets/AI/images',
    DS = '/',
    ORGIN = window.location.origin;

export {
    rgbaToHex, 
    calculateContrastRatio, 
    keyboardFocusable, 
    isDecimal, 
    version_compare,
    //CONST
    VIDEO_PATH,
    AUDIO_PATH,
    IMAGE_PATH,
    DS,
    ORGIN
};
