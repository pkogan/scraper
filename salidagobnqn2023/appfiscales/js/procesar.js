var modo_desktop = false; // para cuando se cuelga online
var _cache_json = {};
var ubicacion = null;
var agrupaciones_a_mostrar = ["Lista"]; // "Lista" debería estar siempre

async function procesar(qr_data, success, error) {
    // Desempaqueta los datos.
    var data = unpack(qr_data);

    // Valores de votos.
    var valores = data[2];

    // Obtiene la mesa.
    var mesa = await _get_mesa(data[0]);

    // Si la mesa NO es válida...
    if (!mesa) {
        error();
        return;
    }

    // Si la mesa es válida...
    // Carga los datos de la ubicación.
    ubicacion = mesa.cod_datos;
    _palier_load_data().then(() => {
        // Carga el grupo de categorías a procesar.
        let categorias = local_data.categorias.many({ sorted: "posicion" });

        // Obtiene los candidatos, los filtra según categoría, y los ordena absolutamente.
        var candidatos = local_data.candidaturas.many();
        candidatos = candidatos
            .filter((c) =>
                categorias.map((cat) => cat.codigo).includes(c.cod_categoria)
            )
            .sort(ordenar_absolutamente);

        // Asigna los votos a los candidatos.
        var votos = {};
        var cat_especiales = [];
        for (const candidato of candidatos) {
            if (candidato.clase == "Candidato" || candidato.clase == "Blanco") {
                // Si el candidato es 'seleccionable'...
                const voto = valores.shift();
                votos[candidato.id_umv] = voto;
            } else if (candidato.clase == "Especial") {
                // Si el tipo de candidato es 'especial'...
                if (cat_especiales.indexOf(candidato.id_candidatura) == -1) {
                    cat_especiales.push(candidato.id_candidatura);
                }
            }
        }

        // Obtiene las agrupaciones correspondientes a los candidatos disponibles.
        var cod_listas_candidatos = candidatos
            .map((c) => c.cod_lista)
            .filter((c) => c != "");
        var agrupaciones = local_data.agrupaciones
            .many()
            .filter((a) => cod_listas_candidatos.includes(a.codigo))
            .filter((a) => agrupaciones_a_mostrar.indexOf(a.clase) !== -1)
            .sort(ordenar_absolutamente);

        // Genera la tabla de recuento.
        let tabla_recuento = generar_tabla_recuento(
            categorias,
            agrupaciones,
            votos
        );

        // Genera la tabla de información adicional.
        let tabla_info_adicional = generar_tabla_info_adicional(
            cat_especiales,
            valores
        );

        // Invoca a la funcion de éxito.
        success({
            tabla_recuento,
            tabla_info_adicional,
            mesa,
        });
    });
}

function generar_tabla_recuento(categorias, agrupaciones, votos) {
    var tabla = [];

    // Genera la fila del encabezado.
    var row = ["Clase", "Nro.", "Agrupación"];
    // Agrega los cargos a la fila del encabezado.
    row.push(...categorias.map((c) => c.codigo));
    tabla.push(row);

    // Itera por agrupación y genera las filas con los votos para cada categoría.
    for (let agrupacion of agrupaciones.filter((a) => a.clase == "Lista")) {
        let row = [
            agrupacion.clase,
            agrupacion.numero != null ? agrupacion.numero : "-",
            agrupacion.nombre,
        ];

        for (let categoria of categorias) {
            // Busca el candidato correspondiente a la actual agrupación y categoría.
            let candidato = local_data.candidaturas.one({
                cod_categoria: categoria.codigo,
                cod_lista: agrupacion.codigo,
            });
            row.push(candidato ? votos[candidato.id_umv] : "-");
        }
        tabla.push(row);
    }

    // Agrega las candidaturas 'blancas' de cada categoría.
    row = ["Blanco", "Votos en blanco"];
    for (let categoria of categorias) {
        let candidato = local_data.candidaturas.one({
            cod_categoria: categoria.codigo,
            clase: "Blanco",
        });
        row.push(candidato ? votos[candidato.id_umv] : "-");
    }
    tabla.push(row);

    return tabla;
}

/**
 * Genera la tabla de información adicional que incluye cantidad de boletas
 * contadas, de votos nulos, de votos a computar, y el total general.
 * @param {*} cat_especiales
 * @param {*} valores
 * @returns Tabla de información adicional.
 */
function generar_tabla_info_adicional(cat_especiales, valores) {
    let tabla = [];

    // Prepara los campos adicionales.
    let cantidad_selecciones = valores.shift();
    let cantidad_ciudadanos = valores.shift();

    // Prepara los votos especiales.
    let votos_especiales = {};
    cat_especiales = _.sortBy(cat_especiales);
    for (let i in cat_especiales) {
        votos_especiales[cat_especiales[i]] = valores.shift();
    }

    // Agrega el total de boletas contadas.
    tabla.push(["Total", "Total de boletas contadas", cantidad_selecciones]);

    // Agrega las listas 'especiales'.
    for (let key in votos_especiales) {
        let especial = local_data.candidaturas.one({ id_candidatura: key });
        tabla.push(["Especial", especial.nombre, votos_especiales[key]]);
    }

    // Agrega el total de ciudadanos.
    tabla.push(["Total", "Total General", cantidad_ciudadanos]);

    return tabla;
}

const _get_mesa = async (codigo) => {
    return (await _get_mesas()).find((m) => m.id_unico_mesa == codigo);
};

const _get_mesas = async () => {
    let data_mesas = _cache_json.mesas;
    if (typeof data_mesas == "undefined") {
        const response = await fetch("./datos/Ubicaciones.json");
        data_mesas = await response.json();
        _cache_json.mesas = data_mesas;
    }
    return data_mesas;
};
