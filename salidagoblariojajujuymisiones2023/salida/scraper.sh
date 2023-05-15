#!/bin/bash
#descarga json avance elecciones la rioja, misiones y jujuy 2023

SCRIPT=`realpath $0`
CARPETA='/home/pkogan/Proyectos/web/scraper/salidagoblarioja2023/salida/'
echo $CARPETA
echo $SCRIPT
cd $CARPETA

TSTAMP=$(date "+%Y-%m-%d_%H-%M-%S")

curl 'https://eleccioneslarioja2023.correoargentino.com.ar/index.php' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: es-419,es;q=0.9,en;q=0.8' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  -H 'Cookie: PHPSESSID=qeqiv991ok1t96u49j5eke7g65; Path=/; _gid=GA1.3.1960054017.1683497047; _gcl_au=1.1.140179315.1683497969; _fbp=fb.2.1683497969554.1829310409; _ga_JXWYJC2YY5=GS1.1.1683511120.2.1.1683514827.0.0.0; _ga=GA1.1.2065378882.1683497047' \
  -H 'Origin: https://eleccioneslarioja2023.correoargentino.com.ar' \
  -H 'Referer: https://eleccioneslarioja2023.correoargentino.com.ar/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'sec-ch-ua: "Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  --data-raw 'controlador=consultasGrales&accion=consultaDistribucionVotos&departamento=0&municipio=0&circuito=0&establecimiento=0&ntelegramacodigo=0&cargo=1' \
  --compressed > larioja$TSTAMP.json
curl 'https://eleccionesmisiones2023.correoargentino.com.ar/index.php' \
  -H 'Accept: application/json, text/javascript, */*; q=0.01' \
  -H 'Accept-Language: es-419,es;q=0.9,en;q=0.8' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  -H 'Cookie: _gid=GA1.3.1960054017.1683497047; PHPSESSID=ip925uac77ir2qpv1bpjnmo0a3; Path=/; _gcl_au=1.1.140179315.1683497969; _fbp=fb.2.1683497969554.1829310409; _gat_gtag_UA_142703403_1=1; _ga_JXWYJC2YY5=GS1.1.1683517981.3.1.1683517987.0.0.0; _ga=GA1.1.2065378882.1683497047' \
  -H 'Origin: https://eleccionesmisiones2023.correoargentino.com.ar' \
  -H 'Referer: https://eleccionesmisiones2023.correoargentino.com.ar/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'sec-ch-ua: "Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  --data-raw 'controlador=consultasGrales&accion=consultaDistribucionVotos&departamento=0&municipio=0&circuito=0&establecimiento=0&ntelegramacodigo=0&cargo=1' \
  --compressed > misiones$TSTAMP.json
 wget -O jujuy$TSTAMP.html https://eleccionesjujuy2023.com.ar/wn02.aspx?0,0


