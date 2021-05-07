const express = require('express');
const cors = require('cors');
const api = require('./api');
const printPdf = require('./pdfUtils');

const app = express();

app.use(cors());

app.listen(4000, '0.0.0.0', () => {
  console.log('Backend is up');
});

app.get('/', (req, res) => {
  api.getAllFormulas(req, res);
});

app.get('/add', (req, res) => {
  api.addFormula(req, res);
});

app.get('/edit', (req, res) => {
  api.editFormula(req, res);
});

app.get('/remove', (req, res) => {
  api.removeFormula(req, res);
});

app.get('/query', (req, res) => {
  api.getSelect(req, res);
});

app.post('/create-pdf', async (req, res) => {
  const ids = req.query.ids.map((x) => +x);
  const formulas = await api.execSql(`select * from formulapp.equation where id_equation in (${ids})`);
  printPdf(formulas, req.query.header);
  res.send(Promise.resolve());
});

app.get('/fetch-pdf', (req, res) => {
  res.sendFile(`${__dirname}/${req.query.header}.pdf`);
});
