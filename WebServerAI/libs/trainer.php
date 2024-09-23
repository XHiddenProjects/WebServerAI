<?php
namespace WebServerAI;

use WebServerAI\Dictionary\Dictionary;
use WebServerAI\Settings\Config;
use WebServerAI\Trainee\Trainee;

require_once('ai_dictionary.php');
require_once('ai_config.php');
require_once('ai_trainee.php');
/**
 * ML that compiles and translates to render out the code
 * @author XHiddenProjects
 * @version 0.0.6
 * @copyright 2024 XHiddenProjects
 * @extends WebServerAI\Trainee\Trainee
 */
class Trainer extends Trainee{
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

    protected function fixSpelling(string|array $arr):array{
        $arr = array_map(function($item){
            $c = new Config();
            $configs = $c->get()['AI']['search'];
            if($configs['language']==='auto')
                $configs['language'] = (isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? preg_split('/,/',$_SERVER['HTTP_ACCEPT_LANGUAGE'])[0] : 'en');
            else
                $configs['language'] = $configs;
        
            $spell = new Dictionary($configs['language']);
            if(!$spell->spell_check($item))
                return $spell->spell_correct($item);
            else
                return $item;
        },(is_array($arr) ? $arr : preg_split('/ /',$arr)));
        return $arr;
    }

    public function format(string $str){
        $str = str_replace('
','\\\\n',$str);
       // $str = implode(' ',$this->fixSpelling($str));
        # Reframe keywords
        $str = preg_replace('/multiple choice/i','MultipleChoice',$str);
        $str = preg_replace_callback('/size (of|is) ([\d]+(em|ex|%|px|cm|mm|in|pt|pc|))( ?x ?| ?by ?)([\d]+(em|ex|%|px|cm|mm|in|pt|pc|))/i',function($e){
            return 'width "'.$e[2].'" and height "'.$e[5].'"';
        },$str);
        $str = preg_replace_callback('/image.*?\"(.*?)\"/i',function($e){
            return 'image with src of "'.$e[1].'"';
        },$str);
        $str = preg_replace('/picture of|pic of/i','src',$str);
        $str = preg_replace('/font style|font-style/i','family',$str);
        $str = preg_replace('/alternative text/i','alt',$str);
        $str = preg_replace('/class name/i','classname',$str);
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
        $str = preg_replace('/title page|webpage title/i','TitlePage',$str);
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
        $str = preg_replace('/image caption/i','figcaption',$str);
        $str = preg_replace('/group heading/i','hgroup',$str);
        $str = preg_replace('/horizontal line/i','hr',$str);
        $str = preg_replace('/keyboard input/i','kbd',$str);
        $str = preg_replace('/unordered list/i','ul',$str);
        $str = preg_replace('/ordered list/i','ol',$str);
        $str = preg_replace('/list of|items of/i','list',$str);
        $str = preg_replace('/pixel size/i','pxs',$str);
        $str = preg_replace('/shortcut icon/i','shortcuticon',$str);
        $str = preg_replace('/apple touch icon|apple-touch|mobile icon/i','appletouchicon',$str);
        $str = preg_replace('/main content/i','main',$str);
        $str = preg_replace('/option group/i','optgroup',$str);
        $str = preg_replace('/label block/i','labelblock',$str);
        $str = preg_replace('/progress bar/i','progress',$str);
        $str = preg_replace('/Ruby Fallback Parenthesis/i','rp',$str);
        $str = preg_replace('/Reliable Totally|Relevant Totally|Ruby Text/i','rt',$str);
        $str = preg_replace('/Sample output/i','samp',$str);
        $str = preg_replace('/inline text/i','span',$str);
        $str = preg_replace('/table row/i','tblrow',$str);
        $str = preg_replace('/table header|table header cell/i','tblhead',$str);
        $str = preg_replace('/table cell|table data cell/i','tblcell',$str);
        $str = preg_replace('/([\d]+) rows?/i','$1_tblrows',$str);
        $str = preg_replace('/([\d]+) (columns?|cols?)/i','$1_tblcols',$str);
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
                case 'calculate':
                    $AIStr.='{CALCULATE_';
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
                case 'embed':
                case 'embedded':
                    $AIStr.='EMBED}||';
                break;
                case 'fieldset':
                    $AIStr.='FIELDSET}||';
                break;
                case 'legend':
                    $AIStr.='LEGEND}||';
                break;
                case 'figcaption':
                    $AIStr.='FIGCAPTION}||';
                break;
                case 'figure':
                    $AIStr.='FIGURE}||';
                break;
                case 'footer':
                    $AIStr.='FOOTER}||';
                break;
                case 'iframe':
                    $AIStr.='IFRAME}||';
                break;
                case 'hgroup':
                    $AIStr.='HGROUP}||';
                break;
                case 'hr':
                    $AIStr.='HR}||';
                break;
                case 'ul':
                    $AIStr.='UL}||';
                break;
                case 'ol':
                    $AIStr.='OL}||';
                break;
                case 'icon':
                    $AIStr.='ICON}||';
                break;
                case 'shortcuticon':
                    $AIStr.='SHORTCUTICON}||';
                break;
                case 'appletouchicon':
                    $AIStr.='APPLETOUCHICON}||';
                break;
                case 'main':
                    $AIStr.='MAIN}||';
                break;
                case 'map':
                    $AIStr.='MAP}||';
                break;
                case 'mark':
                    $AIStr.='MARK}||';
                break;
                case 'menu':
                    $AIStr.='MENU}||';
                break;
                case 'meter':
                    $AIStr.='METER}||';
                break;
                case 'optgroup':
                    $AIStr.='OPTGROUP}||';
                break;
                case 'option':
                    $AIStr.='OPTION}||';
                break;
                case 'heading':
                    $AIStr.='HEADING}||';
                break;
                case 'header':
                    $AIStr.='HEADER}||';
                break;
                case 'img':
                case 'image':
                    $AIStr.='IMAGE}||';
                break;
                case 'ruby':
                    $AIStr.='RUBY}||';
                break;
                case 'rt':
                    $AIStr.='RT}||';
                break;
                case 'rp':
                    $AIStr.='RP}||';
                break;
                case 'samp':
                case 'sample':
                    $AIStr.='SAMP}||';
                break;
                case 'section':
                    $AIStr.='SECTION}||';
                break;
                case 'span':
                    $AIStr.='SPAN}||';
                break;
                case 'sub':
                case 'subscript':
                    $AIStr.='SUB}||';
                break;
                case 'sup':
                case 'superscript':
                    $AIStr.='SUB}||';
                break;
                case 'summary':
                    $AIStr.='SUMMARY}||';
                break;
                case 'table':
                    $AIStr.='TABLE}||';
                break;
                case 'tblrow':
                case 'row':
                    $AIStr.='TBLROW}||';
                break;
                case 'tblhead':
                    $AIStr.='TBLHEAD}||';
                break;
                case 'tblcell':
                    $AIStr.='TBLCELL}||';
                break;
                case 'kbd':
                    $AIStr.='KBD}||';
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
                case 'picture':
                    $AIStr.='PICTURE}||';
                break;
                case 'nav':
                case 'navbar':
                case 'navigator':
                    $AIStr.='NAV}||';
                break;
                case 'object':
                    $AIStr.='OBJECT}||';
                break;
                # Form elements
                case 'form':
                    $AIStr.='FORM}||';
                break;
                case 'labelblock':
                    $AIStr.='LABELBLOCK}||';
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
                case 'progress':
                    $AIStr.='PROGRESS}||';
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
                case 'selectbox':
                case 'dropdown':
                    $AIStr.='SELECTBOX}||';
                break;
                case 'output':
                    $AIStr.='OUTPUT}||';
                break;
                default:break;
            } 
            switch(strtolower($this->removeGrammar($str[$i]))){
                case 'select':
                case 'query':
                    $AIStr.='{QUERY_';
                break;
                case 'selectall':
                case 'queryall':
                    $AIStr.='{QUERYALL_';
                break;
                case 'list':
                    $AIStr.='{LIST_';
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
                case 'data':
                    $AIStr.='{DATA_';
                break;
                case 'usemap':
                    $AIStr.='{USEMAP_';
                break;
                #attributes
                case 'url':
                case 'href':
                case 'goes':
                case 'redirects':
                case 'redirect':
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
                case 'label':
                    $AIStr.='{LABEL_';
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
                case 'srcset':
                    $AIStr.='{SRCSET_';
                break;
                case 'media':
                    $AIStr.='{MEDIA_';
                break;
                case 'pxs':
                    $AIStr.='{PXS_';
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
                case 'alternative':
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
                case 'min':
                    $AIStr.='{MIN_';
                break;
                case 'max':
                    $AIStr.='{MAX_';
                break;
                case 'value':
                case 'val':
                    $AIStr.='{VALUE_';
                break;
                case 'for':
                    $AIStr.='{FOR_';
                break;
                case 'contenteditable':
                case 'editable':
                    $AIStr.='{CONTENTEDITABLE}||';
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
                case 'width':
                    $AIStr.='{WIDTH_';
                break;
                case 'height':
                    $AIStr.='{HEIGHT_';
                break;
                case 'family':
                    $AIStr.='{FAMILY_';
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
                case 'saying':
                    $AIStr.='{TEXT_';
                break;
                case 'html':
                    $AIStr.='{HTML_';
                break;
            }
            if($this->__matches($this->removeGrammar($str[$i])))
                $AIStr.=$this->__replace(strtolower($this->removeGrammar($str[$i])));

            if(preg_match('/([\d]+)_(.*?)/',strtolower($this->removeGrammar($str[$i])))){
                preg_match('/([\d]+)_(.*)/',strtolower($this->removeGrammar($str[$i])),$matches);
                if($matches[2]==='tblrows') $rows = (int)$matches[1];
                if($matches[2]==='tblcols'){
                    for($r=0;$r<$rows;$r++){
                        $AIStr.=htmlentities('{HTML_<tr>}||');
                            for($c=0;$c<(int)$matches[1];$c++){
                                $AIStr.=htmlentities('{HTML_<td></td>}||');
                            }
                        $AIStr.=htmlentities('{HTML_</tr>}||');
                    }
                }
            }
            if(preg_match('/[\"](.*?)[\"]/',$str[$i])){ 
                preg_match('/[\"](.*?)[\"]/',$str[$i],$matches);
                $AIStr.=preg_replace('/\\\\a/','`',preg_replace('/\\\\q/',"'",preg_replace('/\\\\qq/','"',preg_replace('/\\\\n/','
',$matches[1])))).'}||';
            }
        }

        $AIStr = preg_replace_callback('/_{/',function(){
            return '_NULL}||{';
        },$AIStr);
        $AIStr = preg_replace_callback('/_$/',function(){
            return '_NULL}';
        },$AIStr);

        $AIStr=preg_replace('/\|\|(?!{)(.*?)}/','{"$1"}||',$AIStr);
        $AIStr=preg_replace('/(}{)/','}||{',$AIStr);
        $AIStr=preg_replace('/\|\|$/','',$AIStr);


        echo preg_replace('/\|\|$/','',$AIStr);
    }
}
?>