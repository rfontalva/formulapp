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
    const selectQuery = 'select * from Formula order by rand()';
    this.execSql(selectQuery)
      .then((results) => res.json(results))
      .catch((error) => res.send(error));
  },

  async addFormula(req, res) {
    const { title, equation, txt, category, topic } = req.query;
    const insertCategory = `INSERT IGNORE INTO Category (txt) VALUE ('${category}');`;
    const insertTopic = `INSERT INTO Topic (id_category, txt)
    SELECT * FROM (SELECT id_category, '${topic}' AS txt FROM Category c
      WHERE c.txt='${category}') AS tmp 
    WHERE NOT EXISTS 
      (SELECT id_category, txt FROM Topic t WHERE id_category=(SELECT id_category FROM Category c
      WHERE c.txt='${category}') AND t.txt='${topic}');`;
    const insertEquation = `INSERT INTO Formula (title, equation, txt, id_topic) 
      VALUE ('${title}', '${equation}', '${txt}', (
        SELECT id_topic from topic t WHERE t.txt='${topic}'));`;
    try {
      await this.execSql('START TRANSACTION;');
      await this.execSql(insertCategory);
      await this.execSql(insertTopic);
      await this.execSql(insertEquation);
      await this.execSql('COMMIT;');
      res.status(200).send(`Edited equation: ${title}`);
    } catch (error) {
      try {
        await this.execSql('ROLLBACK;');
      } catch(err) {
        throw new Error(err);
      }
      res.status(400).send(error);
    }
  },

  async editFormula(req, res) {
    const {
      id, title, equation, txt, category, topic
    } = req.query;
    const editEquation = `UPDATE Formula SET title='${title}', equation='${equation}', txt='${txt}', 
      id_topic=(SELECT id_topic from Topic t JOIN Category c using (id_category) 
      WHERE t.txt='${topic}' AND c.txt='${category}')
      WHERE id_formula=${id};`;
    const insertCategory = `INSERT IGNORE INTO Category (txt) VALUE ('${category}');`;
    const insertTopic = `INSERT IGNORE INTO Topic (id_category, txt) VALUE ((SELECT id_category FROM Category c WHERE c.txt='${category}'), '${topic}');`
    try {
      await this.execSql('START TRANSACTION;');
      await this.execSql(insertCategory);
      await this.execSql(insertTopic);
      await this.execSql(editEquation);
      await this.execSql('COMMIT;');
      res.send(`Edited equation: ${title}`);
    } catch (error) {
      try {
        await this.execSql('ROLLBACK;');
      } catch(err) {
        throw new Error(err);
      }
      res.status(400).send(error);
    }
  },

  removeFormula(req, res) {
    const { id } = req.query;
    const deleteQuery = `DELETE FROM Formula WHERE id_formula = ${id}`;
    this.execSql(deleteQuery)
      .then(() => res.send('Removed equation'))
      .catch((error) => res.send(error));
  },

  getSelect(req, res) {
    const { query } = req.query;
    if (query.includes('insert') || query.includes('update') || query.includes('delete') || query.includes('drop') || query.includes('create')) {
      return res.send('Invalid operation');
    }
    return this.execSql(query)
      .then((results) => res.json(results))
      .catch((error) => res.send(error));
  },

  async authenticate(req, res) {
    const { email, password } = req.query;
    const salted = password + secret.salt;
    const encrypted = crypto.createHash('sha256').update(salted, 'utf8').digest('hex');
    const existsQuery = `SELECT IF((SELECT count(*) FROM User WHERE email = '${email}' and password = '${encrypted}') ,1,0) as isempty`;
    const query = `SELECT * from User WHERE email = '${email}' and password = '${encrypted}'`;
    try {
      const existsResponse = await this.execSql(existsQuery);
      const isEmpty = existsResponse[0].isempty;
      if (isEmpty === 0) {
        res.status(500).send("User doesn't exist");
        return;
      }
    }
    catch (err) {
      throw new Error(err);
    }
    try {
      response = await this.execSql(query);
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
      INSERT INTO User 
      (firstname, lastname, username, email, password)
      VALUES ('${firstname}', '${lastname}', '${username}', '${email}', '${encrypted}')`;
    try {
      const response = await this.execSql(query);
      res.json(response);
      res.status(200);
    } catch (err) {
      throw new Error(err);
    }
  },

  async validate(req, res) {
    const { username, email } = req.query;
    const queryUsername = `
      select count(*) as userExists from User 
      where username='${username}'`;
    const queryEmail = `
      select count(*) as emailExists from User 
      where email='${email}'`;
    try {
      const responseEmail = await this.execSql(queryEmail);
      if (responseEmail[0].emailExists) {
        res.status(401).json({ emailExists: 'Este email ya se encuentra en uso' })
        return;
      }
    }
    catch (err) {
      throw new Error(err);
    }
    const responseUsername = await this.execSql(queryUsername);
    if (responseUsername[0].userExists) {
      res.status(401).json({ usernameExists: 'Este nombre de usuario ya se encuentra en uso' })
      return;
    }
  }
}

module.exports = api;
