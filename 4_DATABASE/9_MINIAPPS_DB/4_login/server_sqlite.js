const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express() ;
const PORT = 3000;
const db = new sqlite3.Database('user.db');

function init_db() {
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
        const insertStm = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        insertStm.run('user1', 'pw1');
        insertStm.run('user2', 'pw2');
        insertStm.run('user3', 'pw3');
    });
}

init_db();

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

app.post('/login', (req, res) => {
    const { username, password }= req.body;

    // SQL 인젝션의 취약점이 되니 이렇게 하지 말 것!!
    // const queryStrBAD = `SELECT * FROM users WHERE username=${username} AND password=${password}`;
    // 1. 비밀번호칸: ' OR 1=1 --
    // 2. 아이디칸: user2'--
    const queryStr = 'SELECT * FROM users WHERE username=? AND password=?'

    // db.get(queryStrBAD, (err, row) => {
    db.get(queryStr, [username, password], (err, row) => {
        console.log('쿼리결과: ', row);
        if (row) {
            res.send('로그인 성공');
        } else {
            res.send('로그인 실패');
        }
    })
});

app.listen(PORT, ()=> {
    console.log('서버 레디...');
})