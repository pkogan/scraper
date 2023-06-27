<?php
$urloficial='https://elecciones.santafe.gob.ar/mesa/gobernador/';

/*GET /provincia/gobernador HTTP/1.1
Host: elecciones.santafe.gov.ar
Connection: keep-alive
Accept: application/json, text/javascript, *; q=0.01
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36
Referer: https://elecciones.santafe.gov.ar/
Accept-Encoding: gzip, deflate, br
Accept-Language: es-AR,es-419;q=0.9,es;q=0.8

//fetch("https://elecciones.santafe.gov.ar/provincia/gobernador", {"credentials":"omit","headers":{"accept":"application/json, text/javascript, *; q=0.01","accept-language":"es-AR,es-419;q=0.9,es;q=0.8","x-requested-with":"XMLHttpRequest"},"referrer":"https://elecciones.santafe.gov.ar/","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"});
//http://www.datosoficiales.com/
//$str = file_get_contents('API/cargos.json');
//Now decode the JSON using json_decode():

//$cargos = json_decode($str, true); // decode the JSON into an associative array


//echo '<pre>' . print_r($cargos, true) . '</pre>';
*/
//$str = file_get_contents($urloficial);
//Now decode the JSON using json_decode():

//$xml   = simplexml_load_string($str);
//$mesa = json_decode(json_encode((array) $xml), true);

// = xml_decode($str, true); // decode the JSON into an associative array


//echo '<pre>' . print_r($mesa, true) . '</pre>';

$mesas=[];
//se arma un array con todas las urls

for ($i=1;$i<7911;$i++) {
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
$params=['Content-Type:application/json, text/javascript, */*; q=0.01','Connection: keep-alive','User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36','X-Requested-With: XMLHttpRequest','Referer: https://elecciones.santafe.gov.ar/'];
$defaults = array(
CURLOPT_URL => 'https://elecciones.santafe.gob.ar/mesa/gobernador/1/N', 
//CURLOPT_POST => true,
CURLOPT_HTTPHEADER => $params,
CURLOPT_RETURNTRANSFER=> true,
);  

foreach ($mesas as $key1 => $value1) {
        echo $value1['url'];
        $defaults[CURLOPT_URL]=$value1['url'];
        $ch = curl_init();
        curl_setopt_array($ch, $defaults);
        $data = curl_exec($ch);
        curl_close($ch);
        $mesa=json_decode($data,true);
        if(isset($mesa['votos'])){
            $cont_mesas++;
			//$xml   = simplexml_load_string($str);
			//$mesa = json_decode(json_encode((array) $xml), true);
//                        $mesa=json_decode($str);
            //$mesa = json_decode($str, true);
            //echo '<pre>' . print_r($mesa , true) . '</pre>';

            $mesa2=$mesa['cabecera'];//['fechaHoraInformacion'];
            $mesa2['numero']=$value1['numero'];
            $mesa2['url']=$value1['url'];
            foreach ($mesa['detalle'] as $key => $value) {
        			  if($value['tipo']=='L')
              	   $mesa2[$value['nombre']]= $value['cantidad'];
            }
            foreach ($mesa['votos'] as $key => $value) {
              	$mesa2[$value['nombre']]= $value['cantidad'];
            }

            $mesas2[]=$mesa2;

    }else{
        echo 'No esta<br>';
    }
}

//echo '<pre>' . print_r($mesas, true) . '</pre>';

//se escribe lo escrapeado en un json
$jsonmesas=json_encode($mesas2,JSON_PRETTY_PRINT);
file_put_contents('salida/'.date('ymd His ').'mesas '.$cont_mesas.'.json', $jsonmesas);
