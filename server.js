var express = require('express');
const jwt = require('jsonwebtoken')
var bodyParser = require('body-parser');
const cors = require('cors')
const port = 3000
var mysql = require('mysql');
const fs = require('fs');
const crypto = require('crypto');

require('dotenv').config();

if (!fs.existsSync('.env')) {
  fs.appendFile('.env', `SECRET_TOKEN=${crypto.randomBytes(64).toString('hex')}\nSECRET_TOKEN_MDP=${crypto.randomBytes(64).toString('hex')}`, function (err) {
    if (err) throw err;
  });
}

/* Récupération du header bearer */
const extractBearerToken = headerValue => {
  if (typeof headerValue !== 'string') {
      return false
  }

  const matches = headerValue.match(/(bearer)\s+(\S+)/i)
  return matches && matches[2]
}

/* Vérification du token */
const checkTokenMiddleware = (req, res, next) => {
  // Récupération du token
  const token = req.headers.authorization && extractBearerToken(req.headers.authorization)

  // Présence d'un token
  if (!token) {
      return res.status(401).json({ message: 'Error. Need a token' })
  }

  // Véracité du token
  jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
          res.status(401).json({ message: 'Error. Bad token' })
      } else {
          return decodedToken
      }
  })
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
    const hash = crypto.createHmac('sha512', process.env.SECRET_TOKEN_MDP)
    hash.update("test");
    const test = hash.digest('hex').toString()
    res.send(test);
})

app.post('/api/connexion', async function(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  const users = await getUsers();
  const user = users.find(u => u.nom == req.body.username && u.mdp == hash(req.body.password));
  if (!user) {
    return res.status(400).json({message: `le nom d'utilisateur ou le mot de passe sont incorrect`})
  }
  const token = jwt.sign({username: req.body.username}, process.env.SECRET_TOKEN, { expiresIn: '24h' });
  return res.send({token: token})
})

app.post('/api/inscription', async function(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const users = await getUsers();
  const user = users.find(u => u.nom == req.body.username);
  if (user) {
    res.status(400).json({message: `L'utilisateur ${req.body.username} existe déjà`})
  }

  await setUser(req.body.username, req.body.password)
  .then(
    () => {
      res.send({message: `Le compte ${req.body.username} à était créé avec succès`});
    }
  )
  .catch(
    err => {
      res.status(400).json({message: `erreur : ${err}`});
    } 
  );
})

app.get('/api/compte', checkTokenMiddleware, function(req,res) {
  res.send("ça marche")
})

function getUsers() {
  return new Promise((resolve, reject) => {
    sql.query('SELECT nom, mdp FROM user', function (err, rows) {
      if (err) return reject(err)
      return resolve(rows);
    })
  })
}

function setUser(nom, mdp) {
  return new Promise((resolve, reject) => {
    const mdpHash = hash(mdp)
    
    sql.query(`INSERT INTO user(nom, mdp) VALUES ('${nom}','${mdpHash}')`, function (err) {
      if (err) return reject(err);
      return resolve();
    })
  })
}

function hash(mdp) {
  const hash = crypto.createHmac('sha512', process.env.SECRET_TOKEN_MDP)
  hash.update(mdp);
  return hash.digest('hex').toString();
}

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