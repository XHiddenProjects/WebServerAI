// Import "Extensions" from extension.js to allow usages
import Extensions from "/WebServerAI/assets/AI/js/components/extenstions.js";
// START LOAD-UP (Required)
const url = new URL(import.meta.url),
ext = new Extensions(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url),
config = ext.configSearch(url,['options'],[{}]);
ext.saveTemplate(buildName,ext.parse(buildName));
// END LOAD-UP
if(ext.isAllowed(buildName)){
    //USE "wsa-build" to trigger on build-submit
    window.addEventListener('wsa-build',(e)=>{
        // Your code goes in here
        const lang = navigator.language,
            timezone = Intl.DateTimeFormat(lang).resolvedOptions().timeZone;
        config.options.timeZone = timezone;
        setInterval(()=>{
            document.querySelectorAll('.clock').forEach((clock)=>{
                clock.querySelector('.datetime').innerText = new Intl.DateTimeFormat(lang,config.options).format(new Date()); 
            }); 
        },1000);
        // Give elements based on your build name a unique ID
        ext.update(buildName);
    });
}else
    ext.noSupport(buildName);