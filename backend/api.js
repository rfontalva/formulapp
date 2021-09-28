const util = require('util');
const connection = require('./connection');
const crypto = require('crypto');
const secret = require('./secret.json');

const queryDB = util.promisify(connection.query).bind(connection);

var api = {
  async execSql(query) {
    try {
      const results = await queryDB(query);
      return results;
    } catch (err) {
      throw new Error(err);
    }
  },

  getAllFormulas(req, res) {
    const selectQuery = 'select * from formulapp.equation order by rand()';
    this.execSql(selectQuery)
      .then((results) => res.json(results))
      .catch((error) => res.send(error));
  },

  addFormula(req, res) {
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
    this.execSql(insertEquation)
      .then(() => this.execSql(insertCategory))
      .then(() => this.execSql(insertTopic))
      .then(() => this.execSql(insertTag))
      .then(() => res.send('Added equation'))
      .catch((error) => res.send(error));
  },

  async editFormula(req, res) {
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
    const editTag = `INSERT INTO formulapp.tag (id_category, id_topic, id_equation) VALUES
      ((SELECT id_category FROM formulapp.category WHERE txt='${category}'),
      (SELECT id_topic FROM formulapp.topic WHERE txt='${topic}'),
      (SELECT id_equation FROM formulapp.equation WHERE title='${title}')) as tmp
    ON DUPLICATE KEY UPDATE
      id_category = tmp.id_category,
      id_topic = tmp.id_topic`;
    try {
      await this.execSql(editEquation);
      if (category !== '') await this.execSql(insertCategory);
      if (topic !== '') await this.execSql(insertTopic);
      await this.execSql(editTag);
      res.send(`edited equation: ${title}`);
    } catch (error) {
      res.send(error);
    }
  },

  removeFormula(req, res) {
    const { id } = req.query;
    const deleteQuery = `DELETE FROM formulapp.equation WHERE id_equation = ${id}`;
    this.execSql(deleteQuery)
      .then(() => res.send('removed equation'))
      .catch((error) => res.send(error));
  },

  getSelect(req, res) {
    const { query } = req.query;
    if (query.includes('insert') || query.includes('update') || query.includes('delete') || query.includes('drop') || query.includes('create')) {
      return res.send('invalid operation');
    }
    return this.execSql(query)
      .then((results) => res.json(results))
      .catch((error) => res.send(error));
  },

  async authenticate(req, res) {
    const { email, password } = req.query;
    console.log(password);
    const salted = password + secret.salt;
    const encrypted = crypto.createHash('sha256').update(salted, 'utf8').digest('hex');
    console.log(encrypted);
    const existsQuery = `SELECT IF((SELECT count(*) FROM User WHERE email = '${email}' and password = '${encrypted}') ,1,0) as isempty`;
    const query = `SELECT * from formulapp.User WHERE email = '${email}' and password = '${encrypted}'`;
    try {
      const existsResponse = await this.execSql(existsQuery);
      const isEmpty = existsResponse[0].isempty;
      if (isEmpty === 0) {
        res.status(500).send("user doesn't exist");
        return;
      }
    }
    catch (err) {
      throw new Error(err);
    }
    try {
      response = await this.execSql(query);
      console.log(response);
      res.json(response[0]);
      res.status(200);
    }
    catch (err) {
      throw new Error(err);
    }
  },

  async addUser(req, res) {
    const { firstname, lastname, username, email, password } = req.query;
    const salted = password + secret.salt;
    const encrypted = crypto.createHash('sha256').update(salted, 'utf8').digest('hex');
    const query = `
      INSERT INTO formulapp.User 
      (firstname, lastname, username, email, password)
      VALUES ('${firstname}', '${lastname}', '${username}', '${email}', '${encrypted}')`;
    try {
      response = await this.execSql(query);
      res.json(response);
      res.status(200);
    } catch (err) {
      throw new Error(err);
    }
  },

  async validate(req, res) {
    const { username, email } = req.query;
    const queryUsername = `
      select count(*) as userExists from formulapp.User 
      where username='${username}'`;
    const queryEmail = `
      select count(*) as emailExists from formulapp.User 
      where email='${email}'`;
    try {
      responseEmail = await this.execSql(queryEmail);
      if (responseEmail[0].emailExists) {
        res.status(401).json({ emailExists: 'Este email ya se encuentra en uso' })
        return;
      }
    }
    catch (err) {
      throw new Error(err);
    }
    responseUsername = await this.execSql(queryUsername);
    if (responseUsername[0].userExists) {
      res.status(401).json({ usernameExists: 'Este nombre de usuario ya se encuentra en uso' })
      return;
    }
  }
}

module.exports = api;
