<?php
$urloficial='https://elecciones.santafe.gob.ar/web/mesas/';

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


$mesas=[];
//se arma un array con todas las urls

for ($i=1;$i<8306;$i++) {
//for ($i=1;$i<11;$i++) {

        $url=$urloficial. $i.'/N';//str_replace('.', '/', $value['id_ubicacion']).'/GOB.json';
        $mesas[$i]['numero']=$i;
        $mesas[$i]['url']=$url;
    //    echo $url.'<br>';


}
//echo '<pre>' . print_r($mesas, true) . '</pre>';
//se descargan todas las mesas del sitio oficial y se pasan a un array mesas2 con los resultados
$cont_mesas=0;
$mesas2=[];

foreach ($mesas as $key1 => $value1) {
        //echo $value1['url'];
        
        $ch = curl_init();
        //curl_setopt_array($ch, $defaults);
        curl_setopt($ch, CURLOPT_URL,$value1['url']);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $params);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $data = curl_exec($ch);
        curl_close($ch);
        $mesa=json_decode($data,true);
        if(isset($mesa['resumen'])){
            $cont_mesas++;
			//$xml   = simplexml_load_string($str);
			//$mesa = json_decode(json_encode((array) $xml), true);
//                        $mesa=json_decode($str);
            //$mesa = json_decode($str, true);
            //echo '<pre>' . print_r($mesa , true) . '</pre>';

            $mesa2=$mesa['resumen'];//['fechaHoraInformacion'];
            $mesa2['numero']=$value1['numero'];
            $mesa2['url']=$value1['url'];
            foreach ($mesa['totales'] as $key => $value) {
              	   $mesa2[$value['nombre']]= $value['votos'];
            }
            foreach ($mesa['partidos'] as $key => $partido) {
                //foreach ($partido['listas'] as $key2 => $lista) {
                    $mesa2[$partido['nroPartido']]= $partido['votos'];
                //}
              	
            }

            $mesas2[]=$mesa2;
            echo "\n Mesa Si esta ".$value1['url'];
    }else{
        echo "\n Mesa No esta ".$value1['url'];
    }
}

//echo '<pre>' . print_r($mesas, true) . '</pre>';

//se escribe lo escrapeado en un json
$jsonmesas=json_encode($mesas2,JSON_PRETTY_PRINT);
$file='salida/'.date('ymd His ').'mesas '.$cont_mesas.'.json';
file_put_contents($file, $jsonmesas);
echo "\n Se bajaron $cont_mesas mesas en $file \n";
