#!/bin/bash
#descarga json avance elecciones la sanjuan 2023

SCRIPT=`realpath $0`
CARPETA='/home/pkogan/Proyectos/web/scraper/salidagobsanjuan2023/'
echo $CARPETA
echo $SCRIPT
cd $CARPETA

TSTAMP=$(date "+%Y-%m-%d_%H-%M-%S")
curl 'https://eleccionessanjuan2023.correoargentino.com.ar/index.php' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: es-419,es;q=0.9,en;q=0.8' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  -H 'Cookie: _gcl_au=1.1.140179315.1683497969; _fbp=fb.2.1683497969554.1829310409; PHPSESSID=3bmlnooqb6dlhonu97131517r2; Path=/; _gid=GA1.3.519423305.1684101699; _ga_JXWYJC2YY5=GS1.1.1684109005.7.1.1684110234.0.0.0; _ga=GA1.1.2065378882.1683497047' \
  -H 'Origin: https://eleccionessanjuan2023.correoargentino.com.ar' \
  -H 'Referer: https://eleccionessanjuan2023.correoargentino.com.ar/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'sec-ch-ua: "Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  --data-raw 'controlador=ctrlConsultaPASO&accion=consultaDistribucionVotos&seccion=0&departamento=0&municipio=0&circuito=0&establecimiento=0&ntelegramacodigo=0&cargo=3&cargoDes=' \
  --compressed > sanjuan$TSTAMP.json

wget -O lapampa$TSTAMP.html https://eleccionesgenerales2023.lapampa.gob.ar/scripts/cgiip.exe/WService=ElecGrales2023/ECxLocCowr.htm?Partido=1&User=
