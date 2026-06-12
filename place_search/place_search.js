let button = document.getElementById("update");
button.addEventListener("click", update);

let search = document.getElementById("search");

function startLoading() {
  button.ariaBusy = true;
}

function stopLoading() {
  button.ariaBusy = false;
}

grist.ready({
  requiredAccess: 'full'
});

// keep track of current record
let currentRecord = null;
grist.onRecord(function (record) {
  console.log("new current record");
  currentRecord = record;
  if (currentRecord != null) {
    button.disabled = false;

    // pre-fill search bar with name or ideally address
    if (currentRecord.address == null || currentRecord.address == "") {
      search.value = currentRecord.name;
    } else {
      search.value = currentRecord.address;
    }
  }
});

/// Returns null when object couldn't be found
async function find(name) {
  let data = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&addressdetails=1&limit=1`).then(response => response.json());

  if (data.length == 0) {
    return null;
  }

  let id = data[0].osm_id;
  let type;
  if (data[0].osm_type == 'way') {
    type = 'W';
  } else if (data[0].osm_type == 'node') {
    type = 'N';
  } else if (data[0].osm_type == 'relation') {
    type = 'R';
  }

  let details = (await fetch(`https://www.openstreetmap.org/api/0.6/${data[0].osm_type}/${id}.json`).then(response => response.json())).elements[0];

  let lookup = (await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=${type}${id}&format=json&extratags=1`).then(response => response.json()))[0];

  return {
    website: details.tags.website,
    phone: details.tags.phone,
    address: lookup.display_name,
    lat: details.lat,
    lon: details.lon
  };
}

async function update() {
  if (currentRecord != null) {
    startLoading();

    try {
      console.log(currentRecord);

      let fields = await find(search.value);

      if (fields == null) {
        alert("no results")
      }

      let table = grist.getTable();
      await table.update({
        id: currentRecord.id,
        fields: fields,
      });

    } catch (e) {
      alert(e);
    }

    stopLoading();
  }
}
