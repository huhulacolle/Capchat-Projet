const host = '127.0.0.1';
const user = 'root';
const password = '';
const database = 'CapchatTest';

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