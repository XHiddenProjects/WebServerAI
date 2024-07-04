import {shortcutJS} from '/WebServerAI/assets/AI/js/components/shortcut.min.js';
var shortcuts = {
    'bold':{
        ctrlKey: true,
        keyName: 'b'
    }
}
function loadEditables(sc=null){
    sc = shortcuts
    document.querySelector('body[contenteditable]').addEventListener('keydown',(e)=>{
        const key = e.keyCode||e.which;
    })
}
export {shortcuts, loadEditables};