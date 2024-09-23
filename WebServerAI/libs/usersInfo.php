<?php
$file = json_decode(file_get_contents(dirname(__DIR__).'/data/settings.json'),true);
unset($file['User']['password']);
unset($file['pythonConfig']);
echo json_encode($file, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
?>