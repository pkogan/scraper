<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function csv_to_array($filename = '', $delimiter = ',') {
    if (!file_exists($filename) || !is_readable($filename))
        return FALSE;

    $header = NULL;
    $data = array();
    if (($handle = fopen($filename, 'r')) !== FALSE) {
        while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE) {
            if (!$header)
                $header = $row;
            else
                $data[] = array_combine($header, $row);
        }
        fclose($handle);
    }
    return $data;
}

$distrito = '16'; //neuquen
$carpeta_carta_marina = '../carta_marina/';
$mesas_csv = csv_to_array($carpeta_carta_marina . $distrito . '.csv');
//print_r($mesas_csv);
//exit();

//$urloficial = 'https://resultados.gob.ar/backend-difu-arg/scope/data/getTiff/';
$urloficial = 'https://resultados.gob.ar/backend-difu-arg-generales/scope/data/getTiff/';


$params = ['Content-Type:application/json, text/javascript, */*; q=0.01', 'Connection: keep-alive', 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36', 'X-Requested-With: XMLHttpRequest', 'Referer: https://resultados.gob.ar/'];
$defaults = array(
    //CURLOPT_URL => $urloficial . '1500100011X',
//CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => $params,
    CURLOPT_RETURNTRANSFER => true,
);


$mesabase = $distrito; //002';
if (!dir('salida/' . $distrito)) {
    mkdir('salida/' . $distrito);
}

$salida = [];
//1603 mesas nqn
//for($i=1;$i<1603;$i++){
foreach ($mesas_csv as $key => $value) {


    $cod = $value['IdSeccion'];
    $mesaNombre = $mesabase . str_pad($cod, 3, "0", STR_PAD_LEFT) . $value['Mesa']; //str_pad($i, 5, "0", STR_PAD_LEFT) . 'X';
    $url = $urloficial . $mesaNombre;
    echo $url;
    $defaults[CURLOPT_URL] = $url;
    $ch = curl_init();
    curl_setopt_array($ch, $defaults);
    $data = curl_exec($ch);
    curl_close($ch);

    $json = json_decode($data);
    // print_r($json);
//echo '<br/>';

    $mesa = $json->metadatos->pages[0];

    $mesa->dateScan = str_replace('+00:00', '', $json->imagenState->date);
    $mesa->pollingStationCode = $json->metadatos->pollingStationCode;
    $mesa->incidenciaState = $json->incidenciaState;
    foreach ($value as $key => $value2) {
        $mesa->{$key} = $value2;
    }

    print_r($mesa);//exit();
    $salida[] = $mesa;
//print_r(array_keys($json));
    file_put_contents('salida/' . $distrito . '/json/' . $mesaNombre . '.json', $data);
    file_put_contents('salida/' . $distrito . '/tiff/' . $mesaNombre . '.tiff', base64_decode($json->encodingBinary));
//    exit();
}
//
//header('Content-type: image/png'); 
//echo $json->encodignBinary;
//        
//        if(!dir('salida/'.$value1['distrito'])){
//            mkdir('salida/'.$value1['distrito']);
//        }
//        if(!dir('salida/'.$value1['distrito'].'/'.$value1['seccion'])){
//            mkdir('salida/'.$value1['distrito'].'/'.$value1['seccion']);
//        }
//        file_put_contents('salida/'.$value1['distrito'].'/'.$value1['seccion'].'/'. $value1['url'] . '.png', $data);
//    }

$output = fopen('salida/' . $distrito . '/salida.csv', 'w') or die("Can't open file");
fputcsv($output, array_keys((array) $salida[0]));
foreach ($salida as $key => $value) {
    fputcsv($output, (array) $value);
}
fclose($output);


//file_put_contents('salida/'.$distrito.'/salida.json', json_encode($salida));
