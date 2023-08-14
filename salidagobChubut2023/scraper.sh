#!/bin/bash
#descarga json avance elecciones la sanjuan 2023

SCRIPT=`realpath $0`
CARPETA='/home/pkogan/Proyectos/web/scraper/salidagobChubut2023/'
echo $CARPETA
echo $SCRIPT
cd $CARPETA

TSTAMP=$(date "+%Y-%m-%d_%H-%M-%S")

wget -O chubut$TSTAMP.json https://datosoficiales.juschubut.gov.ar/data.json
