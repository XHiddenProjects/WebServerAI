import Events from "./Events.js";
import { uniqid } from "./utils.js";
class VoiceType{
    constructor(){
        let e = new Events();
        this.lang = e.request(window.location.origin+'/WebServerAI/data/languages.json?u='+uniqid(),true)['languages'][navigator.language];
    }
    #endRecording(elem){
        elem.classList.add('wsa-mic-muted');
        const icon = elem.querySelector('i');
            icon.classList.remove('fa-microphone');
            icon.classList.add('fa-microphone-slash');        
    }
    /**
     * Gets speeck to text
     * @param {Object} options Settings for the speech recognition
     */
    getTranscript(options={}){
        if (!'SpeechRecognition' in window || !'webkitSpeechRecognition' in window) {
            console.error(this.lang['dictionary'].console.voiceTypeSpeechNotEnabled);
            return;
        }
        if(options.hasOwnProperty('toggleBtn')){
            let x = document.querySelector(options.toggleBtn),
            recognition = (new webkitSpeechRecognition() || new SpeechRecognition());
            recognition.lang = (navigator.language||window.navigator.language);
            recognition.interimResults = true;
            recognition.continuous = true;
            recognition.maxAlternatives = (options.hasOwnProperty('alternatives') ? options['alternatives'] : 1);
            if(x){
                x.addEventListener('click',()=>{
                    x.classList.toggle('wsa-mic-muted');
                    if(!x.classList.contains('wsa-mic-muted')){
                        const icon = x.querySelector('i');
                        icon.classList.remove('fa-microphone-slash');
                        icon.classList.add('fa-microphone');
                        recognition.start();
                    }else{
                        const icon = x.querySelector('i');
                        icon.classList.remove('fa-microphone');
                        icon.classList.add('fa-microphone-slash');
                        recognition.stop();
                    }
                });
                if(options.hasOwnProperty('error')){
                    recognition.addEventListener('error',options['error']);
                    recognition.addEventListener('error',()=>{this.#endRecording(x);});
                }
                if(options.hasOwnProperty('results')){
                    recognition.addEventListener('result',options['results']);
                }else{
                    console.error(this.lang['dictionary'].console.voiceTypeResultsNotFound);
                    return;
                }
                

            }else{
                console.error(this.lang['dictionary'].console.elementNotFound);
                return;
            }
        }else{
            console.error(this.lang['dictionary'].console.voiceTypeToggleNotFound);
            return;
        }
    }
}
export default VoiceType;