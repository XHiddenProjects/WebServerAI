<?php
namespace WebServerAI;
echo json_encode(yaml_parse_file($_SERVER['DOCUMENT_ROOT'].'/WebServerAI/build/'.$_REQUEST['name'].'/info.yaml'),JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
?>