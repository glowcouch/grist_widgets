button = document.getElementById("update");
button.addEventListener("click", update);

search = document.getElementById("search");

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
currentRecord = null;
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
  data = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&addressdetails=1&limit=1`).then(response => response.json());

  if (data.length == 0) {
    return null;
  }

  id = data[0].osm_id;
  details = (await fetch(`https://www.openstreetmap.org/api/0.6/way/${id}.json`).then(response => response.json())).elements[0];

  lookup = (await fetch(`https://nominatim.openstreetmap.org/lookup?osm_ids=W${id}&format=json&extratags=1`).then(response => response.json()))[0];

  return {
    website: details.tags.website,
    phone: details.tags.phone,
    address: lookup.display_name
  };
}

async function update() {
  if (currentRecord != null) {
    try {
      startLoading();

      console.log(currentRecord);

      fields = await find(search.value);

      if (fields == null) {
        alert("no results")
      }

      table = grist.getTable();
      await table.update({
        id: currentRecord.id,
        fields: fields,
      });

      stopLoading();

    } catch (e) {
      alert(e);
    }
  }
}
