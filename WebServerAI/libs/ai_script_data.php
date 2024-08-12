<?php
if(isset($_SERVER['QUERY_STRING'])){
    $data = urldecode($_SERVER['QUERY_STRING']);
    $data = explode('&',$data);

    $dataname = explode('=',$data[0])[1];
    $datasets = json_decode(explode('=',$data[1])[1],true);
    
    $path = dirname(__DIR__).'/scripts/data/'.$dataname.'.json';
    $decode = json_decode(file_get_contents($path),true);

    foreach($datasets as $key=>$value){
        if(isset($decode[$key])){
            $decode[$key] = $value;
        }else{
            return false;
        }
    }
    return @file_put_contents($path,json_encode($decode),JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
}

?>