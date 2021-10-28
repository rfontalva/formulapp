const fs = require('fs');
const express = require('express');
const cors = require('cors');
const api = require('./api');
const printPdf = require('./pdfUtils');

const app = express();

app.use(cors());

app.listen(4000, '0.0.0.0', () => {
  console.log('Backend is up');
});

app.get('/api', (req, res) => {
  api.getAllFormulas(req, res);
});

app.get('/api/add', (req, res) => {
  api.addFormula(req, res);
});

app.get('/api/edit', (req, res) => {
  api.editFormula(req, res);
});

app.delete('/api/remove', (req, res) => {
  api.removeFormula(req, res);
});

app.get('/api/query', (req, res) => {
  api.getSelect(req, res);
});

app.post('/api/pdf', async (req, res) => {
  let ids;
  if (typeof (req.query.ids) === 'string') ids = req.query.ids;
  else ids = req.query.ids.map((x) => +x);
  const formulas = await api.execSql(`select * from Formula where id_formula in (${ids})`);
  await printPdf(formulas, req.query.header);
  res.send(Promise.resolve());
});

app.post('/api/authenticate', (req, res) => {
  api.authenticate(req, res);
});

app.put('/api/user', async (req, res) => {
  try {
    await api.validate(req, res)
    if (res.statusCode !== 501 && res.statusCode !== 502) {
      api.addUser(req, res);
    }
  } catch (err) {
    throw new Error(err)
  }
});

app.get('/api/pdf', (req, res) => {
  const path = `${__dirname}/${req.query.header}.pdf`;
  res.sendFile(path);
});

app.delete('/api/pdf', (req, res) => {
  const path = `${__dirname}/${req.query.header}.pdf`;
  fs.unlink(path, (err) => {
    if (err) { res.send(err); }
  });
});

app.put('/api/cheatsheet', (req, res) => {
  api.newCheatsheet(req, res);
});

app.post('/api/cheatsheet', (req, res) => {
  api.addToCheatsheet(req, res);
})

app.put('/api/moderate', (req, res) => {
  if (req.query.report)
    api.sendToModerate(req, res, 'remove', 'negative');
  else api.sendToModerate(req, res, 'add', 'positive');
});
