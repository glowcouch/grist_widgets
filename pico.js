// hacky way to load picocss
async function loadPico() {
  pico = await fetch("https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css");
  style = document.createElement("style");
  style.innerHTML = await pico.text();
  document.head.appendChild(style);
}

loadPico();
