var os = require('os');
var express = require('express');
const jwt = require('jsonwebtoken')
var bodyParser = require('body-parser');
const cors = require('cors')
const port = 3000
var mysql = require('mysql');
const fs = require('fs');
const crypto = require('crypto');

require('dotenv').config();

// crée un fichier .env si il n'existe pas
if (!fs.existsSync('.env')) {
  fs.appendFile('.env', `SECRET_TOKEN=${crypto.randomBytes(64).toString('hex')}\nSECRET_TOKEN_MDP=${crypto.randomBytes(64).toString('hex')}`, function (err) {
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

    const hash = crypto.createHmac('sha512', process.env.SECRET_TOKEN_MDP)
    hash.update("test");
    const test = hash.digest('hex').toString()
    res.send(test);
})

app.get('/api/test', function (req, res) {
  res.json({test: "test"});
})

app.post('/api/connexion', async function(req, res) {
  const users = await getUsers();
  const user = users.find(u => u.nom == req.body.username && u.mdp == hash(req.body.password.toString()));
  if (!user) {
    return res.status(400).json({message: `le nom d'utilisateur ou le mot de passe sont incorrect`})
  }
  const token = jwt.sign({username: req.body.username}, process.env.SECRET_TOKEN, { expiresIn: '24h' });
  return res.send({token: token})
})

app.post('/api/inscription', async function(req, res) {
  const users = await getUsers();
  const user = users.find(u => u.nom == req.body.username);
  if (user) {
    res.status(400).json({message: `L'utilisateur ${req.body.username} existe déjà`})
  }

  await setUser(req.body.username, req.body.password)
  .then(
    () => {
      const token = jwt.sign({username: req.body.username}, process.env.SECRET_TOKEN, { expiresIn: '24h' });
      res.send({message: `Le compte ${req.body.username} à était créé avec succès`, token: token});
    }
  )
  .catch(
    err => {
      res.status(400).json({message: `erreur : ${err}`});
    } 
  );
})

app.get('/api/compte', authenticateToken, function(req, res) {
  const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
  const decoded = jwt.decode(token, { complete: false })
  res.json({content: decoded})
})

// verifie le token de l'utilisateur
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json({message: 'Erreur : token manquant'})

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) return res.status(403).json({message: `Erreur : ${err}`})
    req.user = user
    next()
  })
}

function extractBearerToken(headerValue) {
  if (typeof headerValue !== 'string') {
    return false
}

const matches = headerValue.match(/(bearer)\s+(\S+)/i)
return matches && matches[2]
}

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
    sql.query(`INSERT INTO user(nom, mdp) VALUES ('${nom}','${hash(mdp.toString())}')`, function (err) {
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

app.listen(port, () => {
  console.log(`-Local: http://localhost:${port}/\n-Network: http://${os.networkInterfaces()['VMware Network Adapter VMnet8'][1].address}:${port}/`);  
})