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

document.addEventListener("click", (e) => {
  if (e.target.matches("#btn-encriptar")) {
    encriptar(true, letrasRegex);
  } else if (e.target.matches("#btn-desencriptar")) {
    encriptar(false, letrasEncriptadasRegex);
  }
});

navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
  if (result.state === "granted" || result.state === "prompt") {
    clipboardIsAvailable = true;
  }
});

function copiarTexto() {
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

function encriptar(encrypt, regex) {
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
    textoIngresado.value = "";
    enableResponseTextInput();
  } else {
    enableResponseTextInput(false);
  }
}

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

function enableResponseTextInput(enable = true) {
  if (enable) {
    contenedorIlustracion.classList.add("none");
    contenedorTextoRespuesta.classList.remove("none");
  } else {
    contenedorIlustracion.classList.remove("none");
    contenedorTextoRespuesta.classList.add("none");
  }
}

textoIngresado.addEventListener("keyup", () => {
  const pattern = textoIngresado.dataset.pattern;
  const regex = new RegExp(pattern);

  if (pattern && textoIngresado.value !== "") {
    return !regex.exec(textoIngresado.value)
      ? changeButtonStatus(true)
      : changeButtonStatus(false);
  }
});

botonCopiar.addEventListener("click", () => {
  copiarTexto();
});
