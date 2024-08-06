// Import "Extensions" from extension.js to allow usages
import Extensions from "/WebServerAI/assets/AI/js/components/extenstions.js";
import Events from "/WebServerAI/assets/AI/js/components/Events.js";
import {VIDEO_PATH, SUBTITLE_PATH, DS, getInfo, HTMLDecoder} from "/WebServerAI/assets/AI/js/components/utils.js";
import {shortcutJS} from "/WebServerAI/assets/AI/js/components/shortcut.min.js";
// START LOAD-UP (Required)
const url = new URL(import.meta.url),
ext = new Extensions(),
events = new Events(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url);
ext.saveTemplate(buildName,ext.parse(buildName));
const sc = new shortcutJS();

const info = getInfo(buildName);

if(ext.isAllowed(buildName)){

    // STYLING VIDEO-PLAYER

    events.submit((e)=>{
        e = HTMLDecoder(e);
        events.cmdLine(/update "(.*?)" progress (bar )?color to "(.*?)"/,e,(progressColor)=>{
            if(progressColor){
                const elem = document.querySelector(progressColor[1]),
                color = progressColor[3];
                if(elem){
                    elem.style.setProperty('--video-player-progress',color);
                }
            }
        });
    });

    // END STYLING

    // END LOAD-UP
    //USE "wsa-build" to trigger on build-submit
    window.addEventListener('wsa-build',(e)=>{
        // Your code goes in here
        var secureURL, thumbnails = [];
        const v = ext.update(buildName);
   

        const subtitles = events.cmdLine(/subtitles?.*?\"(.*?)\" and label it as \"(.*?)\"/g,events.get(e,'input')),
            lang = events.request('/WebServerAI/data/languagesData.json',true);

            // Play video
            function playVideo(c){
                c.querySelector('.play_pause').innerHTML = 'pause';
                c.querySelector('.play_pause').title = info['pause'];
                c.classList.add('paused');
                c.querySelector('video').play();
            }

            // Pause video
            function pauseVideo(c){
                c.querySelector('.play_pause').innerHTML = 'play_arrow';
                c.querySelector('.play_pause').title = info['play'];
                c.classList.remove('paused');
                c.querySelector('video').pause();
            }
            
            function removeActiveClass(e){
                e.forEach((event)=>{
                    event.classList.remove('active');
                });
            }

            //video thumbnails
    var thumbnailLoaded=()=>{
        var thumbnailWidth = 158,
        thumbnailHeight = 90,
        horizontalItemCount = 5,
        verticalItemCount = 5,
        preview_video = document.createElement('video');
    preview_video.preload = 'metadata';
    preview_video.width = "500";
    preview_video.height = "300";
    preview_video.controls = true;
    preview_video.src = document.querySelector('#'+buildName+'_'+v+' .video-container video source').src;
    preview_video.addEventListener('loadeddata', async ()=>{            
        preview_video.pause();
        var count = 1,
            id = 1,
            x = 0, y = 0,
            array = [],
            duration = parseInt(preview_video.duration);

                    for (var i = 1; i <= duration; i++) {
                        array.push(i);
                    }
                    var canvas, i, j;
                    for (i = 0, j = array.length; i < j; i += horizontalItemCount) {
                        //
                        for (var startIndex of array.slice(i, i + horizontalItemCount)) {
                            //
                            var backgroundPositionX = x * thumbnailWidth,
                                backgroundPositionY = y * thumbnailHeight,
                                item = thumbnails.find(x => x.id === id);
                            if (!item) {
                                canvas = document.createElement('canvas');
                                canvas.width = thumbnailWidth * horizontalItemCount;
                                canvas.height = thumbnailHeight * verticalItemCount;
                                thumbnails.push({
                                    id: id,
                                    canvas: canvas,
                                    sec: [{
                                        index: startIndex,
                                        backgroundPositionX: -backgroundPositionX,
                                        backgroundPositionY: -backgroundPositionY
                                    }]
                                });
                            } else {
                                canvas = item.canvas;
                                item.sec.push({
                                    index: startIndex,
                                    backgroundPositionX: -backgroundPositionX,
                                    backgroundPositionY: -backgroundPositionY
                                });
                            }
                            var context = canvas.getContext('2d');
                            preview_video.currentTime = startIndex;
                            await new Promise(function(resolve) {
                                var event = function() {
                                    context.drawImage(preview_video, backgroundPositionX, backgroundPositionY, 
                                        thumbnailWidth, thumbnailHeight);
                                    x++;
                                    // removing duplicate events
                                    preview_video.removeEventListener('canplay', event);
                                    resolve();
                                };
                                preview_video.addEventListener('canplay', event);
                            });
                            // 1 thumbnail is generated completely
                            count++;
                        }
                        // reset x coordinate
                        x = 0;
                        // increase y coordinate
                        y++;
                        // checking for overflow
                        if (count > horizontalItemCount * verticalItemCount) {
                            count = 1;
                            x = 0;
                            y = 0;
                            id++;
                        }
                    }
                    // looping through thumbnail list to update thumbnail
                    thumbnails.forEach(function(item) {
                        // converting canvas to blob to get short url
                        item.canvas.toBlob(blob => item.data = URL.createObjectURL(blob), 'image/jpeg');

                        // deleting unused property
                        delete item.canvas;
                    });
                    console.log('done...');
                });     
    },
    qualitySelector = ()=>{
        const quality_ul = document.querySelector('#'+buildName+'_'+v+' .video-container').querySelector('.video-settings > [data-label="quality"] ul'),
                    qualities = document.querySelector('#'+buildName+'_'+v+' .video-container').querySelectorAll('source[size]');

                qualities.forEach((event)=>{
                    let quality_html = `<li data-quality="${event.getAttribute('size')}">${event.getAttribute('size')}p</li>`;
                    quality_ul.insertAdjacentHTML('afterbegin',quality_html);
                });

                const quality_li = document.querySelector('#'+buildName+'_'+v+' .video-container').querySelectorAll('.video-settings > [data-label="quality"] ul > li');
                
                quality_li.forEach((event)=>{
                    event.addEventListener('click',(e)=>{
                        const quality = event.getAttribute('data-quality');
                        removeActiveClass(quality_li);
                        event.classList.add('active');
                        qualities.forEach((event)=>{ 
                            if(event.getAttribute('size')== quality){
                                const video_current_duration = document.querySelector('#'+buildName+'_'+v+' .video-container video').currentTime,
                                    video_source = event.getAttribute('src');
                                    document.querySelector('#'+buildName+'_'+v+' .video-container video').src = video_source;
                                    document.querySelector('#'+buildName+'_'+v+' .video-container video').currentTime = video_current_duration;
                                playVideo(document.querySelector('#'+buildName+'_'+v+' .video-container'));
                            }
                        });
                    });
                });
    };

        events.cmdLine(/new.*?source.*?\"(.*?)\"( and set quality to \"(.*?)\")?/g,events.get(e,'input'),(c)=>{
            var useFirstVideo = 0;
            if(c){
                c.forEach((e)=>{
                    const list = events.statement(e,false),
                        sendURL = (list[0].match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/) ? list[0] : VIDEO_PATH+DS+list[0]),
                    xhr = new XMLHttpRequest(),
                    source = document.createElement('source');
                    xhr.open("GET",sendURL);
                    xhr.responseType = 'arraybuffer';
                    xhr.onload = ()=>{
                        const blob = new Blob([xhr.response]),
                        url = URL.createObjectURL(blob);
                        source.src = url;
                        (list[1] ? source.setAttribute('size',list[1]) : '');
                        source.type = 'video/mp4';
                        if(useFirstVideo==0)
                            document.querySelector('#'+buildName+'_'+v+' .video-container video').src = document.querySelectorAll('#'+buildName+'_'+v+' .video-container video source')[0].src;
                        if(useFirstVideo>=c.length-1){
                            thumbnailLoaded();
                            qualitySelector();
                        }
                        useFirstVideo++;
                    };
                    xhr.send();
                    document.querySelector('#'+buildName+'_'+v+' .video-container video').appendChild(source);
                });
            }
        });
        if(document.querySelector('#'+buildName+'_'+v+' .video-container video'))
            document.querySelector('#'+buildName+'_'+v+' .video-container video').preload = 'metadata';
        if(subtitles){
            subtitles.forEach((s)=>{
                const st = events.statement(s,false),
                t = document.createElement('track');
                t.label = st[1];
                t.src = (st[0].match(/^(https?:\/\/)([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/) ? st[0] : SUBTITLE_PATH+DS+st[0]);
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
            settingsHome = elem.querySelectorAll('[data-label="video-settingsHome"] > ul > li'),
            playback = elem.querySelectorAll('.video-playback li'),
            bufferedBar = elem.querySelector('.buffered-progress-bar'),
            captionsBtn = elem.querySelector('.captionsBtn'),
            captions = elem.querySelector('.video-captions'),
            caption_labels = elem.querySelector('.video-captions ul'),
            tracks = elem.querySelectorAll('track'),
            thumbnail = elem.querySelector('.video-thumbnail'),
            spinner = elem.querySelector('.spinner');
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
              
            


            play_pause.addEventListener('click',()=>{
                const isVideoPaused = container.classList.contains('paused');
                isVideoPaused ?  pauseVideo(container) : playVideo(container);
            });

            mainvideo.addEventListener('play',()=>{
                playVideo(container);
            });
            mainvideo.addEventListener('pause',()=>{
                pauseVideo(container);
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
                const progressWidth = (cur/e.target.duration)*100 + 0.5;
                progress_Bar.style.width = `${progressWidth}%`
            });

            progressArea.addEventListener('mousedown',(e)=>{
                setTimeLinePos(e);
                progressArea.addEventListener('pointermove',setTimeLinePos);
                progressArea.addEventListener('pointerup',()=>{
                    progressArea.removeEventListener('pointermove',setTimeLinePos);
                });
            });

            //Prgress slider
            function setTimeLinePos(e) {
                const dur = mainvideo.duration,
                progressWithval = progressArea.clientWidth,
                clickOffset = e.offsetX;
                mainvideo.currentTime = (clickOffset/progressWithval)*dur;

                const progressWidth = (mainvideo.currentTime/e.target.duration)*100 + 0.5;
                progress_Bar.style.width = `${progressWidth}%`;

                const cur = mainvideo.currentTime;
                current.innerHTML = sec2time(cur);
            }


            //Wait for video play

            mainvideo.addEventListener('waiting',()=>{
                spinner.style.display = 'block';
            });

            mainvideo.addEventListener('canplay',()=>{
                spinner.style.display = 'none';
            });

            //Move time based on mouse movement
            progressArea.addEventListener('mousemove',(e)=>{
                let progressWithval = progressArea.clientWidth,
                    x = e.offsetX,
                    dur = mainvideo.duration,
                    progressTime = Math.floor((x/progressWithval)*dur);
                    if(progressTime>=0){
                        progressTimeArea.style.setProperty('--x',`${x}px`);
                        progressTimeArea.style.display = 'block';
                        
                        if(x>=progressWithval - 80){
                            x = progressWithval - 80;
                        }else if(x<=75){
                            x = 75;
                        }else{
                            x = e.offsetX;
                        }

                        progressTimeArea.innerHTML = sec2time(progressTime);

                        thumbnail.style.setProperty('--x',`${x}px`);
                        thumbnail.style.display = 'block';

                        for (var item of thumbnails) {
                            //
                            var data = item.sec.find(x1 => x1.index === Math.floor(progressTime));
            
                            // thumbnail found
                            if (data) {
                                if(item.data !== undefined){
                                    thumbnail.setAttribute('style',`background-image: url(${item.data});
                                        background-position-x: ${data.backgroundPositionX}px;background-position-y: ${data.backgroundPositionY}px;
                                        --x: ${x}px;display: block;`);
                                    // exit
                                    return;
                                }
                            }
                        }
                    }

            });

            progressArea.addEventListener('mouseleave',()=>{
                thumbnail.style.display = 'none';
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

            const settingsDivs = container.querySelectorAll('.video-settings > div'),
                settingsBack = container.querySelectorAll('.video-settings > div .back_arrow');

            settingsBack.forEach((event)=>{
                event.addEventListener('click',(e)=>{
                    const setting_label = e.target.getAttribute('data-label');
                    for (let i = 0; i < settingsDivs.length; i++) {
                        if(settingsDivs[i].getAttribute('data-label')===setting_label)
                            settingsDivs[i].removeAttribute('hidden');
                        else
                            settingsDivs[i].setAttribute('hidden','');
                    }
                });
            });
            
            settingsHome.forEach((event)=>{
                event.addEventListener('click',(e)=>{
                    const setting_label = e.target.getAttribute('data-label');
                    for (let i = 0; i < settingsDivs.length; i++) {
                        if(settingsDivs[i].getAttribute('data-label')===setting_label)
                            settingsDivs[i].removeAttribute('hidden');
                        else
                            settingsDivs[i].setAttribute('hidden','');
                    }
                });
            });

            

           

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
                    mainvideo.querySelector('source').src = getSrc;
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