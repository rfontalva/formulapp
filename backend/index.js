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

app.post('/api/authenticate', (req, res) => {
  api.authenticate(req, res);
});

app.put('/api/user', async (req, res) => {
  try {
    await api.validate(req, res)
    if (res.statusCode !== 401) {
      api.addUser(req, res);
    }
  } catch (err) {
    throw new Error(err)
  }
});

app.delete('/api/user', async (req, res) => {
  try {
    await api.deleteUser(req, res)
  } catch (err) {
    throw new Error(err)
  }
});

app.post('/api/pdf', async (req, res) => {
  let ids;
  const { header } = req.query;
  if (typeof (req.query.ids) === 'string') {
    ({ ids } = req.query);
  }
  else ids = req.query.ids.map((x) => +x);
  try {
    const formulas = await api.execSql(`select * from Formula where id_formula in (${ids})`);
    await printPdf(formulas, header);
  } catch(err) {
    throw new Error(err);
  }
  res.send(Promise.resolve());
});

app.get('/api/pdf', async (req, res) => {
  const path = `${__dirname}/${req.query.header}.pdf`;
  await new Promise(resolve => setTimeout(resolve, 4000));
  res.sendFile(path);
});

app.delete('/api/pdf', (req, res) => {
  const path = `${__dirname}/${req.query.header}.pdf`;
  fs.unlink(path, (err) => {
    if (err) { res.send(err); }
  });
});

app.post('/api/makeCheatsheet', async (req, res) => {
  try {
    const {formulas, title} = await api.getCheatsheet(req, res);
    const success = await printPdf(formulas, title)
    if (!success) {
      res.status(401)
    }
  } catch (err) {
    throw new Error(err);
  } 
});

app.get('/api/cheatsheet', (req, res) => {
  api.getCheatsheet(req, res);
});

app.put('/api/cheatsheet', (req, res) => {
  api.newCheatsheet(req, res);
});

app.post('/api/cheatsheet', (req, res) => {
  api.addToCheatsheet(req, res);
})

app.delete('/api/cheatsheet', (req, res) => {
  api.deleteCheatsheet(req, res);
})

app.delete('/api/cheatsheetContent', (req, res) => {
  api.deleteCheatsheetContent(req, res);
})

app.post('/api/moderate', (req, res) => {
  if (req.query.report)
    api.sendToModerate(req, res, 'remove', 'negative');
  else api.sendToModerate(req, res, 'add', 'positive');
});

app.post('/api/opinion', (req, res) => {
  api.sendOpinion(req, res);
})

app.post('/api/shareCheatsheet', (req, res) => {
  api.shareCheatsheet(req, res);
})

app.post('/api/saveCheatsheet', (req, res) => {
  api.saveCheatsheet(req, res);
})

app.patch('/api/saveCheatsheet', (req, res) => {
  api.editCheatsheet(req, res);
})
