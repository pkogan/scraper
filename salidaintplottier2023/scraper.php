<?php
$urloficial='https://plottier.datosoficiales.com/resultados/';
//http://www.datosoficiales.com/
//$str = file_get_contents('API/cargos.json');
//Now decode the JSON using json_decode():

//$cargos = json_decode($str, true); // decode the JSON into an associative array


//echo '<pre>' . print_r($cargos, true) . '</pre>';

$str = file_get_contents('API/ubicaciones.json');
//Now decode the JSON using json_decode():

$ubicaciones = json_decode($str, true); // decode the JSON into an associative array

//print_r();
//echo '<pre>' . print_r($ubicaciones, true) . '</pre>';
$mesas=[];
//se arma un array con todas las urls

foreach ($ubicaciones as $key => $value) {
    if($value['clase_ubicacion']=='Mesa'){
        //print_r($value['ancestros']);
        
        $url=$urloficial. str_replace('.', '/', $value['id_ubicacion']).'/CON.json';//'/INT.json';//'/CNJ.json';//'/DIP.json';//'/RPO.json';
        $mesas[$value['descripcion_ubicacion']]['numero']=$value['descripcion_ubicacion'];
        $mesas[$value['descripcion_ubicacion']]['url']=$url;
    //    echo $url.'<br>';
        
    }
}

//posta https://neuquen.datosoficiales.com/resultados/NE/1/22/52/59/INT.json
////    https://neuquen.datosoficiales.com/resultados/NE/1/10/15/729/INT.jso
//posta https://neuquen.datosoficiales.com/resultados/NE/1/22/52/59/GOB.json
////https://neuquen.datosoficiales.com/#resultados/NE/1/22/95/616GOB.json
//echo '<pre>' . print_r($mesas, true) . '</pre>';
//se descargan todas las mesas del sitio oficial y se pasan a un array mesas2 con los resultados
$cont_mesas=0;
$mesas2=[];
foreach ($mesas as $key1 => $value1) {
        echo $value1['url'];
        if($str = file_get_contents($value1['url']) ){
            $cont_mesas++;
            $mesa = json_decode($str, true);
            echo "Si esta \n";
            //echo '<pre>' . print_r($mesa , true) . '</pre>';
            $mesa2=$value1;
            $mesa2['hora_proceso']=$mesa['hora_proceso'];
            foreach ($mesa['resultados'] as $key => $value) {
              $mesa2[$value['id_candidatura']]= $value['cant_votos'];    
            }
            $mesas2[]=$mesa2;
            
    }else{
        echo "No esta\n";
    }
}

//echo '<pre>' . print_r($mesas, true) . '</pre>';

//se escribe lo escrapeado en un json
$jsonmesas=json_encode($mesas2,JSON_PRETTY_PRINT);
file_put_contents('salida/'.date('ymd His ').'mesas '.$cont_mesas.'.json', $jsonmesas);


