button = document.getElementById("update");
button.addEventListener("click", update);

function startLoading() {
  button.ariaBusy = true;
}

function stopLoading() {
  button.ariaBusy = false;
}

grist.ready({
  requiredAccess: 'read table'
});

// keep track of current record
currentRecord = null;
grist.onRecord(function(record) {
  console.log("new current record");
  currentRecord = record;
});

async function update () {
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
