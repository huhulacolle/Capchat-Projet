const fs = require('fs');
const crypto = require('crypto');

fs.appendFile('.env', `SECRET_TOKEN=${crypto.randomBytes(64).toString('hex')}
SECRET_TOKEN_MDP=${crypto.randomBytes(64).toString('hex')}
SQL_HOST=127.0.0.1
SQL_USER=root
SQL_PASSWORD=
SQL_DATABASE=Capchat`, function (err) {
    if (err) throw err;
});
