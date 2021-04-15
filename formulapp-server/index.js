const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'formulapp',
})

const app = express();

app.use(cors());

app.get('/',(req, res) => {
    connection.query('select * from formulapp.equations', (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json({
                results,
            });
        }
    });
});

app.get('/add', (req, res) => {
    const {title, equation, txt} = req.query;
    connection.query(`insert into formulapp.equations (title, equation, txt) VALUE ('${title}', '${equation}', '${txt}')`, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.send('added equation');
        }
    });
});

app.get('/edit', (req, res) => {
    const {id, title, equation, txt} = req.query;
    connection.query(`UPDATE formulapp.equations SET title='${title}', equation='${equation}', txt='${txt}' WHERE id_equation=${id}`, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.send('added equation');
        }
    });
});

app.get('/remove', (req, res) => {
    const {id_equation} = req.query;
    connection.query(`DELETE FROM formulapp.equations WHERE id_equation = ${id_equation}`, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.send('removed equation');
        }
    });
});

app.get('/query', (req, res) => {
    const {query} = req.query;
    connection.query(`${query}`, (err, results) => {
        if (err) {
            return res.send(err);
        } else {
            return res.json({
                results,
            });
        }
    });
});

app.listen(4000, () => {
    console.log('Backend is up');
});