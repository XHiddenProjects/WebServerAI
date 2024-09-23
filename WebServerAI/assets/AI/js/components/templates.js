import Events from "./Events.js";
class Templates{
    constructor(templatePath, outputTemplate, templateData){
        this.path = templatePath;
        this.output = outputTemplate;
        this.template = templateData;
    }
    render(){
        const e = new Events(),
        strify = JSON.stringify({'path':this.path,'outputPath':this.output,'data':this.template});
        e.request(window.location.origin+'/WebServerAI/libs/ai_script_data.php?'+encodeURIComponent('dataname=templateParser&datasets='+strify));
        const template = e.request(window.location.origin+'/WebServerAI/scripts/templatePaser.py');
        return template;
    }
}

export default Templates;