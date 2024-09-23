<?php
    namespace WebServerAI\Trainee;
    /**
     * A pre-trainning class that you can extend to the learning.
     * @author XHiddenProjects
     * @version 0.0.6
     * @copyright 2024 XHiddenProjects
     */    
    class Trainee{
        private $trainee, $current; 
        public function __construct() {
            $this->trainee = array();
        }
        /**
         * Add a learning element to the AI
         * @param string $lookup Keyword to look for
         * @param string $replace What to replace with
         * @param bool $opened [Optional] - Dictates if the replacement is a _open tag_/_close tag_
         */
        public function __learn(string $lookup,string $replace, bool $opened=true){
            $this->trainee[$lookup] = ($opened ? '{'.$replace.'_' : '_'.$replace.'}');
            $this->current = $lookup;
        }
        /**
         * Removes a learned element
         *
         * @param string $lookup A lookup to unlearn
         * @return bool
         */
        public function __unlearn(string $lookup):bool{
            $out=false;
            if(isset($this->trainee[$lookup])){
                unset($this->trainee[$lookup]);
                $out = true;
            }
            return $out;
        }
        /**
         * Creates allies to the current learning sections
         *
         * @param string|string[] $allies List of allies to go with the current learner.
         * @return void
         */
        public function __allies(string|array $allies):void{
            if($this->current){
                if(is_array($allies)){
                    foreach($allies as $ally){
                        $this->trainee[$ally] = $this->trainee[$this->current];
                    }
                }else{
                    $this->trainee[$allies] = $this->trainee[$this->current];
                }
            }
        }
        /**
         * Checks for command in the array
         *
         * @param string $str String to search for
         * @return bool TRUE if the keyword is found, otherwise FALSE
         */
        public function __matches(string $str):bool{
            if(isset($this->trainee[$str]))
                return true;
            else
                return false;
        }
        /**
         * Replaces the key word to the correct replacement
         * @param string $str Keyword to replace
         * @return string The replacement
         */
        public function __replace(string $str){
            $out=$str;
            if(isset($this->trainee[$str])){
                switch($str){
                    case $this->trainee[$str]:
                        $out = $this->trainee[$str];
                    break;
                }
            }
            return $out;
        }
    }
?>