import Extensions from "/WebServerAI/assets/AI/js/components/extenstions.js";
import Events from "/WebServerAI/assets/AI/js/components/Events.js";
import { getInfo, HTMLDecoder } from "/WebServerAI/assets/AI/js/components/utils.js";

import Templates from "../../assets/AI/js/components/templates.js";

const url = new URL(import.meta.url),
ext = new Extensions(),
events = new Events(),
buildName = ext.getBuildName(url),
buildID = ext.getBuildID(url),
info = getInfo(buildName);

if(ext.isAllowed(buildName)){
    /**
    * Pricing Tables
    */
    let template_1_plans = {
        free_plan: "Free",free_amount: "Free",free_link:'#',free_description: "Free plan",free_items: [{name: "5 Websites", access:true},{name: "1 User",access: true},{name: "100MB Space/website",access: true},{name:"Continuous Deployment",access:false},{name:"No priority support",access:false}],
        standard_plan: "Standard",standard_amount: "$200",standard_per:'year',standard_per:"year",standard_link:'#',standard_description: "Standard plan",standard_items: [{name:'25 Websites',access:true},{name:'5 Users',access:true},{name: "500MB Space/website",access:true},{name: "Continuous Deployment",access: true},{name:"No priority support",access:false}],
        pro_plan: "Pro",pro_amount: "$500",pro_per:'year',pro_per:"year",pro_link:'#',pro_description: "Pro plan",pro_items: [{name:"Unlimited Websites",access:true},{name:"20 Users",access:true},{name: "10GB Space/website",access:true},{name: "Continuous Deployment",access: true},{name: "Email support",access: true}]
    },
    template_2_plans = {
        free_plan: "Free",free_amount: "Free",free_link:'#',free_description: "Free plan",free_items: [{name: "5 Websites", access:true},{name: "1 User",access: true},{name: "100MB Space/website",access: true},{name:"Continuous Deployment",access:false},{name:"No priority support",access:false}],
        pro_plan: "Pro",pro_amount: "$500",pro_per:'year',pro_per:"year",pro_link:'#',pro_description: "Pro plan",pro_items: [{name:"Unlimited Websites",access:true},{name:"20 Users",access:true},{name: "10GB Space/website",access:true},{name: "Continuous Deployment",access: true},{name: "Email support",access: true}],
        enterprise_plan:'Enterprise',enterprise_amount:'Contact us',enterprise_link:'#',enterprise_items:[{name:'Unlimited Websites',access:true},{name:"Unlimited Users", access:true},{name:'Unlimited Users',access:true},{name:'Unlimited Space/website',access:true},{name:'Continuous Deployment',access:true},{name:'24/7 Email Support',access:true}]
    },
    template_3_plans={
        plans:[{name:'Basic'},{name:'Standard'},{name:'Premium'},{name:'Managed'}],
        plan_infos:[{label:''}]
    };
    events.submit((e)=>{
        e = HTMLDecoder(e);
        // START TEMPLATE //

        //Free plan
        events.cmdLine(/set.*?free( plan)? to \"(.*?)\"/i,e,(freePlan)=>{
            if(freePlan){
                if(freePlan[2]){
                    template_1_plans['free_plan'] = freePlan[2];
                    template_2_plans['free_plan'] = freePlan[2];
                }
            }
        });
        events.cmdLine(/set.*?free( plan)? amount to \"(\$[\d]+(\.[\d]{1,2})?)\"/i,e,(freePlan)=>{
            if(freePlan){
                if(freePlan[2]){
                    template_1_plans['free_amount'] = freePlan[2];
                    template_2_plans['free_amount'] = freePlan[2];
                }
            }
        });
        events.cmdLine(/set.*?free( plan)? description \"(.*?)\"/i,e,(freePlan)=>{
            if(freePlan){
                if(freePlan[2]){
                    template_1_plans['free_description'] = freePlan[2];
                    template_2_plans['free_description'] = freePlan[2];
                }
            }
        });
        events.cmdLine(/set.*?free( plan)? link \"(.*?)\"/i,e,(freePlan)=>{
            if(freePlan){
                if(freePlan[2]){
                    template_1_plans['free_link'] = freePlan[2];
                    template_2_plans['free_link'] = freePlan[2];
                }
            }
        });
        events.cmdLine(/set.*?free( plan)? details to \"(.*?)\"/i,e,(freePlan)=>{
            if(freePlan){
                if(freePlan[2]){
                    template_1_plans['free_items'] = [];
                    template_2_plans['free_items'] = [];
                    const newSplit = freePlan[2].split(/\\,/g);
                    for(let i=0;i<newSplit.length;i++){
                        let nn = newSplit[i].split('and is') 
                        nn[1] = nn[1].replace(/not checked|not active/,'x');
                        nn[1] = nn[1].replace(/checked|active/,true);
                        template_1_plans['free_items'].push({name:nn[0].trim(),access:nn[1].trim()})
                        template_2_plans['free_items'].push({name:nn[0].trim(),access:nn[1].trim()})
                    }
                }
            }
        });

        //Standard Plan
        events.cmdLine(/set.*?standard( plan)? to \"(.*?)\"/i,e,(standardPlan)=>{
            if(standardPlan){
                if(standardPlan[2]){
                    template_1_plans['standard_plan'] = standardPlan[2];
                }
            }
        });
        events.cmdLine(/set.*?standard( plan)? amount to \"(\$[\d]+(\.[\d]{1,2})?)\"( per (year|month))?/i,e,(standardPlan)=>{
            if(standardPlan){
                if(standardPlan[2]){
                    template_1_plans['standard_amount'] = standardPlan[2];
                }
                if(standardPlan[5]){
                    template_1_plans['standard_per'] = standardPlan[5];
                }
            }
        });
        events.cmdLine(/set.*?standard( plan)? link \"(.*?)\"/i,e,(standardPlan)=>{
            if(standardPlan){
                if(standardPlan[2]){
                    template_1_plans['standard_link'] = standardPlan[2];
                }
            }
        });
        events.cmdLine(/set.*?standard( plan)? description \"(.*?)\"/i,e,(standardPlan)=>{
            if(standardPlan){
                if(standardPlan[2]){
                    template_1_plans['standard_description'] = standardPlan[2];
                }
            }
        });
        events.cmdLine(/set.*?standard( plan)? details to \"(.*?)\"/i,e,(standardPlan)=>{
            if(standardPlan){
                if(standardPlan[2]){
                    template_1_plans['standard_items'] = [];
                    const newSplit = standardPlan[2].split(/\\,/g);
                    for(let i=0;i<newSplit.length;i++){
                        let nn = newSplit[i].split('and is') 
                        nn[1] = nn[1].replace(/not checked|not active/,'x');
                        nn[1] = nn[1].replace(/checked|active/,true);
                        template_1_2_plans['standard_items'].push({name:nn[0].trim(),access:nn[1].trim()})
                    }
                }
            }
        });
        //Pro plan
        events.cmdLine(/set.*?pro( plan)? to \"(.*?)\"/i,e,(proPlan)=>{
            if(proPlan){
                if(proPlan[2]){
                    template_1_plans['pro_plan'] = proPlan[2];
                    template_2_plans['pro_plan'] = proPlan[2];
                }
            }
        });
        events.cmdLine(/set.*?pro( plan)? amount to \"(\$[\d]+(\.[\d]{1,2})?)\"( per (year|month))?/i,e,(proPlan)=>{
            if(proPlan){
                if(proPlan[2]){
                    template_1_plans['pro_amount'] = proPlan[2];
                    template_2_plans['pro_amount'] = proPlan[2];
                }
                if(proPlan[5]){
                    template_1_plans['pro_per'] = proPlan[5];
                    template_2_plans['pro_per'] = proPlan[5];
                }
            }
        });
        events.cmdLine(/set.*?pro( plan)? description \"(.*?)\"/i,e,(proPlan)=>{
            if(proPlan){
                if(proPlan[2]){
                    template_1_plans['pro_description'] = proPlan[2];
                    template_2_plans['pro_description'] = proPlan[2];
                }
            }
        });

        events.cmdLine(/set.*?standard( plan)? link \"(.*?)\"/i,e,(proPlan)=>{
            if(proPlan){
                if(proPlan[2]){
                    template_1_plans['pro_link'] = proPlan[2];
                    template_2_plans['pro_link'] = proPlan[2];
                }
            }
        });

        events.cmdLine(/set.*?pro( plan)? details to \"(.*?)\"/i,e,(proPlan)=>{
            if(proPlan){
                if(proPlan[2]){
                    template_1_plans['pro_items'] = [];
                    template_2_plans['pro_items'] = [];
                    const newSplit = proPlan[2].split(/\\,/g);
                    for(let i=0;i<newSplit.length;i++){
                        let nn = newSplit[i].split('and is') 
                        nn[1] = nn[1].replace(/not checked|not active/,'x');
                        nn[1] = nn[1].replace(/checked|active/,true);
                        template_1_plans['pro_items'].push({name:nn[0].trim(),access:nn[1].trim()})
                        template_2_plans['pro_items'].push({name:nn[0].trim(),access:nn[1].trim()})
                    }
                }
            }
        });

         //Enterprise plan
         events.cmdLine(/set.*?enterprise( plan)? to \"(.*?)\"/i,e,(enterprisePlan)=>{
            if(enterprisePlan){
                if(enterprisePlan[2]){
                    template_2_plans['enterprise_plan'] = enterprisePlan[2];
                }
            }
        });

        events.cmdLine(/set.*?enterprise( plan)? link \"(.*?)\"/i,e,(enterprisePlan)=>{
            if(enterprisePlan){
                if(enterprisePlan[2]){
                    template_2_plans['enterprise_link'] = enterprisePlan[2];
                }
            }
        });

        events.cmdLine(/set.*?enterprise( plan)? details to \"(.*?)\"/i,e,(enterprisePlan)=>{
            if(enterprisePlan){
                if(enterprisePlan[2]){
                    template_2_plans['enterprise_items'] = [];
                    const newSplit = enterprisePlan[2].split(/\\,/g);
                    for(let i=0;i<newSplit.length;i++){
                        let nn = newSplit[i].split('and is') 
                        nn[1] = nn[1].replace(/not checked|not active/,'x');
                        nn[1] = nn[1].replace(/checked|active/,true);
                        template_2_plans['enterprise_items'].push({name:nn[0].trim(),access:nn[1].trim()})
                    }
                }
            }
        });
        // END TEMPLATES //
    });
    function caseTemplate(num){
        let templateVar = null;
        switch(num){
            case 1:
            case 2:
                templateVar = template_1_2_plans;
            break;
            case 3:
                templateVar = template_3_plans;
            break;
        }
        return templateVar;
    }
    window.addEventListener('wsa-build',(e)=>{
        events.cmdLine(/create(.*?)\"pricing table\"(.*?)template ([\d]+)/i,events.get(e,'input'),(v)=>{
            setTimeout(()=>{
                if(v){
                    const templates = new Templates('/WebServerAI/build/'+buildName+'/templates/pricing'+v[3]+'.html','/WebServerAI/build/'+buildName+'/pricing-table.html',caseTemplate(v[3]));
                    ext.saveTemplate(buildName,templates.render());
                    ext.loadTemplate(buildName);
                }
            },100);
        });
        events.cmdLine(/(create(.*?)\"data table\"(.*?)(labels|headers)(.*?)\"(.*?)\"(.*?)(cells|datasets)(.*?)\"(.*?)\")((( and is|,|;|\.( )?Make it)(.*?)hoverable( and stripped)?)|(( and is|,|;|\.( )?Make it) stripped( and hoverable)?))?/gi,events.get(e,'input'),(o)=>{
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
        ext.update(buildName); 
    });
}else 
    ext.noSupport(buildName);