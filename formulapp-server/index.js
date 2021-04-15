const express = require('express');
const cors = require('cors');
const api = require('./api');

const app = express();

app.use(cors());

app.get('/',(req, res) => {
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

app.listen(4000, () => {
  console.log('Backend is up');
});
