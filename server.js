var express = require('express');
const jwt = require('jsonwebtoken')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const port = 3000
var mysql = require('mysql');
const crypto = require('crypto');
var AdmZip = require("adm-zip");
const fs = require('fs');
require('dotenv').config();

var app = express();
app.use(cors());
// Express intègre le body-parser depuis la version 4.16, pour l'utiliser il suffit d'appelé la méthode express.json()
app.use(express.json())
app.use(fileUpload());

var sql = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    multipleStatements: true
});

function convertBuffObjectToString(data) {
    for (let i = 0; i < data.length; i++) {
        data[i].img = data[i].img.toString();
    }
    return data
}

// verifie le token de l'utilisateur
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({
        message: 'Erreur : token manquant'
    })

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        if (err) return res.status(403).json({
            message: `Erreur : ${err}`
        })
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

app.post('/api/connexion', async function(req, res) {
    const users = await getUsers();
    const user = users.find(u => u.nom == req.body.username && u.mdp == hash(req.body.password.toString()));
    if (!user) {
        return res.status(400).json({
            message: `le nom d'utilisateur ou le mot de passe sont incorrect`
        })
    }
    const token = jwt.sign({id: user.id, username: req.body.username, admin: user.admin }, process.env.SECRET_TOKEN, { expiresIn: '12h' });
    return res.send({ token: token })
})

app.post('/api/inscription', async function(req, res) {
    const users = await getUsers();
    const user = users.find(u => u.nom == req.body.username);
    if (user) {
        return res.status(400).json({
            message: `L'utilisateur ${req.body.username} existe déjà`
        })
    }

    await setUser(req.body.username, req.body.password)
        .then(
            data => {
                const token = jwt.sign({id: data.insertId ,username: req.body.username, admin: 0 }, process.env.SECRET_TOKEN, { expiresIn: '12h' });
                res.send({
                    message: `Le compte ${req.body.username} à été créé avec succès`,
                    token: token
                });
            }
        )
        .catch(
            err => {
                return res.status(400).json({
                    message: `erreur : ${err}`
                });
            }
        );
})

app.get('/api/compte', authenticateToken, function(req, res) {
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
    const decoded = jwt.decode(token, {
        complete: false
    })
    res.json({
        content: decoded
    })
})

function getIdUser(req) {
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
    const decoded = jwt.decode(token, {
        complete: false
    })
    return decoded
}


function getUsers() {
    return new Promise((resolve, reject) => {
        sql.query('SELECT id, nom, mdp, admin FROM artiste', function (err, rows) {
            if (err) return reject(err)
            return resolve(rows);
        })
    })
}

function setUser(nom, mdp) {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO artiste(nom, mdp) VALUES ('${nom}','${hash(mdp.toString())}')`, function (err, rows) {
            if (err) return reject(err);
            return resolve(rows);
        })
    })
}

app.get('/api/getArtistes', authenticateToken, async function(req, res) {
    const decoded = getIdUser(req);
    if (!decoded.admin) {
        return res.status(403).end();
    }
    await getArtistes()
    .then(
        data => {
            return res.json(data);
        }
    )
    .catch(
        err => {
            return res.status(400).json(err);
        }
    )

})

app.delete('/api/deleteArtiste/:id', authenticateToken, async function(req, res) {
    const decoded = getIdUser(req);
    if (!decoded.admin) {
        return res.status(403).end();
    }
    await deleteArtiste(req.params.id)
    .then(
        () => {
            res.end();
        }
    )
    .catch(
        err => {
            res.status(400).json(err);
        }
    )
})

function getArtistes() {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM artiste WHERE admin = 0 ORDER BY id DESC`, function(err, rows) {
            if (err) return reject(err);
            return resolve(rows);
        })
    })
}

function deleteArtiste(id) {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM artiste WHERE id = ${id} AND admin = 0`, function(err) {
            if (err) return reject(err);
            return resolve();
        })
    })
}

app.get('/api/Capchat/:idJeu', async function(req, res) {
    await getCapchat(req.params.idJeu)
    .then(
        data => {
            const reponse = convertBuffObjectToString(data[0]);
            const imageSing = convertBuffObjectToString(data[1]);
            reponse[Math.floor(Math.random() * 8)] = imageSing[0];
            
            for (let i = 0; i < reponse.length; i++) {
                reponse[i].ordre = i + 1              
            }
            res.json(reponse);
        }
    )
    .catch(
        err => {
            res.status(400).json(err);
        }
    )
})

function getCapchat(idJeu) {
    return new Promise((resolve, reject) => {
        sql.query(`
        SELECT img, format, TexteQuestion, ImageSinguliere FROM image WHERE idJeu = ${idJeu} AND imageSinguliere = 0 ORDER BY RAND() LIMIT 9;
        SELECT img, format, TexteQuestion, ImageSinguliere FROM image WHERE idJeu = ${idJeu} AND imageSinguliere = 1 ORDER BY RAND() LIMIT 1;
        `, function(err, rows) {
            if (err) return reject(err)
            return resolve(rows);
        })
    })
}

app.get('/api/getListJeu', authenticateToken, async function(req, res) {
    const decoded = getIdUser(req);
    await getListJeu(decoded.id)
    .then(
        data => {
            res.json(data)
        }
    )
    .catch(
        err => {
            res.status(400).json(err);
        }
    )
})

app.get('/api/getJeu', authenticateToken, async function(req, res) {
    const decoded = getIdUser(req);
    await getJeu(decoded.id, decoded.admin)
    .then(
        data => {
            return res.json(data)
        }
    )
    .catch(
        err => {
            return res.status(400).json(err)
        }
    )
})

app.post('/api/sendJeu', authenticateToken, async function(req, res) {
    const decoded = getIdUser(req)
    await setJeu(req.body.nom, decoded.id, req.body.theme)
    .then(
        () => {
            return res.status(200).end();
        }
    )
    .catch(
        err => {
            return res.status(400).json(err);
        }
    )
})

app.delete('/api/deleteJeu/:id', authenticateToken, async function(req, res) {
    await deleteJeu(req.params.id)
    .then(
        () => {
            return res.status(200).end();
        }
    )
    .catch(
        err => {
            return res.status(400).json(err)
        }
    )
})

function getListJeu(id) {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT id, nom FROM jeu WHERE idArtiste = ${id}`, function(err, rows) {
            if (err) return reject(err);
            return resolve(rows);
        })
    })
}

function getJeu(id, admin) {
    return new Promise((resolve, reject) => {
        if (!admin) {
            sql.query(
                `SELECT jeu.id AS id, jeu.nom AS jeu, theme.nom AS theme
                FROM jeu 
                INNER JOIN theme ON jeu.IdTheme = theme.id 
                WHERE jeu.IdArtiste = ${id} 
                ORDER BY jeu.id DESC`,
                function (err, rows) {
                    if (err) return reject(err);
                    return resolve(rows);
                })
        }
        else {
            sql.query(
                `SELECT jeu.id AS id, jeu.nom AS jeu, theme.nom AS theme, artiste.nom AS nom
                FROM jeu 
                INNER JOIN artiste ON jeu.IdArtiste = artiste.id
                INNER JOIN theme ON jeu.IdTheme = theme.id 
                ORDER BY jeu.id DESC`,
                function (err, rows) {
                    if (err) return reject(err);
                    return resolve(rows);
                })
        }

    })
}

function setJeu(nom, artiste, theme) {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO jeu (nom, idArtiste, idTheme) VALUES ('${nom}', ${artiste}, ${theme})`, function(err) {
            if (err) return reject(err);
            return resolve();
        })
    })
}

function deleteJeu(id) {
    return new Promise((resolve, reject) => {
        sql.query(`
        DELETE FROM image WHERE idJeu = ${id};
        DELETE FROM jeu WHERE jeu.id = ${id};`, function(err) {
            if (err) return reject(err);
            return resolve();
        })
    })
}

app.get('/api/getDessin/:idJeu', authenticateToken, async function(req, res) {
    await getDessin(req.params.idJeu)
    .then(
        data => {
            const reponse = convertBuffObjectToString(data);
            res.json(reponse);
        }
    )
    .catch(
        err => {
            return res.status(400).json(err);
        }
    )
})

app.post('/api/setDessin', authenticateToken, async function(req, res) {
    if (!req.files) {
        return res.status(400).end();
    }
    const dessin = req.files.dessin.data.toString('base64');
    await setDessin(dessin, req.files.dessin.mimetype, req.body.texteQuestion, req.body.imageSinguliere, req.body.idJeu)
    .then(
        () => {
            return res.status(200).end();
        }
    )
    .catch(
        err => {
            return res.status(400).json(err);
        }
    )
})

app.delete('/api/deleteDessin/:id', authenticateToken, async function(req, res) {
    await deleteDessin(req.params.id)
    .then(
        () => {
            return res.status(200).end();
        }
    )
    .catch(
        err => {
            return res.status(400).json(err);
        }
    )
})

app.get('/api/downloadDessin/:idJeu', async function(req, res) {
    var zip = new AdmZip();
    const dessin = convertBuffObjectToString(await getDessin(req.params.idJeu));
    for (let i = 0; i < dessin.length; i++) {
        zip.addFile(i + "." + dessin[i].format.split('/')[1], Buffer.from(dessin[i].img, 'base64'))
    }
    var willSendthis = zip.toBuffer();
    res.json("c'est bon")
})

function getDessin(idJeu) {
    return new Promise((resolve, reject) => {
        sql.query(`
            SELECT image.id AS id, img, format, TexteQuestion, ImageSinguliere, IdJeu FROM image 
            INNER JOIN jeu ON image.IdJeu = jeu.id
            AND IdJeu = ${idJeu}
            ORDER BY image.id DESC
        `, function(err, rows) {
            if (err) return reject(err);
            return resolve(rows);
        })
    })
}

function setDessin(img, format, TexteQuestion, ImageSinguliere, idJeu) {
    return new Promise((resolve, reject) => {
        sql.query(`
            INSERT INTO image (img, format, TexteQuestion, ImageSinguliere, IdJeu) 
            VALUES ('${img}', '${format}', "${TexteQuestion}", ${ImageSinguliere}, ${idJeu})
            `, function (err,) {
            if (err) return reject(err);
            return resolve();
        })
    })
}

function deleteDessin(id) {
    return new Promise((resolve, reject) => {
        sql.query(`
            DELETE FROM image WHERE id = ${id}
        `, function(err) {
            if(err) return reject(err);
            return resolve();
        })
    })
}

app.get('/api/themes', authenticateToken, async function(req, res) {
    await getThemes()
    .then(
        data => {
            return res.json(data);
        }
    )
    .catch(
        err => {
            return res.status(400).json(err);
        }
    )
})

function getThemes() {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM theme', function(err, rows) {
            if (err) reject(err);
            return resolve(rows);
        })
    })
}


app.post('/api/testsendimg', authenticateToken, async function(req, res) {
    if (!req.files) {
        return res.status(400).end();
    }
    await setImg(req.files.img.data.toString('base64'), req.files.img.mimetype)
        .then(
            () => {
                return res.status(200).end();
            }
        )
        .catch(
            err => {
                return res.status(400).json({
                    message: `erreur : ${err}`
                })
            }
        )
})

app.get('/api/testgetimg', authenticateToken, async function(req, res) {
    await getImg()
        .then(
            data => {
                const reponse = convertBuffObjectToString(data);
                res.json(reponse);
            }
        )
        .catch(
            err => {
                return res.status(400).json(err);
            }
        )
})

function setImg(img, format) {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO testimg (img, format) VALUES ('${img}', '${format}')`, function (err,) {
            if (err) return reject(err);
            return resolve();
        })
    })
}

function getImg() {
    return new Promise((resolve, reject) => {
        sql.query('SELECT * FROM testimg ORDER BY id DESC', function (err, rows) {
            if (err) return reject(err);
            return resolve(rows)
        })
    })
}

function hash(mdp) {
    return crypto.createHmac('sha512', process.env.SECRET_TOKEN_MDP).update(mdp).digest('hex').toString();
}

app.listen(port, () => {
    var address,
        ifaces = require('os').networkInterfaces();
    for (var dev in ifaces) {
        ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? address = details.address : undefined);
    }
    console.log(`-Local: http://localhost:${port}/\n-Network: http://${address}:${port}/`);
})