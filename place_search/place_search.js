async function update () {
  table = grist.getTable();
  await table.update({
    id: 1,
    fields: {
      name: 'New name',
      website: 'http://www.google.com'
    }
  });
}
