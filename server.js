var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors')
const port = 3000
var mysql = require('mysql');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

if (!fs.existsSync('.env')) {
  fs.appendFile('.env', `SECRET_TOKEN=${crypto.randomBytes(64).toString('hex')}`, function (err) {
    if (err) throw err;
  });
}

var app = express();
app.use(cors())
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var sql = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "Capchat"
});  

sql.connect();

app.get('/',  function(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.send("ok");
})

app.get('/createSecretToken',  function(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(process.env.SECRET_TOKEN);
})


// app.get('/auteurs',  function(req, res) {
//   res.setHeader("Content-Type", "application/json; charset=utf-8");

//   sql.query('SELECT * from auteurs', function(err, rows) {
//     if (err) {
//       res.status(400).end(JSON.stringify(err));
//     }
//     res.send(rows).end();
//   });

// })

// app.get('/auteurs/:userId',  function(req, res) {
//   res.setHeader("Content-Type", "application/json; charset=utf-8");

//   sql.query(`SELECT * from auteurs WHERE ID = ${req.params.userId}`, function(err, rows) {
//     if (err) {
//       res.status(400).end(JSON.stringify(err));
//     }
//     res.send(rows);
//   });

// })

// app.post('/auteurs', function(req, res) {
//   res.setHeader("Content-Type", "application/json; charset=utf-8");
//   sql.query(`INSERT INTO auteurs (Nom, Prenom) VALUES ('${req.body.Nom}','${req.body.Prenom}')`, function(err) {
//     if (err) {
//       res.status(400).end(JSON.stringify(err));
//     }
//     res.status(201).end();
//   })
// })

// app.put('/auteurs', function(req, res) {
//   res.setHeader("Content-Type", "application/json; charset=utf-8");
//   sql.query(`UPDATE auteurs SET Nom = '${req.body.Nom}' , Prenom = '${req.body.Prenom}' WHERE Id_Auteurs = '${req.body.id}'`, function(err) {
//     if (err) {
//       res.status(400).end(JSON.stringify(err));
//     }
//     res.status(200).end();
//   })
// })

// app.delete('/auteurs', function(req, res) {
//   sql.query(`DELETE FROM auteurs WHERE Id_Auteurs = '${req.body.id}'`, function(err) {
//     if (err) {
//       res.status(400).end(JSON.stringify(err));
//     }
//     res.status(200).end();
//   })
// })

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})