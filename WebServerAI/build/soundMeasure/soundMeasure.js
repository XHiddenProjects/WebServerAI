// Import "Extensions" from extension.js to allow usages
import Extensions from "/WebServerAI/assets/AI/js/components/extenstions.js";
import Events from "/WebServerAI/assets/AI/js/components/Events.js";
import { getInfo, HTMLDecoder } from '../../assets/AI/js/components/utils.js';

// START LOAD-UP (Required)
const url = new URL(import.meta.url),
ext = new Extensions(),
events = new Events(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url);
ext.saveTemplate(buildName,ext.parse(buildName));
const info = getInfo(buildName);

let baseLow = 0.5;

if(ext.isAllowed(buildName)){
    // Get the volume visualizer element
    events.submit((e)=>{
        e = HTMLDecoder(e);
        events.cmdLine(/set sound ?measure;? "(.*?)" to "(width|height)"/,e,(soundmeasure)=>{
            if(soundmeasure){
                const elem = document.querySelector(soundmeasure[1]),
                size = soundmeasure[2];
                if(elem.classList.contains('meter')){
                    elem.classList.add('meter-'+size);
                    if(size==='width'){
                        elem.querySelector('.meter-bar').style.height = '100%';
                        elem.querySelector('.meter-bar').style.width = '0px';
                    }else{
                        elem.querySelector('.meter-bar').style.width = '100%';
                        elem.querySelector('.meter-bar').style.height = '0px';
                    }
                    elem.classList.remove('meter-'+(size==='width' ? 'height' : 'width'));
                }else{
                    elem.querySelector('.meter').classList.add('meter-'+size);
                    if(size==='width'){
                        elem.querySelector('.meter .meter-bar').style.height = '100%';
                        elem.querySelector('.meter .meter-bar').style.width = '0px';
                    }else{
                        elem.querySelector('.meter .meter-bar').style.width = '100%';
                        elem.querySelector('.meter .meter-bar').style.height = '0px';
                    }
                    elem.querySelector('.meter').classList.remove('meter-'+(size==='width' ? 'height' : 'width'));
                }
            }
        });
    });
    window.addEventListener('wsa-build',()=>{
        ext.update(buildName);
        document.querySelectorAll('.soundmeasure').forEach(async (e)=>{
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            const audioContext = new AudioContext();
            const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
            const analyserNode = audioContext.createAnalyser();
            mediaStreamAudioSourceNode.connect(analyserNode);
            const pcmData = new Float32Array(analyserNode.fftSize);
            


            const onFrame = () => {
            const sensitivity = (e.querySelector('.sensitivity') ? parseFloat(e.querySelector('.sensitivity').value) : 1); // Adjust this value to change sensitivity
            analyserNode.getFloatTimeDomainData(pcmData);
            let sumSquares = 0.0;
            
            for (const amplitude of pcmData) {
                sumSquares += (amplitude * sensitivity) * (amplitude * sensitivity);
            }
            let vol = Math.sqrt(sumSquares / pcmData.length),
            meter = e.querySelector('.meter');
            if(vol<baseLow)
                meter.querySelector('.meter-bar').setAttribute('vol-status','low');
            else if(vol>=baseLow&&vol<(baseLow+0.2))
                meter.querySelector('.meter-bar').setAttribute('vol-status','medium');
            else
                meter.querySelector('.meter-bar').setAttribute('vol-status','high');
            //console.log(meter.classList);
            (meter.classList.contains('meter-width') ? meter.querySelector('.meter-bar').style.width = ((vol*100 > 100) ? 100 : vol*100)+'%' : meter.querySelector('.meter-bar').style.height = ((vol*100 > 100) ? 100 : vol*100)+'%');
            window.requestAnimationFrame(onFrame);
            };

            window.requestAnimationFrame(onFrame);
            });
    });   
}else
    ext.noSupport(buildName);