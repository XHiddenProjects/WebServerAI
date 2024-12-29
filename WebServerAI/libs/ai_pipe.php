<?php
namespace WebServerAI\Pipe;
/**
 * WebServerAI Pipe modals
 */
use WebServerAI\Database\Database;
require_once('ai_database.php');

class Pipe{
    protected $file, $skey, $iv, $url, $name, $algo,$path;
    /**
     * Creates a pipe 
     *
     * @param string $url URL to copy
     * @param string $dest File location where 
     */
    public function __construct(string $url, string $dest) {
        $this->url = $url;
        $path = explode('/',$this->url);
        $this->file = $dest.'/'.$path[count($path)-1];
        $name = explode('/',$this->file);
        $this->name = explode('.',$name[count($name)-1])[0];
        # Gets Users information 
        $data = json_decode(file_get_contents(dirname(__DIR__).'/data/settings.json'),true);
        if(!file_exists(dirname(__DIR__).'/modals')) mkdir(dirname(__DIR__).'/modals',0777,true);

        $tableName = 'modals';
        $f = json_decode(file_get_contents(dirname(__DIR__).'/data/settings.json'),true);
        $db = new Database(dirname(__DIR__).'/db/modals.db',SQLITE3_OPEN_READWRITE|SQLITE3_OPEN_CREATE,($f['User']['password'] ? base64_decode($f['User']['password']) : ''));
        $db->enableExpectations(true);

        $db->createTable($tableName,['id INTEGER PRIMARY KEY NOT NULL','modal_name VARCHAR(50) NOT NULL', 'modal_key text not null', 'modal_iv blob not null', 'modal_accessed TINYINT default 0']);

        $access = json_decode($db->selectData($tableName,['modal_name']),true);
        if(!count($access)>0){
            $passkey = bin2hex(openssl_random_pseudo_bytes(32)); // generates a 32-byte passkey, hex-encoded
            $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('AES-256-CBC'));
            $db->insertData($tableName,['modal_name','modal_key','modal_iv'],[$this->name,$passkey,bin2hex($iv)]);
        }

        $this->copy();
    }
    /**
     * Copies the file from URL to the current destination
     *
     * @return bool
     */
    protected function copy(){
        if(!file_exists($this->file)){

            $ch = curl_init($this->url);
            curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
            curl_setopt($ch,CURLOPT_BINARYTRANSFER,true);
            $response = curl_exec($ch);

            if(curl_errno($ch)){
                echo 'Error: '.curl_error($ch);
                exit;
            }
            $name = explode('/',$this->file);
            $name = explode('.',$name[count($name)-1])[0];
            $path = dirname(__DIR__).'/modals/'.$name.'.wsam';
            if(!file_exists($path)) file_put_contents($path,$response);
            curl_close($ch);
            return true;
        }else return false;
    }
    /**
     * Encrypts file
     *
     * @param string $fname File name to encrypt
     */
    protected function encrypt(string $modal){
        $tableName = 'modals';
        $f = json_decode(file_get_contents(dirname(__DIR__).'/data/settings.json'),true);
        $db = new Database(dirname(__DIR__).'/db/modals.db',SQLITE3_OPEN_READWRITE|SQLITE3_OPEN_CREATE,($f['User']['password'] ? base64_decode($f['User']['password']) : ''));
        $access = json_decode($db->selectData($tableName,'*','WHERE modal_name="'.$modal.'"'),true);
        $this->path = dirname(__DIR__).'/modals/'.$this->name.'.wsam';
        if(file_exists($this->path)&&count($access)>0&&!$access[0]['modal_accessed']){
            $encrypt = openssl_encrypt(file_get_contents($this->path),'AES-256-CBC',$access[0]['modal_key'],OPENSSL_RAW_DATA,hex2bin($access[0]['modal_iv']));
            file_put_contents($this->path,$encrypt);
            $db->updateData($tableName,['modal_accessed'],[1],'WHERE modal_name="'.$modal.'"');
        }
        @unlink(dirname(__DIR__).'/modals/'.$this->name.'.modal');
        return $access;
    }
    /**
     * Decrypts modal file
     * @param string $path File location
     * @param string $key Passphrase
     * @param string $iv IV token
     * 
     * @return string decrypted file
     */
    protected function decrypt(string $modal):string{
        $tableName = 'modals';
        $f = json_decode(file_get_contents(dirname(__DIR__).'/data/settings.json'),true);
        $db = new Database(dirname(__DIR__).'/db/modals.db',SQLITE3_OPEN_READWRITE|SQLITE3_OPEN_CREATE,($f['User']['password'] ? base64_decode($f['User']['password']) : ''));
        $access = json_decode($db->selectData($tableName,'*','WHERE modal_name="'.$modal.'"'),true);
        $this->path = dirname(__DIR__).'/modals/'.$this->name.'.wsam';
        if(file_exists($this->path)&&count($access)>0){
            $decrypt = openssl_decrypt(file_get_contents($this->path),'AES-256-CBC',$access[0]['modal_key'],OPENSSL_RAW_DATA,hex2bin($access[0]['modal_iv']));
            return $decrypt;
        }
        return 'Error: '.json_encode($access,JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);
    }
    /**
     * Deletes the Modal from the folder
     * @param string $modal Modals name
     * 
     * @return boolean
     */
    public function delete(string $modal):bool{
        $path = dirname(__DIR__).'/modals/'.$modal.'.wsam';
        if(@unlink($path)) return true;
        else return false;
    }
    /**
     * Check if modal already exists
     * @param string $modal Modals name
     * 
     * @return boolean
     */
    public function check(string $modal):bool{
        $path = dirname(__DIR__).'/modals/'.$modal.'.wsam';
        if(file_exists($path)) return true;
        else return false;
    }
}
?>