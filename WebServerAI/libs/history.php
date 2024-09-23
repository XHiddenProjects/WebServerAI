<?php
use WebServerAI\Database\Database;
require_once('ai_database.php');
$tableName = 'history';
$f = json_decode(file_get_contents(dirname(__DIR__).'/data/settings.json'),true);
$db = new Database(dirname(__DIR__).'/db/history.db',SQLITE3_OPEN_READWRITE|SQLITE3_OPEN_CREATE,($f['User']['password'] ? base64_decode($f['User']['password']) : ''));
$db->enableExpectations(true);
if(isset($_REQUEST['action'])){
    if(strtolower($_REQUEST['action'])==='create')
        $db->createTable($tableName,['id INTEGER PRIMARY KEY AUTOINCREMENT','date DATETIME', 'history TEXT']);
    if(strtolower($_REQUEST['action'])==='recieve')
        echo $db->selectData($tableName,'*','ORDER BY id DESC');
    if(strtolower($_REQUEST['action'])==='add'&&isset($_REQUEST['value']))
        $db->insertData($tableName,['date','history'],[date('Y-m-d H:i:s'),$db->escape($_REQUEST['value'])]);
    if(strtolower($_REQUEST['action'])==='delete')
        $db->deleteTable($tableName);
$db->close();
}else
    echo false;
?>