<?php
require_once('ai_config.php');
use WebServerAI\Settings\Config;
$config = new Config();
$config->save(null,'AI',$_REQUEST['value'],$_REQUEST['action']);
?>