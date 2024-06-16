
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

export {rgbaToHex, calculateContrastRatio, keyboardFocusable, isDecimal};
