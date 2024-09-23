<?php
use WebServerAI\Database\Database;
use WebServerAI\Settings\Config;
require_once('ai_database.php');
require_once('ai_config.php');
$c = new Config();
$c->setTimeZone($c->get(dirname(__DIR__).'/data/settings.json')['AI']['timezone']);
$table = 'credits';
$f = json_decode(file_get_contents(dirname(__DIR__).'/data/settings.json'),true);
$db = new Database(dirname(__DIR__).'/db/credits.db',SQLITE3_OPEN_READWRITE|SQLITE3_OPEN_CREATE,($f['User']['password'] ? base64_decode($f['User']['password']) : ''));
if(isset($_REQUEST['credit_usage'])){
    $select = json_decode($db->selectData($table,'*','WHERE user="'.$f['User']['label'].'"'),true);
    $currentCredit = (int)$select[0]['credits'];
    $db->updateData($table,['credits'],[($currentCredit-1)],'WHERE user="'.$f['User']['label'].'"');
}
if(isset($_REQUEST['get_credits'])){
    $select = json_decode($db->selectData($table,'*','WHERE user="'.$f['User']['label'].'"'),true);
    $currentCredit = (int)$select[0]['credits'];
    $renewDate = $select[0]['next_update'];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['credits'=>$currentCredit, 'renew_date'=>$renewDate],JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);
}
if(isset($_REQUEST['max_credits'])){
    $select = json_decode($db->selectData($table,'*','WHERE user="'.$f['User']['label'].'"'),true);
    $maxCredits = (int)$select[0]['max_credits'];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['max_credits'=>$maxCredits],JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
}
if(isset($_REQUEST['load'])){
        $setCredits = 50;
        $datetime = new DateTime();
        $datetime->modify('+1 day');
        $df = $datetime->format('Y-m-d H:i:s');
        $results = $db->createTable($table, ['user varchar(50) NOT NULL PRIMARY KEY', 'max_credits int not null', 'credits int NOT NULL' ,'next_update datetime NOT NULL']);
        $select = json_decode($db->selectData($table,'*','WHERE user="'.$f['User']['label'].'"'),true);
        if($results&&empty($select)){
            $db->insertData($table,['user','max_credits','credits','next_update'],[$f['User']['label'], $setCredits , $setCredits, $df]);
        }else{
            if(strtotime(date('Y-m-d H:i:s'))>=strtotime($select[0]['next_update'])){
                $db->updateData($table,['credits','next_update'],[$setCredits,$df],'WHERE user="'.$f['User']['label'].'"');
            }
        }
}
?>