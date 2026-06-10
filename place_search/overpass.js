button = document.getElementById("overpass");
button.addEventListener("click", update);

search = document.getElementById("overpass_query");

function startLoading() {
  button.ariaBusy = true;
}

function stopLoading() {
  button.ariaBusy = false;
}

grist.ready({
  requiredAccess: 'full'
});

async function update() {
  console.log("running query", search.value);
}
