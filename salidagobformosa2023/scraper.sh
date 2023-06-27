#!/bin/bash
#descarga json avance elecciones la rioja, misiones y jujuy 2023

SCRIPT=`realpath $0`
CARPETA='/home/pkogan/Proyectos/web/scraper/salidagobformosa2023/'
echo $CARPETA
echo $SCRIPT
cd $CARPETA

TSTAMP=$(date "+%Y-%m-%d_%H-%M-%S")


curl 'https://elecciones.formosa.gob.ar/json/gobernador' \
  -H 'authority: elecciones.formosa.gob.ar' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: es-419,es;q=0.9,en;q=0.8' \
  -H 'cache-control: max-age=0' \
  -H 'cookie: _ga=GA1.1.870504453.1687736814; _ga_W9BGL6VJ08=GS1.1.1687736814.1.1.1687737601.0.0.0' \
  -H 'referer: https://elecciones.formosa.gob.ar/' \
  -H 'sec-ch-ua: "Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36' \
  --compressed > formosa$TSTAMP.json