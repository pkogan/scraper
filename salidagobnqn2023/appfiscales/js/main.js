"use strict";

var local_data = {};
var prevenir_resize = true;
let html5QrCode = null;
let config = null;
let qrCodeSuccessCallback = null;
// Indica si el 'código' de mesa se debe utilizar como identificador de esta.
// Si su valor es 'falso', se utiliza el 'número'.
var USE_CODE_AS_MESA_ID = false;

// Identificador de mesa a mostrar (número o código).
var mesa_id = "-1";

document.getElementById("camera").addEventListener("click", abrir_camara);
document.getElementById("camera_cerrar").addEventListener("click", cerrar_camara);

document.getElementById("procesar").addEventListener("click", click_procesar);

document.getElementById("limpiar").addEventListener("click", limpiar);

document.querySelectorAll('a[data-toggle="tab"][href="#log"]').forEach((e) => {
    e.addEventListener("click", render_tab_log);
});

const closableAlertSelector = 'a[data-dismiss="alert"][href="#"]';
document.querySelectorAll(closableAlertSelector).forEach((e) =>
    e.addEventListener("click", (e) => {
        const alert = e.target.closest(".alert");
        alert.classList.add("hidden");
    })
);

function abrir_camara() {
    // if (qrScanner === null) return console.log("Error, no se instanció qrScanner");
    if (html5QrCode === null) return console.log("Error, no se instanció html5QrCode");
    document.getElementById("div_qr-video").style.display = "Flex";
    document.getElementById("div_qr-video").style.flexDirection = "Column";
    document.getElementById("camera").style.display = "none";
    // If you want to prefer back camera
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
    //qrScanner.start();
}

function cerrar_camara() {
    html5QrCode.stop();
    // qrScanner.stop()
    document.getElementById("div_qr-video").style.display = "none";
    document.getElementById("camera").style.display = "block";
}   

/**
 * Añade comportamiento a los grupos de pestañas para poder mostrar los paneles
 * asociados. Por ej.: en caso de seleccionar la pestaña de 'log', se debería
 * habilitar dicha pestaña y panel, ocultando el de 'home'. Lo mismo con las
 * pestañas de recuento ('tablas') y csv ('raw').
 */
document.querySelectorAll('a[data-toggle="tab"]').forEach((e) =>
    e.addEventListener("click", (e) => {
        // Obtiene el grupo asociado a la pestaña cliqueada.
        const tabGroup = e.target.closest("ul[role='tablist']");

        if (!tabGroup.hasChildNodes()) {
            return;
        }
        // Obtiene los nodos hijos del elemento 'tabGroup'.
        const childs = tabGroup.childNodes;

        // Nombre de la clase que permite activar la pestaña y su panel.
        const activeClass = "active";

        // Para cada nodo hijo del grupo de pestañas actual...
        childs.forEach((child) => {
            // Descarta aquellos que no son pestañas (i.e., que no son tipo "LI").
            if (child.nodeName != "LI") {
                return;
            }
            const button = child.querySelector("a");
            if (button) {
                // Obtiene el tabpanel asociado.
                const tabPanelName = button.getAttribute("href");
                const tabPanelSelector = tabPanelName + '[role="tabpanel"]';
                const tabPanel = document.querySelector(tabPanelSelector);

                // Si el botón evaluado es el cliqueado...
                if (button == e.target) {
                    // Lo activa, y también al panel.
                    child.classList.add(activeClass);
                    tabPanel.classList.add(activeClass);
                } else {
                    // Lo desactiva, y también al panel.
                    child.classList.remove(activeClass);
                    tabPanel.classList.remove(activeClass);
                }
            }
        });
    })
);

document.getElementById("log-clear").addEventListener("click", clear_log);

document.getElementById("share").addEventListener("click", download_csv_file);

/**
 * Permite que el textarea del qr se redimensione durante los eventos 'change',
 * 'input' o 'paste'.
 */
["change", "input", "paste"].forEach((e) => {
    document.getElementById("qr-data").addEventListener(e, resize_textarea);
});

if (modo_desktop) {
    document.querySelector(".mobile-only").classList.add("hidden");
} else {
    document.querySelector(".desktop-only").classList.add("hidden");
}

limpiar();

function cargar_datos(data) {
    local_data.categorias = new Chancleta(data.categorias);
    local_data.candidaturas = new Chancleta(data.candidaturas);
    local_data.agrupaciones = new Chancleta(data.agrupaciones);
}

function click_procesar() {
    pegar(document.getElementById("qr-data").value);
}

function pegar(data, nolog) {
    const event = new Event("change");
    let qrData = document.querySelector("#qr-data");
    qrData.value = data;
    qrData.dispatchEvent(event);
    procesar(
        data,
        function success(result) {
            mesa_id = USE_CODE_AS_MESA_ID
                ? result.mesa.codigo
                : result.mesa.numero;
            if (!nolog) {
                log_storage(mesa_id, data);
            }
            let cargoDIP = false
            if (result.mesa.numero.includes("DIP")) {
                cargoDIP = true
            } 
            render_tabla_recuento(result, cargoDIP);
            prepare_csv_recuento(
                result.tabla_recuento,
                result.tabla_info_adicional,
                cargoDIP
            );
        },
        show_error.bind(null, "El código del recuento es incorrecto.")
    );
}

function show_error(er) {
    document.querySelector("#mensaje .msg").innerHTML = er;
    document.querySelector("#mensaje").style.display = "block";

    document.getElementById("resultado").style.display = "none";
    document.getElementById("datos").innerHTML = "";

    document.querySelector("#raw-recuento").value = "";
    document.querySelector("#tabla-recuento").innerHTML = "";
}

function get_photo_native() {
    limpiar();

    if (TESTING_BROWSER) {
        get_photo("CAMERA");
    } else {
        lector();
    }
}

function get_photo(src) {
    limpiar();

    if (TESTING_BROWSER) {
        cameraOk("qr.png");
    } else {
        var opts = {
            quality: 70,
            sourceType: Camera.PictureSourceType[src],
            destinationType: Camera.DestinationType.FILE_URI,
        };
        navigator.camera.getPicture(cameraOk, cameraError, opts);
    }

    function cameraOk(uri) {
        document.getElementsByClassName("loading").addEventListener("loading");
        qrcode.callback = function (d) {
            if (d[0] == "R") {
                const promise = pegar(d);
                promise.then(() => {
                    document
                        .getElementsByClassName("loading")
                        .addEventListener("reset");
                });
            } else {
                show_error("El QR es incorrecto.");
                document
                    .getElementsByClassName("loading")
                    .addEventListener("reset");
            }
        };
        setTimeout(function () {
            qrcode.decode(uri);
        });
    }

    function cameraError(err) {
        console.err(err);
        show_error(err);
    }
}

function render_tabla_recuento(result) {
    document.getElementById("resultado").style.display = "";
    var tabla_recuento = result.tabla_recuento;

    // Renderiza tabla de recuento.
    var table_content = '<table class="table table-bordered"><tr>';
    var head_row = tabla_recuento[0].slice(1);

    for (var i in head_row) {
        if (i <= 1) {
            table_content += "<th>" + head_row[i] + "</th>";
        } else {
            table_content +=
                '<th class="centered-text">' + head_row[i] + "</th>";
        }
    }
    table_content += "</tr>";
    for (let i = 1; i < tabla_recuento.length; i++) {
        var row = tabla_recuento[i];
        var clase = row[0];
        var first_index = 3;
        table_content += '<tr class="clase_' + clase + '">';

        if (clase == "Blanco") {
            // Renderiza voto en balnco.
            table_content += '<td colspan="2">' + row[1] + "</td>";
            first_index = 2;
        } else {
            // Renderiza nro. de lista y agrupación.
            table_content += "<td>" + row[1] + "</td>";
            table_content += "<td>" + row[2] + "</td>";
        }

        for (var j = first_index; j < row.length; j++) {
            table_content += '<td class="centered-text">' + row[j] + "</td>";
        }
        table_content += "</tr>";
    }

    // Agrega filas de información adicional.
    let column_count = head_row.length;
    for (var i = 0; i < result.tabla_info_adicional.length; i++) {
        let especial = Especiales.find(especial => especial.descripcion == result.tabla_info_adicional[i][1])
        if ( typeof especial != "undefined" ) {    
        result.tabla_info_adicional[i][3] = especial.nro_orden
        }
    }
    result.tabla_info_adicional.sort((a, b) => a[3] - b[3]);
    table_content += render_rows_info_adicional(
        column_count,
        result.tabla_info_adicional
    );
    table_content += "</table>";

    document.getElementById("mensaje").style.display = "none";
    document.getElementById("datos").innerHTML =
        "<h3>Mesa: " + mesa_id + "</h3>";
    document.querySelector("#tabla-recuento").innerHTML = table_content;
}


/**
 * Prepara el csv de recuento en base a la tabla dada.
 * @param {*} tabla.
 */
function prepare_csv_recuento(tabla_recuento, tabla_info_adicional) {
    let csv = "";

    // Agrega las filas del recuento.
    for (let i in tabla_recuento) {
        for (let j in tabla_recuento[i]) {
            if (j == 0) {
                if (i == 0) {
                    csv += '"Mesa",';
                } else {
                    csv += '"' + mesa_id + '",';
                }
            }
            csv += '"' + tabla_recuento[i][j] + '"';
            if (j == tabla_recuento[i].length - 1) {
                csv += "\n";
            } else {
                csv += ",";
            }
        }
    }

    // Agrega las filas de información adicional.
    for (let row of tabla_info_adicional) {
        csv += `"${row[1]}","${row[2]}"\n`;
    }

    document.querySelector("#raw-recuento").value = csv;
}

/**
 * Renderiza las filas de información adicional, que incluyen la cantidad de
 * boletas contadas, de votos nulos, de votos a computar, y el total general.
 * @param {*} parent_column_count
 * @param {*} tabla_info_adicional
 */
function render_rows_info_adicional(parent_column_count, 
                                    tabla_info_adicional, 
                                    cargoDIP) {
    // Agrega fila separadora.
    let html_table = `<tr><td colspan=${parent_column_count}>&nbsp</td></tr>`;

    // Renderiza filas de información adicional.
    for (let row of tabla_info_adicional) {
        let clase = row[0];
        html_table += '<tr class="clase_' + clase + '">';
        if (cargoDIP) {
            html_table += `<td colspan="4">${row[1]}</td>`;
            html_table += `<td colspan="${parent_column_count}">${row[2]}</td>`;
        } else {
            html_table += `<td>${row[1]}</td>`;
            html_table += `<td colspan="${parent_column_count - 2}">${row[2]}</td>`;
            html_table += `<td></td>`;
        }
        html_table += "</tr>";
    }
    return html_table;
}

function limpiar() {
    document.getElementById("datos").innerHTML = "";
    const event = new Event("change");
    const qrData = document.getElementById("qr-data");
    qrData.value = "";
    qrData.dispatchEvent(event);
    document.getElementById("mensaje").style.display = "none";
    document.getElementById("resultado").style.display = "none";
    document.querySelector("#raw-recuento").value = "";
    document.querySelector("#tabla-recuento").innerHTML = "";
}

function log_storage(mesa, recuento) {
    var new_entry = {
        mesa: mesa,
        recuento: recuento,
        time: new Date().toTimeString(),
    };
    var log = window.localStorage.getItem("log");
    let new_entries;
    if (log) {
        var old_entries = JSON.parse(log);
        // Si ya existe, reemplaza la entrada.
        new_entries = old_entries.filter((e) => e.mesa != new_entry.mesa);
        new_entries.push(new_entry);
    } else {
        new_entries = [new_entry];
    }

    window.localStorage.setItem("log", JSON.stringify(new_entries));
}

function clear_log() {
    window.localStorage.clear();
    render_tab_log();
}

function render_tab_log() {
    const dest = document.querySelector("#log-content");
    const log = window.localStorage.getItem("log");
    dest.innerHTML = "";
    if (log) {
        const entries = JSON.parse(log);
        const ul = document.createElement("ul");
        entries.reverse().map(function (l) {
            const title = document.createElement("h4");
            title.innerText = "Mesa " + l.mesa.split("_")[0];

            const stamp = document.createElement("p");
            stamp.innerText = l.time;

            const btn = document.createElement("button");
            btn.classList.add("btn", "btn-primary");
            btn.style.marginBottom = "20px";
            btn.innerText = "Abrir";

            const li = document.createElement("li");
            li.appendChild(title);
            li.appendChild(stamp);
            li.appendChild(btn);

            li.classList.add("log");
            li.dataset.recuento = l.recuento;
            li.addEventListener("click", reprocesar);
            ul.appendChild(li);
        });

        dest.appendChild(ul);
    } else {
        dest.innerHTML = "<h4>El historial está vacío</h4>";
    }
}

function reprocesar(event) {
    var recuento = event.currentTarget.dataset.recuento;
    document.querySelector('a[data-toggle="tab"][href="#home"]').click();
    pegar(recuento, true);
}

function download_csv_file() {
    // Muestra el 'gray-overlay'.
    document.querySelector("#gray-overlay").style.display = "block";
    // Obtiene el contenido de los csv.
    let csv_recuento = document.querySelector("#raw-recuento").value;

    // Define una función que oculta el 'gray-overlay'.
    let hide_overlay = () =>
        (document.querySelector("#gray-overlay").style.display = "none");

    try {
        let hiddenElement = document.createElement('a'); 
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv_recuento);  
        hiddenElement.target = '_blank';        
        hiddenElement.download = `mesa_${mesa_id.split('_')[0]}.csv`;  
        hiddenElement.click();
        hide_overlay();

    } catch {
        hide_overlay();
    }
}

function resize_textarea() {
    /* Source:
     * https://github.com/andreypopp/react-textarea-autosize/blob/master/index.js
     */
    let diff;
    if (window.getComputedStyle) {
        var styles = window.getComputedStyle(this);
        // If the textarea is set to border-box, it's not necessary to
        // subtract the padding.
        if (
            styles.getPropertyValue("box-sizing") === "border-box" ||
            styles.getPropertyValue("-moz-box-sizing") === "border-box" ||
            styles.getPropertyValue("-webkit-box-sizing") === "border-box"
        ) {
            diff = 0;
        } else {
            diff =
                parseInt(styles.getPropertyValue("padding-bottom") || 0, 10) +
                parseInt(styles.getPropertyValue("padding-top") || 0, 10);
        }
    } else {
        diff = 0;
    }

    diff -= 5;
    this.style.height = "auto";
    this.style.height = this.scrollHeight - diff + "px";
}

function ordenar_absolutamente(a, b) {
    for (var i = 0; i < a.orden_absoluto.length; i++) {
        var val_a = a.orden_absoluto[i];
        var val_b = b.orden_absoluto[i];
        if (val_a != val_b) {
            if (typeof val_b == "undefined") {
                return 1;
            } else {
                return val_a - val_b;
            }
        }
    }
    return a.orden_absoluto.length < b.orden_absoluto.length ? -1 : 1;
}


function insertar_qr_leido(result) {
    const event = new Event("change");
    let qrData = document.querySelector("#qr-data");
    qrData.value = result;
    qrData.dispatchEvent(event);
    cerrar_camara()
}


function init_qr_scanner() {
    // QrScanner.WORKER_PATH = 'js/qr-scanner-worker.min.js';
    // const videoElem = document.getElementById("qr-video");
    // qrScanner = new QrScanner(videoElem, insertar_qr_leido);
    html5QrCode = new Html5Qrcode("qr-video");

    qrCodeSuccessCallback = (decodedText, decodedResult) => {
        /* handle success */

        // handle the scanned code as you like
        //html5QrcodeScanner.clear();
        console.log('Code matched = ${decodedText}', decodedResult);
        document.getElementById("qr-data").value = decodedText;
        click_procesar();
        cerrar_camara();
    };

    config = { fps: 10, qrbox: 250 };
};


const ready = callback => {
    const anotherCallback = () => {
        callback();
        init_qr_scanner();
    }
    if (document.readyState != "loading") anotherCallback();
    else document.addEventListener("DOMContentLoaded", anotherCallback);
}
