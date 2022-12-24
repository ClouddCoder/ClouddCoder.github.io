const botonEncriptar = document.getElementById("btn-encriptar");
const botonDesencriptar = document.getElementById("btn-desencriptar");
const botonCopiar = document.getElementById("btn-copiar");
const textoIngresado = document.getElementById("texto-ingresado");
const textoRespuesta = document.getElementById("texto-respuesta");
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

botonEncriptar.addEventListener("click", () => {
  encriptar(true, letrasRegex);
});

botonDesencriptar.addEventListener("click", () => {
  encriptar(false, letrasEncriptadasRegex);
});

botonCopiar.addEventListener("click", () => {
  copiarTexto();
});
