<?php
function curl_local($url){

//curl 'https://resultados.gob.ar/backend-difu/scope/data/getScopeData/1500100001X/01' \
//  -H 'authority: resultados.gob.ar' \
//  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
//  -H 'accept-language: es-419,es;q=0.9,en;q=0.8' \
//  -H 'cache-control: no-cache' \
//  -H 'cookie: AWSALB=sGm9tWu/5M15BlWDMU7qYCqbGOma1rL0ZdCCRJzAZEr9bkCbZ3JgAmC1JJfJDuDdEKfpuVyeWlScPoM8DkX+APwp29zB7fuJmTxS9CO0bs3ADhgIi452n+2+z+xF; AWSALBCORS=sGm9tWu/5M15BlWDMU7qYCqbGOma1rL0ZdCCRJzAZEr9bkCbZ3JgAmC1JJfJDuDdEKfpuVyeWlScPoM8DkX+APwp29zB7fuJmTxS9CO0bs3ADhgIi452n+2+z+xF' \
//  -H 'pragma: no-cache' \
//  -H 'sec-ch-ua: "Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"' \
//  -H 'sec-ch-ua-mobile: ?0' \
//  -H 'sec-ch-ua-platform: "Linux"' \
//  -H 'sec-fetch-dest: document' \
//  -H 'sec-fetch-mode: navigate' \
//  -H 'sec-fetch-site: none' \
//  -H 'sec-fetch-user: ?1' \
//  -H 'upgrade-insecure-requests: 1' \
//  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' \
//  --compressed

$params=['https://resultados.gob.ar/backend-difu/scope/data/getScopeData/, Accept: */*',
'Accept-Language: es-419,es;q=0.9,en;q=0.8',
'Connection: keep-alive',
'Referer: https://resultados.gob.ar', 
'Sec-Fetch-Dest: empty',
'Sec-Fetch-Mode: cors',
'Sec-Fetch-Site: same-origin',
'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
'sec-ch-ua: "Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
'sec-ch-ua-mobile: ?0',
'sec-ch-ua-platform: "Linux"'];
   $ch = curl_init();
    //curl_setopt_array($ch, $defaults);
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
 
    $data = curl_exec($ch);
    curl_close($ch);
    //print_r($data);
    $json=json_decode($data,true);
    return $json;
}



$urloficial='https://resultados.gob.ar/backend-difu/scope/data/getScopeData/';//1500100001X/1';


$str = file_get_contents('API/getNomenclator.json');
//Now decode the JSON using json_decode():

$ubicaciones = json_decode($str, true); // decode the JSON into an associative array


$cont_mesas=0;
$mesas2=array();
//Recorre todas las mesas
/*"levels":[
    {"l":1,"n":"Pais"},
    {"l":2,"n":"Distrito"},
    {"l":3,"n":"Sección Provincial"},
    {"l":4,"n":"Sección"},
    {"l":5,"n":"Municipio"},
    {"l":6,"n":"Circuito"},
    {"l":7,"n":"Establecimiento"},
    {"l":8,"n":"Mesa"}]
*/
//$distrito_str="15-Neuquen";
$distrito_str="01-CABA";
$cod_distrito=substr($distrito_str,0,2);
foreach ($ubicaciones['amb'][12]['ambitos'] as  $key=>$mesaa) {
    if(substr($mesaa['co'],0,2)==$cod_distrito&&$mesaa['l']==8){ //15-Neuquen
        echo $key."-".$mesaa['co']."\n";
        $url=$urloficial.$mesaa['co'].'/01';
        echo $url;

        if($mesa = curl_local($url) ){
            echo " Si esta \n";
            //print_r($mesa);exit;
            $mesa2=array();
            $mesa2['mesaid']=$mesaa['co'];
            $mesa2['mesa_nro']=substr($mesaa['co'],5,5);
            $mesa2['establecimiento']=$mesa['fathers'][0]['name'];
            $mesa2['circuito']=$mesa['fathers'][1]['name'];
            $mesa2['departamento']=$mesa['fathers'][2]['name'];
            $mesa2['hora_proceso']=$mesa['date'];
            $mesa2['empadronados']=$mesa['census'];
            $mesa2['electores']=$mesa['electores'];
            $mesa2['sobres']= $mesa['sobres'];
            $mesa2['nulos']= $mesa['nulos'];
            $mesa2['recurridos']= $mesa['recurridos'];
            $mesa2['blancos']= $mesa['blancos'];
            $mesa2['comando']= $mesa['comando'];
            $mesa2['totalVotos']= $mesa['totalVotos'];
            $mesa2['afirmativos']= $mesa['afirmativos'];
            $mesa2['abstencion']= $mesa['abstencion'];
            $mesa2['valid']= $mesa['valid'];
            foreach ($mesa['partidos'] as $partido) {
                foreach ($partido['listas'] as $key => $lista) {
                    $mesa2[$partido['code'].$lista['nombre']]= $lista['votos'];    
                }
            }
            $cont_mesas++;
            $mesas2[]=$mesa2;
            //print_r($mesas2);
        }else{
            echo "No esta\n";
        }
    }
};



//echo '<pre>' . print_r($mesas, true) . '</pre>';

//se escribe lo escrapeado en un json
$jsonmesas=json_encode($mesas2,JSON_PRETTY_PRINT);
file_put_contents('salida/'.$distrito_str.date('ymd His ').'mesas '.$cont_mesas.'.json', $jsonmesas);


