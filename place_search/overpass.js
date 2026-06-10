let button = document.getElementById("overpass");
button.addEventListener("click", update);

let search = document.getElementById("overpass_query");

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

    let result = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: "data=" + encodeURIComponent(search.value),
      }
    ).then((data) => data.json());
    console.log("received overpass response", result);

    let table = grist.getTable();
    table.create(result.elements.map(element => {
      return {
        fields: {
          name: element.tags.name,
          address: element.tags["addr:housenumber"] + " " + element.tags["addr:street"] + " " + element.tags["addr:suburb"],
          website: element.tags.website,
          phone: element.tags.phone,
        }
      };
    }));

  } catch (e) {
    alert(e);
  }
  stopLoading();
}
