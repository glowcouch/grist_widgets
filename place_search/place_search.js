button = document.getElementById("update");
button.addEventListener("click", update);

function startLoading() {
  button.ariaBusy = true;
}

function stopLoading() {
  button.ariaBusy = false;
}

async function update () {
  startLoading();

  table = grist.getTable();
  await table.update({
    id: 1,
    fields: {
      name: 'New name',
      website: 'http://www.google.com'
    }
  });

  stopLoading();
}
