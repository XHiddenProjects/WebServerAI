<?php
namespace WebServerAI;
class Trainer{
    protected string $AIStr;
    public function __construct() {

    }
    public function decodeURI(string $str){
        $str = preg_replace('/&#34;/','"',$str);
        $str = preg_replace('/&#39;/',"'",$str);
        return $str;
    }
    protected function removeGrammar($str){
       return preg_replace('/\.|\,|\;|\:|\?|\!/','',$str);
    }
    public function format(string $str){
        # Reframe keywords
        $str = preg_replace('/multiple choice/i','MultipleChoice',$str);
        $str = preg_replace('/input color|color input/i','InputColor',$str);
        $str = preg_replace('/input date|date input/i','InputDate',$str);
        $str = preg_replace('/input datetime-local|datetime-local input/i','InputDateTimeLocal',$str);
        $str = preg_replace('/input email|email input/i','InputEmail',$str);
        $str = preg_replace('/input file|file input/i','InputFile',$str);
        $str = preg_replace('/input hidden|hidden input/i','InputHidden',$str);
        $str = preg_replace('/input image|input img|image input|img input/i','InputImg',$str);
        $str = preg_replace('/input month|month input/i','InputMonth',$str);
        $str = preg_replace('/input phone number|input telephone|input tel|phone number input|telephone input|tel input/i','InputTel',$str);
        $str = preg_replace('/input number|number input/i','InputNumber',$str);
        $str = preg_replace('/input password|input psw|password input|psw input/i','InputPsw',$str);
        $str = preg_replace('/input range|range input/i','InputRange',$str);
        $str = preg_replace('/input search|search input/i','InputSearch',$str);
        $str = preg_replace('/input time|time input/i','InputTime',$str);
        $str = preg_replace('/input url|url input/i','InputUrl',$str);
        $str = preg_replace('/input week|week input/i','InputWeek',$str);
        $str = preg_replace('/title page/i','TitlePage',$str);
        $str = preg_replace('/bi-directional isolation|bi directional isolation/i','bdi',$str);
        $str = preg_replace('/bi-directional override|bi directional override/i','bdo',$str);
        $str = preg_replace('/line break|break line/i','br',$str);
        $str = preg_replace('/select all/i','selectall',$str);
        $str = preg_replace('/block code|code block/i','CodeBlock',$str);
        $str = preg_replace('/inline code|code inline/i','CodeInline',$str);
        $str = preg_replace('/column group/i','colgroup',$str);
        $str = preg_replace('/data block/i','datablock',$str);
        $str = preg_replace('/data list/i','datalist',$str);
        $str = preg_replace('/delete part/i','del',$str);
        $str = preg_replace('/definition element/i','dfn',$str);
        $str = preg_replace('/description list/i','dl',$str);
        $str = preg_replace('/description term/i','dt',$str);
        # Quotations/Apostrophe
        $str = preg_replace('/\\\"/','\\\\qq',$str);
        $str = preg_replace("/\\\'/",'\\\\q',$str);
        $str = preg_replace('/\\\`/','\\\\a',$str);
        $str = preg_split('/\s+(?=(?:(?:[^\'\"`]|[\'\"`][^\'\"`]*[\'\"`])*$))/',$str);
        $AIStr='';
        for($i=0;$i<count($str);$i++){
            switch(strtolower($this->removeGrammar($str[$i]))){
                case 'add':
                case 'added':
                case 'insert':
                    $AIStr .= '{ADD_';
                break;
                case 'remove':
                case 'delete':
                     $AIStr .= '{REMOVE_';
                break;
                case 'build':
                    $AIStr.='{BUILD_';
                break;
                default:break;
            }   
            switch(strtolower($this->removeGrammar($str[$i]))){
                case 'abbr':
                case 'abbreviation':
                    $AIStr.='ABBR}||';
                break;
                case 'address':
                    $AIStr.='ADDRESS}||';
                break;
                case 'area':
                    $AIStr.='AREA}||';
                break;
                case 'article':
                    $AIStr.='ARTICLE}||';
                break;
                case 'aside':
                    $AIStr.='ASIDE}||';
                break;
                case 'audio':
                    $AIStr.='AUDIO}||';
                break;
                case 'base':
                    $AIStr.='BASE}||';
                break;
                case 'bdi':
                    $AIStr.='BDI}||';
                break;
                case 'bdo':
                    $AIStr.='BDO}||';
                break;
                case 'blockquote':
                    $AIStr.='BLOCKQUOTE}||';
                break;
                case 'br':
                case 'break':
                    $AIStr.='BR}||';
                break;
                case 'canvas':
                    $AIStr.='CANVAS}||';
                break;
                case 'caption':
                    $AIStr.='CAPTION}||';
                break;
                case 'codeinline':
                    $AIStr.='CODEINLINE}||';
                break;
                case 'codeblock':
                    $AIStr.='CODEBLOCK}||';
                break;
                case 'col':
                case 'column':
                    $AIStr.='COL}||';
                break;
                case 'colgroup':
                case 'columngroup':
                    $AIStr.='COLGROUP}||';
                break;
                case 'data':
                case 'datablock':
                    $AIStr.='DATABLOCK}||';
                break;
                case 'datalist':
                    $AIStr.='DATALIST}||';
                break;
                case 'dd':
                case 'description':
                    $AIStr.='DD}||';
                break;
                case 'del':
                    $AIStr.='DEL}||';
                break;
                case 'details':
                    $AIStr.='DETAILS}||';
                break;
                case 'dfn':
                    $AIStr.='DFN}||';
                break;
                case 'dialog':
                    $AIStr.='DIALOG}||';
                break;
                case 'div':
                case 'container':
                    $AIStr.='DIV}||';
                break;
                case 'dl':
                    $AIStr.='DL}||';
                break;
                case 'dt':
                    $AIStr.='DT}||';
                break;
                case 'heading':
                    $AIStr.='HEADING}||';
                break;
                case 'header':
                    $AIStr.='HEADER}||';
                break;
                case 'paragraph':
                    $AIStr.='PARAGRAPH}||';
                break;
                case 'titlepage':
                    $AIStr.='TITLEPAGE}||';
                break;
                case 'link':
                case 'hyperlink':
                    $AIStr.='HLINK}||';
                break;
                case 'source':
                    $AIStr.='SOURCE}||';
                break;
                # Form elements
                case 'form':
                    $AIStr.='FORM}||';
                break;
                case 'text':
                    $AIStr.='INPUTTEXT}||';
                break;
                case 'textbox':
                    $AIStr.='INPUTTEXTBOX}||';
                break;
                case 'button':
                    $AIStr.='BUTTON}||';
                break;
                case 'submit':
                    $AIStr.='SUBMIT}||';
                break;
                case 'reset':
                    $AIStr.='RESET}||';
                break;
                case 'checkbox':
                    $AIStr.='CHECKBOX}||';
                break;
                case 'radio':
                case 'multiplechoice':
                    $AIStr.='RADIO}||';
                break;
                case 'inputcolor':
                    $AIStr.='INPUTCOLOR}||';
                break;
                case 'inputdate':
                    $AIStr.='INPUTDATE}||';
                break;
                case 'inputdatetimelocal':
                    $AIStr.='INPUTDATETIMELOCAL}||';
                break;
                case 'inputemail':
                    $AIStr.='INPUTEMAIL}||';
                break;
                case 'inputfile':
                case 'upload':
                    $AIStr.='INPUTFILE}||';
                break;
                case 'inputhidden':
                    $AIStr.='INPUTHIDDEN}||';
                break;
                case 'inputimg':
                    $AIStr.='INPUTIMG}||';
                break;
                case 'inputmonth':
                    $AIStr.='INPUTMONTH}||';
                break;
                case 'inputnumber':
                    $AIStr.='INPUTNUMBER}||';
                break;
                case 'inputpsw':
                    $AIStr.='INPUTPSW}||';
                break;
                case 'inputrange':
                    $AIStr.='INPUTRANGE}||';
                break;
                case 'inputsearch':
                    $AIStr.='INPUTSEARCH}||';
                break;
                case 'inputtel':
                    $AIStr.='INPUTTEL}||';
                break;
                case 'inputtime':
                    $AIStr.='INPUTTIME}||';
                break;
                case 'inputurl':
                    $AIStr.='INPUTURL}||';
                break;
                case 'inputweek':
                    $AIStr.='INPUTWEEK}||';
                break;

                default:break;
            }
            switch(strtolower($this->removeGrammar($str[$i]))){
                case 'select':
                    $AIStr.='{QUERY_';
                break;
                case 'selectall':
                    $AIStr.='{QUERYALL_';
                break;
                case 'size':
                    $AIStr.='{SIZE_';
                break;
                case 'class':
                case 'classname':
                    $AIStr.='{CLASS_';
                break;
                case 'id':
                    $AIStr.='{ID_';
                break;
                case 'name':
                    $AIStr.='{NAME_';
                break;
                case 'value':
                case 'val':
                    $AIStr.='{VALUE_';
                break;
                #attributes
                case 'url':
                case 'href':
                case 'goes':
                case 'redirects':
                case 'locates':
                    $AIStr.='{HURL_';
                break;
                case 'target':
                case 'targets':
                case 'opens':
                    $AIStr.='{TARGET_';
                break;
                case 'title':
                    $AIStr.='{TITLE_';
                break;
                case 'dir':
                case 'direction':
                    $AIStr.='{DIR_';
                break;
                case 'cite':
                case 'citation':
                    $AIStr.='{CITE_';
                break;
                case 'src':
                    $AIStr.='{SRC_';
                break;
                case 'controls':
                    $AIStr.='{CONTROLS}||';
                break;
                case 'inside':
                case 'located':
                    $AIStr.='{LOCATION_';
                break;
                case 'shape':
                    $AIStr.='{SHAPE_';
                break;
                case 'coords':
                case 'coordinates':
                    $AIStr.='{COORDS_';
                break;
                case 'alt':
                    $AIStr.='{ALT_';
                break;
                case 'type':
                    $AIStr.='{TYPE_';
                break;
                case 'open':
                case 'opened':
                    $AIStr.='{OPEN}||';
                break;
                # form
                case 'required':
                    $AIStr.='{REQUIRED}||';
                break;
                case 'placeholder':
                    $AIStr.='{PLACEHOLDER_';
                break;
                # CSS
                case 'color':
                    $AIStr.='{COLOR_';
                break;
                case 'bg':
                case 'background':
                    $AIStr.='{BG_';
                break;
                case 'bold':
                    $AIStr.='{BOLD}||';
                break;
                case 'italic':
                    $AIStr.='{ITALIC}||';
                break;
                case 'underline':
                    $AIStr.='{UNDERLINE}||';
                break;
                case 'strikethrough':
                    $AIStr.='{STRIKETHROUGH}||';
                break;
                case 'align':
                    $AIStr.='{ALIGN_';
                break;
                default:break;
            }
            switch(strtolower($str[$i])){
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    $AIStr.=$this->removeGrammar($str[$i]).'}||';
                break;
                default:break;
            }
            switch(strtolower($this->removeGrammar($str[$i]))){
                case 'says':
                    $AIStr.='{TEXT_';
                break;
            }
            if(preg_match('/[\"](.*?)[\"]/',$str[$i])){
                preg_match('/[\"](.*?)[\"]/',$str[$i],$matches);
                $AIStr.=preg_replace('/\\\\a/','`',preg_replace('/\\\\q/',"'",preg_replace('/\\\\qq/','"',preg_replace('/\\\\n/','
',$matches[1])))).'}||';
            }
            
        }
        echo preg_replace('/\|\|$/','',$AIStr);
    }
}
?>