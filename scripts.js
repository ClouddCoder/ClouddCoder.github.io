const botonEncriptar = document.getElementById("btn-encriptar");
const botonDesencriptar = document.getElementById("btn-desencriptar");
const botonCopiar = document.getElementById("btn-copiar");
const contenedorTextoRespuesta = document.querySelector(".container__mensaje");
const contenedorIlustracion = document.querySelector(".container__ilustracion");
const textoIngresado = document.getElementById("texto-ingresado");
const textoRespuesta = document.getElementById("texto-respuesta");
const mensajeError = document.getElementById("mensaje-error");
const letras = ["e", "i", "a", "o", "u"];
const letrasEncriptadas = ["enter", "imes", "ai", "ober", "ufat"];
const letrasRegex = new RegExp("e|i|a|o|u", "g");
const letrasEncriptadasRegex = new RegExp("enter|imes|ai|ober|ufat", "g");
let fraseConvertida = "";
let clipboardIsAvailable = false;

/**
 * Delega los eventos de click a los botones de encriptar y desencriptar
 */
document.addEventListener("click", (e) => {
  if (e.target.matches("#btn-encriptar")) {
    encriptar(true, letrasRegex);
  } else if (e.target.matches("#btn-desencriptar")) {
    encriptar(false, letrasEncriptadasRegex);
  }
  onInput(textoIngresado);
});

/**
 * Ajusta el alto del textarea cada vez que se escribe
 */
textoIngresado.addEventListener("input", () => onInput(textoIngresado));

/**
 * Ajusta el alto del textarea de acuerdo al contenido
 * @param {element} textArea - Elemento DOM textarea
 */
function onInput(textArea) {
  textArea.style.height = "auto";
  textArea.style.height = textArea.scrollHeight + "px";
}

/**
 * Revisa si el navegador soporta la API de Clipboard
 */
navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
  if (result.state === "granted" || result.state === "prompt") {
    clipboardIsAvailable = true;
  }
});

/**
 * Copia el texto del textarea de respuesta al portapapeles
 */
function copiarTexto() {
  // Si el navegador no soporta la API de Clipboard
  if (!clipboardIsAvailable) {
    textoRespuesta.select();
    document.execCommand("copy");
  } else {
    navigator.clipboard.writeText(textoRespuesta.value).then(
      () => "Copiado al portapapeles",
      () => "No se pudo copiar al portapapeles",
    );
  }
}

/**
 * Encripta o desencripta el texto ingresado
 * @param {boolean} encrypt - Indica si se encripta o desencripta
 * @param {array} regex - Expresión regular para reemplazar
 */
function encriptar(encrypt, regex) {
  // Borra el texto de la respuesta anterior
  fraseConvertida = "";
  let value = textoIngresado.value;

  if (value !== "") {
    if (encrypt) {
      fraseConvertida = value.replace(regex, (match) => {
        return letrasEncriptadas[letras.indexOf(match)];
      });
    } else {
      fraseConvertida = value.replace(regex, (match) => {
        return letras[letrasEncriptadas.indexOf(match)];
      });
    }

    textoRespuesta.value = fraseConvertida;
    // Borra el texto ingresado anterior
    textoIngresado.value = "";
    enableResponseTextInput();
    onInput(textoRespuesta);
  } else {
    enableResponseTextInput(false);
  }
}

/**
 * Habilita o deshabilita los botones de encriptar y desencriptar si hay un error en el texto ingresado
 * @param {boolean} disable - Indica si se deshabilita o habilita el botón
 */
function changeButtonStatus(disable) {
  if (disable) {
    mensajeError.classList.add("is-active");
    botonEncriptar.classList.add("disabled", "noHover");
    botonEncriptar.disabled = true;
    botonDesencriptar.classList.add("disabled", "noHover");
    botonDesencriptar.disabled = true;
  } else {
    mensajeError.classList.remove("is-active");
    botonEncriptar.classList.remove("disabled", "noHover");
    botonEncriptar.disabled = false;
    botonDesencriptar.classList.remove("disabled", "noHover");
    botonDesencriptar.disabled = false;
  }
}

/**
 * Muestra u oculta el textarea de respuesta o la ilustración
 * @param {boolean} enable - Indica si se muestra o oculta el textarea de respuesta
 */
function enableResponseTextInput(enable = true) {
  if (enable) {
    contenedorIlustracion.classList.add("none");
    contenedorTextoRespuesta.classList.remove("none");
  } else {
    contenedorIlustracion.classList.remove("none");
    contenedorTextoRespuesta.classList.add("none");
  }
}

/**
 * Revisa si el texto ingresado cumple con el patrón
 */
textoIngresado.addEventListener("keyup", () => {
  const pattern = textoIngresado.dataset.pattern;
  const regex = new RegExp(pattern);

  if (pattern && textoIngresado.value !== "") {
    return !regex.exec(textoIngresado.value)
      ? changeButtonStatus(true)
      : changeButtonStatus(false);
  }
});

/**
 * Copia el texto del textarea de respuesta al portapapeles
 */
botonCopiar.addEventListener("click", () => {
  copiarTexto();
});
