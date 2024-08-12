import Extensions from "/WebServerAI/assets/AI/js/components/extenstions.js";
import Events from "/WebServerAI/assets/AI/js/components/Events.js";
import {getInfo} from "/WebServerAI/assets/AI/js/components/utils.js";

const url = new URL(import.meta.url),
ext = new Extensions(),
events = new Events(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url),
info = getInfo(buildName);
//ext.saveTemplate(buildName,ext.parse(buildName));

if(ext.isAllowed(buildName)){
    window.addEventListener('wsa-build',(e)=>{
        events.cmdLine(/(create(.*?)\"data tables?\"(.*?)(labels|headers)(.*?)\"(.*?)\"(.*?)(cells|datasets)(.*?)\"(.*?)\")((( and is|,|;|\.( )?Make it)(.*?)hoverable( and stripped)?)|(( and is|,|;|\.( )?Make it) stripped( and hoverable)?))?/gi,events.get(e,'input'),(o)=>{
            if(o){
                for(let i=0;i<o.length;i++){
                    const table = document.createElement('table'),
                    thead = document.createElement('thead'),
                    tbody = document.createElement('tbody'),
                    target = document.querySelector('.wpa-build-tables:not(:has(.tables))'),
                    headers = events.statement(o[i],false)[1],
                    cells = events.statement(o[i],false)[2],
                    hSplit = headers.split(/(?<!\\),/g).map((e)=>{return e.replace(/^ /,'')}),
                    cSplit = cells.split(/(?<!\\),/g).map((e)=>{return e.replace(/^ /,'')}),
                    setCells = [];
                    table.className = 'tables tables-data';
                    if(o[i].match('stripped'))
                        table.className+=' tables-stripped'+(o[i].match('odd') ? '-odd' : '-even');
                    if(o[i].match('hoverable'))
                        table.className+=' tables-hoverable';
                    if(headers===''){
                        console.error(info['tableInvalidInfo']);
                        break;
                    }else{
                        const tr = document.createElement('tr');
                        for(let h=0;h<hSplit.length;h++){
                            const th = document.createElement('th');
                            th.innerText = hSplit[h];
                            tr.appendChild(th);
                        }
                        thead.appendChild(tr);

                        for(let c=0;c<cSplit.length;c+=hSplit.length){
                            setCells.push(cSplit.slice(c,c+hSplit.length));
                        } 

                        for(let n=0;n<setCells.length;n++){
                            const tr = document.createElement('tr');
                            for(let k=0;k<setCells[n].length;k++){
                                const td = document.createElement('td');
                                td.innerText = setCells[n][k];
                                tr.appendChild(td);
                            }
                            tbody.appendChild(tr);
                        }
                    }
                    table.appendChild(thead);
                    table.appendChild(tbody);
                    target.appendChild(table);
                }
               
            }
        }); 
    });
}else 
    ext.noSupport(buildName);