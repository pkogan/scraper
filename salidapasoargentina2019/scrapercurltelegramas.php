<?php

$urloficial = 'https://resultados2019.gob.ar/opt/jboss/rct/tally/pages/';
$fila = 1;
$mesas = [];
if (($gestor = fopen("locales.csv", "r")) !== FALSE) {
    while (($datos = fgetcsv($gestor, 1000, ",")) !== FALSE) {
        $numero = count($datos);
        //echo "<p> $numero de campos en la línea $fila: <br /></p>\n";
        $fila++;
        //for ($c=0; $c < $numero; $c++) {
        $cod = str_pad($datos[1], 2, "0", STR_PAD_LEFT) . str_pad($datos[6], 3, "0", STR_PAD_LEFT);
        for ($index = (int) $datos[9]; $index <= (int) $datos[10]; $index++) {
            $mesa['url'] = str_replace(' ', '0', $cod . str_pad($index, 5, "0", STR_PAD_LEFT) . "X");
            $mesa['distrito'] = $datos[1];
            $mesa['seccion'] = $datos[6];
            $mesa['mesa'] = $index;
            $mesas[] = $mesa;
        }
        //.','.$datos[9].','.$datos[10]. "\n";
        //}
    }
    fclose($gestor);
}

$cont_mesas = 0;
$mesas2 = [];
$params = ['Content-Type:application/json, text/javascript, */*; q=0.01', 'Connection: keep-alive', 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36', 'X-Requested-With: XMLHttpRequest', 'Referer: https://elecciones.santafe.gov.ar/'];
$defaults = array(
    CURLOPT_URL => $urloficial . '1500100011X/1.png',
//CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => $params,
    CURLOPT_RETURNTRANSFER => true,
);

foreach ($mesas as $key1 => $value1) {
    //if ($value1['distrito'] > 22 && $value1['distrito'] < 25 && ($value1['distrito']>23||$value1['seccion']>4)) {
	  if(true){
        echo $value1['url'];
        $defaults[CURLOPT_URL] = $urloficial . $value1['url'] . "/1.png";
        $ch = curl_init();
        curl_setopt_array($ch, $defaults);
        $data = curl_exec($ch);
        curl_close($ch);
        if(!dir('salida/'.$value1['distrito'])){
            mkdir('salida/'.$value1['distrito']);
        }
        if(!dir('salida/'.$value1['distrito'].'/'.$value1['seccion'])){
            mkdir('salida/'.$value1['distrito'].'/'.$value1['seccion']);
        }
        file_put_contents('salida/'.$value1['distrito'].'/'.$value1['seccion'].'/'. $value1['url'] . '.png', $data);
    }
}
