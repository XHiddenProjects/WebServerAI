<?php
namespace WebServerAI\Dictionary;

use WebServerAI\Settings\Config;
require_once('ai_config.php');

class Dictionary{
    protected $pspell, 
    $autocorrect=TRUE, 
    $api='', 
    $params=array(),
    $ignoreList = array();  
    
    /**
     * Enables the dictionary function by using the __*Wikipedia search API*__.
     *
     * @param string $lang='en' Language for the user to take
     * @param array $params=[] Search parameter
     * @param bool $autocorrect=true Enable autocorrect
     * 
     * @link https://www.mediawiki.org/wiki/API:Search Wikipedia search API
     * 
     * @return void
     */
    public function __construct(String $lang='en', bool $autocorrect=true){
        $this->autocorrect = $autocorrect;
        $this->api='https://'.(strlen($lang)>2 ? substr($lang,0,2) : $lang).'.wikipedia.org/w/api.php';  
    }
    protected function check_word(string $url, array $params):mixed{
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        $response = json_decode(curl_exec($ch), true);
        curl_close($ch);
        return $response;
    }

    protected function filter_specialcharacters($str){
      $str = preg_replace('/[^A-Za-z0-9\s]/','',$str);
      return $str;
    }

    /**
     * Adds a word to the ignore list
     *
     * @param string|string[] $list Add a word/words to the ignore list
     * 
     * @return void
     * 
     */
    public function ignore(string|array $lists){
        if(is_array($lists))
            foreach($lists as $list){
                if(!in_array($list,$this->ignoreList)) array_push($this->ignoreList,strtolower($list));
            }
        else
            array_push($this->ignoreList,strtolower($lists));
    }

    /**
     * Returns the ignore words list
     *
     * @return array List of ignored words
     * 
     */
    public function getIgnoreList():array{
        return $this->ignoreList;
    }

    /**
     * Checks if the word is valid
     *
     * @param string $word Word to check for
     * 
     * @return bool TRUE if the word is real, FALSE if not.
     * 
     */
    public function spell_check(string $word):bool{
        $this->params = array(
            'srsearch'=>$this->filter_specialcharacters($word),
            'action' => 'query',
            'list' => 'search',
            'format' => 'json'
        );
        $response = $this->check_word($this->api,$this->params);
        if((!empty($response['query']['search'][0]['title'])&&strcasecmp($response['query']['search'][0]['title'],$word)==0)||in_array(strtolower($word),$this->ignoreList))
            return true; 
        else
            return false;
    }
    /**
     * Autocorrects the word
     *
     * @param string $word Word to correct
     * 
     * @return string Returns corrected/original word
     * 
     */
    public function spell_correct(string $word):string{
        $this->params = array(
            'srsearch'=>$this->filter_specialcharacters($word),
            'action' => 'query',
            'list' => 'search',
            'format' => 'json'
        );
        $request = $this->check_word($this->api,$this->params);
        if(($this->autocorrect&&(empty($request['query']['search']))&&isset($request['query']['searchinfo']['suggestion']))&&$suggestions = $request['query']['searchinfo']['suggestion']){
            return str_replace($this->params['srsearch'],$suggestions,$word);
        }else
            return $word;
    }

    /**
     * Returns the defination of a word
     *
     * @param string $word Word to lookup
     * @param array<int, string> $summerize [Optional] - Summerizes the defination based on characters/sentences
     * @param bool $toHTML [Optional] - Returns as an HTML format
     * 
     * @return string
     * 
     */
    public function definition(string $word, array $summerize=[0,'chars'], bool $toHTML=false):string{
        $this->params = array(
            'action' => 'query',
            'format' => 'json',
            'prop'=>'extracts',
            'list'=>'',
            'meta'=>'',
            'titles'=>$this->filter_specialcharacters($word),
            'formatversion'=>2,
            'exintro' => true
        );
        if(!empty($summerize)){
            if($summerize[0]!=0&&(isset($summerize[0]))){
                if(!isset($summerize[1]))
                    $summerize[1] = 'chars';
                $summerize = array_filter($summerize,function($args){
                    return trim($args);
                });
                if(preg_match('/chars/',$summerize[1])){
                    if($summerize[0]>=1&&$summerize[0]<=1200)
                        $this->params['exchars'] = $summerize[0];
                }else if(preg_match('/sentences/',$summerize[1])){
                    if($summerize[0]>=1&&$summerize[0]<=10)
                        $this->params['exsentences'] = $summerize[0];
                }
            }
        }
        if(!$toHTML)
            $this->params['explaintext'] = true;
        
        $request = $this->check_word($this->api,$this->params);
        $split = preg_split('/\n\n/',$request['query']['pages'][0]['extract']);
        
        if($toHTML){
            $split = array_map(function($a){
                return preg_replace('/>/','&gt;',preg_replace('/</','&lt;',$a));
            },$split);
            $split = array_filter($split, function($a){
                return preg_match('/(<|&lt;)p(>|&gt;)(.|\n)*(((<|&lt;)\/p(>|&gt;))$)/',$a);
            });
            $split = array_map(function($toHTML){
                return preg_replace('/&gt;/','>',preg_replace('/&lt;/','<',$toHTML));
            },$split);

            $split = array_values($split);
        }
        return $split[0];
    }
}
?>