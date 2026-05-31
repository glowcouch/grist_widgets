button = document.getElementById("update");
button.addEventListener("click", update);

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
  }
});

async function find(name) {
  data = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&addressdetails=1&limit=1`).then(response => response.json());
  id = data[0].osm_id;
  details = await fetch(`https://nominatim.openstreetmap.org/details?osmtype=W&osmid=${id}&format=json`).then(response => response.json());

  return {
    website: details.extratags.phone,
  };
}

async function update() {
  if (currentRecord != null) {
    try {
      startLoading();

      console.log(currentRecord);

      table = grist.getTable();
      await table.update({
        id: currentRecord.id,
        fields: await find(currentRecord.name),
      });

      stopLoading();

    } catch (e) {
      alert(e);
    }
  }
}
