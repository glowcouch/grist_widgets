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

    // query on overpass
    let result = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: "data=" + encodeURIComponent(search.value),
      }
    ).then((data) => data.json());
    console.log("received overpass response", result);

    let table = grist.getTable();
    table.create(await Promise.all(result.elements.map(async (element) => {
      // lookup on nomanatim for display address
      let id = element.id;
      let lookup = (fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=W${id}&format=json&extratags=1`).then(response => response.json()))[0];

      return {
        fields: {
          name: element.tags.name,
          address: lookup.display_name,
          website: element.tags.website,
          phone: element.tags.phone,
        }
      };
    })));

  } catch (e) {
    alert(e);
  }
  stopLoading();
}
