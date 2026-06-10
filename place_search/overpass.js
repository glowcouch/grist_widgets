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
    let records = [];
    for (const element of result.elements) {
      // lookup on nomanatim for display address
      let id = element.id;
      let type;
      if (element.type == 'way') {
        type = 'W';
      } else if (element.type == 'node') {
        type = 'N';
      } else if (element.type == 'relation') {
        type = 'R';
      }

      console.log("fetching nominatim for", id);
      let lookup = (await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${type}${id}&format=json&extratags=1`).then(response => response.json()))[0];
      console.log("received nominatim response", lookup);

      // wait so that nominatim doesn't ratelimit us
      await new Promise(r => setTimeout(r, 1500));

      records.push({
        fields: {
          name: element.tags.name,
          address: lookup.display_name,
          website: element.tags.website,
          phone: element.tags.phone,
        }
      });
    }
    table.create(records);
  } catch (e) {
    alert(e);
  }
  stopLoading();
}
