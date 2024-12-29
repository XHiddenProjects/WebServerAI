// Import "Extensions" from extension.js to allow usages
import Extensions from "../../assets/AI/js/components/extenstions.js";
import Events from "../../assets/AI/js/components/Events.js";
import { HTMLDecoder, uniqid } from "../../assets/AI/js/components/utils.js";

// START LOAD-UP (Required)
const url = new URL(import.meta.url),
ext = new Extensions(),
events = new Events(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url),
lang = events.request(window.location.origin+'/WebServerAI/data/languages.json',true)['languages'][navigator.language];;
//ext.saveTemplate(buildName,ext.parse(buildName));

// END LOAD-UP
if(ext.isAllowed(buildName)){
    events.submit((e)=>{
        var allowDraw=0;
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg'),
        shapeReg = /draw.*?"(.*?)"(.*?properties.*?"(.*?)")?/gi,
        locReg = /Contain SVG.*?"(.*?)"/i,
        idd = uniqid();
        let target = document.body;
        svg.innerHTML = `SVG ${lang['dictionary']['console']['noSupport']}`;
        svg.id = idd;
        svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
        e = HTMLDecoder(e);
        events.cmdLine(locReg,e,(locCmd)=>{
            if(locCmd&&typeof locCmd!==null) target = document.querySelector(locCmd[2]);
        });
        events.cmdLine(shapeReg,e,(drawCmd)=>{
            if(drawCmd&&typeof drawCmd!==null){
                allowDraw=1;
                drawCmd.forEach((drawings) => {
                    drawings.match(shapeReg);
                    const matches = shapeReg.exec(drawings);
                    if(matches[1].match('rectangle')) matches[1] = 'rect';
                    let shape = document.createElementNS('http://www.w3.org/2000/svg',matches[1]);
                    if(matches[3]){
                        matches[3] = matches[3].replaceAll('; ','').replace(/;$/,'');
                        matches[3].split(';').forEach((prop)=>{
                            const key = prop.split(/[:](?!(\/|\.))/)[0], value = prop.split(/[:](?!(\/|\.))/)[2];
                            if(key.toLocaleLowerCase()==='msg'){
                                shape.textContent = value;
                            }else if(key.toLocaleLowerCase()==='link'){
                                const parser = new DOMParser(),
                                outer = parser.parseFromString(shape.outerHTML,'image/svg+xml').documentElement;
                                shape = document.createElementNS('http://www.w3.org/2000/svg','a');
                                shape.setAttributeNS(null,'href',value);
                                shape.setAttributeNS(null,'target','_blank');
                                shape.appendChild(outer);
                            }else
                                shape.setAttributeNS(null,key,value);
                        });
                    }else{
                        switch(matches[1].toLocaleLowerCase()){
                            case 'rect':
                                shape.setAttributeNS(null,'x',0);
                                shape.setAttributeNS(null,'y',0);
                                shape.setAttributeNS(null,'width',1);
                                shape.setAttributeNS(null,'height',1);
                                shape.setAttributeNS(null,'fill','#000000');
                            break;
                            case 'circle':
                                shape.setAttributeNS(null,'r',1);
                                shape.setAttributeNS(null,'cx',0);
                                shape.setAttributeNS(null,'cy',0);
                                shape.setAttributeNS(null,'fill','#000000');
                            break;
                            case 'ellipse':
                                shape.setAttributeNS(null,'rx',100);
                                shape.setAttributeNS(null,'ry',50);
                                shape.setAttributeNS(null,'cx',1);
                                shape.setAttributeNS(null,'cy',1);
                                shape.setAttributeNS(null,'fill','#000000');
                            break;
                            case 'line':
                                shape.setAttributeNS(null,'x1',10);
                                shape.setAttributeNS(null,'y1',20);
                                shape.setAttributeNS(null,'x2',200);
                                shape.setAttributeNS(null,'y2',200);
                                shape.setAttributeNS(null,'stroke','red');
                                shape.setAttributeNS(null,'stroke-width',2);
                            break;
                        }
                    }
                    svg.appendChild(shape);
                });
            }
        });
        if(allowDraw){
            const parse = new DOMParser(),
            svgParse = parse.parseFromString(svg.outerHTML,'image/svg+xml');
            target.insertAdjacentElement('afterbegin',svgParse.documentElement);
            const children = document.querySelector(`#${idd}`).children;
            // Initialize viewBox dimensions
            let xMin = Infinity, yMin = Infinity;
            let xMax = -Infinity, yMax = -Infinity;
            Array.from(children).forEach((element) => {
                const bbox = element.getBBox();
                xMin = Math.min(xMin, bbox.x);
                yMin = Math.min(yMin, bbox.y);
                xMax = Math.max(xMax, bbox.x + bbox.width);
                yMax = Math.max(yMax, bbox.y + bbox.height);
            });
            
            document.querySelector(`#${idd}`).setAttribute('viewBox', `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`);
        }
    });
    //USE "wsa-build" to trigger on build-submit
    window.addEventListener('wsa-build',(e)=>{
        // Give elements based on your build name a unique ID
        ext.update(buildName);
    });
}else
    ext.noSupport(buildName);