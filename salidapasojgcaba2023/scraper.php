<?php
$urloficial='https://apielecciones2023.buenosaires.gob.ar/index.php/api/result/JEF/';
//http://www.datosoficiales.com/
//$str = file_get_contents('API/cargos.json');
//Now decode the JSON using json_decode():

//$cargos = json_decode($str, true); // decode the JSON into an associative array


//echo '<pre>' . print_r($cargos, true) . '</pre>';

$str = file_get_contents('/home/pkogan/Proyectos/web/scraper/salidapasojgcaba2023/API/ubicaciones.json');
//Now decode the JSON using json_decode():

$ubicaciones = json_decode($str, true); // decode the JSON into an associative array

$cont_mesas=0;
$mesas2=array();
foreach ($ubicaciones['content']['children'] as  $departamento) {
    echo $departamento['description']."\n";
    foreach ($departamento['children'] as  $localidad) {
        echo $localidad['description']."\n";
        foreach ($localidad['children'] as  $establecimiento) {
            echo $establecimiento['description']."\n";
            foreach ($establecimiento['children'] as  $mesaa) {
                echo $mesaa['description']."\n";
                if($str = file_get_contents($urloficial.$mesaa['id']) ){
                    $cont_mesas++;
                    $mesa = json_decode($str, true);
                    echo "Si esta \n";
                    //echo print_r($mesa , true);exit;
                    $mesa2=array();
                    $mesa2['mesaid']=$mesaa['id'];
                    $mesa2['mesa_nro']=$mesaa['description'];
                    $mesa2['hora_proceso']=$mesa['content']['processTime'];
                    $mesa2['votantes']=$mesa['content']['numberVoters'];
                    $mesa2['apelados']= $mesa['content']['appealedVotes'];
                    $mesa2['impugnados']= $mesa['content']['impugnedVotes'];
                    $mesa2['observados']= $mesa['content']['observedVotes'];
                    $mesa2['nulos']= $mesa['content']['nullVotes'];
                    $mesa2['blancos']= $mesa['content']['blankVotes'];

                    foreach ($mesa['content']['lists'] as $lista) {
                      $mesa2[$lista['candidacyId']]= $lista['numberVotes'];    
                    }
                    $mesas2[]=$mesa2;
                    //print_r($mesas2);//exit;
                }else{
                    echo "No esta\n";
                }
            };
        };
    };
};    


//echo '<pre>' . print_r($mesas, true) . '</pre>';

//se escribe lo escrapeado en un json
$jsonmesas=json_encode($mesas2,JSON_PRETTY_PRINT);
file_put_contents('salida/'.date('ymd His ').'mesas '.$cont_mesas.'.json', $jsonmesas);


