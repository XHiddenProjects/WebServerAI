// Import "Extensions" from extension.js to allow usages
import Extensions from "/WebServerAI/assets/AI/js/components/extenstions.js";
import Events from "/WebServerAI/assets/AI/js/components/Events.js";
// START LOAD-UP (Required)
const url = new URL(import.meta.url),
ext = new Extensions(),
events = new Events(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url),
config = ext.configSearch(url,['progress-bar'],['']);
ext.saveTemplate(buildName,ext.parse(buildName));
// END LOAD-UP
//USE "wsa-build" to trigger on build-submit
window.addEventListener('wsa-build',(e)=>{
    // Your code goes in here
    console.log(events.statement(events.get(e,'input')));
    // Give elements based on your build name a unique ID
    ext.update(buildName);
});