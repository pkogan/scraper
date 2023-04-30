function _palier_preparar_para_browser(){
    document.querySelector("html").style.overflow = "hidden";
    resize();
    detect_browser();
    if((BrowserDetect.browser == "Explorer") && (BrowserDetect.version <= 8)) {
        unsupported_browser();
    } 
    document.addEventListener("touchmove", preventBehavior, false);
    //var encabezado = document.getElementById("encabezado");
    //encabezado.addEventListener("click", requestFullScreen);
    
    _palier_agregar_pointer();
}

function _palier_agregar_pointer(){
    var css = '.candidato, #accesibilidad li, #voto_blanco, .boton-barra-individual, .opcion-tipo-voto { cursor: pointer; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}

// A partir de aca son todas las cosas relacionadas a correr la aplicacion de
// sufragio en un browser en vez de en la maquina. Deteccion de browser,
// redibujado, etc.
function detect_browser(){
    BrowserDetect.init();
}

function resize(){
    document.body.style.width = 0;
    document.body.style.height = 0;
    applyTransform(getTransform());              
}

function preventBehavior(e){
    e.preventDefault();
}

function getTransform() {
		var denominador = Math.max(
			1366 / window.innerWidth,
			768 / window.innerHeight
		);

    denominador = Math.min(1, 1 / denominador);
    return 'scale(' + (denominador) + ')';
}

function applyTransform(transform) {
    document.body.style.WebkitTransform = transform;
    document.body.style.MozTransform = transform;
    document.body.style.msTransform = transform;
    document.body.style.OTransform = transform;
    document.body.style.transform = transform;
}   

function unsupported_browser(){
    const div = document.querySelector("#notice"); 
    document.querySelector("#seleccionar_ubicacion").style.display = "none";
    if(div.length === 0){
        constants['PATH_TEMPLATES_MODULOS'] = ""
        fetch_template("unsupported_browser", "templates").then((template) => {
			document.querySelector('#contenedor_izq').innerHTML += template(); 
		})
    }
    div.style.display = "";
}

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.userAgent,
			subString: "Aurora",
			identity: "Aurora"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
}

function getUrlVar(name){
	return getUrlVars()[name];
}


function requestFullScreen(){
	if (fullScreenElement()){
		exitFullScreen();
	} else {
		triggerFullScreen();
	}
}

function triggerFullScreen(){
	var elementDom = document.getElementsByTagName('body')[0];
	elementDom.requestFullscreen = elementDom.requestFullscreen ||
	elementDom.mozRequestFullScreen || elementDom.webkitRequestFullscreen ||
	elementDom.msRequestFullscreen;

	elementDom.requestFullscreen();
}

function exitFullScreen(){
	var elementDom = document;
    elementDom.exitFullscreen = elementDom.exitFullscreen || document.mozCancelFullScreen || elementDom.webkitExitFullscreen || elementDom.msExitFullscreen;
    elementDom.exitFullscreen();
}


function fullScreenElement(){
	var element = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
	return element;
}
function get_url_function() {
   /* hacemos override de esto para hacer que no le pegue a ninguna URL*/ 
}

function click_si_simulador(){
    // Hacemos override del click_is para adecuar al comportamiento del
    // simulador.
    var ubic_preseteada = getUrlVar('ubicacion');   
    if (typeof(ubic_preseteada) != "undefined") {
        window.location = "$ubicacion";
    } else {
        history.go(0);
    }
}
function run_op(operacion, data){
    // Misma implementacion que zaguan.js
    func = window[operacion];
    data = JSON.parse(data);
    func(data);
}

function log(msg){
    send('log', msg);
}

function send(action, data) {
    // Implementamos send para que corra la accion de palier.
    _palier_get_action(action, data);
}

function _palier_load_data(){
    /*
     *  Trae los datos de la eleccion y se lo manda al "cargar_datos" del local
     *  controller. Simulando lo que haría el controller.py del modulo sufragio
     *  via Zaguan.
     */
    const url_prefix = `./datos/${ubicacion}`;
    const categorias_json = "Categorias.json";
    const candidaturas_json = "Candidaturas.json";
    const agrupaciones_json = "Agrupaciones.json";
    const boletas_json = "Boletas.json";

    const sort_by_posicion = (data) => {
        const data_clone = [...data]
        sortJsonArrayByProperty(data_clone, "posicion")
        return data_clone
    }

    const all_promises = [
        fetch(`${url_prefix}/${categorias_json}`).then((data) => data.json()),
        fetch(`${url_prefix}/${candidaturas_json}`).then((data) => data.json()),
        fetch(`${url_prefix}/${agrupaciones_json}`).then((data) => data.json()),
        fetch(`${url_prefix}/${boletas_json}`).then((data) => data.json())
    ]

    return new Promise((resolve, reject) => {
        Promise.all(
            all_promises
        ).then(([
            categorias,
            candidaturas,
            agrupaciones,
            boletas
        ]) => {
            const controller_data = {
                categorias: sort_by_posicion(categorias),
                candidaturas,
                agrupaciones,
                boletas
            };            
            cargar_datos(controller_data);
            resolve();
        }).catch(error => reject(error));
    
    })
}

// Si es el simulador generado para una ubicacion especifica se hace un replace
// de $default_ubicacion por la ubicacion en el generador de simulador
var ubicacion = "$default_ubicacion";

function action_get_ubicacion(){
    /*
    * Maneja la inicializacion de una ubicacion del simulador.  
    */ 
    var ubic_preseteada = getUrlVar('ubicacion');
    if (typeof(ubic_preseteada) != "undefined") {
        ubicacion = ubic_preseteada;    
        action_inicio(data => {
		callback_constants(
            data, 
            () => {
                _palier_header_ubicacion(ubicacion);
                _palier_cargar_pantalla_inicial();    
            }
        )
	});
    } else if (ubicacion != "$default_ubicacion") {
        action_inicio( (data) => {
            callback_constants(
                data, 
                () => _palier_cargar_pantalla_inicial()
            )
        });
    } else { 
        fetch("./ubicaciones.json").then(
            response => response.json()
        ).then(
            data => callback_ubicaciones(data)
        );    
    }
}

function callback_ubicaciones(data){
    /* Si se vota un solo juego de datos/ubicación salteamos la seleccion. */
    if(data.length > 1){
        _palier_mostrar_menu_ubicaciones(data);
    } else {
        _palier_cargar_ubicacion(data[0][2]);
    }
}

function _palier_mostrar_menu_ubicaciones(data){
    /*
    * Muestra el menu de ubicaciones.
    * */
    const mostrar_menu_ubicaciones = () => {
        document.querySelector("#seleccionar_ubicacion").style.display = "block";
        document.querySelector("#contenedor_pantallas").style.display = "none";
        //patio.barra_opciones.hide();
    }

    const div = document.querySelector("#seleccionar_ubicacion");
    if (!div){
        _palier_cargar_botones_ubicaciones(data).then(() => {
            mostrar_menu_ubicaciones()
        })
        return;
    }
    mostrar_menu_ubicaciones();
}

const _palier_cargar_botones_ubicaciones = (data) => {
    constants['PATH_TEMPLATES_MODULOS'] = ""
    return new Promise((resolve, reject) => {
        fetch_template("botones_ubicaciones", "templates").then((template) => {
            const html = template(
                {
                    "data": data, 
                    "dos_cols": data.length > 20
                }
            );
            document.querySelector('#contenedor_izq').innerHTML += html;
            document.querySelector("#ubicaciones").addEventListener(
                "click", 
                _palier_click_ubicacion
            );
            resolve();      
        }).catch((error) => reject(error));
    });
} 

function _palier_click_ubicacion(event){
    /*
     * Maneja el click en una ubicacion del menu del simulador.
     */
    const tiene_clase_candidato = event.target.classList.contains("candidato");
    if (!tiene_clase_candidato) return;
    var parts = event.target.id.split("_");
    _palier_cargar_ubicacion(parts[1]);
}

function _palier_cargar_ubicacion(nueva_ubic){
    /*
     * Carga la ubicacion y arranca el simulador
     */
    const seleccionar_ubic = document.querySelector("#seleccionar_ubicacion");
    if (seleccionar_ubic !== null) {
        seleccionar_ubic.style.display = "none";
    }
    document.querySelector("#contenedor_pantallas").style.display = "";
    ubicacion = nueva_ubic;    
    action_inicio(
        (data) => {
    	    callback_constants(
                data, 
                () => {
                    _palier_header_ubicacion(ubicacion);
                    _palier_cargar_pantalla_inicial();
                }
            );    
        }
    )
}


function _palier_header_ubicacion(cod_ubicacion){
    /*
     * Modifica el header de la ubicacion especialmente para el simulador
     */
    document.body.setAttribute('data-ubicacion', cod_ubicacion);
    const departamento_seleccionado = window.localStorage.getItem("departamento_seleccionado");
    const localidad_seleccionada = window.localStorage.getItem("localidad_seleccionada");
    if (departamento_seleccionado != "") {
        if(localidad_seleccionada != ""){
            document.querySelector("#_txt_titulo").textContent = `${departamento_seleccionado} - ${localidad_seleccionada}`;
        } else {
            document.querySelector("#_txt_titulo").textContent = departamento_seleccionado;
        }
    } else {
        fetch("/ubicaciones.json").then(
            response => response.json()
        ).then( data => {
            data.forEach((ubicacion) => {
                console.log(cod_ubicacion + ' - ' +ubicacion)
                if(ubicacion[2] !== cod_ubicacion) return;
                if(ubicacion[0] != ""){
                    document.querySelector("#_txt_titulo").textContent = `${ubicacion[0]} - ${ubicacion[1]}`;
                } else {
                    document.querySelector("#_txt_titulo").textContent = ubicacion[1];
                }
            });
        });
    }
    document.querySelector("#_txt_fecha").textContent = "Elección de demostración - Uso no oficial";
}

function action_inicio(callback){
    /*
     * Carga las constants de la ubicacion.
     */
   fetch("./constants/" + ubicacion +  ".json").then(
	   r => r.json()
   ).then(
	   data => callback(data)
   );
}

function callback_constants(data, callback){
    set_constants(data).then(
        () => callback(data)
    )
}
function _palier_registar_helpers(){
    registrar_helper_colores();
    registrar_helper_imagenes();
    registrar_helper_i18n();
    Handlebars.registerHelper('split', function(ubicacion) {
      var ubics = ubicacion[2].split(";");

      if(ubics.length === 1){
        return new Handlebars.SafeString("<div class='candidato' style='height:50px;margin:5px;width:200px;float:left;font-size: 0.87em' id='ubicacion_"+ubicacion[2]+
              "'>"+ubicacion[0]+"<br />"+
                    "<strong>"+ubicacion[1]+"</strong>"+
                "</div>");
      }else{
        var style_normal="style='display:block;height:35px;margin:5px; margin-bottom:0px;padding-bottom:0px;width:200px;float:left;font-size: 0.77em;" +
            "border-bottom-right-radius: 0px;" +
            "border-bottom-left-radius: 0px;" +
            "border-bottom-style: none;" +
            "'"
        var style_extranjera=   "style='display:block;height:15px;margin:5px; margin-top:0px;padding-top:0px;width:200px;float:left;font-size: 0.57em;" +
                                "border-top-style: none;" +
                                "border-top-left-radius: 0px;" +
                                "border-top-right-radius: 0px;" +
                                "background-color: #dee1e2;" +
                                "'";
        return new Handlebars.SafeString(
                "<div class='candidato' "+style_normal+" id='ubicacion_"+ubics[0]+"'>"+
                            ubicacion[0]+"<br/>"+
                    "<strong>"+ubicacion[1]+"</strong>"+
                "</div>"+
                "<div class='candidato' "+style_extranjera+" id='ubicacion_"+ubics[1]+"'>"+
                            "<p style='margin-top: 3px'>Extranjera</p>"+
                "</div>"

        );
      }

    });
}

function _palier_get_action(action, data){
    /* 
    * Simula ser el controller.py del modulo sufragio 
    */

    //console.log("getting action" + action, data);
    switch(action){
      case "document_ready":
          _palier_registar_helpers();
          action_get_ubicacion();
          break;   
      case "prepara_impresion":
          break;
      case "confirmar_seleccion":
          break;
      default:
          //console.log(action + " no implementado")

    }

    // Me fijo si tengo incluidas las developer tools del 'web_server'.
    try{
        devel_tools_callback();
    } catch(error){
        /* */
    }
}

function _palier_cargar_pantalla_inicial(){
    /*
     * Arranca carga la pantalla inicial de votacion haciendo un para de cosas
     * especificas de Palier que Zaguan hace de otra manera.
     */
    _palier_load_data().then(() => {
        patio.pantalla_modos.add_click_event("callback_click");
        patio.si_confirmar_voto.remove_click_event();
        patio.si_confirmar_voto.callback_click = click_si_simulador;
        patio.si_confirmar_voto.add_click_event("callback_click");
        patio.no_confirmar_voto.add_click_event("callback_click");
        cargar_pantalla_inicial();   
        bindear_botones(); 
    })
}

function _palier_document_ready(){
    /*
     * Callback de document_ready que imita el evento de zaguan"/
     */
    if(typeof(prevenir_resize) == "undefined"){
        // Old IE compat
        var func = null;
        if(window.addEventListener){
            func = window.addEventListener;
        } else {
            func = window.attachEvent;
        }

        func('resize', function (e) { 
            resize();
        }, false);                                       

        _palier_preparar_para_browser();
    }
}

ready(_palier_document_ready);

