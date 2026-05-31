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
grist.onRecord(function(record) {
  console.log("new current record");
  currentRecord = record;
  if (currentRecord != null) {
    button.disabled = false;
  }
});

async function update () {
  if (currentRecord != null) {
    startLoading();

    console.log(currentRecord);

    table = grist.getTable();
    await table.update({
      id: currentRecord.id,
      fields: {
        name: 'New name',
        website: 'http://www.google.com'
      }
    });

    stopLoading();
  }
}
