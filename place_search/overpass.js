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
  startLoading();
  try {
    console.log("running query", search.value);

    result = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: "data=" + encodeURIComponent(search.value),
      }
    ).then((data) => data.json());
    console.log("received overpass response", result);

    table = grist.getTable();
    result.elements.forEach(element => {
      table.create({
        fields: {
          name: element.tags.name,
        }
      });
    });

  } catch (e) {
    alert(e);
  }
  stopLoading();
}
