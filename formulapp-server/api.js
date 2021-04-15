const connection = require('./connection');

function getAllFormulas(req, res) {
  connection.query('select * from formulapp.equations', (err, results) => {
    if (err) {
      return res.send(err);
    }
    return res.json({
      results,
    });
  });
}

function addFormula(req, res) {
  const { title, equation, txt } = req.query;
  connection.query(`insert into formulapp.equations (title, equation, txt) VALUE ('${title}', '${equation}', '${txt}')`, (err) => {
    if (err) {
      return res.send(err);
    }
    return res.send('added equation');
  });
}

function editFormula(req, res) {
  const {
    id, title, equation, txt,
  } = req.query;
  connection.query(`UPDATE formulapp.equations SET title='${title}', equation='${equation}', txt='${txt}' WHERE id_equation=${id}`, (err) => {
    if (err) {
      return res.send(err);
    }
    return res.send('added equation');
  });
}

function removeFormula(req, res) {
  const { id } = req.query;
  connection.query(`DELETE FROM formulapp.equations WHERE id_equation = ${id}`, (err) => {
    if (err) {
      return res.send(err);
    }
    return res.send('removed equation');
  });
}

function getSelect(req, res) {
  const { query } = req.query;
  if (query.includes('insert') || query.includes('update') || query.includes('delete') || query.includes('drop') || query.includes('create')) {
    return res.send('invalid operation');
  }
  return connection.query(`${query}`, (err, results) => {
    if (err) {
      return res.send(err);
    }
    return res.json({
      results,
    });
  });
}

module.exports = {
  getAllFormulas, addFormula, editFormula, removeFormula, getSelect,
};
