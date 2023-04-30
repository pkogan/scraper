// Créditos: https://stackoverflow.com/questions/18638900/javascript-crc32

/**
 * Computa la lookup table requerida para el cálculo del crc32.
 * @returns
 */
var computeCRCLookupTable = function () {
    let lookupTable = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        lookupTable[n] = c;
    }
    return lookupTable;
}

/**
 * Computa el crc32 de una lista que representa una secuencia de bytes.
 * @param {*} bytes
 * @returns
 */
var crc32 = function (bytes) {
    // Computa la lookup table sólo la primera vez que se invoca esta función.
    let lookupTable = window.crcLookupTable || (window.crcLookupTable = computeCRCLookupTable());

    // Computa el crc32 de la secuencia dada.
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {
        crc = (crc >>> 8) ^ lookupTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
};