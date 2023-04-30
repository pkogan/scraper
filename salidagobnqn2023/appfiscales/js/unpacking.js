const CHECK_CRC32 = true;

/**
 * Obtiene y formatea el crc32 desde el encabezado del código qr dado.
 * @param {*} qr_data Cadena hexadecimal que representa un recuento qr.
 * @returns crc32 que luego debe ser comparado con otro computado en base a la
 * sección de datos del código qr.
 */
function parse_expected_crc32(qr_data) {
    let crc32_bits = Hex2Bin(qr_data.slice(0, 8));

    // Computa los bytes invertidos de la secuencia de bits del crc32, teniendo
    // en cuenta que el último octeto es el más significativo. Ej: la secuencia
    // [243, 37, 163] debería procesarse como [163, 37, 243].
    let crc32_inverted_bytes = [];
    for (let i = 0; i < crc32_bits.length; i += 8) {
        crc32_inverted_bytes.unshift(crc32_bits.slice(i, i + 8));
    }
    return parseInt(crc32_inverted_bytes.join(""), 2);
}

/**
 * Computa el crc32 del código qr dado.
 * @param {*} qr_data Cadena hexadecimal que representa un recuento qr.
 * @returns crc32.
 */
function compute_crc32(qr_data) {
    // Exceptua el encabezado y el serial.
    let data_for_crc32 = Hex2Bin(qr_data.slice(12, -16));

    // Obtiene las secuencias de bytes requeridas para computar crc32.
    let buffer = [];
    for (let i = 0; i < data_for_crc32.length; i += 8) {
        let code = parseInt(data_for_crc32.slice(i, i + 8), 2);
        buffer.push(code);
    }

    // Computa el crc32.
    return crc32(buffer);
}

/**
 * Chequea el crc32 del código qr dado.
 * @param {*} qr_data Cadena hexadecimal que representa un recuento qr.
 * @returns Verdadero si el crc32 esperado coincide con el computado; falso en
 * caso contrario.
 */
function check_crc32(qr_data) {
    let expected_crc32 = parse_expected_crc32(qr_data);
    let computed_crc32 = compute_crc32(qr_data);
    return expected_crc32 == computed_crc32;
}

/**
 * Convierte un hex string a un ArrayBuffer.
 * 
 * @param {string} hexString - hex repsentacion de bytes
 * @return {ArrayBuffer} - Los bytes en un ArrayBuffer.
 */
function hexStringToArrayBuffer(hexString) {
    // remove the leading 0x
    hexString = hexString.replace(/^0x/, '');
    
    // ensure even number of characters
    if (hexString.length % 2 != 0) {
        console.log('WARNING: expecting an even number of characters in the hexString');
    }
    
    // check for some non-hex characters
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
        console.log('WARNING: found non-hex characters', bad);    
    }
    
    // split the string into pairs of octets
    var pairs = hexString.match(/[\dA-F]{2}/gi);
    // convert the octets to integers
    var integers = pairs.map(function(s) {
        return parseInt(s, 16);
    });
    
    var array = new Uint8Array(integers);
    return array;
}

/**
 * Convierte un ArrayBuffer a un String Hex.
 * 
 * @param {ArrayBuffer} ArrayBuffer - ArrayBuffer
 * @return {string} - El String Hex.
 */
function ArrayBufferTohexString(ArrayBuffer) {
    return Array.prototype.map.call(ArrayBuffer, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      }).join('');
}

function unpack(qr_data) {
    var qr_data = qr_data.replace(/\s/g, "");
    if (qr_data.slice(0, 3) == "REC") {
        qr_data = qr_data.slice(3);
    }

    // Longitud de la sección de datos.
    let longitud = -1;
    let errmsg = "El código del recuento es incorrecto.";
    // Nota: 1 hex str = 4 bits.
    if (qr_data.length > 3) {
        let token = qr_data.slice(0, 2);
        qr_data = qr_data.slice(2);

        // Si corresponde, chequea crc32.
        if (CHECK_CRC32) {
            if (!check_crc32(qr_data)) {
                return Array(0, 0, errmsg, 0);
            }
            //qr_data = qr_data.slice(10);
        }

        qr_data = qr_data.slice(8);
        longitud = parseInt(Hex2Bin(qr_data.slice(0, 4)), 2);
        qr_data = qr_data.slice(4);
    }

    // Si la longitud del encabezado NO coincide con la longitud 'real' de los datos...
    if (longitud != qr_data.length) {
        return Array(0, 0, errmsg, 0);
    }

    // Ignora los bytes correspondientes a los DNI de las autoridades de mesa.
    const dnis_data_size = parseInt(Hex2Bin(qr_data.slice(0, 2)), 2);
    qr_data = qr_data.slice(dnis_data_size * 2 + 2);

    // Ignora timestamp y serial (-16). Nota: timestamp 24 bits / 8 = 3 bytes.
    const cmag_tag_size = 4;
    const timestamp_data_size = cmag_tag_size + 3;
    qr_data = qr_data.slice(timestamp_data_size * 2, -16);

    // Obtiene la categoría (int, cnj, etc.). '0' indica que todas están incluidas.
    var grupo_cat = parseInt(Hex2Bin(qr_data.slice(0, 2)), 2);
    qr_data = qr_data.slice(2);

    // Extrae el numero de mesa.
    if (SMART_PACKING) {
        // Convierte el hexa a binario.
        qr_data = hexStringToArrayBuffer(qr_data)
        qr_data = pako.inflate(qr_data)
        qr_data = ArrayBufferTohexString(qr_data);
        binstr = Hex2Bin(qr_data);
        var str_numero_mesa = binstr.slice(0, BITS_NUMERO_MESA);
        mesa = parseInt(str_numero_mesa, 2) + OFFSETMESA;

        // Desempaqueta los datos binarios.
        datos = unpack_smart(binstr);
    } else {
        // Nro. de mesa (id único) de n bytes:
        n = Math.ceil(BITS_NUMERO_MESA / 8) * 2;
        var str_numero_mesa = qr_data.slice(0, n);
        mesa = parseInt(str_numero_mesa, 16) + OFFSETMESA;

        // Extrae la cantidad de bits de cada valor.
        bits = parseInt(qr_data.slice(n, n + 2), 16);
        qr_data = qr_data.slice(n + 2);

        // Convierte el hexa a binario.
        binstr = Hex2Bin(qr_data);
        datos = unpack_dumb(binstr, bits);
    }
    return Array(mesa, grupo_cat, datos, longitud);
}

function unpack_smart(binstr) {

    var offset = BITS_NUMERO_MESA;
    var str_modo = binstr.slice(offset, (offset + MODOBITS));
    modo = parseInt(str_modo, 2);

    var str_numero_data_bits = binstr.slice(offset + MODOBITS, offset + MODOBITS + META_DATABITS)
    numero_data_bits = parseInt(str_numero_data_bits, 2);
    
    var str_cant_datos = binstr.slice(offset + MODOBITS + META_DATABITS, offset + MODOBITS + META_DATABITS + POSBITS);
    cant_datos = parseInt(str_cant_datos, 2);

    bits_fijos = bitsfijos(numero_data_bits, modo);
    bits_var = bitsvariables(numero_data_bits, modo);

    let errmsg = "El código del recuento es incorrecto.";
    if (bits_fijos < 0 || bits_var < 0) return Array(0, 0, errmsg, 0);

    bindatos = binstr.slice(offset + MODOBITS + META_DATABITS + POSBITS, offset + MODOBITS + META_DATABITS + POSBITS + cant_datos * bits_fijos);

    datos = [];
    for (var i = 0; i < bindatos.length; i += bits_fijos) {
        bindato = bindatos.slice(i, i + bits_fijos);
        datos.push(parseInt(bindato, 2));
    }

    // Obtiene la sección de bits variables.
    bindatosvariables = binstr.slice(offset + MODOBITS + META_DATABITS + POSBITS + cant_datos * bits_fijos)

    // Obtiene la longitud de la sección variable, sin tener en cuenta el padding.
    longitud_ajustada =
        Math.floor(bindatosvariables.length / (POSBITS + bits_var)) *
        (POSBITS + bits_var);

    // Reajusta el array de datos variables según la longitud sin padding.
    bindatosvariables = bindatosvariables.slice(0, longitud_ajustada);

    for (var i = 0; i < bindatosvariables.length; i += POSBITS + bits_var) {
        bindatovariable = bindatosvariables.slice(i, i + POSBITS + bits_var);
        let pos_str = bindatovariable.slice(0, POSBITS);
        let pos = parseInt(pos_str, 2);

        let valor_str = bindatovariable.slice(POSBITS);
        let valor = parseInt(valor_str, 2) * Math.pow(2, bits_fijos);
        datos[pos] = datos[pos] + valor;
    }
    return datos;
}

function unpack_dumb(binstr, bits) {
    datos = [];
    for (var i = 0; i < binstr.length; i += bits) {
        dato = binstr.slice(i, i + bits);
        datos.push(parseInt(dato, 2));
    }
    return datos;
}

function checkHex(n) {
    return /^[0-9A-Fa-f]+$/.test(n);
}

function Hex2Bin(n) {
    if (!checkHex(n)) {
        return 0;
    }
    var big_string = "";
    for (var i = 0; i < n.length; i += 2) {
        var part = n.slice(i, i + 2);
        var binario = parseInt(part, 16).toString(2);
        binario = new Array(9 - binario.length).join("0") + binario;
        big_string += binario;
    }
    return big_string;
}


function bitsfijos(databits, modo) {
    /* Devuelve la cantidad de bits fijos que tiene el modo indicado según
        los databits usados
    */
    modos = BITSMODO[databits]
    if (modo in modos) return modos[modo][0]
    else return -1
}


function bitsvariables(databits, modo) {
    /* Devuelve la cantidad de bits variables que tiene el modo indicado según
        los databits usados
    */
    modos = BITSMODO[databits]
    if (modo in modos) return modos[modo][1]
    else return -1 
}