<?php
    use WebServerAI\Settings\Config;
    require_once('ai_config.php');
    $c = new Config();
    $f = $c->get(dirname(__DIR__).'/data/settings.json');
    $req_url = 'https://v6.exchangerate-api.com/v6/'.$f['apis']['exchangerateAPI'].'/latest/'.(isset($_REQUEST['from']) ? $_REQUEST['from'] : 'USD');
    $symbols = json_decode(file_get_contents(dirname(__DIR__).'/data/currency.tmp.json'),true);
    $setSymbol = '';
    $setName = '';
    $response_json = file_get_contents($req_url);

    // Continuing if we got a result
    if(false !== $response_json) {

        // Try/catch for json_decode operation
        try {
            // Decoding
            $response = json_decode($response_json);

            // Check for success
            if('success' === $response->result) {
                // YOUR APPLICATION CODE HERE, e.g.
                $base_price = (isset($_REQUEST['amount']) ? $_REQUEST['amount'] : 1); // Your price in USD
                $to = (isset($_REQUEST['to']) ? $_REQUEST['to'] : 'USD');
                $converted_price = round(($base_price * $response->conversion_rates->$to), 2);
                foreach($symbols as $symbol){
                    if($symbol['code']===$to) {
                        $setSymbol = $symbol['symbol'];
                        $setName = $symbol['name'];
                    };
                }
                echo json_encode(['converted'=>$converted_price, 'symbol'=>$setSymbol, 'name'=>$setName], JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
            }else
                echo json_encode(['error'=>'Out of requests'],JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
        }
        catch(Exception $e) {
            echo json_encode(['error'=>$e]);
        }
    }
?>