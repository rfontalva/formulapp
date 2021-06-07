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

app.get('/api/remove', (req, res) => {
  api.removeFormula(req, res);
});

app.get('/api/query', (req, res) => {
  api.getSelect(req, res);
});

app.post('/api/pdf', async (req, res) => {
  let ids;
  if(typeof(req.query.ids) === 'string') ids = req.query.ids;
  else ids = req.query.ids.map((x) => +x);
  const formulas = await api.execSql(`select * from formulapp.equation where id_equation in (${ids})`);
  await printPdf(formulas, req.query.header);
  res.send(Promise.resolve());
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
