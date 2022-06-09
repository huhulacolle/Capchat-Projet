var mysql = require('mysql');
const crypto = require('crypto');
require('dotenv').config();

var sql = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    multipleStatements: true
});

sql.query(`INSERT INTO artiste(nom, mdp, admin) VALUES ('admin','${hash('123')}', 1)`, function (err) {
    if (err) console.log(err);
    process.exit(1);
})

function hash(mdp) {
    return crypto.createHmac('sha512', process.env.SECRET_TOKEN_MDP).update(mdp).digest('hex').toString();
}