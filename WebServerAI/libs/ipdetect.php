<?php
    // Function to get the client IP address
    /**
     * Gets users IP address
     * @return array|string|false Users IP if TRUE, otherwise FALSE
     */
    function clientIP() {
        $ipaddress = '';
        $localhost = ['127.0.0.1', '::1'];
        if(in_array($_SERVER['REMOTE_ADDR'], $localhost)){
            $ipaddress = getHostByName(getHostName());
        }elseif (getenv('HTTP_CLIENT_IP'))
            $ipaddress = getenv('HTTP_CLIENT_IP');
        elseif(getenv('HTTP_X_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        elseif(getenv('HTTP_X_FORWARDED'))
            $ipaddress = getenv('HTTP_X_FORWARDED');
        elseif(getenv('HTTP_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        elseif(getenv('HTTP_FORWARDED'))
        $ipaddress = getenv('HTTP_FORWARDED');
        elseif(getenv('REMOTE_ADDR'))
            $ipaddress = getenv('REMOTE_ADDR');
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }

    /**
     * Gets IP Records in JSON format from the API
     * @param string $ipapi IPInfo URL
     * @return JSON format of IP info
    */
    function getIPRecord(string $ipapi){
        $responce = file_get_contents($ipapi);
        echo $responce;
    }
    /**
     * Gets Domain IP
     * @param string $domain Domain to grab
     * @return string Domains` IPV4 address
     */
    function getDomainIP(string $domain){
        return gethostbyname($domain);
    }

    if($_REQUEST['action']==='getClientIP')
        echo clientIP();
    elseif($_REQUEST['action']==='getRecords')
        echo getIPRecord($_REQUEST['clienturl']);
    elseif($_REQUEST['action']==='getDomainIP'){
        echo getDomainIP($_REQUEST['domain']);
    }
?>