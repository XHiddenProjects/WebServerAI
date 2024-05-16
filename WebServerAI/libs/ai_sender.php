<?php
namespace WebServerAI;
use WebServerAI\Trainer;
require_once(dirname(__DIR__,2).'/WebServerAI/libs/trainer.php');

$insertInfo = new Trainer();
echo $insertInfo->format($insertInfo->decodeURI($_REQUEST['wsaai']));
?>