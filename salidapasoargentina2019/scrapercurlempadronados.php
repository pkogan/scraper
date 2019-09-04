<?php

class Scrapper {

    var $request;
    var $circuitos = [];
    var $escuelas = [];
    var $mesas = [];
    var $filtros;

    function __construct() {

    }

    function init($filtros = []) {
        $this->filtros = $filtros;
        $this->request = curl_init('https://resultados.gob.ar/');
        $this->cargarCircuitos();
        $this->cargarEscuelas();
        //print_r($this->escuelas);
        $this->cargarMesas();
        $this->generarCsv();
        curl_close($this->request);
    }

    function cargarCircuitos() {

        $str = file_get_contents('regions.json');
        //Now decode the JSON using json_decode():

        $regions = json_decode($str, true);
        //print_r($regions); exit;
        $this->circuitos = [];
        foreach ($regions as $key => $value) {
            if ($value['tp'] == 'R' && $value['l'] == 4) {
                $circuito['distrito'] = substr($value['cc'], 0, 2);
                $circuito['seccion'] = substr($value['cc'], 2, 3);
                $circuito['circuito'] = substr($value['cc'], 5, 5);
                $circuito['nombreCircuito'] = $value['n'];
                $circuito['escuelas'] = $value['chd'];
                $this->circuitos[] = $circuito;
            }
        }
    }

    function pasaFiltro($valor) {
        $pasa = true;
        foreach ($this->filtros as $key => $value) {
            $pasa = $pasa && $valor[$key] == $value;
        }
	
        //print_r($valor);
        //print_r($this->filtros);exit();
        return $pasa;
    }

    function filtroStr() {
        $pasa = "";
        foreach ($this->filtros as $key => $value) {
            $pasa .= $key . $value;
        }
        return $pasa;
    }

    function cargarEscuelas() {
        $this->escuelas = [];
        foreach ($this->circuitos as $key => $value1) {
            if ($this->pasaFiltro($value1)) {
//print_r($value);
                echo "Se buscan todas las mesas Escrutadas del " . $value1['distrito'] . $value1['seccion'] . $value1['circuito'] . "\n";
                foreach ($value1['escuelas'] as $key => $value) {
                    $escuela = $value1;
                    unset($escuela['escuelas']);
                    $escuela['datos'] = $this->descargarJsonEscuela($value);
                    $this->escuelas[] = $escuela;
                }
            }
        }
    }

//print_r($escuelas);
    function cargarMesas() {
        $this->mesas = [];
        foreach ($this->escuelas as $key => $value1) {
            foreach ($value1['datos'] as $idmesa => $value) {
                $mesa = $value1;
                unset($mesa['datos']);
                $mesa['id'] = $value['c'];
                $mesa['codigomesa'] = $value['cc'];
                $mesa['codigomesa'] = substr($value['cc'], 5, 5);
                $mesa['url'] = $value['rf'];
                $datos = $this->descargarJsonMesa($mesa['url']);
                //print_r($datos); exit;
                $mesa['empadronados'] = $datos['st'][0]['v_exp_abs'];
                $this->mesas[] = $mesa;
            }
        }
    }

//print_r($mesas);
    function generarJson() {
        $cont_mesas = count($this->mesas);
        $filtro = $this->filtroStr();
        $jsonmesas = json_encode($this->mesas, JSON_PRETTY_PRINT);
        file_put_contents('salida/' . date('ymd His ') . 'mesas ' . $cont_mesas . "sobre $filtro.json", $jsonmesas);
    }

    function generarCsv() {
        $cont_mesas = count($this->mesas);
        $filtro = $this->filtroStr();
        $output = fopen('salida/' . date('ymd His ') . 'mesas ' . $cont_mesas . "sobre $filtro.csv", 'w') or die("Can't open file");
        fputcsv($output, array_keys($this->mesas[0]));
        foreach ($this->mesas as $key => $value) {
            fputcsv($output, $value);
        }
        fclose($output);
    }

    function descargarJsonEscuela($idEscuela) {
        $id = ($idEscuela / 1000);

        if (($p = strpos($id, '.')) !== false) {
            $id = floatval(substr($id, 0, $p + 1));
        }


//https://resultados.gob.ar/assets/data/precincts/14/s14002.json
//https://resultados.gob.ar/assets/data/precincts/14/s14010.json
//https://resultados.gob.ar/assets/data/precincts/7/s7455.json
        $url = "https://resultados.gob.ar/assets/data/precincts/$id/s$idEscuela.json";
        echo $url;
        return $this->descargarJson($url);
    }

    function descargarJsonMesa($url) {
//https://resultados.gob.ar/assets/data/totalized_results/precincts/80/80443.json
        $url = "https://resultados.gob.ar/assets/data/totalized_results/$url";
        echo $url;
        return $this->descargarJson($url);
    }

    function descargarJson($url) {
        curl_setopt($this->request, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($this->request, CURLOPT_HTTPHEADER, array(
            'Content-type: application/json',
            'Authorization: Bearer 31d15a'
        ));
        curl_setopt($this->request, CURLOPT_URL, $url);

        $result = curl_exec($this->request);
        if (count($result) > 0) {
            echo " OK\n";
        } else {
            echo " ERROR\n";
        }

        return json_decode($result, true);
    }

}

$filtro = [];
//$filtro['distrito'] = '4';
//$filtro['seccion'] = 9;
$sc = new Scrapper();
$sc->init($filtro);

