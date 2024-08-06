<?php
namespace WebServerAI\Settings;
class Config{
    /**
     * Get Configuration settings
     *
     * @return array Config Data
     * 
     */
    public function get():array{
        $path = dirname(__DIR__).'/data/settings.json';
        return json_decode(file_get_contents($path),true);
    }
}
?>