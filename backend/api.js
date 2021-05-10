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
  const { title, equation, txt, category, topic } = req.query;
  const insertEquation = `INSERT INTO formulapp.equation (title, equation, txt) VALUE ('${title}', '${equation}', '${txt}')`;
  const insertCategory = `INSERT IGNORE INTO formulapp.category (txt) VALUE ('${category}')`;
  const insertTopic = `INSERT INTO formulapp.topic (id_category, txt)
  SELECT * FROM (SELECT id_category, '${topic}' AS txt FROM formulapp.category c
    WHERE c.txt='${category}') AS tmp 
  WHERE NOT EXISTS 
    (SELECT id_category, txt FROM formulapp.topic t WHERE id_category=(SELECT id_category FROM formulapp.category c
    WHERE c.txt='${category}') AND t.txt='${topic}')`;
  const insertTag = `INSERT INTO formulapp.tag (id_equation, id_category, id_topic) VALUE 
  ((SELECT id_equation FROM formulapp.equation WHERE title='${title}'),
  (SELECT id_category FROM formulapp.category WHERE txt='${category}'),
  (SELECT id_topic FROM formulapp.topic WHERE txt='${topic}'))`;
  execSql(insertEquation)
    .then(() => execSql(insertCategory))
    .then(() => execSql(insertTopic))
    .then(() => execSql(insertTag))
    .then(() => res.send('Added equation'))
    .catch((error) => res.send(error));
}

async function editFormula(req, res) {
  const {
    id, title, equation, txt, category, topic
  } = req.query;
  const editEquation = `UPDATE formulapp.equation SET title='${title}', equation='${equation}', txt='${txt}' WHERE id_equation=${id}`;
  const insertCategory = `INSERT IGNORE INTO formulapp.category (txt) VALUE ('${category}')`;
  const insertTopic = `INSERT INTO formulapp.topic (id_category, txt)
  SELECT * FROM (SELECT id_category, '${topic}' AS txt FROM formulapp.category c
    WHERE c.txt='${category}') AS tmp 
  WHERE NOT EXISTS 
    (SELECT id_category, txt FROM formulapp.topic t WHERE id_category=(SELECT id_category FROM formulapp.category c
    WHERE c.txt='${category}') AND t.txt='${topic}')`;
  const editTag = `UPDATE formulapp.tag SET 
  id_category=(SELECT id_category FROM formulapp.category WHERE txt='${category}'),
  id_topic=(SELECT id_topic FROM formulapp.topic WHERE txt='${topic}')
  WHERE id_equation = (SELECT id_equation FROM formulapp.equation WHERE title='${title}')`;
  try {
    await execSql(editEquation);
    await execSql(insertCategory);
    await execSql(insertTopic);
    await execSql(editTag);
    res.send(`edited equation: ${title}`);
  } catch (error){
    res.send(error);
  }
};

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
    .then((results) => res.json(results))
    .catch((error) => res.send(error));
}

module.exports = {
  getAllFormulas, addFormula, editFormula, removeFormula, getSelect, execSql,
};
