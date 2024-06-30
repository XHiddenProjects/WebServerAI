<?php
namespace WebServerAI;
use WebServerAI\Trainer;
require_once(dirname(__DIR__,2).'/WebServerAI/libs/trainer.php');

$canReturn = 0;
$returnMsg = null;
if(isset($_REQUEST['addCache'])){
    if(file_exists($_SERVER['DOCUMENT_ROOT'].$_REQUEST['addCache'])){
        $f = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/WebServerAI/caches/cache.txt');
        $lines = preg_split('/(\r\n|\n|\r)/',$f);
        foreach($lines as $line){
            if(strcmp($_REQUEST['addCache'],$line)!=0){
                $canReturn = 1;
            }else{
                $canReturn = 0;
                $returnMsg = json_encode(['status'=>false, 'msg'=>$_SERVER['DOCUMENT_ROOT'].$_REQUEST['addCache'].' already exists'], JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);
                echo $returnMsg;
                return false;
            }
        }
        if($canReturn){
            $fw = fopen($_SERVER['DOCUMENT_ROOT'].'/WebServerAI/caches/cache.txt','a+');
                fwrite($fw,'
'.$_REQUEST['addCache']);
                fclose($fw);
                echo json_encode(['status'=>true, 'msg'=>$_SERVER['DOCUMENT_ROOT'].$_REQUEST['addCache'].' has been added'], JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);
                return true;
        }
    }else{
        $canReturn = 0;
        $returnMsg = json_encode(['status'=>false, 'msg'=>$_SERVER['DOCUMENT_ROOT'].$_REQUEST['addCache'].' doesn`t exist'], JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);
    }
    echo $returnMsg;
}else{
    $insertInfo = new Trainer();
    echo $insertInfo->format($insertInfo->decodeURI($_REQUEST['wsaai']));
}
?>