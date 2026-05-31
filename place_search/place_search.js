button = document.getElementById("update");
button.addEventListener("click", update);

function startLoading() {
  button.ariaBusy = true;
}

function stopLoading() {
  button.ariaBusy = false;
}

allRecords = [];
grist.onRecords(async (records, mappings) => {
  allRecords = records;
})

console.log("hi");
console.log(allRecords);

async function update () {
  startLoading();

  table = grist.getTable();
  console.log(table);
  await table.update({
    id: 1,
    fields: {
      name: 'New name',
      website: 'http://www.google.com'
    }
  });

  stopLoading();
}
