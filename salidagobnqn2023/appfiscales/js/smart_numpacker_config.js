const MAXBITS=2464
const POSBITS=11
const META_DATABITS=4
const DATABITS_MAX={1: 1, 2: 3, 3: 7, 4: 15, 5: 31, 6: 63, 7: 127, 8: 255, 9: 511, 10: 1023, 11: 2047, 12: 4095, 13: 8191, 14: 16383, 15: 32767}
const MODOBITS=3
const BITSMODO={1: {0: [1, 0], 1: [1, 0], 2: [1, 0], 3: [1, 0], 4: [1, 0], 5: [1, 0], 6: [1, 0], 7: [1, 0]}, 2: {0: [1, 1], 1: [2, 0], 2: [2, 0], 3: [2, 0], 4: [2, 0], 5: [2, 0], 6: [2, 0], 7: [2, 0]}, 3: {0: [1, 2], 1: [2, 1], 2: [3, 0], 3: [3, 0], 4: [3, 0], 5: [3, 0], 6: [3, 0], 7: [3, 0]}, 4: {0: [1, 3], 1: [2, 2], 2: [3, 1], 3: [4, 0], 4: [4, 0], 5: [4, 0], 6: [4, 0], 7: [4, 0]}, 5: {0: [1, 4], 1: [2, 3], 2: [3, 2], 3: [4, 1], 4: [5, 0], 5: [5, 0], 6: [5, 0], 7: [5, 0]}, 6: {0: [1, 5], 1: [2, 4], 2: [3, 3], 3: [4, 2], 4: [5, 1], 5: [6, 0], 6: [6, 0], 7: [6, 0]}, 7: {0: [1, 6], 1: [2, 5], 2: [3, 4], 3: [4, 3], 4: [5, 2], 5: [6, 1], 6: [7, 0], 7: [7, 0]}, 8: {0: [1, 7], 1: [2, 6], 2: [3, 5], 3: [4, 4], 4: [5, 3], 5: [6, 2], 6: [7, 1], 7: [8, 0]}, 9: {0: [1, 8], 1: [2, 7], 2: [3, 6], 3: [4, 5], 4: [5, 4], 5: [6, 3], 6: [7, 2], 7: [8, 1]}, 10: {0: [1, 9], 1: [2, 8], 2: [3, 7], 3: [4, 6], 4: [5, 5], 5: [6, 4], 6: [7, 3], 7: [8, 2]}, 11: {0: [1, 10], 1: [2, 9], 2: [3, 8], 3: [4, 7], 4: [5, 6], 5: [6, 5], 6: [7, 4], 7: [8, 3]}, 12: {0: [1, 11], 1: [2, 10], 2: [3, 9], 3: [4, 8], 4: [5, 7], 5: [6, 6], 6: [7, 5], 7: [8, 4]}, 13: {0: [1, 12], 1: [2, 11], 2: [3, 10], 3: [4, 9], 4: [5, 8], 5: [6, 7], 6: [7, 6], 7: [8, 5]}, 14: {0: [1, 13], 1: [2, 12], 2: [3, 11], 3: [4, 10], 4: [5, 9], 5: [6, 8], 6: [7, 7], 7: [8, 6]}, 15: {0: [1, 14], 1: [2, 13], 2: [3, 12], 3: [4, 11], 4: [5, 10], 5: [6, 9], 6: [7, 8], 7: [8, 7]}}
const MAXDATOS=2047
const OFFSETMESA=0
const BITS_NUMERO_MESA=17
const SMART_PACKING=true
const Especiales=[
    {
        "id_especial": "BLC",
        "clase": "Blanco",
        "descripcion": "Voto en BLANCO",
        "descripcion_corta": "BLC",
        "texto_asistida": "Voto en BLANCO",
        "nro_orden": "994",
        "voto_positivo": "SI"
    },
    {
        "id_especial": "IMP",
        "clase": "Especial",
        "descripcion": "Votos IMPUGNADOS",
        "descripcion_corta": "IMP",
        "texto_asistida": "Votos IMPUGNADOS",
        "nro_orden": "995",
        "voto_positivo": "NO"
    },
    {
        "id_especial": "OBS",
        "clase": "Especial",
        "descripcion": "Votos OBSERVADOS",
        "descripcion_corta": "OBS",
        "texto_asistida": "Votos OBSERVADOS",
        "nro_orden": "997",
        "voto_positivo": "NO"
    },
    {
        "id_especial": "REC",
        "clase": "Especial",
        "descripcion": "Votos RECURRIDOS",
        "descripcion_corta": "REC",
        "texto_asistida": "Votos RECURRIDOS",
        "nro_orden": "996",
        "voto_positivo": "NO"
    },
    {
        "id_especial": "NUL",
        "clase": "Especial",
        "descripcion": "Votos NULOS",
        "descripcion_corta": "NUL",
        "texto_asistida": "Votos NULOS",
        "nro_orden": "998",
        "voto_positivo": "NO"
    },
    {
        "id_especial": "TEC",
        "clase": "Especial",
        "descripcion": "Votos NO LE\u00cdDOS POR MOTIVOS T\u00c9CNICOS",
        "descripcion_corta": "TEC",
        "texto_asistida": "Votos NO LE\u00cdDOS POR MOTIVOS T\u00c9CNICOS",
        "nro_orden": "999",
        "voto_positivo": "NO"
    }
]