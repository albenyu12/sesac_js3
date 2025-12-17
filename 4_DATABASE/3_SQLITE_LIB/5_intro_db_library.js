const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('simple.db');

function runQuery(query) {
    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if(err) {
                return reject(err);
            }
            resolve(this); 
        })
    })
}

function allQuery(query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if(err) {
                return reject(err);
            }
            resolve(rows); 
        })
    })
}

module.exports = {
    runQuery, 
    allQuery
}