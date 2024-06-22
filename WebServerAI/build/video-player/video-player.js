// Import "Extensions" from extension.js to allow usages
import Extensions from "/WebServerAI/assets/AI/js/components/extenstions.js";
import Events from "/WebServerAI/assets/AI/js/components/Events.js";
import {VIDEO_PATH, SUBTITLE_PATH, DS} from "/WebServerAI/assets/AI/js/components/utils.js";
import {shortcutJS} from "/WebServerAI/assets/AI/js/components/shortcut.min.js";
// START LOAD-UP (Required)
const url = new URL(import.meta.url),
ext = new Extensions(),
events = new Events(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url);
ext.saveTemplate(buildName,ext.parse(buildName));
const sc = new shortcutJS();
if(ext.isAllowed(buildName)){
    // END LOAD-UP
    //USE "wsa-build" to trigger on build-submit
    window.addEventListener('wsa-build',(e)=>{
        // Your code goes in here
        var secureURL;
        const videoURL = events.statement(events.get(e,'input')),
        xhr = new XMLHttpRequest(),
        sendURL = VIDEO_PATH+DS+videoURL[0];
        // Give elements based on your build name a unique ID
        const v = ext.update(buildName);
        xhr.open("GET",sendURL);
        xhr.responseType = 'arraybuffer';
        xhr.onload = ()=>{
            const blob = new Blob([xhr.response]),
            url = URL.createObjectURL(blob);
            document.querySelector('#'+buildName+'_'+v+' .video-container video').src = url;
        };
        xhr.send();
        const subtitles = events.cmdLine(/subtitles? \"(.*?)\" and label it as \"(.*?)\"/g,events.get(e,'input')),
            lang = events.request('/WebServerAI/data/languagesData.json',true);
        if(subtitles){
            subtitles.forEach((s)=>{
                const st = events.statement(s,false),
                t = document.createElement('track');
                t.label = st[1];
                t.src = SUBTITLE_PATH+DS+st[0];
                t.kind = 'subtitles';   
                for(let i in lang){
                    if(lang[i].name.toLocaleLowerCase()===st[1].toLocaleLowerCase()){
                        t.srclang = i.toLocaleLowerCase();
                    }
                }
                document.querySelector('#'+buildName+'_'+v+' video').appendChild(t);
            });
        }

        const video_player = document.querySelectorAll('#'+buildName+'_'+v+' .video_player');
        video_player.forEach((elem)=>{
            const container = elem,
            mainvideo = elem.querySelector('video'),
            progressTimeArea = elem.querySelector('.video-progresstime'),
            controls = elem.querySelector('.video-controls'),
            progressArea = elem.querySelector('.video-progress'),
            progress_Bar = elem.querySelector('.video-progress-bar'),
            fast_rewind = elem.querySelector('.fast-rewind'),
            play_pause = elem.querySelector('.play_pause'),
            fast_forward = elem.querySelector('.fast-forward'),
            volume = elem.querySelector('.volume'),
            volume_range = elem.querySelector('.volume_range'),
            current = elem.querySelector('.current'),
            duration = elem.querySelector('.duration'),
            autoPlay = elem.querySelector('.auto-play'),
            settingsBtn = elem.querySelector('.settingsBtn'),
            pip = elem.querySelector('.pip'),
            fullscreen = elem.querySelector('.fullscreen'),
            settings = elem.querySelector('.video-settings'),
            playback = elem.querySelectorAll('.video-playback li'),
            bufferedBar = elem.querySelector('.buffered-progress-bar'),
            captionsBtn = elem.querySelector('.captionsBtn'),
            captions = elem.querySelector('.video-captions'),
            caption_labels = elem.querySelector('.video-captions ul'),
            tracks = elem.querySelectorAll('track');
            if(tracks.length>0){
                caption_labels.insertAdjacentHTML('afterbegin',`<li data-track="off" class="active">Off</li>`);
                for(let i=0;i<tracks.length;i++){
                    const trackLi = `<li data-track="${tracks[i].label}">${tracks[i].label}</li>`;
                    caption_labels.insertAdjacentHTML('beforeend',trackLi);
                }
            }else{
               captionsBtn.setAttribute('disabled',true);
               captionsBtn.title = 'Captions is unavailable';
            }
            const caption_tracks = captions.querySelectorAll('ul li');
            

            function sec2time(seconds) {
                return (Math.floor(seconds / 3600)<1 ? `` : `${Math.floor(seconds / 3600).toString().padStart(2, '0')}:`)+`${(Math.floor((seconds % 3600) / 60)).toString().padStart(2, '0')}:${(Math.floor(seconds % 60)).toString().padStart(2, '0')}`;
              }

            // Buffered
            mainvideo.addEventListener('loadeddata',()=>{
                setInterval(()=>{
                    const bufferedTime = mainvideo.buffered.end(0),
                        duration = mainvideo.duration,
                        width = (bufferedTime/duration)*100;
                    bufferedBar.style.width = `${width}%`;
                  },500);
            });
              
            

            // Play video
            function playVideo(){
                play_pause.innerHTML = 'pause';
                play_pause.title = 'Pause';
                container.classList.add('paused');
                mainvideo.play();
            }
            // Pause video
            function pauseVideo(){
                play_pause.innerHTML = 'play_arrow';
                play_pause.title = 'Play';
                container.classList.remove('paused');
                mainvideo.pause();
            }

            play_pause.addEventListener('click',()=>{
                const isVideoPaused = container.classList.contains('paused');
                isVideoPaused ?  pauseVideo() : playVideo();
            });

            mainvideo.addEventListener('play',()=>{
                playVideo();
            });
            mainvideo.addEventListener('pause',()=>{
                pauseVideo();
            });

            // Fast rewind
            fast_rewind.addEventListener('click',()=>{
                mainvideo.currentTime -= 10;
            });

            // Fast forward
            fast_forward.addEventListener('click',()=>{
                mainvideo.currentTime += 10;
            });

            //load video duration
            mainvideo.addEventListener('loadedmetadata',(e)=>{
                const dur = e.target.duration;
                duration.innerHTML = sec2time(dur);
            });

            //current video
            mainvideo.addEventListener('timeupdate',(e)=>{
                const cur = e.target.currentTime;
                current.innerHTML = sec2time(cur);
                //progress bar
                const progressWidth = (cur/e.target.duration)*100;
                progress_Bar.style.width = `${progressWidth}%`
            });

            progressArea.addEventListener('click',(e)=>{
                const dur = mainvideo.duration,
                progressWithval = progressArea.clientWidth,
                clickOffset = e.offsetX;
                mainvideo.currentTime = (clickOffset/progressWithval)*dur;
            });

            //Move time based on mouse movement
            progressArea.addEventListener('mousemove',(e)=>{
                const progressWithval = progressArea.clientWidth,
                    x = e.offsetX,
                    dur = mainvideo.duration,
                    progressTime = Math.floor((x/progressWithval)*dur);
                progressTimeArea.style.setProperty('--x',`${x}px`);
                progressTimeArea.style.display = 'block';
                progressTimeArea.innerHTML = sec2time(progressTime);

            });

            progressArea.addEventListener('mouseleave',()=>{
                progressTimeArea.style.display = 'none';
            });

            //Change volume
            function changeVolume(){
                mainvideo.volume = volume_range.value/100;
                if(volume_range.value==0)
                    volume.innerHTML = 'volume_off';
                else if(volume_range.value<=50)
                    volume.innerHTML = 'volume_down';
                else
                    volume.innerHTML = 'volume_up'
            }
            function muteVolume(){
                if(volume_range.value==0){
                    volume_range.value = 100;
                    mainvideo.volume = 1;
                    volume.innerHTML = 'volume_up';
                }else{
                    volume_range.value = 0;
                    mainvideo.volume = 0;
                    volume.innerHTML = 'volume_off';
                }
            }

            volume_range.addEventListener('input',()=>{
                changeVolume();
            });
            volume.addEventListener('click',()=>{
                muteVolume();
            });

            //auto-play
            autoPlay.addEventListener('click',()=>{
                autoPlay.classList.toggle('active');
                if(autoPlay.classList.contains('active')){
                    autoPlay.title = 'Autoplay is on';
                }else{
                    autoPlay.title = 'Autoplay is off';
                }

            });

            mainvideo.addEventListener('ended',()=>{
                if(autoPlay.classList.contains('active')){
                    playVideo();
                }else{
                    play_pause.innerHTML = 'replay';
                    play_pause.title = 'Replay';
                }

            });

            //picture-in-picture
            pip.addEventListener('click',()=>{
                mainvideo.requestPictureInPicture();
            });
            function openFullscreen(elem) {
                if (elem.requestFullscreen) {
                  elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                  elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                  elem.msRequestFullscreen();
                }
            }
            function closeFullscreen() {
                if (document.exitFullscreen) {
                  document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                  document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                  document.msExitFullscreen();
                }
              }
            //fullscreen
            fullscreen.addEventListener('click',()=>{
                if(!container.classList.contains('openFullScreen')){
                    container.classList.add('openFullScreen');
                    fullscreen.innerHTML = 'fullscreen_exit';
                    openFullscreen(container);
                }else{
                    container.classList.remove('openFullScreen');
                    fullscreen.innerHTML = 'fullscreen';
                    closeFullscreen(container);
                }
            });
            // Open Settings
            settingsBtn.addEventListener('click',()=>{
                settings.classList.toggle('active');
                settingsBtn.classList.toggle('active');
                if(captionsBtn.classList.contains('active')||captionsBtn.classList.contains('active')){
                    captionsBtn.classList.remove('active');
                    captions.classList.remove('active');
                }
            });
            captionsBtn.addEventListener('click',()=>{
                if(!captionsBtn.hasAttribute('disabled')){
                    captions.classList.toggle('active');
                    captionsBtn.classList.toggle('active');
                    if(settings.classList.contains('active')||settingsBtn.classList.contains('active')){
                        settings.classList.remove('active');
                        settingsBtn.classList.remove('active');
                    }
                }
            });

            playback.forEach((event)=>{
                event.addEventListener('click',(e)=>{
                    removeActiveClass(playback);
                    event.classList.add('active');
                    const speed = event.getAttribute('data-speed');
                    mainvideo.playbackRate = speed;
                });
            });

            caption_tracks.forEach((event)=>{
                event.addEventListener('click',(e)=>{
                    removeActiveClass(caption_tracks);
                    event.classList.add('active');
                    const track = event.getAttribute('data-track');
                    changeCaptions(event);
                    caption_text.innerHTML = '';
                });
            });

            function removeActiveClass(e){
                e.forEach((event)=>{
                    event.classList.remove('active');
                });
            }
            let track = mainvideo.textTracks
            function changeCaptions(label){
                const trackLabel = label.getAttribute('data-track');
                for(let i=0;i<tracks.length;i++){
                    track[i].mode = 'disabled';
                    if(track[i].label===trackLabel){
                        track[i].mode = 'showing';
                    }
                }
            }

            let caption_text = container.querySelector('.caption_text');
            for(let i=0;i<track.length;i++){
                track[i].addEventListener('cuechange',()=>{
                    if(track[i].mode==='showing'){
                        if (track[i].activeCues[0]) {
                            const span = `<span><mark>${track[i].activeCues[0].text}</mark></span>`;
                            caption_text.innerHTML = span;
                        } else {
                            caption_text.innerHTML = '';
                        }
                    }
                });
            }

            //Store video duration in local path
            window.addEventListener('unload',()=>{
                let setDuration = localStorage.setItem('wsa-video-duration',`${mainvideo.currentTime}`),
                    setSrc = localStorage.setItem('wsa-video-src',`${mainvideo.getAttribute('src')}`);
            });
            window.addEventListener('load',()=>{
                let getDuration = localStorage.getItem('wsa-video-duration'),
                    getSrc = localStorage.getItem('wsa-video-src');
                if(getSrc){
                    mainvideo.src = getSrc;
                    mainvideo.currentTime = getDuration;
                }
            }); 
            mainvideo.addEventListener('contextmenu',(e)=>{
                e.preventDefault();
            });
            //mousemove
            container.addEventListener('mouseenter',()=>{
                controls.classList.add('active');
                if(tracks.length!=0){
                    caption_text.classList.remove('active');
                }
            });
            container.addEventListener('mouseleave',()=>{
                if(container.classList.contains('paused')){
                    if(settingsBtn.classList.contains('active')||
                        captionsBtn.classList.contains('active')){
                        controls.classList.add('active');
                    }else{
                        controls.classList.remove('active');
                        if(tracks.length!=0){
                            caption_text.classList.add('active');
                        }
                    }  
                }else
                    controls.classList.add('active');
            });

            if(container.classList.contains('paused')){
                if(settingsBtn.classList.contains('active')||
                captionsBtn.classList.contains('active')){
                    controls.classList.add('active');
                }else{
                    controls.classList.remove('active');
                    if(tracks.length!=0){
                        caption_text.classList.add('active');
                    }
                }
            }else
                controls.classList.add('active');

            //mobile users
            container.addEventListener('touchstart',()=>{
                controls.classList.add('active');
                setTimeout(()=>{
                    controls.classList.remove('active');
                    if(tracks.length!=0){
                        caption_text.classList.add('active');
                    }
                },8000);
            },{passive: true});

            container.addEventListener('touchmove',()=>{
                if(container.classList.contains('paused')){
                    controls.classList.remove('active');
                    if(tracks.length!=0){
                        caption_text.classList.add('active');
                    }
                }else{
                    controls.classList.add('active');
                }
            },{passive: true});

        });
    });
}else 
    ext.noSupport(buildName);
