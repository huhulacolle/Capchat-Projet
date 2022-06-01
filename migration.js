const fs = require('fs');
const crypto = require('crypto'); 

// crée un fichier .env si il n'existe pas
if (fs.existsSync('.env')) {
    fs.appendFile('.env', `
SECRET_TOKEN=${crypto.randomBytes(64).toString('hex')}
SECRET_TOKEN_MDP=${crypto.randomBytes(64).toString('hex')}`, function(err) {
        if (err) throw err;
    });
}
else {
    console.log("Fichier .env non trouvé, merci de le créer en se basant sur le fichier .env.example");
    process.exit();
}

const host = process.env.SQL_HOST;
const user = process.env.SQL_USER;
const password = process.env.SQL_PASSWORD;
const database = process.env.SQL_DATABASE;

const Importer = require('mysql-import');
const importer = new Importer({
    host,
    user,
    password,
    database
});

// New onProgress method, added in version 5.0!
importer.onProgress(progress => {
    var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
    console.log(`${percent}% Completed`);
});

importer.import('./SQL/capchat.sql').then(() => {
    var files_imported = importer.getImported();
    console.log(`${files_imported.length} SQL file(s) imported.`);
}).catch(err => {
    console.error(err);
});