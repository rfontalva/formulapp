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

  async simpleQuery(query) {
    try {
      const results = await queryDB(query);
      return results[0];
    } catch (err) {
      throw new Error(err);
    }
  },

  async getAllFormulas(req, res) {
    const selectQuery = "select * from Formula where state='added' order by rand()";
    try {
      const results = await this.execSql(selectQuery);
      res.json(results);
    } catch (error) {
      res.send(error);
    };
  },

  async addFormula(req, res) {
    const { title, equation, txt, category, topic, rawLatex, user } = req.query;
    const insertCategory = `INSERT IGNORE INTO Category (txt) VALUE (${connection.escape(category)});`;
    const insertTopic = `INSERT INTO Topic (id_category, txt)
    SELECT * FROM (SELECT id_category, ${connection.escape(topic)} AS txt FROM Category c
      WHERE c.txt=${connection.escape(category)}) AS tmp 
    WHERE NOT EXISTS 
      (SELECT id_category, txt FROM Topic t WHERE id_category=(SELECT id_category FROM Category c
      WHERE c.txt=${connection.escape(category)}) AND t.txt=${connection.escape(topic)});`;
    const insertEquation = `INSERT INTO Formula (title, equation, txt, rawLatex, id_topic, id_user) 
      VALUE (${connection.escape(title)}, '${equation}', 
        ${connection.escape(txt)}, ${rawLatex}, 
      (SELECT id_topic from Topic t JOIN Category c using (id_category)
      WHERE t.txt=${connection.escape(topic)} AND c.txt=${connection.escape(category)}),
      (SELECT id_user FROM User u WHERE u.username=${connection.escape(user)}));`;
    const insertModeration = `INSERT INTO Moderation (id_formula, action) VALUE
      ((SELECT id_formula FROM Formula f JOIN Topic t using (id_topic) JOIN Category c using (id_category)
      WHERE f.title=${connection.escape(title)} AND t.txt=${connection.escape(topic)} AND
      c.txt=${connection.escape(category)}), 'add');`
    const insertOpinion = `INSERT INTO Opinion (id_moderation, opinion, id_user) VALUE
      ((SELECT id_moderation FROM Moderation m join Formula f using (id_formula)
      JOIN Topic t using (id_topic) JOIN Category c using (id_category)
      WHERE f.title=${connection.escape(title)} AND t.txt=${connection.escape(topic)} AND
      c.txt=${connection.escape(category)}), 'positive',
      (SELECT id_user FROM User u WHERE u.username=${connection.escape(user)}));`
    try {
      await this.execSql('START TRANSACTION;');
      await this.execSql(insertCategory);
      await this.execSql(insertTopic);
      await this.execSql(insertEquation);
      await this.execSql(insertModeration);
      await this.execSql(insertOpinion);
      await this.execSql('COMMIT;');
      res.status(200).send({msg: `Se agregó: ${title}`});
    } catch (error) {
      res.status(400);
      try {
        await this.execSql('ROLLBACK;');
      } catch (err) {
        throw new Error(err);
      }
    }
  },

  async editFormula(req, res) {
    const {
      id, title, equation, txt, category, topic, rawLatex
    } = req.query;
    const editEquation = `UPDATE Formula SET title=${connection.escape(title)}, 
      equation='${equation}', 
      txt=${connection.escape(txt)}, rawLatex=${rawLatex},
      id_topic=(SELECT id_topic from Topic t JOIN Category c using (id_category) 
        WHERE t.txt=${connection.escape(topic)} AND c.txt=${connection.escape(category)})
      WHERE id_formula=${connection.escape(id)};`;
    const insertCategory = `INSERT IGNORE INTO Category (txt) VALUE (${connection.escape(category)});`;
    const insertTopic = `INSERT IGNORE INTO Topic (id_category, txt) VALUE 
      ((SELECT id_category FROM Category c 
      WHERE c.txt=${connection.escape(category)}), ${connection.escape(topic)});`
    try {
      await this.execSql('START TRANSACTION;');
      await this.execSql(insertCategory);
      await this.execSql(insertTopic);
      await this.execSql(editEquation);
      await this.execSql('COMMIT;');
      res.status(200).send(`Edited equation: ${title}`);
    } catch (error) {
      try {
        await this.execSql('ROLLBACK;');
      } catch (err) {
        throw new Error(err);
      }
      res.status(400).send(error);
    }
  },

  async removeFormula(req, res) {
    const { id } = req.query;
    const deleteQuery = `DELETE FROM Formula WHERE id_formula = ${connection.escape(id)}`;
    try {
      await this.execSql(deleteQuery);
      res.send('Removed equation');
    } catch (error) {
      res.send(error)
    };
  },

  async getSelect(req, res) {
    const { query } = req.query;
    try {
      const results = await this.execSql(query)
      res.json(results);
    } catch (error) {
      res.send(error)
    }
  },

  async authenticate(req, res) {
    const { username, password } = req.query;
    const salted = password + secret.salt;
    const encrypted = crypto.createHash('sha256').update(salted, 'utf8').digest('hex');
    const existsQuery = `SELECT IF((SELECT count(*) FROM User 
      WHERE username = ${connection.escape(username)} and password = '${encrypted}') ,1,0) as isempty;`;
    const query = `SELECT * from User WHERE username =${connection.escape(username)} 
      and password ='${encrypted}';`;
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
      VALUES (${connection.escape(firstname)}, ${connection.escape(lastname)}, 
        ${connection.escape(username)}, ${connection.escape(email)}, '${encrypted}')`;
    try {
      await this.execSql(query);
      res.json({user: username});
      res.status(200);
    } catch (err) {
      res.status(401);
      throw new Error(err);
    }
  },

  async deleteUser(req, res) {
    const {username, password} = req.query;
    const salted = password + secret.salt;
    const encrypted = crypto.createHash('sha256').update(salted, 'utf8').digest('hex');
    const existsQuery = `SELECT count(*) as isThere FROM User WHERE username=${connection.escape(username)} 
      and password='${encrypted}'`;
    const query = `DELETE FROM User WHERE username=${connection.escape(username)} 
      and password='${encrypted}'`;
    try {
      const res = await this.simpleQuery(existsQuery);
      if (res.isThere) {
        await this.execSql(query);
        res.status(200);
      } else {
        res.status(401);
      }
    } catch (err) {
      res.status(400);
      throw new Error(err);
    }
  },

  async validate(req, res) {
    const { username, email } = req.query;
    const queryUsername = `
      select count(*) as userExists from User 
        where username=${connection.escape(username)}`;
    const queryEmail = `
      select count(*) as emailExists from User 
        where email=${connection.escape(email)}`;
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
    try {
      const responseUsername = await this.execSql(queryUsername);
      if (responseUsername[0].userExists) {
        res.status(401).json({ usernameExists: 'Este nombre de usuario ya se encuentra en uso' })
        return;
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  async newCheatsheet(req, res) {
    const { username, title } = req.query;
    const insertCheatsheet = `INSERT INTO Cheatsheet (title) value (${connection.escape(title)})`;
    const insertPermission = `INSERT INTO Permission (id_user, id_cheatsheet) value (
      (SELECT id_user from User where username=${connection.escape(username)}),
      (SELECT id_cheatsheet from Cheatsheet where title=${connection.escape(title)})
      )`;
    try {
      await this.execSql('START TRANSACTION;');
      await this.execSql(insertCheatsheet);
      await this.execSql(insertPermission);
      await this.execSql('COMMIT;');
      res.status(200).send(`Added cheatsheet: ${title}`);
    } catch (error) {
      try {
        await this.execSql('ROLLBACK;');
      } catch (err) {
        throw new Error(err);
      }
      res.status(400).send(error);
    }
  },

  async addToCheatsheet(req, res) {
    const { username, title, id } = req.query;
    const insertContent = `INSERT IGNORE INTO CheatsheetContent (id_cheatsheet, id_formula) value 
      ((SELECT id_cheatsheet from Cheatsheet JOIN Permission p using (id_cheatsheet) 
      JOIN User u on p.id_user=u.id_user 
        WHERE title=${connection.escape(title)} and username=${connection.escape(username)} 
        and permission in ('a','w')),
      ${connection.escape(id)});`;
    try {
      await this.execSql('START TRANSACTION;');
      await this.execSql(insertContent);
      await this.execSql('COMMIT;');
      res.status(200);
    } catch (error) {
      try {
        await this.execSql('ROLLBACK;');
      } catch (err) {
        throw new Error(err);
      }
      res.status(400).send(error);
    }
  },

  async sendToModerate(req, _, action, opinion) {
    const { id, username } = req.query;
    const queryState = `SELECT count(*) as isNotEmpty FROM Moderation m JOIN Formula using (id_formula) 
      WHERE id_formula=${connection.escape(id)} and m.state='started';`;
    const moderationQuery = `INSERT IGNORE INTO Moderate (id_formula, action) 
      VALUE (${connection.escape(id)}, '${action}');`;
    const userQuery = `INSERT INTO Opinion (id_moderation, id_user, opinion) VALUE 
      ((select id_moderation from Moderation where id_formula=${connection.escape(id)}), 
      (select id_user from User where username=${connection.escape(username)}), '${opinion}');`;
    try {
      await this.execSql('START TRANSACTION;');
      const responseState = await this.execSql(queryState);
      if (!responseState[0].isNotEmpty) {
        try {
          await this.execSql(moderationQuery);
        } catch (err) {
          throw new Error(err)
        }
      }
      await this.execSql(userQuery);
      await this.execSql('COMMIT;');
    } catch (err) {
      try {
        await this.execSql('ROLLBACK;');
      } catch (err) {
        throw new Error(err)
      }
      throw new Error(err)
    }
  },

  async getCheatsheet(req, res) {
    const {id} = req.query;
    const queryFormulas = `SELECT f.* FROM Formula f JOIN CheatsheetContent USING (id_formula) 
      JOIN Cheatsheet USING (id_cheatsheet) WHERE id_cheatsheet=${id};`;
    const queryTitle = `SELECT title from Cheatsheet WHERE id_cheatsheet=${id};`;
    try {
      const formulas = await this.execSql(queryFormulas);
      const resTitle = await this.simpleQuery(queryTitle);
      const { title } = resTitle;
      res.status(200).json({formulas, title});
      return ({formulas, title})
    } catch (err) {
      throw new Error(err);
    }
  },

  async deleteCheatsheetContent(req, res) {
    const {idFormula, idCheatsheet} = req.query;
    const query = `DELETE from CheatsheetContent where id_formula=${connection.escape(idFormula)} 
      and id_cheatsheet=${connection.escape(idCheatsheet)}`;
    try {
      await this.execSql(query);
      res.status(200);
    } catch (err) {
      throw new Error(err);
    }
  },

  async deleteCheatsheet(req, res) {
    const { id } = req.query;
    const query = `DELETE from Cheatsheet where id_cheatsheet=${connection.escape(id)}`;
    try {
      await this.execSql(query);
      res.status(200);
    } catch (err) {
      throw new Error(err);
    }
  }, 

  async sendOpinion(req, res) {
    const { id, username, opinion } = req.query;
    const query = `INSERT INTO Opinion (id_moderation, id_user, opinion) VALUES
      ((SELECT id_moderation from Moderation m JOIN Formula f using (id_formula) WHERE
      f.id_formula=${connection.escape(id)} and m.state='started'), (SELECT id_user from User
      where username=${connection.escape(username)}), ${connection.escape(opinion)})`;
    console.log(query);
    try {
      await this.execSql(query);
      res.status(200);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }
}

module.exports = api;
