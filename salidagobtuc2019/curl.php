<?php 

$params=['Content-Type:application/json, text/javascript, */*; q=0.01','Connection: keep-alive','User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36','X-Requested-With: XMLHttpRequest','Referer: https://elecciones.santafe.gov.ar/'];
$defaults = array(
CURLOPT_URL => 'https://elecciones.santafe.gov.ar/provincia/gobernador', 
//CURLOPT_POST => true,
CURLOPT_HTTPHEADER => $params,
);
$ch = curl_init();
curl_setopt_array($ch, $defaults);


//$ch = curl_init("https://elecciones.santafe.gov.ar/provincia/gobernador");
$fp = fopen('ok'.date('ymd His').'.json', "w");

curl_setopt($ch, CURLOPT_FILE, $fp);
curl_setopt($ch, CURLOPT_HEADER, $params);

curl_exec($ch);
curl_close($ch);
fclose($fp);
