// Import "Extensions" from extension.js to allow usages
import Extensions from "/WebServerAI/assets/AI/js/components/extenstions.js";
import Events from "/WebServerAI/assets/AI/js/components/Events.js";
import {VIDEO_PATH, DS} from "/WebServerAI/assets/AI/js/components/utils.js";
import {shortcutJS} from "/WebServerAI/assets/AI/js/components/shortcut.min.js";
// START LOAD-UP (Required)
const url = new URL(import.meta.url),
ext = new Extensions(),
events = new Events(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url),
config = ext.configSearch(url,['progress-bar'],['']);
ext.saveTemplate(buildName,ext.parse(buildName));
const sc = new shortcutJS();
 /**
                    * Converts seconds into time
                    * @param {Number} time Time(in seconds) to convert
                    * @returns {String} formatted time
                */
 var sec2time=(seconds)=>{
    let hours = Math.floor(seconds / 3600),
        minutes = Math.floor((seconds % 3600) / 60);
        seconds = Math.floor(seconds % 60);
    return (hours<1 ? `` : `${hours.toString().padStart(2, '0')}:`)+`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  },
  fullscreen = (elem)=>{
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
  },
  isDown = false,
  skipRate = 5;
if(ext.isAllowed(buildName)){
    // END LOAD-UP
    //USE "wsa-build" to trigger on build-submit
    window.addEventListener('wsa-build',(e)=>{
        // Your code goes in here
        const videoURL = events.statement(events.get(e,'input'));
        const video = document.createElement('video');
        video.src = VIDEO_PATH+DS+videoURL[0];
        // Give elements based on your build name a unique ID
        const v = ext.update(buildName);
        document.querySelector('#'+buildName+'_'+v+' .video-container').appendChild(video);

        document.querySelectorAll('.video-player [video-play-toggle-status]').forEach((e)=>{
            e.addEventListener('click',(event)=>{
                const e = event.target;
                if(e.classList.contains('fa-play')){
                    e.className = e.className.replace('fa-play', 'fa-pause');
                    e.parentElement.parentElement.parentElement.parentElement.querySelector('video').play();
                    e.title = 'Pause (k)';
                }else{
                    e.className = e.className.replace('fa-pause', 'fa-play');
                    e.parentElement.parentElement.parentElement.parentElement.querySelector('video').pause();
                    e.title = 'Play (k)';
                }
            });
        });
        document.querySelectorAll('.video-player').forEach((e)=>{
            sc.bind([
                'p', 
                'm', 
                ' ',
                'ArrowRight',
                'ArrowLeft',
                'f'],
                [()=>{
                if(e.querySelector('video').paused)
                    e.querySelector('video').play();
                else
                    e.querySelector('video').pause();
            },
            ()=>{
                const vcontrol = e.querySelector('.volume-control');
                if(vcontrol.querySelector('i').classList.contains('fa-volume')){
                    vcontrol.querySelector('i').className = vcontrol.querySelector('i').className.replace('fa-volume','fa-volume-slash');
                    e.querySelector('video').volume = 0;
                    vcontrol.querySelector('input[type="range"]').value = 0;
                    vcontrol.querySelector('i').title = 'Unmute (m)';
                }else{
                    vcontrol.querySelector('i').className = vcontrol.querySelector('i').className.replace('fa-volume-slash','fa-volume');
                    e.querySelector('video').volume = 1;
                    vcontrol.querySelector('input[type="range"]').value = 1;
                    vcontrol.querySelector('i').title = 'Mute (m)';
                }
            },
            ()=>{
                if(e.querySelector('video').paused)
                    e.querySelector('video').play();
                else
                    e.querySelector('video').pause();
            },
            ()=>{
                e.querySelector('video').currentTime+=skipRate;
            },
            ()=>{
                e.querySelector('video').currentTime-=skipRate;
            },
            ()=>{
                fullscreen(e.querySelector('video'));
            }],
            [false, false, false, false, false, false],
            [false, false, false, false, false, false],
            [false, false, false, false, false, false]);
            sc.createListener(e);
        });
        document.querySelectorAll('.video-player video').forEach((e)=>{
            e.addEventListener('timeupdate',(e)=>{
                const video = e.target,
                    cur = video.currentTime,
                    dur = video.duration,
                    per = (cur/dur)*100;
                video.parentElement.parentElement.querySelector('.video-progress-bar').style.width = per+'%';
                if(per>=100&&video.parentElement.parentElement.querySelector('[video-play-toggle-status]').classList.contains('fa-pause'))
                        video.parentElement.parentElement.querySelector('[video-play-toggle-status]').className = video.parentElement.parentElement.querySelector('[video-play-toggle-status]').className.replace('fa-pause', 'fa-play');
                video.parentElement.parentElement.querySelector('.duration').innerText = sec2time(dur);
                video.parentElement.parentElement.querySelector('.currentTime').innerText = sec2time(cur);
            });
            e.addEventListener('play',(e)=>{
                const video = e.target,
                      elem = video.parentElement.parentElement.querySelector('[video-play-toggle-status]');
                      elem.className = elem.className.replace('fa-play','fa-pause');
            });
            e.addEventListener('pause',(e)=>{
                const video = e.target,
                      elem = video.parentElement.parentElement.querySelector('[video-play-toggle-status]');
                      elem.className = elem.className.replace('fa-pause','fa-play');
            });
        });
        document.querySelectorAll('.video-player .video-extra-controls [video-toggle-fullscreen]').forEach((e)=>{
            e.addEventListener('click',(event)=>{
                const main = event.target.parentElement.parentElement.parentElement.parentElement;
                fullscreen(main.querySelector('video'));
            });
        });
        document.querySelectorAll('.video-player .volume-control input[type="range"]').forEach((e)=>{
            e.addEventListener('input',(v)=>{
                const e = v.target;
                if(parseFloat(e.value)==(0||0.0)){
                    e.parentElement.querySelector('i').className = 'fa-solid fa-volume-slash';
                }else if(parseFloat(e.value)>0&&parseFloat(e.value)<=0.5){
                    e.parentElement.querySelector('i').className = 'fa-solid fa-volume-low';
                }else{
                    e.parentElement.querySelector('i').className = 'fa-solid fa-volume';
                }
                e.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('video').volume = e.value;
            })
        });
        document.querySelectorAll('.video-player .volume-control i').forEach((e)=>{
            e.addEventListener('click',(v)=>{
                const e = v.target;
                if(e.classList.contains('fa-volume')){
                    e.className = e.className.replace('fa-volume', 'fa-volume-slash');
                    e.parentElement.querySelector('input[type="range"]').value = '0';
                    e.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('video').volume = 0;
                }else{
                    e.className = e.className.replace('fa-volume-slash', 'fa-volume');
                    e.parentElement.querySelector('input[type="range"]').value = '1';
                    e.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('video').volume = 1;
                }
            })
        });
        document.querySelectorAll('.video-player .video-settings .video-progress').forEach((e)=>{
            e.addEventListener('mousemove',function(event){
                    const rect = this.getBoundingClientRect();
                    this.querySelector('.video-progress-hover').style.width = (event.clientX - rect.left)+'px';
            });
            e.addEventListener('mouseout',function(){
                this.querySelector('.video-progress-hover').style.width = 0;
            });
            e.addEventListener('click',function(event){
                const video = this.parentElement.parentElement.parentElement.querySelector('video'),
                width = this.offsetWidth,
                time = (((event.clientX-this.getBoundingClientRect().left)/width)*video.duration)+1;
                this.parentElement.parentElement.querySelector('.currentTime').innerText = sec2time(time);
                this.parentElement.parentElement.querySelector('.duration').innerText = sec2time(video.duration);
                video.currentTime = time;
            });
            e.addEventListener('click',function(e){
                this.addEventListener('mousedown',()=>{
                    isDown = true;
                });
                this.addEventListener('mouseup',()=>{
                    isDown = false;
                });
                this.addEventListener('mousemove',(event)=>{
                    const rect = this.getBoundingClientRect();
                    if(isDown)
                        this.parentElement.querySelector('.video-progress-bar').style.width = (event.clientX-rect.left)+'px';
                });
            });
        });

    });
}else 
    ext.noSupport(buildName);