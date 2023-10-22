<?php 
$params=['https://elecciones.santafe.gob.ar/web/mesas/1/N, Accept: */*',
'Accept-Language: es-419,es;q=0.9,en;q=0.8',
'Connection: keep-alive',
'Referer: https://elecciones.santafe.gob.ar/mesas/1/N', 
'Sec-Fetch-Dest: empty',
'Sec-Fetch-Mode: cors',
'Sec-Fetch-Site: same-origin',
'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
'sec-ch-ua: "Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
'sec-ch-ua-mobile: ?0',
'sec-ch-ua-platform: "Linux"'];

//$params=['Content-Type:application/json, text/javascript, */*; q=0.01','Connection: keep-alive','User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36','X-Requested-With: XMLHttpRequest','Referer: https://elecciones.santafe.gov.ar/'];

$i=1;
for ($i=0; $i < 7000 ; $i++) { 
    $ch = curl_init();
    //curl_setopt_array($ch, $defaults);
    curl_setopt($ch, CURLOPT_URL,'https://elecciones.santafe.gob.ar/web/mesas/'.$i.'/N');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    //curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    
    //$ch = curl_init("https://elecciones.santafe.gov.ar/provincia/gobernador");
    //$fp = fopen('ok'.date('ymd His').'.json', "w");
    
    //curl_setopt($ch, CURLOPT_FILE, $fp);
    //curl_setopt($ch, CURLOPT_HEADER, $params);
    
    /*curl_exec($ch);
    curl_close($ch);
    fclose($fp);*/
    
    $data = curl_exec($ch);
    curl_close($ch);
    //print_r($data);
    $json=json_decode($data,true);
    
    if(isset($json['message'])&&str_contains($json['message'],'no fueron computados')){
        echo 'Mesa '.$i.' No esta';
    }else{
        print_r($json);
    }
    echo '***********************';
    
}
//echo $json['menu']['menu'];
//echo '***********************';


