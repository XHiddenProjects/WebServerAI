<?php
namespace WebServerAI\Settings;
class Config{
    /**
     * Get Configuration settings
     *
     * @param string|null $path [Optional] - File to get JSON, NULL if kept to _settings.json_
     * 
     * @return array Config Data
     * 
     */
    public function get(string|null $path=null):array{
        $path = ($path===''||$path===null ? dirname(__DIR__).'/data/settings.json' : $path);
        return json_decode(file_get_contents($path),true);
    }
    /**
     * Sets the default timezone
     * @param string $tz TimezoneID
     */
    public function setTimeZone(string $tz):void{
        date_default_timezone_set($tz);
    }
    /**
     * Get the default timezone
     * @return string Timezone ID
     */
    public function getTimeZone():string{
        return date_default_timezone_get();
    }
    /**
     * Saves the configuration of the settings
     * 
     * @param string|null $path File to get JSON data, NULL if kept to _settings.json_
     * @param string $basetarget Get the base key data
     * @param string $value Set the value of the basetarget/subtarget
     * @param string $subtarget [Optional] - Get the subtarget from the base key
     * 
     * @return bool Success/Failed
     */
    public function save(string|null $path, string $basetarget, string $value, string $subtarget=''){
        $path = ($path===''||$path===null ? dirname(__DIR__).'/data/settings.json' : $path);
        $arr = json_decode(file_get_contents($path),true);

        if($subtarget!=='')
            $arr[$basetarget][$subtarget] = $value;
        else
            $arr[$basetarget] = $value;
        $finalize = json_encode($arr,JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
        $open = fopen($path,'w');
        fwrite($open, $finalize);
        return @fclose($open);
    }
}
?>