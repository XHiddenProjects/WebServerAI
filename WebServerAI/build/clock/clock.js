// Import "Extensions" from extension.js to allow usages
import Extensions from "../../assets/AI/js/components/extenstions.js";
import Events from "../../assets/AI/js/components/Events.js";
import { TimeFormat } from "../../assets/AI/js/extras/TimeFormat.min.js";
import { HTMLDecoder } from "../../assets/AI/js/components/utils.js";
// START LOAD-UP (Required)
const url = new URL(import.meta.url),
ext = new Extensions(),
events = new Events(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url);
ext.saveTemplate(buildName,ext.parse(buildName));
var timeFormat = 'Y-m-d H:i:s';
// END LOAD-UP
if(ext.isAllowed(buildName)){
    events.submit((e)=>{
        e = HTMLDecoder(e);
        events.cmdLine(/format \"(.*?)\"/,e,(format)=>{
            if(format){
                console.log(format);
                timeFormat = format[1];
            }
        });
    });
    //USE "wsa-build" to trigger on build-submit
    window.addEventListener('wsa-build',(e)=>{
        // Your code goes in here
        setInterval(()=>{
            document.querySelectorAll('.clock').forEach((clock)=>{
                const d=new Date(),
                DateTime = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
                clock.querySelector('.datetime').innerText = (new TimeFormat(DateTime)).format(timeFormat); 
            }); 
        },1000);
        // Give elements based on your build name a unique ID
        ext.update(buildName);
    });
}else
    ext.noSupport(buildName);