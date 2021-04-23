const util = require('util');
const connection = require('./connection');

const queryDB = util.promisify(connection.query).bind(connection);
const execSql = async (query) => {
  try {
    const results = await queryDB(query);
    return results;
  } catch (err) {
    throw new Error(err);
  }
};

function getAllFormulas(req, res) {
  const selectQuery = 'select * from formulapp.equation';
  execSql(selectQuery)
    .then((results) => res.json(results))
    .catch((error) => res.send(error));
}

function addFormula(req, res) {
  const { title, equation, txt } = req.query;
  const insertQuery = `insert into formulapp.equation (title, equation, txt) VALUE ('${title}', '${equation}', '${txt}')`;
  execSql(insertQuery)
    .then(() => res.send('Added equation'))
    .catch((error) => res.send(error));
}

function editFormula(req, res) {
  const {
    id, title, equation, txt,
  } = req.query;
  const editQuery = `UPDATE formulapp.equation SET title='${title}', equation='${equation}', txt='${txt}' WHERE id_equation=${id}`;
  execSql(editQuery)
    .then(() => res.send(`edited equation: ${title}`))
    .catch((error) => res.send(error));
}

function removeFormula(req, res) {
  const { id } = req.query;
  const deleteQuery = `DELETE FROM formulapp.equation WHERE id_equation = ${id}`;
  execSql(deleteQuery)
    .then(() => res.send('removed equation'))
    .catch((error) => res.send(error));
}

function getSelect(req, res) {
  const { query } = req.query;
  if (query.includes('insert') || query.includes('update') || query.includes('delete') || query.includes('drop') || query.includes('create')) {
    return res.send('invalid operation');
  }
  return execSql(query)
    .then((results) => res.json({ results }))
    .catch((error) => res.send(error));
}

module.exports = {
  getAllFormulas, addFormula, editFormula, removeFormula, getSelect,
};
