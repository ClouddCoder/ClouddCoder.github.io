const botonEncriptar = document.getElementById("btn-encriptar");
const botonDesencriptar = document.getElementById("btn-desencriptar");
const botonCopiar = document.getElementById("btn-copiar");
const formTextoRespuesta = document.querySelector(".form-texto-respuesta");
const textoIngresado = document.getElementById("texto-ingresado");
const textoRespuesta = document.getElementById("texto-respuesta");
const mensajeError = document.getElementById("mensaje-error");
const avisoSinTexto = document.querySelector(".container__ilustracion");
const letras = ["e", "i", "a", "o", "u"];
const letrasEncriptadas = ["enter", "imes", "ai", "ober", "ufat"];
const letrasRegex = new RegExp("e|i|a|o|u", "g");
const letrasEncriptadasRegex = new RegExp("enter|imes|ai|ober|ufat", "g");
let fraseConvertida = "";
let clipboardIsAvailable = false;

navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
  if (result.state === "granted" || result.state === "prompt") {
    clipboardIsAvailable = true;
    console.log("Clipboard API is available");
  } else {
    console.log("Clipboard API is not available");
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

function enableResponseTextInput() {
  avisoSinTexto.classList.add("none");
  formTextoRespuesta.classList.remove("none");
  botonCopiar.classList.remove("none");
}

document.addEventListener("click", (e) => {
  if (e.target.matches("#btn-encriptar")) {
    encriptar(true, letrasRegex);
    enableResponseTextInput();
  } else if (e.target.matches("#btn-desencriptar")) {
    encriptar(false, letrasEncriptadasRegex);
    enableResponseTextInput();
  }
});

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
